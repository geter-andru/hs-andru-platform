#!/usr/bin/env node

/**
 * Phase 3B Testing Suite: Safe Field Consolidation Engine
 * Tests FieldConsolidationEngine and SafeFieldConsolidator functionality
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const fs = require('fs-extra');
const { default: chalk } = require('chalk');
const FieldConsolidationEngine = require('../lib/FieldConsolidationEngine');
const SafeFieldConsolidator = require('../lib/SafeFieldConsolidator');
const SafetyManager = require('../lib/SafetyManager');
const AirtableClient = require('../lib/AirtableClient');
const AgentCoordinator = require('../lib/AgentCoordinator');
const config = require('../config/agent.config');

class Phase3BTestSuite {
    constructor() {
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            tests: []
        };
        this.testBackupDir = path.join(__dirname, '../test-backups-3b');
        this.testOutputDir = path.join(__dirname, '../test-output-3b');
        
        // Mock components for testing
        this.mockCoordinator = this.createMockCoordinator();
        this.mockAirtableClient = this.createMockAirtableClient();
        this.mockSafetyManager = this.createMockSafetyManager();
    }

    async initialize() {
        console.log(chalk.blue('🧪 Phase 3B Testing Suite: Safe Field Consolidation Engine'));
        console.log(chalk.gray('═'.repeat(70)));
        
        // Clean and create test directories
        await fs.ensureDir(this.testBackupDir);
        await fs.ensureDir(this.testOutputDir);
        
        console.log(chalk.green('✓ Test environment initialized'));
    }

    createMockCoordinator() {
        return {
            updateStatus: async (status, message, options) => {
                console.log(chalk.gray(`    📊 Status: ${status} - ${message}`));
                return { success: true };
            },
            checkCompatibility: async () => ({
                compatible: true,
                conflicts: []
            }),
            acquireGlobalLock: async (lockName, timeout) => ({ success: true }),
            releaseGlobalLock: async () => ({ success: true })
        };
    }

    createMockAirtableClient() {
        return {
            safeQuery: async (tableName, operation, options) => {
                // Return mock data based on table name
                const mockData = this.generateMockTableData(tableName);
                return mockData.slice(0, options?.maxRecords || 10);
            },
            testConnection: async () => ({
                success: true,
                message: 'Mock connection successful'
            })
        };
    }

    createMockSafetyManager() {
        return {
            backupEngine: {
                createComprehensiveBackup: async (options) => ({
                    backupJob: {
                        id: `mock-backup-${Date.now()}`,
                        timestamp: new Date().toISOString()
                    },
                    success: true
                }),
                createSafetySnapshot: async (data, metadata) => {
                    return `mock-snapshot-${Date.now()}`;
                }
            },
            performEmergencyRollback: async (backupId, reason) => ({
                success: true,
                backupId,
                reason
            })
        };
    }

    generateMockTableData(tableName) {
        const baseData = [
            {
                id: 'rec1',
                fields: {
                    'Customer Name': 'Test Customer 1',
                    'Customer_Name': 'Test Customer 1', // Potential duplicate
                    'Status': 'Active',
                    'Email': 'test1@example.com',
                    'Created Date': '2024-01-01',
                    'Creation_Date': '2024-01-01' // Potential duplicate
                }
            },
            {
                id: 'rec2',
                fields: {
                    'Customer Name': 'Test Customer 2',
                    'Customer_Name': 'Test Customer 2',
                    'Status': 'Inactive',
                    'Email': 'test2@example.com',
                    'Created Date': '2024-01-02',
                    'Creation_Date': '2024-01-02'
                }
            }
        ];

        // Customize data based on table name
        if (tableName.includes('Assets')) {
            baseData.forEach(record => {
                record.fields['Asset Name'] = `Asset for ${record.fields['Customer Name']}`;
                record.fields['Asset_Name'] = record.fields['Asset Name']; // Another duplicate
            });
        }

        return baseData;
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

    async testFieldConsolidationEngineInitialization() {
        const engine = new FieldConsolidationEngine(
            config,
            this.mockCoordinator,
            this.mockAirtableClient
        );

        if (!engine.config) {
            throw new Error('Engine configuration not initialized');
        }

        if (!engine.consolidationRules) {
            throw new Error('Consolidation rules not defined');
        }

        if (!engine.analysisResults) {
            throw new Error('Analysis results structure not initialized');
        }

        // Verify default rules
        if (engine.consolidationRules.similarityThreshold !== 0.85) {
            throw new Error('Default similarity threshold not set correctly');
        }
    }

    async testTableSchemaAnalysis() {
        const engine = new FieldConsolidationEngine(
            config,
            this.mockCoordinator,
            this.mockAirtableClient
        );

        const schemas = await engine.analyzeAllTableSchemas();

        if (!schemas || typeof schemas !== 'object') {
            throw new Error('Schema analysis did not return object');
        }

        // Should have analyzed at least some tables
        const tableNames = Object.keys(schemas);
        if (tableNames.length === 0) {
            throw new Error('No table schemas analyzed');
        }

        // Check schema structure
        const firstTable = schemas[tableNames[0]];
        if (!firstTable.fields && !firstTable.error) {
            throw new Error('Schema missing required fields or error property');
        }

        // If we have fields, verify structure
        if (firstTable.fields) {
            const fieldNames = Object.keys(firstTable.fields);
            if (fieldNames.length === 0) {
                throw new Error('Table schema has no fields');
            }

            const firstField = firstTable.fields[fieldNames[0]];
            if (!firstField.name || !firstField.type) {
                throw new Error('Field definition missing required properties');
            }
        }
    }

    async testDuplicateFieldDetection() {
        const engine = new FieldConsolidationEngine(
            config,
            this.mockCoordinator,
            this.mockAirtableClient
        );

        // Create mock schemas with known duplicates
        const mockSchemas = {
            'Table1': {
                fields: {
                    'Customer Name': { name: 'Customer Name', type: 'text', hasData: true },
                    'Email': { name: 'Email', type: 'email', hasData: true }
                }
            },
            'Table2': {
                fields: {
                    'Customer Name': { name: 'Customer Name', type: 'text', hasData: true },
                    'Status': { name: 'Status', type: 'select', hasData: true }
                }
            }
        };

        const duplicates = await engine.detectDuplicateFields(mockSchemas);

        if (!Array.isArray(duplicates)) {
            throw new Error('Duplicate detection did not return array');
        }

        // Should find 'Customer Name' as duplicate
        const customerNameDuplicate = duplicates.find(dup => dup.fieldName === 'Customer Name');
        if (!customerNameDuplicate) {
            throw new Error('Failed to detect known duplicate field');
        }

        if (customerNameDuplicate.occurrences !== 2) {
            throw new Error('Duplicate count incorrect');
        }

        if (customerNameDuplicate.tables.length !== 2) {
            throw new Error('Duplicate table list incorrect');
        }
    }

    async testSimilarFieldDetection() {
        const engine = new FieldConsolidationEngine(
            config,
            this.mockCoordinator,
            this.mockAirtableClient
        );

        // Create mock schemas with similar fields
        const mockSchemas = {
            'Table1': {
                fields: {
                    'Customer_Name': { name: 'Customer_Name', type: 'text', hasData: true, sampleValue: 'John Doe' },
                    'CustomerName': { name: 'CustomerName', type: 'text', hasData: true, sampleValue: 'Jane Smith' }
                }
            }
        };

        const usagePatterns = {
            commonFieldNames: {},
            fieldTypeDistribution: {},
            emptyFieldAnalysis: {},
            crossTableSimilarity: {}
        };

        const similarFields = await engine.detectSimilarFields(mockSchemas, usagePatterns);

        if (!Array.isArray(similarFields)) {
            throw new Error('Similar field detection did not return array');
        }

        // Should find similarity between Customer_Name and CustomerName
        if (similarFields.length > 0) {
            const similarity = similarFields[0];
            if (!similarity.field1 || !similarity.field2) {
                throw new Error('Similar field structure incorrect');
            }

            if (!similarity.similarity || typeof similarity.similarity.score !== 'number') {
                throw new Error('Similarity score not calculated');
            }
        }
    }

    async testConsolidationOpportunityIdentification() {
        const engine = new FieldConsolidationEngine(
            config,
            this.mockCoordinator,
            this.mockAirtableClient
        );

        // Mock analysis data
        const duplicateFields = [
            {
                fieldName: 'Customer Name',
                occurrences: 3,
                tables: ['Table1', 'Table2', 'Table3'],
                consolidationPotential: 0.9,
                riskLevel: 'low'
            }
        ];

        const similarFields = [
            {
                field1: 'Table1.Customer_Name',
                field2: 'Table1.CustomerName',
                similarity: { score: 0.9 },
                consolidationPotential: 0.85,
                riskLevel: 'medium'
            }
        ];

        const contentOverlaps = [
            {
                table: 'Table1',
                field1: 'Created Date',
                field2: 'Creation_Date',
                similarity: 0.95,
                type: 'content-overlap',
                riskLevel: 'low'
            }
        ];

        const opportunities = await engine.identifyConsolidationOpportunities(
            duplicateFields,
            similarFields,
            contentOverlaps
        );

        if (!Array.isArray(opportunities)) {
            throw new Error('Opportunity identification did not return array');
        }

        if (opportunities.length === 0) {
            throw new Error('No consolidation opportunities identified');
        }

        // Verify opportunity structure
        const opportunity = opportunities[0];
        if (!opportunity.type || !opportunity.priority || !opportunity.fields) {
            throw new Error('Opportunity structure incomplete');
        }

        if (!opportunity.estimatedSavings || !opportunity.description) {
            throw new Error('Opportunity missing required analysis data');
        }
    }

    async testComprehensiveFieldAnalysis() {
        const engine = new FieldConsolidationEngine(
            config,
            this.mockCoordinator,
            this.mockAirtableClient
        );

        const analysisResults = await engine.performComprehensiveFieldAnalysis();

        if (!analysisResults || typeof analysisResults !== 'object') {
            throw new Error('Analysis did not return results object');
        }

        // Verify all required analysis components
        const requiredComponents = [
            'tableSchemas',
            'fieldUsagePatterns',
            'dataDistribution',
            'duplicateFields',
            'similarFields',
            'consolidationOpportunities',
            'riskAssessment',
            'impactAnalysis',
            'recommendations',
            'summary'
        ];

        for (const component of requiredComponents) {
            if (!(component in analysisResults)) {
                throw new Error(`Analysis missing required component: ${component}`);
            }
        }

        // Verify summary structure
        if (!analysisResults.summary.analysisDate) {
            throw new Error('Analysis summary missing timestamp');
        }

        if (typeof analysisResults.summary.tablesAnalyzed !== 'number') {
            throw new Error('Analysis summary missing table count');
        }
    }

    async testSafeFieldConsolidatorInitialization() {
        const consolidator = new SafeFieldConsolidator(
            config,
            this.mockCoordinator,
            this.mockAirtableClient,
            this.mockSafetyManager
        );

        if (!consolidator.config) {
            throw new Error('Consolidator configuration not initialized');
        }

        if (!consolidator.safetyProtocols) {
            throw new Error('Safety protocols not defined');
        }

        if (!consolidator.executionResults) {
            throw new Error('Execution results not initialized');
        }

        // Verify safety protocols
        if (!consolidator.safetyProtocols.mandatoryBackup) {
            throw new Error('Mandatory backup safety protocol not enabled');
        }

        if (!consolidator.safetyProtocols.dryRunFirst) {
            throw new Error('Dry run safety protocol not enabled');
        }
    }

    async testConsolidationPlanCreation() {
        const consolidator = new SafeFieldConsolidator(
            config,
            this.mockCoordinator,
            this.mockAirtableClient,
            this.mockSafetyManager
        );

        // Mock analysis results
        const mockAnalysisResults = {
            consolidationOpportunities: [
                {
                    type: 'duplicate-consolidation',
                    priority: 'high',
                    riskLevel: 'low',
                    complexity: 'low',
                    fields: ['Table1.Customer Name', 'Table2.Customer Name'],
                    description: 'Consolidate duplicate Customer Name fields',
                    estimatedSavings: { score: 0.2, storage: 10, performance: 5 }
                },
                {
                    type: 'similarity-consolidation',
                    priority: 'medium',
                    riskLevel: 'medium',
                    complexity: 'medium',
                    fields: ['Table1.Customer_Name', 'Table1.CustomerName'],
                    description: 'Merge similar customer name fields',
                    estimatedSavings: { score: 0.1, storage: 5, performance: 2 }
                }
            ]
        };

        const plan = await consolidator.createConsolidationPlan(mockAnalysisResults);

        if (!plan || typeof plan !== 'object') {
            throw new Error('Plan creation did not return plan object');
        }

        // Verify plan structure
        const requiredPlanComponents = [
            'id',
            'createdAt',
            'opportunities',
            'phases',
            'safetyChecks',
            'rollbackPlan',
            'validation',
            'riskAssessment',
            'estimatedDuration'
        ];

        for (const component of requiredPlanComponents) {
            if (!(component in plan)) {
                throw new Error(`Plan missing required component: ${component}`);
            }
        }

        // Verify phases structure
        if (!Array.isArray(plan.phases)) {
            throw new Error('Plan phases not array');
        }

        if (plan.phases.length === 0) {
            throw new Error('Plan has no execution phases');
        }

        const phase = plan.phases[0];
        if (!phase.name || !phase.operations) {
            throw new Error('Phase structure incomplete');
        }

        if (!Array.isArray(phase.operations)) {
            throw new Error('Phase operations not array');
        }
    }

    async testDryRunExecution() {
        const consolidator = new SafeFieldConsolidator(
            config,
            this.mockCoordinator,
            this.mockAirtableClient,
            this.mockSafetyManager
        );

        // Create a simple plan
        const mockAnalysisResults = {
            consolidationOpportunities: [
                {
                    type: 'duplicate-consolidation',
                    priority: 'high',
                    riskLevel: 'low',
                    complexity: 'low',
                    fields: ['Table1.Status', 'Table2.Status'],
                    description: 'Test duplicate consolidation',
                    estimatedSavings: { score: 0.1, storage: 5, performance: 2 }
                }
            ]
        };

        const plan = await consolidator.createConsolidationPlan(mockAnalysisResults);

        // Execute in dry run mode
        const results = await consolidator.executeConsolidationPlan({
            dryRun: true,
            confirmed: true,
            skipBackup: true
        });

        if (!results || typeof results !== 'object') {
            throw new Error('Dry run did not return results');
        }

        if (!results.success) {
            throw new Error('Dry run execution failed');
        }

        // Verify dry run results
        if (!results.phases || !Array.isArray(results.phases)) {
            throw new Error('Dry run results missing phases');
        }

        if (results.phases.length === 0) {
            throw new Error('No phases executed in dry run');
        }

        const phase = results.phases[0];
        if (!phase.success) {
            throw new Error('Dry run phase failed');
        }

        if (!phase.operations || phase.operations.length === 0) {
            throw new Error('No operations executed in dry run');
        }

        const operation = phase.operations[0];
        if (!operation.success) {
            throw new Error('Dry run operation failed');
        }

        if (!operation.result.dryRun) {
            throw new Error('Operation result not marked as dry run');
        }
    }

    async testSafetyValidation() {
        const consolidator = new SafeFieldConsolidator(
            config,
            this.mockCoordinator,
            this.mockAirtableClient,
            this.mockSafetyManager
        );

        // Test plan with too many operations (should fail safety validation)
        const unsafePlan = {
            id: 'test-plan',
            phases: [
                {
                    operations: Array(25).fill(0).map((_, i) => ({
                        type: 'test-operation',
                        affectedTables: [`Table${i}`],
                        description: `Test operation ${i}`
                    }))
                }
            ]
        };

        const validation = await consolidator.validatePlanSafety(unsafePlan);

        if (validation.passed) {
            throw new Error('Unsafe plan passed safety validation');
        }

        if (!validation.issues || validation.issues.length === 0) {
            throw new Error('Safety validation did not identify issues');
        }

        // Test safe plan
        const safePlan = {
            id: 'safe-plan',
            phases: [
                {
                    operations: [
                        {
                            type: 'safe-operation',
                            affectedTables: ['Table1'],
                            description: 'Safe test operation'
                        }
                    ]
                }
            ]
        };

        const safeValidation = await consolidator.validatePlanSafety(safePlan);

        if (!safeValidation.passed) {
            throw new Error('Safe plan failed safety validation');
        }
    }

    async testErrorHandlingAndRollback() {
        const consolidator = new SafeFieldConsolidator(
            config,
            this.mockCoordinator,
            this.mockAirtableClient,
            this.mockSafetyManager
        );

        // Create plan but simulate execution failure
        const mockAnalysisResults = {
            consolidationOpportunities: [
                {
                    type: 'duplicate-consolidation',
                    priority: 'high',
                    riskLevel: 'low',
                    complexity: 'low',
                    fields: ['Table1.TestField'],
                    description: 'Test field for error handling',
                    estimatedSavings: { score: 0.1 }
                }
            ]
        };

        const plan = await consolidator.createConsolidationPlan(mockAnalysisResults);

        // Mock operation failure by overriding execution method temporarily
        const originalExecute = consolidator.executeDuplicateFieldConsolidation;
        consolidator.executeDuplicateFieldConsolidation = async () => {
            throw new Error('Simulated operation failure');
        };

        try {
            await consolidator.executeConsolidationPlan({
                dryRun: false,
                confirmed: true,
                skipBackup: false
            });
            
            // Should not reach here
            throw new Error('Expected execution to fail but it succeeded');
            
        } catch (error) {
            // Restore original method
            consolidator.executeDuplicateFieldConsolidation = originalExecute;
            
            // Verify error handling
            if (!error.message.includes('Simulated operation failure')) {
                throw new Error('Error was not propagated correctly');
            }
            
            // Verify rollback was attempted
            if (!consolidator.executionResults.error) {
                throw new Error('Execution error not recorded');
            }
        }
    }

    async testAnalysisResultsExport() {
        const engine = new FieldConsolidationEngine(
            config,
            this.mockCoordinator,
            this.mockAirtableClient
        );

        // Perform analysis
        const analysisResults = await engine.performComprehensiveFieldAnalysis();

        // Export results
        const exportPath = path.join(this.testOutputDir, 'field-analysis-export.json');
        const exportedPath = await engine.exportAnalysisResults(exportPath);

        if (exportedPath !== exportPath) {
            throw new Error('Export path mismatch');
        }

        if (!(await fs.pathExists(exportPath))) {
            throw new Error('Export file not created');
        }

        // Verify export content
        const exportedData = await fs.readJson(exportPath);
        
        if (!exportedData.exportedAt) {
            throw new Error('Export timestamp missing');
        }

        if (!exportedData.version) {
            throw new Error('Export version missing');
        }

        // Should contain all original analysis components
        if (!exportedData.tableSchemas || !exportedData.consolidationOpportunities) {
            throw new Error('Exported data incomplete');
        }
    }

    async cleanup() {
        console.log(chalk.gray('\n🧹 Cleaning up test environment...'));
        
        try {
            // Remove test directories
            await fs.remove(this.testBackupDir);
            await fs.remove(this.testOutputDir);
            
            console.log(chalk.green('✓ Test cleanup completed'));
        } catch (error) {
            console.log(chalk.yellow(`⚠ Cleanup warning: ${error.message}`));
        }
    }

    async runAllTests() {
        await this.initialize();

        // Field Consolidation Engine Tests
        await this.runTest('FieldConsolidationEngine Initialization', () => this.testFieldConsolidationEngineInitialization());
        await this.runTest('Table Schema Analysis', () => this.testTableSchemaAnalysis());
        await this.runTest('Duplicate Field Detection', () => this.testDuplicateFieldDetection());
        await this.runTest('Similar Field Detection', () => this.testSimilarFieldDetection());
        await this.runTest('Consolidation Opportunity Identification', () => this.testConsolidationOpportunityIdentification());
        await this.runTest('Comprehensive Field Analysis', () => this.testComprehensiveFieldAnalysis());

        // Safe Field Consolidator Tests
        await this.runTest('SafeFieldConsolidator Initialization', () => this.testSafeFieldConsolidatorInitialization());
        await this.runTest('Consolidation Plan Creation', () => this.testConsolidationPlanCreation());
        await this.runTest('Dry Run Execution', () => this.testDryRunExecution());
        await this.runTest('Safety Validation', () => this.testSafetyValidation());
        await this.runTest('Error Handling and Rollback', () => this.testErrorHandlingAndRollback());

        // Integration Tests
        await this.runTest('Analysis Results Export', () => this.testAnalysisResultsExport());

        await this.cleanup();
        this.printResults();
    }

    printResults() {
        console.log(chalk.blue('\n📊 Phase 3B Test Results'));
        console.log(chalk.gray('═'.repeat(70)));
        
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

        console.log(chalk.blue('\n🎯 Phase 3B Assessment:'));
        if (passRate >= 85) {
            console.log(chalk.green('✅ EXCELLENT - Safe field consolidation system is production-ready'));
            console.log(chalk.green('   Ready to proceed to Phase 3C'));
        } else if (passRate >= 75) {
            console.log(chalk.yellow('⚠️  GOOD - Minor issues detected, but system is functional'));
            console.log(chalk.yellow('   Review failed tests before proceeding'));
        } else {
            console.log(chalk.red('❌ CRITICAL - Major field consolidation issues detected'));
            console.log(chalk.red('   Must fix issues before proceeding to Phase 3C'));
        }

        console.log(chalk.gray('\n' + '═'.repeat(70)));
        
        return passRate >= 75;
    }
}

// Run tests if called directly
if (require.main === module) {
    const testSuite = new Phase3BTestSuite();
    testSuite.runAllTests()
        .then(() => {
            process.exit(0);
        })
        .catch(error => {
            console.error(chalk.red('Test suite failed:'), error);
            process.exit(1);
        });
}

module.exports = Phase3BTestSuite;