/**
 * Maintenance Agent - H&S Airtable Management Sub-Agent
 * 
 * Specializes in comprehensive system maintenance operations
 * Focuses on scheduled maintenance, health checks, and system upkeep
 */

class MaintenanceAgent {
  constructor(engines = {}) {
    this.agentType = 'maintenance-agent';
    this.auditEngine = engines.auditEngine;
    this.optimizationEngine = engines.optimizationEngine;
    this.backupEngine = engines.backupEngine;
    this.fieldConsolidationEngine = engines.fieldConsolidationEngine;
    this.isActive = false;
    this.performance = {
      maintenanceSessionsCompleted: 0,
      averageExecutionTime: 0,
      lastMaintenanceTimestamp: null,
      operationsExecuted: 0,
      successfulOperations: 0,
      failedOperations: 0
    };
  }

  /**
   * Execute maintenance operation based on operation type and event data
   */
  async execute(operation, event) {
    console.log(`🔧 MaintenanceAgent executing: ${operation}`);
    this.isActive = true;
    const startTime = Date.now();

    try {
      const operations = event.data?.operations || ['audit'];
      const results = {};
      
      console.log(`🔧 Running maintenance operations: ${operations.join(', ')}`);
      
      for (const op of operations) {
        try {
          this.performance.operationsExecuted++;
          
          switch (op) {
            case 'audit':
              if (this.auditEngine) {
                console.log('🔍 Running audit maintenance...');
                results.audit = await this.auditEngine.performComprehensiveAudit();
                this.performance.successfulOperations++;
              } else {
                results.audit = { error: 'AuditEngine not available' };
                this.performance.failedOperations++;
              }
              break;
              
            case 'optimize':
              if (this.optimizationEngine && this.auditEngine) {
                console.log('⚡ Running optimization maintenance...');
                const auditResults = await this.auditEngine.performComprehensiveAudit();
                results.optimize = await this.optimizationEngine.analyzeOptimizationOpportunities(auditResults);
                this.performance.successfulOperations++;
              } else {
                results.optimize = { error: 'OptimizationEngine or AuditEngine not available' };
                this.performance.failedOperations++;
              }
              break;
              
            case 'health_check':
              console.log('💓 Running health check maintenance...');
              results.health_check = await this.performHealthCheck();
              this.performance.successfulOperations++;
              break;
              
            case 'backup':
              if (this.backupEngine) {
                console.log('💾 Running backup maintenance...');
                results.backup = await this.backupEngine.createComprehensiveBackup({
                  reason: 'Scheduled maintenance backup'
                });
                this.performance.successfulOperations++;
              } else {
                results.backup = { error: 'BackupEngine not available' };
                this.performance.failedOperations++;
              }
              break;
              
            case 'consolidate_fields':
              if (this.fieldConsolidationEngine) {
                console.log('🔗 Running field consolidation maintenance...');
                results.consolidate_fields = await this.fieldConsolidationEngine.analyzeFieldConsolidation();
                this.performance.successfulOperations++;
              } else {
                results.consolidate_fields = { error: 'FieldConsolidationEngine not available' };
                this.performance.failedOperations++;
              }
              break;
              
            default:
              console.warn(`Unknown maintenance operation: ${op}`);
              results[op] = { error: `Unknown operation: ${op}` };
              this.performance.failedOperations++;
          }
        } catch (error) {
          console.error(`Error in ${op}:`, error);
          results[op] = { error: error.message };
          this.performance.failedOperations++;
        }
      }

      // Update performance metrics
      const executionTime = Date.now() - startTime;
      this.updatePerformanceMetrics(executionTime, results);

      console.log(`✅ MaintenanceAgent completed: ${operations.length} operations (${executionTime}ms)`);
      return results;

    } catch (error) {
      console.error(`❌ MaintenanceAgent failed: ${operation}`, error);
      throw error;
    } finally {
      this.isActive = false;
    }
  }

  /**
   * Perform system health check
   */
  async performHealthCheck() {
    const healthStatus = {
      timestamp: Date.now(),
      engines: {},
      systemStatus: 'healthy',
      issues: []
    };

    // Check audit engine
    if (this.auditEngine) {
      healthStatus.engines.audit = {
        available: true,
        type: this.auditEngine.constructor.name
      };
    } else {
      healthStatus.engines.audit = { available: false };
      healthStatus.issues.push('AuditEngine not available');
    }

    // Check optimization engine
    if (this.optimizationEngine) {
      healthStatus.engines.optimization = {
        available: true,
        type: this.optimizationEngine.constructor.name
      };
    } else {
      healthStatus.engines.optimization = { available: false };
      healthStatus.issues.push('OptimizationEngine not available');
    }

    // Check backup engine
    if (this.backupEngine) {
      healthStatus.engines.backup = {
        available: true,
        type: this.backupEngine.constructor.name
      };
    } else {
      healthStatus.engines.backup = { available: false };
      healthStatus.issues.push('BackupEngine not available');
    }

    // Check field consolidation engine
    if (this.fieldConsolidationEngine) {
      healthStatus.engines.fieldConsolidation = {
        available: true,
        type: this.fieldConsolidationEngine.constructor.name
      };
    } else {
      healthStatus.engines.fieldConsolidation = { available: false };
      healthStatus.issues.push('FieldConsolidationEngine not available');
    }

    // Determine overall system status
    if (healthStatus.issues.length > 2) {
      healthStatus.systemStatus = 'degraded';
    } else if (healthStatus.issues.length > 0) {
      healthStatus.systemStatus = 'partial';
    }

    return healthStatus;
  }

  /**
   * Update agent performance metrics
   */
  updatePerformanceMetrics(executionTime, results) {
    this.performance.maintenanceSessionsCompleted++;
    this.performance.lastMaintenanceTimestamp = Date.now();
    
    // Calculate average execution time
    if (this.performance.averageExecutionTime === 0) {
      this.performance.averageExecutionTime = executionTime;
    } else {
      this.performance.averageExecutionTime = 
        (this.performance.averageExecutionTime + executionTime) / 2;
    }
  }

  /**
   * Get agent status and performance information
   */
  getStatus() {
    const successRate = this.performance.operationsExecuted > 0 
      ? (this.performance.successfulOperations / this.performance.operationsExecuted) * 100 
      : 100;

    return {
      agentType: this.agentType,
      isActive: this.isActive,
      performance: {
        ...this.performance,
        successRate: Math.round(successRate)
      },
      engines: {
        audit: !!this.auditEngine,
        optimization: !!this.optimizationEngine,
        backup: !!this.backupEngine,
        fieldConsolidation: !!this.fieldConsolidationEngine
      },
      lastActivity: this.performance.lastMaintenanceTimestamp,
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
   * Set engine references
   */
  setEngines(engines) {
    if (engines.auditEngine) this.auditEngine = engines.auditEngine;
    if (engines.optimizationEngine) this.optimizationEngine = engines.optimizationEngine;
    if (engines.backupEngine) this.backupEngine = engines.backupEngine;
    if (engines.fieldConsolidationEngine) this.fieldConsolidationEngine = engines.fieldConsolidationEngine;
    
    console.log('🔗 MaintenanceAgent: Engine connections updated');
  }
}

export default MaintenanceAgent;
export { MaintenanceAgent };