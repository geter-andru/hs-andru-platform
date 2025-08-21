/**
 * Hook for managing external assessment integration
 * Handles fetching, syncing, and applying external assessment data from andru-ai.com
 */

import { useState, useEffect, useCallback } from 'react';
import { externalAssessmentService } from '../services/externalAssessmentService';

export const useExternalAssessment = (customerId, userEmail = null) => {
  const [assessmentState, setAssessmentState] = useState({
    isLoading: false,
    isAvailable: false,
    isIntegrated: false,
    hasRecentSync: false,
    competencyData: null,
    behavioralProfile: null,
    developmentPlan: null,
    error: null,
    lastSync: null,
    syncInProgress: false
  });

  // Check availability on mount
  useEffect(() => {
    if (customerId && userEmail) {
      checkAssessmentAvailability();
    }
  }, [customerId, userEmail]);

  /**
   * Check if external assessment data is available
   */
  const checkAssessmentAvailability = useCallback(async () => {
    if (!userEmail) return;
    
    setAssessmentState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const availability = await externalAssessmentService.checkExternalAssessmentAvailability(userEmail);
      
      setAssessmentState(prev => ({
        ...prev,
        isLoading: false,
        isAvailable: availability.available,
        lastSync: availability.lastAssessment,
        hasRecentSync: availability.lastAssessment ? 
          (Date.now() - new Date(availability.lastAssessment).getTime()) < (7 * 24 * 60 * 60 * 1000) : false
      }));
      
    } catch (error) {
      console.error('Error checking assessment availability:', error);
      setAssessmentState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
        isAvailable: false
      }));
    }
  }, [userEmail]);

  /**
   * Integrate external assessment data
   */
  const integrateAssessment = useCallback(async (forceSync = false) => {
    if (!customerId || !userEmail) {
      throw new Error('Customer ID and email are required for integration');
    }
    
    setAssessmentState(prev => ({ ...prev, syncInProgress: true, error: null }));
    
    try {
      console.log('🔄 Starting external assessment integration...');
      
      const integrationResult = await externalAssessmentService.integrateExternalAssessment(
        customerId, 
        userEmail
      );
      
      if (integrationResult.success) {
        setAssessmentState(prev => ({
          ...prev,
          isIntegrated: true,
          syncInProgress: false,
          competencyData: integrationResult.competencyData,
          behavioralProfile: integrationResult.behavioralProfile,
          developmentPlan: integrationResult.developmentPlan,
          lastSync: new Date().toISOString(),
          hasRecentSync: true,
          error: null
        }));
        
        console.log('✅ External assessment integration completed successfully');
        
        return {
          success: true,
          data: {
            competencyData: integrationResult.competencyData,
            behavioralProfile: integrationResult.behavioralProfile,
            developmentPlan: integrationResult.developmentPlan
          }
        };
      } else {
        // Handle fallback to local assessment
        setAssessmentState(prev => ({
          ...prev,
          syncInProgress: false,
          error: integrationResult.error,
          isIntegrated: false
        }));
        
        if (integrationResult.fallbackToLocal) {
          console.log('⚠️ Falling back to local assessment system');
          return {
            success: false,
            fallbackToLocal: true,
            error: integrationResult.error
          };
        }
        
        throw new Error(integrationResult.error);
      }
      
    } catch (error) {
      console.error('Error integrating external assessment:', error);
      setAssessmentState(prev => ({
        ...prev,
        syncInProgress: false,
        error: error.message,
        isIntegrated: false
      }));
      
      return {
        success: false,
        error: error.message
      };
    }
  }, [customerId, userEmail]);

  /**
   * Sync external assessment data (periodic updates)
   */
  const syncAssessment = useCallback(async (forceSync = false) => {
    if (!customerId || !userEmail) {
      console.warn('Cannot sync assessment: missing customer ID or email');
      return { success: false, error: 'Missing required parameters' };
    }
    
    setAssessmentState(prev => ({ ...prev, syncInProgress: true, error: null }));
    
    try {
      const syncResult = await externalAssessmentService.syncExternalAssessmentData(
        customerId,
        userEmail,
        forceSync
      );
      
      if (syncResult.success) {
        if (syncResult.skipped) {
          console.log('⏭️ Assessment sync skipped - recent sync detected');
          setAssessmentState(prev => ({
            ...prev,
            syncInProgress: false,
            hasRecentSync: true
          }));
        } else {
          console.log('✅ Assessment sync completed');
          setAssessmentState(prev => ({
            ...prev,
            syncInProgress: false,
            lastSync: syncResult.timestamp,
            hasRecentSync: true,
            isIntegrated: true,
            error: null
          }));
          
          // If sync result includes new data, update state
          if (syncResult.result?.competencyData) {
            setAssessmentState(prev => ({
              ...prev,
              competencyData: syncResult.result.competencyData,
              behavioralProfile: syncResult.result.behavioralProfile,
              developmentPlan: syncResult.result.developmentPlan
            }));
          }
        }
      } else {
        setAssessmentState(prev => ({
          ...prev,
          syncInProgress: false,
          error: syncResult.error
        }));
      }
      
      return syncResult;
      
    } catch (error) {
      console.error('Error syncing assessment:', error);
      setAssessmentState(prev => ({
        ...prev,
        syncInProgress: false,
        error: error.message
      }));
      
      return { success: false, error: error.message };
    }
  }, [customerId, userEmail]);

  /**
   * Get enhancement suggestions based on external assessment
   */
  const getAssessmentEnhancements = useCallback(() => {
    if (!assessmentState.competencyData || !assessmentState.behavioralProfile) {
      return null;
    }
    
    const enhancements = {
      competencyInsights: [],
      behavioralAdaptations: [],
      toolRecommendations: []
    };
    
    // Generate competency insights
    Object.keys(assessmentState.competencyData).forEach(category => {
      const data = assessmentState.competencyData[category];
      if (data.baseline < 70) {
        enhancements.competencyInsights.push({
          category,
          insight: `${category} shows opportunity for development`,
          currentScore: data.baseline,
          targetScore: 70,
          priority: data.baseline < 50 ? 'high' : 'medium'
        });
      }
    });
    
    // Generate behavioral adaptations
    const profile = assessmentState.behavioralProfile;
    if (profile.communicationStyle === 'analytical') {
      enhancements.behavioralAdaptations.push({
        adaptation: 'Leverage data-driven tools and detailed analytics',
        tools: ['Cost Calculator', 'ROI Analysis'],
        benefit: 'Aligns with analytical communication preference'
      });
    }
    
    if (profile.learningPreference === 'visual-kinesthetic') {
      enhancements.behavioralAdaptations.push({
        adaptation: 'Use interactive and visual learning tools',
        tools: ['ICP Analysis Visual Framework', 'Interactive Business Case Builder'],
        benefit: 'Optimizes learning efficiency based on preferred style'
      });
    }
    
    // Generate tool recommendations
    enhancements.toolRecommendations = [
      {
        tool: 'ICP Analysis',
        reason: 'Enhance customer intelligence based on assessment profile',
        priority: 'high',
        expectedImpact: 'Improved prospect qualification and targeting'
      },
      {
        tool: 'Cost Calculator',
        reason: 'Develop quantified value communication skills',
        priority: 'medium',
        expectedImpact: 'Better ROI articulation and objection handling'
      }
    ];
    
    return enhancements;
  }, [assessmentState.competencyData, assessmentState.behavioralProfile]);

  /**
   * Reset assessment state
   */
  const resetAssessment = useCallback(() => {
    setAssessmentState({
      isLoading: false,
      isAvailable: false,
      isIntegrated: false,
      hasRecentSync: false,
      competencyData: null,
      behavioralProfile: null,
      developmentPlan: null,
      error: null,
      lastSync: null,
      syncInProgress: false
    });
  }, []);

  return {
    // State
    ...assessmentState,
    
    // Actions
    checkAvailability: checkAssessmentAvailability,
    integrateAssessment,
    syncAssessment,
    resetAssessment,
    
    // Computed values
    canIntegrate: assessmentState.isAvailable && !assessmentState.syncInProgress,
    needsSync: assessmentState.isAvailable && !assessmentState.hasRecentSync,
    enhancements: getAssessmentEnhancements(),
    
    // Helper functions
    getLastSyncAge: () => {
      if (!assessmentState.lastSync) return null;
      const ageMs = Date.now() - new Date(assessmentState.lastSync).getTime();
      const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
      return ageDays;
    },
    
    isRecentSync: (thresholdDays = 7) => {
      const age = assessmentState.lastSync ? 
        (Date.now() - new Date(assessmentState.lastSync).getTime()) / (1000 * 60 * 60 * 24) : 
        Infinity;
      return age < thresholdDays;
    }
  };
};

export default useExternalAssessment;