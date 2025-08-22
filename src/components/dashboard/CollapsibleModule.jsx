import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Minimize2, 
  Maximize2,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

/**
 * Collapsible Module - POLISH PHASE
 * 
 * Reduces cognitive overload by making modules collapsible with smart defaults.
 * Provides priority-based visibility and focused viewing modes.
 * Maintains all functionality while improving information density.
 */

const CollapsibleModule = ({
  title,
  subtitle,
  icon: IconComponent,
  children,
  defaultExpanded = true,
  priority = 'medium', // high, medium, low
  alertCount = 0,
  lastUpdated,
  compact = false,
  onToggle,
  actionCount = 0,
  experienceAvailable = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isCompact, setIsCompact] = useState(compact);

  useEffect(() => {
    setIsExpanded(defaultExpanded);
  }, [defaultExpanded]);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const getPriorityStyles = () => {
    switch (priority) {
      case 'high':
        return {
          border: 'border-red-500/40',
          headerBg: 'bg-red-900/20',
          indicator: 'bg-red-500'
        };
      case 'medium':
        return {
          border: 'border-blue-500/30',
          headerBg: 'bg-blue-900/10',
          indicator: 'bg-blue-500'
        };
      case 'low':
        return {
          border: 'border-gray-500/20',
          headerBg: 'bg-gray-900/10',
          indicator: 'bg-gray-500'
        };
      default:
        return {
          border: 'border-gray-700',
          headerBg: 'bg-gray-900/10',
          indicator: 'bg-gray-500'
        };
    }
  };

  const styles = getPriorityStyles();

  return (
    <motion.div
      layout
      className={`${styles.border} border rounded-xl overflow-hidden transition-all duration-200 ${
        isCompact ? 'mb-2' : 'mb-4'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Module Header */}
      <div 
        className={`${styles.headerBg} border-b border-gray-700/50 transition-all duration-200 cursor-pointer hover:bg-opacity-20`}
        onClick={handleToggle}
      >
        <div className={`flex items-center justify-between ${isCompact ? 'p-3' : 'p-4'}`}>
          <div className="flex items-center space-x-3">
            {/* Priority Indicator */}
            <div className={`w-1 h-6 ${styles.indicator} rounded-full`} />
            
            {/* Icon */}
            {IconComponent && (
              <div className="p-1.5 bg-black/20 rounded-lg">
                <IconComponent className="w-4 h-4 text-blue-400" />
              </div>
            )}
            
            {/* Title & Subtitle */}
            <div>
              <h3 className={`text-white font-semibold ${isCompact ? 'text-base' : 'text-lg'}`}>
                {title}
              </h3>
              {subtitle && !isCompact && (
                <p className="text-gray-400 text-xs">{subtitle}</p>
              )}
            </div>
            
            {/* Status Indicators */}
            <div className="flex items-center space-x-2">
              {alertCount > 0 && (
                <div className="flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3 text-red-400" />
                  <span className="text-red-400 text-xs font-medium">{alertCount}</span>
                </div>
              )}
              
              {actionCount > 0 && (
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className="text-green-400 text-xs font-medium">{actionCount}</span>
                </div>
              )}
              
              {experienceAvailable > 0 && (
                <div className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full">
                  +{experienceAvailable} exp
                </div>
              )}
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Last Updated */}
            {lastUpdated && !isCompact && (
              <div className="flex items-center space-x-1 text-gray-500 text-xs">
                <Clock className="w-3 h-3" />
                <span>{lastUpdated}</span>
              </div>
            )}
            
            {/* Compact Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsCompact(!isCompact);
              }}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title={isCompact ? "Expand view" : "Compact view"}
            >
              {isCompact ? (
                <Maximize2 className="w-3 h-3 text-gray-400" />
              ) : (
                <Minimize2 className="w-3 h-3 text-gray-400" />
              )}
            </button>
            
            {/* Collapse Toggle */}
            <button
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        
        {/* Quick Stats Bar (when collapsed) */}
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-3"
          >
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-4">
                {alertCount > 0 && (
                  <span className="text-red-400">{alertCount} alerts</span>
                )}
                {actionCount > 0 && (
                  <span className="text-green-400">{actionCount} actions</span>
                )}
                {experienceAvailable > 0 && (
                  <span className="text-blue-400">{experienceAvailable} exp available</span>
                )}
              </div>
              {lastUpdated && (
                <span>Updated {lastUpdated}</span>
              )}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Module Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`${isCompact ? 'p-3' : 'p-4'} bg-gray-900/30`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * Module Grid - Responsive grid container with automatic spacing
 */
export const ModuleGrid = ({ children, compact = false }) => {
  return (
    <div className={`grid grid-cols-1 gap-${compact ? '2' : '4'} ${compact ? 'space-y-1' : 'space-y-2'}`}>
      {children}
    </div>
  );
};

/**
 * Module Row - For side-by-side modules
 */
export const ModuleRow = ({ children, compact = false }) => {
  return (
    <div className={`grid grid-cols-1 xl:grid-cols-2 gap-${compact ? '3' : '6'} ${compact ? 'mb-3' : 'mb-6'}`}>
      {children}
    </div>
  );
};

export default CollapsibleModule;