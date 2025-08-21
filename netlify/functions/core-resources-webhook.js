/**
 * Netlify Function: Core Resources Webhook
 * Receives completed resources from Make.com and stores them for the frontend
 */

const allowedOrigins = [
  'https://platform.andru-ai.com',
  'http://localhost:3000',
  'http://localhost:3001'
];

exports.handler = async (event, context) => {
  // Handle CORS
  const origin = event.headers.origin;
  const corsHeaders = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-session-id, x-customer-id',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0]
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // Parse the incoming data from Make.com with error handling
    let data;
    try {
      data = JSON.parse(event.body);
      console.log('Raw webhook body:', event.body);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError, 'Body:', event.body);
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid JSON format', details: parseError.message })
      };
    }
    
    const sessionId = data.session_id || event.headers['x-session-id'];
    const customerId = data.customer_id || event.headers['x-customer-id'];

    console.log('Received webhook:', { 
      sessionId, 
      customerId, 
      timestamp: new Date().toISOString(),
      dataKeys: Object.keys(data),
      hasResourcesCollection: !!data.resourcesCollection
    });

    // Validate required fields
    if (!sessionId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing session_id' })
      };
    }

    // Handle the new Make.com data format with resourcesCollection
    let icpData, personaData, empathyData, assessmentData;
    
    try {
      if (data.resourcesCollection) {
        // New format from Make.com
        const resources = data.resourcesCollection;
        icpData = resources.icp_analysisCollection;
        personaData = resources.buyer_personasCollection;
        empathyData = resources.empathy_mapCollection;
        assessmentData = resources.product_assessmentCollection;
        
        console.log('Using resourcesCollection format:', {
          hasIcp: !!icpData,
          hasPersona: !!personaData,
          hasEmpathy: !!empathyData,
          hasAssessment: !!assessmentData
        });
      } else {
        // Current Make.com format - parse JSON strings
        console.log('Using individual resource fields format');
        try {
          icpData = data.icpData ? JSON.parse(data.icpData) : null;
          personaData = data.personaData ? JSON.parse(data.personaData) : null;
          empathyData = data.empathyData ? JSON.parse(data.empathyData) : null;
          assessmentData = data.assessmentData ? JSON.parse(data.assessmentData) : null;
          
          console.log('Parsed resource data:', {
            hasIcp: !!icpData,
            hasPersona: !!personaData,
            hasEmpathy: !!empathyData,
            hasAssessment: !!assessmentData
          });
        } catch (parseError) {
          console.error('Error parsing nested JSON strings:', parseError, 'Field causing error:', parseError.message);
          // Try to continue with partial data instead of failing completely
          console.log('Attempting to parse resources individually...');
          
          // Parse each field individually to isolate issues
          try { icpData = data.icpData ? JSON.parse(data.icpData) : null; } catch (e) { console.error('icpData parse error:', e.message); icpData = null; }
          try { personaData = data.personaData ? JSON.parse(data.personaData) : null; } catch (e) { console.error('personaData parse error:', e.message); personaData = null; }
          try { empathyData = data.empathyData ? JSON.parse(data.empathyData) : null; } catch (e) { console.error('empathyData parse error:', e.message); empathyData = null; }
          try { assessmentData = data.assessmentData ? JSON.parse(data.assessmentData) : null; } catch (e) { console.error('assessmentData parse error:', e.message); assessmentData = null; }
        }
      }
    } catch (resourceError) {
      console.error('Error processing resources:', resourceError);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Resource processing failed', details: resourceError.message })
      };
    }

    // Transform Make.com data into platform format
    const resources = {
      icp_analysis: {
        title: "Ideal Customer Profile Analysis",
        confidence_score: icpData?.confidence_score || 8.0,
        generation_date: icpData?.generation_date || new Date().toISOString(),
        content: `**Company Size Range:** ${icpData?.company_size_range || 'Not specified'}\n\n**Industry Verticals:** ${icpData?.industry_verticals || 'Not specified'}\n\n**Annual Revenue Range:** ${icpData?.annual_revenue_range || 'Not specified'}\n\n**Geographic Markets:** ${icpData?.geographic_markets || 'Not specified'}\n\n**Technology Stack:** ${icpData?.technology_stack || 'Not specified'}\n\n**Budget Range:** ${icpData?.budget_range || 'Not specified'}\n\n**Decision Makers:** ${icpData?.decision_makers || 'Not specified'}`,
        company_size_range: icpData?.company_size_range,
        industry_verticals: icpData?.industry_verticals,
        annual_revenue_range: icpData?.annual_revenue_range,
        geographic_markets: icpData?.geographic_markets,
        technology_stack: icpData?.technology_stack,
        budget_range: icpData?.budget_range,
        decision_makers: icpData?.decision_makers,
        growth_stage: icpData?.growth_stage,
        generated: true
      },
      buyer_personas: {
        title: "Target Buyer Personas",
        confidence_score: personaData?.confidence_score || 9.0,
        generation_date: personaData?.generation_date || new Date().toISOString(),
        content: `**${personaData?.persona_name || 'Key Decision Maker'}**\n\n**Job Title:** ${personaData?.job_title || 'Not specified'}\n\n**Pain Points:** ${personaData?.pain_points || 'Not specified'}\n\n**Goals & Objectives:** ${personaData?.goals_and_objectives || 'Not specified'}\n\n**Decision Timeline:** ${personaData?.decision_timeline || 'Not specified'}\n\n**Success Metrics:** ${personaData?.success_metrics || 'Not specified'}`,
        persona_name: personaData?.persona_name,
        job_title: personaData?.job_title,
        pain_points: personaData?.pain_points,
        goals_and_objectives: personaData?.goals_and_objectives,
        decision_timeline: personaData?.decision_timeline,
        success_metrics: personaData?.success_metrics,
        generated: true
      },
      empathy_map: {
        title: "Customer Empathy Map",
        confidence_score: empathyData?.confidence_score || 8.8,
        generation_date: empathyData?.generation_date || new Date().toISOString(),
        content: `**What They Think:** ${empathyData?.what_they_think || 'Not specified'}\n\n**What They Feel:** ${empathyData?.what_they_feel || 'Not specified'}\n\n**What They See:** ${empathyData?.what_they_see || 'Not specified'}\n\n**What They Do:** ${empathyData?.what_they_do || 'Not specified'}\n\n**What They Hear:** ${empathyData?.what_they_hear || 'Not specified'}`,
        what_they_think: empathyData?.what_they_think,
        what_they_feel: empathyData?.what_they_feel,
        what_they_see: empathyData?.what_they_see,
        what_they_do: empathyData?.what_they_do,
        what_they_hear: empathyData?.what_they_hear,
        pains_and_frustrations: empathyData?.pains_and_frustrations,
        gains_and_benefits: empathyData?.gains_and_benefits,
        generated: true
      },
      product_assessment: {
        title: "Product Market Fit Assessment",
        confidence_score: assessmentData?.confidence_score || 9.2,
        generation_date: assessmentData?.generation_date || new Date().toISOString(),
        content: `**Current Product Potential Score:** ${assessmentData?.current_product_potential_score || 'Not specified'}/10\n\n**Problems You Solve Today:** ${assessmentData?.what_problems_can_my_product_solve_today || 'Not specified'}\n\n**Gaps Preventing 10/10:** ${assessmentData?.gaps_preventing_a_10_10_score || 'Not specified'}\n\n**Market Opportunity:** ${assessmentData?.where_is_the_problem_most_prominent_and_why || 'Not specified'}`,
        current_product_potential_score: assessmentData?.current_product_potential_score,
        gaps_preventing_10: assessmentData?.gaps_preventing_a_10_10_score,
        market_opportunity: assessmentData?.where_is_the_problem_most_prominent_and_why,
        problems_solved_today: assessmentData?.what_problems_can_my_product_solve_today,
        customer_conversion: assessmentData?.how_do_i_turn_them_into_customers,
        value_indicators: assessmentData?.what_actions_will_they_show_that_theyre_receiving_real_value,
        generated: true
      }
    };

    // Store resources for frontend retrieval
    // Using environment variable storage for production deployment
    
    // Create a storage object for this session
    const storedData = {
      sessionId,
      customerId,
      resources,
      status: 'completed',
      timestamp: new Date().toISOString(),
      averageConfidence: [
        icpData?.confidence_score || 8,
        personaData?.confidence_score || 9,
        empathyData?.confidence_score || 8.8,
        assessmentData?.confidence_score || 9.2
      ].reduce((a, b) => a + b, 0) / 4
    };

    // Simple approach: Return resources directly in webhook response
    // Since Netlify functions are stateless, we'll rely on the webhook response
    // and have the frontend handle the resources immediately
    
    // Also store in global for immediate access within same instance
    global.completedResources = global.completedResources || {};
    global.completedResources[sessionId] = storedData;
    
    // Also return the storage URL for frontend to fetch
    const resourcesUrl = `/.netlify/functions/get-resources?sessionId=${sessionId}`;

    // Log completion for debugging
    console.log('Resources generated successfully:', {
      sessionId,
      customerId,
      resourceCount: Object.keys(resources).length,
      averageConfidence: storedData.averageConfidence,
      timestamp: new Date().toISOString()
    });

    // Return success response with resource data that Make.com expects
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        session_id: sessionId,
        customer_id: customerId,
        resources_generated: Object.keys(resources).length,
        average_confidence: storedData.averageConfidence,
        resources: resources, // Include the actual resources in the response
        resources_url: resourcesUrl, // URL for frontend to fetch resources
        message: 'Resources received and processed successfully',
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Webhook error:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
