import React, { useState, useEffect } from 'react';
import { Target, Calendar, Zap, CheckCircle, Clock } from 'lucide-react';

/**
 * MilestoneTrackerWidget - Compact milestone progress and timeline tracking
 * Features:
 * - Current milestone progress with visual indicator
 * - Time-based progress tracking
 * - Next milestone preview
 * - Achievement status and completion forecast
 */

const MilestoneTrackerWidget = ({
  currentMilestone = {
    name: 'Foundation → Growth',
    progress: 72,
    target: 75,
    dueDate: '2024-09-15'
  },
  nextMilestone = {
    name: 'Growth → Expansion',
    estimatedStart: '2024-09-20'
  },
  achievements = 2,
  totalMilestones = 6,
  className = ''
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // Animate progress on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(currentMilestone.progress);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentMilestone.progress]);

  // Calculate time metrics
  const calculateTimeMetrics = () => {
    const dueDate = new Date(currentMilestone.dueDate);
    const today = new Date();
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    const isOverdue = daysRemaining < 0;
    const isUrgent = daysRemaining <= 7 && daysRemaining > 0;
    const isOnTrack = currentMilestone.progress >= (currentMilestone.target * 0.8);
    
    return {
      daysRemaining: Math.abs(daysRemaining),
      isOverdue,
      isUrgent,
      isOnTrack,
      status: isOverdue ? 'Overdue' : 
              isUrgent ? 'Urgent' : 
              isOnTrack ? 'On Track' : 'At Risk'
    };
  };

  const timeMetrics = calculateTimeMetrics();

  // Get status color - professional colors only
  const getStatusColor = () => {
    if (timeMetrics.isOverdue) return 'text-gray-400';
    if (timeMetrics.isUrgent) return 'text-blue-400';
    if (timeMetrics.isOnTrack) return 'text-blue-400';
    return 'text-gray-300';
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Calculate completion forecast
  const getCompletionForecast = () => {
    if (currentMilestone.progress >= currentMilestone.target) {
      return 'Complete';
    }
    
    const progressNeeded = currentMilestone.target - currentMilestone.progress;
    const daysAvailable = Math.max(timeMetrics.daysRemaining, 1);
    const dailyProgressNeeded = progressNeeded / daysAvailable;
    
    if (dailyProgressNeeded <= 2) return 'On Pace';
    if (dailyProgressNeeded <= 4) return 'Push Needed';
    return 'Critical';
  };

  const forecast = getCompletionForecast();

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Milestone Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-white truncate">
            {currentMilestone.name}
          </span>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-gray-400 hover:text-white"
        >
          {Math.round(animatedProgress)}%
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1500 ease-out"
            style={{ width: `${animatedProgress}%` }}
          />
        </div>
        
        {/* Progress Labels */}
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">
            {animatedProgress}% complete
          </span>
          <span className={getStatusColor()}>
            {timeMetrics.status}
          </span>
        </div>
      </div>

      {/* Time and Status */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className="text-gray-400">
            {timeMetrics.isOverdue ? 'Overdue' : `${timeMetrics.daysRemaining}d left`}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Zap className="w-3 h-3 text-blue-400" />
          <span className={
            forecast === 'Complete' ? 'text-blue-400' :
            forecast === 'On Pace' ? 'text-blue-400' :
            forecast === 'Push Needed' ? 'text-gray-300' : 'text-gray-400'
          }>
            {forecast}
          </span>
        </div>
      </div>

      {/* Achievements Summary */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-3 h-3 text-blue-400" />
          <span className="text-gray-400">
            {achievements}/{totalMilestones} achieved
          </span>
        </div>
        <span className="text-purple-400">
          Next: {formatDate(nextMilestone.estimatedStart)}
        </span>
      </div>

      {/* Detailed Breakdown */}
      {showDetails && (
        <div className="mt-3 p-3 bg-gray-800/50 rounded border border-gray-700 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Target:</span>
            <span className="text-xs text-white">{currentMilestone.target}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Due date:</span>
            <span className="text-xs text-white">{formatDate(currentMilestone.dueDate)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Remaining:</span>
            <span className="text-xs text-white">
              {Math.max(currentMilestone.target - currentMilestone.progress, 0)}%
            </span>
          </div>
          
          {/* Next Milestone Preview */}
          <div className="mt-3 pt-2 border-t border-gray-600">
            <div className="flex items-center space-x-1 mb-1">
              <Clock className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-gray-400">Next Milestone</span>
            </div>
            <p className="text-xs text-white">{nextMilestone.name}</p>
            <p className="text-xs text-gray-400">
              Est. start: {formatDate(nextMilestone.estimatedStart)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneTrackerWidget;