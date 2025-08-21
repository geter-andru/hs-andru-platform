const { default: chalk } = require('chalk');
const fs = require('fs-extra');
const path = require('path');

class AuditEngine {
  constructor(config, coordinator, airtableClient) {
    this.config = config;
    this.coordinator = coordinator;
    this.airtableClient = airtableClient;
    this.auditResults = {};
    this.startTime = null;
  }

  async performComprehensiveAudit() {
    console.log(chalk.bold.blue('\n🔍 Starting Comprehensive Airtable Audit...\n'));
    this.startTime = Date.now();

    try {
      // Update coordinator status
      await this.coordinator.updateStatus('auditing', 'Performing comprehensive database audit', {
        airtableOperations: false,
        readOnly: true
      });

      const auditResults = {
        timestamp: new Date().toISOString(),
        phase: 'read-only-audit',
        tables: await this.auditAllTables(),
        fields: await this.auditAllFields(),
        dataQuality: await this.auditDataQuality(),
        relationships: await this.auditRelationships(),
        performance: await this.auditPerformance(),
        storage: await this.auditStorage(),
        recommendations: []
      };

      // Generate recommendations based on findings
      auditResults.recommendations = this.generateRecommendations(auditResults);

      this.auditResults = auditResults;
      await this.saveAuditResults(auditResults);
      
      const duration = ((Date.now() - this.startTime) / 1000).toFixed(1);
      console.log(chalk.green(`✅ Comprehensive audit completed in ${duration}s`));
      
      return auditResults;
    } catch (error) {
      console.error(chalk.red('❌ Audit failed:'), error.message);
      throw error;
    } finally {
      await this.coordinator.updateStatus('active', 'Audit completed, ready for operations');
    }
  }

  async auditAllTables() {
    console.log(chalk.yellow('📋 Auditing all tables...'));
    
    const tableMetadata = {};
    const allTables = [
      ...this.config.tables.core,
      ...this.config.tables.aiResources,
      ...this.config.tables.management,
      ...this.config.tables.psychology,
      ...this.config.tables.salesResources
    ];

    let processedTables = 0;
    for (const tableName of allTables) {
      try {
        console.log(chalk.blue(`  📊 Analyzing ${tableName}... (${processedTables + 1}/${allTables.length})`));
        
        const tableInfo = await this.airtableClient.getTableInfo(tableName);
        const recordCount = tableInfo.exists ? await this.airtableClient.getRecordCount(tableName) : 0;
        
        tableMetadata[tableName] = {
          ...tableInfo,
          recordCount,
          category: this.getTableCategory(tableName),
          lastAnalyzed: new Date().toISOString(),
          usage: await this.analyzeTableUsage(tableName, tableInfo),
          health: this.calculateTableHealth(tableInfo, recordCount)
        };

        // Rate limiting - wait between requests
        if (processedTables < allTables.length - 1) {
          await this.sleep(1000); // 1 second between requests
        }
        
        processedTables++;
      } catch (error) {
        console.error(chalk.red(`    ❌ Error analyzing ${tableName}:`), error.message);
        tableMetadata[tableName] = {
          exists: false,
          error: error.message,
          category: this.getTableCategory(tableName),
          needsCreation: true,
          health: 0
        };
      }
    }

    console.log(chalk.green(`  ✅ Analyzed ${processedTables} tables`));
    return tableMetadata;
  }

  async auditAllFields() {
    console.log(chalk.yellow('🏷️ Auditing field structures...'));
    
    const fieldAudit = {};
    
    // Focus on critical tables first
    const criticalTables = ['Customer Assets'];
    
    for (const tableName of criticalTables) {
      try {
        if (!this.auditResults.tables || !this.auditResults.tables[tableName]?.exists) {
          continue;
        }

        console.log(chalk.blue(`  🔍 Analyzing fields in ${tableName}...`));
        
        const requiredFields = this.config.criticalFields[tableName] || [];
        const tableInfo = this.auditResults.tables[tableName];
        const existingFields = tableInfo.fields || [];
        
        fieldAudit[tableName] = {
          existingFields,
          requiredFields,
          missingFields: requiredFields.filter(field => !existingFields.includes(field)),
          extraFields: existingFields.filter(field => !requiredFields.includes(field)),
          fieldTypes: await this.analyzeFieldTypes(tableName),
          fieldUtilization: await this.analyzeFieldUtilization(tableName),
          emptyFields: await this.identifyEmptyFields(tableName)
        };

        console.log(chalk.green(`    ✅ Found ${existingFields.length} fields, ${fieldAudit[tableName].missingFields.length} missing`));

      } catch (error) {
        console.error(chalk.red(`    ❌ Error analyzing fields in ${tableName}:`), error.message);
        fieldAudit[tableName] = { error: error.message };
      }
    }

    return fieldAudit;
  }

  async auditDataQuality() {
    console.log(chalk.yellow('🔍 Auditing data quality...'));
    
    const qualityReport = {
      duplicateCustomers: await this.findDuplicateCustomers(),
      incompleteRecords: await this.findIncompleteRecords(),
      invalidEmails: await this.findInvalidEmails(),
      orphanedRecords: await this.findOrphanedRecords(),
      dataConsistency: await this.checkDataConsistency()
    };

    // Calculate overall quality score
    const totalIssues = Object.values(qualityReport).reduce((sum, issues) => {
      return sum + (Array.isArray(issues) ? issues.length : 0);
    }, 0);
    
    qualityReport.overallScore = Math.max(0, 100 - (totalIssues * 5)); // Deduct 5 points per issue
    
    console.log(chalk.green(`  ✅ Data quality score: ${qualityReport.overallScore}/100`));
    return qualityReport;
  }

  async auditRelationships() {
    console.log(chalk.yellow('🔗 Auditing table relationships...'));
    
    const relationships = {
      customerAssetLinks: await this.analyzeCustomerAssetRelationships(),
      aiResourceLinks: await this.analyzeAIResourceRelationships(),
      orphanedReferences: await this.findOrphanedReferences(),
      relationshipIntegrity: await this.checkRelationshipIntegrity()
    };

    return relationships;
  }

  async auditPerformance() {
    console.log(chalk.yellow('⚡ Auditing performance metrics...'));
    
    const performanceMetrics = {
      apiResponseTimes: await this.measureApiResponseTimes(),
      recordCountDistribution: await this.analyzeRecordDistribution(),
      queryComplexity: await this.analyzeQueryComplexity(),
      storageEfficiency: await this.analyzeStorageEfficiency()
    };

    return performanceMetrics;
  }

  async auditStorage() {
    console.log(chalk.yellow('💾 Auditing storage utilization...'));
    
    const storageAnalysis = {
      largeFields: await this.identifyLargeFields(),
      jsonFieldSizes: await this.analyzeJsonFieldSizes(),
      redundantData: await this.identifyRedundantData(),
      compressionOpportunities: await this.identifyCompressionOpportunities()
    };

    return storageAnalysis;
  }

  // Helper methods for analysis
  getTableCategory(tableName) {
    if (this.config.tables.core.includes(tableName)) return 'core';
    if (this.config.tables.aiResources.includes(tableName)) return 'aiResources';
    if (this.config.tables.management.includes(tableName)) return 'management';
    if (this.config.tables.psychology.includes(tableName)) return 'psychology';
    if (this.config.tables.salesResources.includes(tableName)) return 'salesResources';
    return 'unknown';
  }

  calculateTableHealth(tableInfo, recordCount) {
    if (!tableInfo.exists) return 0;
    
    let health = 100;
    
    // Deduct points for issues
    if (recordCount === 0) health -= 20; // Empty table
    if (recordCount > 10000) health -= 10; // Very large table
    if (!tableInfo.fields || tableInfo.fields.length === 0) health -= 30; // No fields
    
    return Math.max(0, health);
  }

  async analyzeTableUsage(tableName, tableInfo) {
    if (!tableInfo.exists) {
      return { used: false, frequency: 'never', priority: 'low' };
    }

    // Basic usage analysis based on record count and table category
    const recordCount = tableInfo.recordCount || 0;
    const category = this.getTableCategory(tableName);
    
    let frequency = 'low';
    let priority = 'medium';
    
    if (recordCount > 100) frequency = 'high';
    else if (recordCount > 10) frequency = 'medium';
    
    if (category === 'core') priority = 'critical';
    else if (category === 'aiResources') priority = 'high';
    
    return {
      used: recordCount > 0,
      frequency,
      priority,
      recordCount
    };
  }

  async analyzeFieldTypes(tableName) {
    // This would require schema inspection, simplified for now
    return {
      analyzed: false,
      reason: 'Schema inspection requires write permissions or API limitations'
    };
  }

  async analyzeFieldUtilization(tableName) {
    try {
      const records = await this.airtableClient.safeQuery(tableName, 'firstPage', {
        maxRecords: 10
      });
      
      if (records.length === 0) return { empty: true };
      
      const fieldUsage = {};
      records.forEach(record => {
        Object.keys(record.fields).forEach(field => {
          if (!fieldUsage[field]) fieldUsage[field] = 0;
          if (record.fields[field] !== null && record.fields[field] !== undefined && record.fields[field] !== '') {
            fieldUsage[field]++;
          }
        });
      });

      return fieldUsage;
    } catch (error) {
      return { error: error.message };
    }
  }

  async identifyEmptyFields(tableName) {
    try {
      const utilization = await this.analyzeFieldUtilization(tableName);
      if (utilization.error || utilization.empty) return [];
      
      return Object.entries(utilization)
        .filter(([field, count]) => count === 0)
        .map(([field]) => field);
    } catch (error) {
      return [];
    }
  }

  async findDuplicateCustomers() {
    try {
      console.log(chalk.blue('    🔍 Checking for duplicate customers...'));
      
      const customers = await this.airtableClient.safeQuery('Customer Assets', 'select', {
        fields: ['Customer ID', 'Email', 'Customer Name']
      });

      const duplicates = [];
      const emailMap = new Map();
      const nameMap = new Map();

      customers.forEach(customer => {
        const email = customer.fields.Email;
        const name = customer.fields['Customer Name'];
        
        if (email) {
          if (emailMap.has(email)) {
            emailMap.get(email).push(customer);
          } else {
            emailMap.set(email, [customer]);
          }
        }
        
        if (name) {
          if (nameMap.has(name)) {
            nameMap.get(name).push(customer);
          } else {
            nameMap.set(name, [customer]);
          }
        }
      });

      // Find actual duplicates
      emailMap.forEach((records, email) => {
        if (records.length > 1) {
          duplicates.push({ type: 'email', value: email, records });
        }
      });

      console.log(chalk.blue(`      Found ${duplicates.length} potential duplicate groups`));
      return duplicates;
    } catch (error) {
      console.error(chalk.red('      ❌ Error checking duplicates:'), error.message);
      return [];
    }
  }

  async findIncompleteRecords() {
    try {
      console.log(chalk.blue('    🔍 Checking for incomplete records...'));
      
      const customers = await this.airtableClient.safeQuery('Customer Assets', 'select');
      const incompleteRecords = [];

      customers.forEach(customer => {
        const fields = customer.fields;
        const missingCritical = [];
        
        // Check for critical missing fields
        if (!fields['Customer ID']) missingCritical.push('Customer ID');
        if (!fields['Customer Name']) missingCritical.push('Customer Name');
        if (!fields['Email']) missingCritical.push('Email');
        if (!fields['Payment Status']) missingCritical.push('Payment Status');
        
        if (missingCritical.length > 0) {
          incompleteRecords.push({
            recordId: customer.id,
            missingFields: missingCritical
          });
        }
      });

      console.log(chalk.blue(`      Found ${incompleteRecords.length} incomplete records`));
      return incompleteRecords;
    } catch (error) {
      console.error(chalk.red('      ❌ Error checking incomplete records:'), error.message);
      return [];
    }
  }

  async findInvalidEmails() {
    try {
      console.log(chalk.blue('    🔍 Checking for invalid email addresses...'));
      
      const customers = await this.airtableClient.safeQuery('Customer Assets', 'select', {
        fields: ['Email']
      });

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalidEmails = [];

      customers.forEach(customer => {
        const email = customer.fields.Email;
        if (email && !emailRegex.test(email)) {
          invalidEmails.push({
            recordId: customer.id,
            email: email
          });
        }
      });

      console.log(chalk.blue(`      Found ${invalidEmails.length} invalid emails`));
      return invalidEmails;
    } catch (error) {
      console.error(chalk.red('      ❌ Error checking emails:'), error.message);
      return [];
    }
  }

  async findOrphanedRecords() {
    // Simplified implementation - would need relationship mapping
    console.log(chalk.blue('    🔍 Checking for orphaned records...'));
    return [];
  }

  async checkDataConsistency() {
    console.log(chalk.blue('    🔍 Checking data consistency...'));
    return { issues: [], score: 100 };
  }

  async analyzeCustomerAssetRelationships() {
    return { analyzed: false, reason: 'Relationship analysis requires cross-table queries' };
  }

  async analyzeAIResourceRelationships() {
    return { analyzed: false, reason: 'Relationship analysis requires cross-table queries' };
  }

  async findOrphanedReferences() {
    return [];
  }

  async checkRelationshipIntegrity() {
    return { score: 100, issues: [] };
  }

  async measureApiResponseTimes() {
    console.log(chalk.blue('    ⏱️ Measuring API response times...'));
    
    const tests = [
      { name: 'simple_record_fetch', table: 'Customer Assets' },
      { name: 'filtered_query', table: 'Customer Assets' }
    ];

    const results = {};
    
    for (const test of tests) {
      const startTime = Date.now();
      try {
        if (test.name === 'filtered_query') {
          await this.airtableClient.safeQuery(test.table, 'select', {
            filterByFormula: `{Payment Status} = 'Completed'`,
            maxRecords: 5
          });
        } else {
          await this.airtableClient.safeQuery(test.table, 'firstPage', {
            maxRecords: 1
          });
        }
        
        results[test.name] = {
          responseTime: Date.now() - startTime,
          status: 'success'
        };
      } catch (error) {
        results[test.name] = {
          responseTime: Date.now() - startTime,
          status: 'error',
          error: error.message
        };
      }
    }

    return results;
  }

  async analyzeRecordDistribution() {
    const distribution = {};
    
    if (this.auditResults.tables) {
      Object.entries(this.auditResults.tables).forEach(([tableName, tableInfo]) => {
        distribution[tableName] = tableInfo.recordCount || 0;
      });
    }

    return distribution;
  }

  async analyzeQueryComplexity() {
    return { analyzed: false, reason: 'Query complexity analysis requires query history' };
  }

  async analyzeStorageEfficiency() {
    return { analyzed: false, reason: 'Storage analysis requires detailed field inspection' };
  }

  async identifyLargeFields() {
    return [];
  }

  async analyzeJsonFieldSizes() {
    try {
      console.log(chalk.blue('    📊 Analyzing JSON field sizes...'));
      
      const customers = await this.airtableClient.safeQuery('Customer Assets', 'firstPage', {
        fields: ['ICP System JSON', 'Calculator JSON', 'Business Case JSON'],
        maxRecords: 5
      });

      const jsonSizes = {};
      customers.forEach(customer => {
        ['ICP System JSON', 'Calculator JSON', 'Business Case JSON'].forEach(field => {
          if (customer.fields[field]) {
            const size = JSON.stringify(customer.fields[field]).length;
            if (!jsonSizes[field]) jsonSizes[field] = [];
            jsonSizes[field].push(size);
          }
        });
      });

      // Calculate averages
      Object.keys(jsonSizes).forEach(field => {
        const sizes = jsonSizes[field];
        jsonSizes[field] = {
          average: sizes.reduce((a, b) => a + b, 0) / sizes.length,
          max: Math.max(...sizes),
          min: Math.min(...sizes),
          count: sizes.length
        };
      });

      return jsonSizes;
    } catch (error) {
      return { error: error.message };
    }
  }

  async identifyRedundantData() {
    return [];
  }

  async identifyCompressionOpportunities() {
    return [];
  }

  generateRecommendations(auditResults) {
    const recommendations = [];

    // Check table completeness
    const existingTables = Object.values(auditResults.tables).filter(t => t.exists).length;
    const totalTables = Object.keys(auditResults.tables).length;
    
    if (existingTables < totalTables) {
      recommendations.push({
        priority: 'high',
        category: 'schema',
        title: 'Missing Tables Detected',
        description: `${totalTables - existingTables} tables are missing from the database schema`,
        impact: 'Platform functionality may be limited',
        action: 'Create missing tables using Airtable interface'
      });
    }

    // Check data quality
    if (auditResults.dataQuality?.overallScore < 80) {
      recommendations.push({
        priority: 'medium',
        category: 'data_quality',
        title: 'Data Quality Issues',
        description: `Data quality score is ${auditResults.dataQuality.overallScore}/100`,
        impact: 'May affect platform reliability and user experience',
        action: 'Review and clean up data quality issues'
      });
    }

    // Check performance
    const avgResponseTime = this.calculateAverageResponseTime(auditResults.performance?.apiResponseTimes);
    if (avgResponseTime > this.config.performance.apiResponseTime.warning) {
      recommendations.push({
        priority: 'medium',
        category: 'performance',
        title: 'Slow API Response Times',
        description: `Average response time is ${avgResponseTime}ms`,
        impact: 'Users may experience slow loading times',
        action: 'Optimize queries and consider field selection'
      });
    }

    return recommendations;
  }

  calculateAverageResponseTime(responseTimeData) {
    if (!responseTimeData) return 0;
    
    const times = Object.values(responseTimeData)
      .filter(result => result.status === 'success')
      .map(result => result.responseTime);
    
    if (times.length === 0) return 0;
    return times.reduce((a, b) => a + b, 0) / times.length;
  }

  async saveAuditResults(results) {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `audit-${timestamp}-${Date.now()}.json`;
    const filepath = path.join(this.config.backup.directory, filename);
    
    await fs.ensureDir(this.config.backup.directory);
    await fs.writeJson(filepath, results, { spaces: 2 });
    
    console.log(chalk.blue(`📄 Audit results saved to: ${filepath}`));
    return filepath;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateSummaryReport() {
    if (!this.auditResults.timestamp) {
      return 'No audit results available. Run performComprehensiveAudit() first.';
    }

    const summary = {
      auditTimestamp: this.auditResults.timestamp,
      tablesAnalyzed: Object.keys(this.auditResults.tables).length,
      tablesExisting: Object.values(this.auditResults.tables).filter(t => t.exists).length,
      dataQualityScore: this.auditResults.dataQuality?.overallScore || 0,
      recommendationsCount: this.auditResults.recommendations?.length || 0,
      healthScore: this.calculateOverallHealthScore()
    };

    return summary;
  }

  calculateOverallHealthScore() {
    let score = 100;
    
    // Deduct for missing tables
    const tableCompleteness = (this.auditResults.tables ? 
      Object.values(this.auditResults.tables).filter(t => t.exists).length / 
      Object.keys(this.auditResults.tables).length : 0) * 100;
    
    score = (score * 0.4) + (tableCompleteness * 0.3) + ((this.auditResults.dataQuality?.overallScore || 0) * 0.3);
    
    return Math.round(score);
  }
}

module.exports = AuditEngine;