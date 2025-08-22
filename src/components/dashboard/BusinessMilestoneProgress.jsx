import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Users, Zap, Award, ArrowRight, Clock, CheckCircle } from 'lucide-react';

/**
 * Business Milestone Progress - CORE PHASE
 * 
 * Shows Series B readiness through professional development milestones
 * Connects buyer intelligence actions to business stage progression (10-15)
 */

const BusinessMilestoneProgress = ({ 
  milestoneData = [], 
  seriesBReadiness = {},
  currentLevel = {},
  onMilestoneClick 
}) => {
  
  // Stage icons for business context
  const stageIcons = {
    'stage_12_revenue_scalability': TrendingUp,
    'stage_13_user_base_growth': Users,
    'stage_14_product_scaling': Target,
    'stage_15_revenue_growth': Award
  };

  // Get milestone status styling
  const getMilestoneStyles = (milestone) => {
    if (milestone.achieved) {
      return {
        card: 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/40',
        icon: 'text-green-400',
        progress: 'bg-green-500',
        text: 'text-green-200',
        badge: 'bg-green-500/20 text-green-300 border-green-500/30'
      };
    } else if (milestone.progress >= 70) {
      return {
        card: 'bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-500/40',
        icon: 'text-blue-400',
        progress: 'bg-blue-500',
        text: 'text-blue-200',
        badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      };
    } else if (milestone.progress >= 30) {
      return {
        card: 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/40',
        icon: 'text-yellow-400',
        progress: 'bg-yellow-500',
        text: 'text-yellow-200',
        badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      };
    } else {
      return {
        card: 'bg-gradient-to-r from-gray-900/30 to-slate-900/30 border-gray-500/40',
        icon: 'text-gray-400',
        progress: 'bg-gray-500',
        text: 'text-gray-200',
        badge: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
      };
    }
  };

  // Get Series B readiness status color
  const getSeriesBStatusColor = () => {
    if (seriesBReadiness.progress >= 80) return 'text-green-400';
    if (seriesBReadiness.progress >= 60) return 'text-blue-400';
    if (seriesBReadiness.progress >= 40) return 'text-yellow-400';
    return 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      
      {/* Series B Readiness Overview */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Series B Readiness</h3>
              <p className="text-gray-400 text-sm">Professional development toward funding readiness</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getSeriesBStatusColor()}`}>
              {seriesBReadiness.progress || 0}%
            </div>
            <div className="text-sm text-gray-400">{seriesBReadiness.status}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-800 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${seriesBReadiness.progress || 0}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Status details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Current Level</div>
            <div className="text-white font-medium">{currentLevel.name || 'Foundation'}</div>
          </div>
          <div>
            <div className="text-gray-400">Experience Needed</div>
            <div className="text-white font-medium">
              {seriesBReadiness.experienceNeeded?.toLocaleString() || 0} points
            </div>
          </div>
          <div>
            <div className="text-gray-400">Estimated Timeline</div>
            <div className="text-white font-medium">{seriesBReadiness.estimatedTimeToReady || 'TBD'}</div>
          </div>
        </div>
      </div>

      {/* Business Milestone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {milestoneData.map((milestone, index) => {
          const styles = getMilestoneStyles(milestone);
          const IconComponent = stageIcons[milestone.key] || Target;
          
          return (
            <motion.div
              key={milestone.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${styles.card} border rounded-xl p-5 cursor-pointer hover:scale-[1.02] transition-all duration-200`}
              onClick={() => onMilestoneClick?.(milestone)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-black/20`}>
                    <IconComponent className={`w-5 h-5 ${styles.icon}`} />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${styles.text} leading-tight`}>
                      {milestone.name}
                    </h4>
                    <p className="text-gray-400 text-sm">{milestone.description}</p>
                  </div>
                </div>
                
                {/* Achievement badge */}
                {milestone.achieved ? (
                  <div className={`px-2 py-1 rounded-full border ${styles.badge} text-xs font-medium`}>
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    Complete
                  </div>
                ) : (
                  <div className={`px-2 py-1 rounded-full border ${styles.badge} text-xs font-medium`}>
                    {Math.round(milestone.progress)}%
                  </div>
                )}
              </div>

              {/* Progress visualization */}
              <div className="mb-4">
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <motion.div
                    className={`${styles.progress} h-2 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${milestone.progress}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                  />
                </div>
              </div>

              {/* Business Impact */}
              <div className="mb-3">
                <p className="text-gray-300 text-sm">{milestone.businessImpact}</p>
              </div>

              {/* Footer details */}
              <div className="flex items-center justify-between text-sm">
                <div>
                  {milestone.achieved ? (
                    <div className={`${styles.text} font-medium`}>Milestone Achieved</div>
                  ) : (
                    <div className="text-gray-400">
                      {milestone.experienceNeeded?.toLocaleString()} exp needed
                    </div>
                  )}
                </div>
                
                {!milestone.achieved && (
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">In Progress</span>
                  </div>
                )}
              </div>

              {/* Hover effect arrow */}
              <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Next Milestone Focus */}
      {milestoneData.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
          <h4 className="text-white font-medium mb-3 flex items-center">
            <Zap className="w-4 h-4 text-blue-400 mr-2" />
            Immediate Focus Area
          </h4>
          
          {(() => {
            const nextMilestone = milestoneData.find(m => !m.achieved) || milestoneData[0];
            const styles = getMilestoneStyles(nextMilestone);
            
            return (
              <div className="flex items-center justify-between">
                <div>
                  <div className={`${styles.text} font-medium`}>{nextMilestone.name}</div>
                  <div className="text-gray-400 text-sm">
                    {nextMilestone.achieved 
                      ? 'Focus on next business development opportunity'
                      : `${nextMilestone.experienceNeeded?.toLocaleString()} experience points needed`
                    }
                  </div>
                </div>
                
                <button
                  onClick={() => onMilestoneClick?.(nextMilestone)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* Professional Development Context */}
      <div className="bg-gradient-to-r from-gray-900/50 to-slate-900/50 border border-gray-700 rounded-xl p-4">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            <span className="text-white font-medium">Professional Development Strategy:</span> Every buyer intelligence action builds systematic competitive advantages while advancing toward Series B readiness through measurable business milestone progression.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessMilestoneProgress;