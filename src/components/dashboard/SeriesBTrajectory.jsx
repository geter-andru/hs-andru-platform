import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock,
  DollarSign,
  Users,
  Zap,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Calendar,
  BarChart3
} from 'lucide-react';

/**
 * Series B Trajectory - PREDICTIVE INTELLIGENCE
 * 
 * Forward-looking intelligence for Sarah Chen (Technical Founder)
 * Shows "Will we make our Series B timeline?" with specific predictions
 * Implements predictive analytics and trend analysis
 */

const SeriesBTrajectory = ({
  currentPace = "8 months to readiness",
  targetPace = "6 months", 
  currentProgress = 68,
  blockers = [],
  accelerators = [],
  monthlyMetrics = [],
  compactMode = false
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');

  // Mock predictive data for Sarah's Series B trajectory
  const trajectoryData = {
    current: {
      arrRunRate: 2100000, // $2.1M
      growthRate: 12, // 12% monthly
      burnRate: 180000, // $180K monthly
      customersCount: 85,
      teamSize: 32
    },
    projections: {
      '3months': {
        arrRunRate: 2800000,
        readinessScore: 75,
        probability: 'medium',
        keyMilestones: ['Product-market fit validation', 'Customer success metrics']
      },
      '6months': {
        arrRunRate: 4200000,
        readinessScore: 88,
        probability: 'high',
        keyMilestones: ['Strong growth metrics', 'Team scaling complete']
      },
      '12months': {
        arrRunRate: 7500000,
        readinessScore: 95,
        probability: 'very_high',
        keyMilestones: ['Series B ready', 'Market leadership']
      }
    }
  };

  const defaultBlockers = blockers.length > 0 ? blockers : [
    {
      name: "Customer retention needs improvement",
      impact: "High",
      timeToResolve: "2-3 months",
      status: "active",
      description: "Churn rate at 8% monthly, need <5% for Series B"
    },
    {
      name: "Pipeline velocity 20% below target", 
      impact: "Medium",
      timeToResolve: "1-2 months", 
      status: "active",
      description: "Sales cycle 4 months vs target 3 months"
    },
    {
      name: "Engineering team scaling challenges",
      impact: "Low",
      timeToResolve: "3-4 months",
      status: "monitoring", 
      description: "Need 15 more engineers for enterprise features"
    }
  ];

  const defaultAccelerators = accelerators.length > 0 ? accelerators : [
    {
      name: "Strong product-market fit signals",
      impact: "High", 
      timeline: "Active now",
      description: "NPS 65+, strong usage metrics, organic growth"
    },
    {
      name: "Technical team execution excellence",
      impact: "High",
      timeline: "Active now", 
      description: "98% uptime, fast feature delivery, low technical debt"
    },
    {
      name: "Market timing and demand",
      impact: "Medium",
      timeline: "Next 6 months",
      description: "Industry growth 25% YoY, funding environment improving"
    }
  ];

  const getTrajectoryStatus = () => {
    if (currentProgress >= 80) return { status: 'on_track', color: 'green', message: 'Strong trajectory' };
    if (currentProgress >= 60) return { status: 'at_risk', color: 'yellow', message: 'Monitor closely' }; 
    return { status: 'behind', color: 'red', message: 'Action required' };
  };

  const trajectory = getTrajectoryStatus();
  const projection = trajectoryData.projections[selectedTimeframe];

  const getStatusColor = (status) => {
    switch (status) {
      case 'on_track': return 'text-green-400 bg-green-900/30 border-green-500/50';
      case 'at_risk': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/50';
      case 'behind': return 'text-red-400 bg-red-900/30 border-red-500/50';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500/50';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400'; 
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  if (compactMode) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white flex items-center">
            <TrendingUp className="w-4 h-4 text-purple-400 mr-2" />
            Series B Trajectory
          </h3>
          <div className={`px-2 py-1 rounded text-xs border ${getStatusColor(trajectory.status)}`}>
            {trajectory.message}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Current Pace</div>
            <div className="text-white font-medium">{currentPace}</div>
          </div>
          <div>
            <div className="text-gray-400">Target</div>
            <div className="text-purple-300 font-medium">{targetPace}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <BarChart3 className="w-6 h-6 text-purple-400 mr-3" />
          Series B Trajectory Analysis
        </h2>
        <div className={`px-3 py-1 rounded-lg text-sm border ${getStatusColor(trajectory.status)}`}>
          {trajectory.message}
        </div>
      </div>

      {/* Timeline Selector */}
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-sm text-gray-400">Projection Timeline:</span>
        {['3months', '6months', '12months'].map(timeframe => (
          <button
            key={timeframe}
            onClick={() => setSelectedTimeframe(timeframe)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedTimeframe === timeframe
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {timeframe === '3months' ? '3 Months' : timeframe === '6months' ? '6 Months' : '12 Months'}
          </button>
        ))}
      </div>

      {/* Key Projections */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-black/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-gray-400">Projected ARR</span>
          </div>
          <div className="text-2xl font-bold text-white">
            ${(projection.arrRunRate / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-gray-400">
            From current ${(trajectoryData.current.arrRunRate / 1000000).toFixed(1)}M
          </div>
          <div className="flex items-center space-x-1 mt-2">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span className="text-green-400 text-xs">
              {trajectoryData.current.growthRate}% monthly growth
            </span>
          </div>
        </div>

        <div className="bg-black/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-purple-400" />
            <span className="text-gray-400">Readiness Score</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {projection.readinessScore}%
          </div>
          <div className="text-xs text-gray-400">
            From current {currentProgress}%
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
            <motion.div
              className="bg-purple-500 h-2 rounded-full"
              initial={{ width: `${currentProgress}%` }}
              animate={{ width: `${projection.readinessScore}%` }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="bg-black/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400">Success Probability</span>
          </div>
          <div className="text-2xl font-bold text-white capitalize">
            {projection.probability.replace('_', ' ')}
          </div>
          <div className="text-xs text-gray-400">
            Based on current trajectory
          </div>
          <div className="flex items-center space-x-1 mt-2">
            <Zap className="w-3 h-3 text-blue-400" />
            <span className="text-blue-300 text-xs">
              Key milestones tracked
            </span>
          </div>
        </div>
      </div>

      {/* Blockers vs Accelerators */}
      <div className="grid grid-cols-2 gap-6">
        {/* Current Blockers */}
        <div>
          <h4 className="text-red-400 font-medium mb-4 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Current Blockers ({defaultBlockers.length})
          </h4>
          <div className="space-y-3">
            {defaultBlockers.map((blocker, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-red-900/20 border border-red-500/30 rounded-lg p-3"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-red-300">{blocker.name}</div>
                  <span className={`text-xs px-2 py-0.5 rounded ${getImpactColor(blocker.impact)}`}>
                    {blocker.impact}
                  </span>
                </div>
                <div className="text-sm text-gray-300 mb-1">{blocker.description}</div>
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <span>Resolve: {blocker.timeToResolve}</span>
                  <span className="capitalize">Status: {blocker.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key Accelerators */}
        <div>
          <h4 className="text-green-400 font-medium mb-4 flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Key Accelerators ({defaultAccelerators.length})
          </h4>
          <div className="space-y-3">
            {defaultAccelerators.map((accelerator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-green-900/20 border border-green-500/30 rounded-lg p-3"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-green-300">{accelerator.name}</div>
                  <span className={`text-xs px-2 py-0.5 rounded ${getImpactColor(accelerator.impact)}`}>
                    {accelerator.impact}
                  </span>
                </div>
                <div className="text-sm text-gray-300 mb-1">{accelerator.description}</div>
                <div className="text-xs text-gray-400">Timeline: {accelerator.timeline}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Milestones */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <h4 className="text-white font-medium mb-3 flex items-center">
          <Calendar className="w-4 h-4 text-blue-400 mr-2" />
          Next Key Milestones ({selectedTimeframe})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {projection.keyMilestones.map((milestone, index) => (
            <div key={index} className="flex items-center space-x-3">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">{milestone}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Founder Summary */}
      <div className="mt-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
        <h4 className="text-purple-300 font-medium mb-2">Technical Founder Focus</h4>
        <p className="text-purple-200 text-sm">
          <strong>Current Assessment:</strong> {trajectory.status === 'on_track' 
            ? 'Strong execution on technical and product fronts is enabling healthy Series B trajectory. Focus on scaling sales processes and team.'
            : trajectory.status === 'at_risk'
            ? 'Technical foundation is solid but sales execution needs attention. Address customer retention and pipeline velocity for Series B readiness.'
            : 'Immediate action required on customer success and growth metrics. Technical team can support with automation and product improvements.'
          }
        </p>
        <div className="mt-2 text-xs text-purple-300/80">
          <strong>Recommendation:</strong> {trajectory.status === 'behind' 
            ? 'Focus engineering resources on customer success tools and sales automation for next 60 days'
            : 'Maintain current technical execution while building systematic sales processes'
          }
        </div>
      </div>
    </div>
  );
};

export default SeriesBTrajectory;