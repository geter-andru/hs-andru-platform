/**
 * Event-Driven Agent Architecture
 * 
 * Central event coordination system for zero-overhead agent activation
 * Converts all always-on agents to event-driven for maximum efficiency
 */

class EventDrivenAgentArchitecture {
  constructor() {
    this.systemEvents = new Map();
    this.agentActivations = new Map();
    this.eventHandlers = new Map();
    this.activationLocks = new Map(); // Track in-progress activations
    this.performanceMetrics = {
      totalActivations: 0,
      averageActivationTime: 0,
      idleTimePercentage: 100,
      memoryUsageReduction: 0,
      lockHits: 0,
      lockMisses: 0
    };
    
    this.setupEventHandlers();
    console.log('🏗️ Event-Driven Agent Architecture: Initialized');
  }

  /**
   * Setup event handlers for all agent types
   */
  setupEventHandlers() {
    // System-level events
    this.registerEventHandler('system.startup', this.handleSystemStartup.bind(this));
    this.registerEventHandler('system.shutdown', this.handleSystemShutdown.bind(this));
    this.registerEventHandler('system.health_check_requested', this.handleHealthCheckRequest.bind(this));
    
    // User interaction events
    this.registerEventHandler('user.session_start', this.handleUserSessionStart.bind(this));
    this.registerEventHandler('user.session_end', this.handleUserSessionEnd.bind(this));
    this.registerEventHandler('user.navigation', this.handleUserNavigation.bind(this));
    this.registerEventHandler('user.tool_interaction', this.handleToolInteraction.bind(this));
    
    // Performance events
    this.registerEventHandler('performance.threshold_breach', this.handlePerformanceIssue.bind(this));
    this.registerEventHandler('database.growth_detected', this.handleDatabaseGrowth.bind(this));
    this.registerEventHandler('api.rate_limit_approaching', this.handleRateLimitWarning.bind(this));
    
    // Security events
    this.registerEventHandler('security.git_commit', this.handleGitCommit.bind(this));
    this.registerEventHandler('security.git_push', this.handleGitPush.bind(this));
    
    // Communication events
    this.registerEventHandler('agent.message_requested', this.handleAgentMessage.bind(this));
    this.registerEventHandler('agent.coordination_requested', this.handleAgentCoordination.bind(this));
    
    console.log('📢 Event handlers registered for 13 event types');
  }

  /**
   * Register event handler
   */
  registerEventHandler(eventType, handler) {
    this.eventHandlers.set(eventType, handler);
  }

  /**
   * Trigger event and activate appropriate agents
   */
  async triggerEvent(eventType, eventData = {}) {
    const eventId = this.generateEventId();
    const event = {
      id: eventId,
      type: eventType,
      data: eventData,
      timestamp: Date.now(),
      status: 'processing'
    };
    
    this.systemEvents.set(eventId, event);
    console.log(`🎯 Event triggered: ${eventType} (${eventId})`);
    
    try {
      const handler = this.eventHandlers.get(eventType);
      if (handler) {
        const result = await handler(event);
        event.status = 'completed';
        event.result = result;
        console.log(`✅ Event completed: ${eventType} (${eventId})`);
        return result;
      } else {
        console.warn(`⚠️ No handler for event type: ${eventType}`);
        event.status = 'no_handler';
      }
    } catch (error) {
      event.status = 'failed';
      event.error = error.message;
      console.error(`❌ Event failed: ${eventType} (${eventId})`, error);
      throw error;
    }
  }

  // === EVENT HANDLERS ===

  /**
   * Handle system startup - Initialize core agents
   */
  async handleSystemStartup(event) {
    console.log('🚀 System startup detected - Activating core infrastructure');
    
    const activations = await Promise.all([
      this.activateAgent('AgentRegistry', 'system_initialization', event.data),
      this.activateAgent('AgentCommunicationBus', 'system_initialization', event.data),
      this.activateAgent('UnifiedAgentManager', 'system_initialization', event.data)
    ]);
    
    return { activatedAgents: activations.length, status: 'core_infrastructure_ready' };
  }

  /**
   * Handle user session start - Activate behavioral monitoring
   */
  async handleUserSessionStart(event) {
    console.log(`👤 User session started: ${event.data.customerId}`);
    
    const activation = await this.activateAgent(
      'CustomerValueOrchestrator', 
      'session_monitoring', 
      event.data
    );
    
    return { activatedAgent: activation, status: 'behavioral_monitoring_active' };
  }

  /**
   * Handle performance issues - Activate database agents
   */
  async handlePerformanceIssue(event) {
    console.log(`⚠️ Performance threshold breach: ${event.data.severity}`);
    
    const activations = await Promise.all([
      this.activateAgent('EventDrivenAgentManager', 'performance_monitoring', event.data),
      this.activateAgent('AuditAgent', 'performance_audit', event.data)
    ]);
    
    return { activatedAgents: activations.length, status: 'performance_monitoring_active' };
  }

  /**
   * Handle git operations - Activate security agents
   */
  async handleGitCommit(event) {
    console.log('🔐 Git commit detected - Activating security scanning');
    
    const activation = await this.activateAgent(
      'SecurityScannerAgent', 
      'commit_scanning', 
      event.data
    );
    
    return { activatedAgent: activation, status: 'security_scanning_active' };
  }

  /**
   * Handle agent communication requests
   */
  async handleAgentMessage(event) {
    console.log(`📡 Agent message requested: ${event.data.fromAgent} → ${event.data.toAgent}`);
    
    const activation = await this.activateAgent(
      'AgentCommunicationBus', 
      'message_processing', 
      event.data
    );
    
    return { activatedAgent: activation, status: 'communication_active' };
  }

  // === AGENT ACTIVATION MANAGEMENT ===

  /**
   * Activate specific agent for event handling with lock management
   */
  async activateAgent(agentType, operationType, eventData) {
    const lockKey = `${agentType}_${operationType}`;
    
    // Check if agent is already being activated
    if (this.activationLocks.has(lockKey)) {
      console.log(`⏳ Agent ${agentType} already activating for ${operationType}, reusing...`);
      this.performanceMetrics.lockHits++;
      return this.activationLocks.get(lockKey); // Return existing promise
    }
    
    // Create new activation with lock
    this.performanceMetrics.lockMisses++;
    const activationPromise = this.performActivation(agentType, operationType, eventData);
    this.activationLocks.set(lockKey, activationPromise);
    
    // Remove lock after completion
    activationPromise.finally(() => {
      this.activationLocks.delete(lockKey);
      console.log(`🔓 Released lock for ${agentType}_${operationType}`);
    });
    
    return activationPromise;
  }

  /**
   * Perform actual agent activation
   */
  async performActivation(agentType, operationType, eventData) {
    const activationId = this.generateActivationId(agentType);
    const startTime = Date.now();
    
    console.log(`🎯 Activating ${agentType} for ${operationType} (${activationId})`);
    
    const activation = {
      id: activationId,
      agentType,
      operationType,
      eventData,
      startTime,
      status: 'active'
    };
    
    this.agentActivations.set(activationId, activation);
    this.updatePerformanceMetrics();
    
    // Auto-deactivate based on agent type
    const deactivationDelay = this.getDeactivationDelay(agentType, operationType);
    setTimeout(() => {
      this.deactivateAgent(activationId);
    }, deactivationDelay);
    
    return activationId;
  }

  /**
   * Find active agent by type
   */
  findActiveAgent(agentType) {
    for (const [id, activation] of this.agentActivations) {
      if (activation.agentType === agentType && activation.status === 'active') {
        return activation;
      }
    }
    return null;
  }

  /**
   * Deactivate agent after operation completion
   */
  deactivateAgent(activationId) {
    const activation = this.agentActivations.get(activationId);
    if (activation && activation.status === 'active') {
      const activeTime = Date.now() - activation.startTime;
      activation.status = 'deactivated';
      activation.endTime = Date.now();
      activation.activeTime = activeTime;
      
      console.log(`🛬 Deactivated ${activation.agentType} (active for ${activeTime}ms)`);
      
      this.updatePerformanceMetrics();
    }
  }

  /**
   * Get appropriate deactivation delay for agent type
   */
  getDeactivationDelay(agentType, operationType) {
    const delays = {
      'AgentRegistry': 5000,           // 5 seconds for registry operations
      'AgentCommunicationBus': 10000,  // 10 seconds for message processing
      'UnifiedAgentManager': 15000,    // 15 seconds for orchestration
      'CustomerValueOrchestrator': 300000, // 5 minutes for behavioral analysis
      'EventDrivenAgentManager': 60000,    // 1 minute for database operations
      'SecurityScannerAgent': 30000,       // 30 seconds for security scans
      'AuditAgent': 120000,               // 2 minutes for audits
      'default': 30000                    // 30 seconds default
    };
    
    return delays[agentType] || delays['default'];
  }

  /**
   * Update performance metrics
   */
  updatePerformanceMetrics() {
    const activeAgents = Array.from(this.agentActivations.values())
      .filter(a => a.status === 'active');
    
    const completedAgents = Array.from(this.agentActivations.values())
      .filter(a => a.status === 'deactivated' && a.activeTime);
    
    this.performanceMetrics.totalActivations = this.agentActivations.size;
    
    if (completedAgents.length > 0) {
      const totalActiveTime = completedAgents.reduce((sum, a) => sum + a.activeTime, 0);
      this.performanceMetrics.averageActivationTime = totalActiveTime / completedAgents.length;
    }
    
    // Calculate idle time percentage
    const totalTime = Date.now() - (this.agentActivations.values().next().value?.startTime || Date.now());
    const totalActiveTime = completedAgents.reduce((sum, a) => sum + a.activeTime, 0);
    this.performanceMetrics.idleTimePercentage = totalTime > 0 
      ? ((totalTime - totalActiveTime) / totalTime) * 100 
      : 100;
  }

  /**
   * Generate event ID
   */
  generateEventId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 11)}`;
  }

  /**
   * Generate activation ID
   */
  generateActivationId(agentType) {
    return `${agentType.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  /**
   * Get architecture performance metrics
   */
  getPerformanceMetrics() {
    return {
      ...this.performanceMetrics,
      currentlyActiveAgents: Array.from(this.agentActivations.values())
        .filter(a => a.status === 'active').length,
      totalRegisteredEvents: this.eventHandlers.size,
      systemEfficiency: this.performanceMetrics.idleTimePercentage,
      memoryFootprintReduction: this.calculateMemoryReduction()
    };
  }

  /**
   * Calculate memory reduction from event-driven architecture
   */
  calculateMemoryReduction() {
    // Estimate: Always-on agents would use ~50MB baseline
    // Event-driven agents use ~5MB when active, 0MB when idle
    const alwaysOnMemory = 50; // MB
    const eventDrivenMemory = this.performanceMetrics.idleTimePercentage > 80 ? 5 : 25; // MB
    
    return ((alwaysOnMemory - eventDrivenMemory) / alwaysOnMemory) * 100;
  }

  /**
   * Get activation history
   */
  getActivationHistory(limit = 50) {
    return Array.from(this.agentActivations.values())
      .sort((a, b) => b.startTime - a.startTime)
      .slice(0, limit)
      .map(activation => ({
        agentType: activation.agentType,
        operationType: activation.operationType,
        startTime: activation.startTime,
        activeTime: activation.activeTime || (Date.now() - activation.startTime),
        status: activation.status
      }));
  }

  // Placeholder handlers for remaining events
  async handleSystemShutdown(event) {
    console.log('🛑 System shutdown - Deactivating all agents');
    return { status: 'all_agents_deactivated' };
  }

  async handleHealthCheckRequest(event) {
    return await this.activateAgent('AgentRegistry', 'health_monitoring', event.data);
  }

  async handleUserSessionEnd(event) {
    console.log(`👤 User session ended: ${event.data.customerId}`);
    return { status: 'behavioral_monitoring_deactivated' };
  }

  async handleUserNavigation(event) {
    return await this.activateAgent('CustomerValueOrchestrator', 'navigation_analysis', event.data);
  }

  async handleToolInteraction(event) {
    return await this.activateAgent('CustomerValueOrchestrator', 'interaction_analysis', event.data);
  }

  async handleDatabaseGrowth(event) {
    return await this.activateAgent('EventDrivenAgentManager', 'growth_analysis', event.data);
  }

  async handleRateLimitWarning(event) {
    return await this.activateAgent('EventDrivenAgentManager', 'rate_limit_optimization', event.data);
  }

  async handleGitPush(event) {
    return await this.activateAgent('SecurityScannerAgent', 'push_validation', event.data);
  }

  async handleAgentCoordination(event) {
    return await this.activateAgent('AgentCommunicationBus', 'coordination_processing', event.data);
  }
}

export default EventDrivenAgentArchitecture;
export { EventDrivenAgentArchitecture };