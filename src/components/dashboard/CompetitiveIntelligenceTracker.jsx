import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Shield,
  Swords,
  Trophy,
  Eye,
  Clock,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

/**
 * Competitive Intelligence Tracker - NICE-TO-HAVE PHASE
 * 
 * Real-time competitive positioning with alerts for market changes.
 * Tracks competitor movements, win/loss patterns, and differentiation opportunities.
 * Provides actionable intelligence for maintaining competitive advantage.
 */

const CompetitiveIntelligenceTracker = ({
  competitorData = {},
  winLossData = {},
  marketPosition = {},
  onAlertClick,
  onCompetitorClick
}) => {
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [showAlertAnimation, setShowAlertAnimation] = useState(false);

  // Mock competitor intelligence data
  const competitors = [
    {
      id: 'dataflow',
      name: 'DataFlow',
      threat_level: 'high',
      market_share: 32,
      win_rate_against: 45,
      trend: 'increasing',
      strengths: ['Enterprise features', 'Brand recognition', 'Integration ecosystem'],
      weaknesses: ['High price point', 'Complex implementation', 'Poor SMB support'],
      recent_moves: [
        { type: 'product', description: 'Launched AI-powered analytics', impact: 'high', date: '2 days ago' },
        { type: 'pricing', description: 'Introduced aggressive discounting', impact: 'medium', date: '1 week ago' },
        { type: 'partnership', description: 'Partnered with Microsoft', impact: 'high', date: '2 weeks ago' }
      ],
      differentiation_opportunities: [
        'Faster implementation (2 weeks vs 3 months)',
        'Technical founder focus (they target enterprise)',
        'Usage-based pricing (vs annual contracts)'
      ],
      experience_opportunity: 35
    },
    {
      id: 'techvault',
      name: 'TechVault',
      threat_level: 'medium',
      market_share: 18,
      win_rate_against: 65,
      trend: 'stable',
      strengths: ['Low cost', 'Simple UI', 'Quick setup'],
      weaknesses: ['Limited features', 'No enterprise support', 'Poor scalability'],
      recent_moves: [
        { type: 'acquisition', description: 'Acquired SmallCRM', impact: 'low', date: '3 days ago' },
        { type: 'product', description: 'Added basic reporting', impact: 'low', date: '1 month ago' }
      ],
      differentiation_opportunities: [
        'Advanced intelligence features',
        'Series A to B focus (they target seed)',
        'Professional development framework'
      ],
      experience_opportunity: 20
    },
    {
      id: 'revops',
      name: 'RevOps Pro',
      threat_level: 'low',
      market_share: 12,
      win_rate_against: 78,
      trend: 'declining',
      strengths: ['RevOps specific', 'Good documentation'],
      weaknesses: ['Narrow focus', 'Legacy tech stack', 'Poor UX'],
      recent_moves: [
        { type: 'layoffs', description: 'Reduced team by 20%', impact: 'negative', date: '1 week ago' }
      ],
      differentiation_opportunities: [
        'Modern tech stack advantage',
        'Buyer intelligence focus (vs ops only)',
        'Stealth gamification engagement'
      ],
      experience_opportunity: 15
    }
  ];

  // Generate competitive alerts
  useEffect(() => {
    const generateAlerts = () => {
      const newAlerts = [];
      
      // Check for high-threat competitor moves
      competitors.forEach(comp => {
        if (comp.threat_level === 'high' && comp.recent_moves.length > 0) {
          const latestMove = comp.recent_moves[0];
          if (latestMove.impact === 'high') {
            newAlerts.push({
              id: `alert_${comp.id}_${Date.now()}`,
              type: 'competitive_threat',
              severity: 'high',
              competitor: comp.name,
              message: `${comp.name} ${latestMove.description}`,
              action_required: 'Update competitive positioning',
              experience_reward: 25
            });
          }
        }
        
        // Check for win rate declining
        if (comp.win_rate_against < 50 && comp.trend === 'increasing') {
          newAlerts.push({
            id: `alert_winrate_${comp.id}`,
            type: 'win_rate_alert',
            severity: 'medium',
            competitor: comp.name,
            message: `Win rate against ${comp.name} below 50%`,
            action_required: 'Analyze lost deals pattern',
            experience_reward: 20
          });
        }
      });
      
      setAlerts(newAlerts);
      if (newAlerts.length > 0) {
        setShowAlertAnimation(true);
        setTimeout(() => setShowAlertAnimation(false), 3000);
      }
    };
    
    generateAlerts();
  }, []);

  // Calculate competitive position score
  const calculateCompetitiveScore = () => {
    const avgWinRate = competitors.reduce((sum, c) => sum + c.win_rate_against, 0) / competitors.length;
    const marketShareRank = 2; // Assuming we're #2
    const threatLevel = competitors.filter(c => c.threat_level === 'high').length;
    
    return Math.round((avgWinRate * 0.5) + ((4 - marketShareRank) * 10) + ((3 - threatLevel) * 10));
  };

  const getThreatLevelColor = (level) => {
    const colors = {
      high: 'text-red-400',
      medium: 'text-yellow-400',
      low: 'text-green-400'
    };
    return colors[level] || 'text-gray-400';
  };

  const getThreatLevelBg = (level) => {
    const colors = {
      high: 'bg-red-900/30 border-red-500/40',
      medium: 'bg-yellow-900/30 border-yellow-500/40',
      low: 'bg-green-900/30 border-green-500/40'
    };
    return colors[level] || 'bg-gray-900/30 border-gray-500/40';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'increasing') return TrendingUp;
    if (trend === 'declining') return TrendingDown;
    return AlertCircle;
  };

  const handleCompetitorSelect = (competitor) => {
    setSelectedCompetitor(competitor);
    if (onCompetitorClick) {
      onCompetitorClick(competitor);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Competitive Position Overview */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Competitive Position</h3>
              <p className="text-gray-400 text-sm">Real-time market intelligence tracking</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {calculateCompetitiveScore()}/100
            </div>
            <div className="text-sm text-gray-400">Position Score</div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-green-400">
              {competitors.filter(c => c.win_rate_against > 50).length}/{competitors.length}
            </div>
            <div className="text-xs text-gray-400">Winning Against</div>
          </div>
          <div>
            <div className="text-xl font-bold text-yellow-400">
              {alerts.filter(a => a.severity === 'high').length}
            </div>
            <div className="text-xs text-gray-400">Critical Alerts</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-400">
              #{marketPosition.rank || 2}
            </div>
            <div className="text-xs text-gray-400">Market Position</div>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white font-medium flex items-center">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2" />
            Competitive Intelligence Alerts
          </h4>
          
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border cursor-pointer hover:scale-[1.01] transition-all ${
                alert.severity === 'high' 
                  ? 'bg-red-900/30 border-red-500/40' 
                  : 'bg-yellow-900/30 border-yellow-500/40'
              }`}
              onClick={() => onAlertClick?.(alert)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <AlertCircle className={`w-5 h-5 mt-0.5 ${
                    alert.severity === 'high' ? 'text-red-400' : 'text-yellow-400'
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
                  <ChevronRight className="w-4 h-4 text-gray-400 mt-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Competitor Cards */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Competitor Analysis</h4>
        
        {competitors.map((competitor, index) => {
          const TrendIcon = getTrendIcon(competitor.trend);
          
          return (
            <motion.div
              key={competitor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${getThreatLevelBg(competitor.threat_level)} border rounded-xl p-5 cursor-pointer hover:scale-[1.01] transition-all`}
              onClick={() => handleCompetitorSelect(competitor)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-black/20">
                    <Swords className={`w-5 h-5 ${getThreatLevelColor(competitor.threat_level)}`} />
                  </div>
                  <div>
                    <h5 className="text-white font-semibold text-lg">{competitor.name}</h5>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs font-medium ${getThreatLevelColor(competitor.threat_level)}`}>
                        {competitor.threat_level.toUpperCase()} THREAT
                      </span>
                      <TrendIcon className={`w-3 h-3 ${
                        competitor.trend === 'increasing' ? 'text-red-400' : 
                        competitor.trend === 'declining' ? 'text-green-400' : 
                        'text-yellow-400'
                      }`} />
                    </div>
                  </div>
                </div>
                
                {/* Win Rate */}
                <div className="text-right">
                  <div className={`text-xl font-bold ${
                    competitor.win_rate_against > 50 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {competitor.win_rate_against}%
                  </div>
                  <div className="text-xs text-gray-400">Win Rate</div>
                </div>
              </div>

              {/* Market Share Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Market Share</span>
                  <span className="text-white">{competitor.market_share}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      competitor.threat_level === 'high' ? 'bg-red-500' :
                      competitor.threat_level === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${competitor.market_share}%` }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  />
                </div>
              </div>

              {/* Recent Activity */}
              {competitor.recent_moves.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-2">Latest Move:</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-200">
                        {competitor.recent_moves[0].description}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {competitor.recent_moves[0].date}
                    </span>
                  </div>
                </div>
              )}

              {/* Differentiation Opportunities */}
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-2">Key Differentiation:</div>
                <div className="text-sm text-blue-300">
                  {competitor.differentiation_opportunities[0]}
                </div>
              </div>

              {/* Experience Opportunity */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-400">Competitive Analysis</span>
                </div>
                <span className="text-sm text-green-400 font-medium">
                  +{competitor.experience_opportunity} exp available
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Competitive Intelligence Summary */}
      <div className="bg-gradient-to-r from-gray-900/50 to-slate-900/50 border border-gray-700 rounded-xl p-4">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            <span className="text-white font-medium">Competitive Intelligence:</span> Every competitor analysis action provides experience while building systematic understanding of market dynamics and differentiation opportunities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompetitiveIntelligenceTracker;