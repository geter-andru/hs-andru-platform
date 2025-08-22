import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown,
  Minimize2,
  Maximize2,
  RotateCcw,
  Zap,
  Target,
  Users,
  TrendingUp,
  Award,
  X
} from 'lucide-react';

/**
 * Dashboard Settings - POLISH PHASE
 * 
 * Provides user control over module visibility, priority, and layout density.
 * Reduces cognitive overload through personalized dashboard configuration.
 */

const DashboardSettings = ({ 
  isOpen, 
  onClose, 
  moduleSettings, 
  onModuleSettingsChange,
  onResetToDefaults 
}) => {
  const [viewMode, setViewMode] = useState('comfortable'); // comfortable, compact, focused

  // Default module configurations
  const defaultModules = [
    {
      id: 'revenue_indicators',
      name: 'Revenue Intelligence Indicators',
      icon: TrendingUp,
      description: 'Leading indicators and pipeline health',
      priority: 'high',
      visible: true,
      defaultExpanded: true,
      alertCount: 2,
      actionCount: 3
    },
    {
      id: 'priority_actions',
      name: 'Priority Actions',
      icon: Target,
      description: 'Highest ROI buyer intelligence actions',
      priority: 'high',
      visible: true,
      defaultExpanded: true,
      alertCount: 0,
      actionCount: 5
    },
    {
      id: 'deal_momentum',
      name: 'Deal Momentum & Velocity',
      icon: Zap,
      description: 'Deal progression tracking and acceleration',
      priority: 'high',
      visible: true,
      defaultExpanded: true,
      alertCount: 3,
      actionCount: 4
    },
    {
      id: 'professional_progression',
      name: 'Professional Development Path',
      icon: Award,
      description: 'Level progression and capability unlocks',
      priority: 'medium',
      visible: true,
      defaultExpanded: false,
      alertCount: 0,
      actionCount: 1
    },
    {
      id: 'competitive_intelligence',
      name: 'Competitive Intelligence',
      icon: Target,
      description: 'Market positioning and competitor tracking',
      priority: 'medium',
      visible: true,
      defaultExpanded: false,
      alertCount: 2,
      actionCount: 3
    },
    {
      id: 'stakeholder_relationships',
      name: 'Stakeholder Relationships',
      icon: Users,
      description: 'Multi-threading and engagement scoring',
      priority: 'medium',
      visible: true,
      defaultExpanded: false,
      alertCount: 1,
      actionCount: 2
    },
    {
      id: 'business_milestones',
      name: 'Business Development Milestones',
      icon: Award,
      description: 'Series B readiness progression',
      priority: 'low',
      visible: false,
      defaultExpanded: false,
      alertCount: 0,
      actionCount: 1
    }
  ];

  const currentSettings = moduleSettings || defaultModules;

  const handleModuleToggle = (moduleId) => {
    const updated = currentSettings.map(module => 
      module.id === moduleId 
        ? { ...module, visible: !module.visible }
        : module
    );
    onModuleSettingsChange?.(updated);
  };

  const handlePriorityChange = (moduleId, newPriority) => {
    const updated = currentSettings.map(module => 
      module.id === moduleId 
        ? { ...module, priority: newPriority }
        : module
    );
    onModuleSettingsChange?.(updated);
  };

  const handleDefaultExpandedToggle = (moduleId) => {
    const updated = currentSettings.map(module => 
      module.id === moduleId 
        ? { ...module, defaultExpanded: !module.defaultExpanded }
        : module
    );
    onModuleSettingsChange?.(updated);
  };

  const moveModule = (moduleId, direction) => {
    const currentIndex = currentSettings.findIndex(m => m.id === moduleId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= currentSettings.length) return;
    
    const updated = [...currentSettings];
    [updated[currentIndex], updated[newIndex]] = [updated[newIndex], updated[currentIndex]];
    onModuleSettingsChange?.(updated);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'low': return 'text-gray-400 bg-gray-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getViewModeSettings = () => {
    switch (viewMode) {
      case 'compact':
        return {
          description: 'Minimal spacing, collapsed modules',
          moduleSpacing: 'tight',
          defaultExpanded: false
        };
      case 'focused':
        return {
          description: 'Only high-priority modules visible',
          moduleSpacing: 'normal',
          defaultExpanded: true
        };
      default:
        return {
          description: 'Balanced spacing and visibility',
          moduleSpacing: 'comfortable',
          defaultExpanded: true
        };
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-blue-400" />
              <div>
                <h2 className="text-xl font-semibold text-white">Dashboard Settings</h2>
                <p className="text-gray-400 text-sm">Customize your revenue intelligence layout</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            
            {/* View Mode Selection */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-3">Dashboard Density</h3>
              <div className="grid grid-cols-3 gap-3">
                {['comfortable', 'compact', 'focused'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      viewMode === mode
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium capitalize">{mode}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {getViewModeSettings().description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Module Configuration */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium">Module Configuration</h3>
                <button
                  onClick={onResetToDefaults}
                  className="flex items-center space-x-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Defaults</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {currentSettings.map((module, index) => {
                  const IconComponent = module.icon;
                  
                  return (
                    <div 
                      key={module.id}
                      className="bg-gray-800 border border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-4 h-4 text-blue-400" />
                          <div>
                            <div className="text-white font-medium">{module.name}</div>
                            <div className="text-gray-400 text-xs">{module.description}</div>
                          </div>
                        </div>
                        
                        {/* Module Controls */}
                        <div className="flex items-center space-x-2">
                          {/* Move Up/Down */}
                          <button
                            onClick={() => moveModule(module.id, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowUp className="w-3 h-3 text-gray-400" />
                          </button>
                          <button
                            onClick={() => moveModule(module.id, 'down')}
                            disabled={index === currentSettings.length - 1}
                            className="p-1 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowDown className="w-3 h-3 text-gray-400" />
                          </button>
                          
                          {/* Visibility Toggle */}
                          <button
                            onClick={() => handleModuleToggle(module.id)}
                            className="p-1 hover:bg-gray-700 rounded"
                          >
                            {module.visible ? (
                              <Eye className="w-4 h-4 text-green-400" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {/* Module Settings */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          {/* Priority */}
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400">Priority:</span>
                            <select
                              value={module.priority}
                              onChange={(e) => handlePriorityChange(module.id, e.target.value)}
                              className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs"
                            >
                              <option value="high">High</option>
                              <option value="medium">Medium</option>
                              <option value="low">Low</option>
                            </select>
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(module.priority)}`} />
                          </div>
                          
                          {/* Default Expanded */}
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400">Default:</span>
                            <button
                              onClick={() => handleDefaultExpandedToggle(module.id)}
                              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                                module.defaultExpanded
                                  ? 'bg-green-600/20 text-green-300'
                                  : 'bg-gray-700 text-gray-400'
                              }`}
                            >
                              {module.defaultExpanded ? (
                                <Maximize2 className="w-3 h-3" />
                              ) : (
                                <Minimize2 className="w-3 h-3" />
                              )}
                              <span>{module.defaultExpanded ? 'Expanded' : 'Collapsed'}</span>
                            </button>
                          </div>
                        </div>
                        
                        {/* Status Indicators */}
                        <div className="flex items-center space-x-3 text-xs">
                          {module.alertCount > 0 && (
                            <span className="text-red-400">{module.alertCount} alerts</span>
                          )}
                          {module.actionCount > 0 && (
                            <span className="text-green-400">{module.actionCount} actions</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-gray-800/50">
            <div className="text-sm text-gray-400">
              Changes are saved automatically
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DashboardSettings;