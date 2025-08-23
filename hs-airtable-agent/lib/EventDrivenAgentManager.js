/**
 * Event-Driven Agent Manager
 * Spawns and manages AirtableManagementAgent operations based on events
 * Now uses extracted sub-agents from AirtableManagementOrchestrator
 */

const EventBus = require('./EventBus');
const EventDetector = require('./EventDetector');
const WebhookServer = require('./WebhookServer');
const AgentCoordinator = require('./AgentCoordinator');
const agentConfig = require('../config/agent.config');

// Import extracted sub-agents (using dynamic import for ES6 modules)
// These will be loaded asynchronously in the constructor

class EventDrivenAgentManager {
    constructor(options = {}) {
        this.eventBus = options.eventBus || new EventBus();
        this.eventDetector = options.eventDetector || new EventDetector({ eventBus: this.eventBus });
        this.webhookServer = options.webhookServer || null; // Initialize only when needed
        this.coordinator = options.coordinator || new AgentCoordinator(agentConfig);
        this.airtableClient = options.airtableClient;
        this.auditEngine = options.auditEngine;
        this.optimizationEngine = options.optimizationEngine;
        this.backupEngine = options.backupEngine;
        this.fieldConsolidationEngine = options.fieldConsolidationEngine;
        this.safeFieldConsolidator = options.safeFieldConsolidator;
        
        // Initialize extracted sub-agents (loaded asynchronously)
        this.auditAgent = null;
        this.optimizationAgent = null;
        this.maintenanceAgent = null;
        this.backupAgent = null;
        this.consolidationAgent = null;
        this.manualAgent = null;
        this.agentsLoaded = false;
        
        this.activeAgents = new Map();
        this.agentStats = {
            totalActivations: 0,
            successfulOperations: 0,
            failedOperations: 0,
            averageExecutionTime: 0
        };
        
        this.setupEventHandlers();
        
        // Load agents asynchronously
        this.loadAgents();
    }

    /**
     * Load ES6 sub-agents dynamically
     */
    async loadAgents() {
        try {
            // Dynamically import ES6 modules
            const { default: AuditAgent } = await import('../../src/agents/AirtableManagementOrchestrator/sub-agents/AuditAgent.js');
            const { default: OptimizationAgent } = await import('../../src/agents/AirtableManagementOrchestrator/sub-agents/OptimizationAgent.js');
            const { default: MaintenanceAgent } = await import('../../src/agents/AirtableManagementOrchestrator/sub-agents/MaintenanceAgent.js');
            const { default: BackupAgent } = await import('../../src/agents/AirtableManagementOrchestrator/sub-agents/BackupAgent.js');
            const { default: ConsolidationAgent } = await import('../../src/agents/AirtableManagementOrchestrator/sub-agents/ConsolidationAgent.js');
            const { default: ManualAgent } = await import('../../src/agents/AirtableManagementOrchestrator/sub-agents/ManualAgent.js');

            // Initialize sub-agents
            this.auditAgent = new AuditAgent(this.auditEngine);
            this.optimizationAgent = new OptimizationAgent(this.optimizationEngine, this.auditEngine);
            this.maintenanceAgent = new MaintenanceAgent({
                auditEngine: this.auditEngine,
                optimizationEngine: this.optimizationEngine,
                backupEngine: this.backupEngine,
                fieldConsolidationEngine: this.fieldConsolidationEngine
            });
            this.backupAgent = new BackupAgent(this.backupEngine);
            this.consolidationAgent = new ConsolidationAgent({
                fieldConsolidationEngine: this.fieldConsolidationEngine,
                safeFieldConsolidator: this.safeFieldConsolidator
            });
            this.manualAgent = new ManualAgent({
                auditEngine: this.auditEngine,
                optimizationEngine: this.optimizationEngine,
                backupEngine: this.backupEngine,
                fieldConsolidationEngine: this.fieldConsolidationEngine
            });

            this.agentsLoaded = true;
            console.log('🔗 EventDrivenAgentManager: All sub-agents loaded successfully');
        } catch (error) {
            console.error('❌ Failed to load sub-agents:', error);
            this.agentsLoaded = false;
        }
    }

    /**
     * Start the event-driven system
     */
    async start(options = {}) {
        console.log('🚀 Starting Event-Driven Agent Manager...');
        
        // Start event detection
        this.eventDetector.start();
        
        // Start webhook server if requested
        if (options.enableWebhooks !== false) {
            if (!this.webhookServer) {
                this.webhookServer = new WebhookServer({ 
                    eventManager: this,
                    port: options.webhookPort || 3001
                });
            }
            await this.webhookServer.start();
        }
        
        console.log('✅ Event-Driven Agent Manager started');
        console.log('📡 Listening for events...');
        
        if (options.enableWebhooks !== false) {
            console.log('🌐 Webhook endpoints available for external triggers');
        }
    }

    /**
     * Stop the event-driven system
     */
    async stop() {
        console.log('🛑 Stopping Event-Driven Agent Manager...');
        
        // Stop event detection
        this.eventDetector.stop();
        
        // Stop webhook server
        if (this.webhookServer.isRunning) {
            await this.webhookServer.stop();
        }
        
        // Wait for active agents to complete
        if (this.activeAgents.size > 0) {
            console.log(`⏳ Waiting for ${this.activeAgents.size} active agents to complete...`);
            await this.waitForActiveAgents();
        }
        
        console.log('✅ Event-Driven Agent Manager stopped');
    }

    /**
     * Setup event handlers for different event types
     */
    setupEventHandlers() {
        // Performance issue events
        this.eventBus.subscribe(this.eventBus.eventTypes.PERFORMANCE_ISSUE, 
            (event) => this.handlePerformanceIssue(event));
        
        // Database growth events
        this.eventBus.subscribe(this.eventBus.eventTypes.DATABASE_GROWTH,
            (event) => this.handleDatabaseGrowth(event));
        
        // Scheduled optimization events
        this.eventBus.subscribe(this.eventBus.eventTypes.SCHEDULED_OPTIMIZATION,
            (event) => this.handleScheduledOptimization(event));
        
        // Manual trigger events
        this.eventBus.subscribe(this.eventBus.eventTypes.MANUAL_TRIGGER,
            (event) => this.handleManualTrigger(event));
        
        // Backup required events
        this.eventBus.subscribe(this.eventBus.eventTypes.BACKUP_REQUIRED,
            (event) => this.handleBackupRequired(event));
        
        // Field consolidation events
        this.eventBus.subscribe(this.eventBus.eventTypes.FIELD_CONSOLIDATION_NEEDED,
            (event) => this.handleFieldConsolidationNeeded(event));
        
        // Data integrity events
        this.eventBus.subscribe(this.eventBus.eventTypes.DATA_INTEGRITY_ISSUE,
            (event) => this.handleDataIntegrityIssue(event));
        
        console.log('📢 Event handlers registered');
    }

    /**
     * Handle performance issue events
     */
    async handlePerformanceIssue(event) {
        console.log(`🚨 Handling performance issue: ${event.data.severity}`);
        
        const agentId = await this.spawnAgent('audit_agent', {
            operation: 'performance_audit',
            event,
            priority: event.data.severity === 'critical' ? 'high' : 'medium'
        });
        
        return agentId;
    }

    /**
     * Handle database growth events
     */
    async handleDatabaseGrowth(event) {
        console.log(`📈 Handling database growth`);
        
        const agentId = await this.spawnAgent('optimization_agent', {
            operation: 'database_optimization',
            event,
            priority: 'medium'
        });
        
        return agentId;
    }

    /**
     * Handle scheduled optimization events
     */
    async handleScheduledOptimization(event) {
        console.log(`⏰ Handling scheduled optimization: ${event.data.type}`);
        
        const agentId = await this.spawnAgent('maintenance_agent', {
            operation: 'scheduled_maintenance',
            event,
            priority: 'low'
        });
        
        return agentId;
    }

    /**
     * Handle manual trigger events
     */
    async handleManualTrigger(event) {
        console.log(`🔧 Handling manual trigger: ${event.data.operation}`);
        
        const agentId = await this.spawnAgent('manual_agent', {
            operation: event.data.operation,
            event,
            priority: 'high'
        });
        
        return agentId;
    }

    /**
     * Handle backup required events
     */
    async handleBackupRequired(event) {
        console.log(`💾 Handling backup requirement: ${event.data.reason}`);
        
        const agentId = await this.spawnAgent('backup_agent', {
            operation: 'safety_backup',
            event,
            priority: event.data.priority || 'medium'
        });
        
        return agentId;
    }

    /**
     * Handle field consolidation needed events
     */
    async handleFieldConsolidationNeeded(event) {
        console.log(`🔧 Handling field consolidation need`);
        
        const agentId = await this.spawnAgent('consolidation_agent', {
            operation: 'analyze_fields',
            event,
            priority: 'medium'
        });
        
        return agentId;
    }

    /**
     * Handle data integrity issue events
     */
    async handleDataIntegrityIssue(event) {
        console.log(`🚨 Handling data integrity issue: ${event.data.issue}`);
        
        // First create a backup, then run audit
        if (event.data.severity === 'critical') {
            await this.eventBus.triggerBackupRequired('Data integrity issue detected', {
                priority: 'high',
                tables: event.data.affectedTables
            });
        }
        
        const agentId = await this.spawnAgent('audit_agent', {
            operation: 'data_integrity_audit',
            event,
            priority: event.data.severity === 'critical' ? 'high' : 'medium'
        });
        
        return agentId;
    }

    /**
     * Spawn an agent to handle an operation
     */
    async spawnAgent(agentType, config) {
        const agentId = this.generateAgentId(agentType);
        const startTime = Date.now();
        
        try {
            console.log(`🎯 Spawning ${agentType} (${agentId})...`);
            
            // Acquire lock through coordinator
            const lockId = await this.coordinator.acquireGlobalLock(`agent-${agentId}`, 300000); // 5 minutes
            
            // Store agent info
            this.activeAgents.set(agentId, {
                type: agentType,
                config,
                startTime,
                lockId,
                status: 'running'
            });
            
            // Execute the operation
            const result = await this.executeAgentOperation(agentType, config);
            
            // Mark as completed
            const agent = this.activeAgents.get(agentId);
            agent.status = 'completed';
            agent.endTime = Date.now();
            agent.result = result;
            
            // Update stats
            this.updateStats(agent, true);
            
            console.log(`✅ Agent ${agentId} completed successfully`);
            
            return { agentId, result };
            
        } catch (error) {
            console.error(`❌ Agent ${agentId} failed:`, error);
            
            // Mark as failed
            const agent = this.activeAgents.get(agentId);
            if (agent) {
                agent.status = 'failed';
                agent.endTime = Date.now();
                agent.error = error.message;
                this.updateStats(agent, false);
            }
            
            throw error;
            
        } finally {
            // Clean up
            await this.cleanupAgent(agentId);
        }
    }

    /**
     * Execute the actual agent operation using extracted sub-agents
     */
    async executeAgentOperation(agentType, config) {
        const { operation, event } = config;
        
        // Check if agents are loaded, if not, wait for them or use fallback
        if (!this.agentsLoaded) {
            console.log('⏳ Waiting for agents to load...');
            await this.waitForAgentsToLoad();
        }
        
        switch (agentType) {
            case 'audit_agent':
                if (!this.auditAgent) throw new Error('AuditAgent not loaded');
                return await this.auditAgent.execute(operation, event);
                
            case 'optimization_agent':
                if (!this.optimizationAgent) throw new Error('OptimizationAgent not loaded');
                return await this.optimizationAgent.execute(operation, event);
                
            case 'maintenance_agent':
                if (!this.maintenanceAgent) throw new Error('MaintenanceAgent not loaded');
                return await this.maintenanceAgent.execute(operation, event);
                
            case 'backup_agent':
                if (!this.backupAgent) throw new Error('BackupAgent not loaded');
                return await this.backupAgent.execute(operation, event);
                
            case 'consolidation_agent':
                if (!this.consolidationAgent) throw new Error('ConsolidationAgent not loaded');
                return await this.consolidationAgent.execute(operation, event);
                
            case 'manual_agent':
                if (!this.manualAgent) throw new Error('ManualAgent not loaded');
                return await this.manualAgent.execute(operation, event);
                
            default:
                throw new Error(`Unknown agent type: ${agentType}`);
        }
    }

    /**
     * Wait for agents to load with timeout
     */
    async waitForAgentsToLoad(timeoutMs = 5000) {
        const startTime = Date.now();
        while (!this.agentsLoaded && (Date.now() - startTime) < timeoutMs) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        if (!this.agentsLoaded) {
            throw new Error('Timeout waiting for agents to load');
        }
    }






    /**
     * Perform basic health check
     */
    async performHealthCheck() {
        const health = {
            timestamp: new Date().toISOString(),
            coordinator: await this.coordinator.getStatus(),
            activeAgents: this.activeAgents.size,
            stats: this.agentStats
        };
        
        return health;
    }

    /**
     * Clean up agent resources
     */
    async cleanupAgent(agentId) {
        const agent = this.activeAgents.get(agentId);
        if (!agent) return;
        
        try {
            // Release lock
            if (agent.lockId) {
                await this.coordinator.releaseGlobalLock();
            }
            
            // Remove from active agents
            this.activeAgents.delete(agentId);
            
            console.log(`🧹 Cleaned up agent ${agentId}`);
            
        } catch (error) {
            console.error(`Error cleaning up agent ${agentId}:`, error);
        }
    }

    /**
     * Update agent statistics
     */
    updateStats(agent, success) {
        this.agentStats.totalActivations++;
        
        if (success) {
            this.agentStats.successfulOperations++;
        } else {
            this.agentStats.failedOperations++;
        }
        
        if (agent.endTime && agent.startTime) {
            const executionTime = agent.endTime - agent.startTime;
            const totalTime = this.agentStats.averageExecutionTime * (this.agentStats.totalActivations - 1);
            this.agentStats.averageExecutionTime = (totalTime + executionTime) / this.agentStats.totalActivations;
        }
    }

    /**
     * Wait for all active agents to complete
     */
    async waitForActiveAgents(timeout = 30000) {
        const startTime = Date.now();
        
        while (this.activeAgents.size > 0 && (Date.now() - startTime) < timeout) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        if (this.activeAgents.size > 0) {
            console.warn(`⚠️ ${this.activeAgents.size} agents still active after timeout`);
        }
    }

    /**
     * Generate unique agent ID
     */
    generateAgentId(agentType) {
        return `${agentType}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    }

    /**
     * Get manager status
     */
    getStatus() {
        return {
            activeAgents: this.activeAgents.size,
            agentStats: this.agentStats,
            activeAgentList: Array.from(this.activeAgents.entries()).map(([id, agent]) => ({
                id,
                type: agent.type,
                status: agent.status,
                operation: agent.config.operation,
                runtime: agent.endTime ? 
                    agent.endTime - agent.startTime : 
                    Date.now() - agent.startTime
            })),
            eventDetectorStatus: this.eventDetector.getStatus(),
            webhookServerStatus: this.webhookServer ? this.webhookServer.getStatus() : { isRunning: false, port: null, hasEventManager: false }
        };
    }

    /**
     * Manually trigger an operation (for testing/webhooks)
     */
    async manualTrigger(operation, data = {}) {
        console.log(`🔧 Manual trigger requested: ${operation}`);
        
        return await this.eventDetector.manualTrigger('manual_trigger', {
            operation,
            ...data,
            manual: true,
            triggeredAt: new Date().toISOString()
        });
    }
}

module.exports = EventDrivenAgentManager;