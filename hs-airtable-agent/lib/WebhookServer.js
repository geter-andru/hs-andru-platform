/**
 * Simple Webhook Server for Event-Driven Agent Triggers
 * Provides HTTP endpoints for external systems to trigger agent operations
 */

const express = require('express');
const bodyParser = require('body-parser');

class WebhookServer {
    constructor(options = {}) {
        this.port = options.port || 3001;
        this.eventManager = options.eventManager;
        this.app = express();
        this.server = null;
        this.isRunning = false;
        
        this.setupMiddleware();
        this.setupRoutes();
    }

    /**
     * Setup Express middleware
     */
    setupMiddleware() {
        // Parse JSON bodies
        this.app.use(bodyParser.json({ limit: '10mb' }));
        
        // Parse URL-encoded bodies
        this.app.use(bodyParser.urlencoded({ extended: true }));
        
        // Simple logging
        this.app.use((req, res, next) => {
            console.log(`🌐 ${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });
        
        // CORS headers for external access
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            
            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
            } else {
                next();
            }
        });
    }

    /**
     * Setup webhook routes
     */
    setupRoutes() {
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                eventManager: !!this.eventManager
            });
        });

        // Generic trigger endpoint
        this.app.post('/trigger/:operation', async (req, res) => {
            try {
                const { operation } = req.params;
                const data = req.body || {};
                
                console.log(`🔗 Webhook trigger: ${operation}`);
                
                if (!this.eventManager) {
                    return res.status(500).json({
                        error: 'Event manager not available',
                        operation
                    });
                }
                
                const eventId = await this.eventManager.manualTrigger(operation, {
                    ...data,
                    source: 'webhook',
                    timestamp: new Date().toISOString(),
                    userAgent: req.get('User-Agent'),
                    ip: req.ip
                });
                
                res.json({
                    success: true,
                    operation,
                    eventId,
                    timestamp: new Date().toISOString()
                });
                
            } catch (error) {
                console.error(`❌ Webhook error:`, error);
                res.status(500).json({
                    error: error.message,
                    operation: req.params.operation,
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Performance monitoring webhook
        this.app.post('/monitoring/performance', async (req, res) => {
            try {
                const { metrics, severity } = req.body;
                
                if (!this.eventManager) {
                    return res.status(500).json({ error: 'Event manager not available' });
                }
                
                const eventId = await this.eventManager.eventBus.triggerPerformanceIssue({
                    ...metrics,
                    severity: severity || 'medium',
                    source: 'external_monitoring'
                });
                
                res.json({
                    success: true,
                    eventId,
                    message: 'Performance monitoring event triggered'
                });
                
            } catch (error) {
                console.error(`❌ Performance monitoring webhook error:`, error);
                res.status(500).json({ error: error.message });
            }
        });

        // Database monitoring webhook
        this.app.post('/monitoring/database', async (req, res) => {
            try {
                const { changes, tables } = req.body;
                
                if (!this.eventManager) {
                    return res.status(500).json({ error: 'Event manager not available' });
                }
                
                const eventId = await this.eventManager.eventBus.triggerDatabaseGrowth({
                    changes: changes || {},
                    tables: tables || [],
                    hasSignificantChanges: true,
                    source: 'external_monitoring'
                });
                
                res.json({
                    success: true,
                    eventId,
                    message: 'Database monitoring event triggered'
                });
                
            } catch (error) {
                console.error(`❌ Database monitoring webhook error:`, error);
                res.status(500).json({ error: error.message });
            }
        });

        // Backup request webhook
        this.app.post('/operations/backup', async (req, res) => {
            try {
                const { reason, priority, tables } = req.body;
                
                if (!this.eventManager) {
                    return res.status(500).json({ error: 'Event manager not available' });
                }
                
                const eventId = await this.eventManager.eventBus.triggerBackupRequired(
                    reason || 'External backup request',
                    {
                        priority: priority || 'medium',
                        tables: tables || [],
                        source: 'webhook_request'
                    }
                );
                
                res.json({
                    success: true,
                    eventId,
                    message: 'Backup operation triggered'
                });
                
            } catch (error) {
                console.error(`❌ Backup webhook error:`, error);
                res.status(500).json({ error: error.message });
            }
        });

        // Field consolidation request webhook
        this.app.post('/operations/consolidate', async (req, res) => {
            try {
                const { analysis, opportunities } = req.body;
                
                if (!this.eventManager) {
                    return res.status(500).json({ error: 'Event manager not available' });
                }
                
                const eventId = await this.eventManager.eventBus.triggerFieldConsolidationNeeded(
                    analysis || 'External consolidation request',
                    {
                        opportunities: opportunities || 0,
                        source: 'webhook_request'
                    }
                );
                
                res.json({
                    success: true,
                    eventId,
                    message: 'Field consolidation operation triggered'
                });
                
            } catch (error) {
                console.error(`❌ Consolidation webhook error:`, error);
                res.status(500).json({ error: error.message });
            }
        });

        // Agent status endpoint
        this.app.get('/status', async (req, res) => {
            try {
                if (!this.eventManager) {
                    return res.status(500).json({ error: 'Event manager not available' });
                }
                
                const status = this.eventManager.getStatus();
                
                res.json({
                    success: true,
                    status,
                    timestamp: new Date().toISOString()
                });
                
            } catch (error) {
                console.error(`❌ Status endpoint error:`, error);
                res.status(500).json({ error: error.message });
            }
        });

        // Event history endpoint
        this.app.get('/events/recent', async (req, res) => {
            try {
                const limit = parseInt(req.query.limit) || 10;
                
                if (!this.eventManager) {
                    return res.status(500).json({ error: 'Event manager not available' });
                }
                
                const events = this.eventManager.eventBus.getRecentEvents(limit);
                
                res.json({
                    success: true,
                    events,
                    count: events.length,
                    timestamp: new Date().toISOString()
                });
                
            } catch (error) {
                console.error(`❌ Events endpoint error:`, error);
                res.status(500).json({ error: error.message });
            }
        });

        // Catch-all for undefined routes
        this.app.all('*', (req, res) => {
            res.status(404).json({
                error: 'Endpoint not found',
                path: req.path,
                method: req.method,
                availableEndpoints: [
                    'GET /health',
                    'POST /trigger/[operation]',
                    'POST /monitoring/performance',
                    'POST /monitoring/database',
                    'POST /operations/backup',
                    'POST /operations/consolidate',
                    'GET /status',
                    'GET /events/recent'
                ]
            });
        });
    }

    /**
     * Start the webhook server
     */
    async start() {
        if (this.isRunning) {
            console.log('⚠️ Webhook server already running');
            return;
        }

        return new Promise((resolve, reject) => {
            this.server = this.app.listen(this.port, (err) => {
                if (err) {
                    reject(err);
                } else {
                    this.isRunning = true;
                    console.log(`🌐 Webhook server started on port ${this.port}`);
                    console.log(`📡 Available endpoints:`);
                    console.log(`   POST http://localhost:${this.port}/trigger/:operation`);
                    console.log(`   POST http://localhost:${this.port}/monitoring/performance`);
                    console.log(`   POST http://localhost:${this.port}/monitoring/database`);
                    console.log(`   POST http://localhost:${this.port}/operations/backup`);
                    console.log(`   POST http://localhost:${this.port}/operations/consolidate`);
                    console.log(`   GET  http://localhost:${this.port}/status`);
                    console.log(`   GET  http://localhost:${this.port}/events/recent`);
                    console.log(`   GET  http://localhost:${this.port}/health`);
                    resolve();
                }
            });
        });
    }

    /**
     * Stop the webhook server
     */
    async stop() {
        if (!this.isRunning) {
            console.log('⚠️ Webhook server not running');
            return;
        }

        return new Promise((resolve) => {
            this.server.close(() => {
                this.isRunning = false;
                console.log('🌐 Webhook server stopped');
                resolve();
            });
        });
    }

    /**
     * Get server status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            port: this.port,
            hasEventManager: !!this.eventManager
        };
    }
}

module.exports = WebhookServer;