import React, { useState, useEffect } from 'react';
import { Target, Briefcase, DollarSign, Shield, Copy, ExternalLink, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import stakeholderArsenalService from '../../../services/StakeholderArsenalService';
import { useUserIntelligence } from '../../../contexts/simplified/UserIntelligenceContext';

/**
 * StakeholderArsenalWidget - Sarah Chen's 10:15 AM Customer Call Prep
 * 
 * Generates role-specific ammunition for stakeholder conversations:
 * - Pain point research and industry insights
 * - ROI calculators tailored to stakeholder priorities
 * - Competitive positioning and talking points
 * - Complete conversation materials and follow-up templates
 * 
 * Key Use Case: "She needs ammunition for internal selling - cost per processed claim"
 */

const StakeholderArsenalWidget = ({
  className = ''
}) => {
  // Get user data for dynamic personalization
  const { businessContext, icpAnalysis, costCalculatorResults } = useUserIntelligence();
  
  const [arsenal, setArsenal] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedField, setCopiedField] = useState(null);
  const [showConfiguration, setShowConfiguration] = useState(false);

  // Map user's industry to available framework
  const mapIndustryToFramework = (userIndustry) => {
    const industry = userIndustry?.toLowerCase() || '';
    if (industry.includes('health') || industry.includes('medical')) return 'healthcare';
    if (industry.includes('logistic') || industry.includes('supply')) return 'logistics';
    if (industry.includes('fintech') || industry.includes('financial')) return 'fintech';
    return 'healthcare'; // Default fallback
  };

  // Form state populated from user's actual data
  const [config, setConfig] = useState({
    industry: mapIndustryToFramework(businessContext.industry),
    stakeholderRole: icpAnalysis.buyerPersonas?.[0]?.replace(/\s+/g, '') || 'CFO',
    customerName: 'Your Next Prospect',
    meetingObjective: 'Initial discovery and ROI validation',
    customerSize: businessContext.targetMarket === 'Enterprise' ? 'Enterprise' : 'Mid-Market',
    customerChallenges: icpAnalysis.painPoints || []
  });

  // Update config when user context changes
  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      industry: mapIndustryToFramework(businessContext.industry),
      stakeholderRole: icpAnalysis.buyerPersonas?.[0]?.replace(/\s+/g, '') || 'CFO',
      customerSize: businessContext.targetMarket === 'Enterprise' ? 'Enterprise' : 'Mid-Market',
      customerChallenges: icpAnalysis.painPoints || []
    }));
  }, [businessContext, icpAnalysis]);

  // Load default arsenal on mount and when config changes
  useEffect(() => {
    generateArsenal();
  }, [config.industry, config.stakeholderRole, config.customerSize]);

  // Generate arsenal using the service
  const generateArsenal = async () => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate processing
      
      const result = stakeholderArsenalService.generateStakeholderArsenal({
        industry: config.industry,
        stakeholderRole: config.stakeholderRole,
        customerName: config.customerName,
        customerContext: {
          size: config.customerSize,
          challenges: config.customerChallenges,
          annualVolume: businessContext.customerCount || 100000
        },
        meetingObjective: config.meetingObjective,
        competitorMentions: [
          { name: 'Competitor X', claim: '40% cost reduction' }
        ],
        technicalAdvantages: icpAnalysis.competitiveAdvantages || ['10x processing speed', '99% accuracy improvement']
      });
      
      setArsenal(result);
    } catch (error) {
      console.error('Arsenal generation error:', error);
      setArsenal({
        error: 'Arsenal service temporarily unavailable',
        stakeholderProfile: { role: config.stakeholderRole }
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Update configuration
  const updateConfig = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Copy to clipboard
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
  const industries = [
    { id: 'healthcare', name: 'Healthcare & Medical' },
    { id: 'logistics', name: 'Logistics & Supply Chain' },
    { id: 'fintech', name: 'Financial Technology' }
  ];

  const stakeholders = ['CFO', 'COO', 'CTO', 'Medical Director', 'CRO'];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'painpoints', label: 'Pain Points', icon: Shield },
    { id: 'roi', label: 'ROI', icon: DollarSign },
    { id: 'materials', label: 'Materials', icon: Briefcase }
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-white">
            Stakeholder Arsenal
          </span>
        </div>
        <button
          onClick={() => setShowConfiguration(!showConfiguration)}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          {showConfiguration ? 'Hide Config' : 'Configure'}
        </button>
      </div>

      {/* Always Show Key Controls - No Expansion Required */}
      <div className="space-y-2 p-2 bg-gray-800/50 rounded border border-gray-700">
        {/* Quick Industry/Stakeholder Selection */}
        <div className="grid grid-cols-3 gap-1.5">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Industry</label>
            <select
              value={config.industry}
              onChange={(e) => updateConfig('industry', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
            >
              {industries.map(industry => (
                <option key={industry.id} value={industry.id}>
                  {industry.name.replace(' & ', '')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Stakeholder</label>
            <select
              value={config.stakeholderRole}
              onChange={(e) => updateConfig('stakeholderRole', e.target.value)}
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
              onClick={generateArsenal}
              disabled={isGenerating}
              className="w-full flex items-center justify-center py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-xs rounded transition-colors mt-4"
            >
              {isGenerating ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Briefcase className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        {/* Key Metrics Preview - Always Visible */}
        {arsenal && !arsenal.error && (
          <div className="grid grid-cols-3 gap-1.5 mt-2 pt-2 border-t border-gray-600">
            <div className="text-center">
              <p className="text-xs text-gray-400">Savings</p>
              <p className="text-xs text-white font-medium">
                ${Math.round((arsenal.roiCalculation?.roiMetrics?.annualSavings || 0) / 1000)}K
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Payback</p>
              <p className="text-xs text-white font-medium">
                {arsenal.roiCalculation?.roiMetrics?.paybackPeriod || 12}mo
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">ROI</p>
              <p className="text-xs text-white font-medium">
                {arsenal.roiCalculation?.roiMetrics?.threeYearROI || 180}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Configuration - Collapsible */}
      <AnimatePresence>
        {showConfiguration && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 p-3 bg-gray-800/50 rounded border border-gray-700"
          >
            {/* Industry and Stakeholder */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Industry</label>
                <select
                  value={config.industry}
                  onChange={(e) => updateConfig('industry', e.target.value)}
                  className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                >
                  {industries.map(industry => (
                    <option key={industry.id} value={industry.id}>
                      {industry.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Stakeholder</label>
                <select
                  value={config.stakeholderRole}
                  onChange={(e) => updateConfig('stakeholderRole', e.target.value)}
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
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Customer Name</label>
                <input
                  type="text"
                  value={config.customerName}
                  onChange={(e) => updateConfig('customerName', e.target.value)}
                  className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Company Size</label>
                <select
                  value={config.customerSize}
                  onChange={(e) => updateConfig('customerSize', e.target.value)}
                  className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                >
                  <option value="Enterprise">Enterprise</option>
                  <option value="Mid-Market">Mid-Market</option>
                  <option value="SMB">Small Business</option>
                </select>
              </div>
            </div>

            {/* Meeting Objective */}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Meeting Objective</label>
              <input
                type="text"
                value={config.meetingObjective}
                onChange={(e) => updateConfig('meetingObjective', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generateArsenal}
              disabled={isGenerating}
              className="w-full flex items-center justify-center space-x-2 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-xs rounded transition-colors"
            >
              {isGenerating ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Briefcase className="w-3 h-3" />
              )}
              <span>{isGenerating ? 'Generating Arsenal...' : 'Generate Arsenal'}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Arsenal Content */}
      <AnimatePresence>
        {arsenal && !arsenal.error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* Quick Overview */}
            <div className="p-3 bg-purple-600/10 border border-purple-500/20 rounded">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-1">
                  <Target className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-purple-400 font-medium">
                    {config.stakeholderRole} Arsenal for {config.customerName}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(arsenal.conversationMaterials), 'overview')}
                  className={`text-xs transition-colors ${
                    copiedField === 'overview' ? 'text-green-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <p className="text-sm text-white leading-relaxed">
                {arsenal.roiCalculation?.stakeholderSpecific?.impactStatement || 'Arsenal generated successfully'}
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-0.5 bg-gray-800 rounded p-0.5">
              {tabs.map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-1 py-1 px-1.5 rounded text-xs transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <IconComponent className="w-3 h-3" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[140px]">
              {activeTab === 'overview' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-gray-800/50 rounded border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">Key Metric</p>
                      <p className="text-sm text-white">
                        {arsenal.roiCalculation?.stakeholderSpecific?.keyMetric}
                      </p>
                    </div>
                    <div className="p-2 bg-gray-800/50 rounded border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">Payback Period</p>
                      <p className="text-sm text-white">
                        {arsenal.roiCalculation?.roiMetrics?.paybackPeriod} months
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-gray-800/50 rounded border border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">Primary Concerns</p>
                    <div className="space-y-1">
                      {arsenal.stakeholderProfile?.primaryConcerns?.slice(0, 3).map((concern, index) => (
                        <p key={index} className="text-xs text-gray-300">• {concern}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'painpoints' && (
                <div className="space-y-2">
                  {arsenal.painPointAnalysis?.primaryPainPoints?.slice(0, 3).map((pain, index) => (
                    <div key={index} className="p-2 bg-gray-800/50 rounded border border-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-white">{pain.painPoint}</p>
                          <p className="text-xs text-gray-400 mt-1">{pain.customerImpact}</p>
                        </div>
                        <span className={`text-xs px-1 py-0.5 rounded ${
                          pain.urgencyLevel === 'High' ? 'bg-purple-600/20 text-purple-300' : 'bg-gray-600/50 text-gray-400'
                        }`}>
                          {pain.urgencyLevel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'roi' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-gray-800/50 rounded border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">Annual Savings</p>
                      <p className="text-sm text-white">
                        ${Math.round((arsenal.roiCalculation?.roiMetrics?.annualSavings || 0) / 1000)}K
                      </p>
                    </div>
                    <div className="p-2 bg-gray-800/50 rounded border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">3-Year ROI</p>
                      <p className="text-sm text-white">
                        {arsenal.roiCalculation?.roiMetrics?.threeYearROI}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-gray-800/50 rounded border border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">Impact Statement</p>
                    <p className="text-xs text-gray-300">
                      {arsenal.roiCalculation?.stakeholderSpecific?.impactStatement}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'materials' && (
                <div className="space-y-2">
                  <div className="p-2 bg-gray-800/50 rounded border border-gray-700">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-xs font-medium text-white">Opening Statement</p>
                      <button
                        onClick={() => copyToClipboard(arsenal.conversationMaterials?.openingStatement, 'opening')}
                        className={`text-xs ${copiedField === 'opening' ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {arsenal.conversationMaterials?.openingStatement}
                    </p>
                  </div>
                  
                  <div className="p-2 bg-gray-800/50 rounded border border-gray-700">
                    <p className="text-xs font-medium text-white mb-1">Key Questions</p>
                    <div className="space-y-1">
                      {arsenal.conversationMaterials?.questionsToAsk?.slice(0, 2).map((question, index) => (
                        <p key={index} className="text-xs text-gray-300">• {question}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => copyToClipboard(arsenal.followUpMaterials?.emailTemplate || '', 'email')}
                className={`flex items-center justify-center space-x-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors ${
                  copiedField === 'email' ? 'text-green-400' : 'text-white'
                }`}
              >
                <Copy className="w-3 h-3" />
                <span>Follow-up Email</span>
              </button>
              <button
                onClick={() => setShowConfiguration(true)}
                className="flex items-center justify-center space-x-1 py-2 px-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/20 rounded text-xs text-purple-300 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Export Arsenal</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {arsenal?.error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-gray-800/50 border border-gray-600 rounded text-center"
          >
            <p className="text-xs text-gray-400">{arsenal.error}</p>
            <button
              onClick={generateArsenal}
              className="mt-2 text-xs text-purple-400 hover:text-purple-300"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {isGenerating && !arsenal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 text-center"
          >
            <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-400">Generating stakeholder arsenal...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Usage Hint */}
      <div className="text-xs text-gray-500 text-center">
        Sarah's 10:15 AM customer call prep - role-specific ammunition
      </div>
    </div>
  );
};

export default StakeholderArsenalWidget;