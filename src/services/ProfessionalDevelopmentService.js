import { airtableService } from './airtableService';
import { milestoneService } from './milestoneService';

/**
 * Professional Development Service - CORE PHASE
 * 
 * Tracks buyer intelligence actions as "professional development experience"
 * Manages stealth gamification mechanics disguised as business competency building
 */

class ProfessionalDevelopmentService {
  constructor() {
    // Professional development levels (hidden Solo Leveling ranks: E-A)
    this.levels = {
      foundation: {
        name: 'Revenue Intelligence Foundation',
        range: [0, 500],
        hiddenRank: 'E',
        description: 'Building systematic buyer understanding capabilities',
        unlocks: ['Basic competitive intelligence templates', 'Foundation-level stakeholder frameworks']
      },
      developing: {
        name: 'Strategic Development',
        range: [501, 1500],
        hiddenRank: 'D',
        description: 'Developing systematic revenue acceleration approaches',
        unlocks: ['Advanced buyer research methods', 'CFO translation frameworks']
      },
      advanced: {
        name: 'Advanced Revenue Intelligence',
        range: [1501, 3500],
        hiddenRank: 'C',
        description: 'Mastering stakeholder-specific value communication',
        unlocks: ['Enterprise competitive positioning', 'Executive advisory capabilities']
      },
      strategic: {
        name: 'Strategic Revenue Expert',
        range: [3501, 7500],
        hiddenRank: 'B',
        description: 'Leading systematic revenue operations excellence',
        unlocks: ['Series B preparation frameworks', 'Team enablement systems']
      },
      authority: {
        name: 'Revenue Intelligence Authority',
        range: [7501, Infinity],
        hiddenRank: 'A',
        description: 'Authority-level systematic competitive advantages',
        unlocks: ['Market leadership positioning', 'Strategic advisory mastery']
      }
    };

    // Action-based experience point system
    this.actionPoints = {
      // Research & Intelligence Gathering
      'view_resource': { base: 10, category: 'buyer_intelligence' },
      'view_competitor_analysis': { base: 12, category: 'competitive_intelligence' },
      'view_stakeholder_framework': { base: 8, category: 'value_translation' },
      'research_prospect': { base: 15, category: 'buyer_intelligence' },
      
      // Implementation Actions  
      'copy_framework': { base: 5, category: 'value_translation' },
      'copy_template': { base: 4, category: 'implementation' },
      'download_resource': { base: 6, category: 'implementation' },
      
      // Execution & Application
      'complete_icp_analysis': { base: 25, category: 'buyer_intelligence' },
      'complete_financial_model': { base: 30, category: 'value_translation' },
      'build_stakeholder_message': { base: 20, category: 'value_translation' },
      'create_competitive_response': { base: 35, category: 'competitive_intelligence' },
      'execute_outreach_sequence': { base: 15, category: 'implementation' },
      
      // Strategic Activities
      'conduct_buyer_interview': { base: 40, category: 'buyer_intelligence' },
      'complete_competitive_analysis': { base: 45, category: 'competitive_intelligence' },
      'build_value_proposition': { base: 35, category: 'value_translation' },
      'create_series_b_framework': { base: 50, category: 'strategic_development' },
      
      // Systematic Development
      'complete_weekly_buyer_research': { base: 75, category: 'systematic_development' },
      'achieve_consistency_streak': { base: 100, category: 'systematic_development' },
      'unlock_advanced_capability': { base: 150, category: 'systematic_development' }
    };

    // Business milestone integration (Stages 10-15)
    this.businessMilestones = {
      'stage_12_revenue_scalability': {
        name: 'Revenue Scalability Mastery',
        experienceRequired: 1200,
        description: 'Systematic value-based pricing and conversion optimization',
        businessImpact: 'Stage 12: Scalable revenue model proven'
      },
      'stage_13_user_base_growth': {
        name: 'Strategic User Acquisition',  
        experienceRequired: 2500,
        description: 'Optimized buyer segments and acquisition channels',
        businessImpact: 'Stage 13: Predictable user base expansion'
      },
      'stage_14_product_scaling': {
        name: 'Customer-Driven Product Excellence',
        experienceRequired: 4000,
        description: 'Feature development aligned with buyer value drivers',
        businessImpact: 'Stage 14: Product-market expansion readiness'
      },
      'stage_15_revenue_growth': {
        name: 'Sustainable Revenue Authority',
        experienceRequired: 6500,
        description: 'Predictable revenue model with expansion capabilities',
        businessImpact: 'Stage 15: Series B funding readiness'
      }
    };

    // Cache for performance
    this.userCache = new Map();
    this.experienceHistory = new Map();
  }

  /**
   * Initialize professional development tracking for user
   */
  async initializeDevelopment(customerId) {
    try {
      const customerData = await airtableService.getCustomerDataByRecordId(customerId);
      const development = customerData.professionalDevelopment || {};
      
      const userDevelopment = {
        customerId,
        totalExperience: development.total_experience || 0,
        currentLevel: this.calculateLevel(development.total_experience || 0),
        weeklyExperience: development.weekly_experience || 0,
        actionHistory: development.action_history || [],
        milestoneProgress: development.milestone_progress || {},
        streakData: development.streak_data || {},
        lastActivityDate: development.last_activity_date || null
      };

      // Cache for performance
      this.userCache.set(customerId, userDevelopment);
      
      return userDevelopment;
    } catch (error) {
      console.error('Error initializing professional development:', error);
      return this.getDefaultDevelopmentState(customerId);
    }
  }

  /**
   * Track action and award professional development experience
   */
  async trackAction(customerId, actionType, actionData = {}) {
    try {
      // Get or initialize user development
      let userDev = this.userCache.get(customerId);
      if (!userDev) {
        userDev = await this.initializeDevelopment(customerId);
      }

      // Calculate experience points for this action
      const experienceGained = this.calculateExperienceGain(actionType, actionData);
      
      if (experienceGained === 0) {
        return { experienceGained: 0, achievements: [] };
      }

      // Create action record
      const actionRecord = {
        id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: actionType,
        experienceGained,
        timestamp: new Date().toISOString(),
        category: this.actionPoints[actionType]?.category || 'general',
        metadata: actionData
      };

      // Update user development state
      const oldLevel = userDev.currentLevel;
      const oldTotalExperience = userDev.totalExperience;
      
      userDev.totalExperience += experienceGained;
      userDev.weeklyExperience += experienceGained;
      userDev.currentLevel = this.calculateLevel(userDev.totalExperience);
      userDev.actionHistory.unshift(actionRecord);
      userDev.lastActivityDate = new Date().toISOString();

      // Keep action history manageable
      if (userDev.actionHistory.length > 100) {
        userDev.actionHistory = userDev.actionHistory.slice(0, 100);
      }

      // Check for achievements
      const achievements = [];
      
      // Level advancement achievement
      if (oldLevel.name !== userDev.currentLevel.name) {
        achievements.push({
          id: `level_${userDev.currentLevel.name.replace(/\s+/g, '_').toLowerCase()}`,
          type: 'level_advancement',
          title: `Professional Level: ${userDev.currentLevel.name}`,
          description: 'Revenue intelligence capabilities advanced',
          businessImpact: `Unlocked: ${userDev.currentLevel.unlocks.join(', ')}`,
          totalExperience: userDev.totalExperience,
          levelInfo: userDev.currentLevel
        });
      }

      // Business milestone achievements
      const milestoneAchievements = this.checkMilestoneProgress(userDev, oldTotalExperience);
      achievements.push(...milestoneAchievements);

      // Streak achievements
      const streakAchievements = await this.checkStreakAchievements(customerId, userDev);
      achievements.push(...streakAchievements);

      // Update cache
      this.userCache.set(customerId, userDev);

      // Persist to Airtable (async, non-blocking)
      this.persistDevelopmentState(customerId, userDev).catch(error => {
        console.error('Error persisting development state:', error);
      });

      // Integration with existing milestone system
      if (achievements.length > 0) {
        milestoneService.checkMilestoneProgress(customerId, 'professional_development', {
          experienceGained,
          totalExperience: userDev.totalExperience,
          achievements
        }).catch(error => {
          console.error('Error updating milestone system:', error);
        });
      }

      return {
        experienceGained,
        achievements,
        currentLevel: userDev.currentLevel,
        totalExperience: userDev.totalExperience,
        progressToNext: this.calculateProgressToNext(userDev.totalExperience),
        actionRecord
      };

    } catch (error) {
      console.error('Error tracking professional development action:', error);
      return { experienceGained: 0, achievements: [], error: error.message };
    }
  }

  /**
   * Calculate experience points for action type
   */
  calculateExperienceGain(actionType, actionData) {
    const actionConfig = this.actionPoints[actionType];
    if (!actionConfig) return 0;

    let basePoints = actionConfig.base;

    // Apply multipliers based on context
    if (actionData.difficulty === 'high') basePoints *= 1.5;
    if (actionData.strategic_value === 'high') basePoints *= 1.3;
    if (actionData.time_invested > 30) basePoints *= 1.2; // 30+ minutes
    if (actionData.complexity === 'enterprise') basePoints *= 1.4;

    // Consistency bonus (daily activity)
    if (actionData.consistency_bonus) basePoints *= 1.1;

    return Math.round(basePoints);
  }

  /**
   * Calculate current professional development level
   */
  calculateLevel(totalExperience) {
    for (const [key, level] of Object.entries(this.levels)) {
      if (totalExperience >= level.range[0] && totalExperience < level.range[1]) {
        return { key, ...level };
      }
    }
    return { key: 'authority', ...this.levels.authority };
  }

  /**
   * Calculate progress to next level
   */
  calculateProgressToNext(totalExperience) {
    const currentLevel = this.calculateLevel(totalExperience);
    if (currentLevel.key === 'authority') {
      return { percentage: 100, experienceNeeded: 0, experienceInLevel: totalExperience };
    }

    const [levelStart, levelEnd] = currentLevel.range;
    const experienceInLevel = totalExperience - levelStart;
    const experienceNeededForLevel = levelEnd - levelStart;
    const percentage = Math.round((experienceInLevel / experienceNeededForLevel) * 100);

    return {
      percentage: Math.min(percentage, 100),
      experienceNeeded: levelEnd - totalExperience,
      experienceInLevel,
      totalForLevel: experienceNeededForLevel
    };
  }

  /**
   * Check business milestone progress
   */
  checkMilestoneProgress(userDev, oldTotalExperience) {
    const achievements = [];
    
    for (const [milestoneKey, milestone] of Object.entries(this.businessMilestones)) {
      // Check if milestone was just achieved
      if (oldTotalExperience < milestone.experienceRequired && 
          userDev.totalExperience >= milestone.experienceRequired) {
        
        achievements.push({
          id: `milestone_${milestoneKey}`,
          type: 'milestone_reached',
          title: `Business Milestone: ${milestone.name}`,
          description: milestone.description,
          businessImpact: milestone.businessImpact,
          experienceGained: 100, // Bonus for milestone achievement
          milestoneKey
        });

        // Update milestone progress tracking
        userDev.milestoneProgress[milestoneKey] = {
          achieved: true,
          achievedAt: new Date().toISOString(),
          experienceAtAchievement: userDev.totalExperience
        };
      }
    }

    return achievements;
  }

  /**
   * Check for streak-based achievements
   */
  async checkStreakAchievements(customerId, userDev) {
    const achievements = [];
    const today = new Date().toISOString().split('T')[0];
    
    // Daily activity streak
    if (!userDev.streakData.lastActivityDate || 
        userDev.streakData.lastActivityDate !== today) {
      
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      if (userDev.streakData.lastActivityDate === yesterday) {
        // Continue streak
        userDev.streakData.currentStreak = (userDev.streakData.currentStreak || 0) + 1;
      } else {
        // Reset streak
        userDev.streakData.currentStreak = 1;
      }
      
      userDev.streakData.lastActivityDate = today;
      userDev.streakData.longestStreak = Math.max(
        userDev.streakData.longestStreak || 0,
        userDev.streakData.currentStreak
      );

      // Streak achievements
      const streak = userDev.streakData.currentStreak;
      if ([3, 7, 14, 30, 60].includes(streak)) {
        achievements.push({
          id: `streak_${streak}_days`,
          type: 'streak_achievement',
          title: `${streak}-Day Development Streak`,
          description: `Consistent professional development for ${streak} consecutive days`,
          businessImpact: 'Systematic competency building established',
          experienceGained: streak * 5, // Bonus points for streaks
          streakLength: streak
        });
      }
    }

    return achievements;
  }

  /**
   * Get professional development dashboard data
   */
  async getDashboardData(customerId) {
    const userDev = await this.initializeDevelopment(customerId);
    const progressToNext = this.calculateProgressToNext(userDev.totalExperience);
    
    // Recent activity summary
    const recentActions = userDev.actionHistory.slice(0, 10);
    const todayActions = recentActions.filter(action => {
      const actionDate = new Date(action.timestamp).toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      return actionDate === today;
    });

    // Business milestone progress
    const milestoneProgress = Object.entries(this.businessMilestones).map(([key, milestone]) => ({
      key,
      ...milestone,
      achieved: userDev.milestoneProgress[key]?.achieved || false,
      progress: Math.min((userDev.totalExperience / milestone.experienceRequired) * 100, 100),
      experienceNeeded: Math.max(0, milestone.experienceRequired - userDev.totalExperience)
    }));

    // Weekly summary
    const weeklyData = this.calculateWeeklyProgress(userDev);

    return {
      currentLevel: userDev.currentLevel,
      totalExperience: userDev.totalExperience,
      weeklyExperience: userDev.weeklyExperience,
      progressToNext,
      recentActions,
      todayActions: todayActions.length,
      todayExperience: todayActions.reduce((sum, action) => sum + action.experienceGained, 0),
      milestoneProgress,
      streakData: userDev.streakData,
      weeklyData,
      nextMilestone: milestoneProgress.find(m => !m.achieved) || null,
      seriesBReadiness: this.calculateSeriesBReadiness(userDev)
    };
  }

  /**
   * Calculate weekly progress data
   */
  calculateWeeklyProgress(userDev) {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyActions = userDev.actionHistory.filter(action => 
      new Date(action.timestamp) > oneWeekAgo
    );

    const categoryTotals = {};
    weeklyActions.forEach(action => {
      categoryTotals[action.category] = (categoryTotals[action.category] || 0) + action.experienceGained;
    });

    return {
      totalActions: weeklyActions.length,
      totalExperience: weeklyActions.reduce((sum, action) => sum + action.experienceGained, 0),
      categoryBreakdown: categoryTotals,
      averagePerDay: Math.round(weeklyActions.length / 7),
      mostActiveCategory: Object.entries(categoryTotals).sort(([,a], [,b]) => b - a)[0]?.[0] || null
    };
  }

  /**
   * Calculate Series B readiness based on professional development
   */
  calculateSeriesBReadiness(userDev) {
    const seriesBMilestone = this.businessMilestones.stage_15_revenue_growth;
    const progress = Math.min((userDev.totalExperience / seriesBMilestone.experienceRequired) * 100, 100);
    
    let status = 'Foundation Building';
    if (progress >= 80) status = 'Series B Ready';
    else if (progress >= 60) status = 'Advanced Preparation';
    else if (progress >= 40) status = 'Strategic Development';
    else if (progress >= 20) status = 'Early Progress';

    return {
      progress: Math.round(progress),
      status,
      experienceNeeded: Math.max(0, seriesBMilestone.experienceRequired - userDev.totalExperience),
      estimatedTimeToReady: this.estimateTimeToSeriesB(userDev)
    };
  }

  /**
   * Estimate time to Series B readiness
   */
  estimateTimeToSeriesB(userDev) {
    const weeklyAverage = userDev.weeklyExperience || 50; // Default if no data
    const seriesBMilestone = this.businessMilestones.stage_15_revenue_growth;
    const experienceNeeded = seriesBMilestone.experienceRequired - userDev.totalExperience;
    
    if (experienceNeeded <= 0) return 'Ready Now';
    
    const weeksNeeded = Math.ceil(experienceNeeded / weeklyAverage);
    
    if (weeksNeeded <= 4) return `${weeksNeeded} weeks`;
    if (weeksNeeded <= 12) return `${Math.ceil(weeksNeeded / 4)} months`;
    return `${Math.ceil(weeksNeeded / 52)} years`;
  }

  /**
   * Get default development state
   */
  getDefaultDevelopmentState(customerId) {
    return {
      customerId,
      totalExperience: 0,
      currentLevel: this.calculateLevel(0),
      weeklyExperience: 0,
      actionHistory: [],
      milestoneProgress: {},
      streakData: {},
      lastActivityDate: null
    };
  }

  /**
   * Persist development state to Airtable
   */
  async persistDevelopmentState(customerId, userDev) {
    try {
      const developmentData = {
        total_experience: userDev.totalExperience,
        current_level: userDev.currentLevel.key,
        weekly_experience: userDev.weeklyExperience,
        action_history: userDev.actionHistory.slice(0, 50), // Keep latest 50 actions
        milestone_progress: userDev.milestoneProgress,
        streak_data: userDev.streakData,
        last_activity_date: userDev.lastActivityDate,
        last_updated: new Date().toISOString()
      };

      await airtableService.updateCustomerData(customerId, {
        professionalDevelopment: JSON.stringify(developmentData)
      });

      return true;
    } catch (error) {
      console.error('Error persisting development state:', error);
      return false;
    }
  }

  /**
   * Clear user cache (for testing/debugging)
   */
  clearCache(customerId = null) {
    if (customerId) {
      this.userCache.delete(customerId);
    } else {
      this.userCache.clear();
    }
  }
}

export const professionalDevelopmentService = new ProfessionalDevelopmentService();