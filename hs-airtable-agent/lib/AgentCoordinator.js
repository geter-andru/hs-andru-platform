const fs = require('fs-extra');
const path = require('path');
const { default: chalk } = require('chalk');

class AgentCoordinator {
  constructor(config) {
    this.config = config;
    this.agentName = config.agentName;
    this.lockDir = config.coordination.lockDir;
    this.statusDir = config.coordination.statusDir;
    this.heartbeatInterval = config.coordination.heartbeatInterval;
    this.lockTimeout = config.coordination.lockTimeout;
    
    this.lockFile = path.join(this.lockDir, `${this.agentName}.lock`);
    this.statusFile = path.join(this.statusDir, `${this.agentName}.status`);
    this.globalLockFile = path.join(this.lockDir, 'airtable-operations.lock');
    
    this.heartbeatTimer = null;
    this.isActive = false;
  }

  async initialize() {
    try {
      // Ensure directories exist
      await fs.ensureDir(this.lockDir);
      await fs.ensureDir(this.statusDir);
      
      // Clean up any stale locks from previous runs
      await this.cleanupStaleLocks();
      
      console.log(chalk.green('✅ Agent coordinator initialized'));
      return true;
    } catch (error) {
      console.error(chalk.red('❌ Failed to initialize agent coordinator:'), error);
      return false;
    }
  }

  async acquireGlobalLock(operation, timeout = this.lockTimeout) {
    const lockData = {
      agent: this.agentName,
      operation,
      timestamp: new Date().toISOString(),
      pid: process.pid
    };

    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        // Check if lock exists
        if (await fs.pathExists(this.globalLockFile)) {
          const existingLock = await fs.readJson(this.globalLockFile);
          
          // Check if lock is stale (older than timeout)
          const lockAge = Date.now() - new Date(existingLock.timestamp).getTime();
          if (lockAge > this.lockTimeout) {
            console.log(chalk.yellow('⚠️ Removing stale lock from'), existingLock.agent);
            await fs.remove(this.globalLockFile);
          } else {
            // Lock is still valid, wait and retry
            console.log(chalk.blue('🔒 Waiting for'), existingLock.agent, 'to release lock...');
            await this.sleep(1000);
            continue;
          }
        }

        // Try to acquire lock
        await fs.writeJson(this.globalLockFile, lockData);
        
        // Verify we got the lock (race condition protection)
        await this.sleep(100);
        const verifyLock = await fs.readJson(this.globalLockFile);
        if (verifyLock.agent === this.agentName && verifyLock.timestamp === lockData.timestamp) {
          console.log(chalk.green('🔓 Acquired global lock for'), operation);
          return true;
        } else {
          console.log(chalk.yellow('⚠️ Lock acquired by another agent, retrying...'));
          await this.sleep(1000);
        }
      } catch (error) {
        console.error(chalk.red('❌ Error acquiring lock:'), error);
        await this.sleep(1000);
      }
    }

    throw new Error(`Failed to acquire global lock for ${operation} within ${timeout}ms`);
  }

  async releaseGlobalLock() {
    try {
      if (await fs.pathExists(this.globalLockFile)) {
        const existingLock = await fs.readJson(this.globalLockFile);
        if (existingLock.agent === this.agentName) {
          await fs.remove(this.globalLockFile);
          console.log(chalk.green('🔓 Released global lock'));
          return true;
        } else {
          console.log(chalk.yellow('⚠️ Cannot release lock owned by'), existingLock.agent);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error(chalk.red('❌ Error releasing lock:'), error);
      return false;
    }
  }

  async startHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }

    this.isActive = true;
    await this.updateStatus('active', 'Agent started and monitoring');

    this.heartbeatTimer = setInterval(async () => {
      try {
        await this.updateStatus('active', `Heartbeat at ${new Date().toISOString()}`);
      } catch (error) {
        console.error(chalk.red('❌ Heartbeat failed:'), error);
      }
    }, this.heartbeatInterval);

    console.log(chalk.green('💓 Started heartbeat monitoring'));
  }

  async stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    this.isActive = false;
    await this.updateStatus('stopped', 'Agent stopped');
    
    console.log(chalk.blue('💓 Stopped heartbeat monitoring'));
  }

  async updateStatus(state, message, metadata = {}) {
    const status = {
      agent: this.agentName,
      state,
      message,
      timestamp: new Date().toISOString(),
      pid: process.pid,
      metadata
    };

    try {
      await fs.writeJson(this.statusFile, status, { spaces: 2 });
    } catch (error) {
      console.error(chalk.red('❌ Failed to update status:'), error);
    }
  }

  async getActiveAgents() {
    try {
      const statusFiles = await fs.readdir(this.statusDir);
      const activeAgents = [];

      for (const file of statusFiles) {
        if (file.endsWith('.status')) {
          try {
            const statusPath = path.join(this.statusDir, file);
            const status = await fs.readJson(statusPath);
            
            // Check if status is recent (within 2 heartbeat intervals)
            const statusAge = Date.now() - new Date(status.timestamp).getTime();
            if (statusAge < this.heartbeatInterval * 2) {
              activeAgents.push(status);
            }
          } catch (error) {
            // Ignore invalid status files
          }
        }
      }

      return activeAgents;
    } catch (error) {
      console.error(chalk.red('❌ Failed to get active agents:'), error);
      return [];
    }
  }

  async checkCompatibility() {
    const activeAgents = await this.getActiveAgents();
    const conflicts = [];

    for (const agent of activeAgents) {
      if (agent.agent === 'netlify-agent' && agent.state === 'deploying') {
        conflicts.push({
          agent: agent.agent,
          reason: 'Netlify deployment in progress - avoid database changes',
          recommendation: 'Wait for deployment to complete'
        });
      }
      
      if (agent.agent === 'git-hooks-agent' && agent.state === 'validating') {
        conflicts.push({
          agent: agent.agent,
          reason: 'Git validation in progress - avoid file changes',
          recommendation: 'Wait for validation to complete'
        });
      }

      if (agent.metadata && agent.metadata.airtableOperations) {
        conflicts.push({
          agent: agent.agent,
          reason: 'Another agent is performing Airtable operations',
          recommendation: 'Coordinate database access'
        });
      }
    }

    return {
      compatible: conflicts.length === 0,
      conflicts,
      activeAgents: activeAgents.length
    };
  }

  async waitForCompatibility(maxWait = 60000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWait) {
      const compatibility = await this.checkCompatibility();
      
      if (compatibility.compatible) {
        console.log(chalk.green('✅ All agents compatible, proceeding'));
        return true;
      }

      console.log(chalk.yellow('⚠️ Waiting for agent compatibility...'));
      for (const conflict of compatibility.conflicts) {
        console.log(chalk.yellow(`   - ${conflict.agent}: ${conflict.reason}`));
      }

      await this.sleep(5000); // Wait 5 seconds before checking again
    }

    console.log(chalk.red('❌ Timeout waiting for agent compatibility'));
    return false;
  }

  async cleanupStaleLocks() {
    try {
      // Clean up global lock if stale
      if (await fs.pathExists(this.globalLockFile)) {
        const lockData = await fs.readJson(this.globalLockFile);
        const lockAge = Date.now() - new Date(lockData.timestamp).getTime();
        
        if (lockAge > this.lockTimeout) {
          await fs.remove(this.globalLockFile);
          console.log(chalk.yellow('🧹 Removed stale global lock'));
        }
      }

      // Clean up our own lock file
      if (await fs.pathExists(this.lockFile)) {
        await fs.remove(this.lockFile);
        console.log(chalk.yellow('🧹 Removed stale agent lock'));
      }

    } catch (error) {
      console.error(chalk.red('❌ Error cleaning up stale locks:'), error);
    }
  }

  async safeShutdown() {
    console.log(chalk.blue('🛑 Initiating safe shutdown...'));
    
    try {
      // Stop heartbeat
      await this.stopHeartbeat();
      
      // Release any locks we hold
      await this.releaseGlobalLock();
      
      // Clean up our files
      if (await fs.pathExists(this.lockFile)) {
        await fs.remove(this.lockFile);
      }
      
      console.log(chalk.green('✅ Safe shutdown completed'));
    } catch (error) {
      console.error(chalk.red('❌ Error during shutdown:'), error);
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = AgentCoordinator;