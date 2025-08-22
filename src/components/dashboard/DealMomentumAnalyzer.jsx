import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap,
  Clock,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Activity,
  BarChart3,
  Timer,
  Gauge,
  FastForward,
  Pause,
  Play
} from 'lucide-react';

/**
 * Deal Momentum Analyzer - NICE-TO-HAVE PHASE
 * 
 * Tracks deal progression velocity and identifies acceleration/deceleration patterns.
 * Provides momentum scoring and predictive insights for deal timing.
 * Helps identify when deals need intervention to maintain forward progress.
 */

const DealMomentumAnalyzer = ({
  dealData = [],
  velocityMetrics = {},
  onDealClick,
  onVelocityAction
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [momentumAlerts, setMomentumAlerts] = useState([]);

  // Mock deal momentum data
  const deals = [
    {
      id: 'deal_techflow',
      name: 'TechFlow Enterprise',
      value: 150000,
      current_stage: 'proposal',
      stage_progression: [
        { stage: 'discovery', entered: '45 days ago', duration: 12 },
        { stage: 'technical_review', entered: '33 days ago', duration: 8 },
        { stage: 'business_case', entered: '25 days ago', duration: 15 },
        { stage: 'proposal', entered: '10 days ago', duration: 10 }
      ],
      momentum_score: 65,
      velocity_trend: 'slowing',
      days_in_current_stage: 10,
      predicted_close_date: '2024-09-15',
      risk_factors: ['CFO not engaged', 'Budget approval pending'],
      acceleration_opportunities: [
        { action: 'Schedule CFO meeting', impact: 'high', experience_reward: 25 },
        { action: 'Provide ROI calculator', impact: 'medium', experience_reward: 15 }
      ],
      average_stage_duration: 11.25,
      comparison_to_average: 'slower'
    },
    {
      id: 'deal_datacorp',
      name: 'DataCorp Implementation',
      value: 320000,
      current_stage: 'technical_review',
      stage_progression: [
        { stage: 'discovery', entered: '28 days ago', duration: 7 },
        { stage: 'technical_review', entered: '21 days ago', duration: 21 }
      ],
      momentum_score: 35,
      velocity_trend: 'stalled',
      days_in_current_stage: 21,
      predicted_close_date: '2024-10-30',
      risk_factors: ['Technical complexity concerns', 'Integration challenges', 'Decision maker unavailable'],
      acceleration_opportunities: [
        { action: 'Technical deep-dive session', impact: 'high', experience_reward: 30 },
        { action: 'Escalate to senior sponsor', impact: 'high', experience_reward: 25 }
      ],
      average_stage_duration: 14,
      comparison_to_average: 'much_slower'
    },
    {
      id: 'deal_cloudscale',
      name: 'CloudScale Solutions',
      value: 280000,
      current_stage: 'business_case',
      stage_progression: [
        { stage: 'discovery', entered: '18 days ago', duration: 5 },
        { stage: 'technical_review', entered: '13 days ago', duration: 6 },
        { stage: 'business_case', entered: '7 days ago', duration: 7 }
      ],
      momentum_score: 85,
      velocity_trend: 'accelerating',
      days_in_current_stage: 7,
      predicted_close_date: '2024-08-30',
      risk_factors: [],
      acceleration_opportunities: [
        { action: 'Fast-track proposal', impact: 'medium', experience_reward: 20 }
      ],
      average_stage_duration: 6,
      comparison_to_average: 'faster'
    }
  ];

  // Generate momentum alerts
  useEffect(() => {
    const generateAlerts = () => {
      const alerts = [];
      
      deals.forEach(deal => {
        // Stalled deal alert
        if (deal.momentum_score < 40) {
          alerts.push({
            id: `momentum_${deal.id}_stalled`,
            type: 'momentum_risk',
            severity: 'high',
            deal_name: deal.name,
            message: `${deal.name} momentum critically low (${deal.momentum_score}%)`,
            action_required: 'Immediate intervention needed',
            experience_reward: 30
          });
        }
        
        // Stage duration alert
        if (deal.comparison_to_average === 'much_slower') {
          alerts.push({
            id: `duration_${deal.id}_slow`,
            type: 'stage_duration',
            severity: 'medium',
            deal_name: deal.name,
            message: `${deal.name} exceeding average stage duration`,
            action_required: 'Accelerate current stage',
            experience_reward: 20
          });
        }
        
        // Acceleration opportunity
        if (deal.momentum_score > 80) {
          alerts.push({
            id: `opportunity_${deal.id}_fast`,
            type: 'acceleration_opportunity',
            severity: 'low',
            deal_name: deal.name,
            message: `${deal.name} showing strong momentum - fast-track opportunity`,
            action_required: 'Consider acceleration tactics',
            experience_reward: 15
          });
        }
      });
      
      setMomentumAlerts(alerts);
    };
    
    generateAlerts();
  }, []);

  // Calculate overall velocity metrics
  const calculateVelocityMetrics = () => {
    const totalDeals = deals.length;
    const stalledDeals = deals.filter(d => d.momentum_score < 50).length;
    const acceleratingDeals = deals.filter(d => d.velocity_trend === 'accelerating').length;
    const averageMomentum = deals.reduce((sum, d) => sum + d.momentum_score, 0) / totalDeals;
    
    return {
      totalDeals,
      stalledDeals,
      acceleratingDeals,
      averageMomentum: Math.round(averageMomentum),
      averageCycleTime: 45 // days
    };
  };

  const metrics = calculateVelocityMetrics();

  const getMomentumColor = (score) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMomentumBg = (score) => {
    if (score >= 70) return 'bg-green-900/30 border-green-500/40';
    if (score >= 40) return 'bg-yellow-900/30 border-yellow-500/40';
    return 'bg-red-900/30 border-red-500/40';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'accelerating') return TrendingUp;
    if (trend === 'slowing') return TrendingDown;
    return Pause;
  };

  const getTrendColor = (trend) => {
    if (trend === 'accelerating') return 'text-green-400';
    if (trend === 'slowing') return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStageIcon = (stage) => {
    const stageIcons = {
      discovery: Target,
      technical_review: Activity,
      business_case: BarChart3,
      proposal: CheckCircle,
      negotiation: Timer,
      closed_won: CheckCircle
    };
    return stageIcons[stage] || Activity;
  };

  return (
    <div className="space-y-6">
      
      {/* Velocity Overview */}
      <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Gauge className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Deal Momentum Analysis</h3>
              <p className="text-gray-400 text-sm">Velocity tracking and acceleration insights</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getMomentumColor(metrics.averageMomentum)}`}>
              {metrics.averageMomentum}%
            </div>
            <div className="text-sm text-gray-400">Avg Momentum</div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-white">{metrics.totalDeals}</div>
            <div className="text-xs text-gray-400">Active Deals</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-400">{metrics.acceleratingDeals}</div>
            <div className="text-xs text-gray-400">Accelerating</div>
          </div>
          <div>
            <div className="text-xl font-bold text-red-400">{metrics.stalledDeals}</div>
            <div className="text-xs text-gray-400">At Risk</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-400">{metrics.averageCycleTime}d</div>
            <div className="text-xs text-gray-400">Avg Cycle</div>
          </div>
        </div>
      </div>

      {/* Momentum Alerts */}
      {momentumAlerts.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white font-medium flex items-center">
            <Zap className="w-4 h-4 text-yellow-400 mr-2" />
            Momentum Intelligence Alerts
          </h4>
          
          {momentumAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border cursor-pointer hover:scale-[1.01] transition-all ${
                alert.severity === 'high' 
                  ? 'bg-red-900/30 border-red-500/40' 
                  : alert.severity === 'medium'
                  ? 'bg-yellow-900/30 border-yellow-500/40'
                  : 'bg-green-900/30 border-green-500/40'
              }`}
              onClick={() => onVelocityAction?.(alert)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                    alert.severity === 'high' ? 'text-red-400' : 
                    alert.severity === 'medium' ? 'text-yellow-400' : 
                    'text-green-400'
                  }`} />
                  <div>
                    <div className="text-white font-medium">{alert.message}</div>
                    <div className="text-gray-400 text-sm mt-1">
                      Action: {alert.action_required}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 text-sm font-medium">
                    +{alert.experience_reward} exp
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 mt-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Deal Momentum Cards */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Deal Velocity Tracking</h4>
        
        {deals.map((deal, index) => {
          const TrendIcon = getTrendIcon(deal.velocity_trend);
          const StageIcon = getStageIcon(deal.current_stage);
          
          return (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${getMomentumBg(deal.momentum_score)} border rounded-xl p-5 cursor-pointer hover:scale-[1.01] transition-all`}
              onClick={() => onDealClick?.(deal)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-black/20">
                    <StageIcon className={`w-5 h-5 ${getMomentumColor(deal.momentum_score)}`} />
                  </div>
                  <div>
                    <h5 className="text-white font-semibold text-lg">{deal.name}</h5>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-gray-400 text-sm capitalize">
                        {deal.current_stage.replace('_', ' ')}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-green-400 text-sm font-medium">
                        ${(deal.value / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Momentum Score */}
                <div className="text-right">
                  <div className={`text-xl font-bold ${getMomentumColor(deal.momentum_score)}`}>
                    {deal.momentum_score}%
                  </div>
                  <div className="text-xs text-gray-400">Momentum</div>
                </div>
              </div>

              {/* Velocity Indicators */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-black/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Trend</span>
                    <TrendIcon className={`w-4 h-4 ${getTrendColor(deal.velocity_trend)}`} />
                  </div>
                  <div className={`text-sm font-medium ${getTrendColor(deal.velocity_trend)} capitalize`}>
                    {deal.velocity_trend}
                  </div>
                </div>
                
                <div className="bg-black/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Stage Duration</span>
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-sm font-medium text-white">
                    {deal.days_in_current_stage} days
                  </div>
                </div>
                
                <div className="bg-black/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">vs Average</span>
                    {deal.comparison_to_average === 'faster' ? (
                      <FastForward className="w-4 h-4 text-green-400" />
                    ) : deal.comparison_to_average === 'slower' ? (
                      <Timer className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <Pause className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div className={`text-sm font-medium ${
                    deal.comparison_to_average === 'faster' ? 'text-green-400' :
                    deal.comparison_to_average === 'slower' ? 'text-yellow-400' :
                    'text-red-400'
                  } capitalize`}>
                    {deal.comparison_to_average.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {/* Stage Progression Timeline */}
              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-2">Stage Progression:</div>
                <div className="flex items-center space-x-2">
                  {deal.stage_progression.map((stage, i) => (
                    <div key={i} className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        i === deal.stage_progression.length - 1 ? 'bg-blue-500' : 'bg-green-500'
                      }`} />
                      <div className="text-xs text-gray-400 ml-1 capitalize">
                        {stage.stage.replace('_', ' ')}
                      </div>
                      <div className="text-xs text-gray-500 ml-1">
                        ({stage.duration}d)
                      </div>
                      {i < deal.stage_progression.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-gray-600 mx-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              {deal.risk_factors.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-2">Risk Factors:</div>
                  <div className="text-sm text-orange-300">
                    {deal.risk_factors[0]}
                    {deal.risk_factors.length > 1 && (
                      <span className="text-gray-500"> (+{deal.risk_factors.length - 1} more)</span>
                    )}
                  </div>
                </div>
              )}

              {/* Acceleration Opportunity */}
              {deal.acceleration_opportunities.length > 0 && (
                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                  <div>
                    <div className="text-xs text-gray-400">Top Acceleration Action:</div>
                    <div className="text-sm text-blue-300">
                      {deal.acceleration_opportunities[0].action}
                    </div>
                  </div>
                  <div className="text-green-400 text-sm font-medium">
                    +{deal.acceleration_opportunities[0].experience_reward} exp
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Velocity Intelligence Summary */}
      <div className="bg-gradient-to-r from-gray-900/50 to-slate-900/50 border border-gray-700 rounded-xl p-4">
        <h4 className="text-white font-medium mb-3 flex items-center">
          <Activity className="w-4 h-4 text-green-400 mr-2" />
          Velocity Intelligence Insights
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Fastest Deal</div>
            <div className="text-green-400 font-medium">
              CloudScale - 85% momentum
            </div>
          </div>
          <div>
            <div className="text-gray-400">Intervention Needed</div>
            <div className="text-red-400 font-medium">
              DataCorp - 21 days stalled
            </div>
          </div>
          <div>
            <div className="text-gray-400">Action Priority</div>
            <div className="text-yellow-400 font-medium">
              Schedule technical deep-dive
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Context */}
      <div className="bg-gradient-to-r from-gray-900/50 to-slate-900/50 border border-gray-700 rounded-xl p-4">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            <span className="text-white font-medium">Momentum Intelligence:</span> Every deal velocity action earns experience while building systematic understanding of sales cycle patterns and acceleration tactics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DealMomentumAnalyzer;