/**
 * Optimization Agent - H&S Airtable Management Sub-Agent
 * 
 * Specializes in database optimization and performance enhancement
 * Focuses on analyzing opportunities and implementing optimizations
 */

class OptimizationAgent {
  constructor(optimizationEngine, auditEngine = null) {
    this.agentType = 'optimization-agent';
    this.optimizationEngine = optimizationEngine;
    this.auditEngine = auditEngine;
    this.isActive = false;
    this.performance = {
      optimizationsCompleted: 0,
      averageExecutionTime: 0,
      lastOptimizationTimestamp: null,
      performanceGainsAchieved: 0,
      optimizationSuccessRate: 100
    };
  }

  /**
   * Execute optimization operation based on operation type and event data
   */
  async execute(operation, event) {
    console.log(`⚡ OptimizationAgent executing: ${operation}`);
    this.isActive = true;
    const startTime = Date.now();

    try {
      if (!this.optimizationEngine) {
        throw new Error('OptimizationEngine not available');
      }

      console.log('⚡ Running optimization analysis...');
      
      // First get audit results if audit engine available
      let auditResults;
      if (this.auditEngine) {
        console.log('🔍 Getting audit results for optimization context...');
        auditResults = await this.auditEngine.performComprehensiveAudit();
      } else {
        console.log('⚠️ No audit engine available, proceeding with optimization without audit context');
      }

      // Run optimization analysis
      const result = await this.optimizationEngine.analyzeOptimizationOpportunities(auditResults);

      // Enhance result with agent metadata
      const enhancedResult = {
        ...result,
        agentType: this.agentType,
        executionContext: {
          operation,
          hasAuditContext: !!auditResults,
          eventTriggered: !!event
        }
      };

      // Update performance metrics
      const executionTime = Date.now() - startTime;
      this.updatePerformanceMetrics(executionTime, enhancedResult);

      console.log(`✅ OptimizationAgent completed: ${operation} (${executionTime}ms)`);
      return enhancedResult;

    } catch (error) {
      console.error(`❌ OptimizationAgent failed: ${operation}`, error);
      this.updateFailureMetrics();
      throw error;
    } finally {
      this.isActive = false;
    }
  }

  /**
   * Update agent performance metrics
   */
  updatePerformanceMetrics(executionTime, result) {
    this.performance.optimizationsCompleted++;
    this.performance.lastOptimizationTimestamp = Date.now();
    
    // Calculate average execution time
    if (this.performance.averageExecutionTime === 0) {
      this.performance.averageExecutionTime = executionTime;
    } else {
      this.performance.averageExecutionTime = 
        (this.performance.averageExecutionTime + executionTime) / 2;
    }

    // Track performance gains if optimization results contain them
    if (result && result.potentialImprovements) {
      const improvements = result.potentialImprovements;
      if (improvements.performanceGain) {
        this.performance.performanceGainsAchieved += improvements.performanceGain;
      }
    }
  }

  /**
   * Update failure metrics when optimization fails
   */
  updateFailureMetrics() {
    const totalAttempts = this.performance.optimizationsCompleted + 1;
    this.performance.optimizationSuccessRate = 
      (this.performance.optimizationsCompleted / totalAttempts) * 100;
  }

  /**
   * Get agent status and performance information
   */
  getStatus() {
    return {
      agentType: this.agentType,
      isActive: this.isActive,
      performance: this.performance,
      hasOptimizationEngine: !!this.optimizationEngine,
      hasAuditEngine: !!this.auditEngine,
      lastActivity: this.performance.lastOptimizationTimestamp,
      avgExecutionTime: Math.round(this.performance.averageExecutionTime),
      successRate: Math.round(this.performance.optimizationSuccessRate)
    };
  }

  /**
   * Check if agent is ready to execute
   */
  isReady() {
    return !!this.optimizationEngine && !this.isActive;
  }

  /**
   * Get engine status information
   */
  getEngineStatus() {
    return {
      optimizationEngine: {
        available: !!this.optimizationEngine,
        type: this.optimizationEngine?.constructor.name,
        ready: !!this.optimizationEngine && 
               typeof this.optimizationEngine.analyzeOptimizationOpportunities === 'function'
      },
      auditEngine: {
        available: !!this.auditEngine,
        type: this.auditEngine?.constructor.name,
        ready: !!this.auditEngine && 
               typeof this.auditEngine.performComprehensiveAudit === 'function'
      }
    };
  }

  /**
   * Set audit engine for optimization context
   */
  setAuditEngine(auditEngine) {
    this.auditEngine = auditEngine;
    console.log('🔗 OptimizationAgent: AuditEngine connection established');
  }
}

export default OptimizationAgent;
export { OptimizationAgent };