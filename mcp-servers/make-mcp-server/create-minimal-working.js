#!/usr/bin/env node

const axios = require('axios');

async function createMinimalWorking() {
  const apiToken = '1da281d0-9ffb-4d7c-9c49-644febffd6da';
  const teamId = 719027;
  
  console.log('🚀 Creating minimal working scenario...');
  
  try {
    const scenarioConfig = {
      name: 'H&S AI Resources Library',
      teamId: teamId,
      scheduling: JSON.stringify({
        type: "indefinitely"
      }),
      blueprint: JSON.stringify({
        flow: [],
        metadata: {
          version: 1,
          scenario: {
            roundtrips: 1,
            maxResults: 1,
            autoCommit: true,
            sequential: false,
            confidential: false,
            dataloss: false,
            dlq: false
          },
          designer: {
            orphans: []
          }
        }
      })
    };
    
    console.log('📤 Creating minimal scenario with required metadata...');
    
    const response = await axios({
      method: 'POST',
      url: 'https://us1.make.com/api/v2/scenarios',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json'
      },
      data: scenarioConfig
    });
    
    console.log('✅ SUCCESS! Minimal scenario created!');
    console.log('Scenario ID:', response.data.scenario.id);
    console.log('Name:', response.data.scenario.name);
    
    return response.data.scenario.id;
    
  } catch (error) {
    console.error('❌ Error:');
    console.error('Status:', error.response?.status);
    console.error('Data:', JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
}

createMinimalWorking()
  .then(scenarioId => {
    console.log(`\n🎉 BREAKTHROUGH! Created scenario: ${scenarioId}`);
    console.log('\n✅ Foundation is ready!');
    console.log('Now we can add modules via Make.com UI or API updates!');
  })
  .catch(error => {
    console.error('\n💥 Still failed');
  });