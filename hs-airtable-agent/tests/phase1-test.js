#!/usr/bin/env node

/**
 * Phase 1 Testing Suite
 * Tests environment setup, agent coordination, lock mechanism, and rollback capabilities
 */

const { default: chalk } = require('chalk');
const fs = require('fs-extra');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import our classes
const config = require('../config/agent.config.js');
const AgentCoordinator = require('../lib/AgentCoordinator.js');
const AirtableClient = require('../lib/AirtableClient.js');

class Phase1TestSuite {
  constructor() {
    this.testResults = [];
    this.coordinator = new AgentCoordinator(config);
    this.airtableClient = new AirtableClient(config, this.coordinator);
  }

  async runAllTests() {
    console.log(chalk.bold.blue('\n🧪 PHASE 1 TESTING SUITE\n'));
    console.log(chalk.blue('Testing environment setup, coordination, locks, and rollback...\n'));

    try {
      // Test 1: Environment Setup
      await this.testEnvironmentSetup();
      
      // Test 2: Agent Coordination
      await this.testAgentCoordination();
      
      // Test 3: Lock Mechanism
      await this.testLockMechanism();
      
      // Test 4: Airtable Connectivity
      await this.testAirtableConnectivity();
      
      // Test 5: Agent Compatibility
      await this.testAgentCompatibility();
      
      // Test 6: Rollback Capability
      await this.testRollbackCapability();
      
      // Generate Summary
      this.generateTestSummary();
      
    } catch (error) {
      console.error(chalk.red('❌ Testing suite failed:'), error);
      process.exit(1);
    }
  }

  async testEnvironmentSetup() {
    console.log(chalk.yellow('📋 Test 1: Environment Setup'));
    
    const tests = [
      {
        name: 'Config file loaded',
        test: () => !!config.agentName,
        expected: true
      },
      {
        name: 'Required directories exist',
        test: async () => {
          const dirs = ['config', 'logs', 'backups', 'optimizations'];
          for (const dir of dirs) {
            if (!await fs.pathExists(path.join('..', dir))) return false;
          }
          return true;
        },
        expected: true
      },
      {
        name: 'Node modules installed',
        test: async () => await fs.pathExists('../node_modules'),
        expected: true
      },
      {
        name: 'Environment variables available',
        test: () => !!(process.env.AIRTABLE_BASE_ID || config.airtable.baseId),
        expected: true
      }
    ];

    for (const test of tests) {
      try {
        const result = await test.test();
        this.recordTest('Environment Setup', test.name, result === test.expected, result);
        console.log(
          result === test.expected 
            ? chalk.green(`  ✅ ${test.name}`)
            : chalk.red(`  ❌ ${test.name}: Expected ${test.expected}, got ${result}`)
        );
      } catch (error) {
        this.recordTest('Environment Setup', test.name, false, error.message);
        console.log(chalk.red(`  ❌ ${test.name}: ${error.message}`));
      }
    }
  }

  async testAgentCoordination() {
    console.log(chalk.yellow('\n🤝 Test 2: Agent Coordination'));
    
    try {
      // Initialize coordinator
      const initResult = await this.coordinator.initialize();
      this.recordTest('Agent Coordination', 'Coordinator initialization', initResult, initResult);
      console.log(
        initResult 
          ? chalk.green('  ✅ Coordinator initialized successfully')
          : chalk.red('  ❌ Coordinator initialization failed')
      );

      // Test heartbeat
      await this.coordinator.startHeartbeat();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const statusExists = await fs.pathExists(this.coordinator.statusFile);
      this.recordTest('Agent Coordination', 'Heartbeat status file created', statusExists, statusExists);
      console.log(
        statusExists
          ? chalk.green('  ✅ Heartbeat status file created')
          : chalk.red('  ❌ Heartbeat status file not created')
      );

      // Test status update
      await this.coordinator.updateStatus('testing', 'Running Phase 1 tests');
      const status = await fs.readJson(this.coordinator.statusFile);
      const statusValid = status.state === 'testing' && status.agent === config.agentName;
      this.recordTest('Agent Coordination', 'Status update working', statusValid, status);
      console.log(
        statusValid
          ? chalk.green('  ✅ Status update working correctly')
          : chalk.red('  ❌ Status update failed')
      );

    } catch (error) {
      this.recordTest('Agent Coordination', 'Overall coordination', false, error.message);
      console.log(chalk.red(`  ❌ Agent coordination failed: ${error.message}`));
    }
  }

  async testLockMechanism() {
    console.log(chalk.yellow('\n🔒 Test 3: Lock Mechanism'));
    
    try {
      // Test lock acquisition
      const lockAcquired = await this.coordinator.acquireGlobalLock('test-operation', 5000);
      this.recordTest('Lock Mechanism', 'Lock acquisition', lockAcquired, lockAcquired);
      console.log(
        lockAcquired
          ? chalk.green('  ✅ Global lock acquired successfully')
          : chalk.red('  ❌ Failed to acquire global lock')
      );

      // Test lock file exists
      const lockExists = await fs.pathExists(this.coordinator.globalLockFile);
      this.recordTest('Lock Mechanism', 'Lock file creation', lockExists, lockExists);
      console.log(
        lockExists
          ? chalk.green('  ✅ Lock file created')
          : chalk.red('  ❌ Lock file not created')
      );

      // Test lock release
      const lockReleased = await this.coordinator.releaseGlobalLock();
      this.recordTest('Lock Mechanism', 'Lock release', lockReleased, lockReleased);
      console.log(
        lockReleased
          ? chalk.green('  ✅ Global lock released successfully')
          : chalk.red('  ❌ Failed to release global lock')
      );

      // Test lock file removed
      const lockRemoved = !await fs.pathExists(this.coordinator.globalLockFile);
      this.recordTest('Lock Mechanism', 'Lock file removal', lockRemoved, lockRemoved);
      console.log(
        lockRemoved
          ? chalk.green('  ✅ Lock file removed after release')
          : chalk.red('  ❌ Lock file still exists after release')
      );

    } catch (error) {
      this.recordTest('Lock Mechanism', 'Overall lock mechanism', false, error.message);
      console.log(chalk.red(`  ❌ Lock mechanism failed: ${error.message}`));
    }
  }

  async testAirtableConnectivity() {
    console.log(chalk.yellow('\n🔗 Test 4: Airtable Connectivity'));
    
    try {
      // Test basic connection
      const connectionTest = await this.airtableClient.testConnection();
      this.recordTest('Airtable Connectivity', 'Basic connection', connectionTest.success, connectionTest);
      console.log(
        connectionTest.success
          ? chalk.green('  ✅ Airtable connection successful')
          : chalk.red(`  ❌ Airtable connection failed: ${connectionTest.error}`)
      );

      if (connectionTest.success) {
        // Test environment validation
        const envValidation = await this.airtableClient.validateEnvironment();
        this.recordTest('Airtable Connectivity', 'Environment validation', envValidation.summary.ready, envValidation.summary);
        
        console.log(chalk.blue(`  📊 Tables found: ${envValidation.summary.tablesFound}/${envValidation.summary.totalTables}`));
        console.log(chalk.blue(`  📊 Completeness: ${envValidation.summary.completeness.toFixed(1)}%`));
        console.log(
          envValidation.summary.testCustomerExists
            ? chalk.green('  ✅ Test customer (CUST_02) found')
            : chalk.yellow('  ⚠️ Test customer (CUST_02) not found')
        );
      }

    } catch (error) {
      this.recordTest('Airtable Connectivity', 'Overall connectivity', false, error.message);
      console.log(chalk.red(`  ❌ Airtable connectivity failed: ${error.message}`));
    }
  }

  async testAgentCompatibility() {
    console.log(chalk.yellow('\n🤖 Test 5: Agent Compatibility'));
    
    try {
      // Check for other active agents
      const activeAgents = await this.coordinator.getActiveAgents();
      this.recordTest('Agent Compatibility', 'Active agents detection', true, activeAgents);
      
      if (activeAgents.length > 1) {
        console.log(chalk.blue(`  📊 Found ${activeAgents.length} active agents:`));
        for (const agent of activeAgents) {
          console.log(chalk.blue(`    - ${agent.agent}: ${agent.state}`));
        }
      } else {
        console.log(chalk.blue('  📊 Only this agent is currently active'));
      }

      // Test compatibility check
      const compatibility = await this.coordinator.checkCompatibility();
      this.recordTest('Agent Compatibility', 'Compatibility check', compatibility.compatible, compatibility);
      
      if (compatibility.compatible) {
        console.log(chalk.green('  ✅ All agents are compatible'));
      } else {
        console.log(chalk.yellow('  ⚠️ Compatibility conflicts detected:'));
        for (const conflict of compatibility.conflicts) {
          console.log(chalk.yellow(`    - ${conflict.agent}: ${conflict.reason}`));
        }
      }

    } catch (error) {
      this.recordTest('Agent Compatibility', 'Overall compatibility', false, error.message);
      console.log(chalk.red(`  ❌ Agent compatibility check failed: ${error.message}`));
    }
  }

  async testRollbackCapability() {
    console.log(chalk.yellow('\n🔄 Test 6: Rollback Capability'));
    
    try {
      // Test cleanup capability
      await this.coordinator.cleanupStaleLocks();
      this.recordTest('Rollback Capability', 'Cleanup stale locks', true, 'Cleanup completed');
      console.log(chalk.green('  ✅ Stale lock cleanup working'));

      // Test safe shutdown
      const shutdownPromise = this.coordinator.safeShutdown();
      await shutdownPromise;
      this.recordTest('Rollback Capability', 'Safe shutdown', true, 'Shutdown completed');
      console.log(chalk.green('  ✅ Safe shutdown working'));

      // Restart coordinator for final cleanup
      await this.coordinator.initialize();
      await this.coordinator.startHeartbeat();

    } catch (error) {
      this.recordTest('Rollback Capability', 'Overall rollback', false, error.message);
      console.log(chalk.red(`  ❌ Rollback capability failed: ${error.message}`));
    }
  }

  recordTest(category, testName, passed, details) {
    this.testResults.push({
      category,
      testName,
      passed,
      details,
      timestamp: new Date().toISOString()
    });
  }

  generateTestSummary() {
    console.log(chalk.bold.blue('\n📊 PHASE 1 TEST SUMMARY\n'));
    
    const categories = {};
    let totalTests = 0;
    let passedTests = 0;

    for (const result of this.testResults) {
      if (!categories[result.category]) {
        categories[result.category] = { total: 0, passed: 0 };
      }
      categories[result.category].total++;
      totalTests++;
      
      if (result.passed) {
        categories[result.category].passed++;
        passedTests++;
      }
    }

    // Print category summaries
    for (const [category, stats] of Object.entries(categories)) {
      const percentage = ((stats.passed / stats.total) * 100).toFixed(1);
      const status = stats.passed === stats.total ? '✅' : stats.passed > 0 ? '⚠️' : '❌';
      console.log(chalk.blue(`${status} ${category}: ${stats.passed}/${stats.total} (${percentage}%)`));
    }

    // Overall summary
    const overallPercentage = ((passedTests / totalTests) * 100).toFixed(1);
    console.log(chalk.bold(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed (${overallPercentage}%)`));

    // Phase 1 Gate Decision
    const phase1Ready = passedTests >= totalTests * 0.8; // 80% pass rate required
    if (phase1Ready) {
      console.log(chalk.bold.green('\n🚀 PHASE 1 GATE: PASSED'));
      console.log(chalk.green('✅ Ready to proceed to Phase 2'));
    } else {
      console.log(chalk.bold.red('\n🛑 PHASE 1 GATE: FAILED'));
      console.log(chalk.red('❌ Issues must be resolved before proceeding'));
    }

    // Save detailed results
    this.saveTestResults();
    
    // Clean shutdown
    this.coordinator.safeShutdown();
    
    return phase1Ready;
  }

  async saveTestResults() {
    const resultsFile = path.join('..', 'tests', 'phase1-results.json');
    await fs.ensureDir(path.dirname(resultsFile));
    await fs.writeJson(resultsFile, {
      timestamp: new Date().toISOString(),
      phase: 'Phase 1',
      results: this.testResults,
      summary: {
        total: this.testResults.length,
        passed: this.testResults.filter(r => r.passed).length,
        failed: this.testResults.filter(r => !r.passed).length
      }
    }, { spaces: 2 });
    
    console.log(chalk.blue(`\n📄 Detailed results saved to: ${resultsFile}`));
  }
}

// Run tests if called directly
if (require.main === module) {
  const testSuite = new Phase1TestSuite();
  testSuite.runAllTests()
    .then(() => {
      console.log(chalk.blue('\n✅ Phase 1 testing completed\n'));
      process.exit(0);
    })
    .catch(error => {
      console.error(chalk.red('\n❌ Phase 1 testing failed:'), error);
      process.exit(1);
    });
}

module.exports = Phase1TestSuite;