import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  User, 
  UserCheck, 
  UserX,
  Crown,
  Briefcase,
  DollarSign,
  Shield,
  Target,
  MessageSquare,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

/**
 * Stakeholder Relationship Map - NICE-TO-HAVE PHASE
 * 
 * Visual mapping of stakeholder relationships with engagement scoring.
 * Tracks decision maker influence, engagement levels, and relationship health.
 * Identifies gaps in stakeholder coverage and provides action recommendations.
 */

const StakeholderRelationshipMap = ({
  stakeholderData = {},
  dealStages = {},
  onStakeholderClick,
  onActionClick
}) => {
  const [selectedRole, setSelectedRole] = useState('all');
  const [hoveredStakeholder, setHoveredStakeholder] = useState(null);

  // Mock stakeholder data with engagement scoring
  const stakeholders = [
    {
      id: 'cto_techflow',
      name: 'Alex Chen',
      title: 'CTO',
      company: 'TechFlow Enterprise',
      role_category: 'technical',
      influence_level: 85,
      engagement_score: 72,
      relationship_status: 'champion',
      last_interaction: '2 days ago',
      interaction_count: 12,
      sentiment: 'positive',
      decision_power: 'high',
      concerns: ['Integration complexity', 'Security requirements'],
      interests: ['API flexibility', 'Performance metrics'],
      next_action: {
        type: 'technical_demo',
        description: 'Schedule deep-dive technical session',
        experience_reward: 20
      }
    },
    {
      id: 'cfo_techflow',
      name: 'Maria Rodriguez',
      title: 'CFO',
      company: 'TechFlow Enterprise',
      role_category: 'financial',
      influence_level: 90,
      engagement_score: 28,
      relationship_status: 'skeptical',
      last_interaction: '2 weeks ago',
      interaction_count: 3,
      sentiment: 'neutral',
      decision_power: 'very_high',
      concerns: ['ROI timeline', 'Budget allocation', 'Cost overruns'],
      interests: ['Cost savings', 'Efficiency gains'],
      next_action: {
        type: 'roi_presentation',
        description: 'Present customized ROI analysis',
        experience_reward: 30
      }
    },
    {
      id: 'vp_sales_techflow',
      name: 'James Williams',
      title: 'VP Sales',
      company: 'TechFlow Enterprise',
      role_category: 'business',
      influence_level: 65,
      engagement_score: 85,
      relationship_status: 'advocate',
      last_interaction: '1 day ago',
      interaction_count: 18,
      sentiment: 'very_positive',
      decision_power: 'medium',
      concerns: ['Team adoption', 'Training requirements'],
      interests: ['Revenue acceleration', 'Sales productivity'],
      next_action: {
        type: 'success_stories',
        description: 'Share relevant customer success stories',
        experience_reward: 15
      }
    },
    {
      id: 'coo_dataflow',
      name: 'Sarah Kim',
      title: 'COO',
      company: 'DataCorp Implementation',
      role_category: 'operations',
      influence_level: 75,
      engagement_score: 45,
      relationship_status: 'evaluating',
      last_interaction: '5 days ago',
      interaction_count: 7,
      sentiment: 'neutral',
      decision_power: 'high',
      concerns: ['Implementation timeline', 'Change management'],
      interests: ['Process optimization', 'Operational efficiency'],
      next_action: {
        type: 'implementation_plan',
        description: 'Provide detailed implementation roadmap',
        experience_reward: 25
      }
    },
    {
      id: 'head_product_cloudscale',
      name: 'Michael Zhang',
      title: 'Head of Product',
      company: 'CloudScale Solutions',
      role_category: 'technical',
      influence_level: 70,
      engagement_score: 62,
      relationship_status: 'interested',
      last_interaction: '3 days ago',
      interaction_count: 9,
      sentiment: 'positive',
      decision_power: 'medium',
      concerns: ['Product roadmap alignment', 'Feature gaps'],
      interests: ['Innovation potential', 'Competitive advantage'],
      next_action: {
        type: 'product_alignment',
        description: 'Discuss product roadmap alignment',
        experience_reward: 18
      }
    }
  ];

  // Calculate stakeholder coverage metrics
  const calculateCoverageMetrics = () => {
    const roleCategories = ['technical', 'financial', 'business', 'operations'];
    const coverage = {};
    
    roleCategories.forEach(role => {
      const roleStakeholders = stakeholders.filter(s => s.role_category === role);
      const avgEngagement = roleStakeholders.length > 0
        ? roleStakeholders.reduce((sum, s) => sum + s.engagement_score, 0) / roleStakeholders.length
        : 0;
      coverage[role] = avgEngagement;
    });
    
    return coverage;
  };

  const coverage = calculateCoverageMetrics();

  // Get relationship status color and icon
  const getRelationshipStyle = (status) => {
    const styles = {
      champion: { color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-500/40', icon: UserCheck },
      advocate: { color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-500/40', icon: UserCheck },
      interested: { color: 'text-purple-400', bg: 'bg-purple-900/30', border: 'border-purple-500/40', icon: User },
      evaluating: { color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-500/40', icon: User },
      skeptical: { color: 'text-orange-400', bg: 'bg-orange-900/30', border: 'border-orange-500/40', icon: AlertTriangle },
      blocker: { color: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-500/40', icon: UserX }
    };
    return styles[status] || styles.evaluating;
  };

  const getRoleIcon = (category) => {
    const icons = {
      technical: Shield,
      financial: DollarSign,
      business: Briefcase,
      operations: Target
    };
    return icons[category] || User;
  };

  const getDecisionPowerIcon = (power) => {
    if (power === 'very_high') return Crown;
    if (power === 'high') return TrendingUp;
    return User;
  };

  const filteredStakeholders = selectedRole === 'all' 
    ? stakeholders 
    : stakeholders.filter(s => s.role_category === selectedRole);

  return (
    <div className="space-y-6">
      
      {/* Stakeholder Coverage Overview */}
      <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Stakeholder Relationships</h3>
              <p className="text-gray-400 text-sm">Multi-threading and engagement tracking</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {stakeholders.length}
            </div>
            <div className="text-sm text-gray-400">Active Contacts</div>
          </div>
        </div>

        {/* Role Coverage Metrics */}
        <div className="grid grid-cols-4 gap-3">
          {Object.entries(coverage).map(([role, score]) => {
            const RoleIcon = getRoleIcon(role);
            return (
              <div key={role} className="text-center">
                <div className="flex justify-center mb-2">
                  <RoleIcon className={`w-5 h-5 ${score > 60 ? 'text-green-400' : score > 30 ? 'text-yellow-400' : 'text-red-400'}`} />
                </div>
                <div className={`text-lg font-bold ${score > 60 ? 'text-green-400' : score > 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {Math.round(score)}%
                </div>
                <div className="text-xs text-gray-400 capitalize">{role}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Filter */}
      <div className="flex space-x-2">
        <button
          onClick={() => setSelectedRole('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            selectedRole === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All Roles ({stakeholders.length})
        </button>
        {['technical', 'financial', 'business', 'operations'].map(role => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
              selectedRole === role ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {role} ({stakeholders.filter(s => s.role_category === role).length})
          </button>
        ))}
      </div>

      {/* Stakeholder Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredStakeholders.map((stakeholder, index) => {
          const style = getRelationshipStyle(stakeholder.relationship_status);
          const StatusIcon = style.icon;
          const RoleIcon = getRoleIcon(stakeholder.role_category);
          const PowerIcon = getDecisionPowerIcon(stakeholder.decision_power);
          
          return (
            <motion.div
              key={stakeholder.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`${style.bg} ${style.border} border rounded-xl p-5 cursor-pointer hover:scale-[1.02] transition-all`}
              onClick={() => onStakeholderClick?.(stakeholder)}
              onMouseEnter={() => setHoveredStakeholder(stakeholder.id)}
              onMouseLeave={() => setHoveredStakeholder(null)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-black/20">
                    <RoleIcon className={`w-5 h-5 ${style.color}`} />
                  </div>
                  <div>
                    <h5 className="text-white font-semibold flex items-center">
                      {stakeholder.name}
                      {stakeholder.decision_power === 'very_high' && (
                        <Crown className="w-4 h-4 text-yellow-400 ml-2" />
                      )}
                    </h5>
                    <div className="text-gray-400 text-sm">{stakeholder.title}</div>
                    <div className="text-gray-500 text-xs">{stakeholder.company}</div>
                  </div>
                </div>
                
                {/* Engagement Score */}
                <div className="text-right">
                  <div className={`text-xl font-bold ${
                    stakeholder.engagement_score > 70 ? 'text-green-400' : 
                    stakeholder.engagement_score > 40 ? 'text-yellow-400' : 
                    'text-red-400'
                  }`}>
                    {stakeholder.engagement_score}%
                  </div>
                  <div className="text-xs text-gray-400">Engagement</div>
                </div>
              </div>

              {/* Influence & Status */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-black/20 rounded-lg p-2">
                  <div className="text-xs text-gray-400 mb-1">Influence</div>
                  <div className="flex items-center space-x-2">
                    <PowerIcon className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-medium">{stakeholder.influence_level}%</span>
                  </div>
                </div>
                <div className="bg-black/20 rounded-lg p-2">
                  <div className="text-xs text-gray-400 mb-1">Status</div>
                  <div className="flex items-center space-x-2">
                    <StatusIcon className={`w-4 h-4 ${style.color}`} />
                    <span className={`text-sm font-medium ${style.color} capitalize`}>
                      {stakeholder.relationship_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interaction History */}
              <div className="flex items-center justify-between mb-3 text-sm">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{stakeholder.interaction_count} interactions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">{stakeholder.last_interaction}</span>
                </div>
              </div>

              {/* Key Concern */}
              {stakeholder.concerns.length > 0 && (
                <div className="bg-black/20 rounded-lg p-2 mb-3">
                  <div className="text-xs text-gray-400 mb-1">Primary Concern:</div>
                  <div className="text-sm text-orange-300">{stakeholder.concerns[0]}</div>
                </div>
              )}

              {/* Next Action */}
              <div 
                className="flex items-center justify-between pt-3 border-t border-gray-700 hover:bg-black/10 -mx-2 px-2 py-1 rounded transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onActionClick?.(stakeholder.next_action);
                }}
              >
                <div>
                  <div className="text-xs text-gray-400">Recommended Action:</div>
                  <div className="text-sm text-blue-300">{stakeholder.next_action.description}</div>
                </div>
                <div className="text-green-400 text-sm font-medium">
                  +{stakeholder.next_action.experience_reward} exp
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Relationship Insights */}
      <div className="bg-gradient-to-r from-gray-900/50 to-slate-900/50 border border-gray-700 rounded-xl p-4">
        <h4 className="text-white font-medium mb-3 flex items-center">
          <Target className="w-4 h-4 text-blue-400 mr-2" />
          Stakeholder Intelligence Insights
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Coverage Gap</div>
            <div className="text-red-400 font-medium">
              CFO engagement critically low (28%)
            </div>
          </div>
          <div>
            <div className="text-gray-400">Strongest Advocate</div>
            <div className="text-green-400 font-medium">
              VP Sales - 85% engagement
            </div>
          </div>
          <div>
            <div className="text-gray-400">Action Priority</div>
            <div className="text-yellow-400 font-medium">
              Schedule CFO ROI presentation
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Context */}
      <div className="bg-gradient-to-r from-gray-900/50 to-slate-900/50 border border-gray-700 rounded-xl p-4">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            <span className="text-white font-medium">Relationship Intelligence:</span> Every stakeholder interaction earns experience while building systematic understanding of decision dynamics and influence patterns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StakeholderRelationshipMap;