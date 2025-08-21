/**
 * External Assessment Service
 * Bridges external assessment data from andru-ai.com with platform integration
 */

import { assessmentService } from './assessmentService';
import { airtableService } from './airtableService';

class ExternalAssessmentService {
  constructor() {
    this.apiBaseUrl = 'https://andru-ai.com/api'; // Hypothetical API endpoint
    this.assessmentMappings = this.initializeAssessmentMappings();
  }

  /**
   * Initialize mappings between external assessment data and platform competencies
   */
  initializeAssessmentMappings() {
    return {
      // Map external assessment categories to platform competencies
      customerIntelligence: 'customerAnalysis',
      valueArticulation: 'valueCommunication', 
      salesMethodology: 'salesExecution',
      
      // Map external question types to platform scoring
      likertScale: 'scale',
      multipleChoice: 'multiple_choice',
      
      // Map external scoring to platform points
      scoringMultipliers: {
        'beginner': 0.2,
        'developing': 0.4, 
        'proficient': 0.6,
        'advanced': 0.8,
        'expert': 1.0
      }
    };
  }

  /**
   * Fetch assessment data from external source (andru-ai.com)
   * This simulates fetching data from an external assessment platform
   */
  async fetchExternalAssessmentData(userIdentifier, assessmentType = 'comprehensive') {
    try {
      console.log(`🔗 Fetching external assessment data for: ${userIdentifier}`);
      
      // In production, this would be an actual API call
      // For now, we'll simulate external assessment data structure
      const mockExternalData = await this.simulateExternalAssessmentAPI(userIdentifier, assessmentType);
      
      return {
        success: true,
        data: mockExternalData,
        source: 'andru-ai.com',
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Error fetching external assessment data:', error);
      return {
        success: false,
        error: error.message,
        fallbackToLocal: true
      };
    }
  }

  /**
   * Simulate external assessment API response
   * In production, this would be replaced with actual API calls
   */
  async simulateExternalAssessmentAPI(userIdentifier, assessmentType) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate realistic external assessment data structure
    return {
      userId: userIdentifier,
      assessmentId: `ext_${Date.now()}`,
      assessmentType,
      completedAt: new Date().toISOString(),
      scores: {
        customerIntelligence: {
          raw: 72,
          percentile: 68,
          level: 'proficient',
          subScores: {
            prospectIdentification: 75,
            qualificationMethodology: 70,
            stakeholderMapping: 71
          }
        },
        valueArticulation: {
          raw: 64,
          percentile: 55,
          level: 'developing',
          subScores: {
            roiCommunication: 62,
            objectionHandling: 68,
            proposalDevelopment: 63
          }
        },
        salesMethodology: {
          raw: 78,
          percentile: 74,
          level: 'advanced',
          subScores: {
            pipelineManagement: 80,
            stakeholderEngagement: 76,
            dealProgression: 78
          }
        }
      },
      behavioralInsights: {
        communicationStyle: 'analytical',
        decisionMakingPattern: 'data-driven',
        learningPreference: 'visual-kinesthetic',
        stressResponsePattern: 'systematic-approach'
      },
      industryContext: {
        primaryIndustry: 'technology',
        secondaryIndustries: ['saas', 'fintech'],
        avgDealSize: 85000,
        salesCycleLength: 90,
        competitiveEnvironment: 'high'
      },
      developmentRecommendations: [
        {
          area: 'valueArticulation',
          priority: 'high',
          recommendation: 'Focus on ROI quantification methodologies',
          estimatedImpact: 'medium-high',
          timeframe: '4-6 weeks'
        },
        {
          area: 'customerIntelligence',
          priority: 'medium',
          recommendation: 'Enhance qualification frameworks',
          estimatedImpact: 'medium',
          timeframe: '2-3 weeks'
        }
      ]
    };
  }

  /**
   * Transform external assessment data to platform format
   */
  transformExternalDataToPlatformFormat(externalData) {
    const transformed = {
      assessmentResponses: [],
      competencyScores: {},
      behavioralProfile: {},
      developmentPlan: {},
      sourceMetadata: {
        externalSource: 'andru-ai.com',
        assessmentId: externalData.assessmentId,
        completedAt: externalData.completedAt
      }
    };

    // Transform competency scores
    Object.keys(externalData.scores).forEach(externalCategory => {
      const platformCategory = this.assessmentMappings[externalCategory];
      if (platformCategory) {
        const externalScore = externalData.scores[externalCategory];
        transformed.competencyScores[platformCategory] = {
          baseline: externalScore.raw,
          current: externalScore.raw,
          percentile: externalScore.percentile,
          level: externalScore.level,
          subScores: externalScore.subScores || {}
        };
      }
    });

    // Transform behavioral insights
    transformed.behavioralProfile = {
      communicationStyle: externalData.behavioralInsights?.communicationStyle || 'balanced',
      decisionMakingPattern: externalData.behavioralInsights?.decisionMakingPattern || 'intuitive',
      learningPreference: externalData.behavioralInsights?.learningPreference || 'visual',
      stressResponsePattern: externalData.behavioralInsights?.stressResponsePattern || 'adaptive'
    };

    // Transform development recommendations
    transformed.developmentPlan = {
      recommendations: externalData.developmentRecommendations?.map(rec => ({
        category: this.assessmentMappings[rec.area] || rec.area,
        priority: rec.priority,
        action: rec.recommendation,
        estimatedImpact: rec.estimatedImpact,
        timeframe: rec.timeframe
      })) || [],
      industryContext: externalData.industryContext || {}
    };

    // Generate synthetic assessment responses for compatibility
    Object.keys(transformed.competencyScores).forEach(category => {
      const score = transformed.competencyScores[category];
      
      // Create synthetic responses based on score
      const questionsForCategory = assessmentService.assessmentQuestions[category] || [];
      questionsForCategory.forEach((question, index) => {
        let syntheticValue;
        
        if (question.type === 'multiple_choice') {
          // Select option based on score
          const optionIndex = Math.floor((score.baseline / 100) * question.options.length);
          syntheticValue = question.options[Math.min(optionIndex, question.options.length - 1)].value;
        } else if (question.type === 'scale') {
          // Convert percentage to scale value
          syntheticValue = Math.round((score.baseline / 100) * question.scale.max);
        }
        
        transformed.assessmentResponses.push({
          questionId: question.id,
          value: syntheticValue,
          source: 'external',
          timestamp: externalData.completedAt
        });
      });
    });

    return transformed;
  }

  /**
   * Integrate external assessment data with platform
   */
  async integrateExternalAssessment(customerId, userIdentifier) {
    try {
      console.log(`🔄 Integrating external assessment for customer: ${customerId}`);
      
      // Fetch external data
      const externalResult = await this.fetchExternalAssessmentData(userIdentifier);
      
      if (!externalResult.success) {
        console.warn('External assessment fetch failed, using local assessment only');
        return {
          success: false,
          fallbackToLocal: true,
          error: externalResult.error
        };
      }

      // Transform to platform format
      const transformedData = this.transformExternalDataToPlatformFormat(externalResult.data);
      
      // Update customer competency data in Airtable
      const updateResult = await this.updateCustomerCompetencyData(customerId, transformedData);
      
      if (updateResult.success) {
        console.log('✅ External assessment data successfully integrated');
        
        // Generate enhanced development plan
        const enhancedPlan = await this.generateEnhancedDevelopmentPlan(customerId, transformedData);
        
        return {
          success: true,
          integrationComplete: true,
          competencyData: transformedData.competencyScores,
          behavioralProfile: transformedData.behavioralProfile,
          developmentPlan: enhancedPlan,
          sourceMetadata: transformedData.sourceMetadata
        };
      } else {
        throw new Error(`Failed to update customer data: ${updateResult.error}`);
      }
      
    } catch (error) {
      console.error('Error integrating external assessment:', error);
      return {
        success: false,
        error: error.message,
        fallbackToLocal: true
      };
    }
  }

  /**
   * Update customer competency data with external assessment results
   */
  async updateCustomerCompetencyData(customerId, transformedData) {
    try {
      const competencyUpdate = {
        // Set baseline scores from external assessment
        baselineCustomerAnalysis: transformedData.competencyScores.customerAnalysis?.baseline || 60,
        baselineValueCommunication: transformedData.competencyScores.valueCommunication?.baseline || 60,
        baselineSalesExecution: transformedData.competencyScores.salesExecution?.baseline || 60,
        
        // Set current scores (same as baseline initially)
        currentCustomerAnalysis: transformedData.competencyScores.customerAnalysis?.current || 60,
        currentValueCommunication: transformedData.competencyScores.valueCommunication?.current || 60,
        currentSalesExecution: transformedData.competencyScores.salesExecution?.current || 60,
        
        // Add behavioral profile data
        behavioralProfile: JSON.stringify(transformedData.behavioralProfile),
        
        // Add external assessment metadata
        externalAssessmentData: JSON.stringify({
          sourceId: transformedData.sourceMetadata.assessmentId,
          completedAt: transformedData.sourceMetadata.completedAt,
          source: transformedData.sourceMetadata.externalSource,
          lastSync: new Date().toISOString()
        }),
        
        // Update competency progress tracking
        competencyProgress: JSON.stringify({
          ...transformedData.competencyScores,
          lastUpdated: new Date().toISOString(),
          dataSource: 'external_integration'
        })
      };

      // Update via airtableService
      const result = await airtableService.updateCustomerAssets(customerId, competencyUpdate);
      
      return {
        success: true,
        updateResult: result
      };
      
    } catch (error) {
      console.error('Error updating customer competency data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate enhanced development plan combining platform and external insights
   */
  async generateEnhancedDevelopmentPlan(customerId, transformedData) {
    try {
      // Get current customer data
      const customerData = await airtableService.getCustomerAssets(customerId);
      
      // Generate baseline plan using platform service
      const competencyData = {
        currentCustomerAnalysis: transformedData.competencyScores.customerAnalysis?.current || 60,
        currentValueCommunication: transformedData.competencyScores.valueCommunication?.current || 60,
        currentSalesExecution: transformedData.competencyScores.salesExecution?.current || 60,
        baselineCustomerAnalysis: transformedData.competencyScores.customerAnalysis?.baseline || 60,
        baselineValueCommunication: transformedData.competencyScores.valueCommunication?.baseline || 60,
        baselineSalesExecution: transformedData.competencyScores.salesExecution?.baseline || 60,
        totalProgressPoints: customerData?.totalProgressPoints || 0
      };
      
      const basePlan = assessmentService.generateDevelopmentPlan(competencyData);
      
      // Enhance with external insights
      const enhancedPlan = {
        ...basePlan,
        externalInsights: transformedData.developmentPlan.recommendations,
        behavioralAdaptations: this.generateBehavioralAdaptations(transformedData.behavioralProfile),
        industrySpecificGuidance: this.generateIndustryGuidance(transformedData.developmentPlan.industryContext),
        integratedRecommendations: this.mergeRecommendations(
          basePlan.recommendations, 
          transformedData.developmentPlan.recommendations
        )
      };
      
      return enhancedPlan;
      
    } catch (error) {
      console.error('Error generating enhanced development plan:', error);
      // Fallback to basic plan
      return assessmentService.generateDevelopmentPlan({
        currentCustomerAnalysis: 60,
        currentValueCommunication: 60,
        currentSalesExecution: 60,
        totalProgressPoints: 0
      });
    }
  }

  /**
   * Generate behavioral adaptations based on external behavioral profile
   */
  generateBehavioralAdaptations(behavioralProfile) {
    const adaptations = [];
    
    // Communication style adaptations
    switch (behavioralProfile.communicationStyle) {
      case 'analytical':
        adaptations.push({
          area: 'communication',
          adaptation: 'Leverage data-driven presentations and detailed ROI models',
          toolRecommendation: 'Cost Calculator with detailed metrics',
          impact: 'Aligns with analytical communication preference'
        });
        break;
      case 'relationship-focused':
        adaptations.push({
          area: 'communication', 
          adaptation: 'Emphasize stakeholder relationship mapping and empathy frameworks',
          toolRecommendation: 'Buyer Persona development with emotional intelligence',
          impact: 'Enhances relationship-building capabilities'
        });
        break;
    }
    
    // Learning preference adaptations
    switch (behavioralProfile.learningPreference) {
      case 'visual-kinesthetic':
        adaptations.push({
          area: 'learning',
          adaptation: 'Use interactive tools and visual frameworks for skill development',
          toolRecommendation: 'Interactive ICP Analysis with visual mapping',
          impact: 'Optimizes learning efficiency'
        });
        break;
    }
    
    return adaptations;
  }

  /**
   * Generate industry-specific guidance
   */
  generateIndustryGuidance(industryContext) {
    if (!industryContext.primaryIndustry) return [];
    
    const guidance = [];
    
    // Technology industry specific
    if (industryContext.primaryIndustry === 'technology') {
      guidance.push({
        area: 'industry_context',
        recommendation: 'Focus on technical ROI and scalability metrics',
        rationale: 'Technology buyers prioritize quantifiable technical benefits',
        applicableTools: ['Cost Calculator', 'Business Case Builder']
      });
    }
    
    // Deal size specific guidance
    if (industryContext.avgDealSize > 50000) {
      guidance.push({
        area: 'sales_methodology',
        recommendation: 'Implement complex stakeholder engagement strategies',
        rationale: 'Large deals require multi-threaded relationship development',
        applicableTools: ['ICP Analysis', 'Stakeholder Mapping']
      });
    }
    
    return guidance;
  }

  /**
   * Merge platform and external recommendations
   */
  mergeRecommendations(platformRecs, externalRecs) {
    const merged = [...platformRecs];
    
    // Add external recommendations that don't duplicate platform ones
    externalRecs.forEach(extRec => {
      const isDuplicate = platformRecs.some(platRec => 
        platRec.category === extRec.category && 
        platRec.priority === extRec.priority
      );
      
      if (!isDuplicate) {
        merged.push({
          ...extRec,
          source: 'external',
          enhanced: true
        });
      }
    });
    
    // Sort by priority
    return merged.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Check if external assessment data is available for user
   */
  async checkExternalAssessmentAvailability(userIdentifier) {
    try {
      // In production, this would ping the external API to check availability
      console.log(`🔍 Checking external assessment availability for: ${userIdentifier}`);
      
      // Simulate availability check
      const isAvailable = Math.random() > 0.3; // 70% chance of availability
      
      return {
        available: isAvailable,
        lastAssessment: isAvailable ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString() : null,
        assessmentTypes: isAvailable ? ['comprehensive', 'quick', 'behavioral'] : [],
        dataQuality: isAvailable ? 'high' : null
      };
      
    } catch (error) {
      console.error('Error checking external assessment availability:', error);
      return {
        available: false,
        error: error.message
      };
    }
  }

  /**
   * Sync external assessment data periodically
   */
  async syncExternalAssessmentData(customerId, userIdentifier, forceSync = false) {
    try {
      console.log(`🔄 Syncing external assessment data for customer: ${customerId}`);
      
      // Check if sync is needed
      if (!forceSync) {
        const customerData = await airtableService.getCustomerAssets(customerId);
        const lastSync = customerData?.externalAssessmentData ? 
          JSON.parse(customerData.externalAssessmentData).lastSync : null;
        
        if (lastSync) {
          const daysSinceSync = (Date.now() - new Date(lastSync).getTime()) / (1000 * 60 * 60 * 24);
          if (daysSinceSync < 7) { // Don't sync more than once per week
            console.log('⏭️ Skipping sync - recent sync detected');
            return { success: true, skipped: true, reason: 'recent_sync' };
          }
        }
      }
      
      // Perform integration
      const integrationResult = await this.integrateExternalAssessment(customerId, userIdentifier);
      
      return {
        success: integrationResult.success,
        synced: integrationResult.success,
        timestamp: new Date().toISOString(),
        result: integrationResult
      };
      
    } catch (error) {
      console.error('Error syncing external assessment data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const externalAssessmentService = new ExternalAssessmentService();
export default externalAssessmentService;