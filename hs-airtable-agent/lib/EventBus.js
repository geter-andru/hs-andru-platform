/**
 * Simple EventBus for AirtableManagementAgent
 * Basic event-driven architecture without external dependencies
 */

const EventEmitter = require('events');
const fs = require('fs').promises;
const path = require('path');

class EventBus extends EventEmitter {
    constructor(options = {}) {
        super();
        this.eventQueue = [];
        this.processing = false;
        this.maxQueueSize = options.maxQueueSize || 100;
        this.logPath = options.logPath || path.join(__dirname, '../logs/events.log');
        this.enableLogging = options.enableLogging !== false;
        
        // Event type definitions
        this.eventTypes = {
            PERFORMANCE_ISSUE: 'performance_issue',
            DATABASE_GROWTH: 'database_growth', 
            SCHEDULED_OPTIMIZATION: 'scheduled_optimization',
            MANUAL_TRIGGER: 'manual_trigger',
            BACKUP_REQUIRED: 'backup_required',
            FIELD_CONSOLIDATION_NEEDED: 'field_consolidation_needed',
            DATA_INTEGRITY_ISSUE: 'data_integrity_issue',
            OPTIMIZATION_COMPLETED: 'optimization_completed'
        };
        
        this.setupEventHandlers();
    }

    /**
     * Publish an event to the bus
     */
    async publish(eventType, data = {}, source = 'unknown') {
        const event = {
            id: this.generateEventId(),
            type: eventType,
            data,
            source,
            timestamp: new Date().toISOString(),
            processed: false
        };

        // Add to queue
        if (this.eventQueue.length >= this.maxQueueSize) {
            console.warn(`⚠️ Event queue full, dropping oldest event`);
            this.eventQueue.shift();
        }
        
        this.eventQueue.push(event);
        
        // Log event
        if (this.enableLogging) {
            await this.logEvent(event);
        }
        
        // Emit the event
        this.emit(eventType, event);
        this.emit('event', event);
        
        // Process queue if not already processing
        if (!this.processing) {
            this.processQueue();
        }
        
        return event.id;
    }

    /**
     * Subscribe to specific event type
     */
    subscribe(eventType, handler) {
        this.on(eventType, handler);
        console.log(`📢 Subscribed to ${eventType} events`);
    }

    /**
     * Subscribe to all events
     */
    subscribeAll(handler) {
        this.on('event', handler);
        console.log(`📢 Subscribed to all events`);
    }

    /**
     * Process event queue sequentially
     */
    async processQueue() {
        if (this.processing || this.eventQueue.length === 0) {
            return;
        }

        this.processing = true;
        
        try {
            while (this.eventQueue.length > 0) {
                const event = this.eventQueue.shift();
                
                if (!event.processed) {
                    console.log(`🔄 Processing event: ${event.type} (${event.id})`);
                    
                    try {
                        // Mark as processed
                        event.processed = true;
                        event.processedAt = new Date().toISOString();
                        
                        // Emit processed event for logging
                        this.emit('eventProcessed', event);
                        
                    } catch (error) {
                        console.error(`❌ Error processing event ${event.id}:`, error);
                        event.error = error.message;
                        this.emit('eventError', event, error);
                    }
                }
            }
        } finally {
            this.processing = false;
        }
    }

    /**
     * Get event queue status
     */
    getStatus() {
        return {
            queueLength: this.eventQueue.length,
            processing: this.processing,
            maxQueueSize: this.maxQueueSize,
            totalEvents: this.eventQueue.length,
            unprocessedEvents: this.eventQueue.filter(e => !e.processed).length
        };
    }

    /**
     * Get recent events
     */
    getRecentEvents(limit = 10) {
        return this.eventQueue
            .slice(-limit)
            .map(event => ({
                id: event.id,
                type: event.type,
                source: event.source,
                timestamp: event.timestamp,
                processed: event.processed,
                error: event.error
            }));
    }

    /**
     * Clear processed events from queue
     */
    cleanup() {
        const beforeCount = this.eventQueue.length;
        this.eventQueue = this.eventQueue.filter(event => !event.processed);
        const afterCount = this.eventQueue.length;
        const cleaned = beforeCount - afterCount;
        
        if (cleaned > 0) {
            console.log(`🧹 Cleaned up ${cleaned} processed events from queue`);
        }
        
        return cleaned;
    }

    /**
     * Setup default event handlers for debugging
     */
    setupEventHandlers() {
        this.on('eventProcessed', (event) => {
            console.log(`✅ Event processed: ${event.type} (${event.id})`);
        });

        this.on('eventError', (event, error) => {
            console.error(`❌ Event error: ${event.type} (${event.id}) - ${error.message}`);
        });
    }

    /**
     * Log event to file
     */
    async logEvent(event) {
        try {
            // Ensure log directory exists
            await fs.mkdir(path.dirname(this.logPath), { recursive: true });
            
            const logEntry = `${event.timestamp} | ${event.type} | ${event.source} | ${event.id} | ${JSON.stringify(event.data)}\n`;
            await fs.appendFile(this.logPath, logEntry);
        } catch (error) {
            console.error('Failed to log event:', error);
        }
    }

    /**
     * Generate unique event ID
     */
    generateEventId() {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Trigger performance issue event
     */
    async triggerPerformanceIssue(metrics) {
        return await this.publish(this.eventTypes.PERFORMANCE_ISSUE, {
            metrics,
            threshold: 'exceeded',
            severity: this.calculateSeverity(metrics)
        }, 'performance_monitor');
    }

    /**
     * Trigger database growth event
     */
    async triggerDatabaseGrowth(changes) {
        return await this.publish(this.eventTypes.DATABASE_GROWTH, {
            changes,
            tables: changes.tables || [],
            fields: changes.fields || []
        }, 'database_monitor');
    }

    /**
     * Trigger scheduled optimization event
     */
    async triggerScheduledOptimization(schedule) {
        return await this.publish(this.eventTypes.SCHEDULED_OPTIMIZATION, {
            schedule,
            type: schedule.type || 'daily',
            operations: schedule.operations || ['audit', 'optimize']
        }, 'scheduler');
    }

    /**
     * Trigger manual operation event
     */
    async triggerManualOperation(operation, data = {}) {
        return await this.publish(this.eventTypes.MANUAL_TRIGGER, {
            operation,
            ...data,
            manual: true
        }, 'manual_trigger');
    }

    /**
     * Trigger backup required event
     */
    async triggerBackupRequired(reason, data = {}) {
        return await this.publish(this.eventTypes.BACKUP_REQUIRED, {
            reason,
            priority: data.priority || 'medium',
            tables: data.tables || [],
            ...data
        }, 'backup_trigger');
    }

    /**
     * Trigger field consolidation needed event
     */
    async triggerFieldConsolidationNeeded(analysis, data = {}) {
        return await this.publish(this.eventTypes.FIELD_CONSOLIDATION_NEEDED, {
            analysis,
            opportunities: data.opportunities || 0,
            potentialSavings: data.potentialSavings || {},
            ...data
        }, 'field_consolidation_trigger');
    }

    /**
     * Trigger data integrity issue event
     */
    async triggerDataIntegrityIssue(issue, data = {}) {
        return await this.publish(this.eventTypes.DATA_INTEGRITY_ISSUE, {
            issue,
            severity: data.severity || 'medium',
            affectedTables: data.affectedTables || [],
            ...data
        }, 'data_integrity_monitor');
    }

    /**
     * Calculate severity based on performance metrics
     */
    calculateSeverity(metrics) {
        if (metrics.errorRate > 0.1 || metrics.responseTime > 5000) {
            return 'critical';
        } else if (metrics.errorRate > 0.05 || metrics.responseTime > 3000) {
            return 'high';
        } else {
            return 'medium';
        }
    }
}

module.exports = EventBus;