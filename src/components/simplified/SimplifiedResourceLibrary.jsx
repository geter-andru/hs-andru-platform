import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText,
  Download,
  Search,
  Filter,
  Clock,
  TrendingUp,
  Star,
  Bookmark,
  Users,
  Target,
  BarChart3,
  Briefcase,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Eye,
  Copy
} from 'lucide-react';
import { useUserIntelligence } from '../../contexts/simplified/UserIntelligenceContext';
import { TaskResourceMatcher } from '../../services/TaskResourceMatcher';
import { TaskCompletionService } from '../../services/TaskCompletionService';

const SimplifiedResourceLibrary = ({ customerId }) => {
  const navigate = useNavigate();
  const { assessment, milestone, usage, updateUsage } = useUserIntelligence();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTier, setSelectedTier] = useState('current');
  const [viewMode, setViewMode] = useState('grid');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [taskDrivenRecs, setTaskDrivenRecs] = useState([]);

  // Resource database organized by tier and category - 35 comprehensive business resources
  const resourceDatabase = useMemo(() => ({
    foundation: {
      'Core Business Resources': [
        {
          id: 'core-negative-persona',
          title: 'Negative Buyer Persona',
          description: 'Profile of who should NOT buy your product',
          type: 'template',
          duration: '25 min',
          popularity: 92,
          tags: ['personas', 'targeting', 'qualification'],
          content: 'Detailed framework for identifying poor-fit customers...'
        },
        {
          id: 'core-value-messaging',
          title: 'Value Messaging Overview',
          description: 'Core value propositions and messaging framework',
          type: 'framework',
          duration: '35 min',
          popularity: 95,
          tags: ['messaging', 'value-prop', 'positioning'],
          content: 'Complete messaging framework and positioning guide...'
        },
        {
          id: 'core-moment-in-life',
          title: 'Moment in Life Description',
          description: 'Specific trigger moments when customers need your solution',
          type: 'analysis',
          duration: '30 min',
          popularity: 89,
          tags: ['triggers', 'timing', 'moments'],
          content: 'Framework for identifying customer trigger moments...'
        }
      ],
      'Advanced Sales Resources': [
        {
          id: 'advanced-buyer-ux',
          title: 'Buyer-Centric UX Considerations & Tips',
          description: 'User experience optimization from buyer\'s perspective',
          type: 'guide',
          duration: '40 min',
          popularity: 91,
          tags: ['ux', 'buyer-centric', 'optimization'],
          content: 'Complete UX optimization guide for buyers...',
          placeholder: true,
          comingSoonLabel: 'Buyer-Centric UX Tips'
        },
        {
          id: 'advanced-product-usage',
          title: 'Product Usage Assessment',
          description: 'Analysis of how customers adopt and use your product',
          type: 'assessment',
          duration: '35 min',
          popularity: 88,
          tags: ['adoption', 'usage', 'analytics'],
          content: 'Framework for analyzing product adoption patterns...',
          placeholder: true,
          comingSoonLabel: 'Product Usage Assessment'
        },
        {
          id: 'advanced-day-in-life',
          title: '"Day in the Life" Description',
          description: 'Detailed daily workflow with your product integrated',
          type: 'framework',
          duration: '45 min',
          popularity: 93,
          tags: ['workflow', 'integration', 'daily-use'],
          content: 'Daily workflow mapping with product integration...',
          placeholder: true,
          comingSoonLabel: 'Day in the Life'
        },
        {
          id: 'advanced-month-in-life',
          title: 'Month in the Life Description',
          description: 'Long-term usage patterns and relationship evolution',
          type: 'framework',
          duration: '50 min',
          popularity: 87,
          tags: ['long-term', 'evolution', 'patterns'],
          content: 'Long-term customer relationship mapping...',
          placeholder: true,
          comingSoonLabel: 'Month in the Life'
        },
        {
          id: 'advanced-service-blueprint',
          title: 'Service Blueprinting Description',
          description: 'Complete service delivery process mapping',
          type: 'blueprint',
          duration: '60 min',
          popularity: 85,
          tags: ['service', 'process', 'delivery'],
          content: 'Comprehensive service delivery mapping...',
          placeholder: true,
          comingSoonLabel: 'Service Blueprinting'
        },
        {
          id: 'advanced-jobs-to-be-done',
          title: '"Jobs to be Done" Description',
          description: 'Framework for understanding customer job requirements',
          type: 'framework',
          duration: '40 min',
          popularity: 94,
          tags: ['jtbd', 'requirements', 'jobs'],
          content: 'Complete Jobs to be Done framework...',
          placeholder: true,
          comingSoonLabel: 'Jobs to be Done'
        },
        {
          id: 'advanced-compelling-events',
          title: 'Compelling Events Generation',
          description: 'Events that trigger urgent need for your solution',
          type: 'generator',
          duration: '30 min',
          popularity: 90,
          tags: ['events', 'triggers', 'urgency'],
          content: 'Framework for identifying compelling events...',
          placeholder: true,
          comingSoonLabel: 'Compelling Events'
        },
        {
          id: 'advanced-user-journey',
          title: 'User Journey Mapping',
          description: 'Complete customer journey from awareness to advocacy',
          type: 'map',
          duration: '55 min',
          popularity: 92,
          tags: ['journey', 'customer-path', 'advocacy'],
          content: 'End-to-end customer journey mapping...',
          placeholder: true,
          comingSoonLabel: 'User Journey Mapping'
        },
        {
          id: 'advanced-scenario-planning',
          title: 'Scenario Planning',
          description: 'Multiple business outcome scenarios and preparations',
          type: 'planning',
          duration: '65 min',
          popularity: 86,
          tags: ['scenarios', 'planning', 'outcomes'],
          content: 'Strategic scenario planning framework...',
          placeholder: true,
          comingSoonLabel: 'Scenario Planning'
        },
        {
          id: 'advanced-persona-prototyping',
          title: 'Persona-Based Prototyping',
          description: 'Product development approach based on user personas',
          type: 'methodology',
          duration: '50 min',
          popularity: 88,
          tags: ['prototyping', 'personas', 'development'],
          content: 'Persona-driven product development approach...',
          placeholder: true,
          comingSoonLabel: 'Persona-Based Prototyping'
        },
        {
          id: 'advanced-backstage-optimization',
          title: 'Backstage Process Optimization',
          description: 'Internal operations improvement for better customer delivery',
          type: 'optimization',
          duration: '45 min',
          popularity: 84,
          tags: ['operations', 'internal', 'optimization'],
          content: 'Internal process optimization for customer success...',
          placeholder: true,
          comingSoonLabel: 'Backstage Optimization'
        },
        {
          id: 'advanced-failure-analysis',
          title: 'Service Failure Mode and Effects Analysis',
          description: 'Risk analysis and failure prevention strategies',
          type: 'analysis',
          duration: '40 min',
          popularity: 82,
          tags: ['failure', 'risk', 'prevention'],
          content: 'Comprehensive failure mode analysis...',
          placeholder: true,
          comingSoonLabel: 'Failure Mode Analysis'
        },
        {
          id: 'advanced-sales-deck',
          title: 'Sales Slide Deck',
          description: 'Complete presentation structure for sales conversations',
          type: 'deck',
          duration: '35 min',
          popularity: 95,
          tags: ['sales', 'presentation', 'deck'],
          content: 'Professional sales presentation framework...',
          placeholder: true,
          comingSoonLabel: 'Sales Slide Deck'
        },
        {
          id: 'advanced-sales-tasks',
          title: 'Advanced Sales Tasks',
          description: 'Comprehensive sales methodology optimization',
          type: 'methodology',
          duration: '50 min',
          popularity: 89,
          tags: ['sales', 'tasks', 'methodology'],
          content: 'Advanced sales task optimization framework...',
          placeholder: true,
          comingSoonLabel: 'Advanced Sales Tasks'
        }
      ],
      'Strategic & Assessment Resources': [
        {
          id: 'strategic-value-stats',
          title: 'Product Value Statistics Generation',
          description: 'Quantitative analysis and performance metrics',
          type: 'analytics',
          duration: '45 min',
          popularity: 88,
          tags: ['statistics', 'metrics', 'value'],
          content: 'Framework for generating product value statistics...',
          placeholder: true,
          comingSoonLabel: 'Value Statistics Generation'
        },
        {
          id: 'strategic-non-ideal-customer',
          title: 'Non-Ideal Customer Profile (Optional)',
          description: 'Detailed profile of poor-fit customers to avoid',
          type: 'profile',
          duration: '30 min',
          popularity: 85,
          tags: ['anti-persona', 'qualification', 'filtering'],
          content: 'Framework for identifying customers to avoid...',
          placeholder: true,
          comingSoonLabel: 'Non-Ideal Customer Profile'
        },
        {
          id: 'strategic-problem-validation',
          title: 'Mock "Problem Validation Survey"',
          description: 'Survey design for validating market problems',
          type: 'survey',
          duration: '40 min',
          popularity: 89,
          tags: ['validation', 'survey', 'problems'],
          content: 'Complete problem validation survey design...',
          placeholder: true,
          comingSoonLabel: 'Problem Validation Survey'
        },
        {
          id: 'strategic-service-prototype',
          title: 'Detailed Service Prototype',
          description: 'Comprehensive service design and delivery model',
          type: 'prototype',
          duration: '70 min',
          popularity: 87,
          tags: ['service', 'prototype', 'design'],
          content: 'End-to-end service prototype framework...',
          placeholder: true,
          comingSoonLabel: 'Service Prototype'
        },
        {
          id: 'strategic-buying-committee',
          title: 'Buying Committee Analysis',
          description: 'Stakeholder mapping and influence analysis for B2B sales',
          type: 'analysis',
          duration: '50 min',
          popularity: 91,
          tags: ['stakeholders', 'b2b', 'committee'],
          content: 'B2B buying committee analysis framework...',
          placeholder: true,
          comingSoonLabel: 'Buying Committee Analysis'
        },
        {
          id: 'strategic-selling-dialogue',
          title: 'Mock Selling Dialogue',
          description: 'Sample sales conversations and objection handling',
          type: 'script',
          duration: '35 min',
          popularity: 93,
          tags: ['dialogue', 'objections', 'sales'],
          content: 'Professional selling dialogue templates...',
          placeholder: true,
          comingSoonLabel: 'Mock Selling Dialogue'
        },
        {
          id: 'strategic-willingness-to-pay',
          title: 'Willingness to Pay Assessment',
          description: 'Pricing strategy and value perception analysis',
          type: 'assessment',
          duration: '45 min',
          popularity: 86,
          tags: ['pricing', 'value', 'willingness'],
          content: 'Comprehensive pricing strategy assessment...',
          placeholder: true,
          comingSoonLabel: 'Willingness to Pay'
        },
        {
          id: 'strategic-head-of-sales',
          title: 'Ideal Head of Sales Profile',
          description: 'Hiring profile for sales leadership positions',
          type: 'profile',
          duration: '40 min',
          popularity: 84,
          tags: ['hiring', 'sales', 'leadership'],
          content: 'Sales leadership hiring framework...',
          placeholder: true,
          comingSoonLabel: 'Head of Sales Profile'
        },
        {
          id: 'strategic-pmf-readiness',
          title: 'PMF Readiness Assessment',
          description: 'Product-Market Fit evaluation and next steps',
          type: 'assessment',
          duration: '60 min',
          popularity: 92,
          tags: ['pmf', 'readiness', 'evaluation'],
          content: 'Complete PMF readiness evaluation framework...',
          placeholder: true,
          comingSoonLabel: 'PMF Readiness Assessment'
        },
        {
          id: 'strategic-technical-translator',
          title: 'Technical to Sales Translator',
          description: 'Bridge between technical features and business benefits',
          type: 'translator',
          duration: '35 min',
          popularity: 90,
          tags: ['technical', 'translation', 'benefits'],
          content: 'Technical to business benefits translation...',
          placeholder: true,
          comingSoonLabel: 'Technical Translator'
        },
        {
          id: 'strategic-systems-map',
          title: 'Systems Interactions Map',
          description: 'Technical integration and systems architecture planning',
          type: 'map',
          duration: '55 min',
          popularity: 83,
          tags: ['systems', 'integration', 'architecture'],
          content: 'Systems integration mapping framework...',
          placeholder: true,
          comingSoonLabel: 'Systems Interactions Map'
        },
        {
          id: 'strategic-investor-profile',
          title: 'Ideal Investor Profile ⭐ New',
          description: 'Perfect investor match analysis for fundraising',
          type: 'profile',
          duration: '50 min',
          popularity: 95,
          tags: ['investors', 'fundraising', 'matching'],
          content: 'Investor targeting and matching framework...',
          placeholder: true,
          comingSoonLabel: 'Ideal Investor Profile'
        },
        {
          id: 'strategic-investor-deck',
          title: 'Ideal Investor Deck ⭐ New',
          description: 'Complete investor pitch deck structure and content',
          type: 'deck',
          duration: '80 min',
          popularity: 97,
          tags: ['pitch', 'investors', 'deck'],
          content: 'Professional investor pitch deck framework...',
          placeholder: true,
          comingSoonLabel: 'Ideal Investor Deck'
        }
      ]
    }
  }), []);

  // Load completed tasks and generate task-driven recommendations
  useEffect(() => {
    const loadCompletedTasks = () => {
      try {
        // Get completed tasks from local storage
        const storageKey = `taskUsageData_${customerId}`;
        const taskData = JSON.parse(localStorage.getItem(storageKey) || '{}');
        
        // Extract completed task information
        const tasks = [];
        if (taskData.completedTasksHistory) {
          tasks.push(...taskData.completedTasksHistory);
        }
        
        setCompletedTasks(tasks);
        
        // Generate task-driven recommendations
        if (tasks.length > 0 && assessment && milestone) {
          const customerData = {
            customerId,
            competencyScores: assessment.competencyScores,
            milestone
          };
          
          const recommendations = TaskResourceMatcher.getCachedRecommendations(
            customerId,
            tasks,
            customerData,
            { usage, assessment }
          );
          
          setTaskDrivenRecs(recommendations);
        }
        
      } catch (error) {
        console.error('Error loading completed tasks:', error);
        setCompletedTasks([]);
        setTaskDrivenRecs([]);
      }
    };

    if (customerId && assessment) {
      loadCompletedTasks();
    }
  }, [customerId, assessment, milestone, usage]);

  // Generate smart recommendations based on usage patterns and completed tasks
  const smartRecommendations = useMemo(() => {
    const recommendations = [];
    
    // Task-driven recommendations (highest priority)
    taskDrivenRecs.forEach((rec, index) => {
      const resource = findResourceById(rec.resourceId);
      if (resource) {
        recommendations.push({
          id: `task-rec-${index}`,
          title: resource.title,
          description: `${rec.reason} - ${resource.description}`,
          category: rec.category,
          tier: milestone?.tier || 'foundation',
          priority: rec.priority,
          source: rec.source,
          resourceId: rec.resourceId,
          competencyArea: rec.competencyArea,
          currentScore: rec.currentScore
        });
      }
    });

    // If user frequently uses ICP but rarely exports
    if ((usage?.icpProgress || 0) > 70 && !(usage?.lastICPExport)) {
      recommendations.push({
        id: 'rec-1',
        title: 'Implementation Templates',
        description: 'Turn your ICP insights into actionable templates',
        category: 'Implementation',
        tier: milestone?.tier || 'foundation',
        priority: 'high',
        source: 'usage-pattern'
      });
    }
    
    // If user calculates costs but doesn't build business cases
    if ((usage?.financialProgress || 0) > 50 && !(usage?.lastBusinessCaseExport)) {
      recommendations.push({
        id: 'rec-2',
        title: 'Business Case Templates',
        description: 'Convert financial calculations into stakeholder-ready cases',
        category: 'Value Communication',
        tier: milestone?.tier || 'foundation',
        priority: 'high',
        source: 'usage-pattern'
      });
    }
    
    // Performance-based recommendations
    if (assessment?.performance?.level === 'Critical') {
      recommendations.push({
        id: 'rec-3',
        title: 'Quick Win Templates',
        description: 'Immediate impact resources for urgent improvements',
        category: 'Value Communication',
        tier: 'foundation',
        priority: 'urgent',
        source: 'performance-based'
      });
    }
    
    // Competency gap recommendations
    if (assessment?.competencyScores) {
      Object.entries(assessment.competencyScores).forEach(([competency, score]) => {
        if (score < 60) {
          const categoryMap = {
            customerAnalysis: 'ICP Intelligence',
            valueCommunication: 'Value Communication',
            executiveReadiness: 'Implementation'
          };
          
          recommendations.push({
            id: `competency-${competency}`,
            title: `${categoryMap[competency]} Fundamentals`,
            description: `Strengthen ${competency} skills (current: ${score}%)`,
            category: categoryMap[competency],
            tier: 'foundation',
            priority: score < 40 ? 'urgent' : 'high',
            source: 'competency-gap',
            competencyArea: competency,
            currentScore: score
          });
        }
      });
    }
    
    // Remove duplicates and prioritize
    const uniqueRecs = recommendations.reduce((acc, rec) => {
      const existing = acc.find(r => r.title === rec.title || r.resourceId === rec.resourceId);
      if (!existing) {
        acc.push(rec);
      }
      return acc;
    }, []);

    // Sort by priority and source
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const sourceOrder = {
      'task-completion': 5,
      'competency-gap': 4,
      'usage-pattern': 3,
      'performance-based': 2,
      'task-progression': 1
    };

    return uniqueRecs.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return sourceOrder[b.source] - sourceOrder[a.source];
    }).slice(0, 6); // Limit to top 6 recommendations
    
  }, [usage, assessment, milestone, taskDrivenRecs]);

  // Helper function to find resource by ID
  const findResourceById = useCallback((resourceId) => {
    for (const tier of Object.values(resourceDatabase)) {
      for (const category of Object.values(tier)) {
        const resource = category.find(r => r.id === resourceId);
        if (resource) return resource;
      }
    }
    return null;
  }, [resourceDatabase]);

  // Add state for real-time resource updates
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Listen for resource updates
  useEffect(() => {
    const handleStorageChange = () => {
      setRefreshTrigger(prev => prev + 1);
    };

    // Listen for localStorage changes (webhook completions)
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for new resources
    const interval = setInterval(() => {
      const currentSessionId = localStorage.getItem('current_generation_id');
      if (currentSessionId && !localStorage.getItem(`notification_shown_${currentSessionId}`)) {
        setRefreshTrigger(prev => prev + 1);
      }
    }, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Get generated resources from localStorage with webhook service integration
  const getGeneratedResources = useMemo(() => {
    // Check current session resources via webhook service
    const currentSessionId = localStorage.getItem('current_generation_id');
    if (currentSessionId) {
      // Check for session-specific resources first
      const sessionResources = localStorage.getItem(`resources_${currentSessionId}`);
      if (sessionResources) {
        try {
          const parsed = JSON.parse(sessionResources);
          const resources = [];
          
          // Transform webhook service format to Resource Library format
          if (parsed.icp_analysis) {
            resources.push({
              id: 'session-icp-1',
              title: 'ICP Analysis Report',
              description: 'AI-generated ideal customer profile analysis',
              type: 'analysis',
              duration: '20 min',
              popularity: 100,
              tags: ['icp', 'ai-generated', 'session'],
              content: parsed.icp_analysis.content || 'Generated ICP analysis content',
              confidence: parsed.icp_analysis.confidence_score || 85,
              generated: true,
              sessionId: currentSessionId,
              generatedAt: Date.now()
            });
          }
          if (parsed.buyer_personas) {
            resources.push({
              id: 'session-persona-1',
              title: 'Buyer Personas',
              description: 'Detailed buyer persona profiles',
              type: 'personas',
              duration: '15 min',
              popularity: 98,
              tags: ['personas', 'ai-generated', 'session'],
              content: parsed.buyer_personas.content || 'Generated buyer personas',
              confidence: parsed.buyer_personas.confidence_score || 88,
              generated: true,
              sessionId: currentSessionId,
              generatedAt: Date.now()
            });
          }
          if (parsed.empathy_map) {
            resources.push({
              id: 'session-empathy-1',
              title: 'Customer Empathy Map',
              description: 'Understanding customer psychology',
              type: 'empathy',
              duration: '12 min',
              popularity: 95,
              tags: ['empathy', 'ai-generated', 'session'],
              content: parsed.empathy_map.content || 'Generated empathy map',
              confidence: parsed.empathy_map.confidence_score || 87,
              generated: true,
              sessionId: currentSessionId,
              generatedAt: Date.now()
            });
          }
          if (parsed.product_assessment) {
            resources.push({
              id: 'session-assessment-1',
              title: 'Product Market Assessment',
              description: 'Market fit and opportunity analysis',
              type: 'assessment',
              duration: '25 min',
              popularity: 96,
              tags: ['product', 'ai-generated', 'session'],
              content: parsed.product_assessment.content || 'Generated product assessment',
              confidence: parsed.product_assessment.confidence_score || 90,
              generated: true,
              sessionId: currentSessionId,
              generatedAt: Date.now()
            });
          }
          
          if (resources.length > 0) {
            return resources;
          }
        } catch (e) {
          console.error('Error parsing session resources:', e);
        }
      }
    }
    
    // Fallback to legacy generatedResources format
    const storedResources = localStorage.getItem('generatedResources');
    if (storedResources) {
      try {
        const parsed = JSON.parse(storedResources);
        // Convert to resource library format
        const resources = [];
        if (parsed.icp_analysis) {
          resources.push({
            id: 'gen-icp-1',
            title: 'ICP Analysis Report',
            description: 'AI-generated ideal customer profile analysis',
            type: 'analysis',
            duration: '15 min',
            popularity: 100,
            tags: ['icp', 'ai-generated', 'analysis'],
            content: parsed.icp_analysis.content || 'Generated ICP analysis content',
            confidence: parsed.icp_analysis.confidence_score || 85,
            generated: true,
            generatedAt: parsed.generatedAt || Date.now()
          });
        }
        if (parsed.buyer_personas) {
          resources.push({
            id: 'gen-persona-1',
            title: 'Buyer Personas',
            description: 'Detailed buyer persona profiles',
            type: 'personas',
            duration: '10 min',
            popularity: 98,
            tags: ['personas', 'ai-generated', 'buyer'],
            content: parsed.buyer_personas.content || 'Generated buyer personas',
            confidence: parsed.buyer_personas.confidence_score || 88,
            generated: true,
            generatedAt: parsed.generatedAt || Date.now()
          });
        }
        if (parsed.empathy_map) {
          resources.push({
            id: 'gen-empathy-1',
            title: 'Customer Empathy Map',
            description: 'Understanding customer psychology',
            type: 'empathy',
            duration: '12 min',
            popularity: 95,
            tags: ['empathy', 'ai-generated', 'psychology'],
            content: parsed.empathy_map.content || 'Generated empathy map',
            confidence: parsed.empathy_map.confidence_score || 87,
            generated: true,
            generatedAt: parsed.generatedAt || Date.now()
          });
        }
        if (parsed.product_assessment) {
          resources.push({
            id: 'gen-assessment-1',
            title: 'Product Market Assessment',
            description: 'Market fit and opportunity analysis',
            type: 'assessment',
            duration: '20 min',
            popularity: 96,
            tags: ['product', 'ai-generated', 'market-fit'],
            content: parsed.product_assessment.content || 'Generated product assessment',
            confidence: parsed.product_assessment.confidence_score || 90,
            generated: true,
            generatedAt: parsed.generatedAt || Date.now()
          });
        }
        return resources;
      } catch (e) {
        console.error('Error parsing generated resources:', e);
      }
    }
    
    // Also check for core resources from Sales Sage
    const coreResources = localStorage.getItem('coreResources');
    if (coreResources) {
      try {
        const parsed = JSON.parse(coreResources);
        const resources = [];
        
        // Add each core resource if it exists
        if (parsed.icpAnalysis) {
          resources.push({
            id: 'core-icp-1',
            title: 'ICP Analysis',
            description: parsed.icpAnalysis.description || 'Comprehensive ideal customer profile analysis',
            type: 'framework',
            duration: '20 min',
            popularity: 100,
            tags: ['icp', 'core-resource', 'analysis', 'sales-sage'],
            content: parsed.icpAnalysis.content || parsed.icpAnalysis,
            confidence: parsed.icpAnalysis.confidence || 90,
            generated: true,
            isCore: true,
            generatedAt: parsed.generatedAt || Date.now()
          });
        }
        
        if (parsed.buyerPersonas) {
          resources.push({
            id: 'core-personas-1',
            title: 'Buyer Personas',
            description: parsed.buyerPersonas.description || 'Target buyer persona profiles and insights',
            type: 'personas',
            duration: '15 min',
            popularity: 98,
            tags: ['personas', 'core-resource', 'buyer', 'sales-sage'],
            content: parsed.buyerPersonas.content || parsed.buyerPersonas,
            confidence: parsed.buyerPersonas.confidence || 88,
            generated: true,
            isCore: true,
            generatedAt: parsed.generatedAt || Date.now()
          });
        }
        
        if (parsed.empathyMap) {
          resources.push({
            id: 'core-empathy-1',
            title: 'Empathy Map',
            description: parsed.empathyMap.description || 'Deep customer psychology and motivation mapping',
            type: 'empathy',
            duration: '15 min',
            popularity: 95,
            tags: ['empathy', 'core-resource', 'psychology', 'sales-sage'],
            content: parsed.empathyMap.content || parsed.empathyMap,
            confidence: parsed.empathyMap.confidence || 87,
            generated: true,
            isCore: true,
            generatedAt: parsed.generatedAt || Date.now()
          });
        }
        
        if (parsed.productAssessment) {
          resources.push({
            id: 'core-assessment-1',
            title: 'Product Market Potential',
            description: parsed.productAssessment.description || 'Product-market fit and opportunity assessment',
            type: 'assessment',
            duration: '25 min',
            popularity: 96,
            tags: ['product', 'core-resource', 'market-fit', 'sales-sage'],
            content: parsed.productAssessment.content || parsed.productAssessment,
            confidence: parsed.productAssessment.confidence || 92,
            generated: true,
            isCore: true,
            generatedAt: parsed.generatedAt || Date.now()
          });
        }
        
        return resources;
      } catch (e) {
        console.error('Error parsing core resources:', e);
      }
    }
    
    return [];
  }, [refreshTrigger]);

  // Generate core resource templates (now accessible resources)
  const getCoreResourceTemplates = useMemo(() => {
    const coreResourceTemplates = [
      {
        id: 'core-target-persona',
        title: 'Target Buyer Persona',
        description: 'Detailed ideal customer personality and behavioral profile',
        type: 'personas',
        duration: '20 min',
        popularity: 95,
        tags: ['personas', 'targeting', 'buyer'],
        content: 'Comprehensive buyer persona framework including demographics, psychographics, pain points, goals, preferred communication channels, and decision-making process. This template helps identify the specific individual within target companies who makes purchasing decisions.',
        confidence: 90
      },
      {
        id: 'core-icp',
        title: 'Ideal Customer Profile (ICP)',
        description: 'Company-level characteristics for B2B targeting',
        type: 'analysis',
        duration: '25 min',
        popularity: 98,
        tags: ['icp', 'targeting', 'b2b'],
        content: 'Complete ICP analysis framework covering company size, industry, revenue, growth stage, technology stack, budget, decision-making process, and key indicators that signal high-value prospects.',
        confidence: 92
      },
      {
        id: 'core-empathy',
        title: 'Empathy Map',
        description: 'Customer thoughts, feelings, and motivations visualization',
        type: 'empathy',
        duration: '15 min',
        popularity: 88,
        tags: ['empathy', 'psychology', 'customer'],
        content: 'Visual empathy mapping framework exploring what customers think, feel, see, say, do, and hear. Includes pain points, gains, motivations, and emotional drivers that influence purchasing decisions.',
        confidence: 87
      },
      {
        id: 'core-assessment',
        title: 'Product Potential Assessment',
        description: 'Market opportunity and success probability analysis',
        type: 'assessment',
        duration: '30 min',
        popularity: 91,
        tags: ['product', 'market-fit', 'assessment'],
        content: 'Comprehensive product-market fit evaluation covering market size, competitive landscape, product differentiation, pricing strategy, and success probability metrics.',
        confidence: 89
      }
    ];
    
    const existingResources = getGeneratedResources;
    const existingIds = existingResources.map(r => r.type);
    
    // Only show templates for resources that don't exist as generated
    const templates = coreResourceTemplates.filter(template => 
      !existingIds.includes(template.type)
    );
    
    return templates;
  }, [getGeneratedResources]);

  // Filter resources based on current selections
  const filteredResources = useMemo(() => {
    // Handle Core Resources category
    if (selectedCategory === 'Core Resources') {
      let resources = [...getGeneratedResources, ...getCoreResourceTemplates];
      
      // Apply search filter
      if (searchTerm) {
        resources = resources.filter(resource => 
          (resource.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (resource.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (resource.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      // Sort generated resources first, then placeholders
      return resources.sort((a, b) => {
        if (a.placeholder && !b.placeholder) return 1;
        if (!a.placeholder && b.placeholder) return -1;
        return (b.popularity || 0) - (a.popularity || 0);
      });
    }
    
    // Handle regular resource categories
    const tierToShow = selectedTier === 'current' ? milestone?.tier || 'foundation' : selectedTier;
    const tierResources = resourceDatabase[tierToShow] || resourceDatabase.foundation;
    
    let resources = [];
    
    if (selectedCategory === 'all') {
      // Only show non-core resources in 'all' view since core resources have their own section
      Object.values(tierResources).forEach(categoryResources => {
        resources.push(...categoryResources);
      });
    } else {
      resources = tierResources[selectedCategory] || [];
    }
    
    // Apply search filter
    if (searchTerm) {
      resources = resources.filter(resource => 
        (resource.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resource.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resource.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Sort by placeholder status and popularity
    return resources.sort((a, b) => {
      // Generated/Core resources first
      if ((a.generated || a.placeholder) && !(b.generated || b.placeholder)) return -1;
      if (!(a.generated || a.placeholder) && (b.generated || b.placeholder)) return 1;
      
      // Within same type, sort by popularity
      return (b.popularity || 0) - (a.popularity || 0);
    });
  }, [resourceDatabase, selectedTier, selectedCategory, searchTerm, milestone, getGeneratedResources, getCoreResourceTemplates]);

  // Track resource access
  const handleResourceAccess = useCallback((resource) => {
    updateUsage({
      resourcesAccessed: (usage?.resourcesAccessed || 0) + 1,
      lastResourceAccess: Date.now(),
      mostAccessedCategories: {
        ...usage?.mostAccessedCategories,
        [selectedCategory]: (usage?.mostAccessedCategories?.[selectedCategory] || 0) + 1
      }
    });
  }, [updateUsage, usage, selectedCategory]);

  // Resource type icons
  const getResourceIcon = (type) => {
    const icons = {
      template: FileText,
      guide: Briefcase,
      script: MessageSquare,
      calculator: BarChart3,
      framework: Target,
      assessment: CheckCircle,
      model: TrendingUp,
      training: Users,
      kit: Bookmark,
      strategy: Star
    };
    return icons[type] || FileText;
  };

  // Category colors
  const getCategoryColor = (category) => {
    const colors = {
      'Core Resources': 'yellow',
      'Core Business Resources': 'blue',
      'Advanced Sales Resources': 'green', 
      'Strategic & Assessment Resources': 'purple'
    };
    return colors[category] || 'gray';
  };

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
          <h1 className="text-3xl font-bold text-white mb-2">Resource Library</h1>
          <p className="text-gray-400">Implementation templates and frameworks for systematic business development</p>
        </div>

        {/* Smart Recommendations */}
        {smartRecommendations.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-white">Recommended for You</h2>
              {completedTasks.length > 0 && (
                <span className="text-sm text-green-400">
                  Based on {completedTasks.length} completed task{completedTasks.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {smartRecommendations.map((rec) => (
                <div key={rec.id} className={`border rounded-lg p-4 ${
                  rec.source === 'task-completion' ? 'bg-green-900/20 border-green-800' :
                  rec.source === 'competency-gap' ? 'bg-orange-900/20 border-orange-800' :
                  'bg-blue-900/20 border-blue-800'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-medium">{rec.title}</h3>
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded text-xs text-center ${
                        rec.priority === 'urgent' ? 'bg-red-900/30 text-red-400' :
                        rec.priority === 'high' ? 'bg-yellow-900/30 text-yellow-400' :
                        rec.priority === 'medium' ? 'bg-blue-900/30 text-blue-400' :
                        'bg-gray-900/30 text-gray-400'
                      }`}>
                        {rec.priority}
                      </span>
                      {rec.source && (
                        <span className={`px-1 py-0.5 rounded text-xs text-center ${
                          rec.source === 'task-completion' ? 'bg-green-900/30 text-green-400' :
                          rec.source === 'competency-gap' ? 'bg-orange-900/30 text-orange-400' :
                          rec.source === 'usage-pattern' ? 'bg-purple-900/30 text-purple-400' :
                          'bg-gray-900/30 text-gray-400'
                        }`}>
                          {rec.source === 'task-completion' ? 'Task' :
                           rec.source === 'competency-gap' ? 'Gap' :
                           rec.source === 'usage-pattern' ? 'Usage' :
                           rec.source === 'performance-based' ? 'Perf' : 'Misc'}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{rec.description}</p>
                  {rec.competencyArea && rec.currentScore && (
                    <div className="text-xs text-gray-500 mb-2">
                      Current {rec.competencyArea}: {rec.currentScore}%
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCategory(rec.category);
                        setSelectedTier(rec.tier);
                      }}
                      className="flex-1 text-blue-400 hover:text-blue-300 text-sm flex items-center justify-center gap-1"
                    >
                      View Resources <ArrowRight className="w-3 h-3" />
                    </button>
                    {rec.resourceId && (
                      <button
                        onClick={() => {
                          const resource = findResourceById(rec.resourceId);
                          if (resource) {
                            handleResourceAccess(resource);
                          }
                        }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                      >
                        Open
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search resources..."
                  className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Core Resources">Core Resources</option>
              <option value="Core Business Resources">Core Business Resources</option>
              <option value="Advanced Sales Resources">Advanced Sales Resources</option>
              <option value="Strategic & Assessment Resources">Strategic & Assessment</option>
            </select>

            {/* Tier Filter */}
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="current">Current Stage</option>
              <option value="foundation">Foundation</option>
              <option value="growth">Growth</option>
              <option value="expansion">Expansion</option>
            </select>

            {/* View Mode */}
            <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <div className="w-4 h-4 flex flex-col gap-0.5">
                  <div className="bg-current h-1 rounded-sm"></div>
                  <div className="bg-current h-1 rounded-sm"></div>
                  <div className="bg-current h-1 rounded-sm"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Core Resources Section - Always Visible */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Core Resources</h2>
            <span className="text-sm text-gray-400">
              {getGeneratedResources.length} of 4 generated
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...getGeneratedResources, ...getCoreResourceTemplates].map((resource) => {
              const ResourceIcon = getResourceIcon(resource.type);
              
              // Core resources are always accessible (no blur, View/Copy buttons)
              // This section only shows core resources and webhook-generated resources
              const isCoreResource = true; // All resources in core section are accessible
              const needsGeneration = false; // Core resources never need generation
              
              return (
                <div key={resource.id} className={`
                  relative bg-gray-900 border rounded-xl p-4 transition-colors
                  ${needsGeneration 
                    ? 'border-gray-600 border-dashed hover:border-purple-500' 
                    : 'border-gray-800 hover:border-gray-700'
                  }
                `}>
                  {/* Generate overlay for non-generated resources */}
                  {needsGeneration && (
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                      <div className="text-center">
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-medium mb-2">
                          Generate {resource.title}
                        </div>
                        <p className="text-gray-300 text-xs">Generate with AI</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${
                      needsGeneration 
                        ? 'bg-gray-700/50' 
                        : 'bg-yellow-900/30'
                    }`}>
                      <ResourceIcon className={`w-4 h-4 ${
                        needsGeneration 
                          ? 'text-gray-400' 
                          : 'text-yellow-400'
                      }`} />
                    </div>
                    {resource.confidence && (
                      <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">
                        {resource.confidence}%
                      </span>
                    )}
                  </div>
                  
                  <h3 className={`font-medium mb-2 text-sm ${
                    needsGeneration ? 'text-gray-300' : 'text-white'
                  }`}>
                    {resource.title}
                    {needsGeneration && (
                      <span className="ml-1 text-xs bg-gray-700 text-gray-400 px-1 py-0.5 rounded">
                        Not Generated
                      </span>
                    )}
                  </h3>
                  
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                    {needsGeneration 
                      ? `${resource.description}. Generate using AI.`
                      : resource.description
                    }
                  </p>
                  
                  {needsGeneration ? (
                    <button
                      onClick={() => navigate(`/customer/${customerId}/simplified/icp`)}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <ArrowRight className="w-3 h-3" />
                      Generate
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResourceAccess(resource)}
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                      <button
                        onClick={() => {
                          handleResourceAccess(resource);
                          navigator.clipboard.writeText(resource.content);
                        }}
                        className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Advanced Resources Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Advanced Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {filteredResources.filter(resource => 
              ['Advanced Sales Resources'].includes(
                Object.keys(resourceDatabase[selectedTier === 'current' ? milestone?.tier || 'foundation' : selectedTier] || resourceDatabase.foundation).find(cat =>
                  (resourceDatabase[selectedTier === 'current' ? milestone?.tier || 'foundation' : selectedTier] || resourceDatabase.foundation)[cat].includes(resource)
                )
              )
            ).map((resource) => {
              const ResourceIcon = getResourceIcon(resource.type);
              const categoryColor = getCategoryColor(
                Object.keys(resourceDatabase[selectedTier === 'current' ? milestone?.tier || 'foundation' : selectedTier] || resourceDatabase.foundation).find(cat =>
                  (resourceDatabase[selectedTier === 'current' ? milestone?.tier || 'foundation' : selectedTier] || resourceDatabase.foundation)[cat].includes(resource)
                )
              );
              
              return (
                <div key={resource.id} className="relative bg-gray-900 border border-gray-600 border-dashed rounded-xl p-6 hover:border-gray-500 transition-colors">
                  {/* Coming Soon overlay for Advanced Resources */}
                  <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                    <div className="text-center">
                      <h3 className="text-white text-sm font-semibold mb-2">{resource.title}</h3>
                      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                        Coming Soon
                      </div>
                    </div>
                  </div>
                  
                  {/* Content with blur */}
                  <div className="blur-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-${categoryColor}-900/30`}>
                      <ResourceIcon className={`w-5 h-5 text-${categoryColor}-400`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-400 text-sm">{resource.popularity}%</span>
                    </div>
                  </div>
                  
                  <h3 className="text-white font-semibold mb-2">{resource.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{resource.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {resource.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                      {resource.type}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    {(resource.tags || []).slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleResourceAccess(resource)}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => {
                        handleResourceAccess(resource);
                        navigator.clipboard.writeText(resource.content);
                      }}
                      className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strategic Resources Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Strategic Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.filter(resource => 
              ['Strategic & Assessment Resources'].includes(
                Object.keys(resourceDatabase[selectedTier === 'current' ? milestone?.tier || 'foundation' : selectedTier] || resourceDatabase.foundation).find(cat =>
                  (resourceDatabase[selectedTier === 'current' ? milestone?.tier || 'foundation' : selectedTier] || resourceDatabase.foundation)[cat].includes(resource)
                )
              )
            ).map((resource) => {
              const ResourceIcon = getResourceIcon(resource.type);
              const categoryColor = getCategoryColor(
                Object.keys(resourceDatabase[selectedTier === 'current' ? milestone?.tier || 'foundation' : selectedTier] || resourceDatabase.foundation).find(cat =>
                  (resourceDatabase[selectedTier === 'current' ? milestone?.tier || 'foundation' : selectedTier] || resourceDatabase.foundation)[cat].includes(resource)
                )
              );
              
              return (
                <div key={resource.id} className="relative bg-gray-900 border border-gray-600 border-dashed rounded-xl p-6 hover:border-gray-500 transition-colors">
                  {/* Coming Soon overlay for Strategic Resources */}
                  <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                    <div className="text-center">
                      <h3 className="text-white text-sm font-semibold mb-2">{resource.title}</h3>
                      <div className="bg-gradient-to-r from-purple-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                        Coming Soon
                      </div>
                    </div>
                  </div>
                  
                  {/* Content with blur */}
                  <div className="blur-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-${categoryColor}-900/30`}>
                      <ResourceIcon className={`w-5 h-5 text-${categoryColor}-400`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-400 text-sm">{resource.popularity}%</span>
                    </div>
                  </div>
                  
                  <h3 className="text-white font-semibold mb-2">{resource.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{resource.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {resource.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                      {resource.type}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    {(resource.tags || []).slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleResourceAccess(resource)}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => {
                        handleResourceAccess(resource);
                        navigator.clipboard.writeText(resource.content);
                      }}
                      className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fallback for unmatched resources */}
        {filteredResources.length > 0 && filteredResources.filter(resource => 
          !['Core Business Resources', 'Advanced Sales Resources', 'Strategic & Assessment Resources'].includes(
            Object.keys(resourceDatabase[selectedTier === 'current' ? milestone?.tier || 'foundation' : selectedTier] || resourceDatabase.foundation).find(cat =>
              (resourceDatabase[selectedTier === 'current' ? milestone?.tier || 'foundation' : selectedTier] || resourceDatabase.foundation)[cat].includes(resource)
            )
          )
        ).length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredResources.map((resource) => {
              const ResourceIcon = getResourceIcon(resource.type);
              const categoryColor = getCategoryColor(
                Object.keys(resourceDatabase[selectedTier === 'current' ? milestone?.tier || 'foundation' : selectedTier]).find(cat =>
                  resourceDatabase[selectedTier === 'current' ? milestone?.tier || 'foundation' : selectedTier][cat].includes(resource)
                )
              );
              
              return (
                <div key={resource.id} className={viewMode === 'grid' 
                  ? `bg-gray-900 border ${resource.placeholder ? 'border-gray-600 border-dashed' : 'border-gray-800'} rounded-xl p-6 hover:border-gray-700 transition-colors`
                  : `bg-gray-900 border ${resource.placeholder ? 'border-gray-600 border-dashed' : 'border-gray-800'} rounded-lg p-4 flex items-center gap-4 hover:border-gray-700 transition-colors`
                }>
                  {viewMode === 'grid' ? (
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg bg-${categoryColor}-900/30`}>
                          <ResourceIcon className={`w-5 h-5 text-${categoryColor}-400`} />
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-gray-400 text-sm">{resource.popularity}%</span>
                        </div>
                      </div>
                      
                      <h3 className={`font-semibold mb-2 ${resource.placeholder ? 'text-gray-300' : 'text-white'}`}>
                        {resource.title}
                        {resource.placeholder && (
                          <span className="ml-2 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                            Not Generated
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">
                        {resource.placeholder 
                          ? `${resource.description}. Click Generate to create this resource using AI.`
                          : resource.description
                        }
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {resource.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                          {resource.type}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mb-4">
                        {(resource.tags || []).slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        {resource.placeholder ? (
                          <button
                            onClick={() => navigate(`/customer/${customerId}/simplified/icp`)}
                            className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <ArrowRight className="w-4 h-4" />
                            Generate
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleResourceAccess(resource)}
                              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => {
                                handleResourceAccess(resource);
                                navigator.clipboard.writeText(resource.content);
                              }}
                              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`p-3 rounded-lg bg-${categoryColor}-900/30 flex-shrink-0`}>
                        <ResourceIcon className={`w-6 h-6 text-${categoryColor}-400`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-white font-semibold">{resource.title}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span className="text-gray-400 text-xs">{resource.popularity}%</span>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{resource.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{resource.duration}</span>
                          <span>{resource.type}</span>
                          <div className="flex gap-1">
                            {(resource.tags || []).slice(0, 2).map((tag) => (
                              <span key={tag} className="px-1 py-0.5 bg-gray-800 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 flex-shrink-0">
                        {resource.placeholder ? (
                          <button
                            onClick={() => navigate(`/customer/${customerId}/simplified/icp`)}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                          >
                            <ArrowRight className="w-4 h-4" />
                            Generate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleResourceAccess(resource)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No resources found</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* Usage Stats */}
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Your Progress & Usage</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {completedTasks.length}
              </div>
              <div className="text-gray-400 text-sm">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {usage?.resourcesAccessed || 0}
              </div>
              <div className="text-gray-400 text-sm">Resources Accessed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {taskDrivenRecs.length}
              </div>
              <div className="text-gray-400 text-sm">Smart Recommendations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {milestone?.tier?.charAt(0).toUpperCase() + milestone?.tier?.slice(1) || 'Foundation'}
              </div>
              <div className="text-gray-400 text-sm">Current Stage</div>
            </div>
          </div>
          
          {/* Task Completion Insights */}
          {completedTasks.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-800">
              <h4 className="text-white font-medium mb-3">Recent Task Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-sm text-gray-400 mb-1">Most Recent Task</div>
                  <div className="text-white font-medium">
                    {completedTasks[completedTasks.length - 1]?.name || 'Task completed'}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-sm text-gray-400 mb-1">Completion Rate</div>
                  <div className="text-white font-medium">
                    {completedTasks.length} task{completedTasks.length > 1 ? 's' : ''} this session
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimplifiedResourceLibrary;