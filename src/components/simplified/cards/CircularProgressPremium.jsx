import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react';

/**
 * CircularProgressPremium - Enhanced circular progress with trends and targets
 * Features:
 * - Animated progress bars using react-circular-progressbar
 * - Trend arrows with week-over-week changes
 * - Target completion dates
 * - Color-coded progress levels
 * - Smooth animations and transitions
 */

const CircularProgressPremium = ({ 
  competency,
  currentValue = 0,
  previousValue = 0,
  targetValue = 70,
  targetDate = null,
  label = '',
  size = 80,
  animationDelay = 0
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [showTrend, setShowTrend] = useState(false);

  // Animate the progress value on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(currentValue);
      // Show trend after progress animation completes
      setTimeout(() => setShowTrend(true), 800);
    }, animationDelay);

    return () => clearTimeout(timer);
  }, [currentValue, animationDelay]);

  // Calculate trend
  const trendValue = currentValue - previousValue;
  const trendPercentage = previousValue > 0 ? Math.round((trendValue / previousValue) * 100) : 0;
  const isPositiveTrend = trendValue > 0;
  const isNeutralTrend = trendValue === 0;

  // Get color based on progress level
  const getProgressColor = (value) => {
    if (value >= 70) return '#10B981'; // Green
    if (value >= 55) return '#3B82F6'; // Blue  
    if (value >= 40) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  // Get target status
  const getTargetStatus = () => {
    if (currentValue >= targetValue) return 'achieved';
    if (currentValue >= targetValue * 0.8) return 'close';
    return 'developing';
  };

  const targetStatus = getTargetStatus();
  const progressColor = getProgressColor(currentValue);

  // Format target date
  const formatTargetDate = (date) => {
    if (!date) return 'TBD';
    const now = new Date();
    const target = new Date(date);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `${diffDays} days`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks`;
    return `${Math.ceil(diffDays / 30)} months`;
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Circular Progress with Overlay */}
      <div className="relative">
        <div style={{ width: size, height: size }}>
          <CircularProgressbar
            value={animatedValue}
            text={`${Math.round(animatedValue)}%`}
            styles={buildStyles({
              textSize: '20px',
              pathColor: progressColor,
              textColor: '#FFFFFF',
              trailColor: '#374151',
              backgroundColor: 'transparent',
              pathTransitionDuration: 0.8,
              textStyle: {
                fontWeight: '600',
                fontSize: '16px'
              }
            })}
          />
        </div>

        {/* Target Indicator Overlay */}
        {targetValue > 0 && targetValue !== currentValue && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `conic-gradient(transparent ${(targetValue / 100) * 360}deg, rgba(255,255,255,0.2) ${(targetValue / 100) * 360}deg, rgba(255,255,255,0.2) ${(targetValue / 100) * 360 + 2}deg, transparent ${(targetValue / 100) * 360 + 2}deg)`,
              borderRadius: '50%'
            }}
          />
        )}

        {/* Target Achievement Badge */}
        {targetStatus === 'achieved' && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Target className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Competency Label */}
      <div className="text-center min-h-[40px]">
        <h4 className="text-sm font-medium text-white capitalize leading-tight">
          {label || competency?.replace(/([A-Z])/g, ' $1').trim()}
        </h4>
        
        {/* Target Status */}
        <div className={`text-xs mt-1 ${
          targetStatus === 'achieved' ? 'text-green-400' :
          targetStatus === 'close' ? 'text-blue-400' :
          'text-gray-400'
        }`}>
          Target: {targetValue}% 
          {targetDate && ` • ${formatTargetDate(targetDate)}`}
        </div>
      </div>

      {/* Trend Indicator */}
      {showTrend && !isNeutralTrend && (
        <div className={`flex items-center space-x-1 text-xs transition-opacity duration-500 ${
          showTrend ? 'opacity-100' : 'opacity-0'
        }`}>
          {isPositiveTrend ? (
            <TrendingUp className="w-3 h-3 text-green-400" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-400" />
          )}
          <span className={isPositiveTrend ? 'text-green-400' : 'text-red-400'}>
            {isPositiveTrend ? '+' : ''}{trendValue}%
          </span>
          <span className="text-gray-500">this week</span>
        </div>
      )}

      {/* Neutral Trend */}
      {showTrend && isNeutralTrend && (
        <div className="flex items-center space-x-1 text-xs text-gray-400 transition-opacity duration-500">
          <span>No change this week</span>
        </div>
      )}
    </div>
  );
};

/**
 * CompetencyGrid - Grid layout for multiple competencies
 */
export const CompetencyGrid = ({ 
  competencies = [], 
  className = '',
  size = 80,
  showTargetDates = true 
}) => {
  return (
    <div className={`grid grid-cols-3 gap-6 ${className}`}>
      {competencies.map((competency, index) => (
        <CircularProgressPremium
          key={competency.key || index}
          competency={competency.key}
          currentValue={competency.current || 0}
          previousValue={competency.previous || 0}
          targetValue={competency.target || 70}
          targetDate={showTargetDates ? competency.targetDate : null}
          label={competency.label}
          size={size}
          animationDelay={index * 200} // Stagger animations
        />
      ))}
    </div>
  );
};

/**
 * NextMilestonePreview - Shows upcoming milestone
 */
export const NextMilestonePreview = ({ 
  milestone, 
  completionPercentage = 0,
  className = '' 
}) => {
  if (!milestone) return null;

  return (
    <div className={`mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-white">Next Milestone</span>
        </div>
        <span className="text-xs text-purple-400 font-medium">
          {Math.round(completionPercentage)}% complete
        </span>
      </div>
      
      <p className="text-sm text-gray-300 mb-3">
        {milestone.name || 'Advanced Revenue Intelligence'}
      </p>
      
      {/* Milestone Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
        <span>Foundation → Growth</span>
        <span>Est. 2 weeks</span>
      </div>
    </div>
  );
};

export default CircularProgressPremium;