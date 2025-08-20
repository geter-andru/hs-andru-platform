import React, { useState } from 'react';
import { Target, Calculator, FileText, TrendingUp, Users, BarChart3, Lightbulb, Zap } from 'lucide-react';

/**
 * QuickActionsGrid - Professional action list for enterprise workflow
 * Features:
 * - Clean single-column list layout (Linear/Notion style)
 * - Minimal professional styling with subtle interactions
 * - Purple accent for primary actions only
 * - Enterprise-focused visual hierarchy
 */

const QuickActionsGrid = ({
  onActionClick = () => {},
  showRecommendations = true,
  className = ''
}) => {
  const [loadingAction, setLoadingAction] = useState(null);

  // Define available actions - professional and minimal
  const actions = [
    {
      id: 'rate_prospect',
      icon: Target,
      label: 'Rate Prospect',
      description: 'Analyze and score new prospects',
      category: 'analysis',
      primary: true,
      shortcut: '⌘R'
    },
    {
      id: 'business_case',
      icon: FileText,
      label: 'Generate Business Case',
      description: 'Create proposal document',
      category: 'content',
      primary: false,
      shortcut: '⌘B'
    },
    {
      id: 'cost_calculator',
      icon: Calculator,
      label: 'Cost Calculator',
      description: 'Calculate ROI and savings',
      category: 'finance',
      primary: false,
      shortcut: '⌘C'
    },
    {
      id: 'update_icp',
      icon: Users,
      label: 'Update ICP',
      description: 'Refine ideal customer profile',
      category: 'analysis',
      primary: false,
      shortcut: '⌘I'
    },
    {
      id: 'trend_analysis',
      icon: TrendingUp,
      label: 'Trend Analysis',
      description: 'Market performance insights',
      category: 'analysis',
      primary: false,
      shortcut: '⌘T'
    },
    {
      id: 'view_insights',
      icon: Lightbulb,
      label: 'View Insights',
      description: 'AI recommendations',
      category: 'insights',
      primary: false,
      shortcut: '⌘V'
    }
  ];

  // Handle action click
  const handleActionClick = async (action) => {
    setLoadingAction(action.id);

    // Simulate action processing
    setTimeout(() => {
      setLoadingAction(null);
      onActionClick(action);
    }, 800);
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Professional Action List - Linear/Notion Style */}
      {actions.map((action) => {
        const IconComponent = action.icon;
        const isLoading = loadingAction === action.id;
        const isPrimary = action.primary;

        return (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            disabled={isLoading}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 group ${
              isPrimary 
                ? 'bg-purple-600/10 border-purple-500/20 hover:bg-purple-600/20 hover:border-purple-500/30' 
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {/* Loading Spinner */}
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <IconComponent className={`w-4 h-4 transition-colors ${
                isPrimary ? 'text-purple-400' : 'text-gray-400 group-hover:text-gray-300'
              }`} />
            )}

            {/* Action Content */}
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  isPrimary ? 'text-purple-200' : 'text-white'
                }`}>
                  {action.label}
                </span>
                <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {action.shortcut}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {action.description}
              </p>
            </div>
          </button>
        );
      })}

      {/* Minimal Footer */}
      <div className="pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center">
          {actions.length} actions available
        </p>
      </div>
    </div>
  );
};

export default QuickActionsGrid;