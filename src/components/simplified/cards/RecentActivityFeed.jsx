import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, TrendingUp, FileText, Calculator, Target, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * RecentActivityFeed - Live activity stream with real-time updates
 * Features:
 * - Real-time activity updates with timestamps
 * - Activity type categorization with icons
 * - Interactive items with hover effects
 * - Expandable details for complex activities
 * - Smart filtering and priority sorting
 */

const RecentActivityFeed = ({
  maxItems = 5,
  showTimestamps = true,
  enableFiltering = true,
  className = ''
}) => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');
  const [expandedItem, setExpandedItem] = useState(null);

  // Generate realistic activity data - professional colors only
  const generateActivities = () => {
    const activityTypes = [
      {
        type: 'icp_analysis',
        icon: Target,
        color: 'text-blue-400',
        bgColor: 'bg-gray-800/50',
        title: 'Completed ICP analysis for TechCorp',
        details: 'Enterprise segment, 95% fit score, recommended for immediate outreach',
        priority: 'high'
      },
      {
        type: 'cost_calculation',
        icon: Calculator,
        color: 'text-gray-300',
        bgColor: 'bg-gray-800/50',
        title: 'Updated financial model',
        details: 'Adjusted growth projections, $125K opportunity identified',
        priority: 'medium'
      },
      {
        type: 'business_case',
        icon: FileText,
        color: 'text-purple-400',
        bgColor: 'bg-gray-800/50',
        title: 'Generated business case proposal',
        details: 'ROI analysis complete, 18-month payback period',
        priority: 'high'
      },
      {
        type: 'insight',
        icon: TrendingUp,
        color: 'text-blue-400',
        bgColor: 'bg-gray-800/50',
        title: 'AI insight generated',
        details: 'Trend analysis suggests focusing on mid-market segment',
        priority: 'medium'
      },
      {
        type: 'review',
        icon: Eye,
        color: 'text-gray-400',
        bgColor: 'bg-gray-800/50',
        title: 'Reviewed competitor analysis',
        details: 'Updated positioning strategy based on market research',
        priority: 'low'
      },
      {
        type: 'milestone',
        icon: CheckCircle,
        color: 'text-gray-300',
        bgColor: 'bg-gray-800/50',
        title: 'Milestone achieved',
        details: 'Foundation phase completed, advancing to Growth tier',
        priority: 'high'
      }
    ];

    return activityTypes.map((activity, index) => ({
      id: `activity-${index}`,
      ...activity,
      timestamp: new Date(Date.now() - (index * 2.5 * 60 * 60 * 1000)), // Stagger by 2.5 hours
      isNew: index < 2
    }));
  };

  // Initialize activities
  useEffect(() => {
    setActivities(generateActivities());
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new activity (10% chance every 30 seconds)
      if (Math.random() < 0.1) {
        const newActivity = generateActivities()[Math.floor(Math.random() * 6)];
        setActivities(prev => [
          {
            ...newActivity,
            id: `activity-${Date.now()}`,
            timestamp: new Date(),
            isNew: true
          },
          ...prev.slice(0, maxItems - 1)
        ]);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [maxItems]);

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  // Get filter options
  const filterOptions = [
    { value: 'all', label: 'All', count: activities.length },
    { value: 'icp_analysis', label: 'ICP', count: activities.filter(a => a.type === 'icp_analysis').length },
    { value: 'cost_calculation', label: 'Finance', count: activities.filter(a => a.type === 'cost_calculation').length },
    { value: 'business_case', label: 'Cases', count: activities.filter(a => a.type === 'business_case').length }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter Tabs */}
      {enableFiltering && (
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                filter === option.value
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {option.label}
              {option.count > 0 && (
                <span className="ml-1 text-xs opacity-75">({option.count})</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Activity List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {filteredActivities.slice(0, maxItems).map((activity, index) => {
            const IconComponent = activity.icon;
            const isExpanded = expandedItem === activity.id;
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`relative p-3 rounded-lg border border-gray-700 cursor-pointer transition-all duration-200 hover:border-gray-600 hover:bg-gray-800/50 ${
                  activity.isNew ? 'ring-1 ring-blue-500/30' : ''
                } ${activity.bgColor}`}
                onClick={() => setExpandedItem(isExpanded ? null : activity.id)}
              >
                {/* New Activity Indicator */}
                {activity.isNew && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                )}

                <div className="flex items-start space-x-3">
                  {/* Activity Icon */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center ${activity.bgColor}`}>
                    <IconComponent className={`w-4 h-4 ${activity.color}`} />
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white truncate">
                        {activity.title}
                      </p>
                      {showTimestamps && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimestamp(activity.timestamp)}</span>
                        </div>
                      )}
                    </div>

                    {/* Priority Indicator */}
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.priority === 'high' ? 'bg-purple-400' :
                        activity.priority === 'medium' ? 'bg-blue-400' :
                        'bg-gray-400'
                      }`} />
                      <span className="text-xs text-gray-400 capitalize">
                        {activity.priority} priority
                      </span>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-3 pt-3 border-t border-gray-600"
                        >
                          <p className="text-sm text-gray-300">{activity.details}</p>
                          <div className="flex space-x-2 mt-2">
                            <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors">
                              View Details
                            </button>
                            <button className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors">
                              Take Action
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* View All Button */}
      {activities.length > maxItems && (
        <button className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 border border-gray-700 hover:border-gray-600 rounded-lg transition-colors">
          View All Activities ({activities.length})
        </button>
      )}

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No recent activities</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivityFeed;