import { TrendingUp, Target, Zap, Award, Users, Activity } from 'lucide-react';

/**
 * Milestone-Driven Module Service
 * 
 * Dynamically configures dashboard modules based on user's specific Series B milestone stage.
 * Maps each module's priority, actions, and content to the 3 critical sales steps 
 * for stages 10-15 progression.
 */

class MilestoneModuleService {
  constructor() {
    // Series B stages 10-15 with their 3 critical sales steps
    this.seriesBStages = {
      10: {
        name: 'Initial PMF',
        goal: 'Validate product truly solves customer problems',
        criticalSteps: [
          'Conduct Deep Customer Discovery Interviews',
          'Create Value Realization Tracking System', 
          'Develop Feedback-to-Product Loop'
        ],
        focus: 'Learning & Foundation',
        metrics: ['retention_rate', 'nps', 'churn_rate']
      },
      11: {
        name: 'Key Hires',
        goal: 'Build strong team for scaling',
        criticalSteps: [
          'Document Repeatable Sales Process',
          'Build Customer Success Onboarding Program',
          'Establish Sales Enablement Foundation'
        ],
        focus: 'Learning & Foundation', 
        metrics: ['time_to_fill', 'employee_engagement', 'performance_metrics']
      },
      12: {
        name: 'Scalability/Revenue',
        goal: 'Prove sustainable revenue generation',
        criticalSteps: [
          'Implement Value-Based Pricing Strategy',
          'Optimize Sales Funnel Conversion',
          'Develop Expansion Revenue Processes'
        ],
        focus: 'Learning & Foundation',
        metrics: ['mrr_arr', 'gross_profit_margin', 'cltv']
      },
      13: {
        name: 'User Base',
        goal: 'Expand customer base and drive adoption',
        criticalSteps: [
          'Scale Lead Generation & Qualification',
          'Accelerate Sales Velocity',
          'Build Referral & Advocacy Program'
        ],
        focus: 'Scaling & Optimization',
        metrics: ['user_acquisition_rate', 'cpa', 'arpu', 'user_growth_rate']
      },
      14: {
        name: 'Scaling Product',
        goal: 'Expand product capabilities for growing market',
        criticalSteps: [
          'Launch New Feature Adoption Campaign',
          'Expand Into Adjacent Market Segments', 
          'Implement Account-Based Sales Strategy'
        ],
        focus: 'Scaling & Optimization',
        metrics: ['feature_adoption_rate', 'user_satisfaction', 'time_to_market']
      },
      15: {
        name: 'Revenue Growth',
        goal: 'Build sustainable and predictable revenue model',
        criticalSteps: [
          'Maximize Deal Value & Contract Terms',
          'Build Predictable Renewal & Expansion Engine',
          'Optimize Sales Team Performance & Productivity'
        ],
        focus: 'Scaling & Optimization',
        metrics: ['mrr_arr_growth', 'cltv', 'arpu', 'revenue_predictability']
      }
    };

    // Module configurations that dynamically adapt to Series B stages
    this.moduleTemplates = {
      revenue_indicators: {
        name: 'Revenue Intelligence Indicators',
        icon: TrendingUp,
        description: 'Leading indicators and pipeline health',
        stageAdaptations: {
          10: {
            priority: 'high',
            focus: 'Customer Problem Validation',
            actions: [
              { name: 'Track Customer Interview Insights', exp: 25, type: 'discovery_interview' },
              { name: 'Monitor Value Realization Metrics', exp: 30, type: 'value_tracking' },
              { name: 'Analyze Feedback Patterns', exp: 20, type: 'feedback_analysis' }
            ],
            alerts: ['Customer churn risk detected', 'PMF validation needed'],
            kpis: ['Customer retention rate', 'Problem-solution fit score', 'Value delivery confirmation']
          },
          11: {
            priority: 'medium',
            focus: 'Process Documentation & Team Building',
            actions: [
              { name: 'Document Sales Process Steps', exp: 20, type: 'process_documentation' },
              { name: 'Create Onboarding Milestones', exp: 25, type: 'onboarding_design' },
              { name: 'Build Sales Enablement Materials', exp: 30, type: 'enablement_creation' }
            ],
            alerts: ['Sales process inconsistency detected', 'New hire performance gap'],
            kpis: ['Sales process completion rate', 'New hire ramp time', 'Team performance consistency']
          },
          12: {
            priority: 'high',
            focus: 'Revenue Model Optimization',
            actions: [
              { name: 'Analyze Value-Based Pricing Opportunities', exp: 35, type: 'pricing_analysis' },
              { name: 'Optimize Funnel Conversion Points', exp: 30, type: 'funnel_optimization' },
              { name: 'Design Expansion Revenue Triggers', exp: 25, type: 'expansion_strategy' }
            ],
            alerts: ['Pricing misalignment detected', 'Funnel bottleneck identified'],
            kpis: ['Average deal value', 'Conversion rate by stage', 'Expansion revenue %']
          },
          13: {
            priority: 'high', 
            focus: 'User Acquisition & Growth',
            actions: [
              { name: 'Optimize Lead Scoring Criteria', exp: 25, type: 'lead_optimization' },
              { name: 'Accelerate Sales Velocity Metrics', exp: 30, type: 'velocity_improvement' },
              { name: 'Track Referral Program Performance', exp: 20, type: 'referral_tracking' }
            ],
            alerts: ['Lead quality declining', 'Sales cycle lengthening'],
            kpis: ['Lead conversion rate', 'Sales cycle length', 'Referral program ROI']
          },
          14: {
            priority: 'medium',
            focus: 'Product Expansion & Market Growth',
            actions: [
              { name: 'Monitor Feature Adoption Rates', exp: 20, type: 'feature_tracking' },
              { name: 'Analyze New Market Segment Performance', exp: 25, type: 'segment_analysis' },
              { name: 'Track Account-Based Sales Success', exp: 30, type: 'abs_performance' }
            ],
            alerts: ['Feature adoption lagging', 'Market expansion risks'],
            kpis: ['Feature utilization rate', 'Market segment penetration', 'Enterprise deal success rate']
          },
          15: {
            priority: 'high',
            focus: 'Revenue Predictability & Scale',
            actions: [
              { name: 'Optimize Contract Terms & Pricing', exp: 35, type: 'contract_optimization' },
              { name: 'Enhance Renewal Prediction Accuracy', exp: 30, type: 'renewal_prediction' },
              { name: 'Maximize Sales Team Productivity', exp: 25, type: 'team_optimization' }
            ],
            alerts: ['Revenue predictability risk', 'Team performance variance'],
            kpis: ['Revenue predictability score', 'Net revenue retention', 'Sales team quota attainment']
          }
        }
      },

      priority_actions: {
        name: 'Priority Actions',
        icon: Target,
        description: 'Highest ROI buyer intelligence actions',
        stageAdaptations: {
          10: {
            priority: 'high',
            focus: 'Customer Validation Actions',
            actions: [
              { name: 'Schedule Customer Discovery Call', exp: 30, type: 'discovery_call', urgency: 'high' },
              { name: 'Create Value Measurement Framework', exp: 25, type: 'value_framework', urgency: 'medium' },
              { name: 'Document Customer Success Case', exp: 35, type: 'success_documentation', urgency: 'low' }
            ],
            quickWins: ['Interview 3 customers this week', 'Define success metrics', 'Create feedback loop'],
            impact: 'Validates PMF and reduces churn risk'
          },
          11: {
            priority: 'high', 
            focus: 'Team Building & Process Actions',
            actions: [
              { name: 'Create Sales Playbook Template', exp: 25, type: 'playbook_creation', urgency: 'high' },
              { name: 'Design Onboarding Checklist', exp: 20, type: 'onboarding_design', urgency: 'high' },
              { name: 'Build Training Materials', exp: 30, type: 'training_creation', urgency: 'medium' }
            ],
            quickWins: ['Document current sales process', 'Create new hire checklist', 'Record training videos'],
            impact: 'Accelerates team scaling and performance consistency'
          },
          12: {
            priority: 'high',
            focus: 'Revenue Optimization Actions', 
            actions: [
              { name: 'Conduct Pricing Research Analysis', exp: 35, type: 'pricing_research', urgency: 'high' },
              { name: 'A/B Test Sales Process Changes', exp: 30, type: 'process_testing', urgency: 'medium' },
              { name: 'Design Upsell Conversation Scripts', exp: 25, type: 'upsell_design', urgency: 'medium' }
            ],
            quickWins: ['Survey customers on pricing', 'Identify funnel bottlenecks', 'Create expansion triggers'],
            impact: 'Increases MRR and improves revenue predictability'
          },
          13: {
            priority: 'high',
            focus: 'Growth & Acquisition Actions',
            actions: [
              { name: 'Optimize Lead Qualification Process', exp: 25, type: 'lead_qualification', urgency: 'high' },
              { name: 'Accelerate Demo-to-Close Process', exp: 30, type: 'velocity_improvement', urgency: 'high' },
              { name: 'Launch Customer Referral Campaign', exp: 35, type: 'referral_campaign', urgency: 'medium' }
            ],
            quickWins: ['Update lead scoring model', 'Reduce demo wait time', 'Ask top customers for referrals'],
            impact: 'Drives user acquisition and reduces customer acquisition cost'
          },
          14: {
            priority: 'medium',
            focus: 'Product & Market Expansion Actions',
            actions: [
              { name: 'Create Feature Adoption Campaign', exp: 20, type: 'feature_promotion', urgency: 'medium' },
              { name: 'Research Adjacent Market Opportunities', exp: 25, type: 'market_research', urgency: 'low' },
              { name: 'Develop Enterprise Sales Process', exp: 30, type: 'enterprise_process', urgency: 'high' }
            ],
            quickWins: ['Survey users on new features', 'Identify expansion markets', 'Create enterprise demo'],
            impact: 'Expands market reach and increases deal sizes'
          },
          15: {
            priority: 'high',
            focus: 'Revenue Scale & Predictability Actions',
            actions: [
              { name: 'Negotiate Annual Contract Incentives', exp: 35, type: 'contract_optimization', urgency: 'high' },
              { name: 'Build Churn Prediction Model', exp: 30, type: 'churn_prediction', urgency: 'high' },
              { name: 'Implement Sales Performance Analytics', exp: 25, type: 'performance_analytics', urgency: 'medium' }
            ],
            quickWins: ['Create annual pricing incentives', 'Set up renewal alerts', 'Track rep performance metrics'],
            impact: 'Maximizes revenue growth and predictability'
          }
        }
      },

      deal_momentum: {
        name: 'Deal Momentum & Velocity',
        icon: Zap,
        description: 'Deal progression tracking and acceleration',
        stageAdaptations: {
          10: {
            priority: 'medium',
            focus: 'Customer Success & Retention',
            dealTypes: ['Customer Success Check-ins', 'PMF Validation Calls', 'Feedback Sessions'],
            velocityMetrics: ['Time to Value Realization', 'Customer Success Score', 'Feedback Implementation Rate'],
            accelerationTactics: ['Schedule success milestones', 'Create value demonstration', 'Implement feedback quickly']
          },
          11: {
            priority: 'low', 
            focus: 'Team Development & Training',
            dealTypes: ['Team Training Sessions', 'Process Implementation', 'Skill Development'],
            velocityMetrics: ['Training Completion Rate', 'Process Adoption Speed', 'Team Performance Improvement'],
            accelerationTactics: ['Accelerate training schedule', 'Create peer learning groups', 'Implement quick wins']
          },
          12: {
            priority: 'high',
            focus: 'Revenue Deal Acceleration',
            dealTypes: ['Pricing Negotiations', 'Upsell Conversations', 'Contract Renewals'],
            velocityMetrics: ['Deal Close Rate', 'Average Sales Cycle', 'Contract Value Growth'],
            accelerationTactics: ['Create urgency with limited pricing', 'Bundle services for value', 'Incentivize annual contracts']
          },
          13: {
            priority: 'high',
            focus: 'Pipeline Growth & Conversion',
            dealTypes: ['New Prospect Meetings', 'Demo Presentations', 'Referral Introductions'],
            velocityMetrics: ['Pipeline Growth Rate', 'Demo Conversion Rate', 'Referral Success Rate'],
            accelerationTactics: ['Reduce demo wait time', 'Provide instant value demos', 'Leverage social proof']
          },
          14: {
            priority: 'medium',
            focus: 'Enterprise & Expansion Deals',
            dealTypes: ['Enterprise Evaluations', 'Feature Adoptions', 'Market Expansion'],
            velocityMetrics: ['Enterprise Deal Size', 'Feature Adoption Rate', 'Market Penetration Speed'],
            accelerationTactics: ['Create custom demos', 'Show feature value quickly', 'Use market timing pressure']
          },
          15: {
            priority: 'high',
            focus: 'Revenue Scale & Predictability',
            dealTypes: ['Annual Renewals', 'Expansion Deals', 'Strategic Partnerships'],
            velocityMetrics: ['Renewal Rate', 'Expansion Revenue %', 'Partnership ROI'],
            accelerationTactics: ['Early renewal incentives', 'Usage-based expansion triggers', 'Strategic partnership value']
          }
        }
      },

      stakeholder_relationships: {
        name: 'Stakeholder Relationships',
        icon: Users,
        description: 'Multi-threading and engagement scoring',
        stageAdaptations: {
          10: {
            priority: 'high',
            focus: 'Customer Success Stakeholders',
            keyStakeholders: ['End Users', 'Customer Success Managers', 'Product Champions'],
            engagementGoals: ['Deep problem understanding', 'Value realization confirmation', 'Feedback collection'],
            relationshipActions: ['Schedule user interviews', 'Create success partnerships', 'Build feedback channels']
          },
          11: {
            priority: 'medium',
            focus: 'Internal Team Stakeholders',
            keyStakeholders: ['New Hires', 'Team Leads', 'Training Managers'],
            engagementGoals: ['Process standardization', 'Knowledge transfer', 'Performance alignment'],
            relationshipActions: ['Create mentorship programs', 'Establish training cadence', 'Build performance metrics']
          },
          12: {
            priority: 'high',
            focus: 'Revenue Decision Makers',
            keyStakeholders: ['CFOs', 'Revenue Leaders', 'Budget Approvers'],
            engagementGoals: ['ROI demonstration', 'Cost justification', 'Value quantification'],
            relationshipActions: ['Present ROI models', 'Schedule CFO meetings', 'Create business case presentations']
          },
          13: {
            priority: 'high',
            focus: 'Growth & Marketing Stakeholders',
            keyStakeholders: ['Marketing Leaders', 'Growth Teams', 'Channel Partners'],
            engagementGoals: ['Lead quality optimization', 'Channel development', 'Brand advocacy'],
            relationshipActions: ['Align on ICP definition', 'Create partner programs', 'Build referral networks']
          },
          14: {
            priority: 'medium',
            focus: 'Product & Market Stakeholders',
            keyStakeholders: ['Product Managers', 'Market Researchers', 'Enterprise Buyers'],
            engagementGoals: ['Feature adoption', 'Market expansion', 'Enterprise relationships'],
            relationshipActions: ['Co-create product roadmaps', 'Research market needs', 'Build enterprise relationships']
          },
          15: {
            priority: 'high',
            focus: 'Executive & Strategic Stakeholders',
            keyStakeholders: ['C-Suite Executives', 'Board Members', 'Strategic Partners'],
            engagementGoals: ['Strategic alignment', 'Long-term partnerships', 'Revenue predictability'],
            relationshipActions: ['Executive business reviews', 'Board presentation prep', 'Strategic partnership development']
          }
        }
      },

      competitive_intelligence: {
        name: 'Competitive Intelligence',
        icon: Activity,
        description: 'Market positioning and competitor tracking',
        stageAdaptations: {
          10: {
            priority: 'low',
            focus: 'Problem Differentiation',
            competitiveAreas: ['Problem Definition', 'Solution Approach', 'Customer Outcomes'],
            intelligenceActions: ['Map customer alternatives', 'Document unique value props', 'Track customer preferences'],
            insights: 'Focus on proving unique problem-solution fit vs analyzing competitors'
          },
          11: {
            priority: 'low',
            focus: 'Team Positioning',
            competitiveAreas: ['Hiring Competition', 'Talent Retention', 'Team Capabilities'],
            intelligenceActions: ['Research salary benchmarks', 'Track team performance', 'Monitor talent market'],
            insights: 'Understand talent market to build competitive team faster'
          },
          12: {
            priority: 'medium',
            focus: 'Pricing & Value Positioning',
            competitiveAreas: ['Pricing Models', 'Value Delivery', 'ROI Comparison'],
            intelligenceActions: ['Analyze competitor pricing', 'Compare value propositions', 'Track win/loss reasons'],
            insights: 'Position pricing and value against competitive alternatives'
          },
          13: {
            priority: 'high',
            focus: 'Market Share & Positioning',
            competitiveAreas: ['Market Positioning', 'Lead Generation', 'Brand Differentiation'],
            intelligenceActions: ['Monitor competitor marketing', 'Track market share shifts', 'Analyze messaging effectiveness'],
            insights: 'Differentiate in crowded market to accelerate user acquisition'
          },
          14: {
            priority: 'high',
            focus: 'Product & Feature Positioning',
            competitiveAreas: ['Feature Comparison', 'Product Roadmaps', 'Market Expansion'],
            intelligenceActions: ['Track competitor features', 'Monitor product announcements', 'Analyze market responses'],
            insights: 'Stay ahead in product capabilities while expanding to new markets'
          },
          15: {
            priority: 'medium',
            focus: 'Strategic Competitive Positioning',
            competitiveAreas: ['Strategic Partnerships', 'Revenue Models', 'Market Leadership'],
            intelligenceActions: ['Monitor strategic moves', 'Analyze revenue models', 'Track market leadership indicators'],
            insights: 'Maintain competitive advantage while scaling revenue predictably'
          }
        }
      },

      professional_progression: {
        name: 'Professional Development Path',
        icon: Award,
        description: 'Level progression and capability unlocks',
        stageAdaptations: {
          10: {
            priority: 'medium',
            focus: 'Customer Discovery Mastery',
            skillAreas: ['Interview Techniques', 'Problem Analysis', 'Value Measurement'],
            developmentActions: ['Complete customer interview certification', 'Build value tracking framework', 'Create feedback analysis system'],
            milestones: ['10 customer interviews completed', 'Value metrics defined', 'PMF validation achieved']
          },
          11: {
            priority: 'high',
            focus: 'Team Leadership & Process Design',
            skillAreas: ['Process Documentation', 'Team Training', 'Performance Management'],
            developmentActions: ['Create comprehensive playbooks', 'Design training programs', 'Build performance metrics'],
            milestones: ['Sales process documented', 'Team onboarded successfully', 'Performance standards set']
          },
          12: {
            priority: 'high',
            focus: 'Revenue Strategy & Optimization',
            skillAreas: ['Pricing Strategy', 'Funnel Optimization', 'Expansion Revenue'],
            developmentActions: ['Master value-based pricing', 'Optimize conversion funnels', 'Design expansion programs'],
            milestones: ['Pricing strategy implemented', 'Funnel conversion improved 20%', 'Expansion revenue launched']
          },
          13: {
            priority: 'high',
            focus: 'Growth & Scale Expertise',
            skillAreas: ['Lead Generation', 'Sales Velocity', 'Referral Systems'],
            developmentActions: ['Scale lead generation systems', 'Accelerate sales processes', 'Build advocacy programs'],
            milestones: ['Lead quality improved', 'Sales cycle reduced 30%', 'Referral program launched']
          },
          14: {
            priority: 'medium',
            focus: 'Product & Market Expansion',
            skillAreas: ['Feature Adoption', 'Market Research', 'Enterprise Sales'],
            developmentActions: ['Drive feature adoption', 'Research new markets', 'Build enterprise capabilities'],
            milestones: ['Feature adoption >70%', 'New market validated', 'Enterprise process established']
          },
          15: {
            priority: 'high',
            focus: 'Strategic Revenue Leadership',
            skillAreas: ['Revenue Predictability', 'Team Optimization', 'Strategic Planning'],
            developmentActions: ['Build predictable revenue systems', 'Optimize team performance', 'Create strategic frameworks'],
            milestones: ['Revenue predictability >90%', 'Team performance optimized', 'Strategic plans executed']
          }
        }
      }
    };
  }

  /**
   * Get module configuration for specific Series B stage
   */
  getModuleConfigForStage(stage, userCurrentStage = 12) {
    const stageInfo = this.seriesBStages[stage];
    if (!stageInfo) return null;

    const moduleConfigs = [];
    
    Object.entries(this.moduleTemplates).forEach(([moduleId, template]) => {
      const stageAdaptation = template.stageAdaptations[stage];
      if (!stageAdaptation) return;

      const moduleConfig = {
        id: moduleId,
        name: template.name,
        icon: template.icon,
        description: `${template.description} - ${stageAdaptation.focus}`,
        priority: stageAdaptation.priority,
        visible: true,
        defaultExpanded: stageAdaptation.priority === 'high',
        alertCount: stageAdaptation.alerts ? stageAdaptation.alerts.length : 0,
        actionCount: stageAdaptation.actions ? stageAdaptation.actions.length : 0,
        experienceAvailable: stageAdaptation.actions ? 
          stageAdaptation.actions.reduce((total, action) => total + action.exp, 0) : 0,
        
        // Stage-specific content
        stageInfo: {
          stage,
          name: stageInfo.name,
          goal: stageInfo.goal,
          focus: stageInfo.focus,
          criticalSteps: stageInfo.criticalSteps
        },
        
        // Adaptation details
        adaptation: stageAdaptation,
        
        // Dynamic priority based on stage progression
        dynamicPriority: this.calculateDynamicPriority(moduleId, stage, userCurrentStage),
        
        // Next stage preview
        nextStage: stage < 15 ? {
          stage: stage + 1,
          focus: this.moduleTemplates[moduleId].stageAdaptations[stage + 1]?.focus,
          priority: this.moduleTemplates[moduleId].stageAdaptations[stage + 1]?.priority
        } : null
      };

      moduleConfigs.push(moduleConfig);
    });

    // Sort by dynamic priority and experience available
    return moduleConfigs.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.dynamicPriority] - priorityOrder[a.dynamicPriority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.experienceAvailable - a.experienceAvailable;
    });
  }

  /**
   * Calculate dynamic priority based on user's current stage vs target stage
   */
  calculateDynamicPriority(moduleId, targetStage, userCurrentStage) {
    const stageDiff = targetStage - userCurrentStage;
    const baseAdaptation = this.moduleTemplates[moduleId].stageAdaptations[targetStage];
    
    if (!baseAdaptation) return 'low';
    
    // If targeting current stage, use base priority
    if (stageDiff === 0) return baseAdaptation.priority;
    
    // If targeting next stage, slightly elevate priority
    if (stageDiff === 1) {
      return baseAdaptation.priority === 'low' ? 'medium' : 'high';
    }
    
    // If targeting future stages, maintain base priority but add planning flag
    if (stageDiff > 1) return baseAdaptation.priority;
    
    // If targeting past stages, lower priority unless it's foundational
    if (stageDiff < 0) {
      return ['revenue_indicators', 'priority_actions'].includes(moduleId) ? 'medium' : 'low';
    }
    
    return baseAdaptation.priority;
  }

  /**
   * Get stage progression summary
   */
  getStageProgressionSummary(currentStage = 12, targetStage = 15) {
    const stages = [];
    for (let stage = currentStage; stage <= targetStage; stage++) {
      const stageInfo = this.seriesBStages[stage];
      if (stageInfo) {
        stages.push({
          stage,
          name: stageInfo.name,
          goal: stageInfo.goal,
          criticalSteps: stageInfo.criticalSteps,
          focus: stageInfo.focus,
          isActive: stage === currentStage,
          isTarget: stage === targetStage,
          moduleCount: Object.keys(this.moduleTemplates).reduce((count, moduleId) => {
            return this.moduleTemplates[moduleId].stageAdaptations[stage] ? count + 1 : count;
          }, 0)
        });
      }
    }
    return stages;
  }

  /**
   * Get recommended actions for current stage
   */
  getRecommendedActionsForStage(stage) {
    const stageInfo = this.seriesBStages[stage];
    if (!stageInfo) return [];

    const actions = [];
    
    Object.entries(this.moduleTemplates).forEach(([moduleId, template]) => {
      const stageAdaptation = template.stageAdaptations[stage];
      if (stageAdaptation && stageAdaptation.actions) {
        stageAdaptation.actions.forEach(action => {
          actions.push({
            ...action,
            moduleId,
            moduleName: template.name,
            stageFocus: stageAdaptation.focus
          });
        });
      }
    });

    // Sort by experience value and urgency
    return actions.sort((a, b) => {
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      const urgencyDiff = (urgencyOrder[b.urgency] || 0) - (urgencyOrder[a.urgency] || 0);
      if (urgencyDiff !== 0) return urgencyDiff;
      return b.exp - a.exp;
    });
  }
}

export const milestoneModuleService = new MilestoneModuleService();
export default milestoneModuleService;