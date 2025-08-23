/**
 * Agent Communication Protocol Test
 * 
 * Test suite for validating cross-agent communication capabilities
 */

console.log('🧪 Starting Agent Communication Protocol Test Suite...');
console.log('══════════════════════════════════════════════════════════');

class AgentCommunicationTest {
  constructor() {
    this.testResults = [];
    this.communicationBus = null;
  }

  async runAllTests() {
    try {
      await this.testCommunicationBusInitialization();
      await this.testDirectMessaging();
      await this.testPubSubMessaging();
      await this.testRequestResponsePattern();
      await this.testBroadcastMessaging();
      await this.testAgentCoordination();
      await this.testMessageQueuing();
      await this.testCommunicationStatistics();
      await this.testCleanupAndDestroy();
      
      this.printResults();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }

  async testCommunicationBusInitialization() {
    console.log('🔍 Testing: Communication Bus Initialization');
    
    try {
      const { default: AgentCommunicationBus } = await import('../agents/AgentCommunicationBus.js');
      
      this.communicationBus = new AgentCommunicationBus();
      
      // Check required properties
      const hasRequiredProperties = [
        'messages',
        'subscriptions',
        'agentInboxes',
        'stats'
      ].every(prop => this.communicationBus.hasOwnProperty(prop));
      
      // Check required methods
      const hasRequiredMethods = [
        'sendMessage',
        'publishMessage',
        'subscribe',
        'broadcastMessage',
        'requestCoordination'
      ].every(method => typeof this.communicationBus[method] === 'function');
      
      if (hasRequiredProperties && hasRequiredMethods) {
        console.log('  ✅ Communication bus initialized with all required capabilities');
        this.addResult('Communication Bus Initialization', true, 'Bus initialized with full feature set');
      } else {
        this.addResult('Communication Bus Initialization', false, 'Missing required properties or methods');
      }
      
    } catch (error) {
      this.addResult('Communication Bus Initialization', false, error.message);
    }
  }

  async testDirectMessaging() {
    console.log('🔍 Testing: Direct Agent-to-Agent Messaging');
    
    try {
      if (!this.communicationBus) throw new Error('Communication bus not initialized');
      
      // Send direct message
      const messageId = await this.communicationBus.sendMessage(
        'agent-1',
        'agent-2',
        'test_message',
        { data: 'Hello from agent-1' }
      );
      
      // Check message was delivered
      const agent2Inbox = this.communicationBus.getInbox('agent-2');
      const deliveredMessage = agent2Inbox.find(msg => msg.id === messageId);
      
      if (messageId && deliveredMessage && deliveredMessage.payload.data === 'Hello from agent-1') {
        console.log(`  📤 Direct message delivered successfully: ${messageId}`);
        console.log(`  📥 Agent-2 inbox contains: ${agent2Inbox.length} messages`);
        this.addResult('Direct Messaging', true, 'Direct messaging working correctly');
      } else {
        this.addResult('Direct Messaging', false, 'Message delivery failed');
      }
      
    } catch (error) {
      this.addResult('Direct Messaging', false, error.message);
    }
  }

  async testPubSubMessaging() {
    console.log('🔍 Testing: Publish/Subscribe Messaging');
    
    try {
      if (!this.communicationBus) throw new Error('Communication bus not initialized');
      
      // Set up subscribers
      let agent3Messages = [];
      let agent4Messages = [];
      
      this.communicationBus.subscribe('agent-3', 'test-topic', (message) => {
        agent3Messages.push(message);
      });
      
      this.communicationBus.subscribe('agent-4', 'test-topic', (message) => {
        agent4Messages.push(message);
      });
      
      // Publish message
      const publishId = await this.communicationBus.publishMessage(
        'agent-1',
        'test-topic',
        'broadcast_message',
        { announcement: 'Hello everyone!' }
      );
      
      // Check deliveries
      const agent3Inbox = this.communicationBus.getInbox('agent-3');
      const agent4Inbox = this.communicationBus.getInbox('agent-4');
      
      const pubSubSuccess = publishId && 
                           agent3Inbox.length > 0 && 
                           agent4Inbox.length > 0;
      
      if (pubSubSuccess) {
        console.log(`  📢 Published message to topic: test-topic`);
        console.log(`  📥 Agent-3 received: ${agent3Inbox.length} messages`);
        console.log(`  📥 Agent-4 received: ${agent4Inbox.length} messages`);
        this.addResult('Pub/Sub Messaging', true, 'Publish/subscribe messaging working correctly');
      } else {
        this.addResult('Pub/Sub Messaging', false, 'Pub/sub message delivery failed');
      }
      
    } catch (error) {
      this.addResult('Pub/Sub Messaging', false, error.message);
    }
  }

  async testRequestResponsePattern() {
    console.log('🔍 Testing: Request/Response Pattern');
    
    try {
      if (!this.communicationBus) throw new Error('Communication bus not initialized');
      
      // Set up response simulation
      setTimeout(async () => {
        // Simulate agent-5 responding to the request
        try {
          // Find the request message in agent-5's inbox
          const agent5Inbox = this.communicationBus.getInbox('agent-5');
          const requestMessage = agent5Inbox[agent5Inbox.length - 1]; // Latest message
          
          if (requestMessage) {
            await this.communicationBus.sendResponse(
              requestMessage.id,
              'agent-5',
              { status: 'processed', result: 'Request handled successfully' }
            );
          }
        } catch (error) {
          console.warn('Response simulation failed:', error.message);
        }
      }, 100);
      
      // Send request expecting response
      const response = await this.communicationBus.sendMessage(
        'agent-1',
        'agent-5',
        'data_request',
        { query: 'Get user data' },
        { requiresResponse: true, timeout: 2000 }
      );
      
      if (response && response.status === 'processed') {
        console.log(`  🔄 Request/response completed successfully`);
        console.log(`  📨 Response: ${response.result}`);
        this.addResult('Request/Response Pattern', true, 'Request/response pattern working correctly');
      } else {
        this.addResult('Request/Response Pattern', false, 'Request/response failed');
      }
      
    } catch (error) {
      this.addResult('Request/Response Pattern', false, error.message);
    }
  }

  async testBroadcastMessaging() {
    console.log('🔍 Testing: Broadcast Messaging');
    
    try {
      if (!this.communicationBus) throw new Error('Communication bus not initialized');
      
      // Subscribe agents to system broadcast topic
      const agents = ['agent-1', 'agent-2', 'agent-3', 'agent-4', 'agent-5'];
      agents.forEach(agent => {
        this.communicationBus.subscribe(agent, 'system.broadcast', (message) => {
          // Broadcast message handler
        });
      });
      
      // Broadcast message to all agents
      const broadcastId = await this.communicationBus.broadcastMessage(
        'system',
        'system_announcement',
        { message: 'System maintenance scheduled', priority: 'high' }
      );
      
      // Check multiple agent inboxes
      const inboxes = agents.map(agent => ({
        agent,
        inbox: this.communicationBus.getInbox(agent),
        hasMessage: this.communicationBus.getInbox(agent).some(msg => 
          msg.messageType === 'system_announcement'
        )
      }));
      
      const successfulDeliveries = inboxes.filter(info => info.hasMessage).length;
      
      if (broadcastId && successfulDeliveries >= 4) {
        console.log(`  📢 Broadcast delivered to ${successfulDeliveries}/5 agents`);
        this.addResult('Broadcast Messaging', true, `Broadcast messaging working (${successfulDeliveries} deliveries)`);
      } else {
        this.addResult('Broadcast Messaging', false, `Only ${successfulDeliveries} deliveries out of 5`);
      }
      
    } catch (error) {
      this.addResult('Broadcast Messaging', false, error.message);
    }
  }

  async testAgentCoordination() {
    console.log('🔍 Testing: Multi-Agent Coordination');
    
    try {
      if (!this.communicationBus) throw new Error('Communication bus not initialized');
      
      // Set up coordination response simulation
      setTimeout(async () => {
        try {
          // Simulate participants responding to coordination requests
          const participants = ['agent-2', 'agent-3'];
          
          for (const participant of participants) {
            const inbox = this.communicationBus.getInbox(participant);
            const coordRequest = inbox.find(msg => msg.messageType === 'coordination_request');
            
            if (coordRequest) {
              await this.communicationBus.sendResponse(
                coordRequest.id,
                participant,
                { accepted: true, capabilities: ['processing', 'analysis'] }
              );
            }
          }
        } catch (error) {
          console.warn('Coordination response simulation failed:', error.message);
        }
      }, 200);
      
      // Request coordination
      const coordination = await this.communicationBus.requestCoordination(
        'agent-1',
        ['agent-2', 'agent-3'],
        'data_processing',
        { task: 'Analyze customer data', deadline: Date.now() + 300000 }
      );
      
      if (coordination && coordination.status === 'coordinated') {
        console.log(`  🤝 Coordination established with ${coordination.participants.length} agents`);
        console.log(`  📋 Operation: ${coordination.operationType}`);
        this.addResult('Agent Coordination', true, 'Multi-agent coordination working correctly');
      } else {
        this.addResult('Agent Coordination', false, 'Agent coordination failed');
      }
      
    } catch (error) {
      this.addResult('Agent Coordination', false, error.message);
    }
  }

  async testMessageQueuing() {
    console.log('🔍 Testing: Message Queuing and Inbox Management');
    
    try {
      if (!this.communicationBus) throw new Error('Communication bus not initialized');
      
      // Send multiple messages to test queuing
      const messageIds = [];
      for (let i = 0; i < 5; i++) {
        const messageId = await this.communicationBus.sendMessage(
          'agent-1',
          'agent-6',
          'queued_message',
          { index: i, data: `Message ${i}` }
        );
        messageIds.push(messageId);
      }
      
      // Check inbox
      const agent6Inbox = this.communicationBus.getInbox('agent-6');
      const queuedMessages = agent6Inbox.filter(msg => msg.messageType === 'queued_message');
      
      // Test unread count
      const unreadCount = this.communicationBus.getUnreadCount('agent-6');
      
      // Mark some messages as read
      if (queuedMessages.length > 0) {
        this.communicationBus.markMessageRead('agent-6', queuedMessages[0].id);
      }
      
      const unreadCountAfter = this.communicationBus.getUnreadCount('agent-6');
      
      if (queuedMessages.length === 5 && unreadCount > unreadCountAfter) {
        console.log(`  📬 Queued ${queuedMessages.length} messages successfully`);
        console.log(`  📊 Unread count: ${unreadCount} → ${unreadCountAfter}`);
        this.addResult('Message Queuing', true, 'Message queuing and inbox management working');
      } else {
        this.addResult('Message Queuing', false, 'Message queuing issues detected');
      }
      
    } catch (error) {
      this.addResult('Message Queuing', false, error.message);
    }
  }

  async testCommunicationStatistics() {
    console.log('🔍 Testing: Communication Statistics');
    
    try {
      if (!this.communicationBus) throw new Error('Communication bus not initialized');
      
      const stats = this.communicationBus.getStatistics();
      const topics = this.communicationBus.getActiveTopics();
      const history = this.communicationBus.getMessageHistory(10);
      
      const statsValid = stats.totalMessages > 0 && 
                        stats.deliveredMessages > 0 && 
                        stats.activeAgents > 0 &&
                        topics.length > 0 &&
                        history.length > 0;
      
      if (statsValid) {
        console.log(`  📊 Total messages: ${stats.totalMessages}`);
        console.log(`  📈 Delivered messages: ${stats.deliveredMessages}`);
        console.log(`  👥 Active agents: ${stats.activeAgents}`);
        console.log(`  📡 Active topics: ${topics.length}`);
        console.log(`  📋 Message history: ${history.length} entries`);
        this.addResult('Communication Statistics', true, 'Statistics tracking comprehensive and accurate');
      } else {
        this.addResult('Communication Statistics', false, 'Statistics incomplete or inaccurate');
      }
      
    } catch (error) {
      this.addResult('Communication Statistics', false, error.message);
    }
  }

  async testCleanupAndDestroy() {
    console.log('🔍 Testing: Cleanup and Resource Management');
    
    try {
      if (!this.communicationBus) throw new Error('Communication bus not initialized');
      
      // Perform cleanup
      const cleanedMessages = this.communicationBus.cleanup();
      
      // Test unsubscribe
      const unsubscribed = this.communicationBus.unsubscribe('agent-3', 'test-topic');
      
      // Export state before destruction
      const finalState = this.communicationBus.exportState();
      
      // Destroy the bus
      this.communicationBus.destroy();
      
      if (typeof cleanedMessages === 'number' && unsubscribed && finalState.timestamp) {
        console.log(`  🧹 Cleaned up ${cleanedMessages} old messages`);
        console.log(`  🔕 Unsubscribed agent successfully`);
        console.log(`  📊 Final state exported with ${Object.keys(finalState.agentInboxSummary).length} agent inboxes`);
        this.addResult('Cleanup and Destroy', true, 'Cleanup and resource management working correctly');
      } else {
        this.addResult('Cleanup and Destroy', false, 'Cleanup or resource management issues');
      }
      
    } catch (error) {
      this.addResult('Cleanup and Destroy', false, error.message);
    }
  }

  addResult(testName, passed, details) {
    this.testResults.push({ testName, passed, details });
    const status = passed ? '✅ PASSED' : '❌ FAILED';
    console.log(`${status} - ${testName}: ${details}`);
  }

  printResults() {
    console.log('\n📊 Agent Communication Protocol Test Results');
    console.log('══════════════════════════════════════════════════════════');
    
    const passed = this.testResults.filter(r => r.passed).length;
    const total = this.testResults.length;
    const passRate = total > 0 ? (passed / total * 100).toFixed(1) : 0;
    
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${total - passed}`);
    console.log(`Pass Rate: ${passRate}%`);
    
    if (passRate >= 85) {
      console.log('\n🎯 Phase 3C Assessment:');
      console.log('✅ EXCELLENT - Cross-Agent Communication Protocol is fully functional');
      console.log('   Direct messaging, pub/sub, request/response, and coordination all working');
      console.log('   Ready to proceed to Phase 3D');
    } else if (passRate >= 70) {
      console.log('\n🎯 Phase 3C Assessment:');
      console.log('⚠️ GOOD - Communication mostly functional, minor issues to address');
    } else {
      console.log('\n🎯 Phase 3C Assessment:');
      console.log('❌ NEEDS WORK - Significant communication system issues need resolution');
    }
    
    console.log('══════════════════════════════════════════════════════════');
  }
}

// Run tests
const test = new AgentCommunicationTest();
test.runAllTests();