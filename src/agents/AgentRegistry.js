/**
 * Advanced Agent Registry System
 * 
 * Sophisticated agent discovery, registration, health monitoring and capability management
 * Supports dynamic agent registration and advanced querying
 */

class AgentRegistry {
  constructor() {
    this.agents = new Map();
    this.healthCheckInterval = null;
    this.healthCheckIntervalMs = 30000; // 30 seconds
    this.capabilities = new Map(); // Track agent capabilities
    this.agentRelationships = new Map(); // Track agent dependencies and relationships
    this.performanceHistory = new Map(); // Track performance over time
    
    this.startHealthMonitoring();
  }

  /**
   * Register an agent with full metadata
   */
  registerAgent(agentName, agentInfo) {
    const fullAgentInfo = {
      name: agentName,
      ...agentInfo,
      registeredAt: Date.now(),
      lastHealthCheck: Date.now(),
      healthStatus: 'unknown',
      healthHistory: [],
      executionHistory: [],
      capabilities: agentInfo.capabilities || [],
      dependencies: agentInfo.dependencies || [],
      tags: agentInfo.tags || [],
      version: agentInfo.version || '1.0.0',
      metadata: agentInfo.metadata || {}
    };

    this.agents.set(agentName, fullAgentInfo);
    this.updateCapabilitiesIndex(agentName, fullAgentInfo.capabilities);
    
    console.log(`📋 AgentRegistry: Registered '${agentName}' (${fullAgentInfo.type})`);
    return fullAgentInfo;
  }

  /**
   * Unregister an agent
   */
  unregisterAgent(agentName) {
    const agent = this.agents.get(agentName);
    if (agent) {
      this.agents.delete(agentName);
      this.removeFromCapabilitiesIndex(agentName);
      console.log(`🗑️ AgentRegistry: Unregistered '${agentName}'`);
      return true;
    }
    return false;
  }

  /**
   * Get agent information
   */
  getAgent(agentName) {
    return this.agents.get(agentName) || null;
  }

  /**
   * Check if agent is available and healthy
   */
  isAgentAvailable(agentName) {
    const agent = this.agents.get(agentName);
    return agent && 
           (agent.status === 'available' || agent.status === 'ready') && 
           agent.healthStatus !== 'unhealthy';
  }

  /**
   * Find agents by criteria
   */
  findAgents(criteria) {
    const results = [];
    
    for (const [name, agent] of this.agents) {
      let matches = true;
      
      // Check type
      if (criteria.type && agent.type !== criteria.type) {
        matches = false;
      }
      
      // Check orchestrator
      if (criteria.orchestrator && agent.orchestrator !== criteria.orchestrator) {
        matches = false;
      }
      
      // Check capabilities
      if (criteria.capabilities) {
        const requiredCapabilities = Array.isArray(criteria.capabilities) 
          ? criteria.capabilities 
          : [criteria.capabilities];
        
        const hasAllCapabilities = requiredCapabilities.every(cap => 
          agent.capabilities.includes(cap));
        
        if (!hasAllCapabilities) {
          matches = false;
        }
      }
      
      // Check tags
      if (criteria.tags) {
        const requiredTags = Array.isArray(criteria.tags) ? criteria.tags : [criteria.tags];
        const hasAllTags = requiredTags.every(tag => agent.tags.includes(tag));
        
        if (!hasAllTags) {
          matches = false;
        }
      }
      
      // Check status
      if (criteria.status && agent.status !== criteria.status) {
        matches = false;
      }
      
      // Check health status
      if (criteria.healthStatus && agent.healthStatus !== criteria.healthStatus) {
        matches = false;
      }
      
      if (matches) {
        results.push(agent);
      }
    }
    
    return results;
  }

  /**
   * Get all agents as array
   */
  getAllAgents() {
    return Array.from(this.agents.values());
  }

  /**
   * Get agents by orchestrator
   */
  getAgentsByOrchestrator(orchestrator) {
    return this.findAgents({ orchestrator });
  }

  /**
   * Get agents by capability
   */
  getAgentsByCapability(capability) {
    return this.findAgents({ capabilities: capability });
  }

  /**
   * Update agent status
   */
  updateAgentStatus(agentName, status, metadata = {}) {
    const agent = this.agents.get(agentName);
    if (agent) {
      const previousStatus = agent.status;
      agent.status = status;
      agent.lastActivity = Date.now();
      agent.metadata = { ...agent.metadata, ...metadata };
      
      // Track status changes
      if (previousStatus !== status) {
        console.log(`🔄 AgentRegistry: ${agentName} status: ${previousStatus} → ${status}`);
      }
      
      return true;
    }
    return false;
  }

  /**
   * Record agent execution
   */
  recordExecution(agentName, operation, executionTime, success, result = {}) {
    const agent = this.agents.get(agentName);
    if (agent) {
      agent.executionCount = (agent.executionCount || 0) + 1;
      agent.lastActivity = Date.now();
      
      // Add to execution history (keep last 100)
      agent.executionHistory = agent.executionHistory || [];
      agent.executionHistory.unshift({
        operation,
        executionTime,
        success,
        timestamp: Date.now(),
        result: result.summary || 'completed'
      });
      
      if (agent.executionHistory.length > 100) {
        agent.executionHistory = agent.executionHistory.slice(0, 100);
      }
      
      // Update performance history for analytics
      this.updatePerformanceHistory(agentName, executionTime, success);
      
      return true;
    }
    return false;
  }

  /**
   * Perform health check on all agents
   */
  async performHealthCheck() {
    const healthCheckResults = {
      timestamp: Date.now(),
      totalAgents: this.agents.size,
      healthyAgents: 0,
      unhealthyAgents: 0,
      unknownAgents: 0,
      results: []
    };
    
    for (const [name, agent] of this.agents) {
      const healthResult = await this.checkAgentHealth(name, agent);
      healthCheckResults.results.push(healthResult);
      
      // Update counts
      switch (healthResult.status) {
        case 'healthy':
          healthCheckResults.healthyAgents++;
          break;
        case 'unhealthy':
          healthCheckResults.unhealthyAgents++;
          break;
        default:
          healthCheckResults.unknownAgents++;
      }
    }
    
    return healthCheckResults;
  }

  /**
   * Check individual agent health
   */
  async checkAgentHealth(agentName, agent) {
    const healthResult = {
      agentName,
      status: 'unknown',
      checks: {},
      timestamp: Date.now()
    };
    
    try {
      // Check 1: Recent activity (has been active in last 5 minutes)
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
      const hasRecentActivity = agent.lastActivity && agent.lastActivity > fiveMinutesAgo;
      healthResult.checks.recentActivity = hasRecentActivity;
      
      // Check 2: Execution success rate (last 10 executions)
      const recentExecutions = (agent.executionHistory || []).slice(0, 10);
      const successRate = recentExecutions.length > 0 
        ? recentExecutions.filter(ex => ex.success).length / recentExecutions.length 
        : 1;
      healthResult.checks.successRate = successRate;
      healthResult.checks.isSuccessRateHealthy = successRate >= 0.8;
      
      // Check 3: Status is not error
      healthResult.checks.statusOk = agent.status !== 'error';
      
      // Determine overall health
      const checksCount = Object.values(healthResult.checks).filter(c => typeof c === 'boolean').length;
      const passedChecks = Object.values(healthResult.checks).filter(c => c === true).length;
      const healthPercentage = checksCount > 0 ? passedChecks / checksCount : 0;
      
      if (healthPercentage >= 0.8) {
        healthResult.status = 'healthy';
      } else if (healthPercentage >= 0.5) {
        healthResult.status = 'degraded';
      } else {
        healthResult.status = 'unhealthy';
      }
      
      // Update agent health
      agent.healthStatus = healthResult.status;
      agent.lastHealthCheck = Date.now();
      
      // Add to health history (keep last 50)
      agent.healthHistory = agent.healthHistory || [];
      agent.healthHistory.unshift({
        status: healthResult.status,
        checks: healthResult.checks,
        timestamp: Date.now()
      });
      
      if (agent.healthHistory.length > 50) {
        agent.healthHistory = agent.healthHistory.slice(0, 50);
      }
      
    } catch (error) {
      healthResult.status = 'error';
      healthResult.error = error.message;
    }
    
    return healthResult;
  }

  /**
   * Get agent registry statistics
   */
  getStatistics() {
    const stats = {
      totalAgents: this.agents.size,
      agentsByType: new Map(),
      agentsByOrchestrator: new Map(),
      agentsByStatus: new Map(),
      agentsByHealth: new Map(),
      totalCapabilities: this.capabilities.size,
      averageExecutionsPerAgent: 0,
      topPerformingAgents: [],
      oldestRegistration: null,
      newestRegistration: null
    };
    
    let totalExecutions = 0;
    const agents = Array.from(this.agents.values());
    
    agents.forEach(agent => {
      // Count by type
      const typeCount = stats.agentsByType.get(agent.type) || 0;
      stats.agentsByType.set(agent.type, typeCount + 1);
      
      // Count by orchestrator
      const orchCount = stats.agentsByOrchestrator.get(agent.orchestrator) || 0;
      stats.agentsByOrchestrator.set(agent.orchestrator, orchCount + 1);
      
      // Count by status
      const statusCount = stats.agentsByStatus.get(agent.status) || 0;
      stats.agentsByStatus.set(agent.status, statusCount + 1);
      
      // Count by health
      const healthCount = stats.agentsByHealth.get(agent.healthStatus) || 0;
      stats.agentsByHealth.set(agent.healthStatus, healthCount + 1);
      
      // Track executions
      totalExecutions += agent.executionCount || 0;
      
      // Track registration times
      if (!stats.oldestRegistration || agent.registeredAt < stats.oldestRegistration) {
        stats.oldestRegistration = agent.registeredAt;
      }
      if (!stats.newestRegistration || agent.registeredAt > stats.newestRegistration) {
        stats.newestRegistration = agent.registeredAt;
      }
    });
    
    stats.averageExecutionsPerAgent = agents.length > 0 
      ? Math.round(totalExecutions / agents.length) 
      : 0;
    
    // Get top performing agents
    stats.topPerformingAgents = agents
      .filter(agent => (agent.executionCount || 0) > 0)
      .sort((a, b) => (b.executionCount || 0) - (a.executionCount || 0))
      .slice(0, 5)
      .map(agent => ({
        name: agent.name,
        executions: agent.executionCount,
        type: agent.type
      }));
    
    return stats;
  }

  /**
   * Update capabilities index
   */
  updateCapabilitiesIndex(agentName, capabilities) {
    capabilities.forEach(capability => {
      if (!this.capabilities.has(capability)) {
        this.capabilities.set(capability, new Set());
      }
      this.capabilities.get(capability).add(agentName);
    });
  }

  /**
   * Remove agent from capabilities index
   */
  removeFromCapabilitiesIndex(agentName) {
    for (const [capability, agentSet] of this.capabilities) {
      agentSet.delete(agentName);
      if (agentSet.size === 0) {
        this.capabilities.delete(capability);
      }
    }
  }

  /**
   * Update performance history
   */
  updatePerformanceHistory(agentName, executionTime, success) {
    if (!this.performanceHistory.has(agentName)) {
      this.performanceHistory.set(agentName, []);
    }
    
    const history = this.performanceHistory.get(agentName);
    history.unshift({
      executionTime,
      success,
      timestamp: Date.now()
    });
    
    // Keep last 200 entries
    if (history.length > 200) {
      this.performanceHistory.set(agentName, history.slice(0, 200));
    }
  }

  /**
   * Start health monitoring
   */
  startHealthMonitoring() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        console.error('⚠️ AgentRegistry health check failed:', error);
      }
    }, this.healthCheckIntervalMs);
    
    console.log(`💓 AgentRegistry: Health monitoring started (${this.healthCheckIntervalMs/1000}s interval)`);
  }

  /**
   * Stop health monitoring
   */
  stopHealthMonitoring() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
      console.log('⏹️ AgentRegistry: Health monitoring stopped');
    }
  }

  /**
   * Export registry state
   */
  exportState() {
    return {
      timestamp: Date.now(),
      agents: Object.fromEntries(
        Array.from(this.agents.entries()).map(([name, agent]) => [
          name, 
          {
            ...agent,
            healthHistory: agent.healthHistory?.slice(0, 10) || [], // Last 10 health checks
            executionHistory: agent.executionHistory?.slice(0, 20) || [] // Last 20 executions
          }
        ])
      ),
      capabilities: Object.fromEntries(
        Array.from(this.capabilities.entries()).map(([cap, agents]) => [
          cap,
          Array.from(agents)
        ])
      ),
      statistics: this.getStatistics()
    };
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.stopHealthMonitoring();
    this.agents.clear();
    this.capabilities.clear();
    this.performanceHistory.clear();
    console.log('🧹 AgentRegistry: Cleaned up resources');
  }
}

export default AgentRegistry;
export { AgentRegistry };