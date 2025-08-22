import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Lock, 
  Unlock, 
  Star, 
  ChevronRight,
  Zap,
  Target,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Crown,
  Sparkles
} from 'lucide-react';

/**
 * Professional Level Progression - ESSENTIAL PHASE
 * 
 * Shows professional development journey through buyer intelligence mastery levels.
 * Each level unlocks new revenue intelligence capabilities and tools.
 * Provides clear progression path from Foundation to Master level.
 */

const ProfessionalLevelProgression = ({
  currentLevel = {},
  totalExperience = 0,
  unlockedCapabilities = [],
  onLevelClick
}) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);

  // Professional development levels with unlock requirements
  const levels = [
    {
      key: 'foundation',
      name: 'Revenue Intelligence Foundation',
      experienceRequired: 0,
      icon: Target,
      color: 'gray',
      description: 'Building fundamental buyer understanding capabilities',
      unlocks: [
        'Basic ICP Analysis',
        'Cost Calculator Access',
        'Simple Business Cases',
        'Resource Library'
      ],
      benefits: [
        'Track buyer intelligence actions',
        'Earn professional development points',
        'Access foundational tools'
      ]
    },
    {
      key: 'practitioner',
      name: 'Buyer Intelligence Practitioner',
      experienceRequired: 500,
      icon: TrendingUp,
      color: 'blue',
      description: 'Developing systematic approach to buyer intelligence',
      unlocks: [
        'Advanced ICP Segmentation',
        'Stakeholder Mapping Tools',
        'Competitive Intelligence Framework',
        'Value Translation Templates'
      ],
      benefits: [
        'Priority action recommendations',
        'Leading indicator tracking',
        'Pattern recognition insights'
      ]
    },
    {
      key: 'specialist',
      name: 'Revenue Operations Specialist',
      experienceRequired: 1200,
      icon: Users,
      color: 'purple',
      description: 'Mastering revenue intelligence orchestration',
      unlocks: [
        'Multi-Stakeholder Analysis',
        'Deal Risk Prediction Models',
        'Pipeline Health Analytics',
        'Conversion Velocity Optimization'
      ],
      benefits: [
        'Predictive revenue insights',
        'Automated action prioritization',
        'Cross-functional intelligence synthesis'
      ]
    },
    {
      key: 'strategist',
      name: 'Strategic Revenue Strategist',
      experienceRequired: 2500,
      icon: Zap,
      color: 'yellow',
      description: 'Driving strategic revenue transformation',
      unlocks: [
        'Executive Decision Frameworks',
        'Market Positioning Intelligence',
        'Strategic Account Planning',
        'Revenue Acceleration Playbooks'
      ],
      benefits: [
        'C-suite intelligence briefs',
        'Market opportunity analysis',
        'Strategic initiative tracking'
      ]
    },
    {
      key: 'architect',
      name: 'Revenue Intelligence Architect',
      experienceRequired: 5000,
      icon: Award,
      color: 'green',
      description: 'Architecting enterprise revenue systems',
      unlocks: [
        'Custom Intelligence Workflows',
        'Enterprise Integration Hub',
        'AI-Powered Insights Engine',
        'Revenue Command Center'
      ],
      benefits: [
        'System-wide intelligence orchestration',
        'Custom workflow automation',
        'Enterprise-grade analytics'
      ]
    },
    {
      key: 'master',
      name: 'Revenue Intelligence Master',
      experienceRequired: 10000,
      icon: Crown,
      color: 'gold',
      description: 'Series B readiness achieved - complete revenue mastery',
      unlocks: [
        'Full Platform Autonomy',
        'Custom AI Model Training',
        'Revenue Intelligence API',
        'White-Label Capabilities'
      ],
      benefits: [
        'Complete platform control',
        'Unlimited customization',
        'Revenue intelligence certification'
      ]
    }
  ];

  // Calculate level progress
  const getCurrentLevelIndex = () => {
    return levels.findIndex(l => l.key === currentLevel.key) || 0;
  };

  const getNextLevel = () => {
    const currentIndex = getCurrentLevelIndex();
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
  };

  const calculateProgressToNext = () => {
    const nextLevel = getNextLevel();
    if (!nextLevel) return 100;
    
    const currentLevelData = levels[getCurrentLevelIndex()];
    const experienceInLevel = totalExperience - currentLevelData.experienceRequired;
    const experienceNeeded = nextLevel.experienceRequired - currentLevelData.experienceRequired;
    
    return Math.min(100, Math.max(0, (experienceInLevel / experienceNeeded) * 100));
  };

  const isLevelUnlocked = (level) => {
    return totalExperience >= level.experienceRequired;
  };

  const isLevelActive = (level) => {
    return level.key === currentLevel.key;
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    if (onLevelClick) {
      onLevelClick(level);
    }
  };

  // Check for recent unlock
  useEffect(() => {
    const checkForUnlock = () => {
      const previousLevel = levels[getCurrentLevelIndex() - 1];
      if (previousLevel && totalExperience >= levels[getCurrentLevelIndex()].experienceRequired) {
        setShowUnlockAnimation(true);
        setTimeout(() => setShowUnlockAnimation(false), 3000);
      }
    };
    checkForUnlock();
  }, [totalExperience, currentLevel]);

  const getLevelStyles = (level) => {
    const colorMap = {
      gray: { bg: 'from-gray-900/30 to-slate-900/30', border: 'border-gray-500/40', icon: 'text-gray-400', badge: 'bg-gray-500/20 text-gray-300' },
      blue: { bg: 'from-blue-900/30 to-cyan-900/30', border: 'border-blue-500/40', icon: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-300' },
      purple: { bg: 'from-purple-900/30 to-indigo-900/30', border: 'border-purple-500/40', icon: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-300' },
      yellow: { bg: 'from-yellow-900/30 to-orange-900/30', border: 'border-yellow-500/40', icon: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-300' },
      green: { bg: 'from-green-900/30 to-emerald-900/30', border: 'border-green-500/40', icon: 'text-green-400', badge: 'bg-green-500/20 text-green-300' },
      gold: { bg: 'from-yellow-800/30 to-amber-800/30', border: 'border-yellow-400/40', icon: 'text-yellow-300', badge: 'bg-yellow-400/20 text-yellow-200' }
    };
    return colorMap[level.color] || colorMap.gray;
  };

  return (
    <div className="space-y-6">
      
      {/* Header with current progress */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">Professional Development Journey</h3>
            <p className="text-gray-400 text-sm">
              Unlock advanced revenue intelligence capabilities through systematic progression
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Total Experience</div>
            <div className="text-2xl font-bold text-white">{totalExperience.toLocaleString()}</div>
          </div>
        </div>

        {/* Progress to next level */}
        {getNextLevel() && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progress to {getNextLevel().name}</span>
              <span className="text-white">
                {(getNextLevel().experienceRequired - totalExperience).toLocaleString()} exp needed
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${calculateProgressToNext()}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Level progression path */}
      <div className="relative">
        {/* Connection line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700"></div>
        
        {/* Levels */}
        <div className="space-y-4">
          {levels.map((level, index) => {
            const IconComponent = level.icon;
            const styles = getLevelStyles(level);
            const unlocked = isLevelUnlocked(level);
            const active = isLevelActive(level);
            
            return (
              <motion.div
                key={level.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                onClick={() => unlocked && handleLevelSelect(level)}
              >
                {/* Level indicator */}
                <div className={`absolute left-4 w-8 h-8 rounded-full border-2 ${
                  active ? 'bg-purple-500 border-purple-400' : 
                  unlocked ? 'bg-gray-700 border-gray-500' : 
                  'bg-gray-800 border-gray-600'
                } flex items-center justify-center`}>
                  {unlocked ? (
                    active ? (
                      <Sparkles className="w-4 h-4 text-white" />
                    ) : (
                      <Unlock className="w-3 h-3 text-gray-300" />
                    )
                  ) : (
                    <Lock className="w-3 h-3 text-gray-500" />
                  )}
                </div>

                {/* Level card */}
                <div className={`ml-12 bg-gradient-to-r ${styles.bg} border ${
                  active ? 'border-purple-500' : styles.border
                } rounded-xl p-5 hover:scale-[1.01] transition-all duration-200`}>
                  
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-black/20`}>
                        <IconComponent className={`w-5 h-5 ${styles.icon}`} />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg flex items-center">
                          {level.name}
                          {active && (
                            <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                              Current
                            </span>
                          )}
                        </h4>
                        <p className="text-gray-400 text-sm">{level.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Required</div>
                      <div className={`font-semibold ${unlocked ? 'text-green-400' : 'text-gray-400'}`}>
                        {level.experienceRequired.toLocaleString()} exp
                      </div>
                    </div>
                  </div>

                  {/* Unlocks grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <div className="text-xs text-gray-400 mb-2">Unlocks:</div>
                      <div className="space-y-1">
                        {level.unlocks.map((unlock, i) => (
                          <div key={i} className="flex items-center space-x-1">
                            <Star className={`w-3 h-3 ${unlocked ? styles.icon : 'text-gray-500'}`} />
                            <span className={`text-xs ${unlocked ? 'text-gray-200' : 'text-gray-500'}`}>
                              {unlock}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-400 mb-2">Benefits:</div>
                      <div className="space-y-1">
                        {level.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-center space-x-1">
                            <CheckCircle className={`w-3 h-3 ${unlocked ? 'text-green-400' : 'text-gray-500'}`} />
                            <span className={`text-xs ${unlocked ? 'text-gray-200' : 'text-gray-500'}`}>
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  {unlocked && (
                    <div className="flex justify-end">
                      <ChevronRight className={`w-4 h-4 ${styles.icon}`} />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Unlock animation */}
      <AnimatePresence>
        {showUnlockAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-gradient-to-r from-purple-900 to-blue-900 border-2 border-purple-500 rounded-xl p-8 shadow-2xl">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white text-center mb-2">Level Unlocked!</h2>
              <p className="text-purple-200 text-center">
                New revenue intelligence capabilities available
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom context */}
      <div className="bg-gradient-to-r from-gray-900/50 to-slate-900/50 border border-gray-700 rounded-xl p-4">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            <span className="text-white font-medium">Strategic Progression:</span> Each level represents mastery of specific revenue intelligence competencies, unlocking tools and insights that compound your ability to drive systematic revenue growth.
          </p>
        </div>
      </div>
    </div>
  );
};

// Add missing CheckCircle import
const CheckCircle = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default ProfessionalLevelProgression;