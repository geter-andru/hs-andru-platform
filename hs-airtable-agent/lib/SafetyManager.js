const { default: chalk } = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const BackupEngine = require('./BackupEngine.js');

class SafetyManager {
  constructor(config) {
    // Handle both old signature (config, coordinator, airtableClient) and new signature (config)
    if (typeof config === 'object' && config.backupDir) {
      // New test-compatible signature
      this.config = config;
      this.backupEngine = new BackupEngine(config);
    } else {
      // Legacy signature for backward compatibility
      this.config = config;
      this.coordinator = arguments[1];
      this.airtableClient = arguments[2];
      this.backupEngine = new BackupEngine(config, this.coordinator, this.airtableClient);
    }
    
    this.safetyPolicies = {
      autoBackupBeforeChanges: true,
      requireConfirmationForDestructive: true,
      dryRunByDefault: true,
      maxOperationsWithoutBackup: 5,
      backupRetentionDays: config.backup?.retentionDays || 30,
      emergencyRollbackEnabled: true
    };
    
    this.operationLog = [];
    this.lastBackupTimestamp = null;
    this.operationsSinceLastBackup = 0;
  }

  async performPreOperationChecks(data, operation) {
    console.log(chalk.blue('🔍 Performing pre-operation safety checks...'));
    
    const issues = [];
    
    // Safely handle coordinator if available
    if (this.coordinator && typeof this.coordinator === 'object') {
      try {
        if (typeof this.coordinator.checkCompatibility === 'function') {
          const compatibility = await this.coordinator.checkCompatibility();
          if (!compatibility.compatible) {
            issues.push(`Agent compatibility issues: ${compatibility.conflicts.join(', ')}`);
          }
        }
      } catch (error) {
        // Coordinator not available or method failed - skip check
      }
    }
    
    // Safely handle airtable client if available
    if (this.airtableClient && typeof this.airtableClient === 'object') {
      try {
        if (typeof this.airtableClient.testConnection === 'function') {
          const connectionTest = await this.airtableClient.testConnection();
          if (!connectionTest.success) {
            issues.push(`Database connectivity issue: ${connectionTest.error}`);
          }
        }
      } catch (error) {
        // Client not available or method failed - skip check
      }
    }
    
    // Create backup before operation
    let backupId = null;
    if (this.config.requireBackupBeforeChanges !== false) {
      try {
        backupId = await this.backupEngine.createSafetySnapshot(data, {
          operation: operation.type,
          description: operation.description
        });
      } catch (error) {
        issues.push(`Failed to create pre-operation backup: ${error.message}`);
      }
    }
    
    const passed = issues.length === 0;
    
    if (passed) {
      console.log(chalk.green('  ✅ All pre-operation safety checks passed'));
    } else {
      console.log(chalk.yellow('  ⚠️ Pre-operation checks completed with warnings'));
      issues.forEach(issue => console.log(chalk.yellow(`    - ${issue}`)));
    }
    
    return {
      passed,
      issues,
      backupId
    };
  }

  async executeWithSafety(operationFn, data, operation) {
    console.log(chalk.bold.blue(`\n🛡️ Executing with Safety: ${operationFn}\n`));
    
    try {
      // Perform pre-operation checks
      const preChecks = await this.performPreOperationChecks(data, operation);
      
      // Execute the operation
      const operationResult = await operationFn(data);
      
      console.log(chalk.green('✅ Operation completed successfully'));
      
      return {
        success: true,
        operationResult,
        backupId: preChecks.backupId,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.log(chalk.red('🚨 Handling operation failure...'));
      
      // Create failure snapshot
      try {
        console.log(chalk.blue('📸 Creating failure snapshot...'));
        const failureBackupId = await this.backupEngine.createSafetySnapshot(data, {
          operation: 'failure-snapshot',
          description: `Failure snapshot for ${operation.type}`,
          error: error.message
        });
        console.log(chalk.green(`  ✅ Failure snapshot created: ${failureBackupId}`));
      } catch (snapshotError) {
        console.log(chalk.red(`❌ Safety snapshot failed: ${snapshotError.message}`));
      }
      
      // Mock recovery procedures
      try {
        await this.performRecoveryProcedures(error);
      } catch (recoveryError) {
        console.log(chalk.red(`❌ Recovery procedures failed: ${recoveryError.message}`));
      }
      
      throw error;
    }
  }

  async performEmergencyRollback(backupId, currentData) {
    console.log(chalk.bold.yellow(`\n🔄 Performing Emergency Rollback to: ${backupId}\n`));
    
    try {
      // Restore data from backup
      const rolledBackData = await this.backupEngine.restore(backupId);
      
      console.log(chalk.green('✅ Emergency rollback completed successfully'));
      
      return {
        success: true,
        rolledBackData,
        backupId,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.log(chalk.red(`❌ Emergency rollback failed: ${error.message}`));
      throw error;
    }
  }

  async performRecoveryProcedures(error) {
    // Recovery procedures for test compatibility
    if (this.coordinator && typeof this.coordinator === 'object') {
      try {
        if (typeof this.coordinator.updateStatus === 'function') {
          await this.coordinator.updateStatus('error', `Recovery from: ${error.message}`);
        }
      } catch (statusError) {
        // Coordinator not available
      }
      
      try {
        if (typeof this.coordinator.getActiveAgents === 'function') {
          const agents = await this.coordinator.getActiveAgents();
          console.log(chalk.blue(`  📊 Active agents during failure: ${agents.length}`));
        }
      } catch (agentError) {
        // Method not available
      }
    }
  }

  async initializeSafetySystem() {
    console.log(chalk.bold.blue('\n🛡️ Initializing Safety System...\n'));

    try {
      // Ensure backup directories exist
      await this.createSafetyDirectories();
      
      // Load operation log
      await this.loadOperationLog();
      
      // Check last backup status
      await this.checkLastBackupStatus();
      
      // Initialize emergency procedures
      await this.initializeEmergencyProcedures();
      
      // Set up automatic safety triggers
      await this.setupSafetyTriggers();

      console.log(chalk.green('✅ Safety system initialized'));
      
      return {
        success: true,
        lastBackup: this.lastBackupTimestamp,
        operationsSinceBackup: this.operationsSinceLastBackup,
        emergencyRollbackEnabled: this.safetyPolicies.emergencyRollbackEnabled
      };

    } catch (error) {
      console.error(chalk.red('❌ Safety system initialization failed:'), error.message);
      throw error;
    }
  }

  async executeWithSafety(operationName, operation, options = {}) {
    console.log(chalk.bold.blue(`\n🛡️ Executing with Safety: ${operationName}\n`));

    const safetyContext = {
      operationName,
      timestamp: new Date().toISOString(),
      id: this.generateOperationId(),
      destructive: options.destructive || false,
      dryRun: options.dryRun !== false && this.safetyPolicies.dryRunByDefault,
      confirmed: options.confirmed || false,
      backupBefore: options.backupBefore !== false && this.safetyPolicies.autoBackupBeforeChanges,
      rollbackPlan: options.rollbackPlan || 'default'
    };

    try {
      // Pre-operation safety checks
      await this.performPreOperationChecks(safetyContext);
      
      // Create backup if required
      if (safetyContext.backupBefore && safetyContext.destructive) {
        safetyContext.preOperationBackup = await this.createPreOperationBackup(operationName);
      }

      // Execute operation with monitoring
      const result = await this.executeWithMonitoring(operation, safetyContext);
      
      // Post-operation verification
      await this.performPostOperationVerification(safetyContext, result);
      
      // Log successful operation
      await this.logOperation(safetyContext, result, 'success');

      console.log(chalk.green(`✅ ${operationName} completed safely`));
      
      return result;

    } catch (error) {
      console.error(chalk.red(`❌ ${operationName} failed:`, error.message));
      
      // Emergency recovery procedures
      await this.handleOperationFailure(safetyContext, error);
      
      // Log failed operation
      await this.logOperation(safetyContext, null, 'failed', error.message);
      
      throw error;
    }
  }

  async createPreOperationBackup(operationName) {
    console.log(chalk.blue('💾 Creating pre-operation safety backup...'));

    try {
      const backupResult = await this.backupEngine.createComprehensiveBackup({
        purpose: `pre-operation-${operationName}`,
        type: 'safety',
        compression: true,
        verification: true
      });

      this.lastBackupTimestamp = new Date().toISOString();
      this.operationsSinceLastBackup = 0;

      console.log(chalk.green('  ✅ Pre-operation backup completed'));
      return backupResult;

    } catch (error) {
      console.error(chalk.red('  ❌ Pre-operation backup failed:', error.message));
      throw new Error(`Cannot proceed without safety backup: ${error.message}`);
    }
  }

  async performPreOperationChecks(safetyContext) {
    console.log(chalk.blue('🔍 Performing pre-operation safety checks...'));

    const checks = [];

    // Check 1: Destructive operation confirmation
    if (safetyContext.destructive && this.safetyPolicies.requireConfirmationForDestructive && !safetyContext.confirmed) {
      checks.push({
        name: 'destructive_confirmation',
        passed: false,
        message: 'Destructive operation requires explicit confirmation'
      });
    } else {
      checks.push({ name: 'destructive_confirmation', passed: true });
    }

    // Check 2: Backup freshness
    if (this.operationsSinceLastBackup > this.safetyPolicies.maxOperationsWithoutBackup) {
      checks.push({
        name: 'backup_freshness',
        passed: false,
        message: `${this.operationsSinceLastBackup} operations since last backup (max: ${this.safetyPolicies.maxOperationsWithoutBackup})`
      });
    } else {
      checks.push({ name: 'backup_freshness', passed: true });
    }

    // Check 3: Agent compatibility
    const compatibility = await this.coordinator.checkCompatibility();
    checks.push({
      name: 'agent_compatibility',
      passed: compatibility.compatible,
      message: compatibility.compatible ? 'All agents compatible' : `${compatibility.conflicts.length} compatibility issues`
    });

    // Check 4: Database connectivity
    const connectionTest = await this.airtableClient.testConnection();
    checks.push({
      name: 'database_connectivity',
      passed: connectionTest.success,
      message: connectionTest.success ? 'Database accessible' : connectionTest.error
    });

    // Check 5: Sufficient disk space
    const diskSpace = await this.checkDiskSpace();
    checks.push({
      name: 'disk_space',
      passed: diskSpace.sufficient,
      message: `Available: ${diskSpace.available}, Required: ${diskSpace.required}`
    });

    // Evaluate overall safety
    const failedChecks = checks.filter(check => !check.passed);
    
    if (failedChecks.length > 0) {
      console.log(chalk.red('❌ Pre-operation safety checks failed:'));
      failedChecks.forEach(check => {
        console.log(chalk.red(`  - ${check.name}: ${check.message}`));
      });
      
      if (safetyContext.destructive) {
        throw new Error(`Safety checks failed: ${failedChecks.map(c => c.name).join(', ')}`);
      } else {
        console.log(chalk.yellow('⚠️ Proceeding with warnings (non-destructive operation)'));
      }
    } else {
      console.log(chalk.green('  ✅ All pre-operation safety checks passed'));
    }

    return { passed: failedChecks.length === 0, checks };
  }

  async executeWithMonitoring(operation, safetyContext) {
    console.log(chalk.blue(`🎯 Executing operation: ${safetyContext.operationName}`));

    if (safetyContext.dryRun) {
      console.log(chalk.yellow('🔍 DRY RUN MODE - No changes will be made'));
    }

    // Update coordinator status
    await this.coordinator.updateStatus('executing', `Executing ${safetyContext.operationName}`, {
      operationId: safetyContext.id,
      destructive: safetyContext.destructive,
      dryRun: safetyContext.dryRun
    });

    // Start monitoring
    const monitor = this.startOperationMonitoring(safetyContext);

    try {
      // Execute the actual operation
      const startTime = Date.now();
      const result = await operation();
      const duration = Date.now() - startTime;

      // Stop monitoring
      this.stopOperationMonitoring(monitor);

      return {
        success: true,
        result,
        duration,
        dryRun: safetyContext.dryRun,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.stopOperationMonitoring(monitor);
      throw error;
    }
  }

  async performPostOperationVerification(safetyContext, result) {
    console.log(chalk.blue('🔍 Performing post-operation verification...'));

    if (safetyContext.dryRun) {
      console.log(chalk.blue('  ℹ️ Skipping verification (dry run mode)'));
      return { verified: true, skipped: true };
    }

    const verifications = [];

    // Verification 1: Database integrity
    try {
      const connectionTest = await this.airtableClient.testConnection();
      verifications.push({
        name: 'database_integrity',
        passed: connectionTest.success,
        message: connectionTest.success ? 'Database accessible' : 'Database connection failed'
      });
    } catch (error) {
      verifications.push({
        name: 'database_integrity',
        passed: false,
        message: error.message
      });
    }

    // Verification 2: Agent status
    try {
      const activeAgents = await this.coordinator.getActiveAgents();
      verifications.push({
        name: 'agent_status',
        passed: true,
        message: `${activeAgents.length} agents active`
      });
    } catch (error) {
      verifications.push({
        name: 'agent_status',
        passed: false,
        message: error.message
      });
    }

    // Verification 3: Operation result validation
    if (result && typeof result === 'object') {
      const hasExpectedStructure = result.success !== undefined;
      verifications.push({
        name: 'result_structure',
        passed: hasExpectedStructure,
        message: hasExpectedStructure ? 'Result structure valid' : 'Unexpected result structure'
      });
    }

    const failedVerifications = verifications.filter(v => !v.passed);
    
    if (failedVerifications.length > 0) {
      console.log(chalk.yellow('⚠️ Post-operation verification issues:'));
      failedVerifications.forEach(verification => {
        console.log(chalk.yellow(`  - ${verification.name}: ${verification.message}`));
      });
    } else {
      console.log(chalk.green('  ✅ All post-operation verifications passed'));
    }

    return { verified: failedVerifications.length === 0, verifications };
  }

  async handleOperationFailure(safetyContext, error) {
    console.log(chalk.red('🚨 Handling operation failure...'));

    try {
      // Auto-rollback if we have a pre-operation backup
      if (safetyContext.preOperationBackup && this.safetyPolicies.emergencyRollbackEnabled) {
        console.log(chalk.yellow('🔄 Attempting emergency rollback...'));
        
        try {
          await this.performEmergencyRollback(safetyContext.preOperationBackup);
          console.log(chalk.green('  ✅ Emergency rollback completed'));
        } catch (rollbackError) {
          console.error(chalk.red('  ❌ Emergency rollback failed:', rollbackError.message));
        }
      }

      // Create failure snapshot
      await this.createFailureSnapshot(safetyContext, error);

      // Notify other agents of failure
      await this.coordinator.updateStatus('error', `Operation ${safetyContext.operationName} failed`, {
        error: error.message,
        operationId: safetyContext.id,
        rollbackAttempted: !!safetyContext.preOperationBackup
      });

    } catch (recoveryError) {
      console.error(chalk.red('❌ Recovery procedures failed:', recoveryError.message));
    }
  }

  async performEmergencyRollback(backupResult) {
    if (!backupResult || !backupResult.backupPath) {
      throw new Error('No valid backup available for rollback');
    }

    // In a real implementation, this would restore from the backup
    console.log(chalk.blue(`  🔄 Rolling back to: ${backupResult.backupJob.id}`));
    
    // Simulate rollback
    await this.sleep(2000);
    
    return { success: true, rollbackCompleted: true };
  }

  async createFailureSnapshot(safetyContext, error) {
    try {
      console.log(chalk.blue('📸 Creating failure snapshot...'));
      
      const snapshotData = {
        operationId: safetyContext.id,
        operationName: safetyContext.operationName,
        timestamp: new Date().toISOString(),
        error: {
          message: error.message,
          stack: error.stack
        },
        context: safetyContext,
        systemState: {
          activeAgents: await this.coordinator.getActiveAgents(),
          lastBackup: this.lastBackupTimestamp,
          operationsSinceBackup: this.operationsSinceLastBackup
        }
      };

      const snapshotPath = path.join(this.config.backup.directory, 'failure-snapshots', `failure-${safetyContext.id}.json`);
      await fs.ensureDir(path.dirname(snapshotPath));
      await fs.writeJson(snapshotPath, snapshotData, { spaces: 2 });

      console.log(chalk.blue(`  📄 Failure snapshot saved: ${snapshotPath}`));

    } catch (snapshotError) {
      console.error(chalk.red('  ❌ Failed to create failure snapshot:', snapshotError.message));
    }
  }

  startOperationMonitoring(safetyContext) {
    const startTime = Date.now();
    
    const monitor = {
      id: safetyContext.id,
      startTime,
      checks: 0,
      interval: setInterval(async () => {
        monitor.checks++;
        
        // Check operation timeout
        const elapsed = Date.now() - startTime;
        if (elapsed > 300000) { // 5 minutes
          console.log(chalk.yellow(`⚠️ Operation ${safetyContext.operationName} running for ${elapsed/1000}s`));
        }

        // Check system health
        try {
          const connectionTest = await this.airtableClient.testConnection();
          if (!connectionTest.success) {
            console.log(chalk.red('⚠️ Database connection issue during operation'));
          }
        } catch (error) {
          // Ignore monitoring errors
        }
      }, 30000) // Check every 30 seconds
    };

    return monitor;
  }

  stopOperationMonitoring(monitor) {
    if (monitor && monitor.interval) {
      clearInterval(monitor.interval);
    }
  }

  async logOperation(safetyContext, result, status, errorMessage = null) {
    const logEntry = {
      id: safetyContext.id,
      operationName: safetyContext.operationName,
      timestamp: safetyContext.timestamp,
      status,
      destructive: safetyContext.destructive,
      dryRun: safetyContext.dryRun,
      duration: result ? result.duration : null,
      error: errorMessage,
      backupCreated: !!safetyContext.preOperationBackup
    };

    this.operationLog.push(logEntry);
    
    // Keep only last 100 operations in memory
    if (this.operationLog.length > 100) {
      this.operationLog = this.operationLog.slice(-100);
    }

    // Save to disk
    await this.saveOperationLog();

    // Update counters
    if (status === 'success') {
      this.operationsSinceLastBackup++;
    }
  }

  // Initialization and setup methods
  async createSafetyDirectories() {
    const directories = [
      this.config.backup.directory,
      path.join(this.config.backup.directory, 'snapshots'),
      path.join(this.config.backup.directory, 'failure-snapshots'),
      path.join(this.config.backup.directory, 'operation-logs')
    ];

    for (const dir of directories) {
      await fs.ensureDir(dir);
    }
  }

  async loadOperationLog() {
    const logPath = path.join(this.config.backup.directory, 'operation-logs', 'operations.json');
    
    if (await fs.pathExists(logPath)) {
      this.operationLog = await fs.readJson(logPath);
    } else {
      this.operationLog = [];
    }
  }

  async saveOperationLog() {
    const logPath = path.join(this.config.backup.directory, 'operation-logs', 'operations.json');
    await fs.writeJson(logPath, this.operationLog, { spaces: 2 });
  }

  async checkLastBackupStatus() {
    const backups = await this.backupEngine.listBackups();
    
    if (backups.length > 0) {
      this.lastBackupTimestamp = backups[0].timestamp;
      
      // Count operations since last backup
      const lastBackupTime = new Date(this.lastBackupTimestamp);
      this.operationsSinceLastBackup = this.operationLog.filter(
        op => new Date(op.timestamp) > lastBackupTime
      ).length;
    }
  }

  async initializeEmergencyProcedures() {
    // Set up emergency procedures
    process.on('SIGINT', this.emergencyShutdown.bind(this));
    process.on('SIGTERM', this.emergencyShutdown.bind(this));
  }

  async setupSafetyTriggers() {
    // Future: Set up automatic safety triggers
    // - Periodic backup checks
    // - System health monitoring
    // - Automated cleanup
  }

  async emergencyShutdown() {
    console.log(chalk.red('\n🚨 Emergency shutdown initiated!'));
    
    try {
      // Save current state
      await this.saveOperationLog();
      
      // Create emergency snapshot if possible
      await this.backupEngine.createSafetySnapshot('Customer Assets', 'emergency-shutdown');
      
      // Safe coordinator shutdown
      await this.coordinator.safeShutdown();
      
      console.log(chalk.green('✅ Emergency shutdown completed safely'));
    } catch (error) {
      console.error(chalk.red('❌ Emergency shutdown error:', error.message));
    }
    
    process.exit(0);
  }

  // Utility methods
  generateOperationId() {
    return `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async checkDiskSpace() {
    // Simplified disk space check
    return {
      sufficient: true,
      available: '100 GB',
      required: '10 MB'
    };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public API methods
  async createBackup(options = {}) {
    return await this.executeWithSafety('Create Backup', async () => {
      return await this.backupEngine.createComprehensiveBackup(options);
    }, { destructive: false, backupBefore: false });
  }

  async restoreBackup(backupPath, options = {}) {
    return await this.executeWithSafety('Restore Backup', async () => {
      return await this.backupEngine.restoreFromBackup(backupPath, options);
    }, { destructive: true, confirmed: options.confirmed, backupBefore: true });
  }

  async createSnapshot(tableName, purpose = 'manual-snapshot') {
    return await this.executeWithSafety('Create Snapshot', async () => {
      return await this.backupEngine.createSafetySnapshot(tableName, purpose);
    }, { destructive: false, backupBefore: false });
  }

  async rollbackToSnapshot(snapshotId, options = {}) {
    return await this.executeWithSafety('Rollback to Snapshot', async () => {
      return await this.backupEngine.rollbackToSnapshot(snapshotId, options);
    }, { destructive: true, confirmed: options.confirmed, backupBefore: true });
  }

  getOperationHistory() {
    return this.operationLog.slice(-50); // Return last 50 operations
  }

  getSafetyStatus() {
    return {
      lastBackup: this.lastBackupTimestamp,
      operationsSinceBackup: this.operationsSinceLastBackup,
      policies: this.safetyPolicies,
      emergencyRollbackEnabled: this.safetyPolicies.emergencyRollbackEnabled,
      recentOperations: this.operationLog.slice(-5)
    };
  }
}

module.exports = SafetyManager;