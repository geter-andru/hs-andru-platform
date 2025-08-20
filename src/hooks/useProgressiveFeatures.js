/**
 * Progressive Features Hook
 * 
 * Adaptive interface management based on professional competency assessment
 * Provides progressive feature unlocking with professional development language
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import ProgressiveFeatureManager from '../services/ProgressiveFeatureManager.js';

export const useProgressiveFeatures = (userId, competencyLevel, skillLevels) => {
  const [availableFeatures, setAvailableFeatures] = useState(new Set());
  const [featureUnlocks, setFeatureUnlocks] = useState([]);
  const [adaptiveContent, setAdaptiveContent] = useState({});
  const [professionalMilestones, setProfessionalMilestones] = useState([]);
  
  const previousFeatures = useRef(new Set());
  const previousCompetencyLevel = useRef(competencyLevel);
  
  // Determine available features based on competency assessment
  const featureAccess = useMemo(() => {
    if (!competencyLevel || !skillLevels) {
      return {
        level: 'foundation',
        features: ['basic_tools'],
        complexity: 'simplified',
        sidebarMode: 'guidance_focused',
        uiElements: ['basic_navigation']
      };
    }
    
    return ProgressiveFeatureManager.determineFeatureAccess(competencyLevel, skillLevels);
  }, [competencyLevel, skillLevels]);
  
  // Update available features and detect new unlocks
  useEffect(() => {
    if (!featureAccess) return;
    
    const newFeatures = new Set(featureAccess.features);
    const previousFeaturesSet = previousFeatures.current;
    
    // Detect newly unlocked features
    const newlyUnlocked = [...newFeatures].filter(feature => !previousFeaturesSet.has(feature));
    
    if (newlyUnlocked.length > 0 && previousFeaturesSet.size > 0) {
      // Create professional milestone notifications for new features
      const newMilestones = newlyUnlocked.map(feature => ({
        feature,
        timestamp: Date.now(),
        competencyLevel,
        skillTrigger: ProgressiveFeatureManager.getUnlockTrigger(feature, skillLevels),
        notification: ProgressiveFeatureManager.getMilestoneNotification({ feature }),
        acknowledged: false
      }));
      
      setFeatureUnlocks(prev => [...prev, ...newMilestones]);
      setProfessionalMilestones(prev => [...prev, ...newMilestones]);
    }
    
    setAvailableFeatures(newFeatures);
    previousFeatures.current = newFeatures;
    
    // Update adaptive content based on new feature access
    if (competencyLevel && skillLevels) {
      const content = ProgressiveFeatureManager.getAdaptiveContent(competencyLevel, skillLevels);
      setAdaptiveContent(content);
    }
    
  }, [featureAccess, competencyLevel, skillLevels]);
  
  // Track competency level changes for milestone detection
  useEffect(() => {
    if (previousCompetencyLevel.current !== competencyLevel && previousCompetencyLevel.current) {
      // Competency level advancement milestone
      const levelMilestone = {
        feature: `competency_${competencyLevel}`,
        timestamp: Date.now(),
        competencyLevel,
        type: 'competency_advancement',
        notification: {
          title: `${ProgressiveFeatureManager.getProgressLabel(competencyLevel)} Achieved`,
          description: `Congratulations on advancing to ${competencyLevel} level professional competency.`,
          professionalImpact: ProgressiveFeatureManager.getCapabilityDescription(skillLevels),
          competencyEvidence: 'Demonstrated consistent professional methodology application across all competencies',
          nextCapability: ProgressiveFeatureManager.getNextLevelDescription(competencyLevel).title
        },
        acknowledged: false
      };
      
      setProfessionalMilestones(prev => [...prev, levelMilestone]);
    }
    
    previousCompetencyLevel.current = competencyLevel;
  }, [competencyLevel, skillLevels]);
  
  // Check if specific feature is available
  const hasFeature = (featureName) => {
    return availableFeatures.has(featureName);
  };
  
  // Get contextual guidance based on current context and skill level
  const getContextualGuidance = (context) => {
    if (!competencyLevel || !skillLevels) return null;
    return ProgressiveFeatureManager.getContextualGuidance(context, competencyLevel, skillLevels);
  };
  
  // Get sidebar content for specific context
  const getSidebarContent = (context) => {
    if (!adaptiveContent.sidebar || !context) return null;
    return adaptiveContent.sidebar[context] || adaptiveContent.sidebar.dashboard;
  };
  
  // Get dashboard content based on competency level
  const getDashboardContent = () => {
    return adaptiveContent.dashboard;
  };
  
  // Get messaging content for current competency level
  const getMessagingContent = () => {
    return adaptiveContent.messaging;
  };
  
  // Get professional milestones from last 24 hours (unacknowledged)
  const getRecentProfessionalMilestones = () => {
    const twentyFourHoursAgo = Date.now() - 86400000;
    return professionalMilestones
      .filter(milestone => 
        milestone.timestamp > twentyFourHoursAgo && 
        !milestone.acknowledged
      )
      .sort((a, b) => b.timestamp - a.timestamp);
  };
  
  // Acknowledge a professional milestone
  const acknowledgeMilestone = (milestoneFeature) => {
    setProfessionalMilestones(prev => 
      prev.map(milestone => 
        milestone.feature === milestoneFeature 
          ? { ...milestone, acknowledged: true, acknowledgedAt: Date.now() }
          : milestone
      )
    );
  };
  
  // Get feature readiness for upcoming capabilities
  const getFeatureReadiness = (featureName) => {
    if (!skillLevels) return null;
    
    const isReady = ProgressiveFeatureManager.checkFeatureReadiness(skillLevels, featureName);
    const trigger = ProgressiveFeatureManager.getUnlockTrigger(featureName, skillLevels);
    
    return {
      ready: isReady,
      currentScore: skillLevels[trigger.primarySkill] || skillLevels.overall,
      requiredScore: trigger.threshold,
      description: trigger.description,
      progress: Math.min((skillLevels[trigger.primarySkill] || skillLevels.overall) / trigger.threshold, 1.0)
    };
  };
  
  // Get adaptive UI configuration
  const getUIConfiguration = () => {
    if (!featureAccess) return { mode: 'basic', complexity: 'simplified' };
    
    return {
      mode: featureAccess.level,
      complexity: featureAccess.complexity,
      sidebarMode: featureAccess.sidebarMode,
      uiElements: featureAccess.uiElements,
      navigationStyle: competencyLevel === 'foundation' ? 'guided' : 
                      competencyLevel === 'developing' ? 'enhanced' :
                      competencyLevel === 'proficient' ? 'full' : 'expert'
    };
  };
  
  // Get professional development status
  const getProfessionalDevelopmentStatus = () => {
    return {
      currentLevel: competencyLevel,
      levelDescription: ProgressiveFeatureManager.getProgressLabel(competencyLevel),
      capabilityDescription: ProgressiveFeatureManager.getCapabilityDescription(skillLevels),
      nextLevelInfo: ProgressiveFeatureManager.getNextLevelDescription(competencyLevel),
      recentMilestones: getRecentProfessionalMilestones().length,
      totalFeaturesUnlocked: availableFeatures.size
    };
  };
  
  // Get competency-based recommendations
  const getCompetencyRecommendations = () => {
    if (!competencyLevel || !skillLevels) return [];
    
    const messagingContent = adaptiveContent.messaging;
    if (!messagingContent) return [];
    
    return [
      {
        type: 'motivational',
        content: messagingContent.motivationalContext,
        priority: 'low'
      },
      {
        type: 'guidance',
        content: messagingContent.guidanceEmphasis,
        priority: 'medium'
      },
      {
        type: 'progress',
        content: messagingContent.progressCelebration,
        priority: 'high'
      }
    ];
  };
  
  // Check if user should see advanced features
  const shouldShowAdvancedFeatures = () => {
    return featureAccess.complexity !== 'simplified' && availableFeatures.has('advanced_customization');
  };
  
  // Check if user should see professional milestones
  const shouldShowProfessionalMilestones = () => {
    return getRecentProfessionalMilestones().length > 0;
  };
  
  // Get tool complexity level for adaptive interfaces
  const getToolComplexity = () => {
    return featureAccess.complexity;
  };
  
  // Get professional language helpers
  const getProfessionalLanguageHelpers = () => {
    return {
      getProgressLabel: () => ProgressiveFeatureManager.getProgressLabel(competencyLevel),
      getCapabilityDescription: () => ProgressiveFeatureManager.getCapabilityDescription(skillLevels),
      getNextLevelDescription: () => ProgressiveFeatureManager.getNextLevelDescription(competencyLevel),
      getWelcomeMessage: () => adaptiveContent.messaging?.welcomeMessage,
      getMotivationalContext: () => adaptiveContent.messaging?.motivationalContext
    };
  };
  
  return {
    // Feature access
    hasFeature,
    availableFeatures: [...availableFeatures],
    featureAccess,
    getFeatureReadiness,
    
    // Adaptive content
    adaptiveContent,
    getSidebarContent,
    getDashboardContent,
    getMessagingContent,
    getContextualGuidance,
    
    // Professional development (stealth gamification)
    professionalMilestones: getRecentProfessionalMilestones(),
    acknowledgeMilestone,
    shouldShowProfessionalMilestones,
    getProfessionalDevelopmentStatus,
    
    // UI configuration
    getUIConfiguration,
    toolComplexity: getToolComplexity(),
    interfaceMode: featureAccess.level,
    shouldShowAdvancedFeatures,
    
    // Professional language and guidance
    getProfessionalLanguageHelpers,
    getCompetencyRecommendations,
    
    // Development tracking
    totalFeatureUnlocks: featureUnlocks.length,
    recentUnlocks: getRecentProfessionalMilestones(),
    competencyLevel,
    
    // Helper methods
    isFoundationLevel: competencyLevel === 'foundation',
    isDevelopingLevel: competencyLevel === 'developing',
    isProficientLevel: competencyLevel === 'proficient',
    isAdvancedLevel: competencyLevel === 'advanced'
  };
};

export default useProgressiveFeatures;