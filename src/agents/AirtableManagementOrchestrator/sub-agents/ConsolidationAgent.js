/**
 * Consolidation Agent - H&S Airtable Management Sub-Agent
 * 
 * Specializes in field consolidation and data optimization operations
 * Focuses on analyzing and safely consolidating field structures
 */

class ConsolidationAgent {
  constructor(engines = {}) {
    this.agentType = 'consolidation-agent';
    this.fieldConsolidationEngine = engines.fieldConsolidationEngine;
    this.safeFieldConsolidator = engines.safeFieldConsolidator;
    this.isActive = false;
    this.performance = {
      consolidationsCompleted: 0,
      averageExecutionTime: 0,
      lastConsolidationTimestamp: null,
      analysisOperations: 0,
      consolidationOperations: 0,
      fieldsAnalyzed: 0,
      fieldsConsolidated: 0,
      successfulOperations: 0,
      failedOperations: 0
    };
  }

  /**
   * Execute consolidation operation based on operation type and event data
   */
  async execute(operation, event) {
    console.log(`🔗 ConsolidationAgent executing: ${operation}`);
    this.isActive = true;
    const startTime = Date.now();

    try {
      if (!this.fieldConsolidationEngine) {
        throw new Error('FieldConsolidationEngine not available');
      }

      let result;
      
      switch (operation) {
        case 'analyze_fields':
          console.log('🔍 Analyzing field consolidation opportunities...');
          result = await this.fieldConsolidationEngine.analyzeFieldConsolidation();
          this.performance.analysisOperations++;
          break;
          
        case 'consolidate_fields':
          if (!this.safeFieldConsolidator) {
            throw new Error('SafeFieldConsolidator not available');
          }
          console.log('🔧 Performing safe field consolidation...');
          result = await this.safeFieldConsolidator.performConsolidation({
            dryRun: event.data?.dryRun !== false, // Default to dry run
            maxOperations: event.data?.maxOperations || 10,
            backupFirst: event.data?.backupFirst !== false
          });
          this.performance.consolidationOperations++;
          break;
          
        case 'field_similarity_analysis':
          console.log('🔍 Analyzing field similarities...');
          result = await this.fieldConsolidationEngine.findSimilarFields();
          this.performance.analysisOperations++;
          break;
          
        default:
          console.log('🔍 Running field analysis...');
          result = await this.fieldConsolidationEngine.analyzeFieldConsolidation();
          this.performance.analysisOperations++;
          break;
      }

      // Enhance result with agent metadata
      const enhancedResult = {
        ...result,
        agentType: this.agentType,
        operationType: operation,
        executionContext: {
          requestedBy: event.data?.requestedBy || 'system',
          dryRun: event.data?.dryRun,
          maxOperations: event.data?.maxOperations,
          backupFirst: event.data?.backupFirst
        }
      };

      // Update performance metrics
      const executionTime = Date.now() - startTime;
      this.updatePerformanceMetrics(executionTime, operation, enhancedResult, true);

      console.log(`✅ ConsolidationAgent completed: ${operation} (${executionTime}ms)`);
      return enhancedResult;

    } catch (error) {
      console.error(`❌ ConsolidationAgent failed: ${operation}`, error);
      this.updatePerformanceMetrics(Date.now() - startTime, operation, null, false);
      throw error;
    } finally {
      this.isActive = false;
    }
  }

  /**
   * Update agent performance metrics
   */
  updatePerformanceMetrics(executionTime, operation, result, success) {
    this.performance.consolidationsCompleted++;
    this.performance.lastConsolidationTimestamp = Date.now();
    
    // Track success/failure
    if (success) {
      this.performance.successfulOperations++;
    } else {
      this.performance.failedOperations++;
    }
    
    // Calculate average execution time
    if (this.performance.averageExecutionTime === 0) {
      this.performance.averageExecutionTime = executionTime;
    } else {
      this.performance.averageExecutionTime = 
        (this.performance.averageExecutionTime + executionTime) / 2;
    }

    // Track fields analyzed/consolidated if available
    if (result) {
      if (result.fieldsAnalyzed) {
        this.performance.fieldsAnalyzed += result.fieldsAnalyzed;
      }
      if (result.fieldsConsolidated) {
        this.performance.fieldsConsolidated += result.fieldsConsolidated;
      }
    }
  }

  /**
   * Get agent status and performance information
   */
  getStatus() {
    const successRate = this.performance.consolidationsCompleted > 0 
      ? (this.performance.successfulOperations / this.performance.consolidationsCompleted) * 100 
      : 100;

    return {
      agentType: this.agentType,
      isActive: this.isActive,
      performance: {
        ...this.performance,
        successRate: Math.round(successRate)
      },
      engines: {
        fieldConsolidation: !!this.fieldConsolidationEngine,
        safeConsolidator: !!this.safeFieldConsolidator
      },
      lastActivity: this.performance.lastConsolidationTimestamp,
      avgExecutionTime: Math.round(this.performance.averageExecutionTime)
    };
  }

  /**
   * Check if agent is ready to execute
   */
  isReady() {
    return !!this.fieldConsolidationEngine && !this.isActive;
  }

  /**
   * Get engine status information
   */
  getEngineStatus() {
    return {
      fieldConsolidationEngine: {
        available: !!this.fieldConsolidationEngine,
        type: this.fieldConsolidationEngine?.constructor.name,
        ready: !!this.fieldConsolidationEngine && 
               typeof this.fieldConsolidationEngine.analyzeFieldConsolidation === 'function'
      },
      safeFieldConsolidator: {
        available: !!this.safeFieldConsolidator,
        type: this.safeFieldConsolidator?.constructor.name,
        ready: !!this.safeFieldConsolidator && 
               typeof this.safeFieldConsolidator.performConsolidation === 'function'
      }
    };
  }

  /**
   * Get available consolidation operations
   */
  getAvailableOperations() {
    const operations = [];
    
    if (this.fieldConsolidationEngine) {
      operations.push('analyze_fields', 'field_similarity_analysis');
    }
    
    if (this.safeFieldConsolidator) {
      operations.push('consolidate_fields');
    }
    
    return operations;
  }

  /**
   * Set engine references
   */
  setEngines(engines) {
    if (engines.fieldConsolidationEngine) {
      this.fieldConsolidationEngine = engines.fieldConsolidationEngine;
    }
    if (engines.safeFieldConsolidator) {
      this.safeFieldConsolidator = engines.safeFieldConsolidator;
    }
    
    console.log('🔗 ConsolidationAgent: Engine connections updated');
  }
}

export default ConsolidationAgent;
export { ConsolidationAgent };