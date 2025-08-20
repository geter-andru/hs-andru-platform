import React, { useState, useEffect } from 'react';
import { ArrowRight, Target, Lightbulb, Copy, ExternalLink, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import technicalTranslationService from '../../../services/TechnicalTranslationService';
import { useUserIntelligence } from '../../../contexts/simplified/UserIntelligenceContext';

/**
 * TechnicalTranslationWidget - Sarah Chen's 6:47 AM Crisis Solver
 * 
 * Converts technical metrics into stakeholder-specific business language
 * for immediate use in customer conversations and presentations.
 * 
 * Key Use Case: "How does 10x faster processing translate to CFO language?"
 */

const TechnicalTranslationWidget = ({
  className = ''
}) => {
  // Get user data for dynamic personalization
  const { businessContext, icpAnalysis } = useUserIntelligence();
  
  const [translation, setTranslation] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  // Map user's industry to available framework
  const mapIndustryToFramework = (userIndustry) => {
    const industry = userIndustry?.toLowerCase() || '';
    if (industry.includes('health') || industry.includes('medical')) return 'healthcare';
    if (industry.includes('logistic') || industry.includes('supply')) return 'logistics';
    if (industry.includes('fintech') || industry.includes('financial')) return 'fintech';
    return 'healthcare'; // Default fallback
  };

  // Extract technical capabilities from user's competitive advantages
  const getUserTechnicalMetric = () => {
    const advantages = icpAnalysis.competitiveAdvantages || [];
    const firstAdvantage = advantages[0]?.toLowerCase() || '';
    
    if (firstAdvantage.includes('speed') || firstAdvantage.includes('fast')) return 'processing_speed';
    if (firstAdvantage.includes('accura') || firstAdvantage.includes('precise')) return 'accuracy_improvement';
    if (firstAdvantage.includes('cost') || firstAdvantage.includes('save')) return 'cost_reduction';
    return 'processing_speed'; // Default
  };

  // Form state populated from user's actual data
  const [formData, setFormData] = useState({
    technicalMetric: getUserTechnicalMetric(),
    improvement: icpAnalysis.competitiveAdvantages?.[0] || '10x faster processing',
    industry: mapIndustryToFramework(businessContext.industry),
    targetStakeholder: icpAnalysis.buyerPersonas?.[0]?.replace(/\s+/g, '') || 'CFO',
    customerName: 'Your Next Prospect',
    competitorClaim: ''
  });

  // Update form data when user context changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      technicalMetric: getUserTechnicalMetric(),
      improvement: icpAnalysis.competitiveAdvantages?.[0] || '10x faster processing',
      industry: mapIndustryToFramework(businessContext.industry),
      targetStakeholder: icpAnalysis.buyerPersonas?.[0]?.replace(/\s+/g, '') || 'CFO'
    }));
  }, [businessContext, icpAnalysis]);

  // Load default translation on mount and when form data changes
  useEffect(() => {
    generateTranslation();
  }, [formData.technicalMetric, formData.improvement, formData.industry, formData.targetStakeholder]);

  // Generate translation using the service
  const generateTranslation = async () => {
    setIsTranslating(true);
    
    try {
      // Simulate brief processing time for UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = technicalTranslationService.translateTechnicalMetric({
        technicalMetric: formData.technicalMetric,
        improvement: formData.improvement,
        industry: formData.industry,
        targetStakeholder: formData.targetStakeholder,
        customerContext: {
          name: formData.customerName,
          industry: formData.industry
        },
        competitorClaim: formData.competitorClaim
      });
      
      setTranslation(result);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslation({
        error: 'Translation service temporarily unavailable',
        technicalInput: `${formData.technicalMetric}: ${formData.improvement}`
      });
    } finally {
      setIsTranslating(false);
    }
  };

  // Handle form updates
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Copy text to clipboard
  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  // Available options
  const availableFrameworks = technicalTranslationService.getAvailableFrameworks();
  const stakeholders = ['CFO', 'COO', 'CTO', 'Compliance Officer'];
  const commonMetrics = [
    { id: 'processing_speed', label: 'Processing Speed' },
    { id: 'accuracy_improvement', label: 'Accuracy Improvement' },
    { id: 'cost_reduction', label: 'Cost Reduction' },
    { id: 'fraud_detection', label: 'Fraud Detection' },
    { id: 'tracking_accuracy', label: 'Tracking Accuracy' }
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ArrowRight className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white">
            Technical Translation
          </span>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          {showDetails ? 'Quick View' : 'Configure'}
        </button>
      </div>

      {/* Always Show Key Controls - No Expansion Required */}
      <div className="space-y-2 p-2 bg-gray-800/50 rounded border border-gray-700">
        {/* Quick Industry/Stakeholder Selection */}
        <div className="grid grid-cols-3 gap-1.5">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Industry</label>
            <select
              value={formData.industry}
              onChange={(e) => updateFormData('industry', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
            >
              {availableFrameworks.map(framework => (
                <option key={framework.id} value={framework.id}>
                  {framework.name.replace(' & ', '')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Stakeholder</label>
            <select
              value={formData.targetStakeholder}
              onChange={(e) => updateFormData('targetStakeholder', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
            >
              {stakeholders.map(stakeholder => (
                <option key={stakeholder} value={stakeholder}>
                  {stakeholder}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              onClick={generateTranslation}
              disabled={isTranslating}
              className="w-full flex items-center justify-center py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-xs rounded transition-colors mt-4"
            >
              {isTranslating ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Zap className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Configuration - Collapsible */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3 p-3 bg-gray-800/50 rounded border border-gray-700"
        >
          {/* Technical Metric Selection */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Technical Metric</label>
              <select
                value={formData.technicalMetric}
                onChange={(e) => updateFormData('technicalMetric', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
              >
                {commonMetrics.map(metric => (
                  <option key={metric.id} value={metric.id}>
                    {metric.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Improvement</label>
              <input
                type="text"
                value={formData.improvement}
                onChange={(e) => updateFormData('improvement', e.target.value)}
                placeholder="e.g., 10x faster"
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
              />
            </div>
          </div>

          {/* Industry and Stakeholder */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Industry</label>
              <select
                value={formData.industry}
                onChange={(e) => updateFormData('industry', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
              >
                {availableFrameworks.map(framework => (
                  <option key={framework.id} value={framework.id}>
                    {framework.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Target Stakeholder</label>
              <select
                value={formData.targetStakeholder}
                onChange={(e) => updateFormData('targetStakeholder', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
              >
                {stakeholders.map(stakeholder => (
                  <option key={stakeholder} value={stakeholder}>
                    {stakeholder}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer Context */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">Customer Name</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => updateFormData('customerName', e.target.value)}
              placeholder="e.g., MedGlobal"
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generateTranslation}
            disabled={isTranslating}
            className="w-full flex items-center justify-center space-x-2 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-xs rounded transition-colors"
          >
            {isTranslating ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Zap className="w-3 h-3" />
            )}
            <span>{isTranslating ? 'Translating...' : 'Generate Translation'}</span>
          </button>
        </motion.div>
      )}

      {/* Translation Results */}
      <AnimatePresence>
        {translation && !translation.error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* Main Translation */}
            <div className="p-2 bg-blue-600/10 border border-blue-500/20 rounded">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center space-x-1">
                  <Target className="w-3 h-3 text-blue-400" />
                  <span className="text-xs text-blue-400 font-medium">Business Translation</span>
                </div>
                <button
                  onClick={() => copyToClipboard(translation.businessTranslation, 'main')}
                  className={`text-xs transition-colors ${
                    copiedField === 'main' ? 'text-green-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-white leading-snug">
                {translation.businessTranslation}
              </p>
            </div>

            {/* Stakeholder-Specific Version */}
            <div className="p-2 bg-gray-800/50 border border-gray-700 rounded">
              <div className="flex items-start justify-between mb-1">
                <span className="text-xs text-gray-400 font-medium">
                  {formData.targetStakeholder} Language
                </span>
                <button
                  onClick={() => copyToClipboard(translation.usageInstructions?.elevator || '', 'elevator')}
                  className={`text-xs transition-colors ${
                    copiedField === 'elevator' ? 'text-green-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-gray-300 leading-snug">
                {translation.usageInstructions?.elevator || translation.stakeholderSpecific?.language}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => copyToClipboard(translation.usageInstructions?.email || '', 'email')}
                className={`flex items-center justify-center space-x-1 py-1.5 px-2 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors ${
                  copiedField === 'email' ? 'text-green-400' : 'text-white'
                }`}
              >
                <Copy className="w-3 h-3" />
                <span>Email</span>
              </button>
              <button
                onClick={() => setShowDetails(true)}
                className="flex items-center justify-center space-x-1 py-1.5 px-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/20 rounded text-xs text-purple-300 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Export</span>
              </button>
            </div>

            {/* Supporting Data */}
            {translation.stakeholderSpecific?.roiCalculation && (
              <div className="text-xs text-gray-400">
                <span className="text-blue-400">ROI:</span> {translation.stakeholderSpecific.roiCalculation}
              </div>
            )}
          </motion.div>
        )}

        {/* Error State */}
        {translation?.error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-gray-800/50 border border-gray-600 rounded text-center"
          >
            <p className="text-xs text-gray-400">{translation.error}</p>
            <button
              onClick={generateTranslation}
              className="mt-2 text-xs text-blue-400 hover:text-blue-300"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {isTranslating && !translation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 text-center"
          >
            <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-400">Generating stakeholder translation...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Usage Hint */}
      <div className="text-xs text-gray-500 text-center">
        Sarah's 6:47 AM crisis solver - technical metrics → business language
      </div>
    </div>
  );
};

export default TechnicalTranslationWidget;