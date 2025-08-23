#!/usr/bin/env node

const axios = require('axios');

async function createBasicScenario() {
  const apiToken = '1da281d0-9ffb-4d7c-9c49-644febffd6da';
  const teamId = 719027;
  
  console.log('🚀 Creating basic webhook scenario...');
  
  try {
    // Create a very simple webhook to Airtable scenario
    const scenarioConfig = {
      name: 'H&S AI Resources Basic',
      teamId: teamId,
      description: 'Basic webhook to Airtable for AI resources',
      scheduling: JSON.stringify({
        type: "indefinitely",
        interval: 900
      }),
      blueprint: JSON.stringify({
        flow: [
          {
            id: 1,
            module: "builtin:BasicWebhook",
            version: 1,
            parameters: {},
            mapper: {},
            metadata: {
              designer: {
                x: 0,
                y: 0
              }
            }
          },
          {
            id: 2,
            module: "airtable2:ActionCreateRecord",
            version: 3,
            parameters: {
              base: "app0jJkgTCqn46vp9"
            },
            mapper: {
              table: "Customer Assets",
              fields: {
                "Customer ID": "{{1.customerId}}",
                "Generated Resource": "{{1.content}}",
                "Resource Type": "{{1.type}}"
              }
            },
            metadata: {
              designer: {
                x: 300,
                y: 0
              }
            }
          }
        ]
      })
    };
    
    console.log('📤 Creating basic webhook → Airtable scenario...');
    
    const response = await axios({
      method: 'POST',
      url: 'https://us1.make.com/api/v2/scenarios',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json'
      },
      data: scenarioConfig
    });
    
    console.log('✅ Basic scenario created!');
    console.log('Scenario ID:', response.data.scenario.id);
    
    return response.data.scenario.id;
    
  } catch (error) {
    console.error('❌ Error:');
    console.error('Status:', error.response?.status);
    console.error('Data:', JSON.stringify(error.response?.data, null, 2));
    
    // Try even simpler
    console.log('\n🔄 Trying minimal scenario...');
    try {
      const minimalConfig = {
        name: 'H&S AI Resources Minimal',
        teamId: teamId,
        scheduling: JSON.stringify({
          type: "indefinitely"
        }),
        blueprint: JSON.stringify({
          flow: []
        })
      };
      
      const minimalResponse = await axios({
        method: 'POST',
        url: 'https://us1.make.com/api/v2/scenarios',
        headers: {
          'Authorization': `Token ${apiToken}`,
          'Content-Type': 'application/json'
        },
        data: minimalConfig
      });
      
      console.log('✅ Minimal scenario created!');
      console.log('Scenario ID:', minimalResponse.data.scenario.id);
      return minimalResponse.data.scenario.id;
      
    } catch (minimalError) {
      console.error('❌ Even minimal failed:', minimalError.response?.data);
      throw minimalError;
    }
  }
}

createBasicScenario()
  .then(scenarioId => {
    console.log(`\n🎉 SUCCESS! Created scenario: ${scenarioId}`);
    console.log('Now we can build on this foundation!');
  })
  .catch(error => {
    console.error('\n💥 All attempts failed');
  });