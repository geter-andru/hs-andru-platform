/**
 * Skill Assessment Hook
 * 
 * Real-time professional competency evaluation based on behavioral patterns
 * Provides adaptive skill assessment with professional development language
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import SkillAssessmentEngine from '../services/SkillAssessmentEngine.js';
import behavioralIntelligenceService from '../services/BehavioralIntelligenceService.js';

export const useSkillAssessment = (userId) => {
  const [skillLevels, setSkillLevels] = useState({
    customerAnalysis: 0,
    valueCommunication: 0, 
    executiveReadiness: 0,
    overall: 0,
    lastAssessment: Date.now()
  });
  
  const [competencyLevel, setCompetencyLevel] = useState('foundation');
  const [isLoading, setIsLoading] = useState(true);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [progressVelocity, setProgressVelocity] = useState(null);
  
  const lastAssessmentTime = useRef(0);
  const assessmentCache = useRef(null);
  
  // Real-time skill assessment update
  const updateSkillAssessment = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Throttle assessments to prevent excessive calculations
      const now = Date.now();
      if (now - lastAssessmentTime.current < 5000) { // 5 second throttle
        return;
      }
      lastAssessmentTime.current = now;
      
      // Get comprehensive behavioral data
      const behavioralData = await behavioralIntelligenceService.getUserBehaviorData(userId);
      
      // Perform skill assessment
      const newSkillLevels = SkillAssessmentEngine.assessAllSkills(behavioralData);
      const newCompetencyLevel = SkillAssessmentEngine.determineCompetencyLevel(newSkillLevels);
      
      // Update state
      setSkillLevels(newSkillLevels);
      setCompetencyLevel(newCompetencyLevel);
      
      // Update assessment history and calculate velocity
      setAssessmentHistory(prevHistory => {
        const newHistory = [...prevHistory, newSkillLevels].slice(-10); // Keep last 10 assessments
        
        // Calculate progress velocity if we have previous assessments
        if (newHistory.length >= 2) {
          const previousAssessment = newHistory[newHistory.length - 2];
          const velocity = SkillAssessmentEngine.calculateProgressVelocity(newSkillLevels, previousAssessment);
          setProgressVelocity(velocity);
        }
        
        return newHistory;
      });
      
      // Cache the assessment for quick access
      assessmentCache.current = {
        skillLevels: newSkillLevels,
        competencyLevel: newCompetencyLevel,
        timestamp: now
      };
      
      // Sync to Airtable in background (non-blocking)
      behavioralIntelligenceService.syncSkillAssessment(userId, newSkillLevels);
      
    } catch (error) {
      console.warn('Skill assessment update failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);
  
  // Listen for behavioral events and trigger assessment updates
  useEffect(() => {
    if (!userId) return;
    
    const handleBehavioralUpdate = (event) => {
      if (event.detail?.userId === userId) {
        updateSkillAssessment();
      }
    };
    
    // Listen for behavioral intelligence updates
    window.addEventListener('h_s_platform_behavioral_update', handleBehavioralUpdate);
    
    // Initial assessment load
    updateSkillAssessment();
    
    // Periodic assessment updates (every 2 minutes for active sessions)
    const assessmentInterval = setInterval(updateSkillAssessment, 120000);
    
    return () => {
      window.removeEventListener('h_s_platform_behavioral_update', handleBehavioralUpdate);
      clearInterval(assessmentInterval);
    };
  }, [updateSkillAssessment, userId]);
  
  // Get professional development improvement path
  const getImprovementPath = useCallback(() => {
    return SkillAssessmentEngine.generateImprovementPath(skillLevels);
  }, [skillLevels]);
  
  // Check if user is ready for specific features
  const checkFeatureReadiness = useCallback((featureName) => {
    return SkillAssessmentEngine.checkFeatureReadiness(skillLevels, featureName);
  }, [skillLevels]);
  
  // Get professional development description
  const getProgressDescription = useCallback(() => {
    return SkillAssessmentEngine.getProgressDescription(competencyLevel);
  }, [competencyLevel]);
  
  // Get next professional milestone
  const getNextMilestone = useCallback(() => {
    return SkillAssessmentEngine.getNextMilestone(competencyLevel);
  }, [competencyLevel]);
  
  // Get professional achievements (competency milestones)
  const getProfessionalAchievements = useCallback(() => {
    return SkillAssessmentEngine.getProfessionalAchievements(skillLevels);
  }, [skillLevels]);
  
  // Get competency guidance for specific skills
  const getCompetencyGuidance = useCallback((specificSkill = null) => {
    if (specificSkill) {
      return SkillAssessmentEngine.getCompetencyGuidance(competencyLevel, specificSkill);
    }
    
    // Return guidance for the lowest skill area
    const lowestSkill = skillLevels.customerAnalysis <= skillLevels.valueCommunication && 
                       skillLevels.customerAnalysis <= skillLevels.executiveReadiness ? 'customerAnalysis' :
                       skillLevels.valueCommunication <= skillLevels.executiveReadiness ? 'valueCommunication' :
                       'executiveReadiness';
    
    return SkillAssessmentEngine.getCompetencyGuidance(competencyLevel, lowestSkill);
  }, [competencyLevel, skillLevels]);
  
  // Predict time to next competency level
  const getTimeToNextLevel = useCallback(() => {
    if (!progressVelocity) return null;
    return SkillAssessmentEngine.predictTimeToNextLevel(skillLevels, progressVelocity);
  }, [skillLevels, progressVelocity]);
  
  // Get skill level categories for UI display
  const getSkillCategories = useCallback(() => {
    return {
      foundation: skillLevels.overall < 40,
      developing: skillLevels.overall >= 40 && skillLevels.overall < 70,
      proficient: skillLevels.overall >= 70 && skillLevels.overall < 85,
      advanced: skillLevels.overall >= 85
    };
  }, [skillLevels.overall]);
  
  // Get individual skill assessments with descriptions
  const getDetailedSkillAssessment = useCallback(() => {
    return {
      customerAnalysis: {
        score: skillLevels.customerAnalysis,
        description: SkillAssessmentEngine.getCompetencyDescription(skillLevels.customerAnalysis),
        competency: 'Customer Analysis Methodology',
        focus: 'Systematic prospect research and qualification'
      },
      valueCommunication: {
        score: skillLevels.valueCommunication,
        description: SkillAssessmentEngine.getCompetencyDescription(skillLevels.valueCommunication),
        competency: 'Value Communication Excellence',
        focus: 'Financial analysis and ROI presentation'
      },
      executiveReadiness: {
        score: skillLevels.executiveReadiness,
        description: SkillAssessmentEngine.getCompetencyDescription(skillLevels.executiveReadiness),
        competency: 'Executive Communication Readiness',
        focus: 'Multi-stakeholder business communication'
      }
    };
  }, [skillLevels]);
  
  // Get progress trends
  const getProgressTrends = useCallback(() => {
    if (assessmentHistory.length < 2) return null;
    
    const current = assessmentHistory[assessmentHistory.length - 1];
    const previous = assessmentHistory[assessmentHistory.length - 2];
    
    return {
      customerAnalysisTrend: current.customerAnalysis - previous.customerAnalysis,
      valueCommunicationTrend: current.valueCommunication - previous.valueCommunication,
      executiveReadinessTrend: current.executiveReadiness - previous.executiveReadiness,
      overallTrend: current.overall - previous.overall,
      timeSpan: current.lastAssessment - previous.lastAssessment
    };
  }, [assessmentHistory]);
  
  // Check if skill assessment shows professional competency growth
  const hasProfessionalGrowth = useCallback(() => {
    const trends = getProgressTrends();
    if (!trends) return false;
    
    return trends.overallTrend > 0 || 
           trends.customerAnalysisTrend > 5 ||
           trends.valueCommunicationTrend > 5 ||
           trends.executiveReadinessTrend > 5;
  }, [getProgressTrends]);
  
  // Get balanced competency assessment
  const getCompetencyBalance = useCallback(() => {
    const skills = [skillLevels.customerAnalysis, skillLevels.valueCommunication, skillLevels.executiveReadiness];
    const max = Math.max(...skills);
    const min = Math.min(...skills);
    const range = max - min;
    
    return {
      isBalanced: range <= 15, // Within 15 points is considered balanced
      range: range,
      strongestSkill: skillLevels.customerAnalysis === max ? 'customerAnalysis' :
                     skillLevels.valueCommunication === max ? 'valueCommunication' : 'executiveReadiness',
      developmentArea: skillLevels.customerAnalysis === min ? 'customerAnalysis' :
                       skillLevels.valueCommunication === min ? 'valueCommunication' : 'executiveReadiness',
      recommendation: range > 20 ? 'Focus on balanced development across all competencies' :
                      'Continue systematic development across all areas'
    };
  }, [skillLevels]);
  
  return {
    // Core skill assessment data
    skillLevels,
    competencyLevel,
    isLoading,
    
    // Assessment functions
    updateSkillAssessment,
    
    // Professional development insights
    getImprovementPath,
    checkFeatureReadiness,
    getProgressDescription,
    getNextMilestone,
    getProfessionalAchievements,
    getCompetencyGuidance,
    
    // Advanced analytics
    progressVelocity,
    getTimeToNextLevel,
    getSkillCategories,
    getDetailedSkillAssessment,
    getProgressTrends,
    hasProfessionalGrowth,
    getCompetencyBalance,
    
    // Professional development language helpers
    competencyDescription: getProgressDescription(),
    nextMilestone: getNextMilestone(),
    professionalAchievements: getProfessionalAchievements(),
    skillCategories: getSkillCategories(),
    competencyBalance: getCompetencyBalance(),
    
    // Assessment metadata
    lastAssessment: skillLevels.lastAssessment,
    assessmentHistory: assessmentHistory.length,
    hasHistoricalData: assessmentHistory.length > 1
  };
};

export default useSkillAssessment;