
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CheckCircle, 
  Lock, 
  ArrowRight, 
  Brain, 
  Target, 
  TrendingUp, 
  Star,
  Clock
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, updateUserPhase } = useAuth();
  const navigate = useNavigate();

  const phases = [
    {
      id: 1,
      title: 'AI-Powered Assessment',
      description: 'Take our comprehensive assessment to identify your unique strengths and growth areas.',
      icon: Brain,
      status: user?.completedPhases.includes(1) ? 'completed' : user?.currentPhase === 1 ? 'active' : 'locked',
      isPremium: false,
      path: '/assessment'
    },
    {
      id: 2,
      title: 'Assessment Results',
      description: 'Review your personalized results and insights from the AI analysis.',
      icon: Target,
      status: user?.completedPhases.includes(2) ? 'completed' : 
              user?.completedPhases.includes(1) && user?.currentPhase === 2 ? 'active' : 'locked',
      isPremium: false,
      path: '/results'
    },
    {
      id: 3,
      title: 'Personalized Learning Path',
      description: 'Get your customized learning journey tailored to your specific needs and goals.',
      icon: TrendingUp,
      status: user?.completedPhases.includes(3) ? 'completed' : 
              user?.completedPhases.includes(2) && user?.currentPhase === 3 ? 'active' : 'locked',
      isPremium: true,
      path: '/learning-path'
    }
  ];

  const handlePhaseClick = (phase: any) => {
    if (phase.status === 'locked') return;
    
    if (phase.isPremium && !user?.isPremium) {
      // Show upgrade prompt
      return;
    }
    
    if (phase.status === 'active') {
      navigate(phase.path);
    }
  };

  const overallProgress = user ? (user.completedPhases.length / phases.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-professional-grey-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-professional-grey-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-lg text-professional-grey-600">
            Continue your professional development journey
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-growth-teal-500" />
              Your Progress
            </CardTitle>
            <CardDescription>
              You've completed {user?.completedPhases.length || 0} out of {phases.length} phases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Subscription Status */}
        <Card className={`mb-8 ${user?.isPremium ? 'border-growth-teal-200 bg-growth-teal-50' : 'border-professional-blue-200 bg-professional-blue-50'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  user?.isPremium ? 'bg-growth-teal-500' : 'bg-professional-blue-500'
                }`}>
                  {user?.isPremium ? (
                    <Star className="h-5 w-5 text-white" />
                  ) : (
                    <Clock className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-professional-grey-900">
                    {user?.isPremium ? 'Premium Member' : 'Free Member'}
                  </h3>
                  <p className="text-sm text-professional-grey-600">
                    {user?.isPremium 
                      ? 'Enjoy unlimited access to all features' 
                      : 'Upgrade to unlock personalized learning paths'}
                  </p>
                </div>
              </div>
              {!user?.isPremium && (
                <Button className="btn-growth">
                  Upgrade to Premium
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Journey Phases */}
        <div className="grid gap-6">
          <h2 className="text-2xl font-bold text-professional-grey-900">Your Learning Journey</h2>
          
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            const isLocked = phase.status === 'locked';
            const isActive = phase.status === 'active';
            const isCompleted = phase.status === 'completed';
            const needsPremium = phase.isPremium && !user?.isPremium;

            return (
              <Card 
                key={phase.id} 
                className={`
                  ${isCompleted ? 'phase-card completed' : ''}
                  ${isActive ? 'phase-card active' : ''}
                  ${isLocked ? 'phase-card locked' : ''}
                  ${!isLocked && !needsPremium ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed'}
                  transition-all duration-200
                `}
                onClick={() => !isLocked && !needsPremium && handlePhaseClick(phase)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`
                        w-12 h-12 rounded-lg flex items-center justify-center
                        ${isCompleted ? 'bg-growth-teal-100' : 
                          isActive ? 'bg-professional-blue-100' : 
                          'bg-professional-grey-100'}
                      `}>
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-growth-teal-600" />
                        ) : isLocked ? (
                          <Lock className="h-6 w-6 text-professional-grey-400" />
                        ) : (
                          <Icon className={`h-6 w-6 ${
                            isActive ? 'text-professional-blue-600' : 'text-professional-grey-600'
                          }`} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`text-lg font-semibold ${
                            isLocked ? 'text-professional-grey-400' : 'text-professional-grey-900'
                          }`}>
                            Phase {phase.id}: {phase.title}
                          </h3>
                          {phase.isPremium && (
                            <span className="text-xs bg-professional-blue-100 text-professional-blue-800 px-2 py-1 rounded">
                              Premium
                            </span>
                          )}
                        </div>
                        <p className={`${
                          isLocked ? 'text-professional-grey-400' : 'text-professional-grey-600'
                        }`}>
                          {phase.description}
                        </p>
                        
                        {needsPremium && (
                          <div className="mt-3 p-3 bg-professional-blue-50 rounded-lg">
                            <p className="text-sm text-professional-blue-700 mb-2">
                              Upgrade to Premium to unlock this phase
                            </p>
                            <Button size="sm" className="btn-growth">
                              Upgrade Now
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {isActive && !needsPremium && (
                      <Button className="btn-growth ml-4">
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
