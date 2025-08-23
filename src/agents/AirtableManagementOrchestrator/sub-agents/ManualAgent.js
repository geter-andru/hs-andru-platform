/**
 * Manual Agent - H&S Airtable Management Sub-Agent
 * 
 * Specializes in manual operations and ad-hoc tasks
 * Focuses on user-triggered operations and flexible task routing
 */

class ManualAgent {
  constructor(engines = {}) {
    this.agentType = 'manual-agent';
    this.auditEngine = engines.auditEngine;
    this.optimizationEngine = engines.optimizationEngine;
    this.backupEngine = engines.backupEngine;
    this.fieldConsolidationEngine = engines.fieldConsolidationEngine;
    this.isActive = false;
    this.performance = {
      manualOperationsCompleted: 0,
      averageExecutionTime: 0,
      lastOperationTimestamp: null,
      operationTypes: new Map(),
      successfulOperations: 0,
      failedOperations: 0
    };
  }

  /**
   * Execute manual operation based on operation type and event data
   */
  async execute(operation, event) {
    console.log(`🔧 ManualAgent executing: ${operation}`);
    this.isActive = true;
    const startTime = Date.now();

    try {
      console.log(`🔧 Running manual operation: ${operation}`);
      
      let result;

      // Route to appropriate engine based on operation
      if (operation.includes('audit') && this.auditEngine) {
        console.log('🔍 Manual audit operation...');
        result = await this.auditEngine.performComprehensiveAudit();
        
      } else if (operation.includes('optimize') && this.optimizationEngine && this.auditEngine) {
        console.log('⚡ Manual optimization operation...');
        const auditResults = await this.auditEngine.performComprehensiveAudit();
        result = await this.optimizationEngine.analyzeOptimizationOpportunities(auditResults);
        
      } else if (operation.includes('backup') && this.backupEngine) {
        console.log('💾 Manual backup operation...');
        result = await this.backupEngine.createComprehensiveBackup({
          reason: `Manual backup: ${operation}`,
          tables: event.data?.tables || []
        });
        
      } else if ((operation.includes('consolidate') || operation.includes('field')) && this.fieldConsolidationEngine) {
        console.log('🔗 Manual field consolidation operation...');
        result = await this.fieldConsolidationEngine.analyzeFieldConsolidation();
        
      } else {
        console.log('📝 Generic manual operation...');
        result = { 
          operation, 
          result: 'Manual operation executed',
          data: event.data,
          timestamp: Date.now(),
          agentType: this.agentType
        };
      }

      // Enhance result with manual operation metadata
      const enhancedResult = {
        ...result,
        manualOperation: true,
        operationType: operation,
        requestedBy: event.data?.requestedBy || 'system',
        executionMode: 'manual'
      };

      // Update performance metrics
      const executionTime = Date.now() - startTime;
      this.updatePerformanceMetrics(executionTime, operation, true);

      console.log(`✅ ManualAgent completed: ${operation} (${executionTime}ms)`);
      return enhancedResult;

    } catch (error) {
      console.error(`❌ ManualAgent failed: ${operation}`, error);
      this.updatePerformanceMetrics(Date.now() - startTime, operation, false);
      throw error;
    } finally {
      this.isActive = false;
    }
  }

  /**
   * Update agent performance metrics
   */
  updatePerformanceMetrics(executionTime, operation, success) {
    this.performance.manualOperationsCompleted++;
    this.performance.lastOperationTimestamp = Date.now();
    
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

    // Track operation types
    const operationType = this.categorizeOperation(operation);
    const currentCount = this.performance.operationTypes.get(operationType) || 0;
    this.performance.operationTypes.set(operationType, currentCount + 1);
  }

  /**
   * Categorize operation for metrics tracking
   */
  categorizeOperation(operation) {
    if (operation.includes('audit')) return 'audit';
    if (operation.includes('optimize')) return 'optimization';
    if (operation.includes('backup')) return 'backup';
    if (operation.includes('consolidate') || operation.includes('field')) return 'consolidation';
    return 'generic';
  }

  /**
   * Get agent status and performance information
   */
  getStatus() {
    const successRate = this.performance.manualOperationsCompleted > 0 
      ? (this.performance.successfulOperations / this.performance.manualOperationsCompleted) * 100 
      : 100;

    return {
      agentType: this.agentType,
      isActive: this.isActive,
      performance: {
        ...this.performance,
        operationTypes: Object.fromEntries(this.performance.operationTypes),
        successRate: Math.round(successRate)
      },
      engines: {
        audit: !!this.auditEngine,
        optimization: !!this.optimizationEngine,
        backup: !!this.backupEngine,
        fieldConsolidation: !!this.fieldConsolidationEngine
      },
      lastActivity: this.performance.lastOperationTimestamp,
      avgExecutionTime: Math.round(this.performance.averageExecutionTime)
    };
  }

  /**
   * Check if agent is ready to execute
   */
  isReady() {
    return !this.isActive;
  }

  /**
   * Get available operations based on engine availability
   */
  getAvailableOperations() {
    const operations = [];
    
    if (this.auditEngine) {
      operations.push('audit', 'performance_audit', 'data_integrity_audit');
    }
    
    if (this.optimizationEngine) {
      operations.push('optimize', 'analyze_optimizations');
    }
    
    if (this.backupEngine) {
      operations.push('backup', 'emergency_backup', 'scheduled_backup');
    }
    
    if (this.fieldConsolidationEngine) {
      operations.push('consolidate_fields', 'field_analysis');
    }
    
    operations.push('generic_manual_operation');
    
    return operations;
  }

  /**
   * Set engine references
   */
  setEngines(engines) {
    if (engines.auditEngine) this.auditEngine = engines.auditEngine;
    if (engines.optimizationEngine) this.optimizationEngine = engines.optimizationEngine;
    if (engines.backupEngine) this.backupEngine = engines.backupEngine;
    if (engines.fieldConsolidationEngine) this.fieldConsolidationEngine = engines.fieldConsolidationEngine;
    
    console.log('🔗 ManualAgent: Engine connections updated');
  }
}

export default ManualAgent;
export { ManualAgent };