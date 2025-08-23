#!/usr/bin/env node

const axios = require('axios');

async function debugMakeAPI() {
  const apiToken = '1da281d0-9ffb-4d7c-9c49-644febffd6da';
  const orgId = 1780256;
  
  try {
    // First, let's see what a successful scenario looks like
    console.log('🔍 Getting existing scenario structure...');
    
    const response = await axios({
      method: 'GET',
      url: `https://us1.make.com/api/v2/scenarios/2978136?organizationId=${orgId}`,
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Existing scenario structure:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error getting scenario:', error.response?.data || error.message);
    
    // Try creating a minimal scenario
    console.log('\n🔬 Trying minimal scenario creation...');
    
    try {
      const minimalScenario = {
        name: 'Test AI Resources Generator',
        organizationId: orgId
      };
      
      const createResponse = await axios({
        method: 'POST',
        url: `https://us1.make.com/api/v2/scenarios`,
        headers: {
          'Authorization': `Token ${apiToken}`,
          'Content-Type': 'application/json'
        },
        data: minimalScenario
      });
      
      console.log('✅ Minimal scenario created:');
      console.log(JSON.stringify(createResponse.data, null, 2));
      
    } catch (createError) {
      console.error('❌ Create error:', createError.response?.data || createError.message);
    }
  }
}

debugMakeAPI();