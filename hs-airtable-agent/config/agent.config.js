const path = require('path');
const os = require('os');

module.exports = {
  // Agent Identity
  agentName: 'hs-airtable-agent',
  version: '1.0.0',
  
  // Multi-Agent Coordination
  coordination: {
    enabled: process.env.COORDINATION_ENABLED === 'true',
    lockDir: process.env.SHARED_LOCK_DIR || path.join(os.tmpdir(), 'hs-agents'),
    statusDir: process.env.AGENT_STATUS_DIR || path.join(__dirname, '../../.agent-status'),
    lockTimeout: 30000, // 30 seconds
    heartbeatInterval: 5000, // 5 seconds
  },
  
  // Airtable Configuration
  airtable: {
    baseId: process.env.AIRTABLE_BASE_ID,
    apiKey: process.env.AIRTABLE_API_KEY,
    rateLimit: parseInt(process.env.AIRTABLE_RATE_LIMIT) || 5, // requests per minute
    timeout: parseInt(process.env.AGENT_TIMEOUT_MS) || 30000,
    retries: parseInt(process.env.AGENT_MAX_RETRIES) || 3,
  },
  
  // Known Tables (from H&S Platform documentation)
  tables: {
    core: [
      'Customer Assets',
      'User Progress'
    ],
    aiResources: [
      'AI_Resource_Generations',
      'Resource_Generation_Summary', 
      'Generation_Error_Logs'
    ],
    management: [
      'Customer_Profiles',
      'Product_Configurations',
      'Performance_Metrics',
      'Support_Tickets',
      'Admin_Dashboard_Metrics',
      'Quality_Benchmarks'
    ],
    psychology: [
      'Moment_in_Life_Descriptions',
      'Empathy_Maps'
    ],
    salesResources: [
      'Advanced_Sales_Tasks',
      'Buyer_UX_Considerations', 
      'Product_Usage_Assessments',
      'Day_in_Life_Descriptions',
      'Month_in_Life_Descriptions',
      'User_Journey_Maps',
      'Service_Blueprints',
      'Jobs_to_be_Done',
      'Compelling_Events',
      'Scenario_Planning',
      'Product_Potential_Assessments'
    ]
  },
  
  // Critical Fields for Customer Assets table
  criticalFields: {
    'Customer Assets': [
      'Customer ID',
      'Customer Name',
      'Email', 
      'Company',
      'Payment Status',
      'Content Status',
      'Access Token',
      'ICP System JSON',
      'Calculator JSON',
      'Business Case JSON',
      'Assessment Overall Score',
      'Assessment Performance Level',
      'Assessment Buyer Understanding Score',
      'Assessment Tech-to-Value Score', 
      'Assessment Revenue Opportunity',
      'Assessment ROI Multiplier',
      'Competency_Progress',
      'Tool_Access_Status',
      'Professional_Milestones'
    ]
  },
  
  // Performance Thresholds
  performance: {
    apiResponseTime: {
      warning: 2000, // 2 seconds
      critical: 5000 // 5 seconds
    },
    recordCount: {
      warning: 10000,
      critical: 50000
    },
    errorRate: {
      warning: 0.05, // 5%
      critical: 0.10  // 10%
    }
  },
  
  // Backup Configuration
  backup: {
    directory: path.join(__dirname, '../backups'),
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS) || 30,
    compression: process.env.BACKUP_COMPRESSION === 'true',
    maxBackups: 50
  },
  
  // Logging Configuration
  logging: {
    level: process.env.AGENT_LOG_LEVEL || 'info',
    directory: path.join(__dirname, '../logs'),
    maxFiles: 10,
    maxSize: '10m'
  },
  
  // Safety Settings
  safety: {
    dryRunDefault: true,
    backupBeforeChanges: true,
    testCustomerId: 'CUST_02', // Use for all testing
    protectedCustomerId: 'CUST_4', // Never modify during testing
    maxRecordsPerBatch: 100,
    confirmationRequired: ['delete', 'update_schema', 'bulk_update']
  }
};