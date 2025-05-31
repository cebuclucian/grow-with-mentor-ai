
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Brain, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const AssessmentPage: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateUserPhase } = useAuth();
  const navigate = useNavigate();

  const skills = [
    { value: 'communication', label: 'Communication' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'teamwork', label: 'Teamwork' },
    { value: 'problem-solving', label: 'Problem Solving' },
    { value: 'time-management', label: 'Time Management' },
    { value: 'emotional-intelligence', label: 'Emotional Intelligence' },
    { value: 'adaptability', label: 'Adaptability' },
    { value: 'conflict-resolution', label: 'Conflict Resolution' }
  ];

  const situationalQuestions = {
    communication: "Describe a situation where you had to communicate complex information to a colleague or client who wasn't familiar with the technical details. How did you approach this, and what was the outcome?",
    leadership: "Tell me about a time when you had to lead a team through a challenging project or situation. What obstacles did you face, and how did you motivate your team to achieve the goal?",
    teamwork: "Describe a situation where you had to work with a difficult team member or in a dysfunctional team environment. How did you handle it, and what did you learn?",
    'problem-solving': "Share an example of a complex problem you encountered at work. Walk me through your problem-solving process and explain how you arrived at your solution.",
    'time-management': "Describe a time when you had multiple competing deadlines or priorities. How did you manage your time and ensure all tasks were completed effectively?",
    'emotional-intelligence': "Tell me about a situation where you had to manage your emotions or help someone else manage theirs in a professional setting. What was your approach?",
    adaptability: "Describe a significant change in your workplace (new system, process, or structure). How did you adapt, and what challenges did you face?",
    'conflict-resolution': "Share an example of a workplace conflict you were involved in or helped resolve. What was your approach, and what was the outcome?"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSkill || !response.trim()) {
      toast.error('Please select a skill and provide your response.');
      return;
    }

    if (response.trim().length < 100) {
      toast.error('Please provide a more detailed response (at least 100 characters).');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store assessment data
      localStorage.setItem('assessmentData', JSON.stringify({
        skill: selectedSkill,
        response: response.trim(),
        timestamp: new Date().toISOString()
      }));
      
      // Update user phase
      updateUserPhase(2);
      
      toast.success('Assessment completed! Analyzing your response...');
      navigate('/results');
    } catch (error) {
      toast.error('Failed to submit assessment. Please try again.');
    } finally {
      setLoading(false);
    }
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
              <Brain className="h-6 w-6 text-professional-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-professional-grey-900">AI-Powered Assessment</h1>
              <p className="text-professional-grey-600">Phase 1 of your professional development journey</p>
            </div>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Skill Assessment</CardTitle>
            <CardDescription>
              Choose a skill you'd like to develop and respond to our situational question. 
              Our AI will analyze your response to provide personalized insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Skill Selection */}
              <div className="space-y-2">
                <Label htmlFor="skill">Select the skill you want to develop</Label>
                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a skill to focus on" />
                  </SelectTrigger>
                  <SelectContent>
                    {skills.map((skill) => (
                      <SelectItem key={skill.value} value={skill.value}>
                        {skill.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Situational Question */}
              {selectedSkill && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 bg-professional-blue-50 rounded-lg">
                    <h3 className="font-semibold text-professional-grey-900 mb-2">
                      Situational Question for {skills.find(s => s.value === selectedSkill)?.label}
                    </h3>
                    <p className="text-professional-grey-700">
                      {situationalQuestions[selectedSkill as keyof typeof situationalQuestions]}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="response">Your Response</Label>
                    <Textarea
                      id="response"
                      placeholder="Provide a detailed response to the situation above. Be specific about your actions, thought process, and the outcomes."
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      className="min-h-[200px]"
                      required
                    />
                    <p className="text-sm text-professional-grey-500">
                      {response.length}/500 characters (minimum 100)
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="btn-growth px-8"
                  disabled={loading || !selectedSkill || response.length < 100}
                >
                  {loading ? (
                    'Analyzing...'
                  ) : (
                    <>
                      Submit Assessment <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Assessment Tips */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-professional-grey-900 mb-3">Tips for a Better Assessment</h3>
            <ul className="space-y-2 text-professional-grey-700">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-growth-teal-500 rounded-full mt-2 flex-shrink-0"></span>
                Be specific and detailed in your response
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-growth-teal-500 rounded-full mt-2 flex-shrink-0"></span>
                Include what you learned from the experience
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-growth-teal-500 rounded-full mt-2 flex-shrink-0"></span>
                Describe both your actions and your thought process
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-growth-teal-500 rounded-full mt-2 flex-shrink-0"></span>
                Focus on real situations rather than hypothetical scenarios
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentPage;
