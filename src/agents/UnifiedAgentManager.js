/**
 * Unified Agent Manager
 * 
 * Master orchestrator that coordinates both CustomerValueOrchestrator and AirtableManagementOrchestrator
 * Provides unified interface for all agent operations across the platform
 */

import AgentRegistry from './AgentRegistry.js';
import AgentCommunicationBus from './AgentCommunicationBus.js';

class UnifiedAgentManager {
  constructor(options = {}) {
    this.managerType = 'unified-agent-manager';
    this.isActive = false;
    this.options = options;
    
    // Event-driven activation tracking
    this.eventTriggers = {
      operationRequested: false,
      statusInquiry: false,
      healthCheckRequested: false,
      systemInitialization: false
    };
    
    this.activationHistory = [];
    this.lastActivation = null;
    
    // Initialize orchestrators
    this.customerValueOrchestrator = null;
    this.airtableManagementOrchestrator = null;
    this.orchestratorsLoaded = false;
    
    // Unified performance tracking
    this.globalStats = {
      totalOperations: 0,
      successfulOperations: 0,
      failedOperations: 0,
      averageExecutionTime: 0,
      activeAgentCount: 0,
      operationsByOrchestrator: new Map(),
      lastActivityTimestamp: null
    };
    
    // Advanced agent registry for dynamic discovery
    this.agentRegistry = new AgentRegistry();
    this.legacyRegistry = new Map(); // Backward compatibility
    
    // Agent communication system
    this.communicationBus = new AgentCommunicationBus();
    
    // Note: Call initializeOrchestrators() manually when ready
  }

  /**
   * Initialize both orchestrators
   */
  async initializeOrchestrators() {
    try {
      console.log('🚀 UnifiedAgentManager: Initializing orchestrators...');
      
      // Initialize Customer Value Orchestrator (lazy loading)
      await this.loadCustomerValueOrchestrator();
      
      // Initialize Airtable Management Orchestrator (load dynamically from hs-airtable-agent)
      await this.loadAirtableManagementOrchestrator();
      
      // Register all agents in unified registry
      await this.registerAllAgents();
      
      this.orchestratorsLoaded = true;
      console.log('✅ UnifiedAgentManager: All orchestrators initialized successfully');
      
    } catch (error) {
      console.error('❌ UnifiedAgentManager initialization failed:', error);
      this.orchestratorsLoaded = false;
    }
  }

  /**
   * Load Customer Value Orchestrator dynamically
   */
  async loadCustomerValueOrchestrator() {
    try {
      const { default: CustomerValueOrchestrator } = await import('./CustomerValueOrchestrator/CustomerValueOrchestrator.js');
      
      this.customerValueOrchestrator = new CustomerValueOrchestrator({
        ...this.options.customerValue,
        parentManager: this
      });
      
      console.log('✅ CustomerValueOrchestrator loaded successfully');
    } catch (error) {
      console.warn('⚠️ CustomerValueOrchestrator not available:', error.message);
      this.customerValueOrchestrator = null;
    }
  }

  /**
   * Load Airtable Management Orchestrator from hs-airtable-agent
   */
  async loadAirtableManagementOrchestrator() {
    try {
      // Import the EventDrivenAgentManager from hs-airtable-agent
      const { default: EventDrivenAgentManager } = await import('../../hs-airtable-agent/lib/EventDrivenAgentManager.js');
      
      this.airtableManagementOrchestrator = new EventDrivenAgentManager({
        ...this.options.airtableManagement,
        parentManager: this
      });
      
      console.log('✅ AirtableManagementOrchestrator loaded successfully');
    } catch (error) {
      console.warn('⚠️ AirtableManagementOrchestrator not available:', error.message);
      this.airtableManagementOrchestrator = null;
    }
  }

  /**
   * Register all agents from both orchestrators in unified registry
   */
  async registerAllAgents() {
    // Clear existing registrations
    this.legacyRegistry.clear();
    
    // Register Customer Value agents
    if (this.customerValueOrchestrator) {
      const customerValueAgents = [
        { 
          name: 'dashboard-optimizer', 
          type: 'customer-value', 
          orchestrator: 'customer-value',
          capabilities: ['dashboard-analysis', 'ui-optimization', 'user-experience'],
          tags: ['frontend', 'optimization', 'analytics'],
          description: 'Optimizes dashboard interfaces and user experience'
        },
        { 
          name: 'deal-value-calculator-optimizer', 
          type: 'customer-value', 
          orchestrator: 'customer-value',
          capabilities: ['financial-analysis', 'roi-calculation', 'value-optimization'],
          tags: ['finance', 'calculation', 'roi'],
          description: 'Optimizes deal value calculations and ROI analysis'
        },
        { 
          name: 'prospect-qualification-optimizer', 
          type: 'customer-value', 
          orchestrator: 'customer-value',
          capabilities: ['lead-scoring', 'qualification', 'prospect-analysis'],
          tags: ['sales', 'qualification', 'scoring'],
          description: 'Optimizes prospect qualification and lead scoring'
        },
        { 
          name: 'sales-materials-optimizer', 
          type: 'customer-value', 
          orchestrator: 'customer-value',
          capabilities: ['content-optimization', 'sales-enablement', 'material-analysis'],
          tags: ['sales', 'content', 'materials'],
          description: 'Optimizes sales materials and content effectiveness'
        }
      ];
      
      customerValueAgents.forEach(agentInfo => {
        // Register in advanced registry
        this.agentRegistry.registerAgent(agentInfo.name, {
          ...agentInfo,
          status: 'available',
          lastActivity: null,
          executionCount: 0,
          version: '2.0.0'
        });
        
        // Maintain legacy registry for backward compatibility
        this.legacyRegistry.set(agentInfo.name, {
          ...agentInfo,
          status: 'available',
          lastActivity: null,
          executionCount: 0
        });
      });
    }
    
    // Register Airtable Management agents
    if (this.airtableManagementOrchestrator?.agentsLoaded) {
      const airtableAgents = [
        { 
          name: 'audit-agent', 
          type: 'airtable-management', 
          orchestrator: 'airtable-management',
          capabilities: ['database-audit', 'performance-analysis', 'data-integrity'],
          tags: ['database', 'audit', 'analysis'],
          description: 'Performs comprehensive database audits and analysis'
        },
        { 
          name: 'optimization-agent', 
          type: 'airtable-management', 
          orchestrator: 'airtable-management',
          capabilities: ['database-optimization', 'performance-tuning', 'query-analysis'],
          tags: ['database', 'optimization', 'performance'],
          description: 'Optimizes database performance and query efficiency'
        },
        { 
          name: 'maintenance-agent', 
          type: 'airtable-management', 
          orchestrator: 'airtable-management',
          capabilities: ['system-maintenance', 'health-monitoring', 'cleanup'],
          tags: ['maintenance', 'monitoring', 'system'],
          description: 'Performs system maintenance and health monitoring'
        },
        { 
          name: 'backup-agent', 
          type: 'airtable-management', 
          orchestrator: 'airtable-management',
          capabilities: ['data-backup', 'recovery', 'archival'],
          tags: ['backup', 'recovery', 'data-protection'],
          description: 'Manages data backup and recovery operations'
        },
        { 
          name: 'consolidation-agent', 
          type: 'airtable-management', 
          orchestrator: 'airtable-management',
          capabilities: ['field-consolidation', 'schema-optimization', 'data-cleanup'],
          tags: ['consolidation', 'schema', 'cleanup'],
          description: 'Consolidates fields and optimizes database schema'
        },
        { 
          name: 'manual-agent', 
          type: 'airtable-management', 
          orchestrator: 'airtable-management',
          capabilities: ['manual-operations', 'ad-hoc-tasks', 'flexible-routing'],
          tags: ['manual', 'flexible', 'operations'],
          description: 'Handles manual operations and ad-hoc tasks'
        }
      ];
      
      airtableAgents.forEach(agentInfo => {
        // Register in advanced registry
        this.agentRegistry.registerAgent(agentInfo.name, {
          ...agentInfo,
          status: 'available',
          lastActivity: null,
          executionCount: 0,
          version: '2.0.0'
        });
        
        // Maintain legacy registry for backward compatibility
        this.legacyRegistry.set(agentInfo.name, {
          ...agentInfo,
          status: 'available',
          lastActivity: null,
          executionCount: 0
        });
      });
    }
    
    console.log(`📋 UnifiedAgentManager: Registered ${this.agentRegistry.getAllAgents().length} agents across orchestrators`);
  }

  /**
   * Activate for operation execution (Event-Driven)
   */
  activateForOperation(agentName, operation) {
    if (!this.isActive) {
      this.isActive = true;
      this.eventTriggers.operationRequested = true;
      this.lastActivation = Date.now();
      
      console.log(`🎯 UnifiedAgentManager: Activated for ${agentName} -> ${operation}`);
      
      // Track activation
      this.activationHistory.unshift({
        agentName,
        operation,
        timestamp: Date.now()
      });
      
      // Keep last 100 activations
      if (this.activationHistory.length > 100) {
        this.activationHistory = this.activationHistory.slice(0, 100);
      }
    }
  }

  /**
   * Deactivate after operation completion
   */
  deactivateAfterOperation(executionTime) {
    this.isActive = false;
    this.eventTriggers.operationRequested = false;
    
    console.log(`🎯 UnifiedAgentManager: Deactivated (active for ${executionTime}ms)`);
  }

  /**
   * Execute agent operation through appropriate orchestrator (Event-Driven)
   */
  async executeOperation(agentName, operation, params = {}) {
    // Activate for this operation
    this.activateForOperation(agentName, operation);
    const startTime = Date.now();
    
    try {
      // Check if orchestrators are loaded
      if (!this.orchestratorsLoaded) {
        console.log('⏳ Waiting for orchestrators to load...');
        await this.waitForOrchestratorsToLoad();
      }
      
      // Get agent info from registry
      const agentInfo = this.agentRegistry.getAgent(agentName);
      if (!agentInfo) {
        throw new Error(`Agent '${agentName}' not found in registry`);
      }
      
      let result;
      
      // Route to appropriate orchestrator
      switch (agentInfo.orchestrator) {
        case 'customer-value':
          result = await this.executeCustomerValueOperation(agentName, operation, params);
          break;
          
        case 'airtable-management':
          result = await this.executeAirtableManagementOperation(agentName, operation, params);
          break;
          
        default:
          throw new Error(`Unknown orchestrator: ${agentInfo.orchestrator}`);
      }
      
      // Update unified statistics and agent registry
      const executionTime = Date.now() - startTime;
      this.updateGlobalStats(agentInfo.orchestrator, executionTime, true);
      this.agentRegistry.recordExecution(agentName, operation, executionTime, true, result);
      this.agentRegistry.updateAgentStatus(agentName, 'available');
      
      // Enhance result with unified metadata
      const enhancedResult = {
        ...result,
        unifiedExecution: true,
        agentName,
        operation,
        orchestrator: agentInfo.orchestrator,
        executionTime,
        timestamp: Date.now()
      };
      
      console.log(`✅ UnifiedAgentManager completed: ${agentName} -> ${operation} (${executionTime}ms)`);
      
      // Deactivate after successful completion
      this.deactivateAfterOperation(executionTime);
      
      return enhancedResult;
      
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.updateGlobalStats('unknown', executionTime, false);
      
      // Record failed execution in agent registry
      if (agentName) {
        this.agentRegistry.recordExecution(agentName, operation, executionTime, false, { error: error.message });
        this.agentRegistry.updateAgentStatus(agentName, 'error', { lastError: error.message });
      }
      
      console.error(`❌ UnifiedAgentManager failed: ${agentName} -> ${operation}`, error);
      
      // Deactivate after failure
      this.deactivateAfterOperation(executionTime);
      throw error;
    }
  }

  /**
   * Execute Customer Value agent operation
   */
  async executeCustomerValueOperation(agentName, operation, params) {
    if (!this.customerValueOrchestrator) {
      throw new Error('CustomerValueOrchestrator not available');
    }
    
    // Map agent names to Customer Value Orchestrator methods
    const agentMethodMap = {
      'dashboard-optimizer': 'optimizeDashboard',
      'deal-value-calculator-optimizer': 'optimizeDealValueCalculator', 
      'prospect-qualification-optimizer': 'optimizeProspectQualification',
      'sales-materials-optimizer': 'optimizeSalesMaterials'
    };
    
    const method = agentMethodMap[agentName];
    if (!method) {
      throw new Error(`No method mapping for Customer Value agent: ${agentName}`);
    }
    
    return await this.customerValueOrchestrator[method](operation, params);
  }

  /**
   * Execute Airtable Management agent operation
   */
  async executeAirtableManagementOperation(agentName, operation, params) {
    if (!this.airtableManagementOrchestrator) {
      throw new Error('AirtableManagementOrchestrator not available');
    }
    
    // Map agent names to Airtable Management agent types
    const agentTypeMap = {
      'audit-agent': 'audit_agent',
      'optimization-agent': 'optimization_agent',
      'maintenance-agent': 'maintenance_agent', 
      'backup-agent': 'backup_agent',
      'consolidation-agent': 'consolidation_agent',
      'manual-agent': 'manual_agent'
    };
    
    const agentType = agentTypeMap[agentName];
    if (!agentType) {
      throw new Error(`No agent type mapping for Airtable Management agent: ${agentName}`);
    }
    
    return await this.airtableManagementOrchestrator.spawnAgent(agentType, {
      operation,
      event: { data: params }
    });
  }

  /**
   * Get comprehensive status of all orchestrators and agents
   */
  async getUnifiedStatus() {
    const status = {
      managerType: this.managerType,
      isActive: this.isActive,
      orchestratorsLoaded: this.orchestratorsLoaded,
      globalStats: {
        ...this.globalStats,
        operationsByOrchestrator: Object.fromEntries(this.globalStats.operationsByOrchestrator)
      },
      orchestrators: {},
      agentRegistry: this.agentRegistry.exportState(),
      totalRegisteredAgents: this.agentRegistry.getAllAgents().length,
      timestamp: Date.now()
    };
    
    // Get Customer Value Orchestrator status
    if (this.customerValueOrchestrator) {
      status.orchestrators.customerValue = {
        available: true,
        type: 'CustomerValueOrchestrator',
        agentCount: 4,
        status: 'active'
      };
    }
    
    // Get Airtable Management Orchestrator status
    if (this.airtableManagementOrchestrator) {
      status.orchestrators.airtableManagement = {
        available: true,
        type: 'EventDrivenAgentManager',
        agentCount: 6,
        agentsLoaded: this.airtableManagementOrchestrator.agentsLoaded,
        status: this.airtableManagementOrchestrator.agentsLoaded ? 'active' : 'loading'
      };
    }
    
    return status;
  }

  /**
   * List all available agents across orchestrators
   */
  listAllAgents() {
    return this.agentRegistry.getAllAgents()
      .map(agent => ({
        name: agent.name,
        type: agent.type,
        orchestrator: agent.orchestrator,
        status: agent.status,
        healthStatus: agent.healthStatus,
        executionCount: agent.executionCount || 0,
        lastActivity: agent.lastActivity,
        capabilities: agent.capabilities || [],
        description: agent.description || '',
        version: agent.version || '1.0.0'
      }))
      .sort((a, b) => a.orchestrator.localeCompare(b.orchestrator));
  }

  /**
   * Find agents by criteria using advanced registry
   */
  findAgents(criteria) {
    return this.agentRegistry.findAgents(criteria);
  }

  /**
   * Get agents by capability
   */
  getAgentsByCapability(capability) {
    return this.agentRegistry.getAgentsByCapability(capability);
  }

  /**
   * Get agent registry statistics
   */
  getRegistryStatistics() {
    return this.agentRegistry.getStatistics();
  }

  /**
   * Perform health check on all agents
   */
  async performHealthCheck() {
    return await this.agentRegistry.performHealthCheck();
  }

  /**
   * Update global statistics
   */
  updateGlobalStats(orchestrator, executionTime, success) {
    this.globalStats.totalOperations++;
    this.globalStats.lastActivityTimestamp = Date.now();
    
    if (success) {
      this.globalStats.successfulOperations++;
    } else {
      this.globalStats.failedOperations++;
    }
    
    // Update average execution time
    if (this.globalStats.averageExecutionTime === 0) {
      this.globalStats.averageExecutionTime = executionTime;
    } else {
      this.globalStats.averageExecutionTime = 
        (this.globalStats.averageExecutionTime + executionTime) / 2;
    }
    
    // Track operations by orchestrator
    const currentCount = this.globalStats.operationsByOrchestrator.get(orchestrator) || 0;
    this.globalStats.operationsByOrchestrator.set(orchestrator, currentCount + 1);
  }

  /**
   * Update agent registry with activity (legacy method for backward compatibility)
   */
  updateAgentRegistry(agentName, success) {
    // This method is maintained for backward compatibility
    // The new AgentRegistry handles this through recordExecution() and updateAgentStatus()
    const legacyInfo = this.legacyRegistry.get(agentName);
    if (legacyInfo) {
      legacyInfo.executionCount++;
      legacyInfo.lastActivity = Date.now();
      legacyInfo.status = success ? 'available' : 'error';
    }
  }

  /**
   * Wait for orchestrators to load with timeout
   */
  async waitForOrchestratorsToLoad(timeoutMs = 10000) {
    const startTime = Date.now();
    while (!this.orchestratorsLoaded && (Date.now() - startTime) < timeoutMs) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    if (!this.orchestratorsLoaded) {
      throw new Error('Timeout waiting for orchestrators to load');
    }
  }

  /**
   * Check if agent is available
   */
  isAgentAvailable(agentName) {
    return this.agentRegistry.isAgentAvailable(agentName);
  }

  /**
   * Get agent information from registry
   */
  getAgentInfo(agentName) {
    return this.agentRegistry.getAgent(agentName);
  }

  /**
   * Register a new agent in the unified system
   */
  async registerAgent(agentName, agentInfo) {
    // Register in advanced registry
    const registeredAgent = this.agentRegistry.registerAgent(agentName, {
      ...agentInfo,
      status: 'available',
      lastActivity: null,
      executionCount: 0,
      version: agentInfo.version || '1.0.0'
    });
    
    // Maintain legacy registry for backward compatibility
    this.legacyRegistry.set(agentName, {
      ...agentInfo,
      status: 'available',
      lastActivity: null,
      executionCount: 0
    });
    
    // Update global stats
    this.globalStats.activeAgentCount = this.agentRegistry.getAllAgents().length;
    
    console.log(`📋 UnifiedAgentManager: Registered agent '${agentName}' (${agentInfo.type})`);
    return registeredAgent;
  }

  // ============================================
  // AGENT COMMUNICATION METHODS
  // ============================================

  /**
   * Send message between agents
   */
  async sendAgentMessage(fromAgent, toAgent, messageType, payload, options = {}) {
    // Verify both agents exist
    if (!this.agentRegistry.getAgent(fromAgent)) {
      throw new Error(`Source agent '${fromAgent}' not found`);
    }
    if (!this.agentRegistry.getAgent(toAgent)) {
      throw new Error(`Target agent '${toAgent}' not found`);
    }
    
    return await this.communicationBus.sendMessage(fromAgent, toAgent, messageType, payload, options);
  }

  /**
   * Publish message to topic
   */
  async publishToTopic(fromAgent, topic, messageType, payload, options = {}) {
    if (!this.agentRegistry.getAgent(fromAgent)) {
      throw new Error(`Publishing agent '${fromAgent}' not found`);
    }
    
    return await this.communicationBus.publishMessage(fromAgent, topic, messageType, payload, options);
  }

  /**
   * Subscribe agent to topic
   */
  subscribeAgentToTopic(agentName, topic, messageHandler, filter = null) {
    if (!this.agentRegistry.getAgent(agentName)) {
      throw new Error(`Subscribing agent '${agentName}' not found`);
    }
    
    return this.communicationBus.subscribe(agentName, topic, messageHandler, filter);
  }

  /**
   * Unsubscribe agent from topic
   */
  unsubscribeAgentFromTopic(agentName, topic) {
    return this.communicationBus.unsubscribe(agentName, topic);
  }

  /**
   * Get agent's message inbox
   */
  getAgentInbox(agentName) {
    return this.communicationBus.getInbox(agentName);
  }

  /**
   * Get unread message count for agent
   */
  getAgentUnreadCount(agentName) {
    return this.communicationBus.getUnreadCount(agentName);
  }

  /**
   * Broadcast message to all agents
   */
  async broadcastMessage(fromAgent, messageType, payload, options = {}) {
    return await this.communicationBus.broadcastMessage(fromAgent, messageType, payload, options);
  }

  /**
   * Send system notification
   */
  async sendSystemNotification(messageType, payload, targetAgents = null) {
    return await this.communicationBus.sendSystemNotification(messageType, payload, targetAgents);
  }

  /**
   * Request multi-agent coordination
   */
  async requestAgentCoordination(coordinatorAgent, participantAgents, operationType, coordinationData) {
    // Verify coordinator exists
    if (!this.agentRegistry.getAgent(coordinatorAgent)) {
      throw new Error(`Coordinator agent '${coordinatorAgent}' not found`);
    }
    
    // Verify all participants exist
    const missingAgents = participantAgents.filter(agent => !this.agentRegistry.getAgent(agent));
    if (missingAgents.length > 0) {
      throw new Error(`Participant agents not found: ${missingAgents.join(', ')}`);
    }
    
    return await this.communicationBus.requestCoordination(
      coordinatorAgent,
      participantAgents,
      operationType,
      coordinationData
    );
  }

  /**
   * Get communication statistics
   */
  getCommunicationStatistics() {
    return this.communicationBus.getStatistics();
  }

  /**
   * Get active communication topics
   */
  getActiveTopics() {
    return this.communicationBus.getActiveTopics();
  }

  /**
   * Get recent message history
   */
  getMessageHistory(limit = 50) {
    return this.communicationBus.getMessageHistory(limit);
  }

  /**
   * Example: Customer Value to Airtable coordination
   */
  async coordinateCustomerValueWithAirtable(operation, customerData) {
    try {
      // Request coordination between Customer Value and Airtable agents
      const coordination = await this.requestAgentCoordination(
        'dashboard-optimizer', // Coordinator
        ['audit-agent', 'optimization-agent'], // Participants from Airtable side
        'customer-value-optimization',
        {
          operation,
          customerData,
          analysisRequirements: ['performance-metrics', 'optimization-opportunities'],
          expectedDelivery: Date.now() + (5 * 60 * 1000) // 5 minutes
        }
      );
      
      console.log(`🤝 Cross-orchestrator coordination established for: ${operation}`);
      return coordination;
      
    } catch (error) {
      console.error(`❌ Cross-orchestrator coordination failed:`, error);
      throw error;
    }
  }

  /**
   * Example: Notify all agents of system status change
   */
  async notifySystemStatusChange(statusType, statusData) {
    return await this.sendSystemNotification('system_status_change', {
      statusType,
      statusData,
      timestamp: Date.now(),
      affectedOrchestrators: ['customer-value', 'airtable-management']
    });
  }

  /**
   * Get comprehensive system status
   */
  getSystemStatus() {
    const registryStats = this.agentRegistry.getStatistics();
    const commStats = this.communicationBus.getStatistics();
    
    return {
      timestamp: Date.now(),
      status: this.isActive ? 'active' : 'inactive',
      managerType: this.managerType,
      orchestratorsLoaded: this.orchestratorsLoaded,
      globalStats: {
        ...this.globalStats,
        operationsByOrchestrator: Object.fromEntries(this.globalStats.operationsByOrchestrator)
      },
      agentRegistry: {
        totalAgents: registryStats.totalAgents,
        healthyAgents: Object.fromEntries(registryStats.agentsByHealth),
        topPerformingAgents: registryStats.topPerformingAgents
      },
      communication: {
        totalMessages: commStats.totalMessages,
        deliveredMessages: commStats.deliveredMessages,
        activeAgents: commStats.activeAgents,
        activeTopics: this.communicationBus.getActiveTopics().length
      },
      orchestrators: {
        customerValue: {
          loaded: this.customerValueOrchestrator !== null,
          agentCount: 4
        },
        airtableManagement: {
          loaded: this.airtableManagementOrchestrator !== null,
          agentCount: 6
        }
      }
    };
  }

  /**
   * Export complete system state
   */
  exportSystemState() {
    return {
      timestamp: Date.now(),
      managerInfo: {
        type: this.managerType,
        isActive: this.isActive,
        orchestratorsLoaded: this.orchestratorsLoaded
      },
      components: {
        agentRegistry: this.agentRegistry.exportState(),
        communicationBus: this.communicationBus.exportState(),
        globalStats: {
          ...this.globalStats,
          operationsByOrchestrator: Object.fromEntries(this.globalStats.operationsByOrchestrator)
        }
      },
      systemStatus: this.getSystemStatus()
    };
  }

  /**
   * Clean up resources
   */
  destroy() {
    if (this.agentRegistry) {
      this.agentRegistry.destroy();
    }
    if (this.communicationBus) {
      this.communicationBus.destroy();
    }
    this.legacyRegistry.clear();
    console.log('🧹 UnifiedAgentManager: Cleaned up resources');
  }
}

export default UnifiedAgentManager;
export { UnifiedAgentManager };