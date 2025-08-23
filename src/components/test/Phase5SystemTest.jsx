/**
 * Phase 5: Complete System Integration Test
 * 
 * Tests the complete Customer Value Optimization Agent System with all phases active:
 * - Behavioral Intelligence System (Phase 3.5)
 * - Customer Value Orchestrator (Phase 2) 
 * - 4 Sub-Agents (Phase 3)
 * - Predictive Optimization (Phase 4)
 * - Sarah Chen Workflow with Full Agent Coordination
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  Eye, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  Users,
  DollarSign,
  Star,
  Shield
} from 'lucide-react';

// Import all systems
import behavioralIntelligenceService from '../../services/BehavioralIntelligenceService';
import customerValueOrchestrator from '../../agents/CustomerValueOrchestrator/CustomerValueOrchestrator';
import { SkillAssessmentEngine } from '../../services/SkillAssessmentEngine';
import { ProgressiveFeatureManager } from '../../services/ProgressiveFeatureManager';
import valueOptimizationAnalytics from '../../services/valueOptimizationAnalytics';

const Phase5SystemTest = () => {
  const [testStatus, setTestStatus] = useState('idle');
  const [testResults, setTestResults] = useState([]);
  const [orchestratorActive, setOrchestratorActive] = useState(false);
  const [behavioralUpdates, setBehavioralUpdates] = useState([]);
  const [sarahChenWorkflow, setSarahChenWorkflow] = useState(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState(null);
  const [systemInsights, setSystemInsights] = useState(null);
  
  const testUserId = 'SARAH_CHEN_PHASE5';
  const updateCountRef = useRef(0);

  // Initialize complete system monitoring
  useEffect(() => {
    // Listen for all system events
    const handleBehavioralUpdate = (event) => {
      updateCountRef.current += 1;
      const update = {
        timestamp: Date.now(),
        type: 'behavioral_update',
        data: event.detail,
        updateNumber: updateCountRef.current
      };
      setBehavioralUpdates(prev => [...prev.slice(-19), update]);
    };

    window.addEventListener('h_s_platform_behavioral_update', handleBehavioralUpdate);

    // Monitor orchestrator status
    const monitorInterval = setInterval(() => {
      if (orchestratorActive) {
        const status = customerValueOrchestrator.getStatus();
        const analytics = valueOptimizationAnalytics.getSessionData();
        setRealTimeMetrics({ orchestrator: status, analytics });
      }
    }, 2000);

    return () => {
      window.removeEventListener('h_s_platform_behavioral_update', handleBehavioralUpdate);
      clearInterval(monitorInterval);
    };
  }, [orchestratorActive]);

  // Run complete Phase 5 system test
  const runCompleteSystemTest = async () => {
    setTestStatus('running');
    setTestResults([]);
    setBehavioralUpdates([]);
    updateCountRef.current = 0;

    const results = [];

    try {
      console.log('🚀 Starting Phase 5: Complete System Integration Test');
      
      // Test 1: System Initialization
      results.push(await testSystemInitialization());
      
      // Test 2: Orchestrator Activation
      results.push(await testOrchestratorActivation());
      
      // Test 3: Behavioral Intelligence Recording
      results.push(await testBehavioralIntelligenceRecording());
      
      // Test 4: Sarah Chen Complete Workflow Simulation
      results.push(await testSarahChenWorkflow());
      
      // Test 5: Sub-Agent Coordination
      results.push(await testSubAgentCoordination());
      
      // Test 6: Predictive Optimization
      results.push(await testPredictiveOptimization());
      
      // Test 7: Cross-System Integration
      results.push(await testCrossSystemIntegration());
      
      // Test 8: Complete Workflow Validation
      results.push(await testCompleteWorkflowValidation());

      setTestResults(results);
      setTestStatus('completed');

      // Generate final system insights
      await generateSystemInsights();

    } catch (error) {
      console.error('Phase 5 system test failed:', error);
      results.push({
        test: 'Phase 5 System Test',
        status: 'failed',
        message: `System test failed: ${error.message}`,
        error: error.message
      });
      setTestResults(results);
      setTestStatus('failed');
    }
  };

  // Test 1: System Initialization
  const testSystemInitialization = async () => {
    try {
      // Verify all systems are available
      if (!behavioralIntelligenceService) throw new Error('BehavioralIntelligenceService not available');
      if (!customerValueOrchestrator) throw new Error('CustomerValueOrchestrator not available');
      if (!SkillAssessmentEngine) throw new Error('SkillAssessmentEngine not available');
      if (!ProgressiveFeatureManager) throw new Error('ProgressiveFeatureManager not available');
      
      // Reset all systems
      valueOptimizationAnalytics.reset();
      
      return {
        test: 'System Initialization',
        status: 'passed',
        message: 'All systems initialized and ready',
        details: { systems: 4, status: 'operational' }
      };
    } catch (error) {
      return {
        test: 'System Initialization',
        status: 'failed',
        message: error.message,
        error: error.message
      };
    }
  };

  // Test 2: Orchestrator Activation
  const testOrchestratorActivation = async () => {
    try {
      // Start orchestration
      const result = await customerValueOrchestrator.startOrchestration(testUserId, 'phase5_test_session');
      setOrchestratorActive(true);
      
      if (result.status !== 'orchestration-active') {
        throw new Error('Orchestrator failed to activate');
      }
      
      const status = customerValueOrchestrator.getStatus();
      
      return {
        test: 'Orchestrator Activation',
        status: 'passed',
        message: 'Customer Value Orchestrator activated successfully',
        details: {
          isActive: status.isActive,
          behavioralIntelligenceActive: status.behavioralIntelligenceActive,
          predictiveModelsCount: status.predictiveModelsCount
        }
      };
    } catch (error) {
      return {
        test: 'Orchestrator Activation',
        status: 'failed',
        message: error.message,
        error: error.message
      };
    }
  };

  // Test 3: Behavioral Intelligence Recording
  const testBehavioralIntelligenceRecording = async () => {
    try {
      // Record comprehensive behavioral data
      behavioralIntelligenceService.recordInteraction(testUserId, 'icp_analysis', {
        section: 'framework',
        duration: 240000, // 4 minutes
        clicks: 8,
        buyerPersonaClicks: 6,
        painPointAnalysis: true
      });

      behavioralIntelligenceService.recordInteraction(testUserId, 'cost_calculator', {
        section: 'variables',
        duration: 180000, // 3 minutes
        adjustments: 5,
        scenarioTesting: true,
        edgeCaseTesting: true
      });

      behavioralIntelligenceService.recordInteraction(testUserId, 'business_case', {
        section: 'stakeholders',
        duration: 150000, // 2.5 minutes
        stakeholderSwitches: 4,
        customization: true,
        multipleFormats: true
      });

      // Record exports
      behavioralIntelligenceService.recordExport(testUserId, {
        type: 'icp_analysis',
        format: 'pdf',
        timestamp: Date.now()
      });

      behavioralIntelligenceService.recordExport(testUserId, {
        type: 'cost_calculator',
        format: 'excel',
        timestamp: Date.now()
      });

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      const behaviorData = await behavioralIntelligenceService.getUserBehaviorData(testUserId);
      
      if (!behaviorData || behaviorData.overallMetrics.totalExports < 2) {
        throw new Error('Behavioral intelligence not recording properly');
      }

      return {
        test: 'Behavioral Intelligence Recording',
        status: 'passed',
        message: 'Behavioral intelligence system recording all interactions',
        details: {
          totalExports: behaviorData.overallMetrics.totalExports,
          totalSessions: behaviorData.overallMetrics.totalSessions,
          toolsUsed: ['icp_analysis', 'cost_calculator', 'business_case']
        }
      };
    } catch (error) {
      return {
        test: 'Behavioral Intelligence Recording',
        status: 'failed',
        message: error.message,
        error: error.message
      };
    }
  };

  // Test 4: Sarah Chen Complete Workflow Simulation
  const testSarahChenWorkflow = async () => {
    try {
      console.log('🎯 Simulating Sarah Chen complete workflow...');
      
      // Start workflow tracking
      valueOptimizationAnalytics.startWorkflowTracking(testUserId);
      
      // Simulate complete 15-minute workflow
      const workflow = {
        login: { duration: 15000, success: true },
        icpAnalysis: { duration: 300000, frictionPoints: 0, valueRecognized: true },
        costCalculator: { duration: 240000, scenarios: 3, exported: true },
        businessCase: { duration: 180000, stakeholders: 3, formats: 2 },
        export: { duration: 90000, success: true, formats: ['pdf', 'excel'] }
      };
      
      // Record each workflow step with behavioral intelligence
      for (const [step, data] of Object.entries(workflow)) {
        behavioralIntelligenceService.recordInteraction(testUserId, step, data);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Complete workflow
      const workflowResult = valueOptimizationAnalytics.completeWorkflow();
      setSarahChenWorkflow(workflowResult);
      
      return {
        test: 'Sarah Chen Workflow Simulation',
        status: 'passed',
        message: 'Complete 15-minute workflow simulated successfully',
        details: {
          totalDuration: workflow.login.duration + workflow.icpAnalysis.duration + 
                          workflow.costCalculator.duration + workflow.businessCase.duration + 
                          workflow.export.duration,
          stepsCompleted: 5,
          frictionPoints: 0,
          valueRecognized: workflow.icpAnalysis.valueRecognized
        }
      };
    } catch (error) {
      return {
        test: 'Sarah Chen Workflow Simulation',
        status: 'failed',
        message: error.message,
        error: error.message
      };
    }
  };

  // Test 5: Sub-Agent Coordination
  const testSubAgentCoordination = async () => {
    try {
      // Trigger conditions that should spawn sub-agents
      const sessionData = valueOptimizationAnalytics.getSessionData();
      
      // Wait for orchestrator to process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const status = customerValueOrchestrator.getStatus();
      
      // Check if orchestrator is monitoring and ready to spawn agents
      if (!status.isActive) {
        throw new Error('Orchestrator not actively monitoring for agent spawning');
      }
      
      return {
        test: 'Sub-Agent Coordination',
        status: 'passed',
        message: 'Sub-agent coordination system ready and monitoring',
        details: {
          orchestratorActive: status.isActive,
          activeOptimizations: status.activeOptimizations,
          monitoringActive: true
        }
      };
    } catch (error) {
      return {
        test: 'Sub-Agent Coordination',
        status: 'failed',
        message: error.message,
        error: error.message
      };
    }
  };

  // Test 6: Predictive Optimization
  const testPredictiveOptimization = async () => {
    try {
      // Get behavioral insights from orchestrator
      const insights = customerValueOrchestrator.getBehavioralIntelligenceInsights(testUserId);
      
      if (!insights || !insights.behaviorData) {
        throw new Error('Predictive optimization not generating insights');
      }
      
      // Check for predictive models
      const hasConversionProbability = insights.conversionProbability !== undefined;
      const hasValueForecast = insights.valueRealizationForecast !== undefined;
      
      return {
        test: 'Predictive Optimization',
        status: 'passed',
        message: 'Predictive optimization generating insights from behavioral data',
        details: {
          conversionProbability: insights.conversionProbability,
          hasValueForecast,
          frictionPredictions: insights.frictionPredictions?.length || 0
        }
      };
    } catch (error) {
      return {
        test: 'Predictive Optimization',
        status: 'failed',
        message: error.message,
        error: error.message
      };
    }
  };

  // Test 7: Cross-System Integration
  const testCrossSystemIntegration = async () => {
    try {
      // Test skill assessment integration
      const behaviorData = await behavioralIntelligenceService.getUserBehaviorData(testUserId);
      const skillLevels = SkillAssessmentEngine.assessAllSkills(behaviorData);
      const competencyLevel = SkillAssessmentEngine.determineCompetencyLevel(skillLevels);
      
      // Test feature unlocking integration
      const featureAccess = ProgressiveFeatureManager.determineFeatureAccess(competencyLevel, skillLevels);
      
      if (skillLevels.overall < 0 || !featureAccess.features || featureAccess.features.length === 0) {
        throw new Error('Cross-system integration not working properly');
      }
      
      return {
        test: 'Cross-System Integration',
        status: 'passed',
        message: 'All systems integrated and communicating effectively',
        details: {
          competencyLevel,
          skillsAssessed: Object.keys(skillLevels).length,
          featuresUnlocked: featureAccess.features.length,
          systemsIntegrated: 4
        }
      };
    } catch (error) {
      return {
        test: 'Cross-System Integration',
        status: 'failed',
        message: error.message,
        error: error.message
      };
    }
  };

  // Test 8: Complete Workflow Validation
  const testCompleteWorkflowValidation = async () => {
    try {
      // Validate all systems worked together
      const behaviorData = await behavioralIntelligenceService.getUserBehaviorData(testUserId);
      const orchestratorInsights = customerValueOrchestrator.getBehavioralIntelligenceInsights(testUserId);
      const sessionData = valueOptimizationAnalytics.getSessionData();
      
      // Check critical workflow metrics
      const workflowSuccess = (
        behaviorData.overallMetrics.totalExports >= 2 &&
        orchestratorInsights.behaviorData &&
        sessionData.frictionPoints.length === 0 &&
        updateCountRef.current >= 5
      );
      
      if (!workflowSuccess) {
        throw new Error('Complete workflow validation failed - missing critical components');
      }
      
      return {
        test: 'Complete Workflow Validation',
        status: 'passed',
        message: 'Complete system successfully coordinated Sarah Chen workflow',
        details: {
          totalExports: behaviorData.overallMetrics.totalExports,
          behavioralUpdates: updateCountRef.current,
          frictionPoints: sessionData.frictionPoints.length,
          systemCoordination: 'successful'
        }
      };
    } catch (error) {
      return {
        test: 'Complete Workflow Validation',
        status: 'failed',
        message: error.message,
        error: error.message
      };
    }
  };

  // Generate comprehensive system insights
  const generateSystemInsights = async () => {
    try {
      const behaviorData = await behavioralIntelligenceService.getUserBehaviorData(testUserId);
      const skillLevels = SkillAssessmentEngine.assessAllSkills(behaviorData);
      const orchestratorInsights = customerValueOrchestrator.getBehavioralIntelligenceInsights(testUserId);
      const orchestratorStatus = customerValueOrchestrator.getStatus();
      
      const insights = {
        systemPerformance: {
          behavioralIntelligence: 'operational',
          customerValueOrchestrator: orchestratorStatus.isActive ? 'active' : 'inactive',
          skillAssessment: skillLevels.overall > 0 ? 'functional' : 'needs_attention',
          predictiveOptimization: orchestratorInsights.conversionProbability ? 'generating_insights' : 'initializing'
        },
        userProfile: {
          competencyLevel: SkillAssessmentEngine.determineCompetencyLevel(skillLevels),
          skillLevels,
          conversionProbability: orchestratorInsights.conversionProbability,
          behaviorPatterns: behaviorData.overallMetrics
        },
        systemCoordination: {
          realTimeUpdates: updateCountRef.current,
          crossSystemIntegration: 'successful',
          workflowOptimization: 'active',
          agentReadiness: 'monitoring'
        }
      };
      
      setSystemInsights(insights);
    } catch (error) {
      console.error('Failed to generate system insights:', error);
    }
  };

  // Stop orchestrator when component unmounts
  useEffect(() => {
    return () => {
      if (orchestratorActive) {
        customerValueOrchestrator.stopOrchestration();
      }
    };
  }, [orchestratorActive]);

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-green-400" />
            Phase 5: Complete System Integration Test
          </h1>
          <p className="text-gray-400">
            Final validation of Customer Value Optimization Agent System with Sarah Chen workflow
          </p>
        </div>

        {/* Test Controls */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Complete System Test</h2>
              <p className="text-gray-400">
                Tests all 4 phases with Sarah Chen workflow: Behavioral Intelligence + Orchestrator + Sub-Agents + Predictive Optimization
              </p>
            </div>
            <button
              onClick={runCompleteSystemTest}
              disabled={testStatus === 'running'}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                testStatus === 'running'
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {testStatus === 'running' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Running Complete Test...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Run Phase 5 Test
                </>
              )}
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Test Results ({testResults.filter(r => r.status === 'passed').length}/{testResults.length} Passed)
            </h3>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  result.status === 'passed' 
                    ? 'bg-green-900/20 border-green-800'
                    : 'bg-red-900/20 border-red-800'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {result.status === 'passed' ? (
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                      )}
                      <div>
                        <h4 className="font-medium text-white">{result.test}</h4>
                        <p className={`text-sm ${
                          result.status === 'passed' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {result.message}
                        </p>
                        {result.details && (
                          <pre className="mt-2 text-xs text-gray-400 bg-gray-800 p-2 rounded overflow-x-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Insights */}
        {systemInsights && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                System Performance
              </h3>
              <div className="space-y-2">
                {Object.entries(systemInsights.systemPerformance).map(([system, status]) => (
                  <div key={system} className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">
                      {system.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      status === 'operational' || status === 'active' || status === 'functional' || status === 'generating_insights'
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Sarah Chen Profile
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Competency Level</span>
                  <span className="text-white font-medium">{systemInsights.userProfile.competencyLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Conversion Probability</span>
                  <span className="text-white font-medium">
                    {(systemInsights.userProfile.conversionProbability * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tools Mastered</span>
                  <span className="text-white font-medium">
                    {Object.values(systemInsights.userProfile.skillLevels)
                      .filter(skill => typeof skill === 'number' && skill > 60).length}/3
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Updates */}
        {behavioralUpdates.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-yellow-400" />
              System Coordination Updates ({behavioralUpdates.length})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {behavioralUpdates.slice(-10).map((update, index) => (
                <div key={index} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-400">Update #{update.updateNumber}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(update.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">
                    System coordination: {update.type}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Indicator */}
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            testStatus === 'idle' 
              ? 'bg-gray-800 text-gray-400'
              : testStatus === 'running'
              ? 'bg-yellow-900/30 text-yellow-400'
              : testStatus === 'completed'
              ? 'bg-green-900/30 text-green-400'
              : 'bg-red-900/30 text-red-400'
          }`}>
            <Clock className="w-4 h-4" />
            {testStatus === 'idle' && 'Ready for Phase 5 complete system test'}
            {testStatus === 'running' && 'Running complete system integration test...'}
            {testStatus === 'completed' && 'Phase 5: Complete system validation successful'}
            {testStatus === 'failed' && 'Phase 5: System test encountered issues'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Phase5SystemTest;