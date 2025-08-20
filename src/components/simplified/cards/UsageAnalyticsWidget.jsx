import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, Zap, Eye, TrendingUp } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

/**
 * UsageAnalyticsWidget - Compact usage metrics and engagement tracking
 * Features:
 * - Monthly hours with daily breakdown
 * - Most used tools visualization
 * - Engagement score and trends
 * - Quick access patterns
 */

const UsageAnalyticsWidget = ({
  monthlyHours = 24,
  dailyAverage = 0.8,
  mostUsedTool = 'ICP Analysis',
  engagementScore = 78,
  toolUsage = {
    'ICP': 12,
    'Cost Calc': 8,
    'Business Case': 4
  },
  weeklyPattern = [1.2, 0.9, 1.1, 0.6, 1.0, 0.3, 0.4],
  className = ''
}) => {
  const [animatedHours, setAnimatedHours] = useState(0);
  const [showPattern, setShowPattern] = useState(false);

  // Animate hours on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedHours(monthlyHours);
    }, 300);
    return () => clearTimeout(timer);
  }, [monthlyHours]);

  // Generate weekly pattern data
  const patternData = weeklyPattern.map((hours, index) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
    hours: hours,
    isWeekend: index >= 5
  }));

  // Calculate metrics
  const targetHours = 30;
  const progressToTarget = (monthlyHours / targetHours) * 100;
  const isOnTrack = progressToTarget >= 75;

  // Get engagement level - professional colors only
  const getEngagementLevel = () => {
    if (engagementScore >= 80) return { label: 'High', color: 'text-blue-400', icon: Zap };
    if (engagementScore >= 60) return { label: 'Good', color: 'text-blue-400', icon: TrendingUp };
    if (engagementScore >= 40) return { label: 'Fair', color: 'text-gray-300', icon: Clock };
    return { label: 'Low', color: 'text-gray-400', icon: Eye };
  };

  const engagement = getEngagementLevel();
  const EngagementIcon = engagement.icon;

  // Custom tooltip for daily pattern
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg px-2 py-1 shadow-lg">
        <p className="text-white text-xs">
          {label}: {payload[0].value.toFixed(1)}h
        </p>
      </div>
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Hours Display */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-xl font-bold text-white">
              {Math.round(animatedHours)}h
            </span>
          </div>
          <p className="text-xs text-gray-400">this month</p>
        </div>
        
        {/* Progress to Target */}
        <div className="text-right">
          <div className={`text-xs font-medium ${isOnTrack ? 'text-blue-400' : 'text-gray-300'}`}>
            {Math.round(progressToTarget)}%
          </div>
          <p className="text-xs text-gray-500">of target</p>
        </div>
      </div>

      {/* Daily Average and Most Used Tool */}
      <div className="grid grid-cols-1 gap-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">Daily average:</span>
          <span className="text-white">{dailyAverage.toFixed(1)}h</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Most used:</span>
          <span className="text-blue-400">{mostUsedTool}</span>
        </div>
      </div>

      {/* Engagement Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <EngagementIcon className={`w-3 h-3 ${engagement.color}`} />
          <span className="text-xs text-gray-400">Engagement:</span>
        </div>
        <span className={`text-xs font-medium ${engagement.color}`}>
          {engagementScore}% {engagement.label}
        </span>
      </div>

      {/* Weekly Pattern Toggle */}
      <button
        onClick={() => setShowPattern(!showPattern)}
        className="w-full flex items-center justify-center space-x-1 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
      >
        <BarChart3 className="w-3 h-3" />
        <span>{showPattern ? 'Hide' : 'Show'} Pattern</span>
      </button>

      {/* Weekly Usage Pattern */}
      {showPattern && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-medium text-white">7-Day Pattern</p>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patternData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                />
                <Bar 
                  dataKey="hours" 
                  fill="#3B82F6"
                  radius={[2, 2, 0, 0]}
                  animationDuration={1000}
                />
                <Tooltip content={<CustomTooltip />} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Tool Usage Breakdown */}
          <div className="mt-2 space-y-1">
            <p className="text-xs font-medium text-gray-400">Tool Usage</p>
            {Object.entries(toolUsage).map(([tool, hours]) => (
              <div key={tool} className="flex justify-between items-center">
                <span className="text-xs text-gray-300">{tool}</span>
                <div className="flex items-center space-x-1">
                  <div 
                    className="h-1 bg-blue-500 rounded"
                    style={{ width: `${(hours / Math.max(...Object.values(toolUsage))) * 20}px` }}
                  />
                  <span className="text-xs text-white">{hours}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageAnalyticsWidget;