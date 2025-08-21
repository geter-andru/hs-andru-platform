/**
 * Event-Driven Agent Manager
 * Spawns and manages AirtableManagementAgent operations based on events
 */

const EventBus = require('./EventBus');
const EventDetector = require('./EventDetector');
const WebhookServer = require('./WebhookServer');
const AgentCoordinator = require('./AgentCoordinator');
const agentConfig = require('../config/agent.config');

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
        
        this.activeAgents = new Map();
        this.agentStats = {
            totalActivations: 0,
            successfulOperations: 0,
            failedOperations: 0,
            averageExecutionTime: 0
        };
        
        this.setupEventHandlers();
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
     * Execute the actual agent operation
     */
    async executeAgentOperation(agentType, config) {
        const { operation, event } = config;
        
        switch (agentType) {
            case 'audit_agent':
                return await this.executeAuditOperation(operation, event);
                
            case 'optimization_agent':
                return await this.executeOptimizationOperation(operation, event);
                
            case 'maintenance_agent':
                return await this.executeMaintenanceOperation(operation, event);
                
            case 'backup_agent':
                return await this.executeBackupOperation(operation, event);
                
            case 'consolidation_agent':
                return await this.executeConsolidationOperation(operation, event);
                
            case 'manual_agent':
                return await this.executeManualOperation(operation, event);
                
            default:
                throw new Error(`Unknown agent type: ${agentType}`);
        }
    }

    /**
     * Execute audit operations
     */
    async executeAuditOperation(operation, event) {
        if (!this.auditEngine) {
            throw new Error('AuditEngine not available');
        }
        
        switch (operation) {
            case 'performance_audit':
                console.log('🔍 Running performance audit...');
                return await this.auditEngine.performComprehensiveAudit();
                
            default:
                console.log('🔍 Running general audit...');
                return await this.auditEngine.performComprehensiveAudit();
        }
    }

    /**
     * Execute optimization operations
     */
    async executeOptimizationOperation(operation, event) {
        if (!this.optimizationEngine) {
            throw new Error('OptimizationEngine not available');
        }
        
        // First get audit results, then run optimization
        console.log('⚡ Running optimization analysis...');
        
        let auditResults;
        if (this.auditEngine) {
            auditResults = await this.auditEngine.performComprehensiveAudit();
        }
        
        return await this.optimizationEngine.analyzeOptimizationOpportunities(auditResults);
    }

    /**
     * Execute maintenance operations
     */
    async executeMaintenanceOperation(operation, event) {
        const operations = event.data.operations || ['audit'];
        const results = {};
        
        console.log(`🔧 Running maintenance operations: ${operations.join(', ')}`);
        
        for (const op of operations) {
            try {
                switch (op) {
                    case 'audit':
                        if (this.auditEngine) {
                            results.audit = await this.auditEngine.performComprehensiveAudit();
                        }
                        break;
                        
                    case 'optimize':
                        if (this.optimizationEngine && this.auditEngine) {
                            const auditResults = await this.auditEngine.performComprehensiveAudit();
                            results.optimize = await this.optimizationEngine.analyzeOptimizationOpportunities(auditResults);
                        }
                        break;
                        
                    case 'health_check':
                        results.health_check = await this.performHealthCheck();
                        break;
                        
                    case 'backup':
                        if (this.backupEngine) {
                            results.backup = await this.backupEngine.createComprehensiveBackup({
                                reason: 'Scheduled maintenance backup'
                            });
                        }
                        break;
                        
                    case 'consolidate_fields':
                        if (this.fieldConsolidationEngine) {
                            results.consolidate_fields = await this.fieldConsolidationEngine.analyzeFieldConsolidation();
                        }
                        break;
                        
                    default:
                        console.warn(`Unknown maintenance operation: ${op}`);
                }
            } catch (error) {
                console.error(`Error in ${op}:`, error);
                results[op] = { error: error.message };
            }
        }
        
        return results;
    }

    /**
     * Execute manual operations
     */
    async executeManualOperation(operation, event) {
        console.log(`🔧 Running manual operation: ${operation}`);
        
        // Route to appropriate engine based on operation
        if (operation.includes('audit') && this.auditEngine) {
            return await this.auditEngine.performComprehensiveAudit();
        } else if (operation.includes('optimize') && this.optimizationEngine && this.auditEngine) {
            const auditResults = await this.auditEngine.performComprehensiveAudit();
            return await this.optimizationEngine.analyzeOptimizationOpportunities(auditResults);
        } else if (operation.includes('backup') && this.backupEngine) {
            return await this.backupEngine.createComprehensiveBackup({
                reason: `Manual backup: ${operation}`,
                tables: event.data.tables || []
            });
        } else if ((operation.includes('consolidate') || operation.includes('field')) && this.fieldConsolidationEngine) {
            return await this.fieldConsolidationEngine.analyzeFieldConsolidation();
        } else {
            return { 
                operation, 
                result: 'Manual operation executed',
                data: event.data 
            };
        }
    }

    /**
     * Execute backup operations
     */
    async executeBackupOperation(operation, event) {
        if (!this.backupEngine) {
            throw new Error('BackupEngine not available');
        }
        
        switch (operation) {
            case 'full_backup':
                console.log('💾 Creating full backup...');
                return await this.backupEngine.createFullBackup({
                    message: 'Event-triggered full backup',
                    tables: event.data.tables || []
                });
                
            case 'incremental_backup':
                console.log('💾 Creating incremental backup...');
                return await this.backupEngine.createIncrementalBackup(
                    Date.now() - (24 * 60 * 60 * 1000) // 24 hours ago
                );
                
            case 'safety_backup':
            case 'comprehensive_backup':
                console.log('💾 Creating comprehensive backup...');
                return await this.backupEngine.createComprehensiveBackup({
                    reason: event.data.reason || 'Event-triggered safety backup',
                    tables: event.data.tables || []
                });
                
            default:
                console.log('💾 Creating comprehensive backup...');
                return await this.backupEngine.createComprehensiveBackup({
                    reason: 'Event-triggered backup'
                });
        }
    }

    /**
     * Execute field consolidation operations
     */
    async executeConsolidationOperation(operation, event) {
        if (!this.fieldConsolidationEngine) {
            throw new Error('FieldConsolidationEngine not available');
        }
        
        switch (operation) {
            case 'analyze_fields':
                console.log('🔍 Analyzing field consolidation opportunities...');
                return await this.fieldConsolidationEngine.analyzeFieldConsolidation();
                
            case 'consolidate_fields':
                if (!this.safeFieldConsolidator) {
                    throw new Error('SafeFieldConsolidator not available');
                }
                console.log('🔧 Performing safe field consolidation...');
                return await this.safeFieldConsolidator.performConsolidation({
                    dryRun: event.data.dryRun !== false, // Default to dry run
                    maxOperations: event.data.maxOperations || 10,
                    backupFirst: event.data.backupFirst !== false
                });
                
            case 'field_similarity_analysis':
                console.log('🔍 Analyzing field similarities...');
                return await this.fieldConsolidationEngine.findSimilarFields();
                
            default:
                console.log('🔍 Running field analysis...');
                return await this.fieldConsolidationEngine.analyzeFieldConsolidation();
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