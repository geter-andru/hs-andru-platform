#!/usr/bin/env node

const axios = require('axios');

async function createSimpleScenario() {
  const apiToken = '1da281d0-9ffb-4d7c-9c49-644febffd6da';
  const teamId = 719027;
  
  console.log('🚀 Creating simple AI Resources scenario...');
  
  try {
    const scenarioConfig = {
      name: 'H&S AI Resources Library Generator',
      teamId: teamId,
      description: 'AI-powered resource generation for H&S Revenue Intelligence Platform'
    };
    
    console.log('📤 Sending scenario config:');
    console.log(JSON.stringify(scenarioConfig, null, 2));
    
    const response = await axios({
      method: 'POST',
      url: 'https://us1.make.com/api/v2/scenarios',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json'
      },
      data: scenarioConfig
    });
    
    console.log('✅ Scenario created successfully!');
    console.log('Scenario ID:', response.data.scenario.id);
    console.log('Name:', response.data.scenario.name);
    console.log('Team ID:', response.data.scenario.teamId);
    
    return response.data.scenario.id;
    
  } catch (error) {
    console.error('❌ Error creating scenario:');
    console.error('Status:', error.response?.status);
    console.error('Data:', JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
}

// Run it
createSimpleScenario()
  .then(scenarioId => {
    console.log(`\n🎉 Success! Created scenario with ID: ${scenarioId}`);
    console.log('\nNext steps:');
    console.log('1. Add webhook trigger to scenario');
    console.log('2. Configure AI generation modules');
    console.log('3. Set up Airtable storage');
  })
  .catch(error => {
    console.error('\n💥 Failed to create scenario');
  });