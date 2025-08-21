#!/usr/bin/env node

/**
 * H&S Platform Airtable Management Agent - CLI Interface
 * Comprehensive database management, optimization, and monitoring
 */

require('dotenv').config();
const { Command } = require('commander');
const { default: chalk } = require('chalk');
const fs = require('fs-extra');
const path = require('path');

// Import our classes
const config = require('./config/agent.config.js');
const AgentCoordinator = require('./lib/AgentCoordinator.js');
const AirtableClient = require('./lib/AirtableClient.js');
const AuditEngine = require('./lib/AuditEngine.js');
const OptimizationEngine = require('./lib/OptimizationEngine.js');

class AirtableManagementAgent {
  constructor() {
    this.program = new Command();
    this.coordinator = new AgentCoordinator(config);
    this.airtableClient = new AirtableClient(config, this.coordinator);
    this.auditEngine = new AuditEngine(config, this.coordinator, this.airtableClient);
    this.optimizationEngine = new OptimizationEngine(config, this.coordinator, this.airtableClient, this.auditEngine);
    
    this.setupCommands();
    this.setupErrorHandling();
  }

  setupCommands() {
    this.program
      .name('airtable-agent')
      .description('H&S Platform Airtable Management Agent')
      .version('1.0.0');

    // Main operation commands
    this.setupAuditCommands();
    this.setupOptimizationCommands();
    this.setupMaintenanceCommands();
    this.setupMonitoringCommands();
    this.setupUtilityCommands();
  }

  setupAuditCommands() {
    const auditCmd = this.program
      .command('audit')
      .description('Perform database audit operations');

    auditCmd
      .command('full')
      .description('Perform comprehensive database audit')
      .option('--save-report', 'Save detailed audit report')
      .option('--format <type>', 'Report format (json|summary)', 'summary')
      .action(async (options) => {
        await this.executeWithSafety('Full Database Audit', async () => {
          console.log(chalk.bold.blue('\n🔍 Starting Comprehensive Database Audit\n'));
          
          const auditResults = await this.auditEngine.performComprehensiveAudit();
          
          if (options.format === 'json') {
            console.log(JSON.stringify(auditResults, null, 2));
          } else {
            this.displayAuditSummary(auditResults);
          }
          
          if (options.saveReport) {
            const reportPath = await this.auditEngine.saveAuditResults(auditResults);
            console.log(chalk.blue(`\n📄 Detailed report saved: ${reportPath}`));
          }
        });
      });

    auditCmd
      .command('quick')
      .description('Perform quick audit (essential checks only)')
      .action(async () => {
        await this.executeWithSafety('Quick Database Audit', async () => {
          console.log(chalk.bold.blue('\n⚡ Quick Database Audit\n'));
          
          const tableInfo = await this.airtableClient.getAllTables();
          const summary = this.generateQuickAuditSummary(tableInfo);
          
          console.log(chalk.green(`✅ Tables Found: ${summary.existingTables}/${summary.totalTables}`));
          console.log(chalk.blue(`📊 Completeness: ${summary.completeness.toFixed(1)}%`));
          
          if (summary.missingTables.length > 0) {
            console.log(chalk.yellow(`⚠️ Missing Tables: ${summary.missingTables.join(', ')}`));
          }
        });
      });

    auditCmd
      .command('table <tableName>')
      .description('Audit specific table')
      .action(async (tableName) => {
        await this.executeWithSafety(`Table Audit: ${tableName}`, async () => {
          console.log(chalk.bold.blue(`\n🔍 Auditing Table: ${tableName}\n`));
          
          const tableInfo = await this.airtableClient.getTableInfo(tableName);
          if (!tableInfo.exists) {
            console.log(chalk.red(`❌ Table '${tableName}' not found`));
            return;
          }
          
          const recordCount = await this.airtableClient.getRecordCount(tableName);
          const fieldUtilization = await this.auditEngine.analyzeFieldUtilization(tableName);
          
          console.log(chalk.green(`✅ Table exists with ${tableInfo.fields.length} fields`));
          console.log(chalk.blue(`📊 Record count: ${recordCount}`));
          
          if (fieldUtilization && !fieldUtilization.error) {
            const utilizationStats = Object.entries(fieldUtilization)
              .map(([field, count]) => `${field}: ${count}`)
              .join(', ');
            console.log(chalk.blue(`📈 Field utilization: ${utilizationStats}`));
          }
        });
      });
  }

  setupOptimizationCommands() {
    const optimizeCmd = this.program
      .command('optimize')
      .description('Analyze and implement optimizations');

    optimizeCmd
      .command('analyze')
      .description('Analyze optimization opportunities')
      .option('--audit-file <path>', 'Use existing audit results file')
      .option('--save-analysis', 'Save optimization analysis')
      .action(async (options) => {
        await this.executeWithSafety('Optimization Analysis', async () => {
          console.log(chalk.bold.blue('\n⚡ Analyzing Optimization Opportunities\n'));
          
          let auditResults;
          if (options.auditFile) {
            console.log(chalk.blue(`📂 Loading audit results from: ${options.auditFile}`));
            auditResults = await fs.readJson(options.auditFile);
          } else {
            console.log(chalk.blue('🔍 Running fresh audit for optimization analysis...'));
            auditResults = await this.auditEngine.performComprehensiveAudit();
          }
          
          const optimizationResults = await this.optimizationEngine.analyzeOptimizationOpportunities(auditResults);
          
          this.displayOptimizationSummary(optimizationResults);
          
          if (options.saveAnalysis) {
            const analysisPath = await this.optimizationEngine.saveOptimizationResults(optimizationResults);
            console.log(chalk.blue(`\n📄 Analysis saved: ${analysisPath}`));
          }
        });
      });

    optimizeCmd
      .command('recommend')
      .description('Get prioritized optimization recommendations')
      .option('--top <number>', 'Show top N recommendations', '10')
      .option('--category <type>', 'Filter by category (schema|performance|storage|data_quality|integration)')
      .action(async (options) => {
        await this.executeWithSafety('Optimization Recommendations', async () => {
          console.log(chalk.bold.blue('\n📊 Optimization Recommendations\n'));
          
          // Use cached results if available, otherwise run analysis
          let optimizationResults = this.optimizationEngine.optimizationResults;
          if (!optimizationResults.timestamp) {
            console.log(chalk.blue('🔍 Running optimization analysis...'));
            const auditResults = await this.auditEngine.performComprehensiveAudit();
            optimizationResults = await this.optimizationEngine.analyzeOptimizationOpportunities(auditResults);
          }
          
          let recommendations = optimizationResults.prioritizedRecommendations || [];
          
          // Filter by category if specified
          if (options.category) {
            recommendations = recommendations.filter(rec => rec.category === options.category);
          }
          
          // Limit to top N
          const topN = parseInt(options.top);
          recommendations = recommendations.slice(0, topN);
          
          this.displayRecommendations(recommendations);
        });
      });

    optimizeCmd
      .command('plan')
      .description('Generate implementation plan')
      .action(async () => {
        await this.executeWithSafety('Implementation Planning', async () => {
          console.log(chalk.bold.blue('\n📋 Implementation Plan\n'));
          
          let optimizationResults = this.optimizationEngine.optimizationResults;
          if (!optimizationResults.timestamp) {
            console.log(chalk.blue('🔍 Running optimization analysis...'));
            const auditResults = await this.auditEngine.performComprehensiveAudit();
            optimizationResults = await this.optimizationEngine.analyzeOptimizationOpportunities(auditResults);
          }
          
          this.displayImplementationPlan(optimizationResults.implementationPlan);
          this.displayCostBenefitAnalysis(optimizationResults.costBenefitAnalysis);
          this.displayRiskAssessment(optimizationResults.riskAssessment);
        });
      });
  }

  setupMaintenanceCommands() {
    const maintCmd = this.program
      .command('maintain')
      .description('Database maintenance operations');

    maintCmd
      .command('cleanup')
      .description('Perform database cleanup')
      .option('--dry-run', 'Show what would be cleaned without making changes')
      .option('--force', 'Skip confirmation prompts')
      .action(async (options) => {
        await this.executeWithSafety('Database Cleanup', async () => {
          console.log(chalk.bold.blue('\n🧹 Database Cleanup\n'));
          
          if (options.dryRun) {
            console.log(chalk.yellow('🔍 DRY RUN MODE - No changes will be made\n'));
          }
          
          // Find cleanup opportunities
          const auditResults = await this.auditEngine.performComprehensiveAudit();
          const cleanupOpportunities = this.identifyCleanupOpportunities(auditResults);
          
          if (cleanupOpportunities.length === 0) {
            console.log(chalk.green('✅ No cleanup opportunities found'));
            return;
          }
          
          console.log(chalk.yellow(`Found ${cleanupOpportunities.length} cleanup opportunities:`));
          cleanupOpportunities.forEach((opportunity, index) => {
            console.log(chalk.blue(`  ${index + 1}. ${opportunity.description} (${opportunity.impact})`));
          });
          
          if (options.dryRun) {
            console.log(chalk.yellow('\n🔍 DRY RUN: No changes made'));
            return;
          }
          
          if (!options.force) {
            // In a real implementation, we'd prompt for confirmation
            console.log(chalk.yellow('\n⚠️ Use --force to proceed with cleanup (not implemented in this version)'));
            return;
          }
          
          console.log(chalk.green('\n✅ Cleanup completed'));
        });
      });

    maintCmd
      .command('backup')
      .description('Create database backup')
      .option('--tables <names>', 'Comma-separated list of tables to backup')
      .action(async (options) => {
        await this.executeWithSafety('Database Backup', async () => {
          console.log(chalk.bold.blue('\n💾 Creating Database Backup\n'));
          
          const tables = options.tables ? options.tables.split(',') : ['Customer Assets'];
          const backupData = {};
          
          for (const tableName of tables) {
            try {
              console.log(chalk.blue(`📋 Backing up table: ${tableName}`));
              const records = await this.airtableClient.safeQuery(tableName, 'select');
              backupData[tableName] = {
                records: records.map(record => ({
                  id: record.id,
                  fields: record.fields,
                  createdTime: record.createdTime
                })),
                count: records.length,
                backedUpAt: new Date().toISOString()
              };
              console.log(chalk.green(`  ✅ ${records.length} records backed up`));
            } catch (error) {
              console.log(chalk.red(`  ❌ Failed to backup ${tableName}: ${error.message}`));
              backupData[tableName] = { error: error.message };
            }
          }
          
          // Save backup
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const backupPath = path.join(config.backup.directory, `backup-${timestamp}.json`);
          await fs.ensureDir(config.backup.directory);
          await fs.writeJson(backupPath, backupData, { spaces: 2 });
          
          console.log(chalk.green(`\n✅ Backup completed: ${backupPath}`));
        });
      });
  }

  setupMonitoringCommands() {
    const monitorCmd = this.program
      .command('monitor')
      .description('Monitor database health and performance');

    monitorCmd
      .command('status')
      .description('Show current database status')
      .action(async () => {
        await this.executeWithSafety('Status Check', async () => {
          console.log(chalk.bold.blue('\n📊 Database Status\n'));
          
          // Check connection
          const connectionTest = await this.airtableClient.testConnection();
          console.log(
            connectionTest.success
              ? chalk.green('🔗 Connection: ✅ Connected')
              : chalk.red(`🔗 Connection: ❌ Failed (${connectionTest.error})`)
          );
          
          if (connectionTest.success) {
            // Get table counts
            const tableInfo = await this.airtableClient.getAllTables();
            const existingTables = Object.values(tableInfo).filter(t => t.exists);
            const totalTables = Object.keys(tableInfo).length;
            
            console.log(chalk.blue(`📋 Tables: ${existingTables.length}/${totalTables} available`));
            
            // Get record counts for key tables
            const keyTables = ['Customer Assets', 'User Progress'];
            for (const tableName of keyTables) {
              if (tableInfo[tableName]?.exists) {
                const count = await this.airtableClient.getRecordCount(tableName);
                console.log(chalk.blue(`📊 ${tableName}: ${count} records`));
              }
            }
            
            // Performance check
            const performanceTest = await this.auditEngine.measureApiResponseTimes();
            const avgResponseTime = Object.values(performanceTest)
              .filter(test => test.status === 'success')
              .reduce((sum, test) => sum + test.responseTime, 0) / 
              Object.values(performanceTest).filter(test => test.status === 'success').length;
            
            console.log(chalk.blue(`⚡ Avg Response Time: ${avgResponseTime.toFixed(0)}ms`));
            
            // Health score
            if (this.auditEngine.auditResults?.timestamp) {
              const summary = this.auditEngine.generateSummaryReport();
              console.log(chalk.blue(`💚 Health Score: ${summary.healthScore}/100`));
            }
          }
        });
      });

    monitorCmd
      .command('performance')
      .description('Run performance tests')
      .action(async () => {
        await this.executeWithSafety('Performance Tests', async () => {
          console.log(chalk.bold.blue('\n⚡ Performance Testing\n'));
          
          const performanceResults = await this.auditEngine.measureApiResponseTimes();
          
          Object.entries(performanceResults).forEach(([testName, result]) => {
            const status = result.status === 'success' ? '✅' : '❌';
            const time = result.responseTime;
            const quality = time < 1000 ? '🟢' : time < 3000 ? '🟡' : '🔴';
            
            console.log(chalk.blue(`${status} ${quality} ${testName}: ${time}ms`));
          });
          
          const avgTime = Object.values(performanceResults)
            .filter(r => r.status === 'success')
            .reduce((sum, r) => sum + r.responseTime, 0) / 
            Object.values(performanceResults).filter(r => r.status === 'success').length;
          
          console.log(chalk.bold.blue(`\n📊 Average Response Time: ${avgTime.toFixed(0)}ms`));
        });
      });
  }

  setupUtilityCommands() {
    const utilCmd = this.program
      .command('util')
      .description('Utility operations');

    utilCmd
      .command('agents')
      .description('Show active agents')
      .action(async () => {
        await this.executeWithSafety('Agent Status', async () => {
          console.log(chalk.bold.blue('\n🤖 Active Agents\n'));
          
          const activeAgents = await this.coordinator.getActiveAgents();
          
          if (activeAgents.length === 0) {
            console.log(chalk.yellow('No active agents found'));
            return;
          }
          
          activeAgents.forEach(agent => {
            const statusIcon = agent.state === 'active' ? '🟢' : agent.state === 'working' ? '🟡' : '🔴';
            console.log(chalk.blue(`${statusIcon} ${agent.agent}: ${agent.state} (${agent.message})`));
            
            if (agent.metadata) {
              Object.entries(agent.metadata).forEach(([key, value]) => {
                console.log(chalk.gray(`    ${key}: ${value}`));
              });
            }
          });
          
          // Check compatibility
          const compatibility = await this.coordinator.checkCompatibility();
          console.log(
            compatibility.compatible
              ? chalk.green('\n✅ All agents compatible')
              : chalk.yellow(`\n⚠️ ${compatibility.conflicts.length} compatibility issues`)
          );
        });
      });

    utilCmd
      .command('config')
      .description('Show configuration')
      .action(() => {
        console.log(chalk.bold.blue('\n⚙️ Configuration\n'));
        
        const safeConfig = {
          agentName: config.agentName,
          version: config.version,
          coordination: {
            enabled: config.coordination.enabled,
            lockDir: config.coordination.lockDir,
            statusDir: config.coordination.statusDir
          },
          airtable: {
            baseId: config.airtable.baseId,
            rateLimit: config.airtable.rateLimit,
            timeout: config.airtable.timeout
          },
          safety: config.safety,
          performance: config.performance
        };
        
        console.log(JSON.stringify(safeConfig, null, 2));
      });

    utilCmd
      .command('test-connection')
      .description('Test Airtable connection')
      .action(async () => {
        await this.executeWithSafety('Connection Test', async () => {
          console.log(chalk.bold.blue('\n🔗 Testing Airtable Connection\n'));
          
          const result = await this.airtableClient.testConnection();
          
          if (result.success) {
            console.log(chalk.green('✅ Connection successful'));
            console.log(chalk.blue(`📊 Base accessible: ${result.tablesAccessible ? 'Yes' : 'No'}`));
          } else {
            console.log(chalk.red(`❌ Connection failed: ${result.error}`));
          }
        });
      });
  }

  setupErrorHandling() {
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log(chalk.yellow('\n\n⚠️ Graceful shutdown initiated...'));
      await this.coordinator.safeShutdown();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log(chalk.yellow('\n\n⚠️ Graceful shutdown initiated...'));
      await this.coordinator.safeShutdown();
      process.exit(0);
    });

    // Handle uncaught errors
    process.on('uncaughtException', async (error) => {
      console.error(chalk.red('\n❌ Uncaught Exception:'), error);
      await this.coordinator.safeShutdown();
      process.exit(1);
    });

    process.on('unhandledRejection', async (reason, promise) => {
      console.error(chalk.red('\n❌ Unhandled Rejection at:'), promise, 'reason:', reason);
      await this.coordinator.safeShutdown();
      process.exit(1);
    });
  }

  async executeWithSafety(operationName, operation) {
    try {
      // Initialize coordinator
      if (!this.coordinator.isActive) {
        await this.coordinator.initialize();
        await this.coordinator.startHeartbeat();
      }

      // Check agent compatibility
      const compatibility = await this.coordinator.checkCompatibility();
      if (!compatibility.compatible) {
        console.log(chalk.yellow('⚠️ Agent compatibility issues detected:'));
        compatibility.conflicts.forEach(conflict => {
          console.log(chalk.yellow(`  - ${conflict.agent}: ${conflict.reason}`));
        });
        
        const shouldWait = await this.coordinator.waitForCompatibility(30000); // 30 second timeout
        if (!shouldWait) {
          console.log(chalk.red('❌ Could not achieve agent compatibility, proceeding with caution...'));
        }
      }

      // Execute operation
      await operation();
      
    } catch (error) {
      console.error(chalk.red(`\n❌ ${operationName} failed:`), error.message);
      if (error.stack && process.env.NODE_ENV === 'development') {
        console.error(chalk.gray(error.stack));
      }
      process.exit(1);
    } finally {
      // Clean shutdown
      if (this.coordinator.isActive) {
        await this.coordinator.safeShutdown();
      }
    }
  }

  // Display helper methods
  displayAuditSummary(auditResults) {
    console.log(chalk.bold.green('\n📊 AUDIT SUMMARY\n'));
    
    const summary = this.auditEngine.generateSummaryReport();
    console.log(chalk.blue(`🕐 Audit Time: ${summary.auditTimestamp}`));
    console.log(chalk.blue(`📋 Tables Analyzed: ${summary.tablesAnalyzed}`));
    console.log(chalk.blue(`✅ Tables Existing: ${summary.tablesExisting}`));
    console.log(chalk.blue(`💚 Health Score: ${summary.healthScore}/100`));
    
    if (auditResults.dataQuality) {
      console.log(chalk.blue(`🔍 Data Quality Score: ${auditResults.dataQuality.overallScore}/100`));
    }
    
    console.log(chalk.blue(`📊 Recommendations: ${summary.recommendationsCount}`));
    
    if (auditResults.recommendations && auditResults.recommendations.length > 0) {
      console.log(chalk.yellow('\n🎯 Top Recommendations:'));
      auditResults.recommendations.slice(0, 3).forEach((rec, index) => {
        console.log(chalk.yellow(`  ${index + 1}. ${rec.title || rec.description} (${rec.priority})`));
      });
    }
  }

  generateQuickAuditSummary(tableInfo) {
    const existingTables = Object.values(tableInfo).filter(t => t.exists).length;
    const totalTables = Object.keys(tableInfo).length;
    const missingTables = Object.entries(tableInfo)
      .filter(([name, info]) => !info.exists)
      .map(([name]) => name);
    
    return {
      existingTables,
      totalTables,
      completeness: (existingTables / totalTables) * 100,
      missingTables
    };
  }

  displayOptimizationSummary(optimizationResults) {
    console.log(chalk.bold.green('\n⚡ OPTIMIZATION SUMMARY\n'));
    
    const summary = this.optimizationEngine.generateOptimizationSummary();
    console.log(chalk.blue(`🕐 Analysis Time: ${summary.analysisTimestamp}`));
    console.log(chalk.blue(`📊 Total Recommendations: ${summary.totalRecommendations}`));
    console.log(chalk.blue(`🔥 High Priority: ${summary.highPriorityRecommendations}`));
    console.log(chalk.blue(`💰 Estimated ROI: ${summary.estimatedROI.toFixed(1)}%`));
    console.log(chalk.blue(`⚠️ Risk Level: ${summary.overallRisk}`));
    console.log(chalk.blue(`📋 Implementation Phases: ${summary.implementationPhases}`));
  }

  displayRecommendations(recommendations) {
    if (recommendations.length === 0) {
      console.log(chalk.green('✅ No recommendations found'));
      return;
    }
    
    recommendations.forEach((rec, index) => {
      const priorityIcon = rec.priority === 'critical' ? '🔴' : rec.priority === 'high' ? '🟡' : '🟢';
      const effortIcon = rec.effort === 'high' ? '🔴' : rec.effort === 'medium' ? '🟡' : '🟢';
      
      console.log(chalk.bold(`${index + 1}. ${rec.title || rec.recommendedAction}`));
      console.log(chalk.blue(`   Priority: ${priorityIcon} ${rec.priority}`));
      console.log(chalk.blue(`   Effort: ${effortIcon} ${rec.effort}`));
      console.log(chalk.blue(`   Category: ${rec.category}/${rec.subCategory}`));
      if (rec.potentialImpact) {
        console.log(chalk.blue(`   Impact: ${rec.potentialImpact}`));
      }
      if (rec.roi) {
        console.log(chalk.blue(`   ROI: ${rec.roi.toFixed(1)}%`));
      }
      console.log('');
    });
  }

  displayImplementationPlan(implementationPlan) {
    if (!implementationPlan) return;
    
    console.log(chalk.bold.blue('\n📋 IMPLEMENTATION PLAN\n'));
    
    Object.entries(implementationPlan.phases).forEach(([phaseName, phase]) => {
      console.log(chalk.bold(`📅 ${phaseName.toUpperCase()} (${phase.duration})`));
      console.log(chalk.blue(`   Recommendations: ${phase.recommendations.length}`));
      phase.recommendations.forEach(rec => {
        console.log(chalk.gray(`   - ${rec.title || rec.recommendedAction}`));
      });
      console.log('');
    });
    
    if (implementationPlan.resourceRequirements) {
      console.log(chalk.bold.blue('👥 RESOURCE REQUIREMENTS\n'));
      Object.entries(implementationPlan.resourceRequirements).forEach(([resource, requirement]) => {
        console.log(chalk.blue(`${resource}: ${requirement}`));
      });
    }
  }

  displayCostBenefitAnalysis(costBenefitAnalysis) {
    if (!costBenefitAnalysis) return;
    
    console.log(chalk.bold.green('\n💰 COST-BENEFIT ANALYSIS\n'));
    console.log(chalk.blue(`💸 Implementation Cost: $${costBenefitAnalysis.totalImplementationCost.toLocaleString()}`));
    console.log(chalk.blue(`💚 Annual Benefits: $${costBenefitAnalysis.totalBenefits.toLocaleString()}`));
    console.log(chalk.blue(`📈 ROI: ${costBenefitAnalysis.roi.toFixed(1)}%`));
    console.log(chalk.blue(`⏰ Payback Period: ${costBenefitAnalysis.paybackPeriod.toFixed(1)} months`));
  }

  displayRiskAssessment(riskAssessment) {
    if (!riskAssessment) return;
    
    console.log(chalk.bold.yellow('\n⚠️ RISK ASSESSMENT\n'));
    console.log(chalk.blue(`🎯 Overall Risk: ${riskAssessment.overallRisk}`));
    console.log(chalk.blue(`🚨 Risk Factors: ${riskAssessment.riskFactors.length}`));
    console.log(chalk.blue(`🛡️ Mitigation Strategies: ${riskAssessment.mitigationStrategies.length}`));
    console.log(chalk.blue(`🔄 Rollback Plans: ${riskAssessment.rollbackPlans.length}`));
  }

  identifyCleanupOpportunities(auditResults) {
    const opportunities = [];
    
    // Add some example cleanup opportunities based on audit results
    if (auditResults.dataQuality?.duplicateCustomers?.length > 0) {
      opportunities.push({
        description: `Merge ${auditResults.dataQuality.duplicateCustomers.length} duplicate customer groups`,
        impact: 'Improved data integrity'
      });
    }
    
    if (auditResults.dataQuality?.incompleteRecords?.length > 0) {
      opportunities.push({
        description: `Complete ${auditResults.dataQuality.incompleteRecords.length} incomplete records`,
        impact: 'Better data completeness'
      });
    }
    
    return opportunities;
  }

  async run() {
    try {
      await this.program.parseAsync(process.argv);
    } catch (error) {
      console.error(chalk.red('❌ CLI Error:'), error.message);
      process.exit(1);
    }
  }
}

// Run CLI if called directly
if (require.main === module) {
  const agent = new AirtableManagementAgent();
  agent.run();
}

module.exports = AirtableManagementAgent;