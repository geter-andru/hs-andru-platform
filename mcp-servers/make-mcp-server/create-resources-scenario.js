#!/usr/bin/env node

/**
 * Create AI Resources Library Scenario
 * Direct script to create the foundational Make.com scenario
 */

const MakeMCPServer = require('./index.js');

async function createResourcesLibraryScenario() {
  console.log('🚀 Creating AI Resources Library Scenario...\n');
  
  const server = new MakeMCPServer();
  
  try {
    // Create the foundational scenario
    const result = await server.createResourcesLibraryScenario(
      'H&S AI Resources Library Generator - Foundation',
      ['icp_templates', 'roi_calculators', 'business_cases', 'sales_scripts']
    );
    
    console.log('✅ Scenario Creation Result:');
    console.log(result.content[0].text);
    
    // List scenarios to confirm creation
    console.log('\n📋 Updated Scenario List:');
    const listResult = await server.listScenarios();
    console.log(listResult.content[0].text);
    
  } catch (error) {
    console.error('❌ Error creating scenario:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the script
if (require.main === module) {
  createResourcesLibraryScenario();
}