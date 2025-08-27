import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { advancedPersonalizationService } from '../../services/advancedPersonalizationService';

const PersonalizedWelcome = ({ assessmentData, onActionClick }) => {
  const [personalization, setPersonalization] = useState(null);

  useEffect(() => {
    if (assessmentData) {
      const personalizedExp = advancedPersonalizationService.generatePersonalizedExperience(assessmentData);
      setPersonalization(personalizedExp);
    }
  }, [assessmentData]);

  if (!personalization) return null;

  const { messaging, urgencyIndicators, toolRecommendations, dashboard } = personalization;
  const urgency = urgencyIndicators.primary;

  const getUrgencyColor = () => {
    if (urgency.score >= 8) return 'from-red-500 to-red-600';
    if (urgency.score >= 6) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  const getUrgencyIcon = () => {
    if (urgency.score >= 8) return AlertTriangle;
    if (urgency.score >= 6) return TrendingUp;
    return Target;
  };

  const UrgencyIcon = getUrgencyIcon();

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${getUrgencyColor()}`}>
            <UrgencyIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-2">
              {messaging.welcome.headline}
            </h2>
            <p className="text-gray-400">
              {messaging.welcome.subtext}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Urgency Indicator */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className={`bg-gradient-to-r ${getUrgencyColor()}/10 border border-current/20 rounded-xl p-4`}
      >
        <div className="flex items-center space-x-3">
          <Zap className="w-5 h-5 text-yellow-400" />
          <div>
            <p className="text-white font-medium">
              {urgency.message}
            </p>
            <p className="text-gray-400 text-sm">
              {urgency.timeline}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Personalized Tool Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">
          Recommended Next Steps
        </h3>
        
        {toolRecommendations.map((rec, index) => (
          <motion.div
            key={rec.tool}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
            className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-cyan-500/50 transition-colors cursor-pointer"
            onClick={() => onActionClick?.(rec.tool)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-white">{rec.tool}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    rec.urgency === 'immediate' ? 'bg-red-500/20 text-red-300' :
                    rec.urgency === 'high' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {rec.urgency}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">
                  {rec.reason}
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>⏱️ {rec.timeToValue}</span>
                  <span>📈 {rec.expectedImpact}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Assessment Summary Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/30 rounded-lg p-4 border border-gray-700"
      >
        <h4 className="font-medium text-white mb-3">Your Assessment Profile</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Overall Score:</span>
            <span className="text-cyan-400 ml-2 font-mono">{assessmentData.score}/100</span>
          </div>
          <div>
            <span className="text-gray-400">Challenges Found:</span>
            <span className="text-red-400 ml-2 font-mono">{assessmentData.challenges}</span>
          </div>
          <div>
            <span className="text-gray-400">Company:</span>
            <span className="text-white ml-2">{assessmentData.productName || 'Not provided'}</span>
          </div>
          <div>
            <span className="text-gray-400">Focus Area:</span>
            <span className="text-white ml-2">{assessmentData.focusArea || 'General'}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PersonalizedWelcome;