import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  ArrowRight,
  User,
  Users,
  Zap,
  Flag,
  Calendar
} from 'lucide-react';

/**
 * Today's Focus - EXCEPTION-FIRST DESIGN
 * 
 * Designed for Sarah Chen (Technical Founder)
 * Shows "What should I do TODAY?" with clear prioritization
 * Implements action-oriented design principles
 */

const TodaysFocus = ({
  criticalActions = [],
  thisWeekFocus = [],
  blockers = [],
  quickWins = [],
  compactMode = false
}) => {
  const [showCompleted, setShowCompleted] = useState(false);

  // Sample data for Sarah's context
  const defaultCriticalActions = criticalActions.length > 0 ? criticalActions : [
    {
      id: 1,
      action: "Review customer churn data from last 30 days",
      urgency: "critical",
      owner: "you",
      timeRequired: "30min",
      impact: "Series B blocker if retention doesn't improve",
      category: "customer_health",
      completed: false
    },
    {
      id: 2,
      action: "Validate pricing model with 3 enterprise prospects",
      urgency: "high",
      owner: "you",
      timeRequired: "2hrs",
      impact: "Required for Series B financial projections",
      category: "pricing_strategy",
      completed: false
    },
    {
      id: 3,
      action: "1:1 with VP Sales on pipeline forecasting accuracy",
      urgency: "medium",
      owner: "delegated",
      timeRequired: "45min",
      impact: "Improves investor confidence in projections",
      category: "team_alignment",
      completed: false
    }
  ];

  const defaultThisWeekFocus = thisWeekFocus.length > 0 ? thisWeekFocus : [
    "Complete competitive pricing analysis vs top 3 competitors",
    "Finalize Series B deck revenue projections section",
    "Set up automated customer health scoring system"
  ];

  const defaultBlockers = blockers.length > 0 ? blockers : [
    "Customer Success Manager hire delayed - affecting retention",
    "Engineering resources needed for enterprise security features"
  ];

  const defaultQuickWins = quickWins.length > 0 ? quickWins : [
    "Send case study requests to 5 happiest customers",
    "Update pricing page with enterprise tier",
    "Schedule board advisor call on Series B timeline"
  ];

  const getUrgencyStyle = (urgency) => {
    switch (urgency) {
      case 'critical':
        return {
          bg: 'bg-red-900/30',
          border: 'border-red-500/50',
          text: 'text-red-400',
          indicator: 'bg-red-500'
        };
      case 'high':
        return {
          bg: 'bg-orange-900/30',
          border: 'border-orange-500/50',
          text: 'text-orange-400',
          indicator: 'bg-orange-500'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-900/30',
          border: 'border-yellow-500/50',
          text: 'text-yellow-400',
          indicator: 'bg-yellow-500'
        };
      default:
        return {
          bg: 'bg-gray-900/30',
          border: 'border-gray-500/50',
          text: 'text-gray-400',
          indicator: 'bg-gray-500'
        };
    }
  };

  const getOwnerIcon = (owner) => {
    return owner === 'you' ? User : Users;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'customer_health': return Target;
      case 'pricing_strategy': return Flag;
      case 'team_alignment': return Users;
      default: return Clock;
    }
  };

  if (compactMode) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white flex items-center">
            <Target className="w-4 h-4 text-blue-400 mr-2" />
            Today's Focus
          </h3>
          <span className="text-xs text-gray-400">
            {defaultCriticalActions.filter(a => !a.completed).length} actions
          </span>
        </div>
        
        <div className="space-y-2">
          {defaultCriticalActions.slice(0, 2).map((item, index) => {
            const urgencyStyle = getUrgencyStyle(item.urgency);
            const OwnerIcon = getOwnerIcon(item.owner);
            
            return (
              <div key={item.id} className={`${urgencyStyle.bg} ${urgencyStyle.border} border rounded-lg p-2`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-white font-medium mb-1">
                      {item.action}
                    </div>
                    <div className="flex items-center space-x-3 text-xs">
                      <span className={urgencyStyle.text}>{item.urgency}</span>
                      <span className="text-gray-400">{item.timeRequired}</span>
                      <div className="flex items-center space-x-1">
                        <OwnerIcon className="w-3 h-3" />
                        <span className="text-gray-400">{item.owner}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Target className="w-6 h-6 text-blue-400 mr-3" />
          Today's Focus
        </h2>
        <div className="text-sm text-gray-400">
          Technical Founder Action Center
        </div>
      </div>

      {/* Critical Actions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
          Requires Your Attention Today ({defaultCriticalActions.filter(a => !a.completed).length})
        </h3>
        
        <div className="space-y-3">
          {defaultCriticalActions.map((item, index) => {
            if (item.completed && !showCompleted) return null;
            
            const urgencyStyle = getUrgencyStyle(item.urgency);
            const OwnerIcon = getOwnerIcon(item.owner);
            const CategoryIcon = getCategoryIcon(item.category);
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${urgencyStyle.bg} ${urgencyStyle.border} border rounded-lg p-4 hover:bg-opacity-80 transition-all cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3 mb-2">
                      <div className={`w-2 h-2 ${urgencyStyle.indicator} rounded-full mt-2`} />
                      <div className="flex-1">
                        <div className="text-white font-medium mb-1">
                          {item.action}
                        </div>
                        <div className="text-sm text-gray-300 mb-2">
                          {item.impact}
                        </div>
                        <div className="flex items-center space-x-4 text-xs">
                          <div className="flex items-center space-x-1">
                            <CategoryIcon className="w-3 h-3 text-gray-400" />
                            <span className={urgencyStyle.text} className="font-medium uppercase">
                              {item.urgency}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-400">{item.timeRequired}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <OwnerIcon className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-400 capitalize">{item.owner}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-4" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* This Week's Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Week Focus */}
        <div>
          <h4 className="text-white font-medium mb-3 flex items-center">
            <Calendar className="w-4 h-4 text-blue-400 mr-2" />
            This Week's Focus
          </h4>
          <div className="space-y-2">
            {defaultThisWeekFocus.map((item, index) => (
              <div key={index} className="text-sm text-gray-300 flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Blockers */}
        <div>
          <h4 className="text-white font-medium mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 text-red-400 mr-2" />
            Current Blockers
          </h4>
          <div className="space-y-2">
            {defaultBlockers.map((blocker, index) => (
              <div key={index} className="text-sm text-red-300 flex items-start">
                <span className="text-red-400 mr-2">!</span>
                <span>{blocker}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Wins */}
        <div>
          <h4 className="text-white font-medium mb-3 flex items-center">
            <Zap className="w-4 h-4 text-green-400 mr-2" />
            Quick Wins Available
          </h4>
          <div className="space-y-2">
            {defaultQuickWins.map((win, index) => (
              <div key={index} className="text-sm text-green-300 flex items-start">
                <span className="text-green-400 mr-2">⚡</span>
                <span>{win}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Summary */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            <strong className="text-white">Today's Priority:</strong> Focus on customer health and pricing validation for Series B readiness
          </div>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            {showCompleted ? 'Hide' : 'Show'} completed items
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodaysFocus;