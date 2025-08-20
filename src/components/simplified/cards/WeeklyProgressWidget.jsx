import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

/**
 * WeeklyProgressWidget - Compact weekly task and progress tracking
 * Features:
 * - Task completion visualization with pie chart
 * - Progress comparison vs previous week
 * - Task breakdown by category
 * - Weekly streak tracking
 */

const WeeklyProgressWidget = ({
  completed = 8,
  total = 12,
  previousWeekCompleted = 6,
  streak = 3,
  categories = {
    'Customer Analysis': 3,
    'Value Communication': 2,
    'Business Development': 3
  },
  className = ''
}) => {
  const [animatedCompleted, setAnimatedCompleted] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Animate completion count
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedCompleted(completed);
    }, 200);
    return () => clearTimeout(timer);
  }, [completed]);

  // Calculate metrics
  const completionRate = (completed / total) * 100;
  const previousRate = (previousWeekCompleted / total) * 100;
  const weekOverWeekChange = completionRate - previousRate;
  const remaining = total - completed;

  // Pie chart data
  const pieData = [
    { name: 'Completed', value: completed, color: '#10B981' },
    { name: 'Remaining', value: remaining, color: '#374151' }
  ];

  // Get completion status
  const getCompletionStatus = () => {
    if (completionRate >= 90) return { label: 'Excellent', color: 'text-green-400' };
    if (completionRate >= 75) return { label: 'Good', color: 'text-blue-400' };
    if (completionRate >= 50) return { label: 'Fair', color: 'text-yellow-400' };
    return { label: 'Needs Focus', color: 'text-red-400' };
  };

  const status = getCompletionStatus();

  return (
    <div 
      className={`space-y-3 ${className}`}
      onClick={() => setShowBreakdown(!showBreakdown)}
    >
      {/* Main Progress Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Pie Chart */}
          <div className="relative w-12 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={14}
                  outerRadius={20}
                  paddingAngle={2}
                  dataKey="value"
                  animationDuration={1000}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {Math.round(completionRate)}%
              </span>
            </div>
          </div>

          {/* Task Count */}
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-lg font-bold text-white">
                {animatedCompleted}
              </span>
              <span className="text-sm text-gray-400">
                /{total}
              </span>
            </div>
            <p className="text-xs text-gray-400">tasks done</p>
          </div>
        </div>

        {/* Week-over-week Change */}
        <div className="text-right">
          <div className="flex items-center space-x-1">
            {weekOverWeekChange > 0 ? (
              <TrendingUp className="w-3 h-3 text-green-400" />
            ) : (
              <Clock className="w-3 h-3 text-gray-400" />
            )}
            <span className={`text-xs font-medium ${
              weekOverWeekChange > 0 ? 'text-green-400' : 
              weekOverWeekChange < 0 ? 'text-red-400' : 'text-gray-400'
            }`}>
              {weekOverWeekChange > 0 ? '+' : ''}{weekOverWeekChange.toFixed(0)}%
            </span>
          </div>
          <p className="text-xs text-gray-500">vs last week</p>
        </div>
      </div>

      {/* Status and Streak */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-3 h-3 text-green-400" />
          <span className={status.color}>{status.label}</span>
        </div>
        
        {streak > 0 && (
          <div className="flex items-center space-x-1">
            <Target className="w-3 h-3 text-purple-400" />
            <span className="text-purple-400">{streak} week streak</span>
          </div>
        )}
      </div>

      {/* Task Breakdown */}
      {showBreakdown && (
        <div className="mt-3 p-2 bg-gray-800/50 rounded border border-gray-700 space-y-1">
          <p className="text-xs font-medium text-white mb-2">This Week's Focus</p>
          {Object.entries(categories).map(([category, count]) => (
            <div key={category} className="flex justify-between items-center text-xs">
              <span className="text-gray-300">{category}</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-white">{count}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeeklyProgressWidget;