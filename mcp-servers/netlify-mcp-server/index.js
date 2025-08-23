#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const axios = require('axios');

class NetlifyMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'netlify-mcp-server',
        version: '1.0.0'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.authToken = process.env.NETLIFY_AUTH_TOKEN;
    if (!this.authToken) {
      throw new Error('NETLIFY_AUTH_TOKEN environment variable is required');
    }

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'netlify_list_sites',
          description: 'List all Netlify sites in your account',
          inputSchema: {
            type: 'object',
            properties: {},
            required: []
          }
        },
        {
          name: 'netlify_get_site',
          description: 'Get details for a specific Netlify site',
          inputSchema: {
            type: 'object',
            properties: {
              siteId: {
                type: 'string',
                description: 'The site ID or domain name'
              }
            },
            required: ['siteId']
          }
        },
        {
          name: 'netlify_deploy_site',
          description: 'Trigger a new deployment for a site',
          inputSchema: {
            type: 'object',
            properties: {
              siteId: {
                type: 'string',
                description: 'The site ID'
              },
              title: {
                type: 'string',
                description: 'Optional deployment title'
              }
            },
            required: ['siteId']
          }
        },
        {
          name: 'netlify_update_site_settings',
          description: 'Update site settings including build configuration',
          inputSchema: {
            type: 'object',
            properties: {
              siteId: {
                type: 'string',
                description: 'The site ID'
              },
              settings: {
                type: 'object',
                description: 'Site settings to update',
                properties: {
                  repo: {
                    type: 'object',
                    properties: {
                      provider: { type: 'string' },
                      repo: { type: 'string' },
                      branch: { type: 'string' }
                    }
                  },
                  build_settings: {
                    type: 'object',
                    properties: {
                      cmd: { type: 'string' },
                      dir: { type: 'string' },
                      base: { type: 'string' }
                    }
                  }
                }
              }
            },
            required: ['siteId', 'settings']
          }
        },
        {
          name: 'netlify_list_env_vars',
          description: 'List environment variables for a site',
          inputSchema: {
            type: 'object',
            properties: {
              siteId: {
                type: 'string',
                description: 'The site ID'
              }
            },
            required: ['siteId']
          }
        },
        {
          name: 'netlify_set_env_var',
          description: 'Set an environment variable for a site',
          inputSchema: {
            type: 'object',
            properties: {
              siteId: {
                type: 'string',
                description: 'The site ID'
              },
              key: {
                type: 'string',
                description: 'Environment variable name'
              },
              value: {
                type: 'string',
                description: 'Environment variable value'
              }
            },
            required: ['siteId', 'key', 'value']
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case 'netlify_list_sites':
            return await this.listSites();
          case 'netlify_get_site':
            return await this.getSite(args.siteId);
          case 'netlify_deploy_site':
            return await this.deploySite(args.siteId, args.title);
          case 'netlify_update_site_settings':
            return await this.updateSiteSettings(args.siteId, args.settings);
          case 'netlify_list_env_vars':
            return await this.listEnvVars(args.siteId);
          case 'netlify_set_env_var':
            return await this.setEnvVar(args.siteId, args.key, args.value);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`
            }
          ]
        };
      }
    });
  }

  async makeNetlifyRequest(method, endpoint, data = null) {
    const config = {
      method,
      url: `https://api.netlify.com/api/v1${endpoint}`,
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  }

  async listSites() {
    try {
      const sites = await this.makeNetlifyRequest('GET', '/sites');
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(sites.map(site => ({
              id: site.id,
              name: site.name,
              url: site.url,
              admin_url: site.admin_url,
              state: site.state,
              updated_at: site.updated_at
            })), null, 2)
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to list sites: ${error.message}`);
    }
  }

  async getSite(siteId) {
    try {
      const site = await this.makeNetlifyRequest('GET', `/sites/${siteId}`);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(site, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to get site: ${error.message}`);
    }
  }

  async deploySite(siteId, title = 'Manual deployment via MCP') {
    try {
      const deployment = await this.makeNetlifyRequest('POST', `/sites/${siteId}/deploys`, {
        title: title
      });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              id: deployment.id,
              state: deployment.state,
              url: deployment.deploy_url,
              created_at: deployment.created_at
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to deploy site: ${error.message}`);
    }
  }

  async updateSiteSettings(siteId, settings) {
    try {
      const updatedSite = await this.makeNetlifyRequest('PATCH', `/sites/${siteId}`, settings);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(updatedSite, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to update site settings: ${error.message}`);
    }
  }

  async listEnvVars(siteId) {
    try {
      const envVars = await this.makeNetlifyRequest('GET', `/sites/${siteId}/env`);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(envVars, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to list environment variables: ${error.message}`);
    }
  }

  async setEnvVar(siteId, key, value) {
    try {
      const envVar = await this.makeNetlifyRequest('PUT', `/sites/${siteId}/env/${key}`, {
        value: value
      });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(envVar, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to set environment variable: ${error.message}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Netlify MCP server running on stdio');
  }
}

const server = new NetlifyMCPServer();
server.run().catch(console.error);