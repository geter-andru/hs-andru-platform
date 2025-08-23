/**
 * Agent Registry System Test
 * 
 * Test suite for validating the advanced agent registry system
 */

console.log('🧪 Starting Agent Registry System Test Suite...');
console.log('══════════════════════════════════════════════════════════');

class AgentRegistryTest {
  constructor() {
    this.testResults = [];
    this.registry = null;
  }

  async runAllTests() {
    try {
      await this.testRegistryInitialization();
      await this.testAgentRegistration();
      await this.testAgentDiscovery();
      await this.testCapabilityQuerying();
      await this.testHealthMonitoring();
      await this.testPerformanceTracking();
      await this.testRegistryStatistics();
      await this.testCleanup();
      
      this.printResults();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }

  async testRegistryInitialization() {
    console.log('🔍 Testing: Agent Registry Initialization');
    
    try {
      const { default: AgentRegistry } = await import('../agents/AgentRegistry.js');
      
      this.registry = new AgentRegistry();
      
      // Check required properties
      const hasRequiredProperties = [
        'agents',
        'capabilities', 
        'performanceHistory',
        'healthCheckInterval'
      ].every(prop => this.registry.hasOwnProperty(prop));
      
      // Check required methods
      const hasRequiredMethods = [
        'registerAgent',
        'getAgent',
        'findAgents',
        'performHealthCheck',
        'getStatistics'
      ].every(method => typeof this.registry[method] === 'function');
      
      if (hasRequiredProperties && hasRequiredMethods) {
        this.addResult('Registry Initialization', true, 'Registry initialized with all required properties and methods');
      } else {
        this.addResult('Registry Initialization', false, 'Missing required properties or methods');
      }
      
    } catch (error) {
      this.addResult('Registry Initialization', false, error.message);
    }
  }

  async testAgentRegistration() {
    console.log('🔍 Testing: Agent Registration');
    
    try {
      if (!this.registry) throw new Error('Registry not initialized');
      
      // Register test agents
      const testAgent1 = this.registry.registerAgent('test-agent-1', {
        type: 'test',
        orchestrator: 'test-orchestrator',
        capabilities: ['testing', 'validation'],
        tags: ['test', 'sample'],
        description: 'Test agent for validation'
      });
      
      const testAgent2 = this.registry.registerAgent('test-agent-2', {
        type: 'test',
        orchestrator: 'test-orchestrator',
        capabilities: ['analysis', 'reporting'],
        tags: ['test', 'analytics'],
        description: 'Second test agent'
      });
      
      // Verify registration
      const agent1Retrieved = this.registry.getAgent('test-agent-1');
      const agent2Retrieved = this.registry.getAgent('test-agent-2');
      
      const registrationSuccess = agent1Retrieved && 
                                  agent2Retrieved && 
                                  agent1Retrieved.name === 'test-agent-1' &&
                                  agent2Retrieved.name === 'test-agent-2';
      
      if (registrationSuccess) {
        console.log(`  ✅ Successfully registered 2 test agents`);
        console.log(`    📋 Agent 1: ${agent1Retrieved.capabilities.join(', ')}`);
        console.log(`    📋 Agent 2: ${agent2Retrieved.capabilities.join(', ')}`);
        this.addResult('Agent Registration', true, 'Agents registered and retrieved successfully');
      } else {
        this.addResult('Agent Registration', false, 'Agent registration or retrieval failed');
      }
      
    } catch (error) {
      this.addResult('Agent Registration', false, error.message);
    }
  }

  async testAgentDiscovery() {
    console.log('🔍 Testing: Agent Discovery and Querying');
    
    try {
      if (!this.registry) throw new Error('Registry not initialized');
      
      // Test finding agents by type
      const testAgents = this.registry.findAgents({ type: 'test' });
      const testAgentsByCapability = this.registry.findAgents({ capabilities: ['testing'] });
      const testAgentsByTag = this.registry.findAgents({ tags: ['test'] });
      
      const discoverySuccess = testAgents.length >= 2 && 
                              testAgentsByCapability.length >= 1 &&
                              testAgentsByTag.length >= 2;
      
      if (discoverySuccess) {
        console.log(`  🔍 Found ${testAgents.length} agents by type`);
        console.log(`  🔍 Found ${testAgentsByCapability.length} agents by capability 'testing'`);
        console.log(`  🔍 Found ${testAgentsByTag.length} agents by tag 'test'`);
        this.addResult('Agent Discovery', true, 'Agent discovery and querying working correctly');
      } else {
        this.addResult('Agent Discovery', false, 'Agent discovery queries returned unexpected results');
      }
      
    } catch (error) {
      this.addResult('Agent Discovery', false, error.message);
    }
  }

  async testCapabilityQuerying() {
    console.log('🔍 Testing: Capability-Based Querying');
    
    try {
      if (!this.registry) throw new Error('Registry not initialized');
      
      // Test capability-specific queries
      const testingAgents = this.registry.getAgentsByCapability('testing');
      const analysisAgents = this.registry.getAgentsByCapability('analysis');
      
      const capabilitySuccess = testingAgents.length >= 1 && analysisAgents.length >= 1;
      
      if (capabilitySuccess) {
        console.log(`  🎯 Found ${testingAgents.length} agents with 'testing' capability`);
        console.log(`  📊 Found ${analysisAgents.length} agents with 'analysis' capability`);
        this.addResult('Capability Querying', true, 'Capability-based querying working correctly');
      } else {
        this.addResult('Capability Querying', false, 'Capability queries returned unexpected results');
      }
      
    } catch (error) {
      this.addResult('Capability Querying', false, error.message);
    }
  }

  async testHealthMonitoring() {
    console.log('🔍 Testing: Health Monitoring System');
    
    try {
      if (!this.registry) throw new Error('Registry not initialized');
      
      // Record some agent activity
      this.registry.recordExecution('test-agent-1', 'test-operation', 100, true);
      this.registry.recordExecution('test-agent-2', 'analysis-operation', 250, true);
      
      // Perform health check
      const healthCheck = await this.registry.performHealthCheck();
      
      const healthMonitoringSuccess = healthCheck.totalAgents >= 2 &&
                                     healthCheck.results.length >= 2 &&
                                     healthCheck.timestamp > 0;
      
      if (healthMonitoringSuccess) {
        console.log(`  💓 Health check completed for ${healthCheck.totalAgents} agents`);
        console.log(`  ✅ Healthy agents: ${healthCheck.healthyAgents}`);
        console.log(`  ⚠️ Unhealthy agents: ${healthCheck.unhealthyAgents}`);
        this.addResult('Health Monitoring', true, 'Health monitoring system functioning correctly');
      } else {
        this.addResult('Health Monitoring', false, 'Health monitoring system not working properly');
      }
      
    } catch (error) {
      this.addResult('Health Monitoring', false, error.message);
    }
  }

  async testPerformanceTracking() {
    console.log('🔍 Testing: Performance Tracking');
    
    try {
      if (!this.registry) throw new Error('Registry not initialized');
      
      // Record multiple executions for performance tracking
      for (let i = 0; i < 5; i++) {
        this.registry.recordExecution('test-agent-1', `operation-${i}`, 100 + i * 50, i % 4 !== 3); // 75% success rate
      }
      
      const agent1 = this.registry.getAgent('test-agent-1');
      const performanceTracked = agent1.executionHistory && 
                                agent1.executionHistory.length >= 5 &&
                                agent1.executionCount >= 5;
      
      if (performanceTracked) {
        console.log(`  📈 Agent tracked ${agent1.executionCount} executions`);
        console.log(`  📊 Execution history contains ${agent1.executionHistory.length} entries`);
        this.addResult('Performance Tracking', true, 'Performance tracking working correctly');
      } else {
        this.addResult('Performance Tracking', false, 'Performance tracking not recording properly');
      }
      
    } catch (error) {
      this.addResult('Performance Tracking', false, error.message);
    }
  }

  async testRegistryStatistics() {
    console.log('🔍 Testing: Registry Statistics');
    
    try {
      if (!this.registry) throw new Error('Registry not initialized');
      
      const stats = this.registry.getStatistics();
      
      const statsValid = stats.totalAgents >= 2 &&
                        stats.agentsByType.has('test') &&
                        stats.totalCapabilities >= 4 &&
                        stats.topPerformingAgents.length >= 1;
      
      if (statsValid) {
        console.log(`  📊 Total agents: ${stats.totalAgents}`);
        console.log(`  📈 Total capabilities: ${stats.totalCapabilities}`);
        console.log(`  🏆 Top performing agent: ${stats.topPerformingAgents[0]?.name}`);
        this.addResult('Registry Statistics', true, 'Registry statistics generated correctly');
      } else {
        this.addResult('Registry Statistics', false, 'Registry statistics incomplete or invalid');
      }
      
    } catch (error) {
      this.addResult('Registry Statistics', false, error.message);
    }
  }

  async testCleanup() {
    console.log('🔍 Testing: Registry Cleanup');
    
    try {
      if (!this.registry) throw new Error('Registry not initialized');
      
      // Unregister agents
      const unregister1 = this.registry.unregisterAgent('test-agent-1');
      const unregister2 = this.registry.unregisterAgent('test-agent-2');
      
      // Verify cleanup
      const agent1After = this.registry.getAgent('test-agent-1');
      const agent2After = this.registry.getAgent('test-agent-2');
      
      if (unregister1 && unregister2 && !agent1After && !agent2After) {
        console.log(`  🗑️ Successfully unregistered test agents`);
        this.addResult('Registry Cleanup', true, 'Agent cleanup working correctly');
        
        // Clean up registry
        this.registry.destroy();
      } else {
        this.addResult('Registry Cleanup', false, 'Agent cleanup failed');
      }
      
    } catch (error) {
      this.addResult('Registry Cleanup', false, error.message);
    }
  }

  addResult(testName, passed, details) {
    this.testResults.push({ testName, passed, details });
    const status = passed ? '✅ PASSED' : '❌ FAILED';
    console.log(`${status} - ${testName}: ${details}`);
  }

  printResults() {
    console.log('\n📊 Agent Registry System Test Results');
    console.log('══════════════════════════════════════════════════════════');
    
    const passed = this.testResults.filter(r => r.passed).length;
    const total = this.testResults.length;
    const passRate = total > 0 ? (passed / total * 100).toFixed(1) : 0;
    
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${total - passed}`);
    console.log(`Pass Rate: ${passRate}%`);
    
    if (passRate >= 85) {
      console.log('\n🎯 Phase 3B Assessment:');
      console.log('✅ EXCELLENT - Advanced Agent Registry System is fully functional');
      console.log('   Registration, discovery, health monitoring, and performance tracking all working');
      console.log('   Ready to proceed to Phase 3C');
    } else if (passRate >= 70) {
      console.log('\n🎯 Phase 3B Assessment:');
      console.log('⚠️ GOOD - Agent Registry mostly functional, minor issues to address');
    } else {
      console.log('\n🎯 Phase 3B Assessment:');
      console.log('❌ NEEDS WORK - Significant registry system issues need resolution');
    }
    
    console.log('══════════════════════════════════════════════════════════');
  }
}

// Run tests
const test = new AgentRegistryTest();
test.runAllTests();