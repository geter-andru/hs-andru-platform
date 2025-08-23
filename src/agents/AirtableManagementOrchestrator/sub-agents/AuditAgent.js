/**
 * Audit Agent - H&S Airtable Management Sub-Agent
 * 
 * Specializes in comprehensive database audits and performance analysis
 * Focuses on data integrity checks and system health monitoring
 */

class AuditAgent {
  constructor(auditEngine) {
    this.agentType = 'audit-agent';
    this.auditEngine = auditEngine;
    this.isActive = false;
    this.performance = {
      auditsCompleted: 0,
      averageExecutionTime: 0,
      lastAuditTimestamp: null,
      criticalIssuesFound: 0,
      dataIntegrityScore: null
    };
  }

  /**
   * Execute audit operation based on operation type and event data
   */
  async execute(operation, event) {
    console.log(`🔍 AuditAgent executing: ${operation}`);
    this.isActive = true;
    const startTime = Date.now();

    try {
      if (!this.auditEngine) {
        throw new Error('AuditEngine not available');
      }

      let result;
      
      switch (operation) {
        case 'performance_audit':
          console.log('🔍 Running performance audit...');
          result = await this.auditEngine.performComprehensiveAudit();
          break;
          
        case 'data_integrity_audit':
          console.log('🔍 Running data integrity audit...');
          result = await this.auditEngine.performComprehensiveAudit();
          // Add specific data integrity analysis
          if (event && event.data && event.data.affectedTables) {
            result.affectedTables = event.data.affectedTables;
            result.integrityFocus = true;
          }
          break;
          
        default:
          console.log('🔍 Running general audit...');
          result = await this.auditEngine.performComprehensiveAudit();
          break;
      }

      // Update performance metrics
      const executionTime = Date.now() - startTime;
      this.updatePerformanceMetrics(executionTime, result);

      console.log(`✅ AuditAgent completed: ${operation} (${executionTime}ms)`);
      return result;

    } catch (error) {
      console.error(`❌ AuditAgent failed: ${operation}`, error);
      throw error;
    } finally {
      this.isActive = false;
    }
  }

  /**
   * Update agent performance metrics
   */
  updatePerformanceMetrics(executionTime, result) {
    this.performance.auditsCompleted++;
    this.performance.lastAuditTimestamp = Date.now();
    
    // Calculate average execution time
    if (this.performance.averageExecutionTime === 0) {
      this.performance.averageExecutionTime = executionTime;
    } else {
      this.performance.averageExecutionTime = 
        (this.performance.averageExecutionTime + executionTime) / 2;
    }

    // Track critical issues if audit results contain them
    if (result && result.criticalIssues) {
      this.performance.criticalIssuesFound += result.criticalIssues.length;
    }

    // Update data integrity score if available
    if (result && result.dataIntegrityScore !== undefined) {
      this.performance.dataIntegrityScore = result.dataIntegrityScore;
    }
  }

  /**
   * Get agent status and performance information
   */
  getStatus() {
    return {
      agentType: this.agentType,
      isActive: this.isActive,
      performance: this.performance,
      hasAuditEngine: !!this.auditEngine,
      lastActivity: this.performance.lastAuditTimestamp,
      avgExecutionTime: Math.round(this.performance.averageExecutionTime)
    };
  }

  /**
   * Check if agent is ready to execute
   */
  isReady() {
    return !!this.auditEngine && !this.isActive;
  }

  /**
   * Get audit engine status
   */
  getAuditEngineStatus() {
    if (!this.auditEngine) {
      return { available: false, reason: 'AuditEngine not initialized' };
    }

    return {
      available: true,
      type: this.auditEngine.constructor.name,
      ready: typeof this.auditEngine.performComprehensiveAudit === 'function'
    };
  }
}

export default AuditAgent;
export { AuditAgent };