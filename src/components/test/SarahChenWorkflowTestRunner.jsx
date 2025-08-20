import React, { useState, useEffect } from 'react';
import { PrimaryButton, SecondaryButton } from '../ui/ButtonComponents';
import sarahChenWorkflowTest from '../../services/sarahChenWorkflowTest';
import valueOptimizationAnalytics from '../../services/valueOptimizationAnalytics';
import agentOrchestrationService from '../../services/agentOrchestrationService';

const SarahChenWorkflowTestRunner = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [currentStep, setCurrentStep] = useState('');
  const [sessionData, setSessionData] = useState(null);
  const [orchestrationEnabled, setOrchestrationEnabled] = useState(false);
  const [orchestrationStatus, setOrchestrationStatus] = useState(null);
  const [subAgentStatus, setSubAgentStatus] = useState(null);

  useEffect(() => {
    // Update session data every second while test is running
    let interval;
    if (isRunning || orchestrationEnabled) {
      interval = setInterval(() => {
        setSessionData(valueOptimizationAnalytics.getSessionData());
        setOrchestrationStatus(agentOrchestrationService.getOrchestrationStatus());
        setSubAgentStatus(agentOrchestrationService.getSubAgentStatus());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, orchestrationEnabled]);

  const runWorkflowTest = async () => {
    setIsRunning(true);
    setTestResults(null);
    setCurrentStep('Starting workflow test...');

    try {
      console.log('🎯 Starting Sarah Chen Baseline Workflow Test');
      
      // Add step tracking for UI updates
      const originalStartStep = valueOptimizationAnalytics.startStep.bind(valueOptimizationAnalytics);
      valueOptimizationAnalytics.startStep = (stepName, metadata) => {
        setCurrentStep(`Running: ${stepName}`);
        return originalStartStep(stepName, metadata);
      };

      const results = await sarahChenWorkflowTest.startWorkflowTest('CUST_4');
      setTestResults(results);
      setCurrentStep('Test completed');
      
    } catch (error) {
      console.error('Test failed:', error);
      setCurrentStep(`Test failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setTestResults(null);
    setSessionData(null);
    setCurrentStep('');
    valueOptimizationAnalytics.reset();
    
    if (orchestrationEnabled) {
      agentOrchestrationService.removeIntegration();
      setOrchestrationEnabled(false);
    }
    
    setOrchestrationStatus(null);
    setSubAgentStatus(null);
  };

  const toggleOrchestration = () => {
    if (orchestrationEnabled) {
      agentOrchestrationService.removeIntegration();
      setOrchestrationEnabled(false);
      setCurrentStep('Agent orchestration disabled');
    } else {
      agentOrchestrationService.integrateWithAnalytics();
      setOrchestrationEnabled(true);
      setCurrentStep('Agent orchestration enabled');
    }
  };

  const simulateScenario = async (scenario) => {
    setCurrentStep(`Simulating: ${scenario}`);
    const result = await agentOrchestrationService.simulateOptimizationScenario(scenario);
    console.log(`Scenario ${scenario} result:`, result);
    setCurrentStep(`Scenario completed: ${scenario}`);
  };

  const forceProfessionalCheck = async () => {
    setCurrentStep('Running professional credibility check...');
    const result = await agentOrchestrationService.forceProfessionalCredibilityCheck();
    console.log('Professional credibility check result:', result);
    setCurrentStep('Professional credibility check completed');
  };

  const formatTime = (ms) => {
    if (!ms) return 'N/A';
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatMinutes = (ms) => {
    if (!ms) return 'N/A';
    return `${(ms / 60000).toFixed(1)} min`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900 text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sarah Chen Workflow Test Runner</h1>
        <p className="text-gray-300">
          Test the complete 15-minute sales preparation workflow for Series A technical founders
        </p>
      </div>

      {/* Test Controls */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
        <div className="flex gap-4">
          <PrimaryButton
            onClick={runWorkflowTest}
            disabled={isRunning}
            className="px-6 py-2"
          >
            {isRunning ? 'Running Test...' : 'Start Workflow Test'}
          </PrimaryButton>
          
          <SecondaryButton
            onClick={clearResults}
            disabled={isRunning}
            className="px-6 py-2"
          >
            Clear Results
          </SecondaryButton>
        </div>
        
        {isRunning && (
          <div className="mt-4 p-4 bg-blue-900/30 rounded border border-blue-700">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-3"></div>
              <span className="text-blue-300">{currentStep}</span>
            </div>
          </div>
        )}
      </div>

      {/* Agent Orchestration Controls */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Customer Value Orchestrator (Master Agent)</h2>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <PrimaryButton
            onClick={toggleOrchestration}
            disabled={isRunning}
            className={`px-4 py-2 ${orchestrationEnabled ? 'bg-green-700' : 'bg-blue-700'}`}
          >
            {orchestrationEnabled ? '🤖 Orchestration Active' : '🚀 Enable Orchestration'}
          </PrimaryButton>
          
          {orchestrationEnabled && (
            <>
              <SecondaryButton
                onClick={() => simulateScenario('slow-value-recognition')}
                disabled={isRunning}
                className="px-4 py-2"
              >
                Test: Slow Value
              </SecondaryButton>
              
              <SecondaryButton
                onClick={() => simulateScenario('gaming-terminology')}
                disabled={isRunning}
                className="px-4 py-2"
              >
                Test: Gaming Terms
              </SecondaryButton>
              
              <SecondaryButton
                onClick={() => simulateScenario('export-failure')}
                disabled={isRunning}
                className="px-4 py-2"
              >
                Test: Export Failure
              </SecondaryButton>
              
              <SecondaryButton
                onClick={forceProfessionalCheck}
                disabled={isRunning}
                className="px-4 py-2"
              >
                Force Credibility Check
              </SecondaryButton>
            </>
          )}
        </div>

        {/* Orchestration Status */}
        {orchestrationStatus && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-3 rounded">
              <div className="text-sm text-gray-300">Orchestrator Status</div>
              <div className={`text-lg font-semibold ${orchestrationStatus.orchestrator.isActive ? 'text-green-400' : 'text-gray-400'}`}>
                {orchestrationStatus.orchestrator.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
            
            {subAgentStatus && (
              <>
                <div className="bg-gray-700 p-3 rounded">
                  <div className="text-sm text-gray-300">Active Sub-Agents</div>
                  <div className="text-lg font-semibold text-blue-400">
                    {subAgentStatus.activeCount}
                  </div>
                </div>
                
                <div className="bg-gray-700 p-3 rounded">
                  <div className="text-sm text-gray-300">Active Optimizations</div>
                  <div className="text-lg font-semibold text-purple-400">
                    {subAgentStatus.optimizationCount}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Sub-Agent Status */}
        {subAgentStatus && subAgentStatus.agents.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Active Sub-Agents</h3>
            <div className="space-y-2">
              {subAgentStatus.agents.map((agent, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                  <div>
                    <span className="font-medium capitalize">{agent.type.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-sm text-gray-400 ml-2">({agent.id.slice(-8)})</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    {formatTime(Date.now() - agent.spawnTime)} ago
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep && !isRunning && (
          <div className="mt-4 p-3 bg-gray-700 rounded">
            <div className="text-sm text-gray-300">Latest Action</div>
            <div className="text-gray-100">{currentStep}</div>
          </div>
        )}
      </div>

      {/* Live Session Data */}
      {sessionData && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Live Session Data</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-3 rounded">
              <div className="text-sm text-gray-300">Session Time</div>
              <div className="text-lg font-mono">
                {formatTime(Date.now() - sessionData.startTime)}
              </div>
            </div>
            
            <div className="bg-gray-700 p-3 rounded">
              <div className="text-sm text-gray-300">Steps Completed</div>
              <div className="text-lg font-mono">
                {sessionData.workflowSteps.length}
              </div>
            </div>
            
            <div className="bg-gray-700 p-3 rounded">
              <div className="text-sm text-gray-300">Friction Points</div>
              <div className="text-lg font-mono text-yellow-400">
                {sessionData.frictionPoints.length}
              </div>
            </div>
            
            <div className="bg-gray-700 p-3 rounded">
              <div className="text-sm text-gray-300">Credibility Score</div>
              <div className={`text-lg font-mono ${sessionData.professionalCredibilityScore >= 100 ? 'text-green-400' : 'text-red-400'}`}>
                {sessionData.professionalCredibilityScore}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Results */}
      {testResults && (
        <div className="space-y-6">
          {/* Overall Success */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Overall Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${testResults.overallSuccess.score >= 80 ? 'text-green-400' : testResults.overallSuccess.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {testResults.overallSuccess.score.toFixed(1)}%
                </div>
                <div className="text-gray-300">Overall Success</div>
              </div>
              
              <div className="text-center">
                <div className={`text-4xl font-bold ${testResults.targetAchieved ? 'text-green-400' : 'text-red-400'}`}>
                  {testResults.totalWorkflowTimeMinutes}
                </div>
                <div className="text-gray-300">Minutes (Target: 15)</div>
              </div>
              
              <div className="text-center">
                <div className={`text-4xl font-bold ${testResults.valueRecognitionSuccess ? 'text-green-400' : 'text-red-400'}`}>
                  {formatTime(testResults.valueRecognitionTime)}
                </div>
                <div className="text-gray-300">Value Recognition (Target: 30s)</div>
              </div>
            </div>
          </div>

          {/* Success Criteria */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Success Criteria</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(testResults.overallSuccess.criteria).map(([key, success]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className={`font-semibold ${success ? 'text-green-400' : 'text-red-400'}`}>
                    {success ? '✅ Pass' : '❌ Fail'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Workflow Steps Performance</h2>
            <div className="space-y-3">
              {testResults.steps.map((step, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <div>
                    <div className="font-medium capitalize">{step.name.replace(/-/g, ' ')}</div>
                    {step.frictionPoints > 0 && (
                      <div className="text-sm text-yellow-400">
                        {step.frictionPoints} friction point{step.frictionPoints !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-mono">{step.durationSeconds}s</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Performance */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Export Performance</h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{testResults.exportSuccessRate.toFixed(1)}%</div>
                <div className="text-gray-300">Success Rate</div>
              </div>
              <div className={`px-4 py-2 rounded font-semibold ${testResults.exportTargetMet ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                Target: 98% {testResults.exportTargetMet ? '✅' : '❌'}
              </div>
            </div>
          </div>

          {/* Friction Analysis */}
          {testResults.totalFrictionPoints > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Friction Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded">
                  <div className="text-lg font-semibold text-yellow-400">{testResults.totalFrictionPoints}</div>
                  <div className="text-gray-300">Total Friction Points</div>
                </div>
                <div className="bg-gray-700 p-4 rounded">
                  <div className="text-lg font-semibold text-red-400">{testResults.criticalFrictionPoints}</div>
                  <div className="text-gray-300">Critical Issues</div>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {testResults.recommendations.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Optimization Recommendations</h2>
              <div className="space-y-3">
                {testResults.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-gray-700 rounded border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        rec.priority === 'critical' ? 'bg-red-900 text-red-300' :
                        rec.priority === 'high' ? 'bg-orange-900 text-orange-300' :
                        'bg-yellow-900 text-yellow-300'
                      }`}>
                        {rec.priority.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-400">{rec.area}</span>
                    </div>
                    <div className="text-gray-200">{rec.recommendation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SarahChenWorkflowTestRunner;