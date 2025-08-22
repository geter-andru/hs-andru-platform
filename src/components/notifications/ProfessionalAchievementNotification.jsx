import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, TrendingUp, Award, Zap, Target, CheckCircle } from 'lucide-react';

/**
 * Professional Achievement Notification - CORE PHASE
 * 
 * Real-time mini-celebrations for buyer intelligence actions disguised as
 * professional development milestones. Provides immediate dopamine feedback
 * without gaming terminology.
 */

const ProfessionalAchievementNotification = ({ 
  achievements = [], 
  onDismiss,
  position = 'top-right' 
}) => {
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    if (achievements.length > 0) {
      // Add new achievements to queue
      const newAchievements = achievements.filter(
        a => !queue.find(q => q.id === a.id) && a.id !== currentAchievement?.id
      );
      setQueue(prev => [...prev, ...newAchievements]);
    }
  }, [achievements, queue, currentAchievement]);

  useEffect(() => {
    // Process queue when no current achievement is showing
    if (!currentAchievement && queue.length > 0) {
      const next = queue[0];
      setCurrentAchievement(next);
      setQueue(prev => prev.slice(1));
      
      // Auto-dismiss after delay
      const timer = setTimeout(() => {
        handleDismiss();
      }, getDisplayDuration(next.type));
      
      return () => clearTimeout(timer);
    }
  }, [currentAchievement, queue]);

  const handleDismiss = () => {
    setCurrentAchievement(null);
    if (onDismiss && currentAchievement) {
      onDismiss(currentAchievement.id);
    }
  };

  const getDisplayDuration = (type) => {
    // Bigger achievements get longer celebration time
    switch (type) {
      case 'level_advancement': return 6000; // 6 seconds for level ups
      case 'milestone_reached': return 5000; // 5 seconds for milestones
      case 'streak_achievement': return 4000; // 4 seconds for streaks
      case 'action_completed': return 3000; // 3 seconds for regular actions
      default: return 3500;
    }
  };

  const getAchievementIcon = (type, category) => {
    const iconMap = {
      level_advancement: Trophy,
      milestone_reached: Award,
      streak_achievement: Zap,
      action_completed: CheckCircle,
      buyer_intelligence: Target,
      competitive_analysis: TrendingUp,
      value_translation: Star
    };
    
    return iconMap[type] || iconMap[category] || CheckCircle;
  };

  const getAchievementColors = (type, impact) => {
    if (type === 'level_advancement') {
      return {
        bg: 'bg-gradient-to-r from-purple-900/90 to-blue-900/90',
        border: 'border-purple-500',
        icon: 'text-purple-400',
        text: 'text-purple-200',
        accent: 'text-purple-300'
      };
    }
    
    if (type === 'milestone_reached') {
      return {
        bg: 'bg-gradient-to-r from-yellow-900/90 to-orange-900/90',
        border: 'border-yellow-500',
        icon: 'text-yellow-400',
        text: 'text-yellow-200',
        accent: 'text-yellow-300'
      };
    }
    
    // Regular actions based on impact
    switch (impact) {
      case 'high':
        return {
          bg: 'bg-gradient-to-r from-green-900/90 to-emerald-900/90',
          border: 'border-green-500',
          icon: 'text-green-400',
          text: 'text-green-200',
          accent: 'text-green-300'
        };
      case 'medium':
        return {
          bg: 'bg-gradient-to-r from-blue-900/90 to-cyan-900/90',
          border: 'border-blue-500',
          icon: 'text-blue-400',
          text: 'text-blue-200',
          accent: 'text-blue-300'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-900/90 to-slate-900/90',
          border: 'border-gray-500',
          icon: 'text-gray-400',
          text: 'text-gray-200',
          accent: 'text-gray-300'
        };
    }
  };

  const getPositionClasses = () => {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4'
    };
    return positions[position] || positions['top-right'];
  };

  if (!currentAchievement) return null;

  const colors = getAchievementColors(
    currentAchievement.type, 
    currentAchievement.impact || 'medium'
  );
  const IconComponent = getAchievementIcon(
    currentAchievement.type, 
    currentAchievement.category
  );

  return (
    <div className={`fixed ${getPositionClasses()} z-50 pointer-events-none`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAchievement.id}
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25,
            duration: 0.4
          }}
          className="pointer-events-auto"
        >
          <div 
            className={`
              ${colors.bg} ${colors.border} border-2 rounded-xl p-4 
              backdrop-blur-sm shadow-2xl max-w-sm min-w-[280px]
              transform transition-all duration-300 hover:scale-105
              cursor-pointer
            `}
            onClick={handleDismiss}
          >
            {/* Header with icon and close hint */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <motion.div
                  initial={{ rotate: -20, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                  className={`p-2 rounded-full bg-black/20`}
                >
                  <IconComponent className={`w-5 h-5 ${colors.icon}`} />
                </motion.div>
                <div>
                  <h3 className={`${colors.text} font-semibold text-sm leading-tight`}>
                    {currentAchievement.title}
                  </h3>
                  <p className={`${colors.accent} text-xs`}>
                    Professional Development
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500">tap to dismiss</div>
            </div>

            {/* Achievement details */}
            <div className="mb-3">
              <p className={`${colors.text} text-sm mb-2`}>
                {currentAchievement.description}
              </p>
              
              {/* Experience/Points earned */}
              {currentAchievement.experienceGained && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`${colors.accent} text-sm font-medium`}
                >
                  +{currentAchievement.experienceGained} Professional Development Points
                </motion.div>
              )}

              {/* Business impact note */}
              {currentAchievement.businessImpact && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-400 text-xs mt-1"
                >
                  Impact: {currentAchievement.businessImpact}
                </motion.div>
              )}
            </div>

            {/* Progress indicator for level advancement */}
            {currentAchievement.type === 'level_advancement' && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.8, duration: 1 }}
                className="w-full bg-black/20 rounded-full h-2 overflow-hidden"
              >
                <div 
                  className={`h-full ${colors.icon.replace('text-', 'bg-')} rounded-full`}
                  style={{ 
                    width: `${currentAchievement.progressPercentage || 100}%` 
                  }}
                />
              </motion.div>
            )}

            {/* Celebration particles for major achievements */}
            {(currentAchievement.type === 'level_advancement' || 
              currentAchievement.type === 'milestone_reached') && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: 0.3, duration: 2, repeat: 1 }}
                className="absolute -top-2 -right-2"
              >
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ 
                        scale: [0, 1, 0], 
                        rotate: [0, 180, 360],
                        y: [0, -20, -40],
                        x: [0, Math.random() * 20 - 10]
                      }}
                      transition={{ 
                        delay: 0.5 + i * 0.1, 
                        duration: 1.5,
                        ease: "easeOut"
                      }}
                      className={`w-2 h-2 ${colors.icon.replace('text-', 'bg-')} rounded-full`}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/**
 * Hook for triggering professional development notifications
 */
export const useProfessionalNotifications = () => {
  const [achievements, setAchievements] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(new Set());

  const showAchievement = (achievement) => {
    // Prevent duplicate notifications
    if (dismissedIds.has(achievement.id)) return;
    
    const enrichedAchievement = {
      id: achievement.id || `achievement_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      ...achievement
    };
    
    setAchievements(prev => [...prev, enrichedAchievement]);
  };

  const onDismiss = (id) => {
    setDismissedIds(prev => new Set([...prev, id]));
    setAchievements(prev => prev.filter(a => a.id !== id));
  };

  // Pre-built achievement templates for common actions
  const templates = {
    viewedResource: (resourceName, experiencePoints = 10) => ({
      type: 'action_completed',
      category: 'buyer_intelligence',
      title: 'Strategic Research Completed',
      description: `Reviewed ${resourceName} for competitive intelligence`,
      experienceGained: experiencePoints,
      businessImpact: 'Enhanced buyer understanding capability',
      impact: 'low'
    }),

    copiedFramework: (frameworkName, experiencePoints = 5) => ({
      type: 'action_completed',
      category: 'value_translation',
      title: 'Framework Implementation',
      description: `Applied ${frameworkName} to systematic approach`,
      experienceGained: experiencePoints,
      businessImpact: 'Accelerated stakeholder communication',
      impact: 'medium'
    }),

    completedTask: (taskName, experiencePoints = 15) => ({
      type: 'action_completed',
      category: 'competitive_analysis',
      title: 'Strategic Action Executed',
      description: `Completed ${taskName}`,
      experienceGained: experiencePoints,
      businessImpact: 'Direct revenue intelligence advancement',
      impact: 'high'
    }),

    reachedLevel: (newLevel, totalExperience) => ({
      type: 'level_advancement',
      title: `Professional Level: ${newLevel}`,
      description: 'Revenue intelligence capabilities advanced',
      experienceGained: 0, // Level advancement doesn't give points
      businessImpact: 'Systematic competitive advantage unlocked',
      totalExperience,
      impact: 'high'
    }),

    achievedMilestone: (milestoneName, experienceGained = 50) => ({
      type: 'milestone_reached',
      title: `Milestone: ${milestoneName}`,
      description: 'Strategic business development objective completed',
      experienceGained,
      businessImpact: 'Series B readiness progression',
      impact: 'high'
    })
  };

  return {
    showAchievement,
    achievements,
    onDismiss,
    templates
  };
};

export default ProfessionalAchievementNotification;