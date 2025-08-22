import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Zap, 
  Clock, 
  DollarSign, 
  Star,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Briefcase,
  Award
} from 'lucide-react';

/**
 * Experience-Driven Priority System - ESSENTIAL PHASE
 * 
 * Analyzes all available buyer intelligence actions and presents them in priority order
 * based on combined business impact and experience value. Shows highest ROI actions
 * that maximize both professional development and revenue outcomes.
 */

const ExperienceDrivenPriorities = ({
  buyerIntelligence = {},
  dealPipeline = [],
  currentLevel = {},
  onActionClick
}) => {
  const [priorities, setPriorities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    calculatePriorities();
  }, [buyerIntelligence, dealPipeline, currentLevel]);

  const calculatePriorities = () => {
    const availableActions = generateAvailableActions();
    const scoredActions = availableActions.map(action => ({
      ...action,
      roiScore: calculateROIScore(action),
      urgencyScore: calculateUrgencyScore(action),
      totalScore: calculateTotalScore(action)
    }));

    // Sort by total score (highest ROI first)
    const sortedPriorities = scoredActions.sort((a, b) => b.totalScore - a.totalScore);
    setPriorities(sortedPriorities);
  };

  const generateAvailableActions = () => {
    const actions = [];
    
    // Competitive Intelligence Actions
    if (hasCompetitorGaps()) {
      actions.push({
        id: 'competitive_analysis_dataflow',
        title: 'Build DataFlow Competitive Response',
        description: 'Create technical differentiation framework vs DataFlow',
        category: 'competitive_intelligence',
        experiencePoints: 25,
        businessImpact: {
          dealsPotentiallyHelped: 3,
          revenueAtRisk: 450000,
          timeToComplete: '2 hours',
          confidence: 85
        },
        requirements: ['DataFlow product knowledge', 'Technical positioning'],
        difficulty: 'medium'
      });
    }

    // Stakeholder Intelligence Actions  
    if (hasStakeholderGaps()) {
      actions.push({
        id: 'stakeholder_mapping_cfo',
        title: 'Map CFO Decision Criteria',
        description: 'Research and document CFO evaluation framework',
        category: 'stakeholder_intelligence',
        experiencePoints: 20,
        businessImpact: {
          dealsPotentiallyHelped: 2,
          revenueAtRisk: 320000,
          timeToComplete: '90 minutes',
          confidence: 75
        },
        requirements: ['CFO contact info', 'Budget decision process'],
        difficulty: 'easy'
      });
    }

    // Technical Translation Actions
    if (hasTechnicalTranslationGaps()) {
      actions.push({
        id: 'roi_calculator_enterprise',
        title: 'Build Enterprise ROI Calculator',
        description: 'Create industry-specific value calculation framework',
        category: 'value_translation',
        experiencePoints: 30,
        businessImpact: {
          dealsPotentiallyHelped: 4,
          revenueAtRisk: 580000,
          timeToComplete: '3 hours',
          confidence: 90
        },
        requirements: ['Industry benchmarks', 'Cost structure data'],
        difficulty: 'high'
      });
    }

    // Buyer Journey Intelligence
    if (hasBuyerJourneyGaps()) {
      actions.push({
        id: 'decision_timeline_mapping',
        title: 'Map Q4 Decision Timeline',
        description: 'Research enterprise budget cycles and decision deadlines',
        category: 'buyer_journey',
        experiencePoints: 15,
        businessImpact: {
          dealsPotentiallyHelped: 5,
          revenueAtRisk: 780000,
          timeToComplete: '1 hour',
          confidence: 95
        },
        requirements: ['Industry research', 'Prospect conversations'],
        difficulty: 'easy'
      });
    }

    // Account Intelligence Actions
    actions.push({
      id: 'prospect_deep_dive',
      title: 'Complete TechFlow Account Research',
      description: 'Deep-dive analysis of TechFlow technology stack and pain points',
      category: 'account_intelligence',
      experiencePoints: 18,
      businessImpact: {
        dealsPotentiallyHelped: 1,
        revenueAtRisk: 150000,
        timeToComplete: '45 minutes',
        confidence: 80
      },
      requirements: ['LinkedIn research', 'Technology stack analysis'],
      difficulty: 'easy'
    });

    return actions;
  };

  const calculateROIScore = (action) => {
    const { experiencePoints, businessImpact } = action;
    const revenuePerHour = businessImpact.revenueAtRisk / parseFloat(businessImpact.timeToComplete);
    const experiencePerHour = experiencePoints / parseFloat(businessImpact.timeToComplete);
    
    // Combine revenue impact and experience efficiency
    return (revenuePerHour / 1000) + (experiencePerHour * 10);
  };

  const calculateUrgencyScore = (action) => {
    const { businessImpact } = action;
    let urgency = 50; // Base urgency
    
    // Higher urgency for more deals at risk
    urgency += businessImpact.dealsPotentiallyHelped * 10;
    
    // Higher urgency for quick wins
    if (businessImpact.timeToComplete.includes('hour') && parseFloat(businessImpact.timeToComplete) <= 1) {
      urgency += 20;
    }
    
    // Higher urgency for high confidence
    urgency += (businessImpact.confidence - 50) / 2;
    
    return Math.min(urgency, 100);
  };

  const calculateTotalScore = (action) => {
    const roiWeight = 0.6;
    const urgencyWeight = 0.4;
    return (action.roiScore * roiWeight) + (action.urgencyScore * urgencyWeight);
  };

  // Mock functions for checking gaps (would integrate with real intelligence data)
  const hasCompetitorGaps = () => !buyerIntelligence.competitorAnalysis?.dataflow;
  const hasStakeholderGaps = () => !buyerIntelligence.stakeholderMapping?.cfo;
  const hasTechnicalTranslationGaps = () => !buyerIntelligence.valueFrameworks?.roiCalculator;
  const hasBuyerJourneyGaps = () => !buyerIntelligence.decisionTimeline?.q4Budget;

  const getCategoryIcon = (category) => {
    const icons = {
      competitive_intelligence: Target,
      stakeholder_intelligence: Users,
      value_translation: DollarSign,
      buyer_journey: TrendingUp,
      account_intelligence: Briefcase
    };
    return icons[category] || Star;
  };

  const getCategoryColor = (category) => {
    const colors = {
      competitive_intelligence: 'text-red-400',
      stakeholder_intelligence: 'text-blue-400', 
      value_translation: 'text-green-400',
      buyer_journey: 'text-purple-400',
      account_intelligence: 'text-yellow-400'
    };
    return colors[category] || 'text-gray-400';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'text-green-400',
      medium: 'text-yellow-400',
      high: 'text-red-400'
    };
    return colors[difficulty] || 'text-gray-400';
  };

  const filteredPriorities = selectedCategory === 'all' 
    ? priorities 
    : priorities.filter(p => p.category === selectedCategory);

  const categories = [
    { key: 'all', label: 'All Actions', count: priorities.length },
    { key: 'competitive_intelligence', label: 'Competitive', count: priorities.filter(p => p.category === 'competitive_intelligence').length },
    { key: 'stakeholder_intelligence', label: 'Stakeholder', count: priorities.filter(p => p.category === 'stakeholder_intelligence').length },
    { key: 'value_translation', label: 'Value Translation', count: priorities.filter(p => p.category === 'value_translation').length },
    { key: 'buyer_journey', label: 'Buyer Journey', count: priorities.filter(p => p.category === 'buyer_journey').length }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Priority Actions</h3>
          <p className="text-gray-400 text-sm">
            Highest ROI buyer intelligence actions ranked by business impact × experience gain
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-400">
            {priorities.length}
          </div>
          <div className="text-sm text-gray-400">Available Actions</div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Priority Actions List */}
      <div className="space-y-3">
        {filteredPriorities.map((action, index) => {
          const IconComponent = getCategoryIcon(action.category);
          const categoryColor = getCategoryColor(action.category);
          const difficultyColor = getDifficultyColor(action.difficulty);
          
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors cursor-pointer"
              onClick={() => onActionClick?.(action)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-black/30`}>
                    <IconComponent className={`w-5 h-5 ${categoryColor}`} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg leading-tight">
                      {action.title}
                    </h4>
                    <p className="text-gray-400 text-sm">{action.description}</p>
                  </div>
                </div>
                
                {/* Priority Rank */}
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">#{index + 1}</div>
                    <div className="text-xs text-gray-400">Priority</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-gray-400 text-xs mb-1">Experience</div>
                  <div className="text-blue-400 font-semibold">
                    +{action.experiencePoints} points
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Deals Helped</div>
                  <div className="text-green-400 font-semibold">
                    {action.businessImpact.dealsPotentiallyHelped} deals
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Revenue Risk</div>
                  <div className="text-yellow-400 font-semibold">
                    ${(action.businessImpact.revenueAtRisk / 1000).toFixed(0)}K
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Time Investment</div>
                  <div className="text-purple-400 font-semibold">
                    {action.businessImpact.timeToComplete}
                  </div>
                </div>
              </div>

              {/* ROI Analysis */}
              <div className="bg-black/20 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">ROI Analysis</span>
                  <span className="text-white font-medium">
                    Score: {action.totalScore.toFixed(1)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Revenue/Hour: </span>
                    <span className="text-green-400 font-medium">
                      ${((action.businessImpact.revenueAtRisk / parseFloat(action.businessImpact.timeToComplete)) / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Experience/Hour: </span>
                    <span className="text-blue-400 font-medium">
                      {(action.experiencePoints / parseFloat(action.businessImpact.timeToComplete)).toFixed(1)} pts
                    </span>
                  </div>
                </div>
              </div>

              {/* Requirements & Difficulty */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className={`text-sm font-medium ${difficultyColor}`}>
                      {action.difficulty.charAt(0).toUpperCase() + action.difficulty.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-400">
                      {action.businessImpact.confidence}% confidence
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400 font-medium">
                    High Impact
                  </span>
                </div>
              </div>

              {/* Requirements List */}
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="text-gray-400 text-xs mb-1">Requirements:</div>
                <div className="flex flex-wrap gap-2">
                  {action.requirements.map((req, i) => (
                    <span 
                      key={i}
                      className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-5">
        <h4 className="text-white font-medium mb-3 flex items-center">
          <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
          Action Portfolio Summary
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Total Experience Available</div>
            <div className="text-blue-400 font-bold text-lg">
              +{priorities.reduce((sum, p) => sum + p.experiencePoints, 0)} points
            </div>
          </div>
          <div>
            <div className="text-gray-400">Total Revenue at Risk</div>
            <div className="text-green-400 font-bold text-lg">
              ${(priorities.reduce((sum, p) => sum + p.businessImpact.revenueAtRisk, 0) / 1000000).toFixed(1)}M
            </div>
          </div>
          <div>
            <div className="text-gray-400">Total Time Investment</div>
            <div className="text-purple-400 font-bold text-lg">
              {priorities.reduce((sum, p) => sum + parseFloat(p.businessImpact.timeToComplete), 0).toFixed(1)} hours
            </div>
          </div>
        </div>
      </div>

      {/* Professional Development Context */}
      <div className="bg-gradient-to-r from-gray-900/50 to-slate-900/50 border border-gray-700 rounded-xl p-4">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            <span className="text-white font-medium">Strategic Action Selection:</span> Every buyer intelligence action advances both immediate deal progression and long-term revenue capability development through systematic competitive advantage building.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDrivenPriorities;