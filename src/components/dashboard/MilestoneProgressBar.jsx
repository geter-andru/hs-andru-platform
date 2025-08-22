import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { milestoneModuleService } from '../../services/MilestoneModuleService';

/**
 * Milestone Progress Bar - Shows Series B progression stages 10-15
 * 
 * Visual representation of user's current stage and target progression
 * with specific focus on the 3 critical sales steps for each stage.
 */

const MilestoneProgressBar = ({ 
  currentStage = 12, 
  targetStage = 15, 
  compact = false,
  showDetails = true 
}) => {
  const stages = milestoneModuleService.getStageProgressionSummary(10, 15);
  
  const getStageStatus = (stage) => {
    if (stage < currentStage) return 'completed';
    if (stage === currentStage) return 'active';
    if (stage <= targetStage) return 'target';
    return 'future';
  };

  const getStageColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-900/30 border-green-500/50';
      case 'active': return 'text-blue-400 bg-blue-900/30 border-blue-500/50';
      case 'target': return 'text-purple-400 bg-purple-900/30 border-purple-500/50';
      case 'future': return 'text-gray-400 bg-gray-900/30 border-gray-600/50';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-600/50';
    }
  };

  const getStageIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'active': return Circle;
      default: return Circle;
    }
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage.stage);
          const Icon = getStageIcon(status);
          const isLast = index === stages.length - 1;
          
          return (
            <div key={stage.stage} className="flex items-center">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-md border ${getStageColor(status)}`}>
                <Icon className="w-3 h-3" />
                <span className="text-xs font-medium">{stage.stage}</span>
              </div>
              {!isLast && <ArrowRight className="w-3 h-3 text-gray-500 mx-1" />}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Series B Milestone Progress</h3>
        <div className="text-sm text-gray-400">
          Stage {currentStage} → {targetStage}
        </div>
      </div>

      {/* Progress Visualization */}
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage.stage);
          const Icon = getStageIcon(status);
          
          return (
            <motion.div
              key={stage.stage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-4 ${getStageColor(status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 mt-0.5" />
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold">Stage {stage.stage}: {stage.name}</h4>
                      {stage.isActive && (
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                          Current
                        </span>
                      )}
                      {stage.isTarget && !stage.isActive && (
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                          Target
                        </span>
                      )}
                    </div>
                    <p className="text-sm opacity-80 mb-2">{stage.goal}</p>
                    
                    {showDetails && (
                      <div className="space-y-1">
                        <div className="text-xs opacity-70">
                          <span className="font-medium">Focus:</span> {stage.focus}
                        </div>
                        <div className="text-xs opacity-70">
                          <span className="font-medium">Modules:</span> {stage.moduleCount} active modules
                        </div>
                        
                        {/* Critical Steps */}
                        <div className="mt-2">
                          <div className="text-xs font-medium opacity-80 mb-1">
                            Critical Steps:
                          </div>
                          <ul className="text-xs opacity-70 space-y-0.5">
                            {stage.criticalSteps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-start space-x-1">
                                <span className="text-current">•</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Progress Indicator */}
                <div className="text-right">
                  <div className="text-xs opacity-70">
                    {status === 'completed' && '✓ Complete'}
                    {status === 'active' && 'In Progress'}
                    {status === 'target' && 'Planning'}
                    {status === 'future' && 'Future'}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Current Focus Summary */}
      {showDetails && (
        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <h4 className="text-blue-300 font-medium mb-2">Current Stage Focus</h4>
          <p className="text-blue-200 text-sm">
            <strong>Stage {currentStage}:</strong> {milestoneModuleService.seriesBStages[currentStage]?.goal}
          </p>
          <div className="text-blue-300/80 text-xs mt-2">
            <strong>Strategy:</strong> {milestoneModuleService.seriesBStages[currentStage]?.focus}
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneProgressBar;