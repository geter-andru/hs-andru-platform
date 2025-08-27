import React, { useState, useEffect } from 'react';
import { Bell, TrendingUp, Target, Award, AlertCircle, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdvancedNotificationSystem = ({ assessmentData, userProgress, onNotificationAction }) => {
  const [notifications, setNotifications] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    generateNotifications();
  }, [assessmentData, userProgress]);

  const generateNotifications = () => {
    const newNotifications = [];
    
    // Milestone achievements
    if (userProgress?.toolsCompleted >= 1) {
      newNotifications.push({
        id: 'first-tool-complete',
        type: 'achievement',
        priority: 'high',
        icon: Award,
        title: 'First Revenue Tool Completed!',
        message: 'You\'ve completed your first revenue intelligence analysis. Keep momentum going!',
        action: 'View Progress',
        actionType: 'navigate',
        actionData: { path: '/dashboard/progress' },
        timestamp: Date.now(),
        read: false
      });
    }

    // Critical urgency alerts
    if (assessmentData?.score < 40) {
      newNotifications.push({
        id: 'critical-score-alert',
        type: 'urgent',
        priority: 'critical',
        icon: AlertCircle,
        title: 'Critical Revenue Gaps Detected',
        message: `${assessmentData.challenges} urgent issues require immediate attention. Delaying action costs $${((assessmentData.score * 50000 / 12) * 0.15 / 10).toLocaleString()}/3 days.`,
        action: 'Take Action Now',
        actionType: 'navigate',
        actionData: { path: '/customer/:customerId/simplified/icp' },
        timestamp: Date.now() - 300000, // 5 minutes ago
        read: false
      });
    }

    // Progress celebrations
    if (userProgress?.completionRate > 50) {
      newNotifications.push({
        id: 'progress-milestone',
        type: 'progress',
        priority: 'medium',
        icon: TrendingUp,
        title: 'Great Progress!',
        message: `You're ${userProgress.completionRate}% complete. Your revenue intelligence is building momentum.`,
        action: 'See Next Steps',
        actionType: 'modal',
        actionData: { modal: 'next-steps' },
        timestamp: Date.now() - 600000, // 10 minutes ago
        read: false
      });
    }

    // ROI achievement alerts
    const estimatedROI = ((assessmentData.score * 50000 * 0.15) / 497) * 100;
    if (estimatedROI > 1000) {
      newNotifications.push({
        id: 'high-roi-alert',
        type: 'insight',
        priority: 'high',
        icon: Target,
        title: 'High ROI Opportunity Detected',
        message: `Your profile shows ${Math.round(estimatedROI)}% ROI potential. Consider immediate implementation.`,
        action: 'Calculate Full Impact',
        actionType: 'navigate',
        actionData: { path: '/customer/:customerId/simplified/cost-calculator' },
        timestamp: Date.now() - 900000, // 15 minutes ago
        read: false
      });
    }

    // Team collaboration reminders
    if (assessmentData?.score < 60) {
      newNotifications.push({
        id: 'team-alignment',
        type: 'reminder',
        priority: 'medium',
        icon: Bell,
        title: 'Share with Your Team',
        message: 'Revenue challenges require stakeholder alignment. Share insights with CTO and VP Sales.',
        action: 'Share Now',
        actionType: 'modal',
        actionData: { modal: 'team-sharing' },
        timestamp: Date.now() - 1200000, // 20 minutes ago
        read: false
      });
    }

    // Success pathway guidance
    newNotifications.push({
      id: 'pathway-guidance',
      type: 'guidance',
      priority: 'low',
      icon: CheckCircle,
      title: 'Your Success Pathway is Ready',
      message: 'Personalized 90-day implementation plan generated based on your assessment.',
      action: 'View Pathway',
      actionType: 'navigate',
      actionData: { path: '/dashboard/success-pathway' },
      timestamp: Date.now() - 1800000, // 30 minutes ago
      read: true
    });

    setNotifications(newNotifications.sort((a, b) => b.timestamp - a.timestamp));
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'critical') return 'from-red-500 to-red-600';
    if (type === 'achievement') return 'from-green-500 to-green-600';
    if (type === 'insight') return 'from-cyan-500 to-cyan-600';
    if (type === 'urgent') return 'from-orange-500 to-orange-600';
    return 'from-gray-500 to-gray-600';
  };

  const handleNotificationAction = (notification) => {
    if (notification.actionType === 'navigate') {
      const path = notification.actionData.path.replace(':customerId', assessmentData.sessionId);
      onNotificationAction?.('navigate', path);
    } else if (notification.actionType === 'modal') {
      onNotificationAction?.('modal', notification.actionData.modal);
    }

    // Mark as read
    setNotifications(prev => prev.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));
  };

  const dismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const visibleNotifications = showAll ? notifications : notifications.slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Notification Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="w-5 h-5 text-cyan-400" />
          <h3 className="font-medium text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        
        {notifications.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
          >
            {showAll ? 'Show Less' : `Show All (${notifications.length})`}
          </button>
        )}
      </div>

      {/* Notifications List */}
      <AnimatePresence>
        <div className="space-y-3">
          {visibleNotifications.map((notification, index) => {
            const IconComponent = notification.icon;
            const gradientColor = getNotificationColor(notification.type, notification.priority);
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gray-800/50 rounded-lg p-4 border border-gray-700 ${
                  !notification.read ? 'border-l-4 border-l-cyan-500' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${gradientColor}/20`}>
                    <IconComponent className={`w-4 h-4 ${
                      notification.priority === 'critical' ? 'text-red-400' :
                      notification.type === 'achievement' ? 'text-green-400' :
                      notification.type === 'insight' ? 'text-cyan-400' :
                      'text-gray-400'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-medium ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                          {notification.title}
                        </h4>
                        <p className="text-gray-400 text-sm mt-1">
                          {notification.message}
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => dismissNotification(notification.id)}
                        className="text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {notification.action && (
                      <button
                        onClick={() => handleNotificationAction(notification)}
                        className={`mt-3 px-3 py-1 rounded text-xs font-medium transition-colors ${
                          notification.priority === 'critical' ? 
                          'bg-red-600 hover:bg-red-700 text-white' :
                          'bg-cyan-600 hover:bg-cyan-700 text-white'
                        }`}
                      >
                        {notification.action}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>

      {/* Notification Settings */}
      <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">Real-time notifications</span>
          <input
            type="checkbox"
            defaultChecked
            className="rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedNotificationSystem;