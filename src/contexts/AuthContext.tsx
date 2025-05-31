import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';

interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  currentPhase: number;
  completedPhases: number[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  socialLogin: (provider: 'google' | 'facebook' | 'github') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const supabaseUser = data.session.user;
        const currentUser: User = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || '',
          isPremium: false,
          currentPhase: 1,
          completedPhases: []
        };
        setUser(currentUser);
      }
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const supabaseUser = session.user;
        const currentUser: User = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || '',
          isPremium: false,
          currentPhase: 1,
          completedPhases: []
        };
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        const currentUser: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || '',
          isPremium: false,
          currentPhase: 1,
          completedPhases: []
        };
        setUser(currentUser);
      }
    } catch (error) {
      throw new Error('Login failed: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }
        }
      });
      if (error) throw error;
      if (data.user) {
        const currentUser: User = {
          id: data.user.id,
          email: data.user.email || '',
          name,
          isPremium: false,
          currentPhase: 1,
          completedPhases: []
        };
        setUser(currentUser);
      }
    } catch (error) {
      throw new Error('Signup failed: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = async (provider: 'google' | 'facebook' | 'github') => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;
      // The user will be redirected to the provider's login page
    } catch (error) {
      throw new Error(`${provider} login failed: ` + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, socialLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
