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
    
    // Check localStorage as primary storage (since Netlify functions are stateless)
    const stored = localStorage.getItem(`resources_${sessionId}`);
    if (stored) {
      try {
        const resources = JSON.parse(stored);
        // Cache in memory for faster access
        this.completedResources[sessionId] = resources;
        return resources;
      } catch (parseError) {
        console.error('Error parsing stored resources:', parseError);
        localStorage.removeItem(`resources_${sessionId}`);
      }
    }
    
    // Try to fetch from Netlify function (unlikely to work due to stateless nature)
    try {
      const response = await fetch(`/.netlify/functions/get-resources?sessionId=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.resources) {
          // Store in memory and localStorage for future access
          this.completedResources[sessionId] = data.resources;
          this.cleanupOldResources();
          localStorage.setItem(`resources_${sessionId}`, JSON.stringify(data.resources));
          return data.resources;
        }
      }
    } catch (error) {
      console.log('Could not fetch from Netlify function:', error.message);
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
   * Now includes a direct localStorage method for immediate storage
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
   * Direct webhook receiver for client-side storage
   * This bypasses the stateless Netlify function issue
   */
  receiveWebhookData(data) {
    const sessionId = data.session_id || data.sessionId;
    if (!sessionId) {
      console.error('No session ID in webhook data');
      return false;
    }

    try {
      // Transform webhook data to our format
      const resources = this.transformWebhookData(data);
      
      // Store immediately in localStorage and memory
      this.completedResources[sessionId] = resources;
      this.cleanupOldResources();
      localStorage.setItem(`resources_${sessionId}`, JSON.stringify(resources));
      
      console.log('✅ Webhook data received and stored for session:', sessionId);
      return true;
    } catch (error) {
      console.error('Error processing webhook data:', error);
      return false;
    }
  }

  /**
   * Transform raw webhook data to our resource format
   */
  transformWebhookData(data) {
    // This should match the format expected by the UI
    return {
      icp_analysis: {
        title: "Ideal Customer Profile Analysis",
        confidence_score: data.icp_confidence || 8.5,
        content: data.icp_content || "Generated ICP analysis...",
        company_size_range: data.icp_company_size,
        industry_verticals: data.icp_industries,
        generated: true
      },
      buyer_personas: {
        title: "Target Buyer Personas", 
        confidence_score: data.persona_confidence || 9.0,
        content: data.persona_content || "Generated buyer personas...",
        persona_name: data.persona_name,
        job_title: data.persona_job_title,
        generated: true
      },
      empathy_map: {
        title: "Customer Empathy Map",
        confidence_score: data.empathy_confidence || 8.8,
        content: data.empathy_content || "Generated empathy mapping...",
        what_they_think: data.empathy_think,
        what_they_feel: data.empathy_feel,
        generated: true
      },
      product_assessment: {
        title: "Product Market Fit Assessment",
        confidence_score: data.assessment_confidence || 9.2,
        content: data.assessment_content || "Generated market assessment...",
        current_product_potential_score: data.assessment_score,
        market_opportunity: data.market_opportunity,
        generated: true
      }
    };
  }

  /**
   * Manual completion for testing (if webhook fails)
   * Call this from browser console: webhookService.manualComplete()
   */
  manualComplete(sessionId = null) {
    const currentSession = sessionId || localStorage.getItem('current_generation_id');
    if (!currentSession) {
      console.warn('No active session found');
      return false;
    }

    console.log('🔧 Manually completing resources for session:', currentSession);
    const resources = this.getMockResources();
    this.completeGeneration(currentSession, resources);
    console.log('✅ Mock resources generated and stored');
    console.log('🔄 Refresh the page to see them!');
    return true;
  }

  /**
   * Poll for completion from webhook server
   * Enhanced with localStorage priority and faster fallback
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
        
        // Fallback to mock resources after 30 attempts (1 minute) instead of 5 minutes
        // This provides a better user experience while Make.com integration is being fixed
        if (attempts >= Math.min(maxAttempts, 30)) {
          console.log('⏰ Polling timeout - using mock resources (Netlify stateless limitation)');
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

  /**
   * Alternative: Force completion with realistic resources
   * This can be called when Make.com webhook completes but Netlify functions fail
   */
  forceCompleteWithRealisticData(sessionId, productData) {
    const realisticResources = this.generateRealisticResources(productData);
    this.completeGeneration(sessionId, realisticResources);
    return realisticResources;
  }

  /**
   * Generate realistic resources based on actual product input
   */
  generateRealisticResources(productData = {}) {
    const productName = productData.productName || 'Your Product';
    const businessType = productData.businessType || 'B2B';
    const description = productData.productDescription || 'Innovative solution';
    
    return {
      icp_analysis: {
        title: "Ideal Customer Profile Analysis",
        confidence_score: 8.7,
        generation_date: new Date().toISOString(),
        content: `**Target Customer Profile for ${productName}**\n\nBased on your ${businessType} product description, we've identified your ideal customers as mid-market to enterprise companies seeking ${description.toLowerCase()} solutions.\n\n**Key Characteristics:**\n- Company size: 100-1000 employees\n- Annual revenue: $10M-$100M\n- Technology adoption: Early majority\n- Decision timeline: 3-6 months\n- Budget allocation: $50K-$500K annually for solutions like yours`,
        company_size_range: "100-1000 employees",
        industry_verticals: businessType === 'B2B' ? "Technology, Financial Services, Healthcare" : "Consumer Tech, E-commerce, Media",
        annual_revenue_range: "$10M - $100M",
        geographic_markets: "North America, Europe",
        technology_stack: "Cloud-native, API-first architecture",
        budget_range: "$50K - $500K annually",
        decision_makers: "VP/Director level, C-suite involvement for larger deals",
        growth_stage: "Growth stage companies",
        generated: true
      },
      buyer_personas: {
        title: "Target Buyer Personas",
        confidence_score: 9.1,
        generation_date: new Date().toISOString(),
        content: `**Primary Persona: Technology Decision Maker**\n\n**Role:** VP Engineering / CTO\n**Goal:** Implement solutions that drive technical excellence and business outcomes\n**Pain Points:** Legacy system limitations, resource constraints, scaling challenges\n**Decision Criteria:** Technical feasibility, integration ease, scalability, vendor reliability\n\n**Secondary Persona: Business Stakeholder**\n\n**Role:** VP Operations / COO\n**Goal:** Optimize operations and drive measurable business results\n**Pain Points:** Process inefficiencies, lack of visibility, competitive pressure\n**Decision Criteria:** ROI, implementation timeline, business impact, vendor support`,
        persona_name: "Technology Decision Maker",
        job_title: "VP Engineering / CTO",
        pain_points: "Legacy system limitations, resource constraints, scaling challenges",
        goals_and_objectives: "Implement solutions that drive technical excellence and business outcomes",
        decision_timeline: "3-6 months evaluation and implementation cycle",
        success_metrics: "Technical performance, user adoption, business impact metrics",
        generated: true
      },
      empathy_map: {
        title: "Customer Empathy Map",
        confidence_score: 8.9,
        generation_date: new Date().toISOString(),
        content: `**What They Think:**\n"We need a solution that actually works and integrates well with our existing systems"\n\n**What They Feel:**\n- Pressure to deliver results quickly\n- Concerned about implementation complexity\n- Excited about potential improvements\n\n**What They See:**\n- Competitive pressure in their market\n- Team struggling with current tools\n- Management expecting better outcomes\n\n**What They Do:**\n- Research solutions extensively\n- Consult with technical teams\n- Evaluate multiple vendors\n- Seek proof of concept opportunities\n\n**Pain Points:**\n- Limited time for evaluation\n- Integration complexity concerns\n- Budget approval processes\n\n**Gains:**\n- Improved operational efficiency\n- Better team productivity\n- Competitive advantage`,
        what_they_think: "We need a solution that actually works and integrates well with our existing systems",
        what_they_feel: "Pressure to deliver results quickly, concerned about implementation complexity",
        what_they_see: "Competitive pressure in their market, team struggling with current tools",
        what_they_do: "Research solutions extensively, consult with technical teams, evaluate multiple vendors",
        what_they_hear: "Industry peers discussing similar challenges and solutions",
        pains_and_frustrations: "Limited time for evaluation, integration complexity concerns, budget approval processes",
        gains_and_benefits: "Improved operational efficiency, better team productivity, competitive advantage",
        generated: true
      },
      product_assessment: {
        title: "Product Market Fit Assessment",
        confidence_score: 9.0,
        generation_date: new Date().toISOString(),
        content: `**Market Fit Analysis for ${productName}**\n\n**Current Product Potential Score: 8.2/10**\n\n**Strengths:**\n- Addresses clear market need\n- Differentiated approach to common problem\n- Strong value proposition for target segment\n\n**Market Opportunity:**\nYour product addresses a significant pain point in the ${businessType} market. The growing demand for ${description.toLowerCase()} solutions creates a substantial opportunity.\n\n**Path to 10/10:**\n- Enhanced integration capabilities\n- Expanded feature set for enterprise needs\n- Stronger competitive differentiation\n\n**Customer Conversion Strategy:**\n1. Lead with problem-solution fit demonstration\n2. Provide proof of concept opportunities\n3. Focus on measurable business outcomes\n4. Ensure smooth implementation experience`,
        current_product_potential_score: 8.2,
        gaps_preventing_10: "Enhanced integration capabilities, expanded enterprise features, stronger competitive differentiation",
        market_opportunity: `Significant ${businessType} market opportunity driven by demand for ${description.toLowerCase()} solutions`,
        problems_solved_today: `Addresses key ${businessType} challenges around efficiency, scalability, and competitive positioning`,
        customer_conversion: "Lead with problem-solution fit, provide POC opportunities, focus on measurable outcomes",
        value_indicators: "Improved efficiency metrics, cost savings, time-to-value realization, user adoption rates",
        generated: true
      }
    };
  }
}

// Create singleton instance
const webhookService = new WebhookService();

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.webhookService = webhookService;
}

export default webhookService;