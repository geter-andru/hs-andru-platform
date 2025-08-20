/**
 * Behavioral Tracking Hook
 * 
 * Invisible user interaction tracking for professional competency assessment
 * Integrates seamlessly with existing components without disrupting UX
 */

import { useEffect, useRef, useCallback } from 'react';
import behavioralIntelligenceService from '../services/BehavioralIntelligenceService.js';

export const useBehavioralTracking = (componentName, userId) => {
  const startTime = useRef(Date.now());
  const interactions = useRef({});
  const sectionTimers = useRef({});
  
  // Initialize tracking when hook mounts
  useEffect(() => {
    if (userId && componentName) {
      behavioralIntelligenceService.recordVisit(userId, componentName);
      startTime.current = Date.now();
    }
    
    // Cleanup function to record session when component unmounts
    return () => {
      if (userId && componentName) {
        const sessionDuration = Date.now() - startTime.current;
        behavioralIntelligenceService.recordSession(userId, componentName, {
          duration: sessionDuration,
          interactions: interactions.current,
          endTime: Date.now()
        });
      }
    };
  }, [componentName, userId]);
  
  // Track time spent in component sections
  const trackSectionTime = useCallback((sectionName) => {
    if (!userId || !componentName) return () => {};
    
    const sectionStartTime = Date.now();
    sectionTimers.current[sectionName] = sectionStartTime;
    
    // Return cleanup function to stop tracking
    return () => {
      const sectionEndTime = Date.now();
      const duration = sectionEndTime - sectionStartTime;
      
      // Record the section interaction
      behavioralIntelligenceService.recordInteraction(userId, componentName, {
        section: sectionName,
        duration: duration,
        startTime: sectionStartTime,
        endTime: sectionEndTime
      });
      
      // Update local interactions reference
      interactions.current[`${sectionName}Time`] = 
        (interactions.current[`${sectionName}Time`] || 0) + duration;
    };
  }, [componentName, userId]);
  
  // Track specific user actions
  const trackAction = useCallback((actionType, actionData = {}) => {
    if (!userId || !componentName) return;
    
    // Update local interaction count
    interactions.current[actionType] = (interactions.current[actionType] || 0) + 1;
    
    // Record the action
    behavioralIntelligenceService.recordAction(userId, componentName, actionType, {
      ...actionData,
      timestamp: Date.now(),
      sessionTime: Date.now() - startTime.current
    });
  }, [componentName, userId]);
  
  // Track export behavior with rich context
  const trackExport = useCallback((exportType, exportData = {}) => {
    if (!userId || !componentName) return;
    
    const exportContext = {
      type: exportType,
      componentContext: componentName,
      timestamp: Date.now(),
      sessionDuration: Date.now() - startTime.current,
      data: exportData
    };
    
    behavioralIntelligenceService.recordExport(userId, exportContext);
    trackAction('export', exportContext);
  }, [componentName, userId, trackAction]);
  
  // Track customization activities
  const trackCustomization = useCallback((customizationType, customizationData = {}) => {
    if (!userId || !componentName) return;
    
    trackAction('customization', { 
      type: customizationType, 
      ...customizationData,
      timestamp: Date.now()
    });
  }, [trackAction]);
  
  // Track tool sequence for workflow analysis
  const trackToolSequence = useCallback((toolName) => {
    if (!userId) return;
    
    behavioralIntelligenceService.recordToolSequence(userId, toolName);
  }, [userId]);
  
  // Track professional methodology usage patterns
  const trackMethodologyUsage = useCallback((methodologyType, usageData = {}) => {
    if (!userId || !componentName) return;
    
    trackAction('methodology_usage', {
      methodology: methodologyType,
      ...usageData,
      professionalApplication: true
    });
  }, [trackAction]);
  
  // Track stakeholder-focused interactions
  const trackStakeholderInteraction = useCallback((stakeholderType, interactionData = {}) => {
    if (!userId || !componentName) return;
    
    trackAction('stakeholder_interaction', {
      stakeholder: stakeholderType,
      ...interactionData,
      executiveReadiness: true
    });
  }, [trackAction]);
  
  // Track value communication patterns
  const trackValueCommunication = useCallback((communicationType, communicationData = {}) => {
    if (!userId || !componentName) return;
    
    trackAction('value_communication', {
      type: communicationType,
      ...communicationData,
      professionalCommunication: true
    });
  }, [trackAction]);
  
  // Track return usage patterns for competency assessment
  const trackReturnUsage = useCallback((returnType = 'reference') => {
    if (!userId || !componentName) return;
    
    trackAction('return_usage', {
      type: returnType,
      indicates: 'professional_reference_behavior'
    });
  }, [trackAction]);
  
  // Track deep analysis patterns
  const trackDeepAnalysis = useCallback((analysisType, analysisData = {}) => {
    if (!userId || !componentName) return;
    
    trackAction('deep_analysis', {
      type: analysisType,
      ...analysisData,
      indicates: 'sophisticated_analytical_thinking'
    });
  }, [trackAction]);
  
  // Get current session statistics
  const getSessionStats = useCallback(() => {
    return {
      sessionDuration: Date.now() - startTime.current,
      interactions: Object.keys(interactions.current).length,
      component: componentName,
      userId: userId
    };
  }, [componentName, userId]);
  
  return {
    // Core tracking functions
    trackSectionTime,
    trackAction,
    trackExport,
    trackCustomization,
    trackToolSequence,
    
    // Professional competency tracking
    trackMethodologyUsage,
    trackStakeholderInteraction,  
    trackValueCommunication,
    trackReturnUsage,
    trackDeepAnalysis,
    
    // Session information
    getSessionStats,
    
    // Convenience methods for common patterns
    trackBuyerPersonaClick: (personaId) => 
      trackAction('buyer_persona_click', { personaId }),
    
    trackPainPointExploration: (painPointId) => 
      trackAction('pain_point_exploration', { painPointId }),
    
    trackVariableAdjustment: (variable, value) => 
      trackAction('variable_adjustment', { variable, value }),
    
    trackMethodologyReview: () => 
      trackAction('methodology_review_start'),
    
    trackEdgeCaseTesting: (scenario) => 
      trackAction('edge_case_testing', { scenario }),
    
    trackStakeholderViewSwitch: (fromView, toView) => 
      trackAction('stakeholder_view_switch', { from: fromView, to: toView }),
    
    trackContentCustomization: (customizationType) =>
      trackAction('content_customization', { type: customizationType }),
    
    trackAutoPopulationAccept: (dataType) =>
      trackAction('auto_population_accept', { dataType }),
    
    trackSectionNavigation: (fromSection, toSection) =>
      trackAction('section_navigation', { from: fromSection, to: toSection }),
    
    trackTabChange: (fromTab, toTab) =>
      trackAction('tab_change', { from: fromTab, to: toTab })
  };
};

export default useBehavioralTracking;