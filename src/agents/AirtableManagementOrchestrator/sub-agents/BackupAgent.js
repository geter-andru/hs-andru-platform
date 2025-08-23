/**
 * Backup Agent - H&S Airtable Management Sub-Agent
 * 
 * Specializes in comprehensive backup operations and data protection
 * Focuses on full, incremental, and safety backup operations
 */

class BackupAgent {
  constructor(backupEngine) {
    this.agentType = 'backup-agent';
    this.backupEngine = backupEngine;
    this.isActive = false;
    this.performance = {
      backupsCompleted: 0,
      averageExecutionTime: 0,
      lastBackupTimestamp: null,
      backupTypes: new Map(),
      successfulBackups: 0,
      failedBackups: 0,
      totalDataProtected: 0
    };
  }

  /**
   * Execute backup operation based on operation type and event data
   */
  async execute(operation, event) {
    console.log(`💾 BackupAgent executing: ${operation}`);
    this.isActive = true;
    const startTime = Date.now();

    try {
      if (!this.backupEngine) {
        throw new Error('BackupEngine not available');
      }

      let result;
      
      switch (operation) {
        case 'full_backup':
          console.log('💾 Creating full backup...');
          result = await this.backupEngine.createFullBackup({
            message: 'Agent-triggered full backup',
            tables: event.data?.tables || []
          });
          break;
          
        case 'incremental_backup':
          console.log('💾 Creating incremental backup...');
          result = await this.backupEngine.createIncrementalBackup(
            Date.now() - (24 * 60 * 60 * 1000) // 24 hours ago
          );
          break;
          
        case 'safety_backup':
        case 'comprehensive_backup':
          console.log('💾 Creating comprehensive backup...');
          result = await this.backupEngine.createComprehensiveBackup({
            reason: event.data?.reason || 'Agent-triggered safety backup',
            tables: event.data?.tables || []
          });
          break;
          
        default:
          console.log('💾 Creating comprehensive backup...');
          result = await this.backupEngine.createComprehensiveBackup({
            reason: 'Agent-triggered backup'
          });
          break;
      }

      // Enhance result with agent metadata
      const enhancedResult = {
        ...result,
        agentType: this.agentType,
        operationType: operation,
        executionContext: {
          requestedBy: event.data?.requestedBy || 'system',
          tables: event.data?.tables,
          reason: event.data?.reason
        }
      };

      // Update performance metrics
      const executionTime = Date.now() - startTime;
      this.updatePerformanceMetrics(executionTime, operation, enhancedResult, true);

      console.log(`✅ BackupAgent completed: ${operation} (${executionTime}ms)`);
      return enhancedResult;

    } catch (error) {
      console.error(`❌ BackupAgent failed: ${operation}`, error);
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
    this.performance.backupsCompleted++;
    this.performance.lastBackupTimestamp = Date.now();
    
    // Track success/failure
    if (success) {
      this.performance.successfulBackups++;
    } else {
      this.performance.failedBackups++;
    }
    
    // Calculate average execution time
    if (this.performance.averageExecutionTime === 0) {
      this.performance.averageExecutionTime = executionTime;
    } else {
      this.performance.averageExecutionTime = 
        (this.performance.averageExecutionTime + executionTime) / 2;
    }

    // Track backup types
    const backupType = this.categorizeBackup(operation);
    const currentCount = this.performance.backupTypes.get(backupType) || 0;
    this.performance.backupTypes.set(backupType, currentCount + 1);

    // Track data protection metrics if available
    if (result && result.tablesBackedUp) {
      this.performance.totalDataProtected += result.tablesBackedUp.length;
    }
  }

  /**
   * Categorize backup for metrics tracking
   */
  categorizeBackup(operation) {
    if (operation.includes('full')) return 'full';
    if (operation.includes('incremental')) return 'incremental';
    if (operation.includes('safety')) return 'safety';
    if (operation.includes('comprehensive')) return 'comprehensive';
    return 'standard';
  }

  /**
   * Get agent status and performance information
   */
  getStatus() {
    const successRate = this.performance.backupsCompleted > 0 
      ? (this.performance.successfulBackups / this.performance.backupsCompleted) * 100 
      : 100;

    return {
      agentType: this.agentType,
      isActive: this.isActive,
      performance: {
        ...this.performance,
        backupTypes: Object.fromEntries(this.performance.backupTypes),
        successRate: Math.round(successRate)
      },
      hasBackupEngine: !!this.backupEngine,
      lastActivity: this.performance.lastBackupTimestamp,
      avgExecutionTime: Math.round(this.performance.averageExecutionTime)
    };
  }

  /**
   * Check if agent is ready to execute
   */
  isReady() {
    return !!this.backupEngine && !this.isActive;
  }

  /**
   * Get backup engine status
   */
  getBackupEngineStatus() {
    if (!this.backupEngine) {
      return { available: false, reason: 'BackupEngine not initialized' };
    }

    return {
      available: true,
      type: this.backupEngine.constructor.name,
      ready: typeof this.backupEngine.createComprehensiveBackup === 'function'
    };
  }

  /**
   * Get available backup operations
   */
  getAvailableOperations() {
    if (!this.backupEngine) {
      return [];
    }

    return [
      'full_backup',
      'incremental_backup', 
      'safety_backup',
      'comprehensive_backup'
    ];
  }
}

export default BackupAgent;
export { BackupAgent };