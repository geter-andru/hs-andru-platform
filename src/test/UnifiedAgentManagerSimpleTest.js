/**
 * Unified Agent Manager Simple Test
 * 
 * Simplified test suite for validating the unified agent management system architecture
 */

console.log('🧪 Starting Unified Agent Manager Architecture Test...');
console.log('══════════════════════════════════════════════════════════');

class SimpleUnifiedAgentTest {
  constructor() {
    this.testResults = [];
  }

  async runTests() {
    try {
      await this.testClassStructure();
      await this.testRegistryMethods();
      await this.testStatusMethods();
      this.printResults();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }

  async testClassStructure() {
    console.log('🔍 Testing: UnifiedAgentManager Class Structure');
    
    try {
      // Import the class
      const { default: UnifiedAgentManager } = await import('../agents/UnifiedAgentManager.js');
      
      // Test instantiation
      const manager = new UnifiedAgentManager({
        customerValue: {},
        airtableManagement: {}
      });
      
      // Check required properties exist
      const hasRequiredProperties = [
        'managerType',
        'globalStats', 
        'agentRegistry',
        'orchestratorsLoaded'
      ].every(prop => manager.hasOwnProperty(prop));
      
      // Check required methods exist
      const hasRequiredMethods = [
        'executeOperation',
        'getUnifiedStatus',
        'listAllAgents',
        'isAgentAvailable',
        'getAgentInfo'
      ].every(method => typeof manager[method] === 'function');
      
      if (hasRequiredProperties && hasRequiredMethods) {
        console.log('  ✅ Class has all required properties and methods');
        this.addResult('Class Structure', true, 'All required properties and methods present');
      } else {
        this.addResult('Class Structure', false, 'Missing required properties or methods');
      }
      
    } catch (error) {
      this.addResult('Class Structure', false, error.message);
    }
  }

  async testRegistryMethods() {
    console.log('🔍 Testing: Agent Registry Methods');
    
    try {
      const { default: UnifiedAgentManager } = await import('../agents/UnifiedAgentManager.js');
      const manager = new UnifiedAgentManager();
      
      // Test registry initialization
      const isMapObject = manager.agentRegistry instanceof Map;
      
      // Test registry methods
      const hasRegistryMethods = [
        'listAllAgents',
        'isAgentAvailable',
        'getAgentInfo'
      ].every(method => typeof manager[method] === 'function');
      
      if (isMapObject && hasRegistryMethods) {
        console.log('  ✅ Agent registry initialized as Map with proper methods');
        this.addResult('Registry Methods', true, 'Registry structure and methods correct');
      } else {
        this.addResult('Registry Methods', false, 'Registry structure or methods incorrect');
      }
      
    } catch (error) {
      this.addResult('Registry Methods', false, error.message);
    }
  }

  async testStatusMethods() {
    console.log('🔍 Testing: Status and Statistics Methods');
    
    try {
      const { default: UnifiedAgentManager } = await import('../agents/UnifiedAgentManager.js');
      const manager = new UnifiedAgentManager();
      
      // Test global stats structure
      const hasStatsProperties = [
        'totalOperations',
        'successfulOperations', 
        'failedOperations',
        'averageExecutionTime',
        'activeAgentCount',
        'operationsByOrchestrator'
      ].every(prop => manager.globalStats.hasOwnProperty(prop));
      
      // Test status method
      const statusMethodExists = typeof manager.getUnifiedStatus === 'function';
      
      if (hasStatsProperties && statusMethodExists) {
        console.log('  ✅ Statistics tracking and status reporting structure correct');
        this.addResult('Status Methods', true, 'Statistics and status methods properly structured');
      } else {
        this.addResult('Status Methods', false, 'Missing statistics properties or status methods');
      }
      
    } catch (error) {
      this.addResult('Status Methods', false, error.message);
    }
  }

  addResult(testName, passed, details) {
    this.testResults.push({ testName, passed, details });
    const status = passed ? '✅ PASSED' : '❌ FAILED';
    console.log(`${status} - ${testName}: ${details}`);
  }

  printResults() {
    console.log('\n📊 Unified Agent Manager Architecture Test Results');
    console.log('══════════════════════════════════════════════════════════');
    
    const passed = this.testResults.filter(r => r.passed).length;
    const total = this.testResults.length;
    const passRate = total > 0 ? (passed / total * 100).toFixed(1) : 0;
    
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${total - passed}`);
    console.log(`Pass Rate: ${passRate}%`);
    
    if (passRate >= 80) {
      console.log('\n🎯 Phase 3A Architecture Assessment:');
      console.log('✅ EXCELLENT - UnifiedAgentManager architecture is sound');
      console.log('   Class structure, registry, and status systems properly implemented');
      console.log('   Ready to proceed to Phase 3B');
    } else if (passRate >= 60) {
      console.log('\n🎯 Phase 3A Architecture Assessment:');
      console.log('⚠️ GOOD - Architecture mostly correct, minor issues to address');
    } else {
      console.log('\n🎯 Phase 3A Architecture Assessment:');
      console.log('❌ NEEDS WORK - Architecture issues need resolution');
    }
    
    console.log('══════════════════════════════════════════════════════════');
  }
}

// Run tests
const test = new SimpleUnifiedAgentTest();
test.runTests();