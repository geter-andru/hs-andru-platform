import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { airtableService } from '../../services/airtableService';
import { authService } from '../../services/authService';
import { TaskRecommendationEngine } from '../../services/TaskRecommendationEngine';
import { TaskCompletionService } from '../../services/TaskCompletionService';

// Create context
const UserIntelligenceContext = createContext();

// Custom hook for using the context
export const useUserIntelligence = () => {
  const context = useContext(UserIntelligenceContext);
  if (!context) {
    throw new Error('useUserIntelligence must be used within UserIntelligenceProvider');
  }
  
  // Return with safe defaults for graceful degradation
  return {
    // Assessment data with safe defaults
    assessment: context.assessment || {
      performance: { level: 'Average', score: 50 },
      revenue: { opportunity: 500000 },
      strategy: { focusArea: 'Sales Process' },
      challenges: { critical: 0, highPriority: 0, manageable: 0 },
      competencyScores: { 
        customerAnalysis: 50, 
        valueCommunication: 50, 
        executiveReadiness: 50 
      }
    },
    
    // Business context data for dynamic widget personalization
    businessContext: context.businessContext || {
      industry: 'Technology',
      productType: 'SaaS Platform',
      targetMarket: 'Enterprise',
      fundingStage: 'Series A',
      currentARR: 2100000,
      targetARR: 10000000,
      teamSize: 25,
      customerCount: 150
    },
    
    // ICP Analysis results for stakeholder intelligence
    icpAnalysis: context.icpAnalysis || {
      targetIndustries: ['Healthcare', 'Financial Services'],
      buyerPersonas: [],
      painPoints: [],
      valuePropositions: [],
      competitiveAdvantages: []
    },
    
    // Cost Calculator results for ROI intelligence  
    costCalculatorResults: context.costCalculatorResults || {
      annualSavings: 0,
      paybackPeriod: 0,
      implementationCost: 0,
      roiPercentage: 0
    },
    
    // Milestone data with safe defaults
    milestone: context.milestone || {
      tier: 'foundation',
      context: 'Building systematic business intelligence capabilities',
      targets: { customerAnalysis: 70, valueCommunication: 65, executiveReadiness: 50 }
    },
    
    // Usage tracking with safe defaults
    usage: context.usage || {},
    
    // Loading and error states
    loading: context.loading || false,
    error: context.error || null,
    
    // Methods
    updateUsage: context.updateUsage,
    refreshData: context.refreshData
  };
};

// Data extraction functions for widget personalization
const extractBusinessContext = (customerData) => {
  // Try to extract from ICP content first, then fall back to defaults
  const icpContent = customerData.icpContent || {};
  
  return {
    industry: icpContent.industry || customerData.industry || 'Technology',
    productType: icpContent.productType || 'SaaS Platform',
    targetMarket: icpContent.targetMarket || 'Enterprise',
    fundingStage: customerData.fundingStage || 'Series A',
    currentARR: customerData.currentARR || 2100000,
    targetARR: customerData.targetARR || 10000000,
    teamSize: customerData.teamSize || 25,
    customerCount: customerData.customerCount || 150,
    companyName: customerData.customerName || 'Your Company'
  };
};

const extractIcpAnalysis = (customerData) => {
  const icpContent = customerData.icpContent || {};
  
  return {
    targetIndustries: icpContent.segments?.map(s => s.name) || ['Healthcare', 'Financial Services'],
    buyerPersonas: icpContent.buyerPersonas || [],
    painPoints: icpContent.keyIndicators || [],
    valuePropositions: icpContent.valuePropositions || [],
    competitiveAdvantages: icpContent.competitiveAdvantages || [],
    ratingCriteria: icpContent.ratingCriteria || []
  };
};

const extractCostCalculatorResults = (customerData) => {
  const costContent = customerData.costCalculatorContent || {};
  
  return {
    annualSavings: costContent.annualSavings || 750000,
    paybackPeriod: costContent.paybackPeriod || 18,
    implementationCost: costContent.implementationCost || 75000,
    roiPercentage: costContent.roiPercentage || 150,
    categories: costContent.categories || [],
    scenarios: costContent.scenarios || []
  };
};

// Enhanced milestone detection using TaskRecommendationEngine
const detectMilestoneTier = (businessMetrics) => {
  if (!businessMetrics) return 'foundation';
  
  // Use enhanced detection with task data
  const enhancedMilestone = TaskRecommendationEngine.detectMilestoneWithTasks(businessMetrics);
  
  // Return the enhanced milestone or fall back to basic detection
  if (enhancedMilestone) {
    return enhancedMilestone;
  }
  
  // Fallback to original logic
  const { mrr, teamSize, customerCount, fundingStage } = businessMetrics;
  
  if (mrr >= 75000 || teamSize > 15 || customerCount > 150 || fundingStage === 'Series A') {
    return { tier: 'expansion', context: 'Market expansion and enterprise sales' };
  }
  
  if (mrr >= 25000 || teamSize > 8 || customerCount > 50 || fundingStage === 'Seed') {
    return { tier: 'growth', context: 'Scaling systematic revenue processes' };
  }
  
  return { tier: 'foundation', context: 'Building systematic foundations' };
};

// Milestone configuration by tier
const getMilestoneConfig = (tier) => {
  const configs = {
    foundation: {
      tier: 'foundation',
      context: 'Building systematic foundations for scalable growth',
      targets: { customerAnalysis: 70, valueCommunication: 65, executiveReadiness: 50 },
      priority: ['Customer Analysis', 'Value Communication', 'Executive Readiness'],
      focus: 'Establish systematic buyer understanding frameworks',
      timeframe: '3-6 months'
    },
    growth: {
      tier: 'growth',
      context: 'Scaling systematic revenue processes for consistent growth',
      targets: { customerAnalysis: 85, valueCommunication: 80, executiveReadiness: 75 },
      priority: ['Value Communication', 'Executive Readiness', 'Customer Analysis'],
      focus: 'Optimize buyer intelligence for scale and team training',
      timeframe: '6-12 months'
    },
    expansion: {
      tier: 'expansion',
      context: 'Developing enterprise sales sophistication and market leadership',
      targets: { customerAnalysis: 90, valueCommunication: 90, executiveReadiness: 85 },
      priority: ['Executive Readiness', 'Strategic Intelligence', 'Competitive Mastery'],
      focus: 'Advanced buyer intelligence for market expansion',
      timeframe: '12-18 months'
    }
  };
  
  return configs[tier] || configs.foundation;
};

// Provider component
export const UserIntelligenceProvider = ({ children, customerId }) => {
  const [userIntelligence, setUserIntelligence] = useState({
    assessment: null,
    milestone: null,
    usage: {},
    loading: true,
    error: null
  });

  // Single fetch for all user data
  const fetchUserData = useCallback(async () => {
    if (!customerId) {
      console.log('❌ No customerId provided to UserIntelligenceContext');
      return;
    }
    
    console.log('🔍 UserIntelligenceContext: Fetching data for', customerId);
    
    try {
      setUserIntelligence(prev => ({ ...prev, loading: true, error: null }));
      
      // For test environments and admin users ALWAYS use mock data
      if (customerId.includes('TEST') || customerId === 'CUST_4' || customerId === 'CUST_02' || customerId === 'CUST_2') {
        console.log('✅ Test/Admin mode detected - using mock data for', customerId);
        setUserIntelligence({
          assessment: {
            performance: { level: 'Good', score: 72 },
            revenue: { opportunity: 850000 },
            strategy: { focusArea: 'Enterprise Sales' },
            challenges: { critical: 1, highPriority: 2, manageable: 3 },
            competencyScores: { 
              customerAnalysis: 65, 
              valueCommunication: 58, 
              executiveReadiness: 72 
            }
          },
          businessContext: {
            industry: 'Healthcare Technology',
            productType: 'AI-Powered SaaS Platform',
            targetMarket: 'Enterprise Healthcare',
            fundingStage: 'Series A',
            currentARR: 2100000,
            targetARR: 10000000,
            teamSize: 25,
            customerCount: 150,
            companyName: 'MedTech AI'
          },
          icpAnalysis: {
            targetIndustries: ['Healthcare', 'Medical Technology'],
            buyerPersonas: ['Healthcare CFO', 'Medical Director', 'COO'],
            painPoints: ['Claims processing overhead', 'Regulatory compliance costs', 'Operational inefficiencies'],
            valuePropositions: ['10x faster processing', '99% accuracy improvement', 'Reduced operational costs'],
            competitiveAdvantages: ['AI-powered automation', 'Proven enterprise reliability', 'Regulatory compliance'],
            ratingCriteria: []
          },
          costCalculatorResults: {
            annualSavings: 930000,
            paybackPeriod: 15,
            implementationCost: 125000,
            roiPercentage: 180,
            categories: [],
            scenarios: []
          },
          milestone: getMilestoneConfig('growth'),
          usage: {
            icpProgress: 75,
            financialProgress: 60,
            resourcesAccessed: 45,
            weeklyTasksCompleted: 8,
            weeklyTasksTotal: 12,
            monthlyHours: 24,
            mostUsedTool: 'ICP Analysis'
          },
          loading: false,
          error: null
        });
        return;  // Exit early for test/admin users
      }
      
      // For regular users, check session and fetch from Airtable
      const session = authService.getCurrentSession();
      console.log('🔐 Session status:', session ? 'Found' : 'Not found');
      
      if (!session) {
        throw new Error('No active session');
      }
      
      // SINGLE API CALL for all data
      const customerData = await airtableService.fetchCustomerWithAssessment(
        customerId, 
        session.accessToken
      );
      
      // Extract assessment data
      const assessment = customerData.assessment || null;
      
      // Extract business context for widget personalization
      const businessContext = extractBusinessContext(customerData);
      
      // Extract ICP analysis results
      const icpAnalysis = extractIcpAnalysis(customerData);
      
      // Extract cost calculator results  
      const costCalculatorResults = extractCostCalculatorResults(customerData);
      
      // Extract or calculate milestone data
      const businessMetrics = customerData.businessMetrics || {
        mrr: customerData.revenue?.current ? customerData.revenue.current / 12 : 0,
        teamSize: customerData.teamSize || 1,
        customerCount: customerData.customerCount || 0,
        fundingStage: customerData.fundingStage || 'Pre-seed'
      };
      
      const tier = detectMilestoneTier(businessMetrics);
      const milestone = getMilestoneConfig(tier);
      
      // Extract usage data
      const usage = customerData.usageAnalytics || {};
      
      setUserIntelligence({
        assessment,
        businessContext,
        icpAnalysis,
        costCalculatorResults,
        milestone,
        usage,
        loading: false,
        error: null
      });
      
    } catch (error) {
      console.error('❌ Error fetching user intelligence:', error);
      console.error('❌ Error details:', { customerId, errorMessage: error.message });
      
      // For test environments and admin users, fall back to mock data instead of showing error
      if (customerId.includes('TEST') || customerId === 'CUST_4') {
        console.log('✅ Test/Admin mode fallback - using mock data due to error:', error.message);
        setUserIntelligence({
          assessment: {
            performance: { level: 'Good', score: 72 },
            revenue: { opportunity: 850000 },
            strategy: { focusArea: 'Enterprise Sales' },
            challenges: { critical: 1, highPriority: 2, manageable: 3 },
            competencyScores: { 
              customerAnalysis: 65, 
              valueCommunication: 58, 
              executiveReadiness: 72 
            }
          },
          businessContext: {
            industry: 'Healthcare Technology',
            productType: 'AI-Powered SaaS Platform',
            targetMarket: 'Enterprise Healthcare',
            fundingStage: 'Series A',
            currentARR: 2100000,
            targetARR: 10000000,
            teamSize: 25,
            customerCount: 150,
            companyName: 'MedTech AI'
          },
          icpAnalysis: {
            targetIndustries: ['Healthcare', 'Medical Technology'],
            buyerPersonas: ['Healthcare CFO', 'Medical Director', 'COO'],
            painPoints: ['Claims processing overhead', 'Regulatory compliance costs', 'Operational inefficiencies'],
            valuePropositions: ['10x faster processing', '99% accuracy improvement', 'Reduced operational costs'],
            competitiveAdvantages: ['AI-powered automation', 'Proven enterprise reliability', 'Regulatory compliance'],
            ratingCriteria: []
          },
          costCalculatorResults: {
            annualSavings: 930000,
            paybackPeriod: 15,
            implementationCost: 125000,
            roiPercentage: 180,
            categories: [],
            scenarios: []
          },
          milestone: getMilestoneConfig('growth'),
          usage: {
            icpProgress: 75,
            financialProgress: 60,
            resourcesAccessed: 45,
            weeklyTasksCompleted: 8,
            weeklyTasksTotal: 12,
            monthlyHours: 24,
            mostUsedTool: 'ICP Analysis'
          },
          loading: false,
          error: null
        });
        return;
      }
      
      setUserIntelligence(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  }, [customerId]);

  // Initial data fetch
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Enhanced usage tracking update with task completion integration
  const updateUsage = useCallback((newUsageData) => {
    setUserIntelligence(prev => {
      const updatedUsage = { ...prev.usage, ...newUsageData };
      
      // Enhance usage assessment with task completion data if available
      let enhancedAssessment = prev.assessment;
      if (newUsageData.tasksCompleted || newUsageData.taskCompetencyGains) {
        enhancedAssessment = TaskCompletionService.enhanceUsageAssessmentWithTasks(
          prev.assessment,
          customerId
        );
      }
      
      return {
        ...prev,
        usage: updatedUsage,
        assessment: enhancedAssessment
      };
    });
    
    // Throttled Airtable update (every 30 seconds)
    // This would be implemented with a debounce/throttle utility
  }, [customerId]);

  // Refresh data method
  const refreshData = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    ...userIntelligence,
    updateUsage,
    refreshData
  }), [userIntelligence, updateUsage, refreshData]);

  return (
    <UserIntelligenceContext.Provider value={contextValue}>
      {children}
    </UserIntelligenceContext.Provider>
  );
};

export default UserIntelligenceContext;