#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Start the Canva CLI MCP server
const canvaCliPath = path.join(__dirname, 'node_modules', '.bin', 'canva');
const mcpProcess = spawn(canvaCliPath, ['mcp'], {
  stdio: 'inherit',
  env: process.env
});

mcpProcess.on('close', (code) => {
  console.log(`Canva MCP server exited with code ${code}`);
});

mcpProcess.on('error', (err) => {
  console.error('Failed to start Canva MCP server:', err);
});