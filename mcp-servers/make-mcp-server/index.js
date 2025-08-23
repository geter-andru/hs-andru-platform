#!/usr/bin/env node

/**
 * Make.com MCP Server for H&S Revenue Intelligence Platform
 * 
 * Enhanced MCP server with full scenario creation capabilities for:
 * - AI-generated Resources Library creation
 * - Revenue intelligence automation workflows
 * - Cross-platform integration scenarios
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const axios = require('axios');

class MakeMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'make-mcp-server',
        version: '1.0.0',
        description: 'Make.com integration server for H&S Revenue Intelligence Platform'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.apiToken = process.env.MAKE_API_TOKEN;
    this.baseURL = 'https://us1.make.com/api/v2';
    
    // H&S Platform Configuration
    this.hsConfig = {
      orgId: 1780256,
      teamId: 719027,
      webhookId: 2401943, // H&S Revenue Intelligence Platform Webhook
      airtableBaseId: 'app0jJkgTCqn46vp9'
    };

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'make_list_scenarios',
            description: 'List all scenarios in Make.com account',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          },
          {
            name: 'make_run_scenario',
            description: 'Execute a specific scenario by ID',
            inputSchema: {
              type: 'object',
              properties: {
                scenarioId: {
                  type: 'number',
                  description: 'The ID of the scenario to run'
                }
              },
              required: ['scenarioId']
            }
          },
          {
            name: 'make_get_scenario',
            description: 'Get detailed information about a specific scenario',
            inputSchema: {
              type: 'object',
              properties: {
                scenarioId: {
                  type: 'number',
                  description: 'The ID of the scenario to retrieve'
                }
              },
              required: ['scenarioId']
            }
          },
          {
            name: 'make_create_resources_library_scenario',
            description: 'Create AI-generated resources library processing scenario',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name for the scenario'
                },
                resourceTypes: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Types of resources to generate (icp_templates, roi_calculators, business_cases, etc.)'
                }
              },
              required: ['name']
            }
          },
          {
            name: 'make_create_revenue_intelligence_scenario',
            description: 'Create comprehensive revenue intelligence processing scenario',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name for the scenario'
                },
                webhookId: {
                  type: 'number',
                  description: 'Webhook ID to use (defaults to H&S platform webhook)'
                }
              },
              required: ['name']
            }
          },
          {
            name: 'make_activate_scenario',
            description: 'Activate a scenario to start processing',
            inputSchema: {
              type: 'object',
              properties: {
                scenarioId: {
                  type: 'number',
                  description: 'The ID of the scenario to activate'
                }
              },
              required: ['scenarioId']
            }
          },
          {
            name: 'make_deactivate_scenario',
            description: 'Deactivate a scenario to stop processing',
            inputSchema: {
              type: 'object',
              properties: {
                scenarioId: {
                  type: 'number',
                  description: 'The ID of the scenario to deactivate'
                }
              },
              required: ['scenarioId']
            }
          },
          {
            name: 'make_trigger_resources_generation',
            description: 'Trigger AI resource generation via webhook',
            inputSchema: {
              type: 'object',
              properties: {
                resourceType: {
                  type: 'string',
                  description: 'Type of resource to generate'
                },
                parameters: {
                  type: 'object',
                  description: 'Parameters for resource generation'
                }
              },
              required: ['resourceType']
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'make_list_scenarios':
            return await this.listScenarios();
          
          case 'make_run_scenario':
            return await this.runScenario(args.scenarioId);
          
          case 'make_get_scenario':
            return await this.getScenario(args.scenarioId);
          
          case 'make_create_resources_library_scenario':
            return await this.createResourcesLibraryScenario(args.name, args.resourceTypes);
          
          case 'make_create_revenue_intelligence_scenario':
            return await this.createRevenueIntelligenceScenario(args.name, args.webhookId);
          
          case 'make_activate_scenario':
            return await this.activateScenario(args.scenarioId);
          
          case 'make_deactivate_scenario':
            return await this.deactivateScenario(args.scenarioId);
          
          case 'make_trigger_resources_generation':
            return await this.triggerResourcesGeneration(args.resourceType, args.parameters);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    if (!this.apiToken) {
      throw new Error('MAKE_API_TOKEN environment variable is required');
    }

    const config = {
      method,
      url: `${this.baseURL}${endpoint}`,
      headers: {
        'Authorization': `Token ${this.apiToken}`,
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  }

  async listScenarios() {
    const data = await this.makeRequest(`/scenarios?organizationId=${this.hsConfig.orgId}`);
    
    return {
      content: [
        {
          type: 'text',
          text: `Found ${data.scenarios?.length || 0} scenarios:\n\n${
            data.scenarios?.map(scenario => 
              `${scenario.id}: ${scenario.name} (${scenario.isActive ? 'Active' : 'Inactive'})`
            ).join('\n') || 'No scenarios found'
          }`
        }
      ]
    };
  }

  async runScenario(scenarioId) {
    const data = await this.makeRequest(`/scenarios/${scenarioId}/run`, 'POST');
    
    return {
      content: [
        {
          type: 'text',
          text: `Scenario ${scenarioId} execution started.\nExecution ID: ${data.executionId || 'N/A'}`
        }
      ]
    };
  }

  async getScenario(scenarioId) {
    const data = await this.makeRequest(`/scenarios/${scenarioId}`);
    
    return {
      content: [
        {
          type: 'text',
          text: `Scenario Details:\n\n${JSON.stringify(data, null, 2)}`
        }
      ]
    };
  }

  async createResourcesLibraryScenario(name, resourceTypes = ['icp_templates', 'roi_calculators', 'business_cases']) {
    const scenarioConfig = {
      name: name || 'AI Resources Library Generator',
      teamId: this.hsConfig.teamId,
      blueprint: {
        flow: [
          {
            id: 1,
            module: 'webhook',
            version: 1,
            parameters: {
              hook: this.hsConfig.webhookId
            },
            mapper: {},
            metadata: {
              designer: { x: 0, y: 0 }
            }
          },
          {
            id: 2,
            module: 'json:ParseJSON',
            version: 1,
            parameters: {},
            mapper: {
              json: '{{1.resourceRequest}}'
            },
            metadata: {
              designer: { x: 300, y: 0 }
            }
          },
          {
            id: 3,
            module: 'router',
            version: 1,
            routes: resourceTypes.map((type, index) => ({
              id: index + 4,
              module: 'openai-gpt-3:createCompletion',
              version: 1,
              parameters: {
                model: 'gpt-4',
                max_tokens: 2000,
                temperature: 0.7
              },
              mapper: {
                prompt: this.getResourceGenerationPrompt(type),
                context: '{{2.customerData}}'
              },
              metadata: {
                designer: { x: 600, y: index * 150 }
              }
            })),
            metadata: {
              designer: { x: 450, y: 0 }
            }
          },
          ...resourceTypes.map((type, index) => ({
            id: index + 4 + resourceTypes.length,
            module: 'airtable2:ActionCreateRecord',
            version: 3,
            parameters: {
              base: this.hsConfig.airtableBaseId,
              typecast: false
            },
            mapper: {
              table: 'Resources Library',
              fields: {
                'Resource Type': type,
                'Generated Content': `{{${index + 4}.choices[].text}}`,
                'Customer ID': '{{2.customerId}}',
                'Generation Date': '{{now}}',
                'Status': 'Generated'
              }
            },
            metadata: {
              designer: { x: 900, y: index * 150 }
            }
          }))
        ]
      }
    };

    const data = await this.makeRequest('/scenarios', 'POST', scenarioConfig);
    
    return {
      content: [
        {
          type: 'text',
          text: `Created Resources Library scenario "${name}" with ID: ${data.id}\n\nResource types: ${resourceTypes.join(', ')}\n\nScenario is ready for activation.`
        }
      ]
    };
  }

  async createRevenueIntelligenceScenario(name, webhookId = null) {
    const useWebhook = webhookId || this.hsConfig.webhookId;
    
    const scenarioConfig = {
      name: name || 'H&S Revenue Intelligence Processor',
      orgId: this.hsConfig.orgId,
      teamId: this.hsConfig.teamId,
      blueprint: {
        flow: [
          {
            id: 1,
            module: 'webhook',
            version: 1,
            parameters: {
              hook: useWebhook
            }
          },
          {
            id: 2,
            module: 'json:ParseJSON',
            version: 1,
            mapper: {
              json: '{{1.data}}'
            }
          },
          {
            id: 3,
            module: 'router',
            version: 1,
            routes: [
              {
                id: 4,
                module: 'airtable2:ActionUpdateRecord',
                parameters: {
                  base: this.hsConfig.airtableBaseId
                },
                mapper: {
                  table: 'Customer Assets',
                  record: '{{2.customerId}}',
                  fields: {
                    'ICP Content': '{{2.icpAnalysis}}',
                    'Cost Calculator Content': '{{2.costCalculator}}',
                    'Business Case Content': '{{2.businessCase}}',
                    'Last Accessed': '{{now}}'
                  }
                }
              },
              {
                id: 5,
                module: 'openai-gpt-3:createCompletion',
                parameters: {
                  model: 'gpt-4',
                  max_tokens: 1500
                },
                mapper: {
                  prompt: 'Generate professional sales resources based on: {{2.analysisData}}'
                }
              }
            ]
          }
        ]
      }
    };

    const data = await this.makeRequest('/scenarios', 'POST', scenarioConfig);
    
    return {
      content: [
        {
          type: 'text',
          text: `Created Revenue Intelligence scenario "${name}" with ID: ${data.id}\n\nWebhook ID: ${useWebhook}\nConnected to Airtable base: ${this.hsConfig.airtableBaseId}\n\nScenario is ready for activation.`
        }
      ]
    };
  }

  async activateScenario(scenarioId) {
    const data = await this.makeRequest(`/scenarios/${scenarioId}/start`, 'POST');
    
    return {
      content: [
        {
          type: 'text',
          text: `Scenario ${scenarioId} has been activated and is now processing incoming data.`
        }
      ]
    };
  }

  async deactivateScenario(scenarioId) {
    const data = await this.makeRequest(`/scenarios/${scenarioId}/stop`, 'POST');
    
    return {
      content: [
        {
          type: 'text',
          text: `Scenario ${scenarioId} has been deactivated and stopped processing.`
        }
      ]
    };
  }

  async triggerResourcesGeneration(resourceType, parameters = {}) {
    const webhookUrl = `https://hook.us1.make.com/webhook-url-here`; // This would be the actual webhook URL
    
    const payload = {
      resourceRequest: {
        type: resourceType,
        parameters,
        timestamp: Date.now(),
        customerId: parameters.customerId || 'SYSTEM_GENERATED'
      }
    };

    try {
      const response = await axios.post(webhookUrl, payload);
      
      return {
        content: [
          {
            type: 'text',
            text: `Resource generation triggered for ${resourceType}\n\nPayload sent:\n${JSON.stringify(payload, null, 2)}\n\nResponse: ${response.status}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to trigger resource generation: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }

  getResourceGenerationPrompt(resourceType) {
    const prompts = {
      'icp_templates': `Generate a comprehensive ICP (Ideal Customer Profile) template for B2B SaaS companies. Include:
1. Company Demographics (size, industry, revenue)
2. Technology Stack indicators
3. Pain Point categories
4. Decision-maker profiles
5. Budget and timeline characteristics
Format as a structured template with scoring criteria.`,

      'roi_calculators': `Create an ROI calculator template for B2B software solutions. Include:
1. Cost of Inaction calculations
2. Efficiency gain multipliers
3. Revenue impact projections
4. Implementation cost factors
5. Payback period calculations
Format as a spreadsheet-ready template with formulas.`,

      'business_cases': `Generate a business case template for enterprise software adoption. Include:
1. Executive Summary structure
2. Problem Statement framework
3. Solution Benefits breakdown
4. Financial Projections template
5. Risk Assessment categories
6. Implementation Timeline
Format as a professional presentation template.`,

      'sales_scripts': `Create sales conversation scripts for different stakeholder types:
1. Technical Decision Makers
2. Economic Buyers (CFO/Finance)
3. End Users
4. Executive Sponsors
Include objection handling and value proposition positioning.`,

      'competitive_analysis': `Generate competitive analysis templates including:
1. Feature comparison matrices
2. Pricing analysis frameworks
3. Positioning differentiation
4. Win/loss analysis structure
5. Competitive response strategies`,

      'market_research': `Create market research templates for:
1. Industry analysis frameworks
2. Market sizing methodologies
3. Trend identification processes
4. Customer interview guides
5. Survey templates for market validation`
    };

    return prompts[resourceType] || prompts['business_cases'];
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Make.com MCP Server running on stdio');
  }
}

// Handle command line usage
if (require.main === module) {
  const server = new MakeMCPServer();
  
  // Handle command line arguments
  const command = process.argv[2];
  
  if (command === 'list-scenarios') {
    server.listScenarios().then(result => {
      console.log(result.content[0].text);
      process.exit(0);
    }).catch(error => {
      console.error('Error:', error.message);
      process.exit(1);
    });
  } else if (command === '--help') {
    console.log(`
Make.com MCP Server for H&S Revenue Intelligence Platform

Usage:
  node index.js                    # Run MCP server on stdio
  node index.js list-scenarios     # List all scenarios
  node index.js --help            # Show this help

Environment Variables:
  MAKE_API_TOKEN                  # Your Make.com API token (required)

MCP Tools Available:
  - make_list_scenarios
  - make_run_scenario
  - make_get_scenario  
  - make_create_resources_library_scenario
  - make_create_revenue_intelligence_scenario
  - make_activate_scenario
  - make_deactivate_scenario
  - make_trigger_resources_generation
`);
    process.exit(0);
  } else {
    server.run().catch(console.error);
  }
}

module.exports = MakeMCPServer;