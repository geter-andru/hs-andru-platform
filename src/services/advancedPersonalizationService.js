// Advanced Personalization Service for Series A Technical Founders
// Adapts platform experience based on assessment data and user behavior

class AdvancedPersonalizationService {
  constructor() {
    this.personalizationCache = new Map();
    this.behaviorTracker = {
      toolUsage: {},
      timeSpent: {},
      completionRates: {},
      engagementPatterns: {}
    };
  }

  // Generate personalized experience based on assessment data
  generatePersonalizedExperience(assessmentData, userBehavior = {}) {
    const cacheKey = `${assessmentData.sessionId}_${Date.now()}`;
    
    if (this.personalizationCache.has(cacheKey)) {
      return this.personalizationCache.get(cacheKey);
    }

    const experience = {
      dashboard: this._personalizedDashboard(assessmentData),
      toolRecommendations: this._generateToolRecommendations(assessmentData),
      contentPriorities: this._determineContentPriorities(assessmentData),
      urgencyIndicators: this._calculateUrgencyFactors(assessmentData),
      successPathway: this._generateSuccessPathway(assessmentData),
      messaging: this._personalizeMessaging(assessmentData)
    };

    this.personalizationCache.set(cacheKey, experience);
    return experience;
  }

  // Personalized dashboard layout based on challenges
  _personalizedDashboard(data) {
    const challenges = data.challenges || 0;
    const score = data.score || 0;
    
    if (score < 40) {
      return {
        priority: 'crisis',
        layout: 'intervention',
        focusTools: ['icp-analysis', 'cost-calculator'],
        hiddenSections: ['advanced-analytics'],
        urgentActions: [
          'Complete ICP Analysis immediately',
          'Calculate cost of current inefficiencies', 
          'Schedule stakeholder alignment meeting'
        ]
      };
    } else if (score < 70) {
      return {
        priority: 'optimization',
        layout: 'improvement',
        focusTools: ['cost-calculator', 'business-case'],
        urgentActions: [
          'Build ROI justification',
          'Create executive presentation',
          'Plan pilot program'
        ]
      };
    } else {
      return {
        priority: 'scaling',
        layout: 'growth',
        focusTools: ['business-case', 'advanced-analytics'],
        urgentActions: [
          'Scale successful methodologies',
          'Develop enterprise partnerships',
          'Build competitive moats'
        ]
      };
    }
  }

  // Tool recommendations based on specific challenges
  _generateToolRecommendations(data) {
    const recommendations = [];
    const challenges = data.challenges || 0;
    const focusArea = data.focusArea;
    const businessModel = data.businessModel;

    // Crisis-level recommendations
    if (data.score < 40) {
      recommendations.push({
        tool: 'ICP Analysis',
        urgency: 'immediate',
        reason: `${challenges} critical gaps identified requiring immediate customer intelligence`,
        timeToValue: '2-3 hours',
        expectedImpact: 'Prevent further revenue leakage'
      });
    }

    // Business model specific recommendations
    if (businessModel === 'B2B SaaS') {
      recommendations.push({
        tool: 'Cost Calculator',
        urgency: 'high',
        reason: 'SaaS metrics require precise ROI modeling for enterprise sales',
        timeToValue: '1-2 days',
        expectedImpact: 'Accelerate enterprise deal closure by 40%'
      });
    }

    // Focus area specific recommendations
    if (focusArea?.includes('revenue')) {
      recommendations.push({
        tool: 'Business Case Builder',
        urgency: 'medium',
        reason: 'Revenue focus requires systematic pilot-to-contract methodology',
        timeToValue: '3-5 days',
        expectedImpact: 'Convert 65% more pilots to full contracts'
      });
    }

    return recommendations.slice(0, 3); // Top 3 recommendations
  }

  // Content priorities based on user profile
  _determineContentPriorities(data) {
    const priorities = [];
    const score = data.score || 0;
    
    if (score < 50) {
      priorities.push(
        'Foundation Building',
        'Crisis Resolution', 
        'Quick Wins',
        'Executive Alignment'
      );
    } else {
      priorities.push(
        'Scaling Optimization',
        'Enterprise Growth',
        'Competitive Advantage',
        'Strategic Partnerships'
      );
    }

    return priorities;
  }

  // Calculate urgency factors for personalized messaging
  _calculateUrgencyFactors(data) {
    const factors = {
      revenue: this._calculateRevenueUrgency(data),
      competitive: this._calculateCompetitiveUrgency(data),
      operational: this._calculateOperationalUrgency(data),
      strategic: this._calculateStrategicUrgency(data)
    };

    // Calculate overall urgency score
    const urgencyScore = Object.values(factors).reduce((sum, factor) => sum + factor.score, 0) / 4;
    
    return {
      overall: urgencyScore,
      primary: this._getPrimaryUrgencyFactor(factors),
      factors
    };
  }

  _calculateRevenueUrgency(data) {
    const score = data.score || 0;
    const challenges = data.challenges || 0;
    
    if (score < 40) {
      return {
        score: 9,
        message: 'Critical revenue gaps requiring immediate action',
        timeline: 'Act within 48 hours'
      };
    } else if (score < 60) {
      return {
        score: 6,
        message: 'Significant revenue optimization opportunities',
        timeline: 'Act within 1 week'
      };
    } else {
      return {
        score: 3,
        message: 'Strategic revenue growth optimization',
        timeline: 'Plan within 2 weeks'
      };
    }
  }

  _calculateCompetitiveUrgency(data) {
    // Series A companies face intense competitive pressure
    return {
      score: 7,
      message: 'Competitive advantage window closing rapidly',
      timeline: 'Market timing critical'
    };
  }

  _calculateOperationalUrgency(data) {
    const challenges = data.challenges || 0;
    return {
      score: Math.min(challenges * 1.5, 10),
      message: `${challenges} operational gaps impacting growth velocity`,
      timeline: 'Efficiency gains compound monthly'
    };
  }

  _calculateStrategicUrgency(data) {
    // Strategic urgency increases with company revenue potential
    const revenue = data.score * 50000 || 2000000;
    const urgencyScore = revenue > 5000000 ? 8 : 5;
    
    return {
      score: urgencyScore,
      message: 'Strategic positioning window for next funding round',
      timeline: 'Position before Series B discussions'
    };
  }

  _getPrimaryUrgencyFactor(factors) {
    return Object.entries(factors).reduce((max, [key, factor]) => 
      factor.score > max.score ? { type: key, ...factor } : max
    , { score: 0 });
  }

  // Generate personalized success pathway
  _generateSuccessPathway(data) {
    const pathway = {
      immediate: [], // 0-7 days
      shortTerm: [], // 1-4 weeks
      longTerm: [] // 1-3 months
    };

    if (data.score < 40) {
      pathway.immediate = [
        'Complete ICP Analysis to stop revenue leakage',
        'Identify top 3 ideal customer segments',
        'Calculate true cost of current inefficiencies'
      ];
      pathway.shortTerm = [
        'Rebuild sales methodology with customer intelligence',
        'Create executive-ready ROI presentations',
        'Launch targeted pilot programs'
      ];
      pathway.longTerm = [
        'Scale proven customer acquisition model',
        'Build predictable enterprise sales engine',
        'Achieve Series B revenue metrics'
      ];
    } else {
      pathway.immediate = [
        'Optimize existing customer acquisition channels',
        'Build enterprise-grade value propositions',
        'Establish competitive differentiation'
      ];
      pathway.shortTerm = [
        'Scale successful sales methodologies',
        'Build strategic partnership pipeline',
        'Implement advanced revenue intelligence'
      ];
      pathway.longTerm = [
        'Dominate target market segments',
        'Build sustainable competitive moats',
        'Prepare for growth stage scaling'
      ];
    }

    return pathway;
  }

  // Personalize all messaging throughout platform
  _personalizeMessaging(data) {
    const score = data.score || 0;
    const company = data.productName || 'your company';
    const challenges = data.challenges || 0;

    return {
      welcome: {
        headline: score < 40 ? 
          `Critical: ${company} needs immediate revenue intervention` :
          `Optimize ${company}'s revenue growth trajectory`,
        subtext: score < 40 ?
          'Your assessment revealed urgent gaps requiring immediate action' :
          'Your assessment shows strong foundation ready for optimization'
      },
      navigation: {
        icpTab: challenges > 3 ? 'Fix Customer Intelligence (Critical)' : 'Optimize Customer Intelligence',
        costTab: score < 50 ? 'Calculate Intervention ROI' : 'Optimize Financial Impact',
        businessTab: score < 60 ? 'Build Crisis Recovery Plan' : 'Scale Success Methodology'
      },
      callsToAction: {
        primary: score < 40 ? 'Stop Revenue Bleeding Now' : 'Accelerate Growth',
        secondary: score < 40 ? 'Calculate Crisis Cost' : 'Optimize Performance'
      }
    };
  }

  // Track user behavior for continuous personalization improvement
  trackBehavior(userId, action, data = {}) {
    if (!this.behaviorTracker[action]) {
      this.behaviorTracker[action] = {};
    }
    
    this.behaviorTracker[action][userId] = {
      ...this.behaviorTracker[action][userId],
      timestamp: Date.now(),
      ...data
    };

    // Update personalization based on behavior
    this._updatePersonalization(userId, action, data);
  }

  _updatePersonalization(userId, action, data) {
    // Real-time personalization updates based on user behavior
    // This would integrate with the main platform state management
    console.log(`Updating personalization for ${userId} based on ${action}`, data);
  }

  // Get personalized content for specific contexts
  getPersonalizedContent(context, assessmentData, userBehavior = {}) {
    const experience = this.generatePersonalizedExperience(assessmentData, userBehavior);
    
    switch (context) {
      case 'dashboard-welcome':
        return experience.messaging.welcome;
      case 'tool-recommendations':
        return experience.toolRecommendations;
      case 'success-pathway':
        return experience.successPathway;
      case 'urgency-messaging':
        return experience.urgencyIndicators;
      default:
        return experience;
    }
  }
}

export const advancedPersonalizationService = new AdvancedPersonalizationService();
export default AdvancedPersonalizationService;