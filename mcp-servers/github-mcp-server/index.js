#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Octokit } from '@octokit/rest';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';

class GitHubMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'github-mcp-server-local',
        version: '1.0.0'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    // Initialize GitHub client
    this.octokit = new Octokit({
      auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
    });

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_repository',
            description: 'Create a new GitHub repository',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Repository name' },
                description: { type: 'string', description: 'Repository description' },
                private: { type: 'boolean', description: 'Whether the repository should be private', default: false },
                autoInit: { type: 'boolean', description: 'Initialize with README.md', default: false }
              },
              required: ['name']
            }
          },
          {
            name: 'get_file_contents',
            description: 'Get the contents of a file from a GitHub repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: { type: 'string', description: 'Repository owner' },
                repo: { type: 'string', description: 'Repository name' },
                path: { type: 'string', description: 'Path to the file' },
                branch: { type: 'string', description: 'Branch to get contents from', default: 'main' }
              },
              required: ['owner', 'repo', 'path']
            }
          },
          {
            name: 'create_or_update_file',
            description: 'Create or update a single file in a GitHub repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: { type: 'string', description: 'Repository owner' },
                repo: { type: 'string', description: 'Repository name' },
                path: { type: 'string', description: 'Path where to create/update the file' },
                content: { type: 'string', description: 'Content of the file' },
                message: { type: 'string', description: 'Commit message' },
                branch: { type: 'string', description: 'Branch to create/update the file in', default: 'main' },
                sha: { type: 'string', description: 'SHA of the file being replaced (required when updating)' }
              },
              required: ['owner', 'repo', 'path', 'content', 'message', 'branch']
            }
          },
          {
            name: 'push_files',
            description: 'Push multiple files to a GitHub repository in a single commit',
            inputSchema: {
              type: 'object',
              properties: {
                owner: { type: 'string', description: 'Repository owner' },
                repo: { type: 'string', description: 'Repository name' },
                branch: { type: 'string', description: 'Branch to push to' },
                files: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      path: { type: 'string' },
                      content: { type: 'string' }
                    },
                    required: ['path', 'content']
                  }
                },
                message: { type: 'string', description: 'Commit message' }
              },
              required: ['owner', 'repo', 'branch', 'files', 'message']
            }
          },
          {
            name: 'create_issue',
            description: 'Create a new issue in a GitHub repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: { type: 'string' },
                repo: { type: 'string' },
                title: { type: 'string' },
                body: { type: 'string' },
                labels: { type: 'array', items: { type: 'string' } },
                assignees: { type: 'array', items: { type: 'string' } }
              },
              required: ['owner', 'repo', 'title']
            }
          },
          {
            name: 'create_pull_request',
            description: 'Create a new pull request in a GitHub repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: { type: 'string', description: 'Repository owner' },
                repo: { type: 'string', description: 'Repository name' },
                title: { type: 'string', description: 'Pull request title' },
                head: { type: 'string', description: 'Branch where changes are implemented' },
                base: { type: 'string', description: 'Branch you want changes pulled into' },
                body: { type: 'string', description: 'Pull request description' },
                draft: { type: 'boolean', description: 'Create as draft PR' }
              },
              required: ['owner', 'repo', 'title', 'head', 'base']
            }
          },
          {
            name: 'search_repositories',
            description: 'Search for GitHub repositories',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'Search query' },
                page: { type: 'number', description: 'Page number', default: 1 },
                perPage: { type: 'number', description: 'Results per page', default: 30, maximum: 100 }
              },
              required: ['query']
            }
          },
          {
            name: 'search_code',
            description: 'Search for code across GitHub repositories',
            inputSchema: {
              type: 'object',
              properties: {
                q: { type: 'string', description: 'Search query' },
                page: { type: 'number', description: 'Page number', minimum: 1 },
                per_page: { type: 'number', description: 'Results per page', minimum: 1, maximum: 100 }
              },
              required: ['q']
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'create_repository':
            return await this.createRepository(request.params.arguments);
          
          case 'get_file_contents':
            return await this.getFileContents(request.params.arguments);
          
          case 'create_or_update_file':
            return await this.createOrUpdateFile(request.params.arguments);
          
          case 'push_files':
            return await this.pushFiles(request.params.arguments);
          
          case 'create_issue':
            return await this.createIssue(request.params.arguments);
          
          case 'create_pull_request':
            return await this.createPullRequest(request.params.arguments);
          
          case 'search_repositories':
            return await this.searchRepositories(request.params.arguments);
          
          case 'search_code':
            return await this.searchCode(request.params.arguments);
          
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
          `GitHub API error: ${error.message}`
        );
      }
    });
  }

  async createRepository(args) {
    const { name, description = '', private: isPrivate = false, autoInit = false } = args;
    
    const response = await this.octokit.rest.repos.createForAuthenticatedUser({
      name,
      description,
      private: isPrivate,
      auto_init: autoInit
    });

    return {
      content: [{
        type: 'text',
        text: `Repository created successfully!\n\nName: ${response.data.name}\nURL: ${response.data.html_url}\nClone URL: ${response.data.clone_url}`
      }]
    };
  }

  async getFileContents(args) {
    const { owner, repo, path, branch = 'main' } = args;
    
    const response = await this.octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref: branch
    });

    if (Array.isArray(response.data)) {
      // Directory listing
      const files = response.data.map(item => ({
        name: item.name,
        type: item.type,
        size: item.size,
        url: item.html_url
      }));

      return {
        content: [{
          type: 'text',
          text: `Directory contents:\n${JSON.stringify(files, null, 2)}`
        }]
      };
    } else {
      // File content
      const content = Buffer.from(response.data.content, 'base64').toString('utf8');
      
      return {
        content: [{
          type: 'text',
          text: content
        }]
      };
    }
  }

  async createOrUpdateFile(args) {
    const { owner, repo, path, content, message, branch = 'main', sha } = args;
    
    const params = {
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      branch
    };

    if (sha) {
      params.sha = sha;
    }

    const response = await this.octokit.rest.repos.createOrUpdateFileContents(params);

    return {
      content: [{
        type: 'text',
        text: `File ${sha ? 'updated' : 'created'} successfully!\n\nPath: ${path}\nCommit: ${response.data.commit.html_url}\nSHA: ${response.data.content.sha}`
      }]
    };
  }

  async pushFiles(args) {
    const { owner, repo, branch, files, message } = args;

    // Get the current branch reference
    const refResponse = await this.octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`
    });

    const baseCommitSha = refResponse.data.object.sha;

    // Get the base tree
    const baseCommitResponse = await this.octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha: baseCommitSha
    });

    const baseTreeSha = baseCommitResponse.data.tree.sha;

    // Create blobs for all files
    const tree = [];
    for (const file of files) {
      const blobResponse = await this.octokit.rest.git.createBlob({
        owner,
        repo,
        content: Buffer.from(file.content).toString('base64'),
        encoding: 'base64'
      });

      tree.push({
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: blobResponse.data.sha
      });
    }

    // Create new tree
    const treeResponse = await this.octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: baseTreeSha,
      tree
    });

    // Create commit
    const commitResponse = await this.octokit.rest.git.createCommit({
      owner,
      repo,
      message,
      tree: treeResponse.data.sha,
      parents: [baseCommitSha]
    });

    // Update reference
    await this.octokit.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: commitResponse.data.sha
    });

    return {
      content: [{
        type: 'text',
        text: `${files.length} files pushed successfully!\n\nCommit: ${commitResponse.data.html_url}\nFiles: ${files.map(f => f.path).join(', ')}`
      }]
    };
  }

  async createIssue(args) {
    const { owner, repo, title, body = '', labels = [], assignees = [] } = args;
    
    const response = await this.octokit.rest.issues.create({
      owner,
      repo,
      title,
      body,
      labels,
      assignees
    });

    return {
      content: [{
        type: 'text',
        text: `Issue created successfully!\n\nTitle: ${response.data.title}\nNumber: #${response.data.number}\nURL: ${response.data.html_url}`
      }]
    };
  }

  async createPullRequest(args) {
    const { owner, repo, title, head, base, body = '', draft = false } = args;
    
    const response = await this.octokit.rest.pulls.create({
      owner,
      repo,
      title,
      head,
      base,
      body,
      draft
    });

    return {
      content: [{
        type: 'text',
        text: `Pull request created successfully!\n\nTitle: ${response.data.title}\nNumber: #${response.data.number}\nURL: ${response.data.html_url}\nState: ${response.data.state}`
      }]
    };
  }

  async searchRepositories(args) {
    const { query, page = 1, perPage = 30 } = args;
    
    const response = await this.octokit.rest.search.repos({
      q: query,
      page,
      per_page: perPage
    });

    const repos = response.data.items.map(repo => ({
      name: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      language: repo.language,
      updated: repo.updated_at
    }));

    return {
      content: [{
        type: 'text',
        text: `Found ${response.data.total_count} repositories:\n\n${JSON.stringify(repos, null, 2)}`
      }]
    };
  }

  async searchCode(args) {
    const { q, page = 1, per_page = 30 } = args;
    
    const response = await this.octokit.rest.search.code({
      q,
      page,
      per_page
    });

    const results = response.data.items.map(item => ({
      name: item.name,
      path: item.path,
      repository: item.repository.full_name,
      url: item.html_url,
      score: item.score
    }));

    return {
      content: [{
        type: 'text',
        text: `Found ${response.data.total_count} code results:\n\n${JSON.stringify(results, null, 2)}`
      }]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('GitHub MCP Server running on stdio');
  }
}

const server = new GitHubMCPServer();
server.run().catch(console.error);