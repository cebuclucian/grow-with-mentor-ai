
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  CreditCard, 
  Settings,
  Star,
  Clock
} from 'lucide-react';

const AccountPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-professional-grey-50 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-professional-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="h-6 w-6 text-professional-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-professional-grey-900">Account Settings</h1>
              <p className="text-professional-grey-600">Manage your profile and subscription</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-professional-grey-700">Full Name</label>
                <p className="text-professional-grey-900">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-professional-grey-700">Email Address</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-professional-grey-400" />
                  <p className="text-professional-grey-900">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <Button variant="outline">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription & Billing
            </CardTitle>
            <CardDescription>
              Manage your subscription and billing information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Current Plan */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-professional-grey-900">Current Plan</h3>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      user?.isPremium 
                        ? 'bg-growth-teal-100 text-growth-teal-800' 
                        : 'bg-professional-grey-100 text-professional-grey-800'
                    }`}
                  >
                    {user?.isPremium ? (
                      <><Star className="h-3 w-3 mr-1" /> Premium</>
                    ) : (
                      <><Clock className="h-3 w-3 mr-1" /> Free</>
                    )}
                  </Badge>
                </div>
                
                {user?.isPremium ? (
                  <div className="p-4 bg-growth-teal-50 rounded-lg border border-growth-teal-200">
                    <h4 className="font-medium text-growth-teal-900 mb-2">Premium Plan - $29/month</h4>
                    <p className="text-sm text-growth-teal-700 mb-3">
                      You have access to all premium features including personalized learning paths and advanced analytics.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-growth-teal-600">
                      <Calendar className="h-4 w-4" />
                      <span>Next billing date: January 15, 2024</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-professional-blue-50 rounded-lg border border-professional-blue-200">
                    <h4 className="font-medium text-professional-blue-900 mb-2">Free Plan</h4>
                    <p className="text-sm text-professional-blue-700 mb-3">
                      You have access to basic features. Upgrade to Premium for personalized learning paths and advanced features.
                    </p>
                    <Button className="btn-growth">
                      Upgrade to Premium
                    </Button>
                  </div>
                )}
              </div>

              {/* Billing Management */}
              {user?.isPremium && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-professional-grey-900">Billing Management</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline">
                      Update Payment Method
                    </Button>
                    <Button variant="outline">
                      Download Invoices
                    </Button>
                    <Button variant="outline">
                      Manage Subscription
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Learning Progress */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>
              Your journey through the MentorAI program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-growth-teal-600 mb-1">
                  {user?.completedPhases.length || 0}
                </div>
                <div className="text-sm text-professional-grey-600">Phases Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-professional-blue-600 mb-1">
                  {user?.currentPhase || 1}
                </div>
                <div className="text-sm text-professional-grey-600">Current Phase</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-professional-grey-600 mb-1">
                  {Math.round(((user?.completedPhases.length || 0) / 3) * 100)}%
                </div>
                <div className="text-sm text-professional-grey-600">Journey Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Privacy Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Notification Preferences
              </Button>
              <div className="pt-4 border-t">
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                  className="w-full"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountPage;
