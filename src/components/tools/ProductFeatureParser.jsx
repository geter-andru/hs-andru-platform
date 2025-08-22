import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, 
  Target, 
  Users, 
  Shield, 
  Lightbulb, 
  Trash2, 
  Plus,
  Check,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Database,
  Cloud
} from 'lucide-react';

/**
 * ProductFeatureParser - Intelligent product feature extraction and categorization
 * 
 * Features:
 * - Smart feature parsing from text input
 * - Feature categorization (Core, Technical, Business, Integration)
 * - ICP impact scoring for each feature
 * - Market positioning insights
 * - Competitive advantage identification
 */

const ProductFeatureParser = ({ 
  initialFeatures = '', 
  onFeaturesUpdate, 
  productName = '', 
  businessType = '' 
}) => {
  const [rawInput, setRawInput] = useState(initialFeatures);
  const [parsedFeatures, setParsedFeatures] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(new Set(['all']));

  // Feature categories for intelligent classification
  const featureCategories = {
    core: {
      name: 'Core Functionality',
      icon: Zap,
      color: 'blue',
      keywords: ['ai', 'automation', 'analytics', 'dashboard', 'reporting', 'workflow', 'process', 'management', 'tracking', 'monitoring'],
      description: 'Primary product capabilities and core value proposition'
    },
    technical: {
      name: 'Technical Capabilities',
      icon: Database,
      color: 'purple',
      keywords: ['api', 'integration', 'cloud', 'security', 'scalable', 'real-time', 'ml', 'algorithm', 'data', 'platform'],
      description: 'Technical features and infrastructure capabilities'
    },
    business: {
      name: 'Business Value',
      icon: TrendingUp,
      color: 'green',
      keywords: ['roi', 'cost', 'revenue', 'efficiency', 'productivity', 'insights', 'optimization', 'performance', 'competitive'],
      description: 'Business outcomes and value drivers'
    },
    integration: {
      name: 'Integration & Compatibility',
      icon: Cloud,
      color: 'orange',
      keywords: ['crm', 'salesforce', 'hubspot', 'slack', 'teams', 'outlook', 'api', 'webhook', 'integration', 'connector'],
      description: 'Third-party integrations and compatibility features'
    },
    user: {
      name: 'User Experience',
      icon: Users,
      color: 'pink',
      keywords: ['user-friendly', 'intuitive', 'mobile', 'responsive', 'customizable', 'personalized', 'easy', 'simple'],
      description: 'User interface and experience features'
    }
  };

  // ICP Impact scoring based on feature category and business type
  const calculateICPImpact = (feature, category, businessType) => {
    const baseScores = {
      core: 85,
      technical: businessType === 'B2B' ? 75 : 65,
      business: 90,
      integration: businessType === 'B2B' ? 80 : 60,
      user: businessType === 'B2C' ? 85 : 70
    };

    // Enhance score based on feature keywords
    let score = baseScores[category] || 70;
    
    const highImpactKeywords = ['ai', 'automation', 'roi', 'revenue', 'efficiency', 'real-time', 'security'];
    const featureLower = feature.toLowerCase();
    
    const matchedKeywords = highImpactKeywords.filter(keyword => 
      featureLower.includes(keyword)
    );
    
    // Add bonus points for high-impact keywords
    score += matchedKeywords.length * 5;
    
    return Math.min(score, 100);
  };

  // Smart feature parsing and categorization
  const analyzeFeatures = useMemo(() => {
    if (!rawInput.trim()) return [];

    // Split features by common delimiters
    const features = rawInput
      .split(/[,\n•\-\*]/)
      .map(f => f.trim())
      .filter(f => f.length > 0);

    return features.map((feature, index) => {
      // Determine category based on keywords
      let bestCategory = 'core';
      let bestScore = 0;

      Object.entries(featureCategories).forEach(([key, category]) => {
        const matches = category.keywords.filter(keyword => 
          feature.toLowerCase().includes(keyword)
        ).length;
        
        if (matches > bestScore) {
          bestScore = matches;
          bestCategory = key;
        }
      });

      // Calculate ICP impact score
      const icpImpact = calculateICPImpact(feature, bestCategory, businessType);

      return {
        id: `feature_${index}`,
        text: feature,
        category: bestCategory,
        icpImpact,
        isCore: icpImpact >= 80,
        marketPositioning: generateMarketPositioning(feature, bestCategory)
      };
    });
  }, [rawInput, businessType]);

  // Generate market positioning insights
  const generateMarketPositioning = (feature, category) => {
    const featureLower = feature.toLowerCase();
    
    if (featureLower.includes('ai') || featureLower.includes('automation')) {
      return 'Innovation Leader - AI/Automation advantage';
    }
    if (featureLower.includes('security') || featureLower.includes('compliance')) {
      return 'Trust & Security - Enterprise-grade reliability';
    }
    if (featureLower.includes('integration') || featureLower.includes('api')) {
      return 'Ecosystem Player - Seamless connectivity';
    }
    if (featureLower.includes('analytics') || featureLower.includes('insights')) {
      return 'Data-Driven - Intelligence advantage';
    }
    
    return category === 'business' ? 'Value Creator - ROI focused' : 'Feature Rich - Comprehensive solution';
  };

  // Update parsed features when analysis completes
  useEffect(() => {
    if (rawInput.trim()) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        const analyzed = analyzeFeatures;
        setParsedFeatures(analyzed);
        setIsAnalyzing(false);
        
        // Notify parent component
        if (onFeaturesUpdate) {
          onFeaturesUpdate({
            rawFeatures: rawInput,
            parsedFeatures: analyzed,
            featuresSummary: {
              totalFeatures: analyzed.length,
              coreFeatures: analyzed.filter(f => f.isCore).length,
              averageICPImpact: analyzed.reduce((sum, f) => sum + f.icpImpact, 0) / analyzed.length || 0,
              topCategory: getTopCategory(analyzed)
            }
          });
        }
      }, 800);
      
      return () => clearTimeout(timer);
    } else {
      setParsedFeatures([]);
      if (onFeaturesUpdate) {
        onFeaturesUpdate({ rawFeatures: '', parsedFeatures: [], featuresSummary: null });
      }
    }
  }, [analyzeFeatures, rawInput, onFeaturesUpdate]);

  // Get most common feature category
  const getTopCategory = (features) => {
    const categoryCount = {};
    features.forEach(f => {
      categoryCount[f.category] = (categoryCount[f.category] || 0) + 1;
    });
    
    return Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'core';
  };

  // Filter features by selected categories
  const filteredFeatures = useMemo(() => {
    if (selectedCategories.has('all')) return parsedFeatures;
    
    return parsedFeatures.filter(feature => 
      selectedCategories.has(feature.category)
    );
  }, [parsedFeatures, selectedCategories]);

  // Toggle category filter
  const toggleCategory = (category) => {
    const newSelection = new Set(selectedCategories);
    
    if (category === 'all') {
      setSelectedCategories(new Set(['all']));
    } else {
      newSelection.delete('all');
      if (newSelection.has(category)) {
        newSelection.delete(category);
      } else {
        newSelection.add(category);
      }
      
      if (newSelection.size === 0) {
        newSelection.add('all');
      }
      
      setSelectedCategories(newSelection);
    }
  };

  return (
    <div className="space-y-6">
      {/* Feature Input Section */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Sparkles className="w-4 h-4 inline mr-1" />
          Product Features & Capabilities
        </label>
        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors resize-none"
          rows={4}
          placeholder="Enter your product features... Examples:
• AI-powered sales automation
• Real-time analytics dashboard  
• CRM integration with Salesforce
• Advanced reporting capabilities"
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate features with commas, bullets, or new lines
        </p>
      </div>

      {/* Analysis Status */}
      {isAnalyzing && (
        <div className="flex items-center gap-2 text-blue-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          <span className="text-sm">Analyzing features and calculating ICP impact...</span>
        </div>
      )}

      {/* Feature Analysis Results */}
      {parsedFeatures.length > 0 && !isAnalyzing && (
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-green-400" />
              <h3 className="text-white font-medium">Feature Analysis Summary</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{parsedFeatures.length}</div>
                <div className="text-xs text-gray-400">Total Features</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {parsedFeatures.filter(f => f.isCore).length}
                </div>
                <div className="text-xs text-gray-400">Core Features</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {Math.round(parsedFeatures.reduce((sum, f) => sum + f.icpImpact, 0) / parsedFeatures.length)}%
                </div>
                <div className="text-xs text-gray-400">Avg ICP Impact</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {featureCategories[getTopCategory(parsedFeatures)]?.name.split(' ')[0]}
                </div>
                <div className="text-xs text-gray-400">Top Category</div>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 overflow-hidden">
            <button
              onClick={() => toggleCategory('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategories.has('all')
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              All ({parsedFeatures.length})
            </button>
            {Object.entries(featureCategories).map(([key, category]) => {
              const count = parsedFeatures.filter(f => f.category === key).length;
              if (count === 0) return null;
              
              return (
                <button
                  key={key}
                  onClick={() => toggleCategory(key)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategories.has(key)
                      ? category.color === 'blue' ? 'bg-blue-600 text-white' :
                        category.color === 'purple' ? 'bg-purple-600 text-white' :
                        category.color === 'green' ? 'bg-green-600 text-white' :
                        category.color === 'orange' ? 'bg-orange-600 text-white' :
                        category.color === 'pink' ? 'bg-pink-600 text-white' :
                        'bg-gray-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {category.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Parsed Features List */}
          <div className="space-y-3">
            {filteredFeatures.map((feature) => {
              const category = featureCategories[feature.category];
              const IconComponent = category.icon;
              
              return (
                <div 
                  key={feature.id}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors break-words"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <IconComponent className={
                          category.color === 'blue' ? 'w-4 h-4 text-blue-400' :
                          category.color === 'purple' ? 'w-4 h-4 text-purple-400' :
                          category.color === 'green' ? 'w-4 h-4 text-green-400' :
                          category.color === 'orange' ? 'w-4 h-4 text-orange-400' :
                          category.color === 'pink' ? 'w-4 h-4 text-pink-400' :
                          'w-4 h-4 text-gray-400'
                        } />
                        <span className={
                          category.color === 'blue' ? 'text-xs font-medium px-2 py-1 rounded-full bg-blue-900/30 text-blue-400' :
                          category.color === 'purple' ? 'text-xs font-medium px-2 py-1 rounded-full bg-purple-900/30 text-purple-400' :
                          category.color === 'green' ? 'text-xs font-medium px-2 py-1 rounded-full bg-green-900/30 text-green-400' :
                          category.color === 'orange' ? 'text-xs font-medium px-2 py-1 rounded-full bg-orange-900/30 text-orange-400' :
                          category.color === 'pink' ? 'text-xs font-medium px-2 py-1 rounded-full bg-pink-900/30 text-pink-400' :
                          'text-xs font-medium px-2 py-1 rounded-full bg-gray-900/30 text-gray-400'
                        }>
                          {category.name}
                        </span>
                        {feature.isCore && (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-900/30 text-green-400">
                            Core Feature
                          </span>
                        )}
                      </div>
                      
                      <p className="text-white font-medium mb-1">{feature.text}</p>
                      <p className="text-gray-400 text-sm mb-2">{feature.marketPositioning}</p>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">ICP Impact:</span>
                          <div className="flex items-center gap-1">
                            <div className="w-16 bg-gray-800 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  feature.icpImpact >= 80 ? 'bg-green-500' :
                                  feature.icpImpact >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${feature.icpImpact}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-white">{feature.icpImpact}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Features State */}
      {rawInput.trim() && parsedFeatures.length === 0 && !isAnalyzing && (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>No features detected. Try adding more descriptive feature text.</p>
        </div>
      )}
    </div>
  );
};

export default ProductFeatureParser;