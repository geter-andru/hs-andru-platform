import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Clock, Target, Award, CheckCircle } from 'lucide-react';

/**
 * ExecutiveBriefing - 5-second business health assessment for technical founders
 * 
 * Business Health = Buyer Understanding × Tech-to-Value Translation
 * - Green (80-100%): Strong buyer insights + clear value communication
 * - Yellow (60-79%): Good foundation but gaps in execution
 * - Red (0-59%): Critical gaps in buyer understanding or value translation
 */

const ExecutiveBriefing = ({ competencyScores, milestone, trends, customerId }) => {
  // Calculate Business Health Score
  const calculateBusinessHealth = () => {
    const buyerUnderstanding = competencyScores?.customerAnalysis || 0;
    const valueTranslation = competencyScores?.valueCommunication || 0;
    const executiveReadiness = competencyScores?.executiveReadiness || 0;
    
    // Weighted formula: Buyer Understanding (40%) + Value Translation (40%) + Executive Readiness (20%)
    const healthScore = Math.round(
      (buyerUnderstanding * 0.4) + 
      (valueTranslation * 0.4) + 
      (executiveReadiness * 0.2)
    );
    
    const status = healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'warning' : 'critical';
    
    return { score: healthScore, status };
  };

  const { score: healthScore, status: healthStatus } = calculateBusinessHealth();

  // Identify top 3 priorities based on gaps and trends
  const getTopPriorities = () => {
    const priorities = [];
    const scores = competencyScores || {};
    const targets = milestone?.targets || {};
    
    // Check for critical gaps (>15 points behind target)
    Object.entries(scores).forEach(([key, current]) => {
      const target = targets[key] || 70;
      const gap = target - current;
      
      if (gap > 15) {
        priorities.push({
          type: 'critical',
          area: key,
          message: `${formatCompetencyName(key)} ${gap}% behind target`,
          urgency: 'high',
          timeEstimate: '2-3 hours',
          icon: AlertTriangle
        });
      } else if (gap > 8) {
        priorities.push({
          type: 'warning',
          area: key,
          message: `${formatCompetencyName(key)} needs attention (${gap}% gap)`,
          urgency: 'medium',
          timeEstimate: '1-2 hours',
          icon: Clock
        });
      }
    });

    // Add trending down warnings
    if (trends?.valueCommunication?.direction === 'down') {
      priorities.push({
        type: 'trend',
        area: 'valueCommunication',
        message: 'Value communication declining (-8% this month)',
        urgency: 'medium',
        timeEstimate: '1 hour',
        icon: TrendingDown
      });
    }

    // Add milestone risk if applicable
    if (milestone?.riskLevel === 'high') {
      priorities.push({
        type: 'milestone',
        area: 'milestone',
        message: `${milestone.name} at risk (${milestone.completionPercentage}% complete)`,
        urgency: 'high',
        timeEstimate: '4-6 hours',
        icon: Target
      });
    }

    return priorities.slice(0, 3); // Top 3 only
  };

  // Quick wins that can be completed immediately
  const getQuickWins = () => {
    const wins = [];
    const scores = competencyScores || {};
    
    if (scores.customerAnalysis < 70) {
      wins.push({
        title: 'Complete ICP Analysis workflow',
        timeEstimate: '30 minutes',
        impact: '+12% buyer understanding',
        tool: 'icp'
      });
    }
    
    if (scores.valueCommunication < 65) {
      wins.push({
        title: 'Run financial impact calculator',
        timeEstimate: '20 minutes', 
        impact: '+8% value translation',
        tool: 'financial'
      });
    }
    
    if (scores.executiveReadiness < 75) {
      wins.push({
        title: 'Review executive messaging templates',
        timeEstimate: '15 minutes',
        impact: '+5% executive readiness',
        tool: 'resources'
      });
    }
    
    return wins.slice(0, 2); // Top 2 quick wins
  };

  const formatCompetencyName = (key) => {
    const names = {
      customerAnalysis: 'Buyer Understanding',
      valueCommunication: 'Value Translation', 
      executiveReadiness: 'Executive Communication'
    };
    return names[key] || key;
  };

  const priorities = getTopPriorities();
  const quickWins = getQuickWins();

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
      {/* 5-Second Business Health Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className={`w-4 h-4 rounded-full ${
            healthStatus === 'healthy' ? 'bg-green-500' : 
            healthStatus === 'warning' ? 'bg-yellow-500' : 
            'bg-red-500'
          } animate-pulse`}></div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Business Health: {healthScore}%
            </h2>
            <p className="text-sm text-gray-400">
              Buyer Understanding × Value Translation = Revenue Readiness
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold ${
            healthStatus === 'healthy' ? 'text-green-400' : 
            healthStatus === 'warning' ? 'text-yellow-400' : 
            'text-red-400'
          }`}>
            {healthStatus === 'healthy' ? 'STRONG' : 
             healthStatus === 'warning' ? 'GOOD' : 'NEEDS ATTENTION'}
          </div>
          <div className="text-sm text-gray-400">Status</div>
        </div>
      </div>

      {/* Executive Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Top Priorities (What needs attention) */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
            Top Priorities Today
          </h3>
          
          {priorities.length > 0 ? (
            <div className="space-y-3">
              {priorities.map((priority, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  priority.urgency === 'high' ? 'bg-red-900/20 border-red-500/30' :
                  priority.urgency === 'medium' ? 'bg-yellow-900/20 border-yellow-500/30' :
                  'bg-blue-900/20 border-blue-500/30'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <priority.icon className={`w-4 h-4 mt-1 ${
                        priority.urgency === 'high' ? 'text-red-400' :
                        priority.urgency === 'medium' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`} />
                      <div>
                        <p className="text-white font-medium text-sm">{priority.message}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Estimated fix: {priority.timeEstimate}
                        </p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      priority.urgency === 'high' ? 'bg-red-500/20 text-red-300' :
                      priority.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {priority.urgency}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-green-300 font-medium">All systems healthy</p>
                  <p className="text-green-400/80 text-sm">No critical issues requiring immediate attention</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Quick Wins (Immediate actions) */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Award className="w-5 h-5 text-green-400 mr-2" />
            Quick Wins Available
          </h3>
          
          {quickWins.length > 0 ? (
            <div className="space-y-3">
              {quickWins.map((win, index) => (
                <div key={index} className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg hover:bg-green-900/30 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white font-medium text-sm group-hover:text-green-300 transition-colors">
                        {win.title}
                      </p>
                      <p className="text-green-400 text-xs mt-1">{win.impact}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-green-300 text-xs font-medium">{win.timeEstimate}</div>
                      <div className="text-green-400/80 text-xs">to complete</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-blue-300 font-medium">Strong foundation built</p>
                  <p className="text-blue-400/80 text-sm">Focus on advanced optimization and scaling</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom: One-Liner Status for Immediate Context */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <p className="text-center text-gray-400 text-sm">
          <span className="text-white font-medium">Bottom Line:</span> {
            healthStatus === 'healthy' ? 
              'Revenue conversations ready. Focus on scaling and optimization.' :
            healthStatus === 'warning' ? 
              'Good foundation. Address value communication gaps for breakthrough.' :
              'Critical: Strengthen buyer understanding before major sales efforts.'
          }
        </p>
      </div>
    </div>
  );
};

export default ExecutiveBriefing;