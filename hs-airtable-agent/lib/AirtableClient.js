const Airtable = require('airtable');
const { default: chalk } = require('chalk');

class AirtableClient {
  constructor(config, coordinator) {
    this.config = config;
    this.coordinator = coordinator;
    this.base = new Airtable({ 
      apiKey: config.airtable.apiKey,
      requestTimeout: config.airtable.timeout
    }).base(config.airtable.baseId);
    
    this.rateLimiter = {
      requests: [],
      maxRequests: config.airtable.rateLimit,
      windowMs: 60000 // 1 minute
    };
  }

  async checkRateLimit() {
    const now = Date.now();
    const windowStart = now - this.rateLimiter.windowMs;
    
    // Remove old requests outside the window
    this.rateLimiter.requests = this.rateLimiter.requests.filter(
      timestamp => timestamp > windowStart
    );
    
    // Check if we can make another request
    if (this.rateLimiter.requests.length >= this.rateLimiter.maxRequests) {
      const oldestRequest = Math.min(...this.rateLimiter.requests);
      const waitTime = oldestRequest + this.rateLimiter.windowMs - now;
      
      if (waitTime > 0) {
        console.log(chalk.yellow(`⏳ Rate limit reached, waiting ${waitTime}ms`));
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.checkRateLimit(); // Recursive check after waiting
      }
    }
    
    // Record this request
    this.rateLimiter.requests.push(now);
    return true;
  }

  async safeQuery(tableName, operation, options = {}) {
    // Check rate limit
    await this.checkRateLimit();
    
    // Acquire lock for sensitive operations
    const needsLock = ['create', 'update', 'destroy'].includes(operation);
    if (needsLock) {
      await this.coordinator.acquireGlobalLock(`airtable-${operation}-${tableName}`);
    }

    try {
      // Update coordinator status
      await this.coordinator.updateStatus('working', `Performing ${operation} on ${tableName}`, {
        airtableOperations: true,
        operation,
        tableName
      });

      let result;
      switch (operation) {
        case 'select':
          result = await this.base(tableName).select(options).all();
          break;
        case 'find':
          result = await this.base(tableName).find(options.recordId);
          break;
        case 'create':
          result = await this.base(tableName).create(options.records || options);
          break;
        case 'update':
          result = await this.base(tableName).update(options.recordId, options.fields);
          break;
        case 'destroy':
          result = await this.base(tableName).destroy(options.recordId);
          break;
        case 'firstPage':
          result = await this.base(tableName).select(options).firstPage();
          break;
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }

      console.log(chalk.green(`✅ ${operation} on ${tableName} completed`));
      return result;

    } catch (error) {
      console.error(chalk.red(`❌ ${operation} on ${tableName} failed:`), error.message);
      throw error;
    } finally {
      // Release lock
      if (needsLock) {
        await this.coordinator.releaseGlobalLock();
      }
      
      // Update status
      await this.coordinator.updateStatus('active', 'Ready for operations');
    }
  }

  async testConnection() {
    try {
      console.log(chalk.blue('🔗 Testing Airtable connection...'));
      
      // Try to fetch one record from Customer Assets (should always exist)
      const testResult = await this.safeQuery('Customer Assets', 'firstPage', {
        maxRecords: 1
      });
      
      console.log(chalk.green('✅ Airtable connection successful'));
      return {
        success: true,
        tablesAccessible: true,
        recordCount: testResult.length
      };
    } catch (error) {
      console.error(chalk.red('❌ Airtable connection failed:'), error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getTableInfo(tableName) {
    try {
      const records = await this.safeQuery(tableName, 'firstPage', {
        maxRecords: 1
      });
      
      if (records.length > 0) {
        const sampleRecord = records[0];
        return {
          exists: true,
          fields: Object.keys(sampleRecord.fields),
          sampleId: sampleRecord.id,
          createdTime: sampleRecord.createdTime
        };
      } else {
        return {
          exists: true,
          fields: [],
          empty: true
        };
      }
    } catch (error) {
      if (error.message.includes('NOT_FOUND') || error.message.includes('TABLE_NOT_FOUND')) {
        return {
          exists: false,
          error: 'Table not found'
        };
      }
      throw error;
    }
  }

  async getAllTables() {
    const allTables = [
      ...this.config.tables.core,
      ...this.config.tables.aiResources,
      ...this.config.tables.management,
      ...this.config.tables.psychology,
      ...this.config.tables.salesResources
    ];

    const tableInfo = {};
    
    for (const tableName of allTables) {
      try {
        console.log(chalk.blue(`📋 Checking table: ${tableName}`));
        tableInfo[tableName] = await this.getTableInfo(tableName);
      } catch (error) {
        console.error(chalk.red(`❌ Error checking table ${tableName}:`), error.message);
        tableInfo[tableName] = {
          exists: false,
          error: error.message
        };
      }
    }

    return tableInfo;
  }

  async getRecordCount(tableName) {
    try {
      const records = await this.safeQuery(tableName, 'select');
      return records.length;
    } catch (error) {
      console.error(chalk.red(`❌ Error getting record count for ${tableName}:`), error.message);
      return 0;
    }
  }

  async findTestCustomer() {
    try {
      const records = await this.safeQuery('Customer Assets', 'select', {
        filterByFormula: `{Customer ID} = "${this.config.safety.testCustomerId}"`,
        maxRecords: 1
      });
      
      return records.length > 0 ? records[0] : null;
    } catch (error) {
      console.error(chalk.red('❌ Error finding test customer:'), error.message);
      return null;
    }
  }

  async validateEnvironment() {
    const results = {
      connection: await this.testConnection(),
      tables: await this.getAllTables(),
      testCustomer: await this.findTestCustomer()
    };

    // Calculate health metrics
    const existingTables = Object.values(results.tables).filter(t => t.exists).length;
    const totalTables = Object.keys(results.tables).length;
    
    results.summary = {
      connectionWorking: results.connection.success,
      tablesFound: existingTables,
      totalTables: totalTables,
      completeness: (existingTables / totalTables) * 100,
      testCustomerExists: !!results.testCustomer,
      ready: results.connection.success && existingTables > 0 && !!results.testCustomer
    };

    return results;
  }
}

module.exports = AirtableClient;