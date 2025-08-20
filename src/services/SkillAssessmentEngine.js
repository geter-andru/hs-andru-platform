/**
 * Skill Assessment Engine
 * 
 * Advanced algorithms for professional competency assessment based on behavioral patterns
 * Uses professional development language - zero gaming terminology
 */

class SkillAssessmentEngine {
  
  // === MAIN ASSESSMENT FUNCTION ===
  
  static assessAllSkills(behaviorData) {
    const customerAnalysis = this.assessCustomerAnalysisSkill(behaviorData.icpBehavior);
    const valueCommunication = this.assessValueCommunicationSkill(behaviorData.calculatorBehavior);
    const executiveReadiness = this.assessExecutiveCommunicationSkill(behaviorData.businessCaseBehavior);
    
    const overall = Math.round((customerAnalysis + valueCommunication + executiveReadiness) / 3);
    
    return {
      customerAnalysis,
      valueCommunication,
      executiveReadiness,
      overall,
      lastAssessment: Date.now()
    };
  }
  
  // === INDIVIDUAL SKILL ASSESSMENTS ===
  
  // Customer Analysis Professional Competency Assessment
  static assessCustomerAnalysisSkill(icpBehavior) {
    let score = 0;
    
    // Systematic Research Approach (40 points max)
    // Professional methodology demonstration through systematic review
    if (icpBehavior.reviewTime > 180000) score += 20; // 3+ minute systematic review
    if (icpBehavior.buyerPersonaClicks > 5) score += 15; // Thorough persona exploration
    if (icpBehavior.painPointSectionTime > 60000) score += 15; // Deep pain point analysis
    
    // Implementation Readiness (40 points max)  
    // Professional application and reference usage patterns
    if (icpBehavior.exportedSummary) score += 20; // Implementation-focused approach
    if (icpBehavior.returnVisits > 2) score += 15; // Reference and refinement usage
    
    // Advanced Professional Usage (20 points max)
    // Sophisticated customization and methodology adaptation
    if (icpBehavior.customizedCriteria) score += 15; // Advanced methodology customization
    
    return Math.min(score, 100);
  }
  
  // Value Communication Professional Competency Assessment
  static assessValueCommunicationSkill(calculatorBehavior) {
    let score = 0;
    
    // Analytical Sophistication (40 points max)
    // Professional analysis and scenario testing capability
    if (calculatorBehavior.variableAdjustments > 5) score += 15; // Scenario analysis capability
    if (calculatorBehavior.methodologyReviewTime > 120000) score += 15; // Deep methodology understanding
    if (calculatorBehavior.edgeCaseTesting) score += 20; // Risk assessment and edge case analysis
    
    // Presentation Readiness (40 points max)
    // Professional communication and presentation preparation
    if (calculatorBehavior.exportedCharts) score += 20; // Stakeholder presentation readiness
    if (calculatorBehavior.multipleSessions > 3) score += 15; // Iterative professional approach
    
    // Integration Sophistication (20 points max)  
    // Advanced workflow and systematic methodology usage
    if (calculatorBehavior.integratedWithBusinessCase) score += 15; // Systematic professional workflow
    
    return Math.min(score, 100);
  }
  
  // Executive Communication Professional Competency Assessment
  static assessExecutiveCommunicationSkill(businessCaseBehavior) {
    let score = 0;
    
    // Multi-Stakeholder Professional Awareness (40 points max)
    // Executive-level communication sophistication
    if (businessCaseBehavior.stakeholderViewSwitches > 3) score += 20; // Multi-stakeholder awareness
    if (businessCaseBehavior.contentCustomization) score += 15; // Professional customization capability
    if (businessCaseBehavior.multipleFormatExports) score += 15; // Distribution strategy sophistication
    
    // Professional Execution Sophistication (40 points max)
    // Advanced professional methodology and integration usage
    if (businessCaseBehavior.autoPopulationUtilization) score += 20; // Sophisticated integration usage
    if (businessCaseBehavior.returnAccess > 2) score += 15; // Iterative professional improvement
    
    // Strategic Professional Timing (20 points max)
    // Executive-level strategic thinking and timing
    if (businessCaseBehavior.strategicExportTiming) score += 15; // Strategic professional timing
    
    return Math.min(score, 100);
  }
  
  // === COMPETENCY LEVEL DETERMINATION ===
  
  static determineCompetencyLevel(skillLevels) {
    const overall = skillLevels.overall;
    
    if (overall < 40) return 'foundation';
    if (overall < 70) return 'developing'; 
    if (overall < 85) return 'proficient';
    return 'advanced';
  }
  
  // === PROFESSIONAL DEVELOPMENT RECOMMENDATIONS ===
  
  static generateImprovementPath(skillLevels) {
    const improvements = [];
    
    // Customer Analysis Development Path
    if (skillLevels.customerAnalysis < 70) {
      improvements.push({
        competency: 'Customer Analysis Methodology',
        priority: skillLevels.customerAnalysis < 40 ? 'critical' : 'high',
        currentLevel: this.getCompetencyDescription(skillLevels.customerAnalysis),
        recommendations: [
          'Invest more time in systematic buyer persona analysis',
          'Develop deeper industry pain point understanding', 
          'Create implementation-ready prospect research workflows',
          'Build systematic prospect qualification methodology'
        ],
        professionalImpact: 'Enhanced customer analysis capability drives better prospect targeting and higher conversion rates'
      });
    }
    
    // Value Communication Development Path
    if (skillLevels.valueCommunication < 70) {
      improvements.push({
        competency: 'Value Communication Excellence',
        priority: skillLevels.valueCommunication < 40 ? 'critical' : 'high',
        currentLevel: this.getCompetencyDescription(skillLevels.valueCommunication),
        recommendations: [
          'Develop advanced scenario analysis and modeling skills',
          'Master calculation methodology for stakeholder explanations',
          'Build presentation-ready financial analysis capabilities',
          'Create risk assessment and edge case analysis workflows'
        ],
        professionalImpact: 'Advanced value communication skills enable compelling ROI presentations and faster deal progression'
      });
    }
    
    // Executive Communication Development Path
    if (skillLevels.executiveReadiness < 70) {
      improvements.push({
        competency: 'Executive Communication Readiness',
        priority: skillLevels.executiveReadiness < 50 ? 'high' : 'medium',
        currentLevel: this.getCompetencyDescription(skillLevels.executiveReadiness),
        recommendations: [
          'Develop multi-stakeholder business case customization',
          'Master strategic content personalization techniques',
          'Build advanced workflow integration capabilities',
          'Enhance strategic timing and executive presentation skills'
        ],
        professionalImpact: 'Executive-ready communication skills accelerate C-level decision making and deal closure'
      });
    }
    
    return improvements;
  }
  
  // === FEATURE READINESS ASSESSMENT ===
  
  static checkFeatureReadiness(skillLevels, featureName) {
    const readinessMap = {
      // Basic advanced features
      'advanced_customization': skillLevels.overall >= 50,
      'analytics_dashboard': skillLevels.customerAnalysis >= 60,
      'export_automation': skillLevels.valueCommunication >= 60,
      'stakeholder_mapping': skillLevels.executiveReadiness >= 60,
      
      // Intermediate features
      'competitive_intelligence': skillLevels.overall >= 70 && skillLevels.customerAnalysis >= 75,
      'advanced_financial_modeling': skillLevels.valueCommunication >= 75,
      'executive_presentation_builder': skillLevels.executiveReadiness >= 75,
      
      // Advanced features
      'market_data': skillLevels.overall >= 85,
      'strategic_insights': skillLevels.overall >= 80 && skillLevels.executiveReadiness >= 85,
      'revenue_intelligence_mastery': skillLevels.overall >= 90
    };
    
    return readinessMap[featureName] || false;
  }
  
  // === PROFESSIONAL DEVELOPMENT LANGUAGE ===
  
  static getProgressDescription(competencyLevel) {
    const descriptions = {
      foundation: 'Building systematic revenue intelligence capabilities and establishing professional methodology foundation',
      developing: 'Developing advanced customer analysis skills and value communication competencies',
      proficient: 'Demonstrating consistent professional methodology with systematic revenue intelligence application',
      advanced: 'Achieving revenue intelligence mastery with strategic execution and thought leadership capability'
    };
    
    return descriptions[competencyLevel] || descriptions.foundation;
  }
  
  static getNextMilestone(competencyLevel) {
    const milestones = {
      foundation: {
        title: 'Advanced Customer Analysis Methodology',
        description: 'Master systematic prospect analysis and qualification frameworks',
        competencyTarget: 'developing'
      },
      developing: {
        title: 'Systematic Value Communication Excellence', 
        description: 'Achieve sophisticated financial analysis and presentation capabilities',
        competencyTarget: 'proficient'
      },
      proficient: {
        title: 'Strategic Executive Communication Mastery',
        description: 'Develop advanced multi-stakeholder communication and strategic timing skills',
        competencyTarget: 'advanced'  
      },
      advanced: {
        title: 'Revenue Intelligence Leadership',
        description: 'Lead strategic market intelligence initiatives and mentor methodology adoption',
        competencyTarget: 'mastery'
      }
    };
    
    return milestones[competencyLevel] || milestones.foundation;
  }
  
  static getProfessionalAchievements(skillLevels) {
    const achievements = [];
    
    // Professional competency milestones (not "achievements")
    if (skillLevels.customerAnalysis >= 70) {
      achievements.push({
        competency: 'Customer Analysis Methodology Proficiency',
        description: 'Demonstrated systematic approach to customer research and qualification',
        professionalImpact: 'Enhanced prospect targeting and conversion effectiveness'
      });
    }
    
    if (skillLevels.valueCommunication >= 70) {
      achievements.push({
        competency: 'Value Communication Excellence',
        description: 'Mastered financial analysis and stakeholder presentation capabilities',
        professionalImpact: 'Accelerated deal progression through compelling ROI demonstration'
      });
    }
    
    if (skillLevels.executiveReadiness >= 70) {
      achievements.push({
        competency: 'Executive Communication Readiness',
        description: 'Developed sophisticated multi-stakeholder communication skills',
        professionalImpact: 'Enhanced C-level engagement and strategic decision acceleration'
      });
    }
    
    if (skillLevels.overall >= 85) {
      achievements.push({
        competency: 'Revenue Intelligence Expertise',
        description: 'Achieved comprehensive revenue intelligence methodology mastery',
        professionalImpact: 'Strategic competitive advantage through systematic intelligence application'
      });
    }
    
    return achievements;
  }
  
  // === PROFESSIONAL COMPETENCY HELPERS ===
  
  static getCompetencyDescription(score) {
    if (score < 30) return 'Foundation Building';
    if (score < 50) return 'Developing Capability';
    if (score < 70) return 'Professional Competency';
    if (score < 85) return 'Advanced Proficiency';
    return 'Expert Mastery';
  }
  
  static getCompetencyGuidance(competencyLevel, specificSkill) {
    const guidance = {
      foundation: {
        customerAnalysis: {
          focus: 'Build systematic research methodology',
          nextStep: 'Master buyer persona analysis techniques',
          timeInvestment: 'Spend 3+ minutes on systematic ICP review'
        },
        valueCommunication: {
          focus: 'Understand calculation methodology fundamentals', 
          nextStep: 'Practice scenario analysis and testing',
          timeInvestment: 'Review methodology documentation thoroughly'
        },
        executiveReadiness: {
          focus: 'Learn multi-stakeholder communication basics',
          nextStep: 'Practice stakeholder view customization',
          timeInvestment: 'Explore different audience perspectives'
        }
      },
      developing: {
        customerAnalysis: {
          focus: 'Advanced research techniques and customization',
          nextStep: 'Implement systematic prospect qualification',
          timeInvestment: 'Apply methodology to real prospects consistently'
        },
        valueCommunication: {
          focus: 'Sophisticated analysis and presentation skills',
          nextStep: 'Master edge case analysis and risk assessment',
          timeInvestment: 'Practice complex scenario modeling'
        },
        executiveReadiness: {
          focus: 'Professional presentation and timing mastery',
          nextStep: 'Develop strategic workflow integration',
          timeInvestment: 'Focus on strategic timing and customization'
        }
      },
      proficient: {
        customerAnalysis: {
          focus: 'Methodology optimization and team leadership',
          nextStep: 'Share frameworks and mentor others',
          timeInvestment: 'Benchmark results and refine approaches'
        },
        valueCommunication: {
          focus: 'Advanced presentation narratives and influence',
          nextStep: 'Develop market-level insights and benchmarking',
          timeInvestment: 'Create sophisticated stakeholder communications'
        },
        executiveReadiness: {
          focus: 'Strategic influence and thought leadership',
          nextStep: 'Drive organizational revenue intelligence adoption',
          timeInvestment: 'Lead strategic initiatives and best practice development'
        }
      },
      advanced: {
        customerAnalysis: {
          focus: 'Market intelligence and competitive positioning',
          nextStep: 'Lead strategic market analysis initiatives',
          timeInvestment: 'Drive organizational competitive intelligence'
        },
        valueCommunication: {
          focus: 'Strategic value narrative development',
          nextStep: 'Influence market positioning and messaging',
          timeInvestment: 'Create thought leadership content and market insights'
        },
        executiveReadiness: {
          focus: 'Executive influence and strategic communication mastery',
          nextStep: 'Mentor executive communication across organization',
          timeInvestment: 'Lead strategic communication initiatives and training'
        }
      }
    };
    
    return guidance[competencyLevel]?.[specificSkill] || guidance.foundation[specificSkill];
  }
  
  // === PROGRESS TRACKING ===
  
  static calculateProgressVelocity(currentAssessment, previousAssessment) {
    if (!previousAssessment) return null;
    
    const timeDiff = currentAssessment.lastAssessment - previousAssessment.lastAssessment;
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    
    if (daysDiff === 0) return null;
    
    return {
      customerAnalysisVelocity: (currentAssessment.customerAnalysis - previousAssessment.customerAnalysis) / daysDiff,
      valueCommunicationVelocity: (currentAssessment.valueCommunication - previousAssessment.valueCommunication) / daysDiff,
      executiveReadinessVelocity: (currentAssessment.executiveReadiness - previousAssessment.executiveReadiness) / daysDiff,
      overallVelocity: (currentAssessment.overall - previousAssessment.overall) / daysDiff
    };
  }
  
  static predictTimeToNextLevel(skillLevels, progressVelocity) {
    if (!progressVelocity || progressVelocity.overallVelocity <= 0) return null;
    
    const currentLevel = this.determineCompetencyLevel(skillLevels);
    const nextLevelThresholds = {
      foundation: 40,
      developing: 70,
      proficient: 85,
      advanced: 100
    };
    
    const targetScore = nextLevelThresholds[currentLevel];
    if (!targetScore || skillLevels.overall >= targetScore) return null;
    
    const pointsNeeded = targetScore - skillLevels.overall;
    const daysToNextLevel = pointsNeeded / progressVelocity.overallVelocity;
    
    return Math.max(Math.round(daysToNextLevel), 1);
  }
}

export default SkillAssessmentEngine;
export { SkillAssessmentEngine };