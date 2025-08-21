/**
 * Netlify Function: Get Resources
 * Retrieves completed resources stored by the core-resources-webhook
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
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // Get session ID from query parameters
    const sessionId = event.queryStringParameters?.sessionId;
    
    if (!sessionId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing sessionId parameter' })
      };
    }

    // Check if resources exist in multiple storage locations
    let storedData = null;
    
    // 1. Check global storage first (same function instance)
    global.completedResources = global.completedResources || {};
    storedData = global.completedResources[sessionId];
    
    // 2. If not found, check process environment (cross-instance)
    if (!storedData) {
      const envData = process.env[`RESOURCES_${sessionId}`];
      if (envData) {
        try {
          storedData = JSON.parse(envData);
          // Cache it in global for future calls
          global.completedResources[sessionId] = storedData;
        } catch (parseError) {
          console.error('Error parsing stored data:', parseError);
        }
      }
    }

    if (!storedData) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Resources not found',
          sessionId,
          message: 'Resources may not be ready yet or session ID is invalid',
          debug: {
            globalKeys: Object.keys(global.completedResources || {}),
            envKeys: Object.keys(process.env).filter(key => key.startsWith('RESOURCES_')).length
          }
        })
      };
    }

    // Return the resources
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        ...storedData,
        retrieved_at: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Get resources error:', error);
    
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