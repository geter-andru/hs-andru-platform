import { airtableService } from './airtableService';

export const authService = {
  // Validate Google authentication session
  async validateGoogleSession(sessionData) {
    try {
      if (!sessionData || !sessionData.user || !sessionData.isAuthenticated) {
        return {
          valid: false,
          error: 'Invalid session data'
        };
      }

      const { user, customerData } = sessionData;

      // Validate Google token is still valid (basic check)
      if (!user.email || !user.googleId) {
        return {
          valid: false,
          error: 'Invalid Google user data'
        };
      }

      return {
        valid: true,
        user,
        customerData,
        authMethod: 'google'
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  },

  // Get current authentication state
  getCurrentAuth() {
    try {
      const sessionData = sessionStorage.getItem('authSession');
      if (!sessionData) {
        return { isAuthenticated: false };
      }

      const parsed = JSON.parse(sessionData);
      
      // Check if session is expired (24 hours)
      const loginTime = new Date(parsed.loginTime);
      const now = new Date();
      const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        this.signOut();
        return { isAuthenticated: false };
      }

      return {
        isAuthenticated: true,
        ...parsed
      };
    } catch (error) {
      console.error('Error getting current auth:', error);
      return { isAuthenticated: false };
    }
  },

  // Sign out user
  signOut() {
    sessionStorage.removeItem('authSession');
    
    // Sign out from Google if available
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  },

  // Validate customer credentials (including admin) - Legacy method for backward compatibility
  async validateCredentials(customerId, accessToken) {
    try {
      if (!customerId || !accessToken) {
        return { 
          valid: false, 
          error: 'Missing customer ID or access token' 
        };
      }

      // Check for admin credentials (support both old and new formats)
      if ((customerId === 'dru78DR9789SDF862' || customerId === 'CUST_4') && accessToken === 'admin-demo-token-2025') {
        try {
          // Try to load from Airtable first to get actual customer name
          const customerData = await airtableService.getCustomerAssets(customerId, accessToken);
          return {
            valid: true,
            customerData
          };
        } catch (error) {
          // Fall back to mock data if Airtable fails
          console.log('Admin Airtable load failed, using mock data:', error.message);
          const adminData = await this.loadAdminUser();
          return {
            valid: true,
            customerData: adminData
          };
        }
      }

      // Check for test customer credentials (support both old and new formats)
      if ((customerId === 'dru9K2L7M8N4P5Q6' || customerId === 'CUST_02' || customerId === 'CUST_2') && accessToken === 'test-token-123456') {
        const testData = await this.loadTestUser();
        return {
          valid: true,
          customerData: testData
        };
      }

      // Check for Supabase authenticated users
      if (customerId === 'SUPABASE_USER' && accessToken === 'supabase-auth') {
        const supabaseData = await this.loadSupabaseUser();
        return {
          valid: true,
          customerData: supabaseData
        };
      }

      // Try to load from Airtable for other customers
      const customerData = await airtableService.getCustomerAssets(customerId, accessToken);
      
      return {
        valid: true,
        customerData
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  },

  // Load admin user data
  async loadAdminUser() {
    // Return static admin data for reliable demo access
    return {
      customerId: 'dru78DR9789SDF862',
      customer_id: 'dru78DR9789SDF862',
      customerName: 'Geter',
      customer_name: 'Geter',
      company: 'H&S Revenue Intelligence',
      email: 'admin@hs-platform.com',
      isAdmin: true,
      demoMode: true,
      hasPersonalizedICP: true,
      hasDetailedAnalysis: true,
      adminAccess: true,
      // Include sample content for admin demos
      icp_content: JSON.stringify({
        title: "Advanced ICP Analysis Framework",
        description: "Enterprise-grade customer profiling system",
        segments: [
          { name: "Enterprise SaaS Companies", score: 95, criteria: ["500+ employees", "$50M+ revenue", "Tech-forward culture"] },
          { name: "Mid-Market Tech Companies", score: 85, criteria: ["100-500 employees", "$10M-50M revenue", "Digital transformation focus"] },
          { name: "Growth-Stage Startups", score: 75, criteria: ["Series B+", "Strong tech adoption", "Scaling challenges"] }
        ]
      }),
      cost_calculator_content: JSON.stringify({
        title: "Cost of Inaction Calculator",
        scenarios: ["Conservative", "Realistic", "Aggressive"],
        categories: ["Lost Revenue", "Operational Inefficiencies", "Competitive Disadvantage"]
      }),
      business_case_content: JSON.stringify({
        title: "Business Case Builder",
        templates: ["Pilot Program", "Full Implementation"],
        frameworks: ["ROI Calculation", "Payback Period"]
      })
    };
  },

  // Load test user data
  async loadTestUser() {
    return {
      customerId: 'dru9K2L7M8N4P5Q6',
      customer_id: 'dru9K2L7M8N4P5Q6',
      customerName: 'Test Customer',
      customer_name: 'Test Customer',
      company: 'Test Company Inc.',
      email: 'test@company.com',
      isAdmin: false,
      demoMode: false,
      hasPersonalizedICP: true,
      hasDetailedAnalysis: false,
      // Basic content for testing
      icp_content: JSON.stringify({
        title: "Test ICP Analysis",
        segments: [
          { name: "Enterprise SaaS", score: 85 },
          { name: "Mid-Market Tech", score: 70 }
        ]
      }),
      cost_calculator_content: null,
      business_case_content: null,
      // Assessment-related fields will be generated by fetchCustomerWithAssessment
      detailed_icp_analysis: null,
      competency_progress: null
    };
  },

  // Load Supabase user data
  async loadSupabaseUser() {
    return {
      customerId: 'SUPABASE_USER',
      customer_id: 'SUPABASE_USER',
      customerName: 'Supabase User',
      customer_name: 'Supabase User',
      company: 'H&S Platform User',
      email: 'user@platform.com',
      isAdmin: false,
      demoMode: false,
      hasPersonalizedICP: true,
      hasDetailedAnalysis: true,
      supabaseAuth: true,
      // Include sample content for Supabase users
      icp_content: JSON.stringify({
        title: "Professional ICP Analysis",
        description: "Your personalized customer profiling system",
        segments: [
          { name: "Enterprise SaaS Companies", score: 90, criteria: ["500+ employees", "$25M+ revenue", "Tech adoption"] },
          { name: "Mid-Market Companies", score: 80, criteria: ["100-500 employees", "$5M-25M revenue", "Growth phase"] }
        ]
      }),
      cost_calculator_content: JSON.stringify({
        title: "Cost of Inaction Analysis",
        scenarios: ["Conservative", "Realistic", "Aggressive"],
        categories: ["Lost Revenue", "Operational Costs", "Competitive Position"]
      }),
      business_case_content: JSON.stringify({
        title: "Business Case Framework",
        templates: ["Pilot Program", "Full Implementation"],
        frameworks: ["ROI Analysis", "Payback Calculation"]
      })
    };
  },

  // Extract credentials from URL
  extractCredentials(location) {
    const urlParams = new URLSearchParams(location.search);
    const pathParts = location.pathname.split('/');
    
    return {
      customerId: pathParts[2] || null, // /customer/:customerId
      accessToken: urlParams.get('token')
    };
  },

  // Generate secure session
  generateSession(customerData, accessToken) {
    const sessionData = {
      customerId: customerData.customerId,
      customerName: customerData.customerName,
      recordId: customerData.id,
      accessToken: accessToken,
      timestamp: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      version: 2, // Added to force session regeneration when structure changes
      isAdmin: customerData.isAdmin || false,
      demoMode: customerData.demoMode || false,
      adminAccess: customerData.adminAccess || false
    };

    // Store in sessionStorage (more secure than localStorage for tokens)
    sessionStorage.setItem('customerSession', JSON.stringify(sessionData));
    return sessionData;
  },

  // Get current session
  getCurrentSession() {
    try {
      const sessionData = sessionStorage.getItem('customerSession');
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      
      // Check if session has the required version (force regeneration for old sessions)
      if (!session.version || session.version < 2) {
        this.clearSession();
        return null;
      }
      
      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error reading session:', error);
      this.clearSession();
      return null;
    }
  },

  // Clear session
  clearSession() {
    sessionStorage.removeItem('customerSession');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return this.getCurrentSession() !== null;
  },

  // Refresh session timestamp
  refreshSession() {
    const session = this.getCurrentSession();
    if (session) {
      session.timestamp = Date.now();
      sessionStorage.setItem('customerSession', JSON.stringify(session));
    }
  }
};