/**
 * Agent Communication Bus
 * 
 * Advanced inter-agent communication system supporting:
 * - Direct messaging between agents
 * - Publish/Subscribe event system
 * - Request/Response patterns
 * - Message queuing and delivery guarantees
 * - Cross-orchestrator communication
 */

class AgentCommunicationBus {
  constructor() {
    this.messageId = 0;
    this.messages = new Map(); // messageId -> message
    this.subscriptions = new Map(); // topic -> Set of subscriber info
    this.agentInboxes = new Map(); // agentName -> messages queue
    this.pendingResponses = new Map(); // messageId -> response handler
    this.messageHistory = [];
    this.deliveryCallbacks = new Map(); // messageId -> callback
    
    // Configuration
    this.maxMessageHistory = 1000;
    this.maxInboxSize = 100;
    this.messageTimeout = 30000; // 30 seconds
    this.retryAttempts = 3;
    
    // Statistics
    this.stats = {
      totalMessages: 0,
      deliveredMessages: 0,
      failedMessages: 0,
      activeSubscriptions: 0,
      messagesByType: new Map()
    };
    
    console.log('📡 AgentCommunicationBus: Initialized');
  }

  /**
   * Send direct message from one agent to another
   */
  async sendMessage(fromAgent, toAgent, messageType, payload, options = {}) {
    const messageId = this.generateMessageId();
    const message = {
      id: messageId,
      type: 'direct',
      messageType,
      from: fromAgent,
      to: toAgent,
      payload,
      timestamp: Date.now(),
      status: 'pending',
      attempts: 0,
      maxAttempts: options.maxAttempts || this.retryAttempts,
      priority: options.priority || 'normal',
      requiresResponse: options.requiresResponse || false,
      timeout: options.timeout || this.messageTimeout
    };
    
    this.messages.set(messageId, message);
    this.updateStats('direct', messageType);
    
    try {
      await this.deliverMessage(message);
      console.log(`📤 Message sent: ${fromAgent} → ${toAgent} (${messageType})`);
      
      // If response is required, set up response handler
      if (options.requiresResponse) {
        return new Promise((resolve, reject) => {
          const timeoutHandle = setTimeout(() => {
            this.pendingResponses.delete(messageId);
            reject(new Error(`Message timeout: ${messageId}`));
          }, message.timeout);
          
          this.pendingResponses.set(messageId, {
            resolve,
            reject,
            timeoutHandle
          });
        });
      }
      
      return messageId;
      
    } catch (error) {
      message.status = 'failed';
      message.error = error.message;
      this.stats.failedMessages++;
      console.error(`❌ Message delivery failed: ${fromAgent} → ${toAgent}`, error);
      throw error;
    }
  }

  /**
   * Send response to a message
   */
  async sendResponse(originalMessageId, fromAgent, responsePayload) {
    const originalMessage = this.messages.get(originalMessageId);
    if (!originalMessage) {
      throw new Error(`Original message not found: ${originalMessageId}`);
    }
    
    const responseId = this.generateMessageId();
    const response = {
      id: responseId,
      type: 'response',
      originalMessageId,
      from: fromAgent,
      to: originalMessage.from,
      payload: responsePayload,
      timestamp: Date.now(),
      status: 'delivered'
    };
    
    this.messages.set(responseId, response);
    this.updateStats('response', 'response');
    
    // Handle pending response
    const pendingHandler = this.pendingResponses.get(originalMessageId);
    if (pendingHandler) {
      clearTimeout(pendingHandler.timeoutHandle);
      pendingHandler.resolve(responsePayload);
      this.pendingResponses.delete(originalMessageId);
    }
    
    console.log(`📥 Response sent: ${fromAgent} → ${originalMessage.from}`);
    return responseId;
  }

  /**
   * Publish message to a topic (pub/sub pattern)
   */
  async publishMessage(fromAgent, topic, messageType, payload, options = {}) {
    const messageId = this.generateMessageId();
    const message = {
      id: messageId,
      type: 'publish',
      messageType,
      topic,
      from: fromAgent,
      payload,
      timestamp: Date.now(),
      status: 'pending',
      priority: options.priority || 'normal'
    };
    
    this.messages.set(messageId, message);
    this.updateStats('publish', messageType);
    
    // Get subscribers for this topic
    const subscribers = this.subscriptions.get(topic) || new Set();
    const deliveryPromises = [];
    
    for (const subscriber of subscribers) {
      if (subscriber.agentName !== fromAgent) { // Don't send to self
        const deliveryMessage = {
          ...message,
          to: subscriber.agentName,
          subscriptionFilter: subscriber.filter
        };
        
        deliveryPromises.push(this.deliverMessage(deliveryMessage));
      }
    }
    
    try {
      await Promise.all(deliveryPromises);
      message.status = 'delivered';
      console.log(`📢 Published: ${fromAgent} → ${topic} (${subscribers.size} subscribers)`);
      return messageId;
    } catch (error) {
      message.status = 'failed';
      message.error = error.message;
      console.error(`❌ Publish failed: ${fromAgent} → ${topic}`, error);
      throw error;
    }
  }

  /**
   * Subscribe agent to a topic
   */
  subscribe(agentName, topic, messageHandler, filter = null) {
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());
    }
    
    const subscription = {
      agentName,
      topic,
      handler: messageHandler,
      filter,
      subscribedAt: Date.now(),
      messagesReceived: 0
    };
    
    this.subscriptions.get(topic).add(subscription);
    this.stats.activeSubscriptions++;
    
    console.log(`🔔 Subscribed: ${agentName} → ${topic}`);
    return subscription;
  }

  /**
   * Unsubscribe agent from a topic
   */
  unsubscribe(agentName, topic) {
    const topicSubscriptions = this.subscriptions.get(topic);
    if (topicSubscriptions) {
      const toRemove = Array.from(topicSubscriptions).find(sub => sub.agentName === agentName);
      if (toRemove) {
        topicSubscriptions.delete(toRemove);
        this.stats.activeSubscriptions--;
        
        if (topicSubscriptions.size === 0) {
          this.subscriptions.delete(topic);
        }
        
        console.log(`🔕 Unsubscribed: ${agentName} → ${topic}`);
        return true;
      }
    }
    return false;
  }

  /**
   * Get agent's inbox messages
   */
  getInbox(agentName) {
    return this.agentInboxes.get(agentName) || [];
  }

  /**
   * Mark message as read
   */
  markMessageRead(agentName, messageId) {
    const inbox = this.agentInboxes.get(agentName) || [];
    const message = inbox.find(msg => msg.id === messageId);
    if (message) {
      message.read = true;
      message.readAt = Date.now();
      return true;
    }
    return false;
  }

  /**
   * Get unread message count for agent
   */
  getUnreadCount(agentName) {
    const inbox = this.agentInboxes.get(agentName) || [];
    return inbox.filter(msg => !msg.read).length;
  }

  /**
   * Broadcast message to all agents
   */
  async broadcastMessage(fromAgent, messageType, payload, options = {}) {
    return await this.publishMessage(fromAgent, 'system.broadcast', messageType, payload, options);
  }

  /**
   * Send system notification
   */
  async sendSystemNotification(messageType, payload, targetAgents = null) {
    const messageId = this.generateMessageId();
    const message = {
      id: messageId,
      type: 'system',
      messageType,
      from: 'system',
      payload,
      timestamp: Date.now(),
      status: 'pending',
      priority: 'high',
      targetAgents
    };
    
    this.messages.set(messageId, message);
    this.updateStats('system', messageType);
    
    // Deliver to all agents or specified targets
    const targets = targetAgents || Array.from(this.agentInboxes.keys());
    const deliveryPromises = targets.map(agentName => 
      this.deliverMessage({ ...message, to: agentName })
    );
    
    try {
      await Promise.all(deliveryPromises);
      message.status = 'delivered';
      console.log(`🔔 System notification sent: ${messageType} (${targets.length} agents)`);
      return messageId;
    } catch (error) {
      message.status = 'failed';
      message.error = error.message;
      console.error(`❌ System notification failed: ${messageType}`, error);
      throw error;
    }
  }

  /**
   * Request agent coordination for multi-agent operations
   */
  async requestCoordination(coordinatorAgent, participantAgents, operationType, coordinationData) {
    const coordinationId = this.generateMessageId();
    const coordination = {
      id: coordinationId,
      type: 'coordination',
      coordinator: coordinatorAgent,
      participants: participantAgents,
      operationType,
      data: coordinationData,
      status: 'requesting',
      responses: new Map(),
      timestamp: Date.now()
    };
    
    this.messages.set(coordinationId, coordination);
    
    // Send coordination requests to all participants
    const requestPromises = participantAgents.map(agentName =>
      this.sendMessage(coordinatorAgent, agentName, 'coordination_request', {
        coordinationId,
        operationType,
        data: coordinationData,
        participants: participantAgents
      }, { requiresResponse: true })
    );
    
    try {
      const responses = await Promise.all(requestPromises);
      coordination.status = 'coordinated';
      coordination.responses = new Map(responses.map((response, index) => 
        [participantAgents[index], response]
      ));
      
      console.log(`🤝 Coordination established: ${coordinatorAgent} + ${participantAgents.length} agents`);
      return coordination;
      
    } catch (error) {
      coordination.status = 'failed';
      coordination.error = error.message;
      console.error(`❌ Coordination failed: ${coordinatorAgent}`, error);
      throw error;
    }
  }

  /**
   * Deliver message to agent inbox
   */
  async deliverMessage(message) {
    if (!this.agentInboxes.has(message.to)) {
      this.agentInboxes.set(message.to, []);
    }
    
    const inbox = this.agentInboxes.get(message.to);
    
    // Check inbox size limit
    if (inbox.length >= this.maxInboxSize) {
      // Remove oldest messages
      inbox.splice(0, inbox.length - this.maxInboxSize + 1);
    }
    
    // Add to inbox
    const inboxMessage = {
      ...message,
      deliveredAt: Date.now(),
      read: false
    };
    
    inbox.push(inboxMessage);
    
    // Add to history
    this.addToHistory(message);
    
    // Update statistics
    this.stats.deliveredMessages++;
    message.status = 'delivered';
    
    return true;
  }

  /**
   * Generate unique message ID
   */
  generateMessageId() {
    return `msg_${Date.now()}_${++this.messageId}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update statistics
   */
  updateStats(messageType, subType) {
    this.stats.totalMessages++;
    
    const key = `${messageType}:${subType}`;
    const currentCount = this.stats.messagesByType.get(key) || 0;
    this.stats.messagesByType.set(key, currentCount + 1);
  }

  /**
   * Add message to history
   */
  addToHistory(message) {
    this.messageHistory.unshift({
      id: message.id,
      type: message.type,
      from: message.from,
      to: message.to,
      messageType: message.messageType,
      timestamp: message.timestamp,
      status: message.status
    });
    
    // Limit history size
    if (this.messageHistory.length > this.maxMessageHistory) {
      this.messageHistory = this.messageHistory.slice(0, this.maxMessageHistory);
    }
  }

  /**
   * Get communication statistics
   */
  getStatistics() {
    return {
      ...this.stats,
      messagesByType: Object.fromEntries(this.stats.messagesByType),
      activeAgents: this.agentInboxes.size,
      totalSubscriptions: this.stats.activeSubscriptions,
      averageInboxSize: this.agentInboxes.size > 0 
        ? Array.from(this.agentInboxes.values()).reduce((sum, inbox) => sum + inbox.length, 0) / this.agentInboxes.size
        : 0,
      timestamp: Date.now()
    };
  }

  /**
   * Get message history
   */
  getMessageHistory(limit = 50) {
    return this.messageHistory.slice(0, limit);
  }

  /**
   * Get all active topics
   */
  getActiveTopics() {
    return Array.from(this.subscriptions.keys()).map(topic => ({
      topic,
      subscriberCount: this.subscriptions.get(topic).size,
      subscribers: Array.from(this.subscriptions.get(topic)).map(sub => ({
        agent: sub.agentName,
        messagesReceived: sub.messagesReceived,
        subscribedAt: sub.subscribedAt
      }))
    }));
  }

  /**
   * Clean up old messages and optimize performance
   */
  cleanup() {
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
    
    // Clean up old messages
    const messagesToDelete = [];
    for (const [id, message] of this.messages) {
      if (message.timestamp < cutoffTime && message.status === 'delivered') {
        messagesToDelete.push(id);
      }
    }
    
    messagesToDelete.forEach(id => this.messages.delete(id));
    
    // Clean up old inbox messages
    for (const [agentName, inbox] of this.agentInboxes) {
      const filteredInbox = inbox.filter(msg => 
        msg.timestamp > cutoffTime || !msg.read
      );
      this.agentInboxes.set(agentName, filteredInbox);
    }
    
    console.log(`🧹 AgentCommunicationBus: Cleaned up ${messagesToDelete.length} old messages`);
    return messagesToDelete.length;
  }

  /**
   * Export communication bus state
   */
  exportState() {
    return {
      timestamp: Date.now(),
      statistics: this.getStatistics(),
      activeTopics: this.getActiveTopics(),
      recentMessages: this.getMessageHistory(20),
      agentInboxSummary: Object.fromEntries(
        Array.from(this.agentInboxes.entries()).map(([agent, inbox]) => [
          agent,
          {
            totalMessages: inbox.length,
            unreadMessages: inbox.filter(msg => !msg.read).length,
            lastMessage: inbox[inbox.length - 1]?.timestamp || null
          }
        ])
      )
    };
  }

  /**
   * Destroy communication bus and clean up resources
   */
  destroy() {
    // Clear all timeouts
    for (const [messageId, handler] of this.pendingResponses) {
      clearTimeout(handler.timeoutHandle);
    }
    
    // Clear all data structures
    this.messages.clear();
    this.subscriptions.clear();
    this.agentInboxes.clear();
    this.pendingResponses.clear();
    this.deliveryCallbacks.clear();
    this.messageHistory = [];
    
    console.log('🧹 AgentCommunicationBus: Destroyed and cleaned up');
  }
}

export default AgentCommunicationBus;
export { AgentCommunicationBus };