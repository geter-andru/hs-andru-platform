/**
 * TechnicalTranslationService - Sarah Chen's 6:47 AM Crisis Solver
 * 
 * Converts technical metrics into stakeholder-specific business language
 * for Series A technical founders who need systematic buyer understanding.
 * 
 * Core Use Case: "How does 10x faster processing translate to 
 * 'reduces quarterly reporting from 6 weeks to 3 days'?"
 */

class TechnicalTranslationService {
  constructor() {
    // Industry-specific translation frameworks
    this.industryFrameworks = {
      healthcare: {
        name: 'Healthcare & Medical',
        stakeholders: ['CFO', 'COO', 'Compliance Officer', 'Medical Director'],
        painPoints: {
          'regulatory_reporting': 'Regulatory compliance and reporting overhead',
          'claim_processing': 'Insurance claim processing delays',
          'patient_data': 'Patient data management complexity',
          'audit_compliance': 'Audit preparation and compliance costs'
        },
        translationTemplates: {
          'processing_speed': {
            technical: 'processing speed improvement',
            business: 'reduces operational overhead and compliance costs',
            cfoLanguage: 'cost per processed transaction',
            cooLanguage: 'operational efficiency and turnaround time'
          }
        }
      },
      logistics: {
        name: 'Logistics & Supply Chain',
        stakeholders: ['CFO', 'COO', 'Supply Chain Director', 'Operations Manager'],
        painPoints: {
          'visibility_gaps': 'Supply chain visibility and tracking',
          'inventory_costs': 'Inventory carrying costs and waste',
          'delivery_delays': 'Delivery delays and customer satisfaction',
          'cost_optimization': 'Route and cost optimization'
        },
        translationTemplates: {
          'tracking_accuracy': {
            technical: 'tracking accuracy improvement',
            business: 'reduces inventory waste and improves customer satisfaction',
            cfoLanguage: 'inventory carrying cost reduction',
            cooLanguage: 'operational visibility and control'
          }
        }
      },
      fintech: {
        name: 'Financial Technology',
        stakeholders: ['CFO', 'CRO', 'Compliance Officer', 'Risk Manager'],
        painPoints: {
          'transaction_costs': 'Transaction processing costs and fees',
          'fraud_prevention': 'Fraud detection and prevention',
          'regulatory_compliance': 'Financial regulatory compliance',
          'risk_management': 'Risk assessment and management'
        },
        translationTemplates: {
          'fraud_detection': {
            technical: 'fraud detection accuracy',
            business: 'reduces financial losses and regulatory risk',
            cfoLanguage: 'cost per prevented fraud incident',
            croLanguage: 'risk mitigation and compliance assurance'
          }
        }
      }
    };

    // Stakeholder-specific language patterns
    this.stakeholderLanguage = {
      'CFO': {
        focus: 'cost reduction and ROI',
        metrics: ['cost per unit', 'ROI percentage', 'payback period', 'cost savings'],
        concerns: ['budget impact', 'financial risk', 'implementation cost'],
        language: 'financial and quantitative'
      },
      'COO': {
        focus: 'operational efficiency and scalability',
        metrics: ['process efficiency', 'turnaround time', 'capacity utilization'],
        concerns: ['operational disruption', 'scalability', 'team productivity'],
        language: 'operational and process-focused'
      },
      'CTO': {
        focus: 'technical feasibility and integration',
        metrics: ['system performance', 'integration complexity', 'technical debt'],
        concerns: ['technical risk', 'system compatibility', 'maintenance'],
        language: 'technical and architecture-focused'
      }
    };

    // Common technical metric translations
    this.metricTranslations = {
      'processing_speed': {
        '2x_faster': 'Reduces processing time by 50%',
        '5x_faster': 'Reduces processing time by 80%',
        '10x_faster': 'Reduces processing time by 90%'
      },
      'accuracy_improvement': {
        '95_to_99': 'Reduces errors by 80% (95% → 99% accuracy)',
        '90_to_95': 'Reduces errors by 50% (90% → 95% accuracy)',
        '85_to_95': 'Reduces errors by 67% (85% → 95% accuracy)'
      },
      'cost_reduction': {
        '20_percent': 'Reduces operational costs by 20%',
        '40_percent': 'Reduces operational costs by 40%',
        '60_percent': 'Reduces operational costs by 60%'
      }
    };
  }

  /**
   * Main translation method - Sarah's crisis resolver
   * @param {Object} input - Technical metrics and context
   * @returns {Object} - Stakeholder-specific translations
   */
  translateTechnicalMetric(input) {
    const {
      technicalMetric,
      improvement,
      industry,
      targetStakeholder,
      customerContext,
      competitorClaim
    } = input;

    // Get industry framework
    const industryFramework = this.industryFrameworks[industry] || this.industryFrameworks.healthcare;
    
    // Get stakeholder language preferences
    const stakeholderPrefs = this.stakeholderLanguage[targetStakeholder] || this.stakeholderLanguage.CFO;

    // Generate base translation
    const baseTranslation = this._generateBaseTranslation(technicalMetric, improvement, industryFramework);
    
    // Generate stakeholder-specific version
    const stakeholderTranslation = this._generateStakeholderTranslation(
      baseTranslation, 
      stakeholderPrefs, 
      customerContext,
      improvement
    );

    // Generate competitive positioning
    const competitivePosition = this._generateCompetitivePosition(
      technicalMetric, 
      improvement, 
      competitorClaim
    );

    // Generate supporting evidence
    const supportingEvidence = this._generateSupportingEvidence(
      technicalMetric, 
      improvement, 
      industry
    );

    return {
      technicalInput: `${technicalMetric}: ${improvement}`,
      businessTranslation: stakeholderTranslation.primary,
      stakeholderSpecific: {
        language: stakeholderTranslation.language,
        keyMetrics: stakeholderTranslation.metrics,
        painPointConnection: stakeholderTranslation.painPoint,
        roiCalculation: stakeholderTranslation.roi
      },
      competitivePositioning: competitivePosition,
      supportingEvidence: supportingEvidence,
      usageInstructions: {
        elevator: `"${stakeholderTranslation.elevator}"`,
        email: stakeholderTranslation.email,
        presentation: stakeholderTranslation.presentation,
        proposal: stakeholderTranslation.proposal
      },
      generatedAt: new Date().toISOString(),
      industry: industryFramework.name,
      targetStakeholder: targetStakeholder
    };
  }

  /**
   * Generate base business translation from technical metric
   */
  _generateBaseTranslation(technicalMetric, improvement, industryFramework) {
    const template = industryFramework.translationTemplates[technicalMetric];
    
    if (!template) {
      return {
        business: `Improves ${technicalMetric} by ${improvement}`,
        impact: 'operational efficiency and cost reduction'
      };
    }

    return {
      business: template.business,
      impact: template.business,
      cfoVersion: template.cfoLanguage,
      cooVersion: template.cooLanguage
    };
  }

  /**
   * Generate stakeholder-specific translation
   */
  _generateStakeholderTranslation(baseTranslation, stakeholderPrefs, customerContext, improvement = 'technical improvement') {
    const customerName = customerContext?.name || 'your organization';
    const customerIndustry = customerContext?.industry || 'your industry';

    // CFO-specific translation
    if (stakeholderPrefs.focus.includes('cost reduction')) {
      return {
        primary: `Reduces operational costs for ${customerName} by improving efficiency`,
        language: 'financial impact and ROI',
        metrics: ['cost per transaction', 'annual cost savings', 'payback period'],
        painPoint: 'High operational costs reducing profitability',
        roi: 'Typical customers see 15-25% cost reduction within 6 months',
        elevator: `We help ${customerIndustry} companies like ${customerName} reduce operational costs by 20-40% through improved processing efficiency`,
        email: `Based on your current volume, this could reduce your operational costs by approximately $X annually`,
        presentation: `Cost Impact Analysis: How ${improvement} translates to ${customerName}'s bottom line`,
        proposal: `Financial Impact Assessment: Projected cost savings and ROI timeline for ${customerName}`
      };
    }

    // COO-specific translation
    if (stakeholderPrefs.focus.includes('operational efficiency')) {
      return {
        primary: `Improves operational efficiency and reduces processing bottlenecks`,
        language: 'operational impact and scalability',
        metrics: ['process efficiency', 'turnaround time', 'capacity utilization'],
        painPoint: 'Operational bottlenecks limiting growth and customer satisfaction',
        roi: 'Typical customers improve operational capacity by 30-50% without additional staff',
        elevator: `We help ${customerIndustry} operations teams scale efficiently without proportional staff increases`,
        email: `This improvement could help your team handle 2-3x current volume with existing resources`,
        presentation: `Operational Efficiency Analysis: Scaling capacity without scaling costs`,
        proposal: `Operations Transformation Plan: Systematic efficiency improvements for ${customerName}`
      };
    }

    // Default business translation
    return {
      primary: baseTranslation.business,
      language: 'business impact and efficiency',
      metrics: ['efficiency improvement', 'time savings', 'error reduction'],
      painPoint: 'Operational inefficiencies impacting business performance',
      roi: 'Typical improvement results in measurable business impact within 3-6 months',
      elevator: `We help companies improve their core operations for better business outcomes`,
      email: `This could significantly improve your operational performance`,
      presentation: `Business Impact: How technical improvements drive business results`,
      proposal: `Technical Implementation Plan: Systematic improvements for business impact`
    };
  }

  /**
   * Generate competitive positioning
   */
  _generateCompetitivePosition(technicalMetric, improvement, competitorClaim) {
    if (!competitorClaim) {
      return {
        position: 'Market-leading performance',
        differentiation: 'Proven technical advantage',
        validation: 'Customer case study available'
      };
    }

    return {
      position: `Our ${improvement} improvement vs. competitor's ${competitorClaim}`,
      differentiation: 'Sustainable technical advantage with proven methodology',
      validation: 'Validated through customer implementations and case studies',
      counterClaim: `While competitors claim ${competitorClaim}, our approach delivers consistent, measurable results`
    };
  }

  /**
   * Generate supporting evidence and case studies
   */
  _generateSupportingEvidence(technicalMetric, improvement, industry) {
    return {
      caseStudy: `Customer case study: ${industry} company achieved ${improvement} in ${technicalMetric}`,
      benchmark: `Industry benchmark: Top 10% of ${industry} companies typically see this level of improvement`,
      methodology: `Our systematic approach ensures consistent results across implementations`,
      timeline: `Typical implementation: 30-60 days to full deployment, 90 days to measurable ROI`
    };
  }

  /**
   * Quick translation for common scenarios (Sarah's daily use)
   */
  quickTranslate(technicalMetric, improvement, stakeholder = 'CFO') {
    return this.translateTechnicalMetric({
      technicalMetric,
      improvement,
      industry: 'healthcare', // Default to Sarah's context
      targetStakeholder: stakeholder,
      customerContext: { name: 'Target Customer', industry: 'Healthcare' }
    });
  }

  /**
   * Get available industries and frameworks
   */
  getAvailableFrameworks() {
    return Object.keys(this.industryFrameworks).map(key => ({
      id: key,
      name: this.industryFrameworks[key].name,
      stakeholders: this.industryFrameworks[key].stakeholders
    }));
  }

  /**
   * Get stakeholder language preferences
   */
  getStakeholderPreferences(stakeholder) {
    return this.stakeholderLanguage[stakeholder] || this.stakeholderLanguage.CFO;
  }
}

// Export singleton instance
const technicalTranslationService = new TechnicalTranslationService();
export default technicalTranslationService;

// Example usage for Sarah Chen's scenario:
/*
const sarahsTranslation = technicalTranslationService.translateTechnicalMetric({
  technicalMetric: 'processing_speed',
  improvement: '10x faster',
  industry: 'healthcare',
  targetStakeholder: 'CFO',
  customerContext: {
    name: 'MedGlobal',
    industry: 'Healthcare',
    size: 'Enterprise',
    painPoint: 'Quarterly reporting overhead'
  },
  competitorClaim: '40% cost reduction'
});

// Result: "Reduces quarterly reporting from 6 weeks to 3 days"
// Plus stakeholder-specific talking points, ROI calculations, and competitive positioning
*/