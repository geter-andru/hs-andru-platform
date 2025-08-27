import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle, Clock, Target, Users, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { advancedPersonalizationService } from '../../services/advancedPersonalizationService';

const AdvancedOnboardingFlow = ({ assessmentData, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [personalization, setPersonalization] = useState(null);
  const [onboardingData, setOnboardingData] = useState({
    teamSize: '',
    urgentGoals: [],
    preferredTools: [],
    timeline: '30-days'
  });

  useEffect(() => {
    if (assessmentData) {
      const personalizedExp = advancedPersonalizationService.generatePersonalizedExperience(assessmentData);
      setPersonalization(personalizedExp);
    }
  }, [assessmentData]);

  const onboardingSteps = personalization ? [
    {
      id: 'welcome',
      title: 'Welcome to Revenue Intelligence',
      subtitle: `Personalized for ${assessmentData.productName}`,
      component: WelcomeStep,
      estimatedTime: '30 seconds',
      critical: true
    },
    {
      id: 'urgency-assessment',
      title: 'Prioritize Your Action Plan', 
      subtitle: `Based on ${assessmentData.challenges} identified gaps`,
      component: UrgencyStep,
      estimatedTime: '2 minutes',
      critical: true
    },
    {
      id: 'team-setup',
      title: 'Configure Team Access',
      subtitle: 'Set up stakeholder sharing and collaboration',
      component: TeamStep,
      estimatedTime: '3 minutes',
      critical: false
    },
    {
      id: 'success-pathway',
      title: 'Your 90-Day Success Plan',
      subtitle: 'Personalized implementation roadmap',
      component: PathwayStep,
      estimatedTime: '2 minutes',
      critical: true
    },
    {
      id: 'quick-wins',
      title: 'Immediate Quick Wins',
      subtitle: 'Actions you can take in the next 24 hours',
      component: QuickWinsStep,
      estimatedTime: '1 minute',
      critical: true
    }
  ] : [];

  const completeStep = (stepId, data = {}) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    setOnboardingData(prev => ({ ...prev, ...data }));
    
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const WelcomeStep = ({ onComplete }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto">
        <Zap className="w-10 h-10 text-white" />
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold text-white mb-3">
          {personalization.messaging.welcome.headline}
        </h2>
        <p className="text-gray-400 leading-relaxed">
          {personalization.messaging.welcome.subtext}
        </p>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <h3 className="font-medium text-white mb-3">Your Assessment Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-mono text-cyan-400">{assessmentData.score}</div>
            <div className="text-xs text-gray-400">Overall Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono text-red-400">{assessmentData.challenges}</div>
            <div className="text-xs text-gray-400">Critical Gaps</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono text-green-400">
              {Math.round(((assessmentData.score * 50000 / 12) * 0.15 / 10) / 497 * 100)}%
            </div>
            <div className="text-xs text-gray-400">ROI Potential</div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onComplete('welcome', {})}
        className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
      >
        <span>Let's Get Started</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );

  const UrgencyStep = ({ onComplete }) => {
    const [selectedGoals, setSelectedGoals] = useState([]);
    
    const urgentGoals = personalization.toolRecommendations.map(rec => ({
      id: rec.tool.toLowerCase().replace(/ /g, '-'),
      title: rec.tool,
      urgency: rec.urgency,
      impact: rec.expectedImpact,
      timeline: rec.timeToValue
    }));

    const toggleGoal = (goalId) => {
      setSelectedGoals(prev => 
        prev.includes(goalId) 
          ? prev.filter(id => id !== goalId)
          : [...prev, goalId]
      );
    };

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-3">
            Prioritize Your Action Plan
          </h2>
          <p className="text-gray-400">
            Select your most urgent goals to customize your experience
          </p>
        </div>

        <div className="space-y-3">
          {urgentGoals.map((goal) => (
            <div
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedGoals.includes(goal.id)
                  ? 'bg-cyan-500/20 border-cyan-500 text-white'
                  : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{goal.title}</h4>
                  <p className="text-sm opacity-80">{goal.impact}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded ${
                    goal.urgency === 'immediate' ? 'bg-red-500/20 text-red-300' :
                    goal.urgency === 'high' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {goal.urgency}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{goal.timeline}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => onComplete('urgency-assessment', { urgentGoals: selectedGoals })}
          disabled={selectedGoals.length === 0}
          className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
        >
          Continue with {selectedGoals.length} Priorities
        </button>
      </motion.div>
    );
  };

  const TeamStep = ({ onComplete }) => {
    const [teamData, setTeamData] = useState({
      size: '',
      roles: [],
      collaborationStyle: 'async'
    });

    const teamRoles = [
      'CEO/Founder', 'CTO', 'VP Sales', 'Head of Marketing', 
      'Head of Product', 'VP Engineering', 'Head of Customer Success'
    ];

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-3">
            Configure Team Access
          </h2>
          <p className="text-gray-400">
            Set up sharing and collaboration for your stakeholders
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Team Size</label>
          <select
            value={teamData.size}
            onChange={(e) => setTeamData(prev => ({ ...prev, size: e.target.value }))}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="">Select team size</option>
            <option value="1-5">1-5 people</option>
            <option value="6-15">6-15 people</option>
            <option value="16-50">16-50 people</option>
            <option value="50+">50+ people</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-3">Key Stakeholders</label>
          <div className="grid grid-cols-2 gap-2">
            {teamRoles.map((role) => (
              <label key={role} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={teamData.roles.includes(role)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTeamData(prev => ({ ...prev, roles: [...prev.roles, role] }));
                    } else {
                      setTeamData(prev => ({ ...prev, roles: prev.roles.filter(r => r !== role) }));
                    }
                  }}
                  className="rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-gray-300 text-sm">{role}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={() => onComplete('team-setup', teamData)}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg transition-colors"
        >
          Configure Team Access
        </button>
      </motion.div>
    );
  };

  const PathwayStep = ({ onComplete }) => {
    const pathway = personalization.successPathway;
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-3">
            Your 90-Day Success Pathway
          </h2>
          <p className="text-gray-400">
            Personalized implementation roadmap based on your assessment
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <h3 className="font-medium text-red-300 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Immediate (0-7 days)
            </h3>
            <ul className="space-y-1">
              {pathway.immediate.map((item, i) => (
                <li key={i} className="text-gray-300 text-sm flex items-start">
                  <span className="text-red-400 mr-2 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <h3 className="font-medium text-yellow-300 mb-2 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Short-term (1-4 weeks)
            </h3>
            <ul className="space-y-1">
              {pathway.shortTerm.map((item, i) => (
                <li key={i} className="text-gray-300 text-sm flex items-start">
                  <span className="text-yellow-400 mr-2 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <h3 className="font-medium text-green-300 mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Long-term (1-3 months)
            </h3>
            <ul className="space-y-1">
              {pathway.longTerm.map((item, i) => (
                <li key={i} className="text-gray-300 text-sm flex items-start">
                  <span className="text-green-400 mr-2 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={() => onComplete('success-pathway', { pathway })}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg transition-colors"
        >
          Accept My Success Pathway
        </button>
      </motion.div>
    );
  };

  const QuickWinsStep = ({ onComplete }) => {
    const [selectedWins, setSelectedWins] = useState([]);
    
    const quickWins = [
      {
        id: 'assessment-sharing',
        title: 'Share Assessment Results',
        description: 'Send results to your CTO and VP Sales',
        time: '5 minutes',
        impact: 'Team alignment'
      },
      {
        id: 'first-icp',
        title: 'Complete ICP Analysis',
        description: 'Generate your first customer intelligence report',
        time: '15 minutes', 
        impact: 'Immediate customer clarity'
      },
      {
        id: 'cost-calculation',
        title: 'Calculate ROI Impact',
        description: 'Quantify the cost of current inefficiencies',
        time: '10 minutes',
        impact: 'Executive justification'
      },
      {
        id: 'stakeholder-prep',
        title: 'Prepare Stakeholder Update',
        description: 'Draft executive summary for leadership team',
        time: '20 minutes',
        impact: 'Leadership buy-in'
      }
    ];

    const toggleWin = (winId) => {
      setSelectedWins(prev => 
        prev.includes(winId) 
          ? prev.filter(id => id !== winId)
          : [...prev, winId]
      );
    };

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-3">
            24-Hour Quick Wins
          </h2>
          <p className="text-gray-400">
            Select actions to take immediately for fast impact
          </p>
        </div>

        <div className="space-y-3">
          {quickWins.map((win) => (
            <div
              key={win.id}
              onClick={() => toggleWin(win.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedWins.includes(win.id)
                  ? 'bg-green-500/20 border-green-500 text-white'
                  : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{win.title}</h4>
                  <p className="text-sm opacity-80">{win.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-cyan-400">{win.time}</p>
                  <p className="text-xs text-gray-500">{win.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => onComplete('quick-wins', { selectedWins, startImmediately: true })}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg transition-colors"
          >
            Start Now ({selectedWins.length} selected)
          </button>
          <button
            onClick={() => onComplete('quick-wins', { selectedWins, startImmediately: false })}
            className="px-6 bg-gray-700 hover:bg-gray-600 text-gray-300 py-3 rounded-lg transition-colors"
          >
            Save for Later
          </button>
        </div>
      </motion.div>
    );
  };

  const TeamStep = ({ onComplete }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 text-center"
    >
      <h2 className="text-xl font-semibold text-white">Team Access Setup</h2>
      <p className="text-gray-400">Configure stakeholder access and sharing preferences</p>
      
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <Users className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
        <p className="text-gray-300">
          Team collaboration features will be configured based on your selected priorities.
        </p>
      </div>

      <button
        onClick={() => onComplete('team-setup', { configured: true })}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg transition-colors"
      >
        Configure Team Access
      </button>
    </motion.div>
  );

  if (!personalization || onboardingSteps.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-pulse text-gray-400">
          Preparing your personalized onboarding...
        </div>
      </div>
    );
  }

  const currentStepData = onboardingSteps[currentStep];
  const StepComponent = currentStepData?.component;
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-light text-white">
            Get Started with Revenue Intelligence
          </h1>
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
          >
            Skip Setup
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-gray-800 rounded-full h-2 mb-2">
          <motion.div
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">
            Step {currentStep + 1} of {onboardingSteps.length}
          </span>
          <span className="text-gray-400">
            ~{currentStepData?.estimatedTime} remaining
          </span>
        </div>
      </div>

      {/* Current Step */}
      <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-700">
        {StepComponent && (
          <StepComponent 
            onComplete={completeStep}
            stepData={currentStepData}
            assessmentData={assessmentData}
            onboardingData={onboardingData}
          />
        )}
      </div>

      {/* Step Navigation */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>
        
        <div className="flex space-x-2">
          {onboardingSteps.map((step, index) => (
            <div
              key={step.id}
              className={`w-2 h-2 rounded-full transition-colors ${
                index < currentStep ? 'bg-green-500' :
                index === currentStep ? 'bg-cyan-500' :
                'bg-gray-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentStep(Math.min(onboardingSteps.length - 1, currentStep + 1))}
          disabled={currentStep === onboardingSteps.length - 1}
          className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Skip →
        </button>
      </div>
    </div>
  );
};

export default AdvancedOnboardingFlow;