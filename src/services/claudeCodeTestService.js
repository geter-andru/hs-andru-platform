/**
 * Claude Code Test Service
 * Provides testing utilities for Claude Code Task tool integration
 */

import claudeCodeTaskService, { Task } from './claudeCodeIntegration.js';
import customerValueOrchestrator from '../agents/CustomerValueOrchestrator/CustomerValueOrchestrator.js';
import dashboardOptimizer from '../agents/CustomerValueOrchestrator/sub-agents/DashboardOptimizer.js';

class ClaudeCodeTestService {
  constructor() {
    this.testResults = [];
    this.isRunning = false;
  }

  // Test basic Claude Code Task tool connection
  async testBasicConnection() {
    console.log('🔍 Testing basic Claude Code Task tool connection...');
    
    try {
      const result = await claudeCodeTaskService.testClaudeCodeConnection();
      
      this.testResults.push({
        test: 'basicConnection',
        timestamp: Date.now(),
        success: result.success,
        mode: result.mode,
        result: result.result
      });
      
      return result;
    } catch (error) {
      console.error('❌ Basic connection test failed:', error);
      
      this.testResults.push({
        test: 'basicConnection',
        timestamp: Date.now(),
        success: false,
        error: error.message
      });
      
      return { success: false, error: error.message };
    }
  }

  // Test Customer Value Orchestrator with real agents
  async testCustomerValueOrchestrator() {
    console.log('🤖 Testing Customer Value Orchestrator with real agent spawning...');
    
    try {
      // Activate the orchestrator
      await customerValueOrchestrator.activate();
      
      // Simulate a critical friction point to trigger agent spawning
      const testContext = {
        priority: 'critical',
        issue: 'Test gaming terminology detection for Series A credibility',
        context: {
          testMode: true,
          timestamp: new Date().toISOString(),
          purpose: 'Claude Code Task tool integration test'
        }
      };
      
      // Spawn a test agent
      const agentResult = await customerValueOrchestrator.spawnSubAgent(
        'dashboardOptimizer', 
        testContext
      );
      
      console.log('✅ Customer Value Orchestrator test completed:', agentResult);
      
      this.testResults.push({
        test: 'customerValueOrchestrator',
        timestamp: Date.now(),
        success: true,
        agentResult,
        orchDiagnostics: customerValueOrchestrator.getDiagnostics()
      });
      
      // Deactivate orchestrator
      customerValueOrchestrator.deactivate();
      
      return { success: true, agentResult };
      
    } catch (error) {
      console.error('❌ Customer Value Orchestrator test failed:', error);
      
      this.testResults.push({
        test: 'customerValueOrchestrator',
        timestamp: Date.now(),
        success: false,
        error: error.message
      });
      
      return { success: false, error: error.message };
    }
  }

  // Test Dashboard Optimizer directly
  async testDashboardOptimizer() {
    console.log('🎯 Testing Dashboard Optimizer with real Claude Code Task integration...');
    
    try {
      const testContext = {
        criticalAlert: 'Gaming terminology detected in dashboard components',
        professionalCredibility: 'at_risk',
        seriesAFounder: true,
        executiveDemo: 'unsafe',
        testMode: true
      };
      
      // Test using the real Claude Code Task integration method
      const result = await dashboardOptimizer.spawnRealProfessionalCredibilityAgent(testContext);
      
      console.log('✅ Dashboard Optimizer test completed:', result);
      
      this.testResults.push({
        test: 'dashboardOptimizer',
        timestamp: Date.now(),
        success: true,
        result,
        credibilityAssessment: dashboardOptimizer.assessProfessionalCredibility()
      });
      
      return { success: true, result };
      
    } catch (error) {
      console.error('❌ Dashboard Optimizer test failed:', error);
      
      this.testResults.push({
        test: 'dashboardOptimizer',
        timestamp: Date.now(),
        success: false,
        error: error.message
      });
      
      return { success: false, error: error.message };
    }
  }

  // Run comprehensive integration test
  async runComprehensiveTest() {
    console.log('🚀 Running comprehensive Claude Code Task tool integration test...');
    
    this.isRunning = true;
    const testResults = {
      startTime: Date.now(),
      tests: {},
      summary: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        realAgentTests: 0,
        simulationFallbacks: 0
      }
    };
    
    try {
      // Test 1: Basic connection
      console.log('\n--- Test 1: Basic Connection ---');
      testResults.tests.basicConnection = await this.testBasicConnection();
      testResults.summary.totalTests++;
      if (testResults.tests.basicConnection.success) testResults.summary.passedTests++;
      else testResults.summary.failedTests++;
      
      // Test 2: Customer Value Orchestrator
      console.log('\n--- Test 2: Customer Value Orchestrator ---');
      testResults.tests.orchestrator = await this.testCustomerValueOrchestrator();
      testResults.summary.totalTests++;
      if (testResults.tests.orchestrator.success) testResults.summary.passedTests++;
      else testResults.summary.failedTests++;
      
      // Test 3: Dashboard Optimizer
      console.log('\n--- Test 3: Dashboard Optimizer ---');
      testResults.tests.dashboardOptimizer = await this.testDashboardOptimizer();
      testResults.summary.totalTests++;
      if (testResults.tests.dashboardOptimizer.success) testResults.summary.passedTests++;
      else testResults.summary.failedTests++;
      
      // Get integration diagnostics
      testResults.diagnostics = claudeCodeTaskService.getIntegrationDiagnostics();
      
      // Calculate final summary
      testResults.summary.realAgentTests = testResults.diagnostics.history.realTasks;
      testResults.summary.simulationFallbacks = testResults.diagnostics.history.simulatedTasks;
      
      testResults.endTime = Date.now();
      testResults.duration = testResults.endTime - testResults.startTime;
      
      console.log('\n🏁 Comprehensive test completed:');
      console.log(`✅ Passed: ${testResults.summary.passedTests}/${testResults.summary.totalTests}`);
      console.log(`🤖 Real Agent Tasks: ${testResults.summary.realAgentTests}`);
      console.log(`🎭 Simulation Fallbacks: ${testResults.summary.simulationFallbacks}`);
      console.log(`⏱️ Duration: ${testResults.duration}ms`);
      
      return testResults;
      
    } catch (error) {
      console.error('❌ Comprehensive test failed:', error);
      testResults.error = error.message;
      testResults.endTime = Date.now();
      return testResults;
    } finally {
      this.isRunning = false;
    }
  }

  // Get test history
  getTestHistory() {
    return this.testResults;
  }

  // Get integration status
  getIntegrationStatus() {
    return {
      claudeCodeService: claudeCodeTaskService.getIntegrationStatus(),
      claudeCodeDiagnostics: claudeCodeTaskService.getIntegrationDiagnostics(),
      testHistory: this.testResults.length,
      lastTest: this.testResults[this.testResults.length - 1] || null,
      isRunning: this.isRunning
    };
  }

  // Manual test trigger for development
  async quickTest() {
    console.log('⚡ Running quick Claude Code integration test...');
    
    try {
      const testPrompt = `
Quick Test Agent: Claude Code Integration Verification

TASK: Verify Claude Code Task tool is working by performing a simple analysis task.

CONTEXT: This is a quick integration test to confirm the Claude Code Task tool is accessible.

EXPECTED ACTIONS:
1. Confirm this message was received successfully
2. Report current timestamp
3. Indicate whether this is running in a real Claude Code environment
4. Return a simple success confirmation

This test was initiated at: ${new Date().toISOString()}
`;

      const result = await Task({
        description: 'Quick Claude Code integration test',
        prompt: testPrompt,
        subagent_type: 'general-purpose'
      });
      
      const testResult = {
        success: true,
        timestamp: Date.now(),
        result,
        mode: claudeCodeTaskService.isTaskToolAvailable() ? 'real' : 'simulation'
      };
      
      console.log('✅ Quick test completed:', testResult);
      return testResult;
      
    } catch (error) {
      console.error('❌ Quick test failed:', error);
      return {
        success: false,
        timestamp: Date.now(),
        error: error.message
      };
    }
  }
}

// Create singleton instance
const claudeCodeTestService = new ClaudeCodeTestService();

export default claudeCodeTestService;
export { ClaudeCodeTestService };