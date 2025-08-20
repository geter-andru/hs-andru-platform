import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Calculator } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

/**
 * RevenueImpactWidget - Premium revenue opportunity tracking
 * Features:
 * - Revenue opportunity calculation with trend analysis
 * - Growth projections and target tracking
 * - Mini area chart for revenue trend visualization
 * - Interactive elements for deeper insights
 */

const RevenueImpactWidget = ({
  opportunity = 750000,
  currentRevenue = 125000,
  growthRate = 0.15,
  targetRevenue = 200000,
  timeframe = 12,
  className = ''
}) => {
  const [animatedOpportunity, setAnimatedOpportunity] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // Animate revenue opportunity on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedOpportunity(opportunity);
    }, 300);
    return () => clearTimeout(timer);
  }, [opportunity]);

  // Generate revenue trend data
  const generateRevenueData = () => {
    const months = 6;
    const data = [];
    
    for (let i = 0; i < months; i++) {
      const monthlyGrowth = Math.pow(1 + growthRate/12, i);
      const projectedRevenue = currentRevenue * monthlyGrowth;
      const noise = (Math.random() - 0.5) * 0.1 * projectedRevenue;
      
      data.push({
        month: i + 1,
        revenue: Math.round(projectedRevenue + noise),
        opportunity: Math.round(opportunity * (0.8 + 0.2 * (i / months)))
      });
    }
    
    return data;
  };

  const revenueData = generateRevenueData();
  
  // Calculate metrics
  const monthlyGrowthRate = ((currentRevenue * Math.pow(1 + growthRate, 1/12)) - currentRevenue) / currentRevenue;
  const projectedRevenue = currentRevenue * Math.pow(1 + growthRate, timeframe/12);
  const isOnTrack = projectedRevenue >= targetRevenue * 0.9;
  
  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-white text-sm font-medium">
          Month {label}: {formatCurrency(payload[0].value)}
        </p>
        <p className="text-gray-400 text-xs">
          Projected revenue growth
        </p>
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Revenue Metric */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-2xl font-bold text-white">
              {formatCurrency(animatedOpportunity)}
            </span>
          </div>
          <p className="text-sm text-gray-400">Revenue opportunity</p>
        </div>
        
        {/* Growth Indicator */}
        <div className="flex items-center space-x-1 text-sm">
          {monthlyGrowthRate > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
          <span className={monthlyGrowthRate > 0 ? 'text-green-400' : 'text-red-400'}>
            {(monthlyGrowthRate * 100).toFixed(1)}%/mo
          </span>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="h-16 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              animationDuration={1500}
            />
            <Tooltip content={<CustomTooltip />} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Progress Metrics */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-gray-400">Current</div>
          <div className="text-white font-medium">{formatCurrency(currentRevenue)}</div>
        </div>
        <div>
          <div className="text-gray-400">Target</div>
          <div className={`font-medium ${isOnTrack ? 'text-green-400' : 'text-yellow-400'}`}>
            {formatCurrency(targetRevenue)}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
        >
          <Calculator className="w-3 h-3 inline mr-1" />
          Calculate
        </button>
        <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors">
          <Target className="w-3 h-3 inline mr-1" />
          Forecast
        </button>
      </div>

      {/* Detailed Breakdown */}
      {showDetails && (
        <div className="mt-3 p-3 bg-gray-800/50 rounded border border-gray-700 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">12-month projection:</span>
            <span className="text-white">{formatCurrency(projectedRevenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Growth needed:</span>
            <span className={isOnTrack ? 'text-green-400' : 'text-yellow-400'}>
              {((targetRevenue - currentRevenue) / currentRevenue * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Status:</span>
            <span className={isOnTrack ? 'text-green-400' : 'text-yellow-400'}>
              {isOnTrack ? 'On track' : 'Needs acceleration'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueImpactWidget;