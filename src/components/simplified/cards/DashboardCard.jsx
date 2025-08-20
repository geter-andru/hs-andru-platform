import React from 'react';
import { motion } from 'framer-motion';

/**
 * DashboardCard - Premium reusable card component for SimplifiedDashboard
 * Provides consistent styling, animations, and accessibility
 */

const DashboardCard = ({ 
  children, 
  className = '', 
  size = 'medium', // small, medium, large
  priority = 'normal', // high, medium, normal
  loading = false,
  error = null,
  onClick = null,
  hover = true,
  testId,
  ...props 
}) => {
  // Size variants for CSS Grid
  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-2', 
    large: 'col-span-4'
  };

  // Priority styling for visual hierarchy
  const priorityClasses = {
    high: 'border-purple-500/30 shadow-purple-500/10 bg-gray-800',
    medium: 'border-blue-500/20 shadow-blue-500/5 bg-gray-800', 
    normal: 'border-gray-700 bg-gray-800'
  };

  // Base card styles following design system with compact spacing
  const paddingClasses = {
    small: 'p-3',
    medium: 'p-3', 
    large: 'p-4'
  };

  const baseClasses = `
    ${priorityClasses[priority]}
    rounded-lg 
    shadow-lg 
    ${paddingClasses[size]}
    ${sizeClasses[size]} 
    ${hover && onClick ? 'cursor-pointer transition-all duration-200 hover:border-blue-500/50 hover:shadow-xl hover:bg-gray-800/80' : ''}
    ${className}
  `;

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    hover: hover && onClick ? { 
      y: -2,
      transition: { duration: 0.2, ease: 'easeInOut' }
    } : {}
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={baseClasses} data-testid={testId}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={baseClasses} data-testid={testId}>
        <div className="flex items-center justify-center h-full min-h-[100px] text-center">
          <div>
            <div className="text-red-400 text-2xl mb-2">⚠️</div>
            <p className="text-gray-400 text-sm">Failed to load</p>
            <p className="text-gray-500 text-xs mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={baseClasses}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={onClick}
      data-testid={testId}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * CardHeader - Consistent header styling for cards with compact spacing
 */
export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-start justify-between mb-2 ${className}`}>
    <div>
      <h3 className="text-base font-semibold text-white leading-tight">{title}</h3>
      {subtitle && (
        <p className="text-xs text-gray-400 mt-0.5 leading-tight">{subtitle}</p>
      )}
    </div>
    {action && (
      <div className="ml-3">{action}</div>
    )}
  </div>
);

/**
 * CardMetric - Large metric display component
 */
export const CardMetric = ({ 
  value, 
  label, 
  trend = null, 
  color = 'text-white',
  size = 'large' 
}) => {
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl'
  };

  return (
    <div className="flex items-center space-x-3">
      <div>
        <div className={`font-bold ${color} ${sizeClasses[size]}`}>
          {value}
        </div>
        <div className="text-gray-400 text-sm">{label}</div>
      </div>
      {trend && (
        <div className={`text-sm font-medium ${
          trend.direction === 'up' ? 'text-green-400' : 
          trend.direction === 'down' ? 'text-red-400' : 
          'text-gray-400'
        }`}>
          {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'} {trend.value}
        </div>
      )}
    </div>
  );
};

/**
 * CardProgress - Progress bar component for cards
 */
export const CardProgress = ({ 
  value, 
  max = 100, 
  label, 
  color = 'bg-blue-500',
  showPercentage = true 
}) => {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">{label}</span>
          {showPercentage && (
            <span className="text-gray-400">{percentage}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`${color} h-2 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

/**
 * CardAction - Consistent button styling for cards
 */
export const CardAction = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onClick,
  disabled = false,
  className = ''
}) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200',
    outline: 'border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]} 
        ${sizes[size]}
        rounded-lg 
        font-medium 
        transition-colors 
        duration-200 
        disabled:opacity-50 
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default DashboardCard;