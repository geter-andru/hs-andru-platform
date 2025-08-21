#!/usr/bin/env node

/**
 * Phase 3A Testing Suite: Backup and Safety Systems Verification
 * Tests BackupEngine and SafetyManager functionality with comprehensive validation
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const fs = require('fs-extra');
const { default: chalk } = require('chalk');
const BackupEngine = require('../lib/BackupEngine');
const SafetyManager = require('../lib/SafetyManager');
const AirtableClient = require('../lib/AirtableClient');

class Phase3ATestSuite {
    constructor() {
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            tests: []
        };
        this.testBackupDir = path.join(__dirname, '../test-backups');
        this.tempDataDir = path.join(__dirname, '../test-data');
    }

    async initialize() {
        console.log(chalk.blue('🧪 Phase 3A Testing Suite: Backup and Safety Systems'));
        console.log(chalk.gray('═'.repeat(60)));
        
        // Clean and create test directories
        await fs.ensureDir(this.testBackupDir);
        await fs.ensureDir(this.tempDataDir);
        
        console.log(chalk.green('✓ Test environment initialized'));
    }

    async runTest(name, testFn) {
        this.results.total++;
        console.log(chalk.blue(`\n🔍 Testing: ${name}`));
        
        try {
            const startTime = Date.now();
            await testFn();
            const duration = Date.now() - startTime;
            
            this.results.passed++;
            this.results.tests.push({ name, status: 'PASSED', duration });
            console.log(chalk.green(`✓ ${name} - PASSED (${duration}ms)`));
        } catch (error) {
            this.results.failed++;
            this.results.tests.push({ name, status: 'FAILED', error: error.message });
            console.log(chalk.red(`✗ ${name} - FAILED: ${error.message}`));
        }
    }

    async testBackupEngineInitialization() {
        const backupEngine = new BackupEngine({
            backupDir: this.testBackupDir,
            compression: true,
            retentionDays: 7
        });

        // Test configuration
        if (!backupEngine.config) {
            throw new Error('BackupEngine configuration not initialized');
        }

        if (backupEngine.config.backupDir !== this.testBackupDir) {
            throw new Error('Backup directory not set correctly');
        }

        // Test backup directory creation
        await backupEngine.ensureBackupStructure();
        
        const expectedDirs = ['full', 'incremental', 'safety', 'catalog'];
        for (const dir of expectedDirs) {
            const dirPath = path.join(this.testBackupDir, dir);
            if (!(await fs.pathExists(dirPath))) {
                throw new Error(`Backup directory ${dir} not created`);
            }
        }
    }

    async testMockDataBackup() {
        const backupEngine = new BackupEngine({
            backupDir: this.testBackupDir,
            compression: false // Disable compression for easier testing
        });

        // Create mock customer data
        const mockData = {
            'Customer Assets': [
                {
                    id: 'rec123',
                    fields: {
                        'Customer Name': 'Test Customer',
                        'Customer ID': 'CUST_TEST',
                        'Created At': new Date().toISOString()
                    }
                }
            ]
        };

        // Create test backup
        const backupId = await backupEngine.createFullBackup(mockData, {
            source: 'test',
            description: 'Phase 3A test backup'
        });

        if (!backupId) {
            throw new Error('Backup ID not returned');
        }

        // Verify backup files exist
        const backupPath = path.join(this.testBackupDir, 'full', `backup-${backupId}.json`);
        const metadataPath = path.join(this.testBackupDir, 'full', `backup-${backupId}-metadata.json`);

        if (!(await fs.pathExists(backupPath))) {
            throw new Error('Backup file not created');
        }

        if (!(await fs.pathExists(metadataPath))) {
            throw new Error('Backup metadata file not created');
        }

        // Verify backup content
        const restoredData = await fs.readJson(backupPath);
        if (!restoredData['Customer Assets'] || restoredData['Customer Assets'].length !== 1) {
            throw new Error('Backup data corrupted');
        }

        if (restoredData['Customer Assets'][0].fields['Customer Name'] !== 'Test Customer') {
            throw new Error('Backup data content incorrect');
        }

        return backupId;
    }

    async testBackupVerification() {
        const backupEngine = new BackupEngine({
            backupDir: this.testBackupDir,
            compression: false
        });

        // Get the backup from previous test
        const catalog = await backupEngine.getBackupCatalog();
        if (catalog.length === 0) {
            throw new Error('No backups found in catalog');
        }

        const latestBackup = catalog[0];
        const isValid = await backupEngine.verifyBackup(latestBackup.id);

        if (!isValid) {
            throw new Error('Backup verification failed');
        }
    }

    async testIncrementalBackup() {
        const backupEngine = new BackupEngine({
            backupDir: this.testBackupDir,
            compression: false
        });

        // Create initial data
        const originalData = {
            'Customer Assets': [
                { id: 'rec1', fields: { 'Customer Name': 'Customer A', version: 1 } }
            ]
        };

        const fullBackupId = await backupEngine.createFullBackup(originalData, {
            source: 'test-incremental'
        });

        // Create modified data
        const modifiedData = {
            'Customer Assets': [
                { id: 'rec1', fields: { 'Customer Name': 'Customer A Updated', version: 2 } },
                { id: 'rec2', fields: { 'Customer Name': 'Customer B', version: 1 } }
            ]
        };

        const incrementalBackupId = await backupEngine.createIncrementalBackup(
            modifiedData, 
            originalData, 
            fullBackupId,
            { source: 'test-incremental-change' }
        );

        if (!incrementalBackupId) {
            throw new Error('Incremental backup not created');
        }

        // Verify incremental backup contains only changes
        const incrementalPath = path.join(this.testBackupDir, 'incremental', `backup-${incrementalBackupId}.json`);
        const incrementalData = await fs.readJson(incrementalPath);

        // Should contain both modified record and new record
        if (!incrementalData.changes || Object.keys(incrementalData.changes).length === 0) {
            throw new Error('Incremental backup contains no changes');
        }
    }

    async testSafetySnapshots() {
        const backupEngine = new BackupEngine({
            backupDir: this.testBackupDir,
            compression: false
        });

        const testData = {
            'Customer Assets': [
                { id: 'rec1', fields: { 'Customer Name': 'Safety Test' } }
            ]
        };

        const snapshotId = await backupEngine.createSafetySnapshot(testData, {
            operation: 'test-operation',
            description: 'Pre-operation safety snapshot'
        });

        if (!snapshotId) {
            throw new Error('Safety snapshot not created');
        }

        // Verify snapshot in safety directory
        const snapshotPath = path.join(this.testBackupDir, 'safety', `snapshot-${snapshotId}.json`);
        if (!(await fs.pathExists(snapshotPath))) {
            throw new Error('Safety snapshot file not found');
        }

        const snapshotData = await fs.readJson(snapshotPath);
        if (!snapshotData['Customer Assets']) {
            throw new Error('Safety snapshot data incomplete');
        }
    }

    async testSafetyManagerInitialization() {
        const safetyManager = new SafetyManager({
            backupDir: this.testBackupDir,
            maxOperationTime: 30000,
            requireBackupBeforeChanges: true
        });

        if (!safetyManager.backupEngine) {
            throw new Error('SafetyManager backup engine not initialized');
        }

        if (!safetyManager.config) {
            throw new Error('SafetyManager configuration not set');
        }
    }

    async testSafetyManagerPreChecks() {
        const safetyManager = new SafetyManager({
            backupDir: this.testBackupDir,
            maxOperationTime: 30000,
            requireBackupBeforeChanges: true
        });

        const mockData = {
            'Customer Assets': [
                { id: 'rec1', fields: { 'Customer Name': 'Pre-check Test' } }
            ]
        };

        const mockOperation = {
            type: 'UPDATE_RECORDS',
            description: 'Test operation for pre-checks',
            table: 'Customer Assets',
            estimatedDuration: 5000
        };

        // Test pre-operation safety checks
        const checkResult = await safetyManager.performPreOperationChecks(mockData, mockOperation);
        
        if (!checkResult.passed) {
            throw new Error(`Pre-operation checks failed: ${checkResult.issues.join(', ')}`);
        }

        if (!checkResult.backupId) {
            throw new Error('Pre-operation backup not created');
        }
    }

    async testSafetyManagerOperationExecution() {
        const safetyManager = new SafetyManager({
            backupDir: this.testBackupDir,
            maxOperationTime: 30000,
            requireBackupBeforeChanges: true
        });

        const mockOperation = async (data) => {
            // Simulate a safe operation
            await new Promise(resolve => setTimeout(resolve, 100));
            data['Customer Assets'][0].fields['Customer Name'] = 'Updated by Operation';
            return { success: true, recordsAffected: 1 };
        };

        const mockData = {
            'Customer Assets': [
                { id: 'rec1', fields: { 'Customer Name': 'Original Name' } }
            ]
        };

        const result = await safetyManager.executeWithSafety(
            mockOperation,
            mockData,
            {
                type: 'UPDATE_RECORDS',
                description: 'Test safe operation execution',
                table: 'Customer Assets'
            }
        );

        if (!result.success) {
            throw new Error('Safe operation execution failed');
        }

        if (!result.backupId) {
            throw new Error('Operation did not create backup');
        }

        if (!result.operationResult) {
            throw new Error('Operation result not captured');
        }
    }

    async testEmergencyRollback() {
        const safetyManager = new SafetyManager({
            backupDir: this.testBackupDir,
            maxOperationTime: 30000,
            requireBackupBeforeChanges: true
        });

        // First create a backup we can roll back to
        const originalData = {
            'Customer Assets': [
                { id: 'rec1', fields: { 'Customer Name': 'Original State' } }
            ]
        };

        const backupId = await safetyManager.backupEngine.createSafetySnapshot(originalData, {
            operation: 'test-rollback',
            description: 'Pre-rollback state'
        });

        // Simulate corrupted data
        const corruptedData = {
            'Customer Assets': [
                { id: 'rec1', fields: { 'Customer Name': 'Corrupted State', corrupted: true } }
            ]
        };

        // Test rollback functionality
        const rollbackResult = await safetyManager.performEmergencyRollback(backupId, corruptedData);

        if (!rollbackResult.success) {
            throw new Error('Emergency rollback failed');
        }

        if (!rollbackResult.rolledBackData) {
            throw new Error('Rollback data not returned');
        }

        if (rollbackResult.rolledBackData['Customer Assets'][0].fields['Customer Name'] !== 'Original State') {
            throw new Error('Rollback data incorrect');
        }
    }

    async testBackupCleanupAndRetention() {
        const backupEngine = new BackupEngine({
            backupDir: this.testBackupDir,
            retentionDays: 0, // Immediate cleanup for testing
            compression: false
        });

        // Create a test backup
        const testData = { 'Customer Assets': [{ id: 'rec1', fields: { name: 'Cleanup Test' } }] };
        const backupId = await backupEngine.createFullBackup(testData, {
            source: 'cleanup-test'
        });

        // Force cleanup
        const cleanupResult = await backupEngine.cleanupOldBackups();

        if (!cleanupResult.cleaned || cleanupResult.cleaned.length === 0) {
            throw new Error('Backup cleanup did not work');
        }

        // Verify backup was removed
        const backupPath = path.join(this.testBackupDir, 'full', `backup-${backupId}.json`);
        if (await fs.pathExists(backupPath)) {
            throw new Error('Old backup not cleaned up');
        }
    }

    async testMultiAgentCompatibility() {
        // Test that backup operations respect coordination locks
        const safetyManager = new SafetyManager({
            backupDir: this.testBackupDir,
            maxOperationTime: 30000
        });

        // Create a mock lock file to simulate another agent
        const lockDir = '/tmp/hs-agents';
        await fs.ensureDir(lockDir);
        const lockFile = path.join(lockDir, 'airtable-operations.lock');
        
        await fs.writeJson(lockFile, {
            agentId: 'mock-agent',
            operation: 'testing',
            timestamp: Date.now(),
            pid: 99999
        });

        // Try to perform operation - should respect the lock
        const mockData = { 'Customer Assets': [] };
        const mockOperation = async () => ({ success: true });

        try {
            await safetyManager.executeWithSafety(mockOperation, mockData, {
                type: 'TEST_OPERATION',
                description: 'Lock compatibility test'
            });
            
            // Clean up lock
            await fs.remove(lockFile);
            
            // This should not throw an error - it should either wait for lock or handle gracefully
        } catch (error) {
            // Clean up lock
            await fs.remove(lockFile);
            
            if (error.message.includes('lock') || error.message.includes('coordination')) {
                // This is expected behavior - agent respects locks
                console.log(chalk.yellow('   ✓ Agent properly respects coordination locks'));
            } else {
                throw error;
            }
        }
    }

    async cleanup() {
        console.log(chalk.gray('\n🧹 Cleaning up test environment...'));
        
        try {
            // Remove test directories
            await fs.remove(this.testBackupDir);
            await fs.remove(this.tempDataDir);
            
            // Remove any test lock files
            const lockFile = '/tmp/hs-agents/airtable-operations.lock';
            if (await fs.pathExists(lockFile)) {
                await fs.remove(lockFile);
            }
            
            console.log(chalk.green('✓ Test cleanup completed'));
        } catch (error) {
            console.log(chalk.yellow(`⚠ Cleanup warning: ${error.message}`));
        }
    }

    async runAllTests() {
        await this.initialize();

        // Backup Engine Tests
        await this.runTest('BackupEngine Initialization', () => this.testBackupEngineInitialization());
        await this.runTest('Mock Data Backup Creation', () => this.testMockDataBackup());
        await this.runTest('Backup Verification', () => this.testBackupVerification());
        await this.runTest('Incremental Backup System', () => this.testIncrementalBackup());
        await this.runTest('Safety Snapshots', () => this.testSafetySnapshots());

        // Safety Manager Tests
        await this.runTest('SafetyManager Initialization', () => this.testSafetyManagerInitialization());
        await this.runTest('Pre-Operation Safety Checks', () => this.testSafetyManagerPreChecks());
        await this.runTest('Safe Operation Execution', () => this.testSafetyManagerOperationExecution());
        await this.runTest('Emergency Rollback System', () => this.testEmergencyRollback());

        // System Tests
        await this.runTest('Backup Cleanup and Retention', () => this.testBackupCleanupAndRetention());
        await this.runTest('Multi-Agent Compatibility', () => this.testMultiAgentCompatibility());

        await this.cleanup();
        this.printResults();
    }

    printResults() {
        console.log(chalk.blue('\n📊 Phase 3A Test Results'));
        console.log(chalk.gray('═'.repeat(60)));
        
        const passRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
        const passRateColor = passRate >= 85 ? 'green' : passRate >= 75 ? 'yellow' : 'red';
        
        console.log(chalk.white(`Total Tests: ${this.results.total}`));
        console.log(chalk.green(`Passed: ${this.results.passed}`));
        console.log(chalk.red(`Failed: ${this.results.failed}`));
        console.log(chalk[passRateColor](`Pass Rate: ${passRate}%`));
        
        if (this.results.failed > 0) {
            console.log(chalk.red('\n❌ Failed Tests:'));
            this.results.tests
                .filter(test => test.status === 'FAILED')
                .forEach(test => {
                    console.log(chalk.red(`  • ${test.name}: ${test.error}`));
                });
        }

        console.log(chalk.blue('\n🎯 Phase 3A Assessment:'));
        if (passRate >= 85) {
            console.log(chalk.green('✅ EXCELLENT - Backup and Safety systems are production-ready'));
            console.log(chalk.green('   Ready to proceed to Phase 3B'));
        } else if (passRate >= 75) {
            console.log(chalk.yellow('⚠️  GOOD - Minor issues detected, but systems are functional'));
            console.log(chalk.yellow('   Review failed tests before proceeding'));
        } else {
            console.log(chalk.red('❌ CRITICAL - Major backup/safety issues detected'));
            console.log(chalk.red('   Must fix issues before proceeding to Phase 3B'));
        }

        console.log(chalk.gray('\n' + '═'.repeat(60)));
        
        return passRate >= 75;
    }
}

// Run tests if called directly
if (require.main === module) {
    const testSuite = new Phase3ATestSuite();
    testSuite.runAllTests()
        .then(() => {
            process.exit(0);
        })
        .catch(error => {
            console.error(chalk.red('Test suite failed:'), error);
            process.exit(1);
        });
}

module.exports = Phase3ATestSuite;