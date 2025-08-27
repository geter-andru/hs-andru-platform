/**
 * Event-Driven Architecture Performance Test
 * 
 * Tests zero-overhead operation and activation efficiency
 */

import EventDrivenAgentArchitecture from '../agents/EventDrivenAgentArchitecture.js';

class EventDrivenArchitectureTest {
  constructor() {
    this.architecture = new EventDrivenAgentArchitecture();
    this.testResults = {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      performanceMetrics: {}
    };
  }

  /**
   * Run comprehensive event-driven architecture tests
   */
  async runComprehensiveTest() {
    console.log('🧪 Event-Driven Architecture Test Suite Starting...');
    console.log('='.repeat(60));

    const tests = [
      { name: 'System Startup Event', test: () => this.testSystemStartup() },
      { name: 'User Session Events', test: () => this.testUserSessionEvents() },
      { name: 'Performance Event Triggers', test: () => this.testPerformanceEvents() },
      { name: 'Security Event Activation', test: () => this.testSecurityEvents() },
      { name: 'Zero Overhead Validation', test: () => this.testZeroOverhead() },
      { name: 'Memory Usage Optimization', test: () => this.testMemoryOptimization() },
      { name: 'Event Coordination', test: () => this.testEventCoordination() }
    ];

    for (const test of tests) {
      await this.runTest(test.name, test.test);
    }

    console.log('\\n📊 EVENT-DRIVEN ARCHITECTURE TEST RESULTS');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${this.testResults.totalTests}`);
    console.log(`Passed: ${this.testResults.passedTests}`);
    console.log(`Failed: ${this.testResults.failedTests}`);
    console.log(`Success Rate: ${((this.testResults.passedTests / this.testResults.totalTests) * 100).toFixed(1)}%`);
    
    // Performance metrics
    const metrics = this.architecture.getPerformanceMetrics();
    console.log('\\n🚀 PERFORMANCE METRICS');
    console.log(`Idle Time: ${metrics.idleTimePercentage.toFixed(1)}%`);
    console.log(`Memory Reduction: ${metrics.memoryFootprintReduction.toFixed(1)}%`);
    console.log(`Average Activation Time: ${metrics.averageActivationTime.toFixed(0)}ms`);
    console.log(`System Efficiency: ${metrics.systemEfficiency.toFixed(1)}%`);

    return this.testResults;
  }

  /**
   * Test system startup event handling
   */
  async testSystemStartup() {
    const result = await this.architecture.triggerEvent('system.startup', {
      timestamp: Date.now(),
      platform: 'hs-andru-platform'
    });

    if (result.activatedAgents === 3 && result.status === 'core_infrastructure_ready') {
      return { success: true, message: 'System startup activated 3 core agents' };
    }
    
    throw new Error(`Expected 3 agents, got ${result.activatedAgents}`);
  }

  /**
   * Test user session event handling
   */
  async testUserSessionEvents() {
    // Test session start
    const sessionStart = await this.architecture.triggerEvent('user.session_start', {
      customerId: 'CUST_TEST',
      sessionId: 'session_test_123'
    });

    // Test session end
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
    
    const sessionEnd = await this.architecture.triggerEvent('user.session_end', {
      customerId: 'CUST_TEST',
      sessionId: 'session_test_123'
    });

    if (sessionStart.status === 'behavioral_monitoring_active' && 
        sessionEnd.status === 'behavioral_monitoring_deactivated') {
      return { success: true, message: 'User session events handled correctly' };
    }
    
    throw new Error('Session event handling failed');
  }

  /**
   * Test performance event triggers
   */
  async testPerformanceEvents() {
    const result = await this.architecture.triggerEvent('performance.threshold_breach', {
      severity: 'high',
      metric: 'response_time',
      value: 5000,
      threshold: 3000
    });

    if (result.activatedAgents === 2 && result.status === 'performance_monitoring_active') {
      return { success: true, message: 'Performance events triggered monitoring agents' };
    }
    
    throw new Error('Performance event handling failed');
  }

  /**
   * Test security event activation
   */
  async testSecurityEvents() {
    const result = await this.architecture.triggerEvent('security.git_commit', {
      files: ['src/test.js', 'package.json'],
      author: 'test-user'
    });

    if (result.status === 'security_scanning_active') {
      return { success: true, message: 'Security events activated scanning' };
    }
    
    throw new Error('Security event handling failed');
  }

  /**
   * Test zero overhead when idle
   */
  async testZeroOverhead() {
    // Wait for all activations to complete (max deactivation time is 5min for CustomerValueOrchestrator)
    // But most agents should deactivate within 30 seconds
    console.log('⏳ Waiting 35 seconds for all agents to deactivate...');
    await new Promise(resolve => setTimeout(resolve, 35000));
    
    const metrics = this.architecture.getPerformanceMetrics();
    const activeAgents = metrics.currentlyActiveAgents;
    
    if (activeAgents === 0) {
      return { 
        success: true, 
        message: `Zero active agents during idle (${metrics.idleTimePercentage.toFixed(1)}% idle time)` 
      };
    }
    
    // List which agents are still active for debugging
    const activeAgentList = Array.from(this.architecture.agentActivations.values())
      .filter(a => a.status === 'active')
      .map(a => `${a.agentType}(${a.operationType})`)
      .join(', ');
    
    throw new Error(`Expected 0 active agents, found ${activeAgents}: ${activeAgentList}`);
  }

  /**
   * Test memory usage optimization
   */
  async testMemoryOptimization() {
    const metrics = this.architecture.getPerformanceMetrics();
    const memoryReduction = metrics.memoryFootprintReduction;
    
    if (memoryReduction > 50) { // Expect >50% memory reduction
      return { 
        success: true, 
        message: `Memory usage reduced by ${memoryReduction.toFixed(1)}%` 
      };
    }
    
    throw new Error(`Insufficient memory optimization: ${memoryReduction.toFixed(1)}%`);
  }

  /**
   * Test event coordination between agents
   */
  async testEventCoordination() {
    // Trigger multiple events simultaneously
    const events = await Promise.all([
      this.architecture.triggerEvent('agent.message_requested', {
        fromAgent: 'test-agent-1',
        toAgent: 'test-agent-2'
      }),
      this.architecture.triggerEvent('system.health_check_requested', {}),
      this.architecture.triggerEvent('user.tool_interaction', {
        tool: 'icp_analysis',
        action: 'generate'
      })
    ]);

    // Check that all events completed with valid results
    const allSuccessful = events.every(result => {
      // Accept various success statuses
      const validStatuses = [
        'communication_active',
        'behavioral_monitoring_active', 
        'reused_active'
      ];
      
      return result.activatedAgent || validStatuses.includes(result.status);
    });
    
    if (allSuccessful) {
      const metrics = this.architecture.getPerformanceMetrics();
      const lockEfficiency = metrics.lockHits > 0 
        ? `${metrics.lockHits} lock hits, ${metrics.lockMisses} misses` 
        : 'no lock reuse detected';
      
      return { 
        success: true, 
        message: `Event coordination handled 3 simultaneous events (${lockEfficiency})` 
      };
    }
    
    // Detailed failure analysis
    const failedEvents = events.filter(result => !result.activatedAgent && !result.status);
    throw new Error(`Event coordination failed: ${failedEvents.length} events had no valid result`);
  }

  /**
   * Run individual test with error handling
   */
  async runTest(testName, testFunction) {
    this.testResults.totalTests++;
    
    try {
      console.log(`\\n🧪 Running: ${testName}`);
      const result = await testFunction();
      
      if (result.success) {
        this.testResults.passedTests++;
        console.log(`✅ PASSED: ${result.message}`);
      } else {
        this.testResults.failedTests++;
        console.log(`❌ FAILED: ${result.message || 'Unknown failure'}`);
      }
      
    } catch (error) {
      this.testResults.failedTests++;
      console.log(`❌ ERROR: ${error.message}`);
    }
  }
}

// Export for use in testing
export default EventDrivenArchitectureTest;
export { EventDrivenArchitectureTest };

// Auto-run if executed directly
if (typeof window !== 'undefined' && window.location?.pathname?.includes('test')) {
  const test = new EventDrivenArchitectureTest();
  test.runComprehensiveTest().then(results => {
    console.log('🎯 Event-Driven Architecture Test Complete');
  });
}