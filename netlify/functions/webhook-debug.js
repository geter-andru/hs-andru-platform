/**
 * Debug webhook endpoint to log exactly what Make.com is sending
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
    // Log everything for debugging
    console.log('=== DEBUG WEBHOOK ===');
    console.log('Method:', event.httpMethod);
    console.log('Headers:', JSON.stringify(event.headers, null, 2));
    console.log('Query Params:', JSON.stringify(event.queryStringParameters, null, 2));
    console.log('Body Length:', event.body ? event.body.length : 0);
    console.log('Raw Body:', event.body);
    
    // Try to parse JSON if it's a POST
    if (event.httpMethod === 'POST' && event.body) {
      try {
        const parsed = JSON.parse(event.body);
        console.log('Parsed JSON:', JSON.stringify(parsed, null, 2));
      } catch (parseError) {
        console.log('JSON Parse Error:', parseError.message);
      }
    }
    
    console.log('=== END DEBUG ===');

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Debug webhook received',
        timestamp: new Date().toISOString(),
        method: event.httpMethod,
        bodyLength: event.body ? event.body.length : 0
      })
    };

  } catch (error) {
    console.error('Debug webhook error:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Debug webhook error',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};