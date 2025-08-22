import React from 'react';
import { Lock, Crown } from 'lucide-react';
import { useFeatureFlags } from '../../contexts/FeatureFlagContext';

const FinancialAccessGate = ({ children, fallbackMessage = "Financial features are available for premium users" }) => {
  const { isEnabled } = useFeatureFlags();
  
  // Check if financial features are enabled
  const hasFinancialAccess = isEnabled('enableFinancialFeatures');
  
  if (hasFinancialAccess) {
    return children;
  }
  
  // Render locked state with grayscale overlay
  return (
    <div className="relative">
      {/* Grayscale overlay wrapper */}
      <div className="filter grayscale opacity-50 pointer-events-none">
        {children}
      </div>
      
      {/* Lock overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-lg">
        <div className="text-center p-6 max-w-md">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gray-800 rounded-full">
              <Lock className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">
            Financial Features Locked
          </h3>
          
          <p className="text-gray-400 mb-4 text-sm">
            {fallbackMessage}
          </p>
          
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Crown className="w-4 h-4" />
            <span>Available for admin users</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAccessGate;