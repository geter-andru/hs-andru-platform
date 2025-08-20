/**
 * Agent Orchestration Service
 * Integrates the Customer Value Orchestrator with the platform analytics
 */

import customerValueOrchestrator from '../agents/CustomerValueOrchestrator';
import valueOptimizationAnalytics from './valueOptimizationAnalytics';

class AgentOrchestrationService {
  constructor() {
    this.isIntegrated = false;
    this.originalAnalyticsMethods = {};
  }

  // Integrate orchestrator with analytics system
  integrateWithAnalytics() {
    if (this.isIntegrated) {
      console.warn('Agent orchestration already integrated');
      return;
    }

    console.log('🔗 Integrating Customer Value Orchestrator with analytics system');

    // Store original methods
    this.originalAnalyticsMethods = {
      startWorkflowTracking: valueOptimizationAnalytics.startWorkflowTracking.bind(valueOptimizationAnalytics),
      recordFrictionPoint: valueOptimizationAnalytics.recordFrictionPoint.bind(valueOptimizationAnalytics),
      completeWorkflow: valueOptimizationAnalytics.completeWorkflow.bind(valueOptimizationAnalytics)
    };

    // Override analytics methods to trigger orchestration
    valueOptimizationAnalytics.startWorkflowTracking = (customerId) => {
      const sessionId = this.originalAnalyticsMethods.startWorkflowTracking(customerId);
      
      // Start orchestration when workflow tracking begins
      customerValueOrchestrator.startOrchestration(customerId, sessionId);
      
      return sessionId;
    };

    valueOptimizationAnalytics.recordFrictionPoint = (description, severity, metadata) => {
      this.originalAnalyticsMethods.recordFrictionPoint(description, severity, metadata);
      
      // Trigger immediate orchestration analysis for critical friction
      if (severity === 'critical') {
        setTimeout(() => {
          customerValueOrchestrator.analyzeCurrentPerformance();
        }, 100);
      }
    };

    valueOptimizationAnalytics.completeWorkflow = () => {
      const workflowReport = this.originalAnalyticsMethods.completeWorkflow();
      
      // Stop orchestration and get final report
      const orchestrationReport = customerValueOrchestrator.stopOrchestration();
      
      // Combine reports
      return {
        ...workflowReport,
        orchestration: orchestrationReport
      };
    };

    this.isIntegrated = true;
    console.log('✅ Agent orchestration integration complete');
  }

  // Remove integration (restore original methods)
  removeIntegration() {
    if (!this.isIntegrated) {
      console.warn('Agent orchestration not integrated');
      return;
    }

    console.log('🔌 Removing agent orchestration integration');

    // Restore original methods
    Object.keys(this.originalAnalyticsMethods).forEach(method => {
      valueOptimizationAnalytics[method] = this.originalAnalyticsMethods[method];
    });

    // Stop any active orchestration
    if (customerValueOrchestrator.getStatus().isActive) {
      customerValueOrchestrator.stopOrchestration();
    }

    this.isIntegrated = false;
    console.log('✅ Agent orchestration integration removed');
  }

  // Manually trigger orchestration analysis
  triggerAnalysis() {
    if (!this.isIntegrated) {
      console.warn('Cannot trigger analysis - orchestration not integrated');
      return null;
    }

    return customerValueOrchestrator.analyzeCurrentPerformance();
  }

  // Get orchestration status
  getOrchestrationStatus() {
    return {
      integrated: this.isIntegrated,
      orchestrator: customerValueOrchestrator.getStatus()
    };
  }

  // Manually spawn a sub-agent for testing
  async spawnTestAgent(agentType, context = {}) {
    if (!this.isIntegrated) {
      console.warn('Cannot spawn agent - orchestration not integrated');
      return null;
    }

    return await customerValueOrchestrator.spawnSubAgent(agentType, {
      priority: 'test',
      issue: 'Manual test agent spawn',
      ...context
    });
  }

  // Get sub-agent status
  getSubAgentStatus() {
    const status = customerValueOrchestrator.getStatus();
    return {
      activeCount: status.activeSubAgents,
      optimizationCount: status.activeOptimizations,
      agents: status.subAgents
    };
  }

  // Force professional credibility check
  async forceProfessionalCredibilityCheck() {
    console.log('🔍 Forcing professional credibility check');
    
    // Simulate gaming terminology detection
    valueOptimizationAnalytics.scanForGamingTerminology(
      'You have earned points and achieved level 2 badge!',
      'manual-credibility-test'
    );
    
    // Trigger orchestration response
    await this.triggerAnalysis();
    
    return this.getSubAgentStatus();
  }

  // Simulate workflow optimization scenario
  async simulateOptimizationScenario(scenario = 'slow-value-recognition') {
    if (!this.isIntegrated) {
      console.warn('Cannot simulate - orchestration not integrated');
      return null;
    }

    console.log(`🎭 Simulating optimization scenario: ${scenario}`);

    switch (scenario) {
      case 'slow-value-recognition':
        // Simulate slow value recognition
        setTimeout(() => {
          valueOptimizationAnalytics.recordFrictionPoint(
            'Value recognition exceeds 30-second target',
            'high',
            { timeElapsed: 45000, target: 30000 }
          );
        }, 1000);
        break;

      case 'export-failure':
        // Simulate export failures
        valueOptimizationAnalytics.recordExportAttempt('ICP', 'HubSpot', false, { error: 'Connection timeout' });
        valueOptimizationAnalytics.recordExportAttempt('Cost Calculator', 'PDF', false, { error: 'Generation failed' });
        break;

      case 'gaming-terminology':
        // Simulate gaming terminology detection
        valueOptimizationAnalytics.scanForGamingTerminology(
          'Complete challenges to unlock achievements and level up your score!',
          'dashboard-content'
        );
        break;

      case 'workflow-delay':
        // Simulate slow workflow steps
        valueOptimizationAnalytics.recordFrictionPoint(
          'ICP analysis step exceeds 5-minute target',
          'medium',
          { stepDuration: 420000, target: 300000 }
        );
        break;

      default:
        console.warn('Unknown scenario:', scenario);
        return null;
    }

    // Allow time for orchestration to respond
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return this.getSubAgentStatus();
  }

  // Get comprehensive system status
  getSystemStatus() {
    return {
      orchestration: this.getOrchestrationStatus(),
      analytics: {
        isTracking: valueOptimizationAnalytics.isTracking,
        sessionData: valueOptimizationAnalytics.getSessionData()
      },
      subAgents: this.getSubAgentStatus(),
      integration: {
        active: this.isIntegrated,
        methodsOverridden: Object.keys(this.originalAnalyticsMethods).length
      }
    };
  }
}

// Create singleton instance
const agentOrchestrationService = new AgentOrchestrationService();

export default agentOrchestrationService;

// Export for testing
export { AgentOrchestrationService };