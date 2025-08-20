import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, DollarSign, Users, Calendar, ChevronRight, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserIntelligence } from '../../../contexts/simplified/UserIntelligenceContext';

/**
 * SeriesAContextWidget - Sarah Chen's Business Stage Intelligence
 * 
 * Provides Series A specific context and milestone tracking:
 * - Business stage analysis and ARR tracking
 * - Revenue milestone progression
 * - Team scaling and market expansion insights
 * - Competitive positioning for growth stage
 * 
 * Key Use Case: "Understanding where we are in our Series A journey"
 */

const SeriesAContextWidget = ({
  className = ''
}) => {
  // Get user data for dynamic business stage analysis
  const { businessContext, icpAnalysis, costCalculatorResults } = useUserIntelligence();
  
  const [contextAnalysis, setContextAnalysis] = useState(null);
  const [activeView, setActiveView] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Business stage detection and analysis
  const analyzeBusinessContext = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis processing
    setTimeout(() => {
      const analysis = generateSeriesAContext();
      setContextAnalysis(analysis);
      setIsAnalyzing(false);
    }, 1200);
  };

  // Generate Series A specific context analysis
  const generateSeriesAContext = () => {
    const { currentARR, targetARR, teamSize, fundingStage, industry } = businessContext;
    
    // Calculate progress metrics
    const arrProgress = Math.round((currentARR / targetARR) * 100);
    const monthsToTarget = Math.ceil((targetARR - currentARR) / (currentARR * 0.15 / 12)); // Assuming 15% monthly growth
    
    // Determine business stage
    let stage = 'Early Series A';
    if (currentARR >= 5000000) stage = 'Late Series A';
    else if (currentARR >= 3000000) stage = 'Mid Series A';
    
    // Generate context-aware insights
    const insights = generateStageInsights(stage, currentARR, targetARR, teamSize, industry);
    
    return {
      stage,
      arrProgress,
      monthsToTarget,
      currentMetrics: {
        arr: currentARR,
        target: targetARR,
        teamSize,
        industry
      },
      milestones: generateStageMilestones(stage, currentARR, targetARR),
      challenges: generateStageChallenges(stage, teamSize, industry),
      opportunities: generateStageOpportunities(stage, icpAnalysis, costCalculatorResults),
      insights,
      nextQuarter: generateNextQuarterFocus(stage, currentARR, targetARR)
    };
  };

  // Generate stage-specific insights
  const generateStageInsights = (stage, currentARR, targetARR, teamSize, industry) => {
    const insights = [];
    
    if (stage === 'Early Series A') {
      insights.push({
        type: 'growth',
        title: 'Foundation Scaling',
        description: `With ${(currentARR / 1000000).toFixed(1)}M ARR, focus on systematic revenue processes and team scaling.`,
        priority: 'high'
      });
      
      insights.push({
        type: 'team',
        title: 'Strategic Hiring',
        description: `Current team size of ${teamSize} positions you for strategic sales and marketing hires.`,
        priority: 'medium'
      });
    } else if (stage === 'Mid Series A') {
      insights.push({
        type: 'market',
        title: 'Market Expansion',
        description: `At ${(currentARR / 1000000).toFixed(1)}M ARR, consider geographic or vertical expansion.`,
        priority: 'high'
      });
      
      insights.push({
        type: 'process',
        title: 'Enterprise Readiness',
        description: 'Scale processes for enterprise deals and longer sales cycles.',
        priority: 'high'
      });
    } else if (stage === 'Late Series A') {
      insights.push({
        type: 'series-b',
        title: 'Series B Preparation',
        description: 'Strong ARR foundation positions you well for Series B discussions.',
        priority: 'high'
      });
      
      insights.push({
        type: 'leadership',
        title: 'Executive Team',
        description: 'Consider C-level hires to support continued growth trajectory.',
        priority: 'medium'
      });
    }
    
    return insights;
  };

  // Generate stage milestones
  const generateStageMilestones = (stage, currentARR, targetARR) => {
    const milestones = [];
    const quarterlyTarget = (targetARR - currentARR) / 4;
    
    for (let i = 1; i <= 4; i++) {
      const targetValue = currentARR + (quarterlyTarget * i);
      milestones.push({
        quarter: `Q${i}`,
        target: targetValue,
        description: `Reach ${(targetValue / 1000000).toFixed(1)}M ARR`,
        progress: i === 1 ? 65 : 0, // Current quarter has some progress
        isActive: i === 1
      });
    }
    
    return milestones;
  };

  // Generate stage challenges
  const generateStageChallenges = (stage, teamSize, industry) => {
    const challenges = [
      {
        area: 'Sales Scaling',
        description: 'Transitioning from founder-led sales to scalable team',
        impact: teamSize < 15 ? 'high' : 'medium'
      },
      {
        area: 'Market Position',
        description: `Establishing competitive differentiation in ${industry}`,
        impact: 'high'
      },
      {
        area: 'Unit Economics',
        description: 'Optimizing CAC payback and LTV:CAC ratios',
        impact: 'medium'
      }
    ];
    
    return challenges;
  };

  // Generate stage opportunities
  const generateStageOpportunities = (stage, icpAnalysis, costCalculatorResults) => {
    const opportunities = [];
    
    if (icpAnalysis.targetIndustries?.length > 1) {
      opportunities.push({
        type: 'expansion',
        title: 'Multi-Industry Strategy',
        description: `Leverage success across ${icpAnalysis.targetIndustries.join(', ')} for accelerated growth`,
        value: 'High'
      });
    }
    
    if (costCalculatorResults.roiPercentage > 150) {
      opportunities.push({
        type: 'pricing',
        title: 'Value-Based Pricing',
        description: `Strong ROI of ${costCalculatorResults.roiPercentage}% supports premium positioning`,
        value: 'High'
      });
    }
    
    opportunities.push({
      type: 'enterprise',
      title: 'Enterprise Segment',
      description: 'Series A stage ideal for enterprise customer acquisition',
      value: 'Medium'
    });
    
    return opportunities;
  };

  // Generate next quarter focus
  const generateNextQuarterFocus = (stage, currentARR, targetARR) => {
    const focus = [];
    
    focus.push({
      priority: 1,
      area: 'Revenue Growth',
      target: `Reach ${((currentARR + (targetARR - currentARR) / 4) / 1000000).toFixed(1)}M ARR`,
      actions: ['Scale outbound efforts', 'Optimize conversion funnel', 'Enterprise pilot programs']
    });
    
    focus.push({
      priority: 2,
      area: 'Team Building',
      target: 'Strategic hires in Sales & Marketing',
      actions: ['VP of Sales search', 'Marketing automation specialist', 'Customer Success lead']
    });
    
    focus.push({
      priority: 3,
      area: 'Product Market Fit',
      target: 'Strengthen positioning in core segments',
      actions: ['Customer success stories', 'Competitive analysis', 'Feature prioritization']
    });
    
    return focus;
  };

  // Load analysis on mount
  useEffect(() => {
    analyzeBusinessContext();
  }, [businessContext]);

  const views = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'milestones', label: 'Milestones', icon: Calendar },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'focus', label: 'Next Quarter', icon: ChevronRight }
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-white">
            Series A Context
          </span>
        </div>
        <div className="text-xs text-gray-400">
          {businessContext.fundingStage}
        </div>
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 text-center"
        >
          <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-400">Analyzing business context...</p>
        </motion.div>
      )}

      {/* Context Analysis */}
      <AnimatePresence>
        {contextAnalysis && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* Stage Overview */}
            <div className="p-2 bg-green-600/10 border border-green-500/20 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-green-400">
                  {contextAnalysis.stage}
                </span>
                <span className="text-xs text-gray-400">
                  ${(contextAnalysis.currentMetrics.arr / 1000000).toFixed(1)}M ARR
                </span>
              </div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex-1 bg-gray-700 rounded-full h-1">
                  <div 
                    className="bg-green-500 h-1 rounded-full transition-all duration-1000"
                    style={{ width: `${contextAnalysis.arrProgress}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">
                  {contextAnalysis.arrProgress}%
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-tight">
                {contextAnalysis.monthsToTarget} months to target
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-0.5 bg-gray-800 rounded p-0.5">
              {views.map(view => {
                const IconComponent = view.icon;
                return (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`flex-1 flex items-center justify-center py-1 px-1 rounded text-xs transition-colors ${
                      activeView === view.id
                        ? 'bg-green-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <IconComponent className="w-3 h-3" />
                    <span className="hidden sm:inline text-xs">{view.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* View Content */}
            <div className="min-h-[120px]">
              {activeView === 'overview' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-gray-800/50 rounded border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">Current ARR</p>
                      <p className="text-sm text-white">
                        ${(contextAnalysis.currentMetrics.arr / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div className="p-2 bg-gray-800/50 rounded border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">Target ARR</p>
                      <p className="text-sm text-white">
                        ${(contextAnalysis.currentMetrics.target / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-gray-800/50 rounded border border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">Stage Focus</p>
                    <p className="text-xs text-gray-300">
                      {contextAnalysis.insights[0]?.description || 'Building systematic growth processes'}
                    </p>
                  </div>
                </div>
              )}

              {activeView === 'milestones' && (
                <div className="space-y-2">
                  {contextAnalysis.milestones.slice(0, 3).map((milestone, index) => (
                    <div key={index} className={`p-2 rounded border ${
                      milestone.isActive 
                        ? 'bg-green-600/10 border-green-500/20' 
                        : 'bg-gray-800/50 border-gray-700'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-white">
                          {milestone.quarter}
                        </span>
                        <span className="text-xs text-gray-400">
                          ${(milestone.target / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">
                        {milestone.description}
                      </p>
                      {milestone.isActive && (
                        <div className="mt-1 flex items-center space-x-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-1">
                            <div 
                              className="bg-green-500 h-1 rounded-full"
                              style={{ width: `${milestone.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">
                            {milestone.progress}%
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeView === 'insights' && (
                <div className="space-y-2">
                  {contextAnalysis.insights.map((insight, index) => (
                    <div key={index} className="p-2 bg-gray-800/50 rounded border border-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-white">{insight.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{insight.description}</p>
                        </div>
                        <span className={`text-xs px-1 py-0.5 rounded ${
                          insight.priority === 'high' ? 'bg-green-600/20 text-green-300' : 'bg-gray-600/50 text-gray-400'
                        }`}>
                          {insight.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeView === 'focus' && (
                <div className="space-y-2">
                  {contextAnalysis.nextQuarter.slice(0, 3).map((item, index) => (
                    <div key={index} className="p-2 bg-gray-800/50 rounded border border-gray-700">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs bg-green-600 text-white px-1 py-0.5 rounded">
                          P{item.priority}
                        </span>
                        <span className="text-xs font-medium text-white">
                          {item.area}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-1">{item.target}</p>
                      <div className="space-y-0.5">
                        {item.actions.slice(0, 2).map((action, actionIndex) => (
                          <p key={actionIndex} className="text-xs text-gray-500">
                            • {action}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={analyzeBusinessContext}
                className="flex items-center justify-center space-x-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white transition-colors"
              >
                <TrendingUp className="w-3 h-3" />
                <span>Refresh Analysis</span>
              </button>
              <button
                onClick={() => setActiveView('focus')}
                className="flex items-center justify-center space-x-1 py-2 px-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/20 rounded text-xs text-green-300 transition-colors"
              >
                <ChevronRight className="w-3 h-3" />
                <span>Q1 Plan</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Usage Hint */}
      <div className="text-xs text-gray-500 text-center">
        Sarah's business stage intelligence - Series A context and milestones
      </div>
    </div>
  );
};

export default SeriesAContextWidget;