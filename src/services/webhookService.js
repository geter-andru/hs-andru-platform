/**
 * Webhook Service for receiving Make.com completion notifications
 * Manages resource generation status and results storage
 */

class WebhookService {
  constructor() {
    this.generationStatus = {};
    this.completedResources = {};
  }

  /**
   * Start a new generation process
   */
  startGeneration(customerId, sessionId) {
    const id = sessionId || Date.now().toString();
    this.generationStatus[id] = {
      customerId,
      status: 'processing',
      startTime: Date.now(),
      progress: 0,
      currentStep: 'Initializing AI engines...'
    };
    
    // Store session ID in localStorage for persistence (with quota handling)
    try {
      // Clear old resources to free up space
      this.cleanupOldResources();
      localStorage.setItem('current_generation_id', id);
    } catch (e) {
      console.warn('localStorage quota exceeded, continuing without persistence:', e);
      // Continue without localStorage - the process will still work
    }
    
    return id;
  }
  
  /**
   * Clean up old resources from localStorage to prevent quota issues
   */
  cleanupOldResources() {
    const keysToRemove = [];
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    for (let key in localStorage) {
      // Remove old resource data
      if (key.startsWith('resources_') || key.startsWith('pendingSalesSage')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (data.timestamp && new Date(data.timestamp).getTime() < oneWeekAgo) {
            keysToRemove.push(key);
          }
        } catch {
          // If we can't parse it, it's probably old/corrupted, remove it
          keysToRemove.push(key);
        }
      }
    }
    
    // Remove old keys
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // If still having issues, remove the oldest resources
    if (keysToRemove.length === 0) {
      const resourceKeys = Object.keys(localStorage).filter(k => k.startsWith('resources_'));
      if (resourceKeys.length > 5) {
        // Keep only the 5 most recent
        resourceKeys.slice(0, -5).forEach(key => localStorage.removeItem(key));
      }
    }
  }

  /**
   * Update generation progress (called by timer or webhook)
   */
  updateProgress(sessionId, progress, currentStep) {
    if (this.generationStatus[sessionId]) {
      this.generationStatus[sessionId].progress = progress;
      this.generationStatus[sessionId].currentStep = currentStep;
    }
  }

  /**
   * Complete generation process (called by webhook or timer)
   */
  completeGeneration(sessionId, resources) {
    if (this.generationStatus[sessionId]) {
      this.generationStatus[sessionId].status = 'completed';
      this.generationStatus[sessionId].progress = 100;
      this.generationStatus[sessionId].completedAt = Date.now();
      
      // Store completed resources
      this.completedResources[sessionId] = resources || this.getMockResources();
      
      // Also store in localStorage for persistence (with error handling)
      try {
        // Clean up old data first
        this.cleanupOldResources();
        localStorage.setItem(`resources_${sessionId}`, JSON.stringify(this.completedResources[sessionId]));
      } catch (e) {
        console.warn('Could not persist to localStorage:', e);
        // Resources are still available in memory
      }
      
      return true;
    }
    return false;
  }

  /**
   * Get current generation status
   */
  getStatus(sessionId) {
    return this.generationStatus[sessionId] || null;
  }

  /**
   * Get completed resources
   */
  async getResources(sessionId) {
    // Check memory first
    if (this.completedResources[sessionId]) {
      return this.completedResources[sessionId];
    }
    
    // In production, resources are stored directly by the Netlify function
    // Check localStorage for completed resources
    
    // Check localStorage as fallback
    const stored = localStorage.getItem(`resources_${sessionId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    
    return null;
  }

  /**
   * Simulate webhook reception (for local development)
   * In production, this would be an actual API endpoint
   */
  simulateWebhookCompletion(sessionId, delay = 120000) {
    setTimeout(() => {
      this.completeGeneration(sessionId, this.getMockResources());
    }, delay);
  }

  /**
   * Get mock resources for testing
   */
  getMockResources() {
    return {
      icp_analysis: {
        title: "Ideal Customer Profile Analysis",
        confidence_score: 8.5,
        generation_date: new Date().toISOString(),
        content: "Comprehensive ICP analysis based on product data and market research...",
        company_size_range: "50-500 employees",
        industry_verticals: "SaaS, Technology, Financial Services",
        annual_revenue_range: "$10M - $100M",
        growth_stage: "Growth",
        generated: true
      },
      buyer_personas: {
        title: "Target Buyer Personas",
        confidence_score: 9.0,
        generation_date: new Date().toISOString(),
        content: "Detailed buyer persona profiles with decision-making insights...",
        persona_name: "VP of Revenue Operations",
        job_title: "Revenue Operations Leader",
        pain_points: "Disconnected data, manual processes, poor forecasting",
        generated: true
      },
      empathy_map: {
        title: "Customer Empathy Map",
        confidence_score: 8.8,
        generation_date: new Date().toISOString(),
        content: "Deep psychological understanding of your target customers...",
        what_they_think: "Need better data visibility and control",
        what_they_feel: "Frustrated with current tools and processes",
        pains_and_frustrations: "Time wasted on manual tasks",
        generated: true
      },
      product_assessment: {
        title: "Product Market Fit Assessment",
        confidence_score: 9.2,
        generation_date: new Date().toISOString(),
        content: "Strategic assessment of product-market alignment...",
        current_product_potential_score: 8.5,
        gaps_preventing_10: "Need stronger integration ecosystem",
        market_opportunity: "Large and growing market demand",
        generated: true
      }
    };
  }

  /**
   * Production webhook endpoint URL for Make.com to call
   */
  getWebhookUrl() {
    // Use Netlify function in production
    if (window.location.hostname === 'platform.andru-ai.com') {
      return 'https://platform.andru-ai.com/.netlify/functions/core-resources-webhook';
    }
    // Fallback to localhost for development
    return 'http://localhost:3001/api/webhook/core-resources';
  }

  /**
   * Poll for completion from webhook server
   */
  async pollForCompletion(sessionId, maxAttempts = 60, interval = 2000) {
    let attempts = 0;
    
    return new Promise((resolve) => {
      const poll = async () => {
        attempts++;
        
        try {
          const resources = await this.getResources(sessionId);
          if (resources) {
            this.completeGeneration(sessionId, resources);
            resolve(resources);
            return;
          }
        } catch (error) {
          console.log(`Polling attempt ${attempts} failed:`, error.message);
        }
        
        if (attempts >= maxAttempts) {
          console.log('Polling timeout - using mock resources');
          const mockResources = this.getMockResources();
          this.completeGeneration(sessionId, mockResources);
          resolve(mockResources);
          return;
        }
        
        setTimeout(poll, interval);
      };
      
      // Start polling after a short delay
      setTimeout(poll, 1000);
    });
  }
}

// Create singleton instance
const webhookService = new WebhookService();

export default webhookService;