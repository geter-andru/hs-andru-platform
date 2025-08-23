#!/usr/bin/env node

const axios = require('axios');

async function createWorkingScenario() {
  const apiToken = '1da281d0-9ffb-4d7c-9c49-644febffd6da';
  const teamId = 719027;
  const webhookId = 2401943;
  
  console.log('🚀 Creating working AI Resources scenario...');
  
  try {
    const scenarioConfig = {
      name: 'H&S AI Resources Library Generator',
      teamId: teamId,
      description: 'AI-powered resource generation for H&S Revenue Intelligence Platform',
      scheduling: JSON.stringify({
        type: "indefinitely",
        interval: 900
      }),
      blueprint: JSON.stringify({
        flow: [
          {
            id: 1,
            module: "webhook",
            version: 1,
            parameters: {
              hook: webhookId
            },
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
            module: "json:ParseJSON", 
            version: 1,
            parameters: {},
            mapper: {
              json: "{{1.resourceRequest}}"
            },
            metadata: {
              designer: {
                x: 300,
                y: 0
              }
            }
          },
          {
            id: 3,
            module: "openai-gpt-3:createCompletion",
            version: 1,
            parameters: {
              model: "gpt-4",
              max_tokens: 2000,
              temperature: 0.7
            },
            mapper: {
              prompt: "Generate a professional {{2.type}} resource for B2B SaaS company. Context: {{2.customerData}}. Make it enterprise-ready and actionable.",
              system: "You are an expert B2B sales consultant creating professional revenue intelligence resources."
            },
            metadata: {
              designer: {
                x: 600,
                y: 0
              }
            }
          },
          {
            id: 4,
            module: "airtable2:ActionCreateRecord",
            version: 3,
            parameters: {
              base: "app0jJkgTCqn46vp9",
              typecast: false
            },
            mapper: {
              table: "Customer Assets",
              fields: {
                "Customer ID": "{{2.customerId}}",
                "Generated Resource": "{{3.choices[].text}}",
                "Resource Type": "{{2.type}}",
                "Generation Date": "{{now}}",
                "Status": "Generated"
              }
            },
            metadata: {
              designer: {
                x: 900,
                y: 0
              }
            }
          }
        ]
      })
    };
    
    console.log('📤 Creating scenario with webhook → AI → Airtable flow...');
    
    const response = await axios({
      method: 'POST',
      url: 'https://us1.make.com/api/v2/scenarios',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json'
      },
      data: scenarioConfig
    });
    
    console.log('✅ AI Resources scenario created successfully!');
    console.log('Scenario ID:', response.data.scenario.id);
    console.log('Name:', response.data.scenario.name);
    console.log('Webhook ID:', webhookId);
    
    // Now activate the scenario
    console.log('\n🔄 Activating scenario...');
    
    const activateResponse = await axios({
      method: 'POST',
      url: `https://us1.make.com/api/v2/scenarios/${response.data.scenario.id}/start`,
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Scenario activated and ready to process AI resource requests!');
    
    return {
      scenarioId: response.data.scenario.id,
      webhookId: webhookId,
      status: 'active'
    };
    
  } catch (error) {
    console.error('❌ Error:');
    console.error('Status:', error.response?.status);
    console.error('Data:', JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
}

// Run it
createWorkingScenario()
  .then(result => {
    console.log(`\n🎉 SUCCESS! AI Resources Library is LIVE!`);
    console.log(`Scenario ID: ${result.scenarioId}`);
    console.log(`Webhook ID: ${result.webhookId}`);
    console.log(`Status: ${result.status}`);
    console.log('\n🚀 Ready for AI resource generation!');
    console.log('\nFlow: Webhook → Parse JSON → GPT-4 Generation → Airtable Storage');
  })
  .catch(error => {
    console.error('\n💥 Failed to create and activate scenario');
  });