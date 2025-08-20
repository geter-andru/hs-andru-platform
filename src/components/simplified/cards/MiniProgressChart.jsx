import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

/**
 * MiniProgressChart - Compact 30-day progress visualization
 * Features:
 * - Sparkline-style mini charts
 * - Smooth line animations
 * - Custom tooltips
 * - Multiple competency overlays
 * - Gradient fills and professional styling
 */

const MiniProgressChart = ({ 
  data = [],
  competencyKey = 'customerAnalysis',
  color = '#3B82F6',
  height = 60,
  showTooltip = true,
  animate = true,
  className = ''
}) => {
  const [animatedData, setAnimatedData] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Generate sample 30-day data if none provided
  const generateSampleData = (competencyKey, currentValue = 65) => {
    const days = 30;
    const data = [];
    const baseValue = Math.max(currentValue - 15, 30); // Start 15 points lower
    
    for (let i = 0; i < days; i++) {
      const progress = i / (days - 1); // 0 to 1
      const noise = (Math.random() - 0.5) * 4; // Random variation ±2
      const trend = progress * 15; // Upward trend of 15 points
      const value = Math.max(baseValue + trend + noise, 0);
      
      data.push({
        day: i + 1,
        date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        [competencyKey]: Math.round(value),
        label: `Day ${i + 1}`
      });
    }
    
    return data;
  };

  // Use provided data or generate sample data
  const chartData = data.length > 0 ? data : generateSampleData(competencyKey, 65);

  // Animate chart data on mount
  useEffect(() => {
    if (!animate) {
      setAnimatedData(chartData);
      return;
    }

    setIsAnimating(true);
    
    // Stagger the data points for smooth animation
    let currentIndex = 0;
    const animationInterval = setInterval(() => {
      if (currentIndex < chartData.length) {
        setAnimatedData(prev => [...prev, chartData[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(animationInterval);
        setIsAnimating(false);
      }
    }, 20); // 20ms between points for smooth animation

    return () => clearInterval(animationInterval);
  }, [chartData, animate]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0];
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-white text-sm font-medium">
          {data.value}% competency
        </p>
        <p className="text-gray-400 text-xs">
          {data.payload?.date || `Day ${label}`}
        </p>
      </div>
    );
  };

  // Calculate trend
  const startValue = chartData[0]?.[competencyKey] || 0;
  const endValue = chartData[chartData.length - 1]?.[competencyKey] || 0;
  const trendChange = endValue - startValue;
  const isPositiveTrend = trendChange > 0;

  return (
    <div className={`relative ${className}`}>
      {/* Chart Container */}
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={animatedData}>
            <defs>
              {/* Gradient for line */}
              <linearGradient id={`gradient-${competencyKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="100%" stopColor={color} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            <Line
              type="monotone"
              dataKey={competencyKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
              fill={`url(#gradient-${competencyKey})`}
              animationDuration={animate ? 1500 : 0}
              animationEasing="ease-out"
            />
            
            {showTooltip && (
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '3 3' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Indicator */}
      <div className="absolute top-1 right-1 flex items-center space-x-1">
        <div className={`text-xs font-medium ${
          isPositiveTrend ? 'text-green-400' : 'text-red-400'
        }`}>
          {isPositiveTrend ? '+' : ''}{trendChange}%
        </div>
        <div className="text-xs text-gray-500">30d</div>
      </div>

      {/* Loading Indicator */}
      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

/**
 * MultiCompetencyChart - Shows all competencies in one chart
 */
export const MultiCompetencyChart = ({ 
  competencies = [],
  height = 80,
  showLegend = true,
  className = ''
}) => {
  const colors = {
    customerAnalysis: '#3B82F6',   // Blue
    valueCommunication: '#10B981', // Green  
    executiveReadiness: '#F59E0B'  // Yellow
  };

  // Generate data for all competencies
  const generateMultiData = () => {
    const days = 30;
    const data = [];
    
    for (let i = 0; i < days; i++) {
      const dataPoint = {
        day: i + 1,
        date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toLocaleDateString()
      };
      
      competencies.forEach(comp => {
        const baseValue = Math.max((comp.current || 65) - 15, 30);
        const progress = i / (days - 1);
        const noise = (Math.random() - 0.5) * 3;
        const trend = progress * 15;
        dataPoint[comp.key] = Math.round(Math.max(baseValue + trend + noise, 0));
      });
      
      data.push(dataPoint);
    }
    
    return data;
  };

  const chartData = generateMultiData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-gray-400 text-xs mb-1">
          {payload[0]?.payload?.date || `Day ${label}`}
        </p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.dataKey}: {entry.value}%
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            {competencies.map(comp => (
              <Line
                key={comp.key}
                type="monotone"
                dataKey={comp.key}
                stroke={colors[comp.key] || '#6B7280'}
                strokeWidth={2}
                dot={false}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            ))}
            
            <Tooltip content={<CustomTooltip />} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex justify-center space-x-4 mt-2">
          {competencies.map(comp => (
            <div key={comp.key} className="flex items-center space-x-1">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors[comp.key] || '#6B7280' }}
              />
              <span className="text-xs text-gray-400 capitalize">
                {comp.label || comp.key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MiniProgressChart;