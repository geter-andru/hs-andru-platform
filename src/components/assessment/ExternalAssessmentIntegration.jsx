/**
 * External Assessment Integration Component
 * Demonstrates connection and integration with andru-ai.com assessment data
 */

import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  TrendingUp,
  Zap,
  Settings
} from 'lucide-react';
import { useExternalAssessment } from '../../hooks/useExternalAssessment';

const ExternalAssessmentIntegration = ({ customerId, userEmail }) => {
  const [showIntegrationDetails, setShowIntegrationDetails] = useState(false);
  const [integrationAttempted, setIntegrationAttempted] = useState(false);
  
  const {
    isLoading,
    isAvailable,
    isIntegrated,
    hasRecentSync,
    competencyData,
    behavioralProfile,
    error,
    lastSync,
    syncInProgress,
    canIntegrate,
    needsSync,
    enhancements,
    checkAvailability,
    integrateAssessment,
    syncAssessment,
    getLastSyncAge
  } = useExternalAssessment(customerId, userEmail);

  // Handle integration
  const handleIntegration = async () => {
    setIntegrationAttempted(true);
    try {
      const result = await integrateAssessment();
      if (result.success) {
        console.log('✅ Assessment integration successful');
      } else if (result.fallbackToLocal) {
        console.log('⚠️ Using local assessment system as fallback');
      }
    } catch (error) {
      console.error('Integration failed:', error);
    }
  };

  // Handle sync
  const handleSync = async (forceSync = false) => {
    try {
      await syncAssessment(forceSync);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  // Availability status component
  const AvailabilityStatus = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-blue-400">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm">Checking assessment availability...</span>
        </div>
      );
    }

    if (isAvailable) {
      return (
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">External assessment data available</span>
          {lastSync && (
            <span className="text-xs text-gray-500">
              (Last assessment: {getLastSyncAge()} days ago)
            </span>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-yellow-400">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">No external assessment data found</span>
      </div>
    );
  };

  // Integration status component
  const IntegrationStatus = () => {
    if (!isAvailable) return null;

    if (syncInProgress) {
      return (
        <div className="flex items-center gap-2 text-blue-400">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm">Syncing assessment data...</span>
        </div>
      );
    }

    if (isIntegrated && hasRecentSync) {
      return (
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">Assessment data integrated successfully</span>
        </div>
      );
    }

    if (needsSync) {
      return (
        <div className="flex items-center gap-2 text-yellow-400">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Assessment data needs sync</span>
        </div>
      );
    }

    return null;
  };

  // Competency enhancement preview
  const CompetencyEnhancements = () => {
    if (!enhancements || !competencyData) return null;

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Assessment-Based Enhancements
        </h4>
        
        {/* Competency Insights */}
        {enhancements.competencyInsights.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h5 className="font-medium text-gray-300 mb-3">Competency Insights</h5>
            <div className="space-y-2">
              {enhancements.competencyInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    insight.priority === 'high' ? 'bg-red-400' : 'bg-yellow-400'
                  }`} />
                  <div>
                    <p className="text-sm text-gray-300">{insight.insight}</p>
                    <p className="text-xs text-gray-500">
                      Current: {insight.currentScore} → Target: {insight.targetScore}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Behavioral Adaptations */}
        {enhancements.behavioralAdaptations.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h5 className="font-medium text-gray-300 mb-3">Behavioral Adaptations</h5>
            <div className="space-y-2">
              {enhancements.behavioralAdaptations.map((adaptation, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm text-gray-300">{adaptation.adaptation}</p>
                  <p className="text-xs text-blue-400">
                    Recommended: {adaptation.tools.join(', ')}
                  </p>
                  <p className="text-xs text-gray-500">{adaptation.benefit}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tool Recommendations */}
        {enhancements.toolRecommendations.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h5 className="font-medium text-gray-300 mb-3">Tool Recommendations</h5>
            <div className="space-y-3">
              {enhancements.toolRecommendations.map((rec, index) => (
                <div key={index} className="border-l-2 border-purple-500 pl-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">{rec.tool}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      rec.priority === 'high' ? 'bg-red-900 text-red-200' : 'bg-yellow-900 text-yellow-200'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{rec.reason}</p>
                  <p className="text-xs text-green-400">{rec.expectedImpact}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <ExternalLink className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">External Assessment Integration</h3>
            <p className="text-gray-400">Connect with andru-ai.com assessment data</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowIntegrationDetails(!showIntegrationDetails)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Status Section */}
      <div className="space-y-3 mb-6">
        <AvailabilityStatus />
        <IntegrationStatus />
        
        {error && (
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-6">
        {!isIntegrated && canIntegrate && (
          <button
            onClick={handleIntegration}
            disabled={syncInProgress}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Zap className="w-4 h-4" />
            Integrate Assessment Data
          </button>
        )}
        
        {isAvailable && (
          <button
            onClick={() => handleSync(true)}
            disabled={syncInProgress}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${syncInProgress ? 'animate-spin' : ''}`} />
            Force Sync
          </button>
        )}
        
        <button
          onClick={checkAvailability}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Check Availability
        </button>
      </div>

      {/* Integration Details */}
      {showIntegrationDetails && (
        <div className="border-t border-gray-800 pt-6 space-y-4">
          <h4 className="text-lg font-medium text-white">Integration Details</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h5 className="font-medium text-gray-300 mb-2">User Information</h5>
              <div className="space-y-1 text-sm">
                <p className="text-gray-400">Customer ID: <span className="text-white">{customerId}</span></p>
                <p className="text-gray-400">Email: <span className="text-white">{userEmail || 'Not provided'}</span></p>
                <p className="text-gray-400">Status: <span className="text-white">
                  {isIntegrated ? 'Integrated' : 'Not integrated'}
                </span></p>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <h5 className="font-medium text-gray-300 mb-2">Sync Information</h5>
              <div className="space-y-1 text-sm">
                <p className="text-gray-400">Last Sync: <span className="text-white">
                  {lastSync ? new Date(lastSync).toLocaleDateString() : 'Never'}
                </span></p>
                <p className="text-gray-400">Sync Age: <span className="text-white">
                  {getLastSyncAge() || 'N/A'} days
                </span></p>
                <p className="text-gray-400">Auto-sync: <span className="text-white">
                  {hasRecentSync ? 'Up to date' : 'Needed'}
                </span></p>
              </div>
            </div>
          </div>

          {/* Behavioral Profile */}
          {behavioralProfile && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h5 className="font-medium text-gray-300 mb-3">Behavioral Profile</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Communication Style:</p>
                  <p className="text-white capitalize">{behavioralProfile.communicationStyle}</p>
                </div>
                <div>
                  <p className="text-gray-400">Learning Preference:</p>
                  <p className="text-white capitalize">{behavioralProfile.learningPreference}</p>
                </div>
                <div>
                  <p className="text-gray-400">Decision Making:</p>
                  <p className="text-white capitalize">{behavioralProfile.decisionMakingPattern}</p>
                </div>
                <div>
                  <p className="text-gray-400">Stress Response:</p>
                  <p className="text-white capitalize">{behavioralProfile.stressResponsePattern}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Competency Enhancements */}
      {isIntegrated && competencyData && (
        <div className="border-t border-gray-800 pt-6">
          <CompetencyEnhancements />
        </div>
      )}

      {/* Demo Integration Button for Testing */}
      {!integrationAttempted && !isAvailable && (
        <div className="border-t border-gray-800 pt-6">
          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-300 mb-2">Demo Mode</h5>
                <p className="text-sm text-blue-200 mb-3">
                  No external assessment data found. Click below to simulate external assessment integration 
                  with realistic data from andru-ai.com.
                </p>
                <button
                  onClick={handleIntegration}
                  disabled={syncInProgress}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Simulate Integration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalAssessmentIntegration;