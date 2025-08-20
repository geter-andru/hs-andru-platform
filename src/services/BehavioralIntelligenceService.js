/**
 * Behavioral Intelligence Service
 * 
 * Invisible user behavior tracking and analysis for professional competency assessment
 * Maintains professional credibility with zero gaming terminology
 */

class BehavioralIntelligenceService {
  constructor() {
    this.localStorageKey = 'h_s_behavioral_data';
    this.syncQueue = [];
    this.lastSync = null;
    this.isOnline = navigator.onLine;
    this.syncTimeout = null;
    
    // Initialize online/offline handling
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());
    }
  }
  
  // Record user interactions with components
  recordInteraction(userId, component, interactionData) {
    const timestamp = Date.now();
    const interaction = {
      userId,
      component,
      timestamp,
      ...interactionData
    };
    
    this.storeInteractionLocally(interaction);
    this.queueForSync(interaction);
    
    // Trigger real-time assessment update
    this.triggerAssessmentUpdate(userId);
  }
  
  // Record specific user actions
  recordAction(userId, component, actionType, actionData = {}) {
    const action = {
      userId,
      component,
      actionType,
      actionData,
      timestamp: Date.now()
    };
    
    this.storeActionLocally(action);
    this.queueForSync(action);
  }
  
  // Record export events (high-value for assessment)
  recordExport(userId, exportEvent) {
    const exportData = {
      userId,
      ...exportEvent,
      timestamp: Date.now()
    };
    
    this.storeExportLocally(exportData);
    this.queueForSync(exportData);
    
    // Export events are high-value for professional assessment
    this.triggerAssessmentUpdate(userId);
  }
  
  // Record tool usage sequence for workflow analysis
  recordToolSequence(userId, toolName) {
    const sequence = this.getToolSequence(userId) || [];
    sequence.push({
      tool: toolName,
      timestamp: Date.now()
    });
    
    this.storeToolSequence(userId, sequence);
    this.queueForSync({ userId, toolSequence: sequence });
  }
  
  // Record session data
  recordSession(userId, component, sessionData) {
    const session = {
      userId,
      component,
      ...sessionData,
      timestamp: Date.now()
    };
    
    this.storeSessionLocally(session);
    this.queueForSync(session);
  }
  
  // Record visit for return usage tracking
  recordVisit(userId, component) {
    const visit = {
      userId,
      component,
      type: 'visit',
      timestamp: Date.now()
    };
    
    this.storeInteractionLocally(visit);
  }
  
  // Get comprehensive user behavior data for assessment
  async getUserBehaviorData(userId) {
    try {
      // Always use local data for real-time assessment
      // Server sync happens in background for persistence
      return this.getLocalBehaviorData(userId);
      
    } catch (error) {
      console.warn('Failed to get behavior data:', error);
      return this.getEmptyBehaviorProfile();
    }
  }
  
  // === LOCAL STORAGE MANAGEMENT ===
  
  storeInteractionLocally(interaction) {
    const data = this.getLocalData();
    if (!data.interactions) data.interactions = [];
    data.interactions.push(interaction);
    this.setLocalData(data);
  }
  
  storeActionLocally(action) {
    const data = this.getLocalData();
    if (!data.actions) data.actions = [];
    data.actions.push(action);
    this.setLocalData(data);
  }
  
  storeExportLocally(exportEvent) {
    const data = this.getLocalData();
    if (!data.exports) data.exports = [];
    data.exports.push(exportEvent);
    this.setLocalData(data);
  }
  
  storeSessionLocally(session) {
    const data = this.getLocalData();
    if (!data.sessions) data.sessions = [];
    data.sessions.push(session);
    this.setLocalData(data);
  }
  
  // Tool sequence management
  getToolSequence(userId) {
    const data = this.getLocalData();
    return data.toolSequences?.[userId];
  }
  
  storeToolSequence(userId, sequence) {
    const data = this.getLocalData();
    if (!data.toolSequences) data.toolSequences = {};
    data.toolSequences[userId] = sequence;
    this.setLocalData(data);
  }
  
  // === BEHAVIOR DATA ASSEMBLY ===
  
  // Get all behavioral data for a user from local storage
  getLocalBehaviorData(userId) {
    const data = this.getLocalData();
    
    const userInteractions = data.interactions?.filter(i => i.userId === userId) || [];
    const userActions = data.actions?.filter(a => a.userId === userId) || [];
    const userExports = data.exports?.filter(e => e.userId === userId) || [];
    const userSessions = data.sessions?.filter(s => s.userId === userId) || [];
    const userToolSequence = data.toolSequences?.[userId] || [];
    
    return this.assembleBehaviorProfile(userInteractions, userActions, userExports, userSessions, userToolSequence);
  }
  
  // Assemble comprehensive behavior profile for skill assessment
  assembleBehaviorProfile(interactions, actions, exports, sessions, toolSequence) {
    // ICP Analysis Behavior Assessment
    const icpInteractions = interactions.filter(i => i.component === 'icp_analysis');
    const icpActions = actions.filter(a => a.component === 'icp_analysis');
    const icpExports = exports.filter(e => e.componentContext === 'icp_analysis');
    
    const icpBehavior = {
      reviewTime: this.calculateTotalTime(icpInteractions),
      buyerPersonaClicks: icpActions.filter(a => a.actionType === 'buyer_persona_click').length,
      painPointSectionTime: this.calculateSectionTime(icpInteractions, 'pain_points'),
      exportedSummary: icpExports.length > 0,
      returnVisits: icpInteractions.filter(i => i.type === 'visit').length,
      customizedCriteria: icpActions.filter(a => a.actionType === 'customization').length > 0
    };
    
    // Calculator Behavior Assessment  
    const calculatorInteractions = interactions.filter(i => i.component === 'cost_calculator');
    const calculatorActions = actions.filter(a => a.component === 'cost_calculator');
    const calculatorExports = exports.filter(e => e.componentContext === 'cost_calculator');
    
    const calculatorBehavior = {
      variableAdjustments: calculatorActions.filter(a => a.actionType === 'variable_adjustment').length,
      methodologyReviewTime: this.calculateSectionTime(calculatorInteractions, 'methodology'),
      exportedCharts: calculatorExports.filter(e => e.type === 'chart' || e.type === 'summary_chart').length > 0,
      edgeCaseTesting: calculatorActions.filter(a => a.actionType === 'edge_case_testing').length > 0,
      multipleSessions: sessions.filter(s => s.component === 'cost_calculator').length,
      integratedWithBusinessCase: this.detectToolIntegration(toolSequence, 'cost_calculator', 'business_case')
    };
    
    // Business Case Behavior Assessment
    const businessCaseInteractions = interactions.filter(i => i.component === 'business_case');
    const businessCaseActions = actions.filter(a => a.component === 'business_case');
    const businessCaseExports = exports.filter(e => e.componentContext === 'business_case');
    
    const businessCaseBehavior = {
      stakeholderViewSwitches: businessCaseActions.filter(a => a.actionType === 'stakeholder_view_switch').length,
      contentCustomization: businessCaseActions.filter(a => a.actionType === 'content_customization').length > 0,
      multipleFormatExports: new Set(businessCaseExports.map(e => e.type)).size > 1,
      autoPopulationUtilization: businessCaseActions.filter(a => a.actionType === 'auto_population_accept').length > 0,
      returnAccess: businessCaseInteractions.filter(i => i.type === 'visit').length,
      strategicExportTiming: this.detectStrategicTiming(businessCaseExports, toolSequence)
    };
    
    return {
      icpBehavior,
      calculatorBehavior,
      businessCaseBehavior,
      overallMetrics: {
        totalSessions: sessions.length,
        totalExports: exports.length,
        toolSequenceLength: toolSequence.length,
        avgSessionDuration: this.calculateAverageSessionDuration(sessions),
        lastActivity: Math.max(...interactions.map(i => i.timestamp), 0)
      }
    };
  }
  
  // === BEHAVIOR ANALYSIS HELPERS ===
  
  calculateTotalTime(interactions) {
    return interactions.reduce((sum, i) => sum + (i.duration || 0), 0);
  }
  
  calculateSectionTime(interactions, sectionName) {
    return interactions
      .filter(i => i.section === sectionName)
      .reduce((sum, i) => sum + (i.duration || 0), 0);
  }
  
  calculateAverageSessionDuration(sessions) {
    if (sessions.length === 0) return 0;
    return sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length;
  }
  
  detectToolIntegration(toolSequence, tool1, tool2) {
    return toolSequence.some((tool, index) => 
      tool.tool === tool1 && 
      toolSequence[index + 1]?.tool === tool2 &&
      toolSequence[index + 1].timestamp - tool.timestamp < 3600000 // Within 1 hour
    );
  }
  
  detectStrategicTiming(exports, toolSequence) {
    return exports.some(exp => {
      const exportTime = exp.timestamp;
      const recentToolUsage = toolSequence.filter(tool => 
        exportTime - tool.timestamp < 3600000 && // Within last hour
        tool.timestamp < exportTime
      );
      return recentToolUsage.length >= 2; // Used multiple tools before export
    });
  }
  
  getEmptyBehaviorProfile() {
    return {
      icpBehavior: {
        reviewTime: 0,
        buyerPersonaClicks: 0,
        painPointSectionTime: 0,
        exportedSummary: false,
        returnVisits: 0,
        customizedCriteria: false
      },
      calculatorBehavior: {
        variableAdjustments: 0,
        methodologyReviewTime: 0,
        exportedCharts: false,
        edgeCaseTesting: false,
        multipleSessions: 0,
        integratedWithBusinessCase: false
      },
      businessCaseBehavior: {
        stakeholderViewSwitches: 0,
        contentCustomization: false,
        multipleFormatExports: false,
        autoPopulationUtilization: false,
        returnAccess: 0,
        strategicExportTiming: false
      },
      overallMetrics: {
        totalSessions: 0,
        totalExports: 0,
        toolSequenceLength: 0,
        avgSessionDuration: 0,
        lastActivity: 0
      }
    };
  }
  
  // === SYNC AND PERSISTENCE ===
  
  queueForSync(data) {
    this.syncQueue.push(data);
    
    // Batch sync every 30 seconds or when queue reaches 10 items
    if (!this.syncTimeout) {
      this.syncTimeout = setTimeout(() => {
        this.performSync();
        this.syncTimeout = null;
      }, 30000);
    }
    
    if (this.syncQueue.length >= 10) {
      this.performSync();
    }
  }
  
  async performSync() {
    if (!this.isOnline || this.syncQueue.length === 0) return;
    
    const batchData = [...this.syncQueue];
    this.syncQueue = [];
    
    try {
      await this.syncToAirtable(batchData);
      this.lastSync = Date.now();
      
    } catch (error) {
      console.warn('Behavioral data sync failed, will retry:', error);
      // Re-queue failed data for next sync attempt
      this.syncQueue = [...batchData, ...this.syncQueue];
    }
  }
  
  // Sync behavioral data to Airtable (integrate with existing service)
  async syncToAirtable(batchData) {
    // This will integrate with existing airtableService
    // For now, just log for development
    console.log('📊 Syncing behavioral intelligence data:', batchData.length, 'events');
  }
  
  // Sync skill assessment results
  async syncSkillAssessment(userId, skillLevels) {
    this.queueForSync({
      type: 'skill_assessment',
      userId,
      skillLevels,
      timestamp: Date.now()
    });
  }
  
  // === EVENT SYSTEM ===
  
  // Trigger real-time assessment update
  triggerAssessmentUpdate(userId) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('h_s_platform_behavioral_update', {
        detail: { userId, timestamp: Date.now() }
      }));
    }
  }
  
  // === LOCAL STORAGE HELPERS ===
  
  getLocalData() {
    try {
      if (typeof localStorage === 'undefined') return {};
      const data = localStorage.getItem(this.localStorageKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.warn('Failed to parse behavioral data from localStorage:', error);
      return {};
    }
  }
  
  setLocalData(data) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(this.localStorageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to store behavioral data to localStorage:', error);
    }
  }
  
  // === ONLINE/OFFLINE HANDLING ===
  
  handleOnline() {
    this.isOnline = true;
    this.performSync();
  }
  
  handleOffline() {
    this.isOnline = false;
  }
  
  // === CLEANUP ===
  
  // Clean old behavioral data to prevent localStorage overflow
  cleanupOldData(maxAgeMs = 30 * 24 * 60 * 60 * 1000) { // 30 days
    const data = this.getLocalData();
    const cutoffTime = Date.now() - maxAgeMs;
    
    ['interactions', 'actions', 'exports', 'sessions'].forEach(key => {
      if (data[key]) {
        data[key] = data[key].filter(item => item.timestamp > cutoffTime);
      }
    });
    
    this.setLocalData(data);
  }
}

// Create singleton instance
const behavioralIntelligenceService = new BehavioralIntelligenceService();

export default behavioralIntelligenceService;
export { BehavioralIntelligenceService };