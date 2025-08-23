#!/usr/bin/env node

const axios = require('axios');

async function testWebhookTrigger() {
  console.log('🧪 Testing AI Resource Generation via existing webhook...');
  
  // Use the H&S Platform webhook ID: 2401943
  // We need to get the actual webhook URL from Make.com
  
  const webhookUrl = 'https://hook.us1.make.com/2401943'; // This might need the full URL
  
  const testPayload = {
    resourceRequest: {
      type: 'icp_template',
      customerId: 'CUST_4',
      customerData: {
        industry: 'B2B SaaS',
        companySize: '50-200 employees',
        technicalMaturity: 'High',
        growthStage: 'Scale-up',
        painPoints: ['Lead qualification', 'Sales process efficiency', 'Revenue forecasting'],
        currentTools: ['HubSpot', 'Salesforce', 'Slack'],
        teamSize: 25
      },
      parameters: {
        format: 'professional_template',
        urgency: 'high',
        stakeholders: ['VP Sales', 'Marketing Director', 'CEO'],
        customization: 'enterprise_focused'
      },
      timestamp: Date.now(),
      source: 'h_s_platform'
    }
  };
  
  console.log('📤 Test payload for AI resource generation:');
  console.log(JSON.stringify(testPayload, null, 2));
  
  console.log('\n🎯 Expected AI Generation Flow:');
  console.log('1. Webhook receives request');
  console.log('2. Parse customer data and requirements');
  console.log('3. Generate customized ICP template using GPT-4');
  console.log('4. Store in Airtable Resources Library');
  console.log('5. Return download link to platform');
  
  console.log('\n💡 Alternative Approach:');
  console.log('Since API scenario creation is complex, we can:');
  console.log('1. Create scenario manually in Make.com UI');
  console.log('2. Configure webhook → AI → storage flow');
  console.log('3. Test with above payload');
  console.log('4. Integrate with H&S platform');
  
  console.log('\n🚀 Ready for manual configuration!');
  console.log('Webhook ID: 2401943');
  console.log('Target: GPT-4 → Airtable app0jJkgTCqn46vp9');
}

testWebhookTrigger();