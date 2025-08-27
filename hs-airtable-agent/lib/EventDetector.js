/**
 * Event Detection System for AirtableManagementAgent
 * Monitors performance, database changes, and schedules to trigger agent operations
 */

const EventBus = require('./EventBus');
const cron = require('node-cron');

class EventDetector {
    constructor(options = {}) {
        this.eventBus = options.eventBus || new EventBus();
        this.airtableClient = options.airtableClient;
        this.monitoring = false;
        this.isActive = false;
        
        // Event-driven activation tracking
        this.eventTriggers = {
          performanceCheck: false,
          databaseCheck: false,
          scheduledOperation: false,
          manualTrigger: false
        };
        
        this.activationHistory = [];
        this.detectionStats = {
          totalActivations: 0,
          averageActiveTime: 0,
          eventsDetected: 0
        };
        
        // Performance thresholds
        this.thresholds = {
            responseTime: options.responseTimeThreshold || 3000, // 3 seconds
            errorRate: options.errorRateThreshold || 0.05,      // 5%
            memoryUsage: options.memoryThreshold || 0.8,        // 80%
            diskUsage: options.diskThreshold || 0.9             // 90%
        };
        
        // Database monitoring settings
        this.databaseMonitoring = {
            checkInterval: options.dbCheckInterval || 300000,    // 5 minutes
            lastTableCount: new Map(),
            lastFieldCount: new Map(),
            growthThreshold: options.growthThreshold || 0.1      // 10% growth
        };
        
        // Scheduled operations
        this.schedules = {
            dailyHealthCheck: '0 9 * * *',    // 9 AM daily
            weeklyOptimization: '0 2 * * 1',  // 2 AM Mondays
            monthlyAudit: '0 3 1 * *'         // 3 AM 1st of month
        };
        
        this.activeIntervals = new Map();
        this.scheduledJobs = new Map();
    }

    /**
     * Start monitoring for events
     */
    start() {
        if (this.monitoring) {
            console.log('⚠️ Event detector already running');
            return;
        }

        this.monitoring = true;
        console.log('🔍 Starting event detection...');
        
        // Start performance monitoring
        this.startPerformanceMonitoring();
        
        // Start database monitoring
        this.startDatabaseMonitoring();
        
        // Start scheduled operations
        this.startScheduledOperations();
        
        console.log('✅ Event detection started');
    }

    /**
     * Stop monitoring
     */
    stop() {
        if (!this.monitoring) {
            return;
        }

        this.monitoring = false;
        console.log('🛑 Stopping event detection...');
        
        // Clear all intervals
        this.activeIntervals.forEach((interval, name) => {
            clearInterval(interval);
            console.log(`⏹️ Stopped ${name} monitoring`);
        });
        this.activeIntervals.clear();
        
        // Clear all scheduled jobs
        this.scheduledJobs.forEach((job, name) => {
            job.stop();
            console.log(`⏹️ Stopped ${name} schedule`);
        });
        this.scheduledJobs.clear();
        
        console.log('✅ Event detection stopped');
    }

    /**
     * Start performance monitoring
     */
    startPerformanceMonitoring() {
        const performanceCheck = async () => {
            try {
                const metrics = await this.collectPerformanceMetrics();
                
                // Check thresholds
                if (this.shouldTriggerPerformanceEvent(metrics)) {
                    console.log(`🚨 Performance threshold exceeded:`, metrics);
                    await this.eventBus.triggerPerformanceIssue(metrics);
                }
                
            } catch (error) {
                console.error('Error in performance monitoring:', error);
            }
        };

        // Check every 30 seconds
        const interval = setInterval(performanceCheck, 30000);
        this.activeIntervals.set('performance', interval);
        
        console.log('📊 Performance monitoring started');
    }

    /**
     * Start database monitoring
     */
    startDatabaseMonitoring() {
        const databaseCheck = async () => {
            try {
                if (!this.airtableClient) {
                    return;
                }

                const changes = await this.detectDatabaseChanges();
                
                if (changes.hasSignificantChanges) {
                    console.log(`📈 Database growth detected:`, changes);
                    await this.eventBus.triggerDatabaseGrowth(changes);
                }
                
            } catch (error) {
                console.error('Error in database monitoring:', error);
            }
        };

        // Check every 5 minutes
        const interval = setInterval(databaseCheck, this.databaseMonitoring.checkInterval);
        this.activeIntervals.set('database', interval);
        
        console.log('🗄️ Database monitoring started');
    }

    /**
     * Start scheduled operations
     */
    startScheduledOperations() {
        // Daily health check
        const dailyJob = cron.schedule(this.schedules.dailyHealthCheck, async () => {
            console.log('📅 Triggering daily health check');
            await this.eventBus.triggerScheduledOptimization({
                type: 'daily',
                operations: ['audit', 'health_check']
            });
        }, { scheduled: false });
        
        // Weekly optimization
        const weeklyJob = cron.schedule(this.schedules.weeklyOptimization, async () => {
            console.log('📅 Triggering weekly optimization');
            await this.eventBus.triggerScheduledOptimization({
                type: 'weekly',
                operations: ['optimize', 'consolidate_fields']
            });
        }, { scheduled: false });
        
        // Monthly audit
        const monthlyJob = cron.schedule(this.schedules.monthlyAudit, async () => {
            console.log('📅 Triggering monthly audit');
            await this.eventBus.triggerScheduledOptimization({
                type: 'monthly',
                operations: ['audit', 'optimize', 'backup']
            });
        }, { scheduled: false });

        // Start all jobs
        dailyJob.start();
        weeklyJob.start();
        monthlyJob.start();
        
        this.scheduledJobs.set('daily', dailyJob);
        this.scheduledJobs.set('weekly', weeklyJob);
        this.scheduledJobs.set('monthly', monthlyJob);
        
        console.log('⏰ Scheduled operations started');
    }

    /**
     * Collect current performance metrics
     */
    async collectPerformanceMetrics() {
        const memoryUsage = process.memoryUsage();
        const memoryTotal = memoryUsage.heapTotal;
        const memoryUsed = memoryUsage.heapUsed;
        
        return {
            responseTime: await this.measureResponseTime(),
            errorRate: await this.calculateErrorRate(),
            memoryUsage: memoryUsed / memoryTotal,
            memoryUsedMB: Math.round(memoryUsed / 1024 / 1024),
            memoryTotalMB: Math.round(memoryTotal / 1024 / 1024),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Check if performance metrics exceed thresholds
     */
    shouldTriggerPerformanceEvent(metrics) {
        return (
            metrics.responseTime > this.thresholds.responseTime ||
            metrics.errorRate > this.thresholds.errorRate ||
            metrics.memoryUsage > this.thresholds.memoryUsage
        );
    }

    /**
     * Detect significant database changes
     */
    async detectDatabaseChanges() {
        if (!this.airtableClient) {
            return { hasSignificantChanges: false };
        }

        try {
            // Get current table and field counts
            const currentCounts = await this.getCurrentDatabaseCounts();
            const changes = {
                tables: [],
                fields: [],
                hasSignificantChanges: false
            };

            // Check for table count changes
            for (const [tableName, currentCount] of currentCounts.tables) {
                const lastCount = this.databaseMonitoring.lastTableCount.get(tableName) || 0;
                const growthRate = lastCount > 0 ? (currentCount - lastCount) / lastCount : 0;
                
                if (growthRate > this.databaseMonitoring.growthThreshold) {
                    changes.tables.push({
                        table: tableName,
                        previousCount: lastCount,
                        currentCount,
                        growthRate: Math.round(growthRate * 100)
                    });
                    changes.hasSignificantChanges = true;
                }
                
                this.databaseMonitoring.lastTableCount.set(tableName, currentCount);
            }

            // Check for field count changes
            for (const [tableField, currentCount] of currentCounts.fields) {
                const lastCount = this.databaseMonitoring.lastFieldCount.get(tableField) || 0;
                const growthRate = lastCount > 0 ? (currentCount - lastCount) / lastCount : 0;
                
                if (growthRate > this.databaseMonitoring.growthThreshold) {
                    changes.fields.push({
                        tableField,
                        previousCount: lastCount,
                        currentCount,
                        growthRate: Math.round(growthRate * 100)
                    });
                    changes.hasSignificantChanges = true;
                }
                
                this.databaseMonitoring.lastFieldCount.set(tableField, currentCount);
            }

            return changes;
            
        } catch (error) {
            console.error('Error detecting database changes:', error);
            return { hasSignificantChanges: false, error: error.message };
        }
    }

    /**
     * Get current database counts (simplified simulation)
     */
    async getCurrentDatabaseCounts() {
        // In a real implementation, this would query Airtable
        // For now, return simulated counts
        const tables = new Map([
            ['Customer Assets', 150],
            ['AI Resource Generations', 245],
            ['Customer Actions', 89]
        ]);
        
        const fields = new Map([
            ['Customer Assets.fields', 32],
            ['AI Resource Generations.fields', 18],
            ['Customer Actions.fields', 12]
        ]);
        
        return { tables, fields };
    }

    /**
     * Measure response time (simplified)
     */
    async measureResponseTime() {
        const start = Date.now();
        
        // Simulate a quick operation
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
        
        return Date.now() - start;
    }

    /**
     * Calculate error rate (simplified)
     */
    async calculateErrorRate() {
        // Simulate error rate calculation
        return Math.random() * 0.1; // 0-10% error rate
    }

    /**
     * Manually trigger an event (for testing/webhooks)
     */
    async manualTrigger(eventType, data = {}) {
        console.log(`🔧 Manual trigger: ${eventType}`);
        
        switch (eventType) {
            case 'performance_issue':
                return await this.eventBus.triggerPerformanceIssue(data);
            case 'database_growth':
                return await this.eventBus.triggerDatabaseGrowth(data);
            case 'scheduled_optimization':
                return await this.eventBus.triggerScheduledOptimization(data);
            default:
                return await this.eventBus.triggerManualOperation(eventType, data);
        }
    }

    /**
     * Get detector status
     */
    getStatus() {
        return {
            monitoring: this.monitoring,
            activeIntervals: Array.from(this.activeIntervals.keys()),
            scheduledJobs: Array.from(this.scheduledJobs.keys()),
            thresholds: this.thresholds,
            eventBusStatus: this.eventBus.getStatus()
        };
    }
}

module.exports = EventDetector;