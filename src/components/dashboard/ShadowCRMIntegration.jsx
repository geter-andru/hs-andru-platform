import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, 
  Target, Users, DollarSign, Clock, Activity, 
  ArrowRight, AlertCircle, Zap
} from 'lucide-react';

/**
 * Shadow CRM Integration - ESSENTIAL PHASE
 * 
 * Shows leading indicators of revenue health through buyer intelligence metrics
 * Predicts CRM changes 2-4 weeks before they appear in Salesforce/HubSpot
 * Connects professional development actions to revenue outcomes
 */

const ShadowCRMIntegration = ({ 
  buyerIntelligence = {},
  experienceData = {},
  onActionSelect 
}) => {
  
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [predictions, setPredictions] = useState([]);

  // Calculate leading indicators from buyer intelligence
  const calculateLeadingIndicators = () => {
    const indicators = {
      pipelineHealth: calculatePipelineHealth(),
      conversionVelocity: calculateConversionVelocity(),
      stakeholderAlignment: calculateStakeholderAlignment(),
      competitivePosition: calculateCompetitivePosition(),
      dealRisk: calculateDealRisk()
    };
    
    return indicators;
  };

  // Pipeline Health: Technical validation vs Business case gap
  const calculatePipelineHealth = () => {
    const technicalValidation = buyerIntelligence?.technicalValidation || 85;
    const businessCaseApproval = buyerIntelligence?.businessCaseApproval || 23;
    const gap = technicalValidation - businessCaseApproval;
    
    return {
      score: 100 - gap, // Lower gap = healthier pipeline
      status: gap > 50 ? 'critical' : gap > 30 ? 'warning' : 'healthy',
      gap,
      technicalValidation,
      businessCaseApproval,
      prediction: `${gap > 50 ? 'High' : gap > 30 ? 'Medium' : 'Low'} risk of deal stalls in procurement phase`,
      experienceOpportunity: gap * 5, // Higher gap = more experience available
      actionRequired: gap > 30
    };
  };

  // Conversion Velocity: Speed of buyer understanding development
  const calculateConversionVelocity = () => {
    const weeklyActions = experienceData?.weeklyActions || 8;
    const targetActions = 15; // Optimal weekly actions for pipeline velocity
    const velocity = (weeklyActions / targetActions) * 100;
    
    return {
      score: Math.min(velocity, 100),
      status: velocity >= 80 ? 'accelerating' : velocity >= 50 ? 'steady' : 'slowing',
      weeklyActions,
      targetActions,
      prediction: velocity < 50 ? 'Sales cycle likely to extend by 2-3 weeks' : 'On track for typical cycle',
      experienceOpportunity: (targetActions - weeklyActions) * 10,
      actionRequired: velocity < 80
    };
  };

  // Stakeholder Alignment: Coverage across buyer personas
  const calculateStakeholderAlignment = () => {
    const coverage = {
      cto: buyerIntelligence?.ctoEngagement || 75,
      cfo: buyerIntelligence?.cfoEngagement || 35,
      coo: buyerIntelligence?.cooEngagement || 20
    };
    
    const avgCoverage = Object.values(coverage).reduce((a, b) => a + b, 0) / 3;
    const minCoverage = Math.min(...Object.values(coverage));
    
    return {
      score: avgCoverage,
      status: minCoverage < 30 ? 'critical' : minCoverage < 50 ? 'gaps' : 'aligned',
      coverage,
      weakestLink: Object.entries(coverage).sort(([,a], [,b]) => a - b)[0],
      prediction: minCoverage < 30 ? 'Deal likely to stall at executive review' : 'Executive alignment progressing',
      experienceOpportunity: (100 - minCoverage) * 3,
      actionRequired: minCoverage < 50
    };
  };

  // Competitive Position: Win rate trajectory
  const calculateCompetitivePosition = () => {
    const competitiveIntel = buyerIntelligence?.competitiveIntelligence || 60;
    const competitorMentions = buyerIntelligence?.competitorMentions || 3;
    const winRateVsCompetitor = buyerIntelligence?.winRateVsCompetitor || 40;
    
    return {
      score: competitiveIntel,
      status: winRateVsCompetitor < 30 ? 'losing' : winRateVsCompetitor < 50 ? 'contested' : 'winning',
      competitiveIntel,
      competitorMentions,
      winRateVsCompetitor,
      prediction: winRateVsCompetitor < 30 ? 'Competitor likely to win without intervention' : 'Competitive position maintainable',
      experienceOpportunity: competitorMentions * 20,
      actionRequired: winRateVsCompetitor < 50
    };
  };

  // Deal Risk: Early warning signals
  const calculateDealRisk = () => {
    const riskFactors = {
      stakeholderGhosts: buyerIntelligence?.stakeholderGhosts || 2, // Unengaged stakeholders
      lastEngagement: buyerIntelligence?.daysSinceLastEngagement || 5,
      budgetConfirmation: buyerIntelligence?.budgetConfirmed || false,
      decisionTimeframe: buyerIntelligence?.decisionTimeframe || 'unclear'
    };
    
    let riskScore = 0;
    if (riskFactors.stakeholderGhosts > 1) riskScore += 30;
    if (riskFactors.lastEngagement > 7) riskScore += 25;
    if (!riskFactors.budgetConfirmation) riskScore += 25;
    if (riskFactors.decisionTimeframe === 'unclear') riskScore += 20;
    
    return {
      score: 100 - riskScore,
      status: riskScore > 60 ? 'high_risk' : riskScore > 30 ? 'moderate_risk' : 'low_risk',
      riskFactors,
      riskScore,
      prediction: riskScore > 60 ? 'Deal at risk - immediate action required' : 'Deal progressing normally',
      experienceOpportunity: riskScore * 2,
      actionRequired: riskScore > 30
    };
  };

  const indicators = calculateLeadingIndicators();

  // Generate predictions based on indicators
  useEffect(() => {
    const generatePredictions = () => {
      const newPredictions = [];
      
      // Pipeline health prediction
      if (indicators.pipelineHealth.gap > 50) {
        newPredictions.push({
          id: 'pipeline_gap',
          severity: 'critical',
          timeline: '2-3 weeks',
          message: 'Technical validation succeeding but business case failing',
          impact: '$480K at risk in procurement phase',
          action: 'Build CFO translation frameworks',
          experience: 75
        });
      }
      
      // Stakeholder alignment prediction
      const weakest = indicators.stakeholderAlignment.weakestLink;
      if (weakest && weakest[1] < 30) {
        newPredictions.push({
          id: 'stakeholder_gap',
          severity: 'warning',
          timeline: '1-2 weeks',
          message: `${weakest[0].toUpperCase()} engagement critically low`,
          impact: 'Executive review likely to fail',
          action: `Develop ${weakest[0].toUpperCase()} value messaging`,
          experience: 50
        });
      }
      
      // Competitive risk prediction
      if (indicators.competitivePosition.winRateVsCompetitor < 30) {
        newPredictions.push({
          id: 'competitive_risk',
          severity: 'critical',
          timeline: 'Immediate',
          message: 'Losing to competitor in 70% of deals',
          impact: 'Market share erosion accelerating',
          action: 'Build competitive differentiation framework',
          experience: 100
        });
      }
      
      // Deal risk prediction
      if (indicators.dealRisk.riskScore > 60) {
        newPredictions.push({
          id: 'deal_risk',
          severity: 'critical',
          timeline: '1 week',
          message: 'Multiple risk factors detected',
          impact: 'Deal likely to stall or lose',
          action: 'Immediate stakeholder re-engagement required',
          experience: 60
        });
      }
      
      setPredictions(newPredictions);
    };
    
    generatePredictions();
  }, [buyerIntelligence, experienceData]);

  // Get indicator styling
  const getIndicatorStyles = (status) => {
    const styles = {
      healthy: { bg: 'bg-green-900/20', border: 'border-green-500/30', icon: 'text-green-400', text: 'text-green-200' },
      accelerating: { bg: 'bg-green-900/20', border: 'border-green-500/30', icon: 'text-green-400', text: 'text-green-200' },
      aligned: { bg: 'bg-green-900/20', border: 'border-green-500/30', icon: 'text-green-400', text: 'text-green-200' },
      winning: { bg: 'bg-green-900/20', border: 'border-green-500/30', icon: 'text-green-400', text: 'text-green-200' },
      low_risk: { bg: 'bg-green-900/20', border: 'border-green-500/30', icon: 'text-green-400', text: 'text-green-200' },
      
      warning: { bg: 'bg-yellow-900/20', border: 'border-yellow-500/30', icon: 'text-yellow-400', text: 'text-yellow-200' },
      steady: { bg: 'bg-yellow-900/20', border: 'border-yellow-500/30', icon: 'text-yellow-400', text: 'text-yellow-200' },
      gaps: { bg: 'bg-yellow-900/20', border: 'border-yellow-500/30', icon: 'text-yellow-400', text: 'text-yellow-200' },
      contested: { bg: 'bg-yellow-900/20', border: 'border-yellow-500/30', icon: 'text-yellow-400', text: 'text-yellow-200' },
      moderate_risk: { bg: 'bg-yellow-900/20', border: 'border-yellow-500/30', icon: 'text-yellow-400', text: 'text-yellow-200' },
      
      critical: { bg: 'bg-red-900/20', border: 'border-red-500/30', icon: 'text-red-400', text: 'text-red-200' },
      slowing: { bg: 'bg-red-900/20', border: 'border-red-500/30', icon: 'text-red-400', text: 'text-red-200' },
      losing: { bg: 'bg-red-900/20', border: 'border-red-500/30', icon: 'text-red-400', text: 'text-red-200' },
      high_risk: { bg: 'bg-red-900/20', border: 'border-red-500/30', icon: 'text-red-400', text: 'text-red-200' }
    };
    
    return styles[status] || styles.warning;
  };

  return (
    <div className="space-y-6">
      
      {/* Revenue Predictions Alert */}
      {predictions.length > 0 && (
        <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
            Revenue Intelligence Predictions
          </h3>
          
          <div className="space-y-3">
            {predictions.map((prediction) => (
              <motion.div
                key={prediction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/30 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-medium ${
                        prediction.severity === 'critical' ? 'text-red-300' : 'text-yellow-300'
                      }`}>
                        {prediction.timeline} Impact
                      </span>
                      <span className="text-gray-400 text-xs">•</span>
                      <span className="text-gray-300 text-sm">{prediction.impact}</span>
                    </div>
                    <p className="text-white text-sm font-medium mb-1">{prediction.message}</p>
                    <p className="text-blue-300 text-sm">
                      Action: {prediction.action} (+{prediction.experience} exp)
                    </p>
                  </div>
                  <button
                    onClick={() => onActionSelect?.(prediction.action, prediction.experience)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Take Action
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Leading Indicator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Pipeline Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${getIndicatorStyles(indicators.pipelineHealth.status).bg} ${getIndicatorStyles(indicators.pipelineHealth.status).border} border rounded-xl p-5 cursor-pointer hover:scale-[1.02] transition-all`}
          onClick={() => setSelectedIndicator('pipelineHealth')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Activity className={`w-5 h-5 ${getIndicatorStyles(indicators.pipelineHealth.status).icon}`} />
              <h4 className="text-white font-medium">Pipeline Health</h4>
            </div>
            {indicators.pipelineHealth.actionRequired && (
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Technical → Business</span>
              <span className={getIndicatorStyles(indicators.pipelineHealth.status).text}>
                {indicators.pipelineHealth.technicalValidation}% → {indicators.pipelineHealth.businessCaseApproval}%
              </span>
            </div>
            <div className="text-xs text-gray-300">
              Gap: {indicators.pipelineHealth.gap}% translation needed
            </div>
            {indicators.pipelineHealth.experienceOpportunity > 0 && (
              <div className="text-xs text-green-400">
                +{indicators.pipelineHealth.experienceOpportunity} exp available
              </div>
            )}
          </div>
        </motion.div>

        {/* Conversion Velocity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${getIndicatorStyles(indicators.conversionVelocity.status).bg} ${getIndicatorStyles(indicators.conversionVelocity.status).border} border rounded-xl p-5 cursor-pointer hover:scale-[1.02] transition-all`}
          onClick={() => setSelectedIndicator('conversionVelocity')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className={`w-5 h-5 ${getIndicatorStyles(indicators.conversionVelocity.status).icon}`} />
              <h4 className="text-white font-medium">Conversion Velocity</h4>
            </div>
            {indicators.conversionVelocity.actionRequired && (
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Weekly Actions</span>
              <span className={getIndicatorStyles(indicators.conversionVelocity.status).text}>
                {indicators.conversionVelocity.weeklyActions}/{indicators.conversionVelocity.targetActions}
              </span>
            </div>
            <div className="text-xs text-gray-300">
              {indicators.conversionVelocity.status === 'slowing' ? 'Below optimal pace' : 'On track'}
            </div>
            {indicators.conversionVelocity.experienceOpportunity > 0 && (
              <div className="text-xs text-green-400">
                +{indicators.conversionVelocity.experienceOpportunity} exp available
              </div>
            )}
          </div>
        </motion.div>

        {/* Stakeholder Alignment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${getIndicatorStyles(indicators.stakeholderAlignment.status).bg} ${getIndicatorStyles(indicators.stakeholderAlignment.status).border} border rounded-xl p-5 cursor-pointer hover:scale-[1.02] transition-all`}
          onClick={() => setSelectedIndicator('stakeholderAlignment')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Users className={`w-5 h-5 ${getIndicatorStyles(indicators.stakeholderAlignment.status).icon}`} />
              <h4 className="text-white font-medium">Stakeholder Alignment</h4>
            </div>
            {indicators.stakeholderAlignment.actionRequired && (
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            )}
          </div>
          
          <div className="space-y-2">
            <div className="text-sm">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">CTO</span>
                <span className="text-white">{indicators.stakeholderAlignment.coverage.cto}%</span>
              </div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">CFO</span>
                <span className="text-white">{indicators.stakeholderAlignment.coverage.cfo}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">COO</span>
                <span className="text-white">{indicators.stakeholderAlignment.coverage.coo}%</span>
              </div>
            </div>
            {indicators.stakeholderAlignment.experienceOpportunity > 0 && (
              <div className="text-xs text-green-400">
                +{indicators.stakeholderAlignment.experienceOpportunity} exp available
              </div>
            )}
          </div>
        </motion.div>

        {/* Competitive Position */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`${getIndicatorStyles(indicators.competitivePosition.status).bg} ${getIndicatorStyles(indicators.competitivePosition.status).border} border rounded-xl p-5 cursor-pointer hover:scale-[1.02] transition-all`}
          onClick={() => setSelectedIndicator('competitivePosition')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Target className={`w-5 h-5 ${getIndicatorStyles(indicators.competitivePosition.status).icon}`} />
              <h4 className="text-white font-medium">Competitive Position</h4>
            </div>
            {indicators.competitivePosition.actionRequired && (
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Win Rate</span>
              <span className={getIndicatorStyles(indicators.competitivePosition.status).text}>
                {indicators.competitivePosition.winRateVsCompetitor}%
              </span>
            </div>
            <div className="text-xs text-gray-300">
              {indicators.competitivePosition.competitorMentions} competitor mentions
            </div>
            {indicators.competitivePosition.experienceOpportunity > 0 && (
              <div className="text-xs text-green-400">
                +{indicators.competitivePosition.experienceOpportunity} exp available
              </div>
            )}
          </div>
        </motion.div>

        {/* Deal Risk */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${getIndicatorStyles(indicators.dealRisk.status).bg} ${getIndicatorStyles(indicators.dealRisk.status).border} border rounded-xl p-5 cursor-pointer hover:scale-[1.02] transition-all`}
          onClick={() => setSelectedIndicator('dealRisk')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className={`w-5 h-5 ${getIndicatorStyles(indicators.dealRisk.status).icon}`} />
              <h4 className="text-white font-medium">Deal Risk Score</h4>
            </div>
            {indicators.dealRisk.actionRequired && (
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Risk Level</span>
              <span className={getIndicatorStyles(indicators.dealRisk.status).text}>
                {indicators.dealRisk.riskScore}%
              </span>
            </div>
            <div className="text-xs text-gray-300">
              {indicators.dealRisk.riskFactors.stakeholderGhosts} unengaged stakeholders
            </div>
            {indicators.dealRisk.experienceOpportunity > 0 && (
              <div className="text-xs text-green-400">
                +{indicators.dealRisk.experienceOpportunity} exp available
              </div>
            )}
          </div>
        </motion.div>

        {/* Experience Opportunity Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <h4 className="text-white font-medium">Total Opportunity</h4>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl font-bold text-purple-300">
              +{Object.values(indicators).reduce((sum, ind) => sum + (ind.experienceOpportunity || 0), 0)} exp
            </div>
            <div className="text-xs text-gray-300">
              Available from resolving leading indicator gaps
            </div>
            <button
              onClick={() => onActionSelect?.('optimize_all', 250)}
              className="w-full mt-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
            >
              Optimize All Indicators
            </button>
          </div>
        </motion.div>
      </div>

      {/* Detailed Indicator View */}
      <AnimatePresence>
        {selectedIndicator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-900 border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Indicator Analysis</h3>
              <button
                onClick={() => setSelectedIndicator(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="text-white">
                <strong>Prediction:</strong> {indicators[selectedIndicator]?.prediction}
              </div>
              <div className="text-gray-300">
                <strong>Experience Available:</strong> +{indicators[selectedIndicator]?.experienceOpportunity} points
              </div>
              <div className="text-blue-300">
                <strong>Recommended Action:</strong> Build systematic buyer intelligence to address this gap
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Context */}
      <div className="bg-gradient-to-r from-gray-900/50 to-slate-900/50 border border-gray-700 rounded-xl p-4">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            <span className="text-white font-medium">Shadow Intelligence:</span> Leading indicators predict revenue changes 2-4 weeks before they appear in your CRM, enabling proactive buyer intelligence development.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShadowCRMIntegration;