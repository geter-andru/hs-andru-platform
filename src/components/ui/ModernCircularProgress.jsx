import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * ModernCircularProgress - Professional circular progress component
 * 
 * Features:
 * - 120px diameter with large percentage displays
 * - Smooth animations with spring physics
 * - Professional color schemes
 * - Customizable stroke width and colors
 * - Center content support for additional metrics
 */

const ModernCircularProgress = ({
  percentage = 0,
  size = 120,
  strokeWidth = 8,
  color = 'purple',
  backgroundColor = '#374151',
  showPercentage = true,
  centerContent,
  label,
  animated = true,
  className = ''
}) => {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayPercentage / 100) * circumference;

  // Color schemes for different states
  const colorSchemes = {
    purple: {
      primary: '#8B5CF6',
      gradient: 'url(#purpleGradient)',
      glow: '#8B5CF6'
    },
    blue: {
      primary: '#3B82F6',
      gradient: 'url(#blueGradient)',
      glow: '#3B82F6'
    },
    green: {
      primary: '#10B981',
      gradient: 'url(#greenGradient)',
      glow: '#10B981'
    },
    orange: {
      primary: '#F59E0B',
      gradient: 'url(#orangeGradient)',
      glow: '#F59E0B'
    },
    red: {
      primary: '#EF4444',
      gradient: 'url(#redGradient)',
      glow: '#EF4444'
    }
  };

  const currentColor = colorSchemes[color] || colorSchemes.purple;

  // Animate percentage counter
  useEffect(() => {
    if (!animated) {
      setDisplayPercentage(percentage);
      return;
    }

    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();
    const startPercentage = displayPercentage;
    const targetPercentage = Math.max(0, Math.min(100, percentage));

    const animateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startPercentage + (targetPercentage - startPercentage) * easeOut;
      
      setDisplayPercentage(Math.round(currentValue));
      
      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      }
    };

    requestAnimationFrame(animateCounter);
  }, [percentage, animated]);

  return (
    <div className={`relative inline-flex items-center justify-center touch-manipulation ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{
          filter: `drop-shadow(0 0 8px ${currentColor.glow}30)`
        }}
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>

        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />

        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={currentColor.gradient}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: animated ? 1.5 : 0,
            ease: [0.25, 0.46, 0.45, 0.94] // Custom cubic-bezier for smooth animation
          }}
          style={{
            filter: `drop-shadow(0 0 4px ${currentColor.glow}50)`
          }}
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {showPercentage && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-baseline"
          >
            <span className="text-xl sm:text-2xl font-bold text-white">
              {displayPercentage}
            </span>
            <span className="text-base sm:text-lg text-gray-400 ml-1">%</span>
          </motion.div>
        )}
        
        {centerContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-1"
          >
            {centerContent}
          </motion.div>
        )}
        
        {label && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-2 text-xs text-gray-400 font-medium max-w-[80px] leading-tight"
          >
            {label}
          </motion.div>
        )}
      </div>
    </div>
  );
};

/**
 * ModernProgressGroup - Group multiple progress circles
 */
const ModernProgressGroup = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-8 ${className}`}>
      {children}
    </div>
  );
};

/**
 * ModernMiniProgress - Smaller version for compact displays
 */
const ModernMiniProgress = ({
  percentage = 0,
  color = 'purple',
  label,
  size = 60,
  className = ''
}) => {
  return (
    <ModernCircularProgress
      percentage={percentage}
      size={size}
      strokeWidth={4}
      color={color}
      label={label}
      className={className}
    />
  );
};

export default ModernCircularProgress;
export { ModernProgressGroup, ModernMiniProgress };