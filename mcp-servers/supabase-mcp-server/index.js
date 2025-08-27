#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createClient } from '@supabase/supabase-js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';

class SupabaseMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'supabase-mcp-server-local',
        version: '1.0.0'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    // Initialize Supabase client
    const projectRef = process.env.SUPABASE_PROJECT_REF || 'molcqjsqtjbfclasynpg';
    const supabaseUrl = `https://${projectRef}.supabase.co`;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ACCESS_TOKEN;
    
    this.supabase = createClient(supabaseUrl, supabaseKey);

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'query_table',
            description: 'Query data from a Supabase table',
            inputSchema: {
              type: 'object',
              properties: {
                table: { type: 'string', description: 'Table name to query' },
                select: { type: 'string', description: 'Columns to select (default: "*")', default: '*' },
                filter: {
                  type: 'object',
                  description: 'Filter conditions',
                  properties: {
                    column: { type: 'string', description: 'Column to filter on' },
                    operator: { 
                      type: 'string', 
                      enum: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'in', 'contains'],
                      description: 'Filter operator'
                    },
                    value: { description: 'Value to filter by' }
                  }
                },
                limit: { type: 'number', description: 'Maximum number of rows to return' },
                orderBy: {
                  type: 'object',
                  properties: {
                    column: { type: 'string', description: 'Column to order by' },
                    ascending: { type: 'boolean', description: 'Order ascending (default: true)', default: true }
                  }
                }
              },
              required: ['table']
            }
          },
          {
            name: 'insert_data',
            description: 'Insert data into a Supabase table',
            inputSchema: {
              type: 'object',
              properties: {
                table: { type: 'string', description: 'Table name' },
                data: { 
                  description: 'Data to insert (object or array of objects)',
                  oneOf: [
                    { type: 'object' },
                    { type: 'array', items: { type: 'object' } }
                  ]
                },
                onConflict: { type: 'string', description: 'Conflict resolution strategy' }
              },
              required: ['table', 'data']
            }
          },
          {
            name: 'update_data',
            description: 'Update data in a Supabase table',
            inputSchema: {
              type: 'object',
              properties: {
                table: { type: 'string', description: 'Table name' },
                data: { type: 'object', description: 'Data to update' },
                filter: {
                  type: 'object',
                  description: 'Filter conditions for rows to update',
                  properties: {
                    column: { type: 'string', description: 'Column to filter on' },
                    operator: { 
                      type: 'string', 
                      enum: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'in'],
                      description: 'Filter operator'
                    },
                    value: { description: 'Value to filter by' }
                  },
                  required: ['column', 'operator', 'value']
                }
              },
              required: ['table', 'data', 'filter']
            }
          },
          {
            name: 'delete_data',
            description: 'Delete data from a Supabase table',
            inputSchema: {
              type: 'object',
              properties: {
                table: { type: 'string', description: 'Table name' },
                filter: {
                  type: 'object',
                  description: 'Filter conditions for rows to delete',
                  properties: {
                    column: { type: 'string', description: 'Column to filter on' },
                    operator: { 
                      type: 'string', 
                      enum: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'in'],
                      description: 'Filter operator'
                    },
                    value: { description: 'Value to filter by' }
                  },
                  required: ['column', 'operator', 'value']
                }
              },
              required: ['table', 'filter']
            }
          },
          {
            name: 'list_tables',
            description: 'List all tables in the database',
            inputSchema: {
              type: 'object',
              properties: {
                schema: { type: 'string', description: 'Schema name (default: "public")', default: 'public' }
              }
            }
          },
          {
            name: 'get_table_schema',
            description: 'Get schema information for a specific table',
            inputSchema: {
              type: 'object',
              properties: {
                table: { type: 'string', description: 'Table name' },
                schema: { type: 'string', description: 'Schema name (default: "public")', default: 'public' }
              },
              required: ['table']
            }
          },
          {
            name: 'execute_sql',
            description: 'Execute raw SQL query (use with caution)',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'SQL query to execute' },
                params: { 
                  type: 'array', 
                  description: 'Query parameters (for parameterized queries)',
                  items: { type: 'string' }
                }
              },
              required: ['query']
            }
          },
          {
            name: 'call_function',
            description: 'Call a Supabase database function',
            inputSchema: {
              type: 'object',
              properties: {
                function_name: { type: 'string', description: 'Name of the function to call' },
                params: { type: 'object', description: 'Function parameters' }
              },
              required: ['function_name']
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'query_table':
            return await this.queryTable(request.params.arguments);
          
          case 'insert_data':
            return await this.insertData(request.params.arguments);
          
          case 'update_data':
            return await this.updateData(request.params.arguments);
          
          case 'delete_data':
            return await this.deleteData(request.params.arguments);
          
          case 'list_tables':
            return await this.listTables(request.params.arguments);
          
          case 'get_table_schema':
            return await this.getTableSchema(request.params.arguments);
          
          case 'execute_sql':
            return await this.executeSql(request.params.arguments);
          
          case 'call_function':
            return await this.callFunction(request.params.arguments);
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        
        throw new McpError(
          ErrorCode.InternalError,
          `Supabase error: ${error.message}`
        );
      }
    });
  }

  async queryTable(args) {
    const { table, select = '*', filter, limit, orderBy } = args;
    
    let query = this.supabase.from(table).select(select);
    
    if (filter) {
      const { column, operator, value } = filter;
      query = query[operator](column, value);
    }
    
    if (orderBy) {
      query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Query failed: ${error.message}`);
    }

    return {
      content: [{
        type: 'text',
        text: `Query successful! Found ${data.length} rows:\n\n${JSON.stringify(data, null, 2)}`
      }]
    };
  }

  async insertData(args) {
    const { table, data, onConflict } = args;
    
    let query = this.supabase.from(table).insert(data);
    
    if (onConflict) {
      query = query.onConflict(onConflict);
    }
    
    const { data: result, error } = await query.select();
    
    if (error) {
      throw new Error(`Insert failed: ${error.message}`);
    }

    const insertCount = Array.isArray(result) ? result.length : 1;
    return {
      content: [{
        type: 'text',
        text: `Insert successful! ${insertCount} row(s) inserted:\n\n${JSON.stringify(result, null, 2)}`
      }]
    };
  }

  async updateData(args) {
    const { table, data, filter } = args;
    
    const { column, operator, value } = filter;
    const { data: result, error } = await this.supabase
      .from(table)
      .update(data)
      [operator](column, value)
      .select();
    
    if (error) {
      throw new Error(`Update failed: ${error.message}`);
    }

    const updateCount = Array.isArray(result) ? result.length : 0;
    return {
      content: [{
        type: 'text',
        text: `Update successful! ${updateCount} row(s) updated:\n\n${JSON.stringify(result, null, 2)}`
      }]
    };
  }

  async deleteData(args) {
    const { table, filter } = args;
    
    const { column, operator, value } = filter;
    const { data: result, error } = await this.supabase
      .from(table)
      .delete()
      [operator](column, value)
      .select();
    
    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }

    const deleteCount = Array.isArray(result) ? result.length : 0;
    return {
      content: [{
        type: 'text',
        text: `Delete successful! ${deleteCount} row(s) deleted:\n\n${JSON.stringify(result, null, 2)}`
      }]
    };
  }

  async listTables(args) {
    const { schema = 'public' } = args;
    
    const { data, error } = await this.supabase
      .from('information_schema.tables')
      .select('table_name, table_type')
      .eq('table_schema', schema);
    
    if (error) {
      throw new Error(`Failed to list tables: ${error.message}`);
    }

    return {
      content: [{
        type: 'text',
        text: `Tables in schema '${schema}':\n\n${JSON.stringify(data, null, 2)}`
      }]
    };
  }

  async getTableSchema(args) {
    const { table, schema = 'public' } = args;
    
    const { data, error } = await this.supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_schema', schema)
      .eq('table_name', table);
    
    if (error) {
      throw new Error(`Failed to get table schema: ${error.message}`);
    }

    return {
      content: [{
        type: 'text',
        text: `Schema for table '${table}':\n\n${JSON.stringify(data, null, 2)}`
      }]
    };
  }

  async executeSql(args) {
    const { query, params = [] } = args;
    
    const { data, error } = await this.supabase.rpc('exec_sql', {
      sql_query: query,
      sql_params: params
    });
    
    if (error) {
      throw new Error(`SQL execution failed: ${error.message}`);
    }

    return {
      content: [{
        type: 'text',
        text: `SQL executed successfully:\n\n${JSON.stringify(data, null, 2)}`
      }]
    };
  }

  async callFunction(args) {
    const { function_name, params = {} } = args;
    
    const { data, error } = await this.supabase.rpc(function_name, params);
    
    if (error) {
      throw new Error(`Function call failed: ${error.message}`);
    }

    return {
      content: [{
        type: 'text',
        text: `Function '${function_name}' executed successfully:\n\n${JSON.stringify(data, null, 2)}`
      }]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Supabase MCP Server running on stdio');
  }
}

const server = new SupabaseMCPServer();
server.run().catch(console.error);