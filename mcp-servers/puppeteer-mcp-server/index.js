#!/usr/bin/env node

/**
 * Puppeteer MCP Server for H&S Revenue Intelligence Platform
 * Provides web automation capabilities for Claude Code
 */

const { createServer } = require('@modelcontextprotocol/server-puppeteer');

// Start the Puppeteer MCP server
const server = createServer();

server.run().catch(console.error);