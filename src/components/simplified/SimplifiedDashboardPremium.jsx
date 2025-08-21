import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserIntelligence } from '../../contexts/simplified/UserIntelligenceContext';
import DashboardCard, { CardHeader, CardMetric, CardProgress, CardAction } from './cards/DashboardCard';
import CircularProgressPremium, { CompetencyGrid, NextMilestonePreview } from './cards/CircularProgressPremium';
import MiniProgressChart, { MultiCompetencyChart } from './cards/MiniProgressChart';
import RevenueImpactWidget from './cards/RevenueImpactWidget';
import WeeklyProgressWidget from './cards/WeeklyProgressWidget';
import UsageAnalyticsWidget from './cards/UsageAnalyticsWidget';
import MilestoneTrackerWidget from './cards/MilestoneTrackerWidget';
import RecentActivityFeed from './cards/RecentActivityFeed';
import SeriesAContextWidget from './cards/SeriesAContextWidget';
import ModernCard, { ModernGridContainer, ModernCardHeader, ModernCardContent, ModernMetricCard } from '../layout/ModernCard';
import ModernCircularProgress, { ModernProgressGroup } from '../ui/ModernCircularProgress';
import { motion } from 'framer-motion';
import { ToggleLeft, ToggleRight, Crown, BarChart3 } from 'lucide-react';

/**
 * SimplifiedDashboardPremium - $150/month quality revenue intelligence dashboard
 * 
 * Features:
 * - 4-column responsive CSS Grid layout
 * - 8-12 premium widgets with high information density
 * - Real-time data integration from UserIntelligenceContext
 * - Professional design system with Inter typography
 * - Smooth animations and micro-interactions
 */

const SimplifiedDashboardPremium = ({ customerId }) => {
  const navigate = useNavigate();
  const { assessment, milestone, usage, loading, error, updateUsage } = useUserIntelligence();
  
  // Local state for UI interactions
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Simulate initial load completion
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Safe defaults for development
  const safeAssessment = assessment || {
    competencyScores: { 
      customerAnalysis: 65, 
      valueCommunication: 58, 
      executiveReadiness: 72 
    },
    performance: { level: 'Good', score: 65 },
    revenue: { opportunity: 750000 }
  };

  const safeMilestone = milestone || {
    tier: 'growth',
    context: 'Advanced revenue intelligence development',
    targets: { customerAnalysis: 75, valueCommunication: 70, executiveReadiness: 80 }
  };

  // Enhanced competency data for premium visualization
  const competencyData = [
    {
      key: 'customerAnalysis',
      label: 'Customer Analysis',
      current: safeAssessment.competencyScores.customerAnalysis,
      previous: safeAssessment.competencyScores.customerAnalysis - 5, // Previous week
      target: safeMilestone.targets.customerAnalysis,
      targetDate: '2024-09-15'
    },
    {
      key: 'valueCommunication', 
      label: 'Value Communication',
      current: safeAssessment.competencyScores.valueCommunication,
      previous: safeAssessment.competencyScores.valueCommunication - 3,
      target: safeMilestone.targets.valueCommunication,
      targetDate: '2024-09-22'
    },
    {
      key: 'executiveReadiness',
      label: 'Executive Readiness', 
      current: safeAssessment.competencyScores.executiveReadiness,
      previous: safeAssessment.competencyScores.executiveReadiness - 8,
      target: safeMilestone.targets.executiveReadiness,
      targetDate: '2024-10-01'
    }
  ];

  // Next milestone data
  const nextMilestone = {
    name: 'Advanced Revenue Intelligence',
    completionPercentage: Math.round((
      competencyData.reduce((sum, comp) => sum + comp.current, 0) / 
      competencyData.reduce((sum, comp) => sum + comp.target, 0)
    ) * 100)
  };

  const safeUsage = usage || {
    icpProgress: 75,
    financialProgress: 60,
    resourcesAccessed: 45,
    weeklyTasksCompleted: 8,
    weeklyTasksTotal: 12,
    monthlyHours: 24,
    mostUsedTool: 'ICP Analysis'
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  if (loading && isInitialLoad) {
    return (
      <div className="min-h-full">
        <ModernGridContainer className="gap-6">
          {/* Loading skeleton for modern cards */}
          {Array.from({ length: 8 }, (_, i) => (
            <ModernCard 
              key={i} 
              size="medium"
              className="animate-pulse"
            >
              <div className="space-y-4">
                <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                <div className="h-8 bg-gray-700 rounded w-2/3"></div>
                <div className="h-20 bg-gray-700 rounded"></div>
              </div>
            </ModernCard>
          ))}
        </ModernGridContainer>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full">
        <ModernCard size="large" variant="warning" className="max-w-2xl mx-auto">
          <ModernCardHeader title="Error Loading Dashboard" />
          <ModernCardContent>
            <p className="text-gray-400">{error}</p>
          </ModernCardContent>
        </ModernCard>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Modern Dashboard Grid - Responsive and professional */}
      <ModernGridContainer className="gap-6">
        {/* Row 1: Modern Competency Overview */}
        <div className="sm:col-span-2 lg:col-span-4">
          <ModernCard size="large" variant="highlighted" padding="spacious">
            <ModernCardHeader 
              title="Revenue Intelligence Overview" 
              subtitle={`${customerId} • Competency Dashboard`}
              action={
                <div className="flex items-center gap-4">
                  {/* Live Indicator */}
                  <div className="flex items-center space-x-2 text-sm text-purple-400">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                    <span>Live</span>
                  </div>
                  
                  {/* Premium to Standard Toggle */}
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-white">Standard</span>
                      </div>
                      <button
                        onClick={() => navigate(`/customer/${customerId}/simplified/dashboard`)}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Switch to Standard Dashboard"
                      >
                        <ToggleRight className="w-5 h-5 text-purple-500" />
                      </button>
                      
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-white">Premium</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-1 text-center">
                      Dashboard View
                    </div>
                  </div>
                </div>
              }
            />
            <ModernCardContent>
              <ModernProgressGroup className="justify-start">
                <ModernCircularProgress
                  percentage={competencyData[0].current}
                  color="purple"
                  size={120}
                  label="Customer Analysis"
                  centerContent={
                    <div className="text-xs text-green-400 font-medium">
                      +{competencyData[0].current - competencyData[0].previous}
                    </div>
                  }
                />
                <ModernCircularProgress
                  percentage={competencyData[1].current}
                  color="blue"
                  size={120}
                  label="Value Communication"
                  centerContent={
                    <div className="text-xs text-green-400 font-medium">
                      +{competencyData[1].current - competencyData[1].previous}
                    </div>
                  }
                />
                <ModernCircularProgress
                  percentage={competencyData[2].current}
                  color="green"
                  size={120}
                  label="Executive Readiness"
                  centerContent={
                    <div className="text-xs text-green-400 font-medium">
                      +{competencyData[2].current - competencyData[2].previous}
                    </div>
                  }
                />
              </ModernProgressGroup>
              
              <div className="mt-6 grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{nextMilestone.completionPercentage}%</div>
                  <div className="text-sm text-gray-400">Overall Progress</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">+12%</div>
                  <div className="text-sm text-gray-400">This Month</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">{nextMilestone.name}</div>
                  <div className="text-sm text-gray-400">Next Milestone</div>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>
        </div>
        {/* Row 2: Business Context - expanded to take more space */}
        <div className="sm:col-span-2 lg:col-span-4">
          <ModernCard size="medium" padding="default">
            <ModernCardHeader 
              title="Business Context" 
              subtitle="Series A stage intelligence and market positioning"
            />
            <ModernCardContent>
              <SeriesAContextWidget />
            </ModernCardContent>
          </ModernCard>
        </div>

        {/* Row 3: Weekly Progress & Activity */}
        <div className="sm:col-span-1 lg:col-span-2">
          <ModernMetricCard
            title="Weekly Progress"
            value={`${safeUsage.weeklyTasksCompleted}/${safeUsage.weeklyTasksTotal}`}
            subtitle="Tasks completed"
            change="+25%"
            changeType="positive"
          />
        </div>

        <div className="sm:col-span-1 lg:col-span-2">
          <ModernCard size="medium" padding="default">
            <ModernCardHeader 
              title="Recent Activity" 
              subtitle="Your latest platform interactions"
            />
            <ModernCardContent>
              <RecentActivityFeed />
            </ModernCardContent>
          </ModernCard>
        </div>

        {/* Row 4: Revenue Metrics */}
        <ModernMetricCard
          title="Revenue Impact"
          value={`$${Math.round(safeAssessment.revenue.opportunity / 1000)}K`}
          subtitle="Potential opportunity"
          change="+15%"
          changeType="positive"
        />

        <ModernMetricCard
          title="Usage Analytics"
          value={`${safeUsage.monthlyHours}h`}
          subtitle="This month"
          change="+8h"
          changeType="positive"
        />

        <ModernMetricCard
          title="Most Used Tool"
          value={safeUsage.mostUsedTool}
          subtitle="Primary focus area"
          change="ICP Analysis"
          changeType="neutral"
        />

        <div className="sm:col-span-2 lg:col-span-1">
          <ModernCard size="medium" padding="default">
            <ModernCardHeader 
              title="Usage Analytics" 
              subtitle="Platform engagement and tool utilization"
            />
            <ModernCardContent>
              <UsageAnalyticsWidget />
            </ModernCardContent>
          </ModernCard>
        </div>

      </ModernGridContainer>
    </div>
  );
};

/**
 * Dashboard Header Component
 */
const DashboardHeader = ({ customerId }) => (
  <header className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 py-4">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Revenue Intelligence Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Professional development and business intelligence platform
          </p>
        </div>
        <div className="hidden sm:flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            Customer: <span className="text-white">{customerId || 'DEMO'}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default SimplifiedDashboardPremium;