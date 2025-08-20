/**
 * Customer Value Optimization Analytics Service
 * Tracks user workflow performance and identifies optimization opportunities
 */

class ValueOptimizationAnalytics {
  constructor() {
    this.sessionData = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      customerId: null,
      workflowSteps: [],
      frictionPoints: [],
      valueRecognitionTime: null,
      totalWorkflowTime: null,
      exportSuccessRate: 0,
      professionalCredibilityScore: 100 // Start at perfect, reduce for gaming terminology
    };
    
    this.stepTiming = new Map();
    this.currentStep = null;
    this.isTracking = false;
  }

  // Generate unique session ID
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Start tracking workflow
  startWorkflowTracking(customerId) {
    this.sessionData.customerId = customerId;
    this.sessionData.startTime = Date.now();
    this.isTracking = true;
    
    console.log(`🎯 Starting Sarah Chen workflow tracking for ${customerId}`, {
      sessionId: this.sessionData.sessionId,
      target: '15 minutes total workflow'
    });
    
    return this.sessionData.sessionId;
  }

  // Track individual workflow steps
  startStep(stepName, metadata = {}) {
    if (!this.isTracking) return;

    const stepStart = Date.now();
    
    // End previous step if exists
    if (this.currentStep) {
      this.endStep(this.currentStep);
    }

    this.currentStep = stepName;
    this.stepTiming.set(stepName, {
      startTime: stepStart,
      metadata,
      frictionPoints: []
    });

    console.log(`📊 Starting step: ${stepName}`, metadata);
  }

  // End workflow step
  endStep(stepName) {
    if (!this.isTracking || !this.stepTiming.has(stepName)) return;

    const stepData = this.stepTiming.get(stepName);
    const endTime = Date.now();
    const duration = endTime - stepData.startTime;

    const completedStep = {
      step: stepName,
      startTime: stepData.startTime,
      endTime,
      duration,
      metadata: stepData.metadata,
      frictionPoints: stepData.frictionPoints
    };

    this.sessionData.workflowSteps.push(completedStep);
    this.currentStep = null;

    console.log(`✅ Completed step: ${stepName} in ${duration}ms (${(duration/1000).toFixed(1)}s)`);
    
    return completedStep;
  }

  // Track friction points (user getting stuck)
  recordFrictionPoint(description, severity = 'medium', metadata = {}) {
    if (!this.isTracking) return;

    const frictionPoint = {
      timestamp: Date.now(),
      step: this.currentStep,
      description,
      severity, // 'low', 'medium', 'high', 'critical'
      metadata
    };

    this.sessionData.frictionPoints.push(frictionPoint);
    
    if (this.currentStep && this.stepTiming.has(this.currentStep)) {
      this.stepTiming.get(this.currentStep).frictionPoints.push(frictionPoint);
    }

    console.warn(`⚠️ Friction point (${severity}): ${description}`, metadata);
  }

  // Track first value recognition moment
  recordValueRecognition(timeToValue, description) {
    if (!this.isTracking) return;

    this.sessionData.valueRecognitionTime = timeToValue;
    
    const success = timeToValue <= 30000; // 30 seconds target
    console.log(`💡 Value recognition in ${(timeToValue/1000).toFixed(1)}s`, {
      target: '30 seconds',
      achieved: success ? '✅' : '❌',
      description
    });

    return success;
  }

  // Track export attempts and success
  recordExportAttempt(tool, format, success, metadata = {}) {
    if (!this.isTracking) return;

    const exportData = {
      timestamp: Date.now(),
      tool,
      format,
      success,
      metadata
    };

    if (!this.sessionData.exports) {
      this.sessionData.exports = [];
    }
    
    this.sessionData.exports.push(exportData);
    
    // Update success rate
    const successfulExports = this.sessionData.exports.filter(e => e.success).length;
    this.sessionData.exportSuccessRate = (successfulExports / this.sessionData.exports.length) * 100;

    console.log(`📤 Export ${success ? 'successful' : 'failed'}: ${tool} -> ${format}`, {
      successRate: `${this.sessionData.exportSuccessRate.toFixed(1)}%`,
      target: '98%'
    });
  }

  // Check for gaming terminology (reduces professional credibility)
  scanForGamingTerminology(text, context = '') {
    const gamingTerms = [
      'level up', 'level-up', 'levelup',
      'points', 'score', 'gaming',
      'badge', 'achievement', 'unlock',
      'quest', 'mission', 'challenge',
      'leaderboard', 'ranking', 'xp',
      'power-up', 'powerup', 'reward'
    ];

    const foundTerms = gamingTerms.filter(term => 
      text.toLowerCase().includes(term.toLowerCase())
    );

    if (foundTerms.length > 0) {
      this.sessionData.professionalCredibilityScore -= foundTerms.length * 10;
      
      console.error(`🚨 Gaming terminology detected in ${context}:`, foundTerms, {
        credibilityScore: this.sessionData.professionalCredibilityScore,
        target: '100% (zero gaming terms)'
      });
      
      this.recordFrictionPoint(
        `Gaming terminology detected: ${foundTerms.join(', ')}`,
        'critical',
        { context, terms: foundTerms }
      );
    }

    return foundTerms;
  }

  // Complete workflow tracking
  completeWorkflow() {
    if (!this.isTracking) return;

    // End current step if exists
    if (this.currentStep) {
      this.endStep(this.currentStep);
    }

    this.sessionData.endTime = Date.now();
    this.sessionData.totalWorkflowTime = this.sessionData.endTime - this.sessionData.startTime;
    this.isTracking = false;

    const workflowReport = this.generateWorkflowReport();
    console.log('🎯 Sarah Chen Workflow Complete:', workflowReport);
    
    return workflowReport;
  }

  // Generate comprehensive workflow report
  generateWorkflowReport() {
    const totalTime = this.sessionData.totalWorkflowTime || (Date.now() - this.sessionData.startTime);
    const targetTime = 15 * 60 * 1000; // 15 minutes in ms

    const report = {
      sessionId: this.sessionData.sessionId,
      customerId: this.sessionData.customerId,
      
      // Time Performance
      totalWorkflowTime: totalTime,
      totalWorkflowTimeMinutes: (totalTime / 60000).toFixed(1),
      targetAchieved: totalTime <= targetTime,
      timeOverTarget: Math.max(0, totalTime - targetTime),
      
      // Value Recognition
      valueRecognitionTime: this.sessionData.valueRecognitionTime,
      valueRecognitionSuccess: this.sessionData.valueRecognitionTime <= 30000,
      
      // Step Performance
      stepCount: this.sessionData.workflowSteps.length,
      steps: this.sessionData.workflowSteps.map(step => ({
        name: step.step,
        duration: step.duration,
        durationSeconds: (step.duration / 1000).toFixed(1),
        frictionPoints: step.frictionPoints.length
      })),
      
      // Friction Analysis
      totalFrictionPoints: this.sessionData.frictionPoints.length,
      criticalFrictionPoints: this.sessionData.frictionPoints.filter(f => f.severity === 'critical').length,
      frictionByStep: this.getFrictionByStep(),
      
      // Export Performance
      exportSuccessRate: this.sessionData.exportSuccessRate,
      exportTarget: 98,
      exportTargetMet: this.sessionData.exportSuccessRate >= 98,
      
      // Professional Credibility
      professionalCredibilityScore: this.sessionData.professionalCredibilityScore,
      credibilityTarget: 100,
      credibilityMaintained: this.sessionData.professionalCredibilityScore >= 100,
      
      // Overall Success
      overallSuccess: this.calculateOverallSuccess(),
      
      // Recommendations
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  // Get friction points grouped by step
  getFrictionByStep() {
    const frictionByStep = {};
    
    this.sessionData.frictionPoints.forEach(friction => {
      const step = friction.step || 'unknown';
      if (!frictionByStep[step]) {
        frictionByStep[step] = [];
      }
      frictionByStep[step].push(friction);
    });

    return frictionByStep;
  }

  // Calculate overall workflow success
  calculateOverallSuccess() {
    const timeSuccess = this.sessionData.totalWorkflowTime <= (15 * 60 * 1000);
    const valueSuccess = this.sessionData.valueRecognitionTime <= 30000;
    const exportSuccess = this.sessionData.exportSuccessRate >= 98;
    const credibilitySuccess = this.sessionData.professionalCredibilityScore >= 100;
    const frictionSuccess = this.sessionData.frictionPoints.filter(f => f.severity === 'critical').length === 0;

    const successCount = [timeSuccess, valueSuccess, exportSuccess, credibilitySuccess, frictionSuccess]
      .filter(Boolean).length;

    return {
      score: (successCount / 5) * 100,
      criteria: {
        timeTarget: timeSuccess,
        valueRecognition: valueSuccess,
        exportRate: exportSuccess,
        professionalCredibility: credibilitySuccess,
        minimalFriction: frictionSuccess
      }
    };
  }

  // Generate optimization recommendations
  generateRecommendations() {
    const recommendations = [];
    
    // Time-based recommendations
    if (this.sessionData.totalWorkflowTime > 15 * 60 * 1000) {
      recommendations.push({
        priority: 'high',
        area: 'workflow-timing',
        issue: 'Workflow exceeds 15-minute target',
        recommendation: 'Focus on streamlining slowest steps and reducing friction points'
      });
    }

    // Value recognition recommendations
    if (this.sessionData.valueRecognitionTime > 30000) {
      recommendations.push({
        priority: 'high',
        area: 'value-recognition',
        issue: 'Value recognition takes too long',
        recommendation: 'Improve initial wow factor and immediate value delivery'
      });
    }

    // Export performance recommendations
    if (this.sessionData.exportSuccessRate < 98) {
      recommendations.push({
        priority: 'critical',
        area: 'export-integration',
        issue: 'Export success rate below target',
        recommendation: 'Fix CRM/sales tool integration reliability'
      });
    }

    // Professional credibility recommendations
    if (this.sessionData.professionalCredibilityScore < 100) {
      recommendations.push({
        priority: 'critical',
        area: 'professional-credibility',
        issue: 'Gaming terminology detected',
        recommendation: 'Eliminate all gaming language and maintain business-appropriate terminology'
      });
    }

    // Friction-based recommendations
    const criticalFriction = this.sessionData.frictionPoints.filter(f => f.severity === 'critical');
    if (criticalFriction.length > 0) {
      recommendations.push({
        priority: 'high',
        area: 'user-experience',
        issue: `${criticalFriction.length} critical friction points detected`,
        recommendation: 'Address critical UX issues blocking smooth workflow completion'
      });
    }

    return recommendations;
  }

  // Get current session data
  getSessionData() {
    return { ...this.sessionData };
  }

  // Reset analytics for new session
  reset() {
    this.sessionData = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      customerId: null,
      workflowSteps: [],
      frictionPoints: [],
      valueRecognitionTime: null,
      totalWorkflowTime: null,
      exportSuccessRate: 0,
      professionalCredibilityScore: 100
    };
    
    this.stepTiming.clear();
    this.currentStep = null;
    this.isTracking = false;
  }
}

// Create singleton instance
const valueOptimizationAnalytics = new ValueOptimizationAnalytics();

export default valueOptimizationAnalytics;

// Export for testing and debugging
export { ValueOptimizationAnalytics };