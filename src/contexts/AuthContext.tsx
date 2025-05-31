
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  currentPhase: number;
  completedPhases: number[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  socialLogin: (provider: 'google' | 'facebook' | 'github') => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateUserPhase: (phase: number) => void;
  upgradeToPremium: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('mentorAI_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        isPremium: false,
        currentPhase: 1,
        completedPhases: []
      };
      
      setUser(newUser);
      localStorage.setItem('mentorAI_user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: '1',
        email,
        name,
        isPremium: false,
        currentPhase: 1,
        completedPhases: []
      };
      
      setUser(newUser);
      localStorage.setItem('mentorAI_user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = async (provider: 'google' | 'facebook' | 'github') => {
    setLoading(true);
    try {
      // Simulate social login API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: User = {
        id: '1',
        email: `user@${provider}.com`,
        name: `User from ${provider}`,
        isPremium: false,
        currentPhase: 1,
        completedPhases: []
      };
      
      setUser(newUser);
      localStorage.setItem('mentorAI_user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error(`${provider} login failed`);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mentorAI_user');
  };

  const updateUserPhase = (phase: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        currentPhase: phase,
        completedPhases: [...user.completedPhases, phase - 1].filter((p, i, arr) => arr.indexOf(p) === i && p > 0)
      };
      setUser(updatedUser);
      localStorage.setItem('mentorAI_user', JSON.stringify(updatedUser));
    }
  };

  const upgradeToPremium = async () => {
    if (user) {
      const updatedUser = { ...user, isPremium: true };
      setUser(updatedUser);
      localStorage.setItem('mentorAI_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      socialLogin,
      logout,
      loading,
      updateUserPhase,
      upgradeToPremium
    }}>
      {children}
    </AuthContext.Provider>
  );
};
