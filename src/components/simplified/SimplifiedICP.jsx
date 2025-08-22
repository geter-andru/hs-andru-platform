import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target,
  Users,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Info,
  Lightbulb,
  ArrowRight,
  Star,
  Zap,
  ExternalLink,
  Rocket,
  Copy,
  FileDown
} from 'lucide-react';
import { useUserIntelligence } from '../../contexts/simplified/UserIntelligenceContext';
import ICPFrameworkDisplay from '../tools/ICPFrameworkDisplay';
import TechnicalTranslationWidget from './cards/TechnicalTranslationWidget';
import StakeholderArsenalWidget from './cards/StakeholderArsenalWidget';
import ProductInputSection from './cards/ProductInputSection';
import CoreResourcesLoadingScreen from './cards/CoreResourcesLoadingScreen';
import SmartExportInterface from '../export/SmartExportInterface';
import { ExportEngineService } from '../../services/ExportEngineService';
import webhookService from '../../services/webhookService';

const SimplifiedICP = ({ customerId }) => {
  const navigate = useNavigate();
  const { assessment, milestone, usage, updateUsage } = useUserIntelligence();
  const [companyName, setCompanyName] = useState('');
  const [ratingResult, setRatingResult] = useState(null);
  const [isRating, setIsRating] = useState(false);
  const [icpFramework, setIcpFramework] = useState(null);
  const [activeSection, setActiveSection] = useState('generate');
  const [productData, setProductData] = useState(null);
  const [isGeneratingResources, setIsGeneratingResources] = useState(false);
  const [generationSessionId, setGenerationSessionId] = useState(null);
  const [customerData, setCustomerData] = useState({
    salesSageResources: null // Will be populated when resources are generated
  });
  const [showExportInterface, setShowExportInterface] = useState(false);
  const [exportData, setExportData] = useState(null);
  const [copiedFormat, setCopiedFormat] = useState(null);
  
  // Usage tracking refs
  const startTimeRef = useRef(Date.now());
  const clickCountRef = useRef(0);
  const sectionsViewedRef = useRef(new Set());

  // Track section views for usage assessment
  useEffect(() => {
    sectionsViewedRef.current.add(activeSection);
  }, [activeSection]);

  // Check for completed resources on component mount and periodically
  useEffect(() => {
    const checkForCompletedResources = async () => {
      // Check if there's a pending generation
      const pendingGeneration = JSON.parse(localStorage.getItem('pendingSalesSageGeneration') || 'null');
      const sessionId = generationSessionId || localStorage.getItem('current_generation_id');
      
      
      // Check for resources even if no pending generation (in case generation completed)
      if (sessionId || (pendingGeneration && pendingGeneration.customerId === customerId)) {
        const actualSessionId = sessionId || localStorage.getItem('current_generation_id');
        if (actualSessionId) {
          try {
            const resources = await webhookService.getResources(actualSessionId);
            if (resources && Object.keys(resources).length > 0) {
              console.log('🎉 Resources loaded successfully!', resources);
              
              // Debug: Check if this is webhook content or fallback content
              const isWebhookContent = resources.icp_analysis?.content?.length > 5000; // Rich content is much longer
              const contentSource = isWebhookContent ? 'WEBHOOK (Rich Make.com content)' : 'FALLBACK (Mock realistic content)';
              console.log(`🔍 Content Source: ${contentSource}`);
              console.log(`📊 Content Length: ${resources.icp_analysis?.content?.length || 0} characters`);
              setCustomerData(prev => ({
                ...prev,
                salesSageResources: resources
              }));
              setIsGeneratingResources(false);
              // Clear pending generation flag
              localStorage.removeItem('pendingSalesSageGeneration');
            }
          } catch (error) {
            console.log('Still checking for resources:', error.message);
          }
        }
      }
    };

    // Check immediately
    checkForCompletedResources();

    // Check every 5 seconds if we're generating resources
    const interval = setInterval(() => {
      if (isGeneratingResources || localStorage.getItem('pendingSalesSageGeneration')) {
        checkForCompletedResources();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [customerId, generationSessionId, isGeneratingResources]);

  // Track clicks for engagement assessment
  const trackClick = useCallback((action) => {
    clickCountRef.current += 1;
    console.log('Usage tracked:', action, clickCountRef.current);
  }, []);

  // Track time spent on component unmount
  useEffect(() => {
    return () => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      updateUsage({
        icpTimeSpent: timeSpent,
        icpClicks: clickCountRef.current,
        icpSectionsViewed: sectionsViewedRef.current.size,
        icpProgress: ratingResult ? 100 : 50,
        lastICPAccess: Date.now()
      });
    };
  }, [ratingResult, updateUsage]);

  // Milestone-specific guidance
  const guidance = useMemo(() => {
    const guides = {
      foundation: {
        focus: 'Establish systematic buyer understanding frameworks',
        tip: 'Start with clear buyer personas and pain point identification',
        nextStep: 'Use these insights to improve value communication',
        depth: 'basic'
      },
      growth: {
        focus: 'Optimize buyer intelligence for scale and team training',
        tip: 'Refine personas for enterprise deals and competitive scenarios',
        nextStep: 'Apply insights to multi-stakeholder engagement strategies',
        depth: 'intermediate'
      },
      expansion: {
        focus: 'Advanced buyer intelligence for market expansion',
        tip: 'Develop sophisticated competitive positioning and market insights',
        nextStep: 'Use for strategic market penetration and Series B positioning',
        depth: 'advanced'
      }
    };
    
    return guides[milestone?.tier] || guides.foundation;
  }, [milestone]);

  // Handle framework updates
  const handleFrameworkUpdate = useCallback((framework) => {
    setIcpFramework(framework);
    trackClick('update_framework');
  }, [trackClick]);

  // Handle company rating
  const handleRateCompany = useCallback(() => {
    if (!companyName.trim()) return;
    
    setIsRating(true);
    trackClick('rate_company');
    
    // Simulate rating calculation
    setTimeout(() => {
      // Calculate score based on framework weights
      const criteria = icpFramework || [
        { name: 'Company Size', weight: 25, score: 0 },
        { name: 'Technical Maturity', weight: 30, score: 0 },
        { name: 'Growth Stage', weight: 20, score: 0 },
        { name: 'Pain Point Severity', weight: 25, score: 0 }
      ];
      
      // Generate random scores for demo (in production, this would be calculated)
      const scoredCriteria = criteria.map(criterion => ({
        ...criterion,
        score: Math.floor(Math.random() * 30) + 70 // 70-100 range
      }));
      
      const overallScore = scoredCriteria.reduce((total, criterion) => {
        return total + (criterion.score * criterion.weight / 100);
      }, 0);
      
      const result = {
        companyName,
        overallScore: Math.round(overallScore),
        criteria: scoredCriteria,
        recommendation: overallScore >= 85 ? 'High Priority' : 
                       overallScore >= 70 ? 'Medium Priority' : 'Low Priority',
        insights: generateInsights(overallScore, scoredCriteria)
      };
      
      setRatingResult(result);
      setIsRating(false);
      
      // Prepare export data for Sarah Chen
      setExportData({
        icpData: {
          buyerPersona: {
            demographics: `${companyName} - ${result.recommendation} ICP match`,
            painPoints: result.insights.map(i => i.message),
            decisionMaking: 'Technical founder decision-making process'
          },
          icpScore: result.overallScore,
          criteria: result.criteria
        },
        assessmentData: result,
        companyName: companyName
      });
      
      // Update usage
      updateUsage({
        lastICPRating: Date.now(),
        icpProgress: 100,
        companiesRated: (usage?.companiesRated || 0) + 1
      });
    }, 1500);
  }, [companyName, icpFramework, trackClick, updateUsage, usage]);

  // Generate insights based on score
  const generateInsights = (score, criteria) => {
    const insights = [];
    
    if (score >= 85) {
      insights.push({
        type: 'success',
        message: 'Excellent ICP fit - prioritize for immediate engagement',
        icon: CheckCircle
      });
    }
    
    const lowestCriterion = criteria.reduce((min, c) => c.score < min.score ? c : min);
    if (lowestCriterion.score < 75) {
      insights.push({
        type: 'warning',
        message: `${lowestCriterion.name} needs improvement for optimal fit`,
        icon: AlertCircle
      });
    }
    
    insights.push({
      type: 'info',
      message: milestone?.tier === 'foundation' 
        ? 'Document this analysis for team training'
        : milestone?.tier === 'growth'
        ? 'Use for multi-stakeholder engagement strategy'
        : 'Apply to strategic account planning',
      icon: Lightbulb
    });
    
    return insights;
  };

  // Quick AI Prompts Generator for Sarah Chen
  const generateQuickAIPrompts = async (exportData) => {
    const { icpData, companyName } = exportData;
    
    return {
      prospectResearchPrompt: `You are a sales research specialist for a Series A technical founder.

COMPANY TO RESEARCH: ${companyName}

ICP ANALYSIS RESULTS:
- ICP Score: ${icpData.icpScore}/100
- Key Criteria Scores: ${icpData.criteria.map(c => `${c.name}: ${c.score}%`).join(', ')}
- Priority Level: ${icpData.icpScore >= 85 ? 'High Priority' : icpData.icpScore >= 70 ? 'Medium Priority' : 'Low Priority'}

RESEARCH TASKS:
1. Validate ICP fit by researching their current tech stack and growth stage
2. Identify 2-3 specific pain points they likely have based on our analysis
3. Find the technical decision-maker (CTO/VP Engineering) and their background
4. Suggest 3 talking points that would resonate with technical founders

DESIRED OUTPUT FORMAT:
- Quick Executive Summary (2-3 sentences)
- Key Stakeholders (name, role, LinkedIn)
- Pain Points (specific to their situation)
- Recommended Approach (technical founder to technical founder)

Company URL/Domain: [INSERT COMPANY DOMAIN]
Industry Context: [INSERT INDUSTRY]`,

      valuePropositionPrompt: `You are helping a Series A technical founder create value props for ${companyName}.

CONTEXT:
Our ICP analysis shows ${companyName} scored ${icpData.icpScore}% fit.
This makes them a ${icpData.icpScore >= 85 ? 'HIGH' : icpData.icpScore >= 70 ? 'MEDIUM' : 'LOW'} priority prospect.

CREATE TECHNICAL VALUE PROPS:
1. Problem/Solution fit based on ICP scoring
2. Technical benefits that matter to their engineering team  
3. Business impact metrics relevant to their growth stage
4. Implementation approach (technical founder perspective)

Make it conversational for founder-to-founder discussions.`
    };
  };

  // Clipboard utility
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  };

  // Sample buyer personas based on milestone tier
  const buyerPersonas = useMemo(() => {
    const personas = {
      foundation: [
        {
          title: 'Technical Decision Maker',
          role: 'CTO / VP Engineering',
          priorities: ['Technical excellence', 'Scalability', 'Integration ease'],
          painPoints: ['Legacy system limitations', 'Technical debt', 'Resource constraints'],
          messaging: 'Focus on technical superiority and implementation efficiency'
        },
        {
          title: 'Business Stakeholder',
          role: 'CEO / COO',
          priorities: ['Revenue growth', 'Operational efficiency', 'Competitive advantage'],
          painPoints: ['Market pressure', 'Growth limitations', 'Process inefficiencies'],
          messaging: 'Emphasize business outcomes and ROI'
        }
      ],
      growth: [
        {
          title: 'Economic Buyer',
          role: 'CFO / VP Finance',
          priorities: ['Cost reduction', 'ROI maximization', 'Budget optimization'],
          painPoints: ['Budget constraints', 'Unclear ROI', 'Hidden costs'],
          messaging: 'Quantify financial impact and payback period'
        },
        {
          title: 'Champion',
          role: 'Director / Senior Manager',
          priorities: ['Team productivity', 'Career advancement', 'Departmental success'],
          painPoints: ['Team bottlenecks', 'Lack of resources', 'Performance pressure'],
          messaging: 'Show how solution enables their success'
        },
        {
          title: 'End User',
          role: 'Individual Contributor',
          priorities: ['Ease of use', 'Time savings', 'Better tools'],
          painPoints: ['Manual processes', 'Tool frustration', 'Productivity barriers'],
          messaging: 'Highlight user experience and efficiency gains'
        }
      ],
      expansion: [
        {
          title: 'Executive Sponsor',
          role: 'C-Suite Executive',
          priorities: ['Strategic initiatives', 'Market leadership', 'Board metrics'],
          painPoints: ['Competitive threats', 'Digital transformation', 'Investor pressure'],
          messaging: 'Position as strategic enabler for company vision'
        },
        {
          title: 'Procurement',
          role: 'Head of Procurement',
          priorities: ['Vendor consolidation', 'Risk mitigation', 'Contract terms'],
          painPoints: ['Vendor management', 'Compliance requirements', 'Cost control'],
          messaging: 'Demonstrate vendor excellence and partnership approach'
        },
        {
          title: 'Legal/Compliance',
          role: 'General Counsel / Compliance Officer',
          priorities: ['Risk reduction', 'Regulatory compliance', 'Data security'],
          painPoints: ['Security concerns', 'Regulatory changes', 'Audit requirements'],
          messaging: 'Address security, compliance, and risk mitigation'
        }
      ]
    };
    
    return personas[milestone?.tier] || personas.foundation;
  }, [milestone]);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/customer/${customerId}/simplified/dashboard`)}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">ICP Analysis Tool</h1>
          <p className="text-gray-400">Systematic buyer understanding and targeting framework</p>
        </div>

        {/* Milestone Guidance */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-white font-medium mb-1">{milestone?.tier?.charAt(0).toUpperCase() + milestone?.tier?.slice(1)} Stage Guidance</p>
              <p className="text-gray-400 text-sm mb-2">{guidance.focus}</p>
              <p className="text-blue-400 text-sm">{guidance.tip}</p>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => {
              setActiveSection('generate');
              trackClick('view_generate');
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeSection === 'generate'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-900 text-gray-400 hover:text-white'
            }`}
          >
            Generate Resources
          </button>
          <button
            onClick={() => {
              setActiveSection('framework');
              trackClick('view_framework');
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeSection === 'framework'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-900 text-gray-400 hover:text-white'
            }`}
          >
            Scoring Framework
          </button>
          <button
            onClick={() => {
              setActiveSection('rate');
              trackClick('view_rating');
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeSection === 'rate'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-900 text-gray-400 hover:text-white'
            }`}
          >
            Rate Company
          </button>
          <button
            onClick={() => {
              setActiveSection('personas');
              trackClick('view_personas');
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeSection === 'personas'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-900 text-gray-400 hover:text-white'
            }`}
          >
            Buyer Personas
          </button>
        </div>

        {/* Main Content */}
        {activeSection === 'framework' && (
          <div className="space-y-6">
            <ICPFrameworkDisplay 
              customerData={{ icpFramework }}
              onFrameworkUpdate={handleFrameworkUpdate}
            />
            
            {/* Quick Tips */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Implementation Tips
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    Weight criteria based on your specific market and product fit
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    Use historical win/loss data to validate scoring accuracy
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    Review and adjust quarterly based on market changes
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'personas' && (
          <div className="space-y-6">
            {buyerPersonas.map((persona, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{persona.title}</h3>
                    <p className="text-gray-400">{persona.role}</p>
                  </div>
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-blue-400 mb-2">Priorities</h4>
                    <ul className="space-y-1">
                      {persona.priorities.map((priority, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                          <ChevronRight className="w-3 h-3 text-gray-500 mt-0.5" />
                          {priority}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-red-400 mb-2">Pain Points</h4>
                    <ul className="space-y-1">
                      {persona.painPoints.map((pain, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                          <AlertCircle className="w-3 h-3 text-gray-500 mt-0.5" />
                          {pain}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-green-400 mb-2">Messaging</h4>
                    <p className="text-gray-300 text-sm">{persona.messaging}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Next Step */}
            <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <ArrowRight className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Next Step</p>
                  <p className="text-blue-400 text-sm">{guidance.nextStep}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'rate' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Rate Company Fit</h3>
              
              {!ratingResult ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter company name to analyze"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <button
                    onClick={handleRateCompany}
                    disabled={!companyName.trim() || isRating}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isRating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4" />
                        Rate Company
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gray-800 mb-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">{ratingResult.overallScore}%</div>
                        <div className="text-sm text-gray-400">ICP Score</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{ratingResult.companyName}</h3>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                      ratingResult.recommendation === 'High Priority' 
                        ? 'bg-green-900/30 text-green-400'
                        : ratingResult.recommendation === 'Medium Priority'
                        ? 'bg-yellow-900/30 text-yellow-400'
                        : 'bg-red-900/30 text-red-400'
                    }`}>
                      <Star className="w-4 h-4" />
                      {ratingResult.recommendation}
                    </div>
                  </div>
                  
                  {/* Criteria Scores */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Scoring Breakdown</h4>
                    <div className="space-y-2">
                      {ratingResult.criteria.map((criterion, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">{criterion.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-800 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${criterion.score}%` }}
                              />
                            </div>
                            <span className="text-white text-sm font-medium w-12 text-right">
                              {criterion.score}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Insights */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Key Insights</h4>
                    <div className="space-y-2">
                      {ratingResult.insights.map((insight, index) => (
                        <div key={index} className={`p-3 rounded-lg flex items-start gap-3 ${
                          insight.type === 'success' 
                            ? 'bg-green-900/20 border border-green-800'
                            : insight.type === 'warning'
                            ? 'bg-yellow-900/20 border border-yellow-800'
                            : 'bg-blue-900/20 border border-blue-800'
                        }`}>
                          <insight.icon className={`w-4 h-4 mt-0.5 ${
                            insight.type === 'success' 
                              ? 'text-green-400'
                              : insight.type === 'warning'
                              ? 'text-yellow-400'
                              : 'text-blue-400'
                          }`} />
                          <p className="text-gray-300 text-sm">{insight.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Sarah Chen: Immediate Export Actions */}
                  <div className="space-y-4">
                    {/* Quick Export Options - Technical Founder Optimized */}
                    <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Rocket className="w-4 h-4 text-blue-400" />
                        <h4 className="text-white font-medium">Next Steps: Apply This Intelligence</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Claude/AI Prompts */}
                        <button
                          onClick={async () => {
                            if (exportData) {
                              const aiPrompts = await generateQuickAIPrompts(exportData);
                              await copyToClipboard(aiPrompts.prospectResearchPrompt);
                              setCopiedFormat('claude');
                              setTimeout(() => setCopiedFormat(null), 2000);
                              trackClick('quick_export_claude');
                            }
                          }}
                          className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-blue-500 rounded-lg text-left transition-all group"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">🤖</span>
                            <span className="text-white text-sm font-medium">Claude Prompt</span>
                            {copiedFormat === 'claude' ? (
                              <CheckCircle className="w-3 h-3 text-green-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-gray-400 group-hover:text-blue-400" />
                            )}
                          </div>
                          <p className="text-gray-400 text-xs">Research prospects using this ICP analysis</p>
                        </button>

                        {/* CRM Integration */}
                        <button
                          onClick={() => {
                            setShowExportInterface(true);
                            trackClick('quick_export_crm');
                          }}
                          className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-green-500 rounded-lg text-left transition-all group"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">📊</span>
                            <span className="text-white text-sm font-medium">CRM Setup</span>
                            <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-green-400" />
                          </div>
                          <p className="text-gray-400 text-xs">HubSpot/Salesforce scoring fields</p>
                        </button>

                        {/* Sales Automation */}
                        <button
                          onClick={() => {
                            setShowExportInterface(true);
                            trackClick('quick_export_sales');
                          }}
                          className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-purple-500 rounded-lg text-left transition-all group"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">🎯</span>
                            <span className="text-white text-sm font-medium">Sales Sequences</span>
                            <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-purple-400" />
                          </div>
                          <p className="text-gray-400 text-xs">Outreach/SalesLoft templates</p>
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-700">
                        <button
                          onClick={() => setShowExportInterface(true)}
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                        >
                          <FileDown className="w-3 h-3" />
                          View All Export Options
                        </button>
                        <span className="text-gray-500 text-xs">•</span>
                        <span className="text-gray-400 text-xs">Score: {ratingResult.overallScore}% ICP match</span>
                      </div>
                    </div>

                    {/* Standard Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setRatingResult(null);
                          setCompanyName('');
                          setExportData(null);
                          trackClick('rate_another');
                        }}
                        className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        Rate Another
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'generate' && (
          <div className="space-y-6">
            {/* Product Input Section */}
            <ProductInputSection 
              customerId={customerId}
              onProductSubmit={(data) => {
                setProductData(data);
                
                // If this is a generation request, start loading screen
                if (data.isGenerating && data.sessionId) {
                  setIsGeneratingResources(true);
                  setGenerationSessionId(data.sessionId);
                }
                
                updateUsage({
                  lastResourceGeneration: Date.now(),
                  resourceGenerationCount: (usage?.resourceGenerationCount || 0) + 1
                });
              }}
/>
            
          </div>
        )}

        {/* Intelligence Widgets Section - moved from dashboard */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Customer Intelligence Tools</h2>
            <p className="text-gray-400 text-sm ml-2">Transform insights into actionable strategies</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Technical Translation Widget */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Technical Translation</h3>
                  <p className="text-gray-400 text-sm">Transform metrics into business language</p>
                </div>
              </div>
              <TechnicalTranslationWidget />
            </div>

            {/* Stakeholder Arsenal Widget */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Stakeholder Arsenal</h3>
                  <p className="text-gray-400 text-sm">Role-specific preparation for customer calls</p>
                </div>
              </div>
              <StakeholderArsenalWidget />
            </div>
          </div>
        </div>
      </div>
      
      {/* Loading Screen for Core Resources Generation */}
      {isGeneratingResources && generationSessionId && (
        <CoreResourcesLoadingScreen 
          sessionId={generationSessionId}
          onComplete={async () => {
            // Handle completion
            try {
              const resources = await webhookService.getResources(generationSessionId);
              if (resources) {
                setCustomerData(prev => ({
                  ...prev,
                  salesSageResources: resources
                }));
              }
            } catch (error) {
              console.error('Error loading resources:', error);
            }
            
            setIsGeneratingResources(false);
            setGenerationSessionId(null);
          }}
        />
      )}

      {/* Smart Export Interface Modal */}
      {showExportInterface && exportData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-6xl max-h-[90vh] overflow-auto w-full">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Export ICP Intelligence</h2>
                <p className="text-gray-400 text-sm">Transform your analysis into actionable tools</p>
              </div>
              <button
                onClick={() => setShowExportInterface(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <SmartExportInterface
                sourceData={exportData}
                contentType="icp-analysis"
                userTools={['claude', 'chatgpt', 'hubspot', 'salesforce', 'outreach', 'salesloft']}
                onExport={(exportResults) => {
                  console.log('Export completed:', exportResults);
                  // Handle export results - could download files, show copy dialogs, etc.
                  exportResults.forEach(result => {
                    if (result.formatInfo.fileType === 'text') {
                      // For text formats, copy to clipboard
                      copyToClipboard(JSON.stringify(result.data, null, 2));
                    } else {
                      // For other formats, could trigger download
                      console.log(`Exporting ${result.filename}:`, result.data);
                    }
                  });
                  
                  // Track export usage
                  updateUsage({ 
                    lastICPExport: Date.now(),
                    exportFormatsUsed: exportResults.length
                  });
                  trackClick('full_export_completed');
                  
                  setShowExportInterface(false);
                }}
                className="border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimplifiedICP;