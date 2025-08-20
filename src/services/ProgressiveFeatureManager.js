/**
 * Progressive Feature Manager
 * 
 * Adaptive interface management based on professional competency assessment
 * Provides progressive feature unlocking with professional development language
 */

class ProgressiveFeatureManager {
  
  // === FEATURE ACCESS DETERMINATION ===
  
  static determineFeatureAccess(competencyLevel, skillLevels) {
    const baseAccess = {
      foundation: {
        level: 'foundation',
        features: [
          'basic_tools',
          'guided_tutorials', 
          'implementation_basics',
          'methodology_introduction'
        ],
        complexity: 'simplified',
        sidebarMode: 'guidance_focused',
        uiElements: ['basic_navigation', 'contextual_help', 'step_by_step_guidance']
      },
      developing: {
        level: 'developing',
        features: [
          'basic_tools',
          'intermediate_customization',
          'best_practices',
          'methodology_development',
          'performance_insights'
        ],
        complexity: 'moderate',
        sidebarMode: 'best_practices_focused',
        uiElements: ['enhanced_navigation', 'advanced_tooltips', 'progress_tracking']
      },
      proficient: {
        level: 'proficient',
        features: [
          'all_tools',
          'advanced_customization', 
          'analytics_dashboard',
          'optimization_recommendations',
          'methodology_mastery'
        ],
        complexity: 'full',
        sidebarMode: 'optimization_focused',
        uiElements: ['full_navigation', 'analytics_panels', 'optimization_suggestions']
      },
      advanced: {
        level: 'advanced',
        features: [
          'all_tools',
          'competitive_intelligence',
          'market_data',
          'strategic_insights',
          'thought_leadership_tools'
        ],
        complexity: 'expert',
        sidebarMode: 'strategic_focused',
        uiElements: ['expert_navigation', 'strategic_panels', 'leadership_tools']
      }
    };
    
    const access = { ...baseAccess[competencyLevel] } || { ...baseAccess.foundation };
    
    // Add skill-specific capability unlocks
    if (skillLevels.customerAnalysis >= 80) {
      access.features.push('advanced_icp_analytics', 'competitive_analysis_tools');
    }
    
    if (skillLevels.valueCommunication >= 80) {
      access.features.push('advanced_financial_modeling', 'market_benchmarking');
    }
    
    if (skillLevels.executiveReadiness >= 80) {
      access.features.push('executive_presentation_builder', 'strategic_communication_tools');
    }
    
    // Add cross-competency advanced features
    if (skillLevels.overall >= 90) {
      access.features.push('revenue_intelligence_mastery', 'market_leadership_insights');
    }
    
    return access;
  }
  
  // === ADAPTIVE CONTENT SYSTEM ===
  
  static getAdaptiveContent(competencyLevel, skillLevels) {
    return {
      dashboard: this.getDashboardContent(competencyLevel, skillLevels),
      sidebar: this.getSidebarContent(competencyLevel, skillLevels),
      guidance: this.getGuidanceContent(competencyLevel, skillLevels),
      messaging: this.getMessagingContent(competencyLevel, skillLevels)
    };
  }
  
  static getDashboardContent(competencyLevel, skillLevels) {
    const content = {
      foundation: {
        primaryFocus: 'Learning & Foundation Building',
        dashboardTitle: 'Revenue Intelligence Development',
        keyMetrics: ['time_invested', 'tools_explored', 'methodology_understanding'],
        motivationalMessaging: 'Building systematic revenue intelligence capabilities',
        nextSteps: 'Master fundamental customer analysis methodology'
      },
      developing: {
        primaryFocus: 'Skill Development & Application',
        dashboardTitle: 'Professional Revenue Intelligence',
        keyMetrics: ['competency_progress', 'application_success', 'methodology_consistency'],
        motivationalMessaging: 'Developing advanced professional capabilities',
        nextSteps: 'Apply methodology consistently to real prospects'
      },
      proficient: {
        primaryFocus: 'Optimization & Excellence',
        dashboardTitle: 'Revenue Intelligence Excellence',
        keyMetrics: ['optimization_impact', 'methodology_mastery', 'professional_results'],
        motivationalMessaging: 'Achieving consistent professional excellence',
        nextSteps: 'Optimize processes and mentor others'
      },
      advanced: {
        primaryFocus: 'Leadership & Strategic Impact',
        dashboardTitle: 'Strategic Revenue Intelligence',
        keyMetrics: ['strategic_impact', 'market_insights', 'thought_leadership'],
        motivationalMessaging: 'Leading strategic revenue intelligence initiatives',
        nextSteps: 'Drive organizational transformation and market influence'
      }
    };
    
    return content[competencyLevel] || content.foundation;
  }
  
  static getSidebarContent(competencyLevel, skillLevels) {
    return {
      icp_analysis: this.getICPSidebarContent(competencyLevel, skillLevels),
      cost_calculator: this.getCalculatorSidebarContent(competencyLevel, skillLevels),
      business_case: this.getBusinessCaseSidebarContent(competencyLevel, skillLevels),
      dashboard: this.getDefaultSidebarContent(competencyLevel, skillLevels)
    };
  }
  
  static getICPSidebarContent(competencyLevel, skillLevels) {
    const content = {
      foundation: {
        title: 'Customer Analysis Foundation',
        sections: [
          {
            title: 'Systematic Research Approach',
            content: 'Focus on thorough buyer persona analysis and pain point understanding. Invest 3+ minutes in systematic review to build professional research methodology.',
            actionItems: [
              'Review each buyer persona thoroughly',
              'Study industry-specific pain points',
              'Export analysis for prospect application'
            ]
          }
        ]
      },
      developing: {
        title: 'Advanced Customer Analysis',
        sections: [
          {
            title: 'Methodology Application',
            content: 'Apply systematic analysis to real prospects. Customize criteria and develop consistent qualification workflows.',
            actionItems: [
              'Customize rating criteria for your market',
              'Apply framework to current prospect pipeline',
              'Track qualification accuracy and results'
            ]
          }
        ]
      },
      proficient: {
        title: 'Customer Analysis Excellence',
        sections: [
          {
            title: 'Optimization & Leadership',
            content: 'Optimize methodology for maximum impact. Share frameworks with team and benchmark results against outcomes.',
            actionItems: [
              'Refine methodology based on results',
              'Share best practices with team',
              'Benchmark qualification accuracy'
            ]
          }
        ]
      },
      advanced: {
        title: 'Strategic Customer Intelligence',
        sections: [
          {
            title: 'Market Leadership',
            content: 'Lead market intelligence initiatives. Develop competitive positioning and drive strategic customer analysis adoption.',
            actionItems: [
              'Analyze market trends and opportunities',
              'Develop competitive intelligence strategies',
              'Lead organizational intelligence initiatives'
            ]
          }
        ]
      }
    };
    
    return content[competencyLevel] || content.foundation;
  }
  
  static getCalculatorSidebarContent(competencyLevel, skillLevels) {
    const content = {
      foundation: {
        title: 'Value Communication Foundation',
        sections: [
          {
            title: 'Methodology Understanding',
            content: 'Master calculation fundamentals and scenario analysis. Invest time in understanding methodology for credible stakeholder explanations.',
            actionItems: [
              'Review calculation methodology thoroughly',
              'Test multiple scenarios and variables',
              'Understand chart interpretations'
            ]
          }
        ]
      },
      developing: {
        title: 'Advanced Value Communication',
        sections: [
          {
            title: 'Sophisticated Analysis',
            content: 'Develop advanced scenario modeling and risk assessment capabilities. Focus on presentation-ready financial analysis.',
            actionItems: [
              'Master edge case analysis techniques',
              'Develop stakeholder explanation skills',
              'Create presentation-ready outputs'
            ]
          }
        ]
      },
      proficient: {
        title: 'Value Communication Mastery',
        sections: [
          {
            title: 'Professional Excellence',
            content: 'Achieve sophisticated financial modeling and presentation capabilities. Focus on strategic narrative development.',
            actionItems: [
              'Develop compelling presentation narratives',
              'Master stakeholder-specific communications',
              'Build advanced modeling capabilities'
            ]
          }
        ]
      },
      advanced: {
        title: 'Strategic Value Leadership',
        sections: [
          {
            title: 'Market Influence',
            content: 'Lead strategic value communication initiatives. Develop market-level insights and influence organizational approaches.',
            actionItems: [
              'Create market benchmarking analyses',
              'Develop thought leadership content',
              'Influence organizational value messaging'
            ]
          }
        ]
      }
    };
    
    return content[competencyLevel] || content.foundation;
  }
  
  static getBusinessCaseSidebarContent(competencyLevel, skillLevels) {
    const content = {
      foundation: {
        title: 'Executive Communication Foundation',
        sections: [
          {
            title: 'Multi-Stakeholder Awareness',
            content: 'Learn to adapt the same information for different executive audiences. Practice stakeholder view switching and content customization.',
            actionItems: [
              'Switch between CEO, CFO, and CTO views',
              'Understand audience-specific priorities',
              'Practice strategic timing principles'
            ]
          }
        ]
      },
      developing: {
        title: 'Professional Business Communication',
        sections: [
          {
            title: 'Advanced Customization',
            content: 'Master stakeholder-specific communication and strategic content personalization. Integrate data from multiple tools.',
            actionItems: [
              'Create audience-specific versions',
              'Master auto-population utilization',
              'Develop strategic timing skills'
            ]
          }
        ]
      },
      proficient: {
        title: 'Executive Communication Excellence',
        sections: [
          {
            title: 'Strategic Influence',
            content: 'Achieve sophisticated multi-stakeholder communication and strategic timing mastery. Focus on executive influence techniques.',
            actionItems: [
              'Master strategic influence techniques',
              'Optimize stakeholder engagement timing',
              'Develop executive presentation mastery'
            ]
          }
        ]
      },
      advanced: {
        title: 'Strategic Communication Leadership',
        sections: [
          {
            title: 'Thought Leadership',
            content: 'Lead strategic communication initiatives across the organization. Develop thought leadership and mentor executive communication skills.',
            actionItems: [
              'Drive strategic communication initiatives',
              'Mentor executive communication skills',
              'Lead organizational communication standards'
            ]
          }
        ]
      }
    };
    
    return content[competencyLevel] || content.foundation;
  }
  
  static getDefaultSidebarContent(competencyLevel, skillLevels) {
    const content = {
      foundation: {
        title: 'Revenue Intelligence Dashboard',
        sections: [
          {
            title: 'Getting Started',
            content: 'Welcome to your professional development journey. Focus on systematic methodology development across all competency areas.',
            actionItems: [
              'Complete all three competency assessments',
              'Establish baseline professional metrics',
              'Begin systematic tool utilization'
            ]
          }
        ]
      },
      developing: {
        title: 'Advanced Business Development',
        sections: [
          {
            title: 'Professional Optimization',
            content: 'Enhance your systematic approach to business development. Focus on cross-tool integration and advanced methodology application.',
            actionItems: [
              'Master tool integration workflows',
              'Develop advanced stakeholder strategies',
              'Optimize professional timing techniques'
            ]
          }
        ]
      },
      proficient: {
        title: 'Executive Business Leadership',
        sections: [
          {
            title: 'Strategic Excellence',
            content: 'Lead strategic business initiatives with sophisticated methodology mastery. Focus on organizational impact and executive influence.',
            actionItems: [
              'Drive strategic business initiatives',
              'Mentor systematic methodologies',
              'Lead organizational development standards'
            ]
          }
        ]
      },
      advanced: {
        title: 'Master Business Strategist',
        sections: [
          {
            title: 'Thought Leadership',
            content: 'Establish thought leadership in systematic business development. Focus on industry influence and strategic innovation.',
            actionItems: [
              'Lead industry thought leadership',
              'Drive strategic innovation initiatives',
              'Mentor executive development programs'
            ]
          }
        ]
      }
    };
    
    return content[competencyLevel] || content.foundation;
  }
  
  // === CONTEXTUAL GUIDANCE SYSTEM ===
  
  static getContextualGuidance(context, competencyLevel, skillLevels) {
    const guidanceMap = {
      foundation: {
        icp_analysis: {
          title: 'Building Customer Analysis Foundation',
          content: 'Focus on systematic review of buyer personas and pain points. Take time to understand each section before moving forward. Professional methodology development requires thorough exploration.',
          priority: 'methodology_foundation',
          estimatedTime: '5-8 minutes per analysis',
          professionalImpact: 'Establishes systematic approach to prospect qualification'
        },
        cost_calculator: {
          title: 'Understanding Value Communication',
          content: 'Learn the calculation methodology and test different scenarios to build confidence in financial discussions. Understanding fundamentals enables credible stakeholder presentations.',
          priority: 'methodology_understanding',
          estimatedTime: '10-15 minutes per session',
          professionalImpact: 'Builds credibility for ROI and financial discussions'
        },
        business_case: {
          title: 'Professional Business Communication',
          content: 'Explore different stakeholder views to understand how the same information adapts for different executive audiences. Multi-stakeholder thinking is essential for executive readiness.',
          priority: 'audience_awareness',
          estimatedTime: '8-12 minutes per business case',
          professionalImpact: 'Develops executive-appropriate communication skills'
        }
      },
      developing: {
        icp_analysis: {
          title: 'Advancing Customer Analysis Skills',
          content: 'Customize criteria and return to reference materials. Start applying insights to real prospects and track qualification accuracy.',
          priority: 'methodology_application',
          estimatedTime: '8-12 minutes per analysis',
          professionalImpact: 'Increases prospect qualification accuracy and efficiency'
        },
        cost_calculator: {
          title: 'Mastering Value Communication',
          content: 'Test edge cases and complex scenarios. Focus on explaining calculations to stakeholders and building presentation-ready outputs.',
          priority: 'advanced_analysis',
          estimatedTime: '15-20 minutes per session',
          professionalImpact: 'Enables sophisticated financial presentations and deal progression'
        },
        business_case: {
          title: 'Developing Executive Communication',
          content: 'Create multiple versions for different audiences and integrate data from other tools. Strategic timing and customization drive executive engagement.',
          priority: 'strategic_customization',
          estimatedTime: '12-18 minutes per business case',
          professionalImpact: 'Accelerates executive decision-making and buy-in'
        }
      }
    };
    
    return guidanceMap[competencyLevel]?.[context] || guidanceMap.foundation[context];
  }
  
  // === PROFESSIONAL MILESTONE SYSTEM ===
  
  static getMilestoneNotification(unlock) {
    const notificationMap = {
      'advanced_customization': {
        title: 'Advanced Customization Capabilities Available',
        description: 'Your systematic methodology usage demonstrates readiness for advanced customization features and sophisticated workflow optimization.',
        professionalImpact: 'Customize tools for your specific market, industry, and methodology preferences to maximize effectiveness.',
        competencyEvidence: 'Demonstrated consistent professional methodology application',
        nextCapability: 'Market-specific optimization and advanced analytics'
      },
      'competitive_intelligence': {
        title: 'Competitive Intelligence Access Granted',
        description: 'Your analytical sophistication and customer analysis mastery qualify you for competitive market intelligence features and strategic positioning tools.',
        professionalImpact: 'Access real-time competitive data, market positioning insights, and strategic intelligence for enhanced prospect engagement.',
        competencyEvidence: 'Advanced customer analysis and strategic thinking demonstrated',
        nextCapability: 'Market leadership insights and strategic positioning'
      },
      'market_data': {
        title: 'Strategic Market Intelligence Available',
        description: 'Your expertise level and professional competency enable access to strategic market data, industry benchmarking, and thought leadership insights.',
        professionalImpact: 'Leverage comprehensive market trends, benchmarking data, and strategic intelligence for competitive advantage and thought leadership.',
        competencyEvidence: 'Expert-level competency across all revenue intelligence disciplines',
        nextCapability: 'Thought leadership tools and organizational influence capabilities'
      }
    };
    
    return notificationMap[unlock.feature] || {
      title: 'New Professional Capability Available',
      description: 'Your demonstrated competency development has made new platform capabilities available.',
      professionalImpact: 'Enhanced tools and strategic insights are now accessible.',
      competencyEvidence: 'Professional development milestone achieved',
      nextCapability: 'Continued capability expansion based on competency growth'
    };
  }
  
  // === PROFESSIONAL LANGUAGE SYSTEM ===
  
  static getProgressLabel(competencyLevel) {
    const labels = {
      foundation: 'Methodology Foundation Building',
      developing: 'Professional Capability Development',
      proficient: 'Strategic Professional Proficiency', 
      advanced: 'Revenue Intelligence Mastery'
    };
    
    return labels[competencyLevel] || labels.foundation;
  }
  
  static getCapabilityDescription(skillLevels) {
    const overall = skillLevels.overall;
    
    if (overall < 30) {
      return 'Establishing systematic revenue intelligence methodology foundation';
    } else if (overall < 50) {
      return 'Developing core professional competencies and analytical capabilities';
    } else if (overall < 70) {
      return 'Building advanced professional skills and strategic thinking';
    } else if (overall < 85) {
      return 'Demonstrating consistent professional excellence and methodology mastery';
    } else {
      return 'Achieving strategic revenue intelligence leadership and market influence capability';
    }
  }
  
  static getNextLevelDescription(competencyLevel) {
    const descriptions = {
      foundation: {
        title: 'Professional Capability Development',
        description: 'Advance to sophisticated analysis and methodology application',
        requiredCompetencies: ['Systematic analysis approach', 'Consistent methodology usage', 'Professional presentation readiness']
      },
      developing: {
        title: 'Strategic Professional Proficiency',
        description: 'Achieve advanced competency and optimization mastery',
        requiredCompetencies: ['Advanced analysis techniques', 'Strategic thinking', 'Multi-stakeholder communication']
      },
      proficient: {
        title: 'Revenue Intelligence Mastery',
        description: 'Reach expert-level strategic capability and thought leadership',
        requiredCompetencies: ['Methodology optimization', 'Strategic influence', 'Market intelligence leadership']
      },
      advanced: {
        title: 'Market Leadership Excellence',
        description: 'Lead organizational transformation and market influence',
        requiredCompetencies: ['Thought leadership', 'Organizational influence', 'Strategic market impact']
      }
    };
    
    return descriptions[competencyLevel] || descriptions.foundation;
  }
  
  // === FEATURE UNLOCK TRIGGERS ===
  
  static getUnlockTrigger(feature, skillLevels) {
    const triggers = {
      'advanced_customization': {
        primarySkill: 'overall',
        threshold: 50,
        description: 'Consistent methodology usage across all tools'
      },
      'competitive_intelligence': {
        primarySkill: 'customerAnalysis',
        threshold: 75,
        description: 'Advanced customer analysis and strategic thinking mastery'
      },
      'market_data': {
        primarySkill: 'overall',
        threshold: 85,
        description: 'Expert-level competency across all revenue intelligence disciplines'
      }
    };
    
    return triggers[feature] || { primarySkill: 'overall', threshold: 50, description: 'Professional competency development' };
  }
  
  // === GUIDANCE CONTENT SYSTEM ===
  
  static getGuidanceContent(competencyLevel, skillLevels) {
    const guidance = {
      foundation: {
        primaryFocus: 'Professional Methodology Development',
        currentPhase: 'Building systematic business development capabilities',
        keyObjectives: [
          'Establish systematic customer analysis approach',
          'Develop foundational value communication skills',
          'Build professional stakeholder engagement confidence'
        ],
        nextSteps: [
          'Complete comprehensive tool exploration',
          'Practice systematic methodology application',
          'Build professional execution consistency'
        ],
        timeEstimate: '2-4 weeks with consistent practice',
        professionalImpact: 'Foundation for systematic business development success'
      },
      developing: {
        primaryFocus: 'Advanced Professional Execution',
        currentPhase: 'Enhancing methodology sophistication and integration',
        keyObjectives: [
          'Master cross-tool integration workflows',
          'Develop advanced stakeholder strategy capabilities',
          'Optimize professional timing and execution'
        ],
        nextSteps: [
          'Master tool integration sequences',
          'Develop advanced customization skills',
          'Build strategic stakeholder influence'
        ],
        timeEstimate: '3-6 weeks with focused development',
        professionalImpact: 'Advanced business development competency and influence'
      },
      proficient: {
        primaryFocus: 'Executive Leadership Excellence',
        currentPhase: 'Leading strategic business initiatives with methodology mastery',
        keyObjectives: [
          'Drive strategic business development initiatives',
          'Mentor systematic methodology adoption',
          'Lead organizational capability development'
        ],
        nextSteps: [
          'Lead strategic initiative development',
          'Mentor professional development programs',
          'Drive organizational excellence standards'
        ],
        timeEstimate: '1-3 months with leadership focus',
        professionalImpact: 'Executive leadership in systematic business development'
      },
      advanced: {
        primaryFocus: 'Industry Thought Leadership',
        currentPhase: 'Establishing thought leadership in systematic business development',
        keyObjectives: [
          'Lead industry best practice development',
          'Drive strategic innovation initiatives',
          'Establish thought leadership positioning'
        ],
        nextSteps: [
          'Develop industry thought leadership content',
          'Lead strategic innovation programs',
          'Mentor executive development excellence'
        ],
        timeEstimate: '3-6 months with strategic focus',
        professionalImpact: 'Industry thought leader in systematic business development excellence'
      }
    };
    
    return guidance[competencyLevel] || guidance.foundation;
  }
  
  // === ADAPTIVE MESSAGING ===
  
  static getMessagingContent(competencyLevel, skillLevels) {
    return {
      welcomeMessage: this.getWelcomeMessage(competencyLevel),
      motivationalContext: this.getMotivationalContext(competencyLevel, skillLevels),
      progressCelebration: this.getProgressCelebration(competencyLevel),
      guidanceEmphasis: this.getGuidanceEmphasis(competencyLevel)
    };
  }
  
  static getWelcomeMessage(competencyLevel) {
    const messages = {
      foundation: 'Welcome to your revenue intelligence development journey. Focus on building systematic methodology and professional capabilities.',
      developing: 'Continue developing your professional competencies. Your systematic approach is building strong analytical capabilities.',
      proficient: 'Excellent professional development! Your advanced competencies enable sophisticated revenue intelligence strategies.',
      advanced: 'Outstanding strategic mastery! Your expertise drives significant competitive advantage and market influence.'
    };
    
    return messages[competencyLevel] || messages.foundation;
  }
  
  static getMotivationalContext(competencyLevel, skillLevels) {
    const lowest = Math.min(skillLevels.customerAnalysis, skillLevels.valueCommunication, skillLevels.executiveReadiness);
    const highest = Math.max(skillLevels.customerAnalysis, skillLevels.valueCommunication, skillLevels.executiveReadiness);
    
    if (highest - lowest > 20) {
      return 'Focus on balanced development across all competencies for maximum strategic impact.';
    } else {
      return 'Your balanced competency development demonstrates strong professional methodology adoption.';
    }
  }
  
  static getProgressCelebration(competencyLevel) {
    const celebrations = {
      foundation: 'Building strong methodology foundation through systematic application',
      developing: 'Advancing professional capabilities with consistent competency development',
      proficient: 'Achieving professional excellence through advanced methodology mastery',
      advanced: 'Leading strategic revenue intelligence with expert-level competency'
    };
    
    return celebrations[competencyLevel] || celebrations.foundation;
  }
  
  static getGuidanceEmphasis(competencyLevel) {
    const emphasis = {
      foundation: 'systematic_methodology',
      developing: 'professional_application',
      proficient: 'strategic_optimization',
      advanced: 'thought_leadership'
    };
    
    return emphasis[competencyLevel] || emphasis.foundation;
  }
}

export default ProgressiveFeatureManager;
export { ProgressiveFeatureManager };