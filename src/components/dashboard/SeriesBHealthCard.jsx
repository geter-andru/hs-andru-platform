import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  DollarSign,
  Users
} from 'lucide-react';

/**
 * Series B Health Card - ENTERPRISE DECISION VELOCITY
 * 
 * 5-Second Rule Implementation for Technical Founders
 * Provides immediate Red/Yellow/Green business health status
 * Designed specifically for Sarah Chen's decision-making needs
 */

const SeriesBHealthCard = ({
  overallHealth = 'yellow', // red, yellow, green
  seriesBReadiness = 68,
  currentARR = 2100000, // $2.1M
  targetARR = 5000000, // $5M needed for Series B
  timelineMonths = 8,
  targetTimelineMonths = 6,
  topAlerts = [],
  keyWins = [],
  compactMode = false
}) => {
  
  // Calculate health metrics
  const arrProgress = (currentARR / targetARR) * 100;
  const timelineStatus = timelineMonths <= targetTimelineMonths ? 'on-track' : 'behind';
  const monthsBehind = Math.max(0, timelineMonths - targetTimelineMonths);
  
  const getHealthColor = (health) => {
    switch (health) {
      case 'green': return {
        bg: 'bg-green-900/30',
        border: 'border-green-500/50',
        text: 'text-green-400',
        indicator: 'bg-green-500'
      };
      case 'yellow': return {
        bg: 'bg-yellow-900/30',
        border: 'border-yellow-500/50',
        text: 'text-yellow-400',
        indicator: 'bg-yellow-500'
      };
      case 'red': return {
        bg: 'bg-red-900/30',
        border: 'border-red-500/50',
        text: 'text-red-400',
        indicator: 'bg-red-500'
      };
      default: return {
        bg: 'bg-gray-900/30',
        border: 'border-gray-500/50',
        text: 'text-gray-400',
        indicator: 'bg-gray-500'
      };
    }
  };

  const healthStyles = getHealthColor(overallHealth);
  
  const getHealthMessage = () => {
    if (overallHealth === 'green') return 'On Track for Series B';
    if (overallHealth === 'yellow') return 'On Track with Risks';
    return 'Behind Schedule - Action Required';
  };

  const getHealthIcon = () => {
    if (overallHealth === 'green') return CheckCircle;
    if (overallHealth === 'yellow') return AlertTriangle;
    return AlertTriangle;
  };

  const HealthIcon = getHealthIcon();

  if (compactMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${healthStyles.bg} ${healthStyles.border} border rounded-lg p-3`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 ${healthStyles.indicator} rounded-full`} />
            <div className={`font-semibold ${healthStyles.text}`}>
              Series B: {seriesBReadiness}%
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {timelineMonths}mo timeline
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${healthStyles.bg} ${healthStyles.border} border rounded-xl overflow-hidden`}
    >
      {/* Main Health Status - The 5-Second Section */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 ${healthStyles.indicator} rounded-full animate-pulse`} />
            <h2 className="text-2xl font-bold text-white">Series B Readiness</h2>
            <HealthIcon className={`w-6 h-6 ${healthStyles.text}`} />
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{seriesBReadiness}%</div>
            <div className={`text-sm ${healthStyles.text} font-medium`}>
              {getHealthMessage()}
            </div>
          </div>
        </div>

        {/* Critical Metrics Row */}
        <div className="grid grid-cols-3 gap-6">
          {/* ARR Progress */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">ARR Progress</span>
            </div>
            <div className="text-xl font-bold text-white">
              ${(currentARR / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-gray-400">
              of ${(targetARR / 1000000).toFixed(0)}M needed ({Math.round(arrProgress)}%)
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 mt-1">
              <motion.div
                className="bg-green-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, arrProgress)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Timeline Status */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Timeline</span>
            </div>
            <div className="text-xl font-bold text-white">
              {timelineMonths} months
            </div>
            <div className={`text-xs ${timelineStatus === 'behind' ? 'text-red-400' : 'text-green-400'}`}>
              {timelineStatus === 'behind' 
                ? `${monthsBehind} months behind target`
                : 'On track with target'
              }
            </div>
          </div>

          {/* Readiness Trend */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">Trend</span>
            </div>
            <div className="flex items-center space-x-2">
              {seriesBReadiness >= 75 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className="text-xl font-bold text-white">
                {seriesBReadiness >= 75 ? 'Accelerating' : 'Needs Focus'}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Based on recent metrics
            </div>
          </div>
        </div>
      </div>

      {/* Alert Summary - Exception Management */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Top Alerts */}
          <div>
            <h4 className="text-red-400 font-medium mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Requires Attention ({topAlerts.length})
            </h4>
            <div className="space-y-1">
              {topAlerts.slice(0, 3).map((alert, index) => (
                <div key={index} className="text-sm text-gray-300 flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>{alert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Wins */}
          <div>
            <h4 className="text-green-400 font-medium mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Recent Wins ({keyWins.length})
            </h4>
            <div className="space-y-1">
              {keyWins.slice(0, 3).map((win, index) => (
                <div key={index} className="text-sm text-gray-300 flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>{win}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Hint */}
      <div className="px-6 py-3 bg-black/20">
        <div className="text-xs text-gray-400 text-center">
          <strong className="text-white">Technical Founder Focus:</strong> {
            overallHealth === 'red' 
              ? 'Critical path items need immediate attention'
              : overallHealth === 'yellow'
              ? 'Monitor risks and accelerate key initiatives'  
              : 'Maintain momentum and prepare for Series B process'
          }
        </div>
      </div>
    </motion.div>
  );
};

export default SeriesBHealthCard;