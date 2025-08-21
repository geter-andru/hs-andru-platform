import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  FileText, 
  ArrowRight, 
  X,
  Sparkles,
  Clock
} from 'lucide-react';
import webhookService from '../../services/webhookService';

/**
 * ResourcesReadyNotification - Smart notification for completed resource generation
 * 
 * Features:
 * - Detects both Make.com webhook and fallback system completions
 * - Shows animated notification with resource count
 * - Provides direct navigation to Resource Library
 * - Auto-dismisses after user interaction
 * - Persistent across page navigation until acknowledged
 */

const ResourcesReadyNotification = ({ customerId }) => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [resourceCount, setResourceCount] = useState(0);

  // Check for completed resources
  useEffect(() => {
    const checkForCompletedResources = async () => {
      try {
        // Get current generation session
        const currentSessionId = localStorage.getItem('current_generation_id');
        if (!currentSessionId) return;

        // Check if we've already shown notification for this session
        const notificationShown = localStorage.getItem(`notification_shown_${currentSessionId}`);
        if (notificationShown) return;

        // Check for completed resources
        const resources = await webhookService.getResources(currentSessionId);
        if (resources) {
          // Count available resources
          const count = Object.keys(resources).length;
          
          // Determine resource source (webhook vs fallback)
          const isWebhookGenerated = resources.icp_analysis?.generation_method !== 'template_enhanced_realistic';
          const source = isWebhookGenerated ? 'AI-Generated' : 'Expert Templates';
          
          setResourceCount(count);
          setNotification({
            sessionId: currentSessionId,
            source,
            isWebhook: isWebhookGenerated,
            completedAt: Date.now()
          });
          setIsVisible(true);

          // Mark notification as shown
          localStorage.setItem(`notification_shown_${currentSessionId}`, 'true');
        }
      } catch (error) {
        console.error('Error checking for completed resources:', error);
      }
    };

    // Check immediately and then every 10 seconds
    checkForCompletedResources();
    const interval = setInterval(checkForCompletedResources, 10000);

    return () => clearInterval(interval);
  }, []);

  // Handle navigation to Resource Library
  const handleViewResources = () => {
    setIsVisible(false);
    navigate(`/customer/${customerId}/simplified/resources`);
  };

  // Handle notification dismissal
  const handleDismiss = () => {
    setIsVisible(false);
    // Don't mark as permanently dismissed - user might want to see it again
  };

  if (!notification) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <div className="bg-gradient-to-r from-green-900 to-emerald-900 border border-green-700 rounded-xl shadow-2xl overflow-hidden">
            {/* Header with sparkle effect */}
            <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <CheckCircle className="w-6 h-6 text-white" />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Sparkles className="w-3 h-3 text-yellow-300" />
                    </motion.div>
                  </div>
                  <span className="text-white font-semibold">Resources Ready!</span>
                </div>
                <button
                  onClick={handleDismiss}
                  className="text-green-200 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="mb-3">
                <div className="flex items-center space-x-2 mb-1">
                  <FileText className="w-4 h-4 text-green-400" />
                  <span className="text-green-100 font-medium">
                    {resourceCount} Core Resources Generated
                  </span>
                </div>
                <p className="text-green-200 text-sm">
                  {notification.source} resources are now available in your Resource Library
                </p>
              </div>

              {/* Resource types preview */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-green-800/30 rounded-lg p-2 text-center">
                  <div className="text-xs text-green-300 font-medium">ICP Analysis</div>
                  <div className="text-xs text-green-400">✓ Ready</div>
                </div>
                <div className="bg-green-800/30 rounded-lg p-2 text-center">
                  <div className="text-xs text-green-300 font-medium">Buyer Personas</div>
                  <div className="text-xs text-green-400">✓ Ready</div>
                </div>
                <div className="bg-green-800/30 rounded-lg p-2 text-center">
                  <div className="text-xs text-green-300 font-medium">Empathy Map</div>
                  <div className="text-xs text-green-400">✓ Ready</div>
                </div>
                <div className="bg-green-800/30 rounded-lg p-2 text-center">
                  <div className="text-xs text-green-300 font-medium">Market Assessment</div>
                  <div className="text-xs text-green-400">✓ Ready</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={handleViewResources}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <span>View Resources</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-3 py-2 bg-green-800 hover:bg-green-700 text-green-200 rounded-lg transition-colors text-sm"
                >
                  Later
                </button>
              </div>

              {/* Generation info */}
              <div className="mt-3 pt-3 border-t border-green-700">
                <div className="flex items-center space-x-1 text-xs text-green-300">
                  <Clock className="w-3 h-3" />
                  <span>
                    Generated {notification.isWebhook ? 'via AI' : 'via Expert Templates'} • 
                    Session {notification.sessionId.slice(-6)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResourcesReadyNotification;