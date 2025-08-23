/**
 * Unified Agent Manager Test
 * 
 * Test suite for validating the unified agent management system
 */

import UnifiedAgentManager from '../agents/UnifiedAgentManager.js';

class UnifiedAgentManagerTest {
  constructor() {
    this.testResults = [];
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🧪 Starting Unified Agent Manager Test Suite...');
    console.log('══════════════════════════════════════════════════════════');
    
    try {
      await this.testManagerInitialization();
      await this.testAgentRegistry();
      await this.testOrchestratorStatus();
      await this.testAgentDiscovery();
      await this.testUnifiedStatus();
      
      this.printResults();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }

  /**
   * Test manager initialization
   */
  async testManagerInitialization() {
    console.log('🔍 Testing: Unified Agent Manager Initialization');
    
    try {
      const manager = new UnifiedAgentManager({
        customerValue: {},
        airtableManagement: {}
      });
      
      // Wait for initialization
      await this.waitForCondition(() => manager.orchestratorsLoaded, 10000);
      
      if (manager.orchestratorsLoaded) {
        this.addResult('Manager Initialization', true, 'All orchestrators loaded successfully');
      } else {
        this.addResult('Manager Initialization', false, 'Orchestrators failed to load');
      }
      
    } catch (error) {
      this.addResult('Manager Initialization', false, error.message);
    }
  }

  /**
   * Test agent registry functionality
   */
  async testAgentRegistry() {
    console.log('🔍 Testing: Agent Registry System');
    
    try {
      const manager = new UnifiedAgentManager();
      await this.waitForCondition(() => manager.orchestratorsLoaded, 10000);
      
      const allAgents = manager.listAllAgents();
      const expectedMinimumAgents = 4; // At minimum Customer Value agents
      
      if (allAgents.length >= expectedMinimumAgents) {
        console.log(`  📋 Found ${allAgents.length} registered agents`);
        
        // Check for Customer Value agents
        const customerValueAgents = allAgents.filter(agent => agent.type === 'customer-value');
        const airtableAgents = allAgents.filter(agent => agent.type === 'airtable-management');
        
        console.log(`    🎯 Customer Value agents: ${customerValueAgents.length}`);
        console.log(`    💾 Airtable Management agents: ${airtableAgents.length}`);
        
        this.addResult('Agent Registry', true, `Registered ${allAgents.length} agents across orchestrators`);
      } else {
        this.addResult('Agent Registry', false, `Only ${allAgents.length} agents registered, expected at least ${expectedMinimumAgents}`);
      }
      
    } catch (error) {
      this.addResult('Agent Registry', false, error.message);
    }
  }

  /**
   * Test orchestrator status reporting
   */
  async testOrchestratorStatus() {
    console.log('🔍 Testing: Orchestrator Status Reporting');
    
    try {
      const manager = new UnifiedAgentManager();
      await this.waitForCondition(() => manager.orchestratorsLoaded, 10000);
      
      const status = await manager.getUnifiedStatus();
      
      const hasCustomerValue = status.orchestrators.customerValue?.available;
      const hasAirtableManagement = status.orchestrators.airtableManagement?.available;
      
      console.log(`  🎯 Customer Value Orchestrator: ${hasCustomerValue ? 'Available' : 'Not Available'}`);
      console.log(`  💾 Airtable Management Orchestrator: ${hasAirtableManagement ? 'Available' : 'Not Available'}`);
      
      if (hasCustomerValue) {
        this.addResult('Orchestrator Status', true, 'At least one orchestrator is available and reporting status');
      } else {
        this.addResult('Orchestrator Status', false, 'No orchestrators are available');
      }
      
    } catch (error) {
      this.addResult('Orchestrator Status', false, error.message);
    }
  }

  /**
   * Test agent discovery functionality
   */
  async testAgentDiscovery() {
    console.log('🔍 Testing: Agent Discovery');
    
    try {
      const manager = new UnifiedAgentManager();
      await this.waitForCondition(() => manager.orchestratorsLoaded, 10000);
      
      // Test finding a known agent
      const dashboardOptimizer = manager.getAgentInfo('dashboard-optimizer');
      const isAvailable = manager.isAgentAvailable('dashboard-optimizer');
      
      if (dashboardOptimizer && isAvailable) {
        console.log(`  ✅ Found 'dashboard-optimizer' agent: ${dashboardOptimizer.type}`);
        this.addResult('Agent Discovery', true, 'Successfully discovered and validated agent availability');
      } else {
        this.addResult('Agent Discovery', false, 'Failed to discover expected agents');
      }
      
    } catch (error) {
      this.addResult('Agent Discovery', false, error.message);
    }
  }

  /**
   * Test unified status reporting
   */
  async testUnifiedStatus() {
    console.log('🔍 Testing: Unified Status Reporting');
    
    try {
      const manager = new UnifiedAgentManager();
      await this.waitForCondition(() => manager.orchestratorsLoaded, 10000);
      
      const status = await manager.getUnifiedStatus();
      
      const hasValidStats = status.globalStats && 
                           typeof status.globalStats.totalOperations === 'number' &&
                           status.totalRegisteredAgents > 0;
      
      if (hasValidStats) {
        console.log(`  📊 Total registered agents: ${status.totalRegisteredAgents}`);
        console.log(`  📈 Global operations: ${status.globalStats.totalOperations}`);
        console.log(`  ⚡ Manager active: ${status.isActive}`);
        
        this.addResult('Unified Status', true, 'Unified status reporting working correctly');
      } else {
        this.addResult('Unified Status', false, 'Unified status reporting incomplete');
      }
      
    } catch (error) {
      this.addResult('Unified Status', false, error.message);
    }
  }

  /**
   * Add test result
   */
  addResult(testName, passed, details) {
    this.testResults.push({ testName, passed, details });
    const status = passed ? '✅ PASSED' : '❌ FAILED';
    console.log(`${status} - ${testName}: ${details}`);
  }

  /**
   * Print final results
   */
  printResults() {
    console.log('\n📊 Unified Agent Manager Test Results');
    console.log('══════════════════════════════════════════════════════════');
    
    const passed = this.testResults.filter(r => r.passed).length;
    const total = this.testResults.length;
    const passRate = total > 0 ? (passed / total * 100).toFixed(1) : 0;
    
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${total - passed}`);
    console.log(`Pass Rate: ${passRate}%`);
    
    if (passRate >= 80) {
      console.log('\n🎯 Phase 3A Assessment:');
      console.log('✅ EXCELLENT - Unified Agent Manager is working correctly');
      console.log('   Ready to proceed to Phase 3B');
    } else if (passRate >= 60) {
      console.log('\n🎯 Phase 3A Assessment:');
      console.log('⚠️ GOOD - Some issues need attention before proceeding');
    } else {
      console.log('\n🎯 Phase 3A Assessment:');
      console.log('❌ NEEDS WORK - Significant issues need resolution');
    }
    
    console.log('══════════════════════════════════════════════════════════');
  }

  /**
   * Wait for condition with timeout
   */
  async waitForCondition(conditionFn, timeoutMs = 5000) {
    const startTime = Date.now();
    while (!conditionFn() && (Date.now() - startTime) < timeoutMs) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return conditionFn();
  }
}

// Export for use in other modules
export default UnifiedAgentManagerTest;

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const test = new UnifiedAgentManagerTest();
  test.runAllTests();
}