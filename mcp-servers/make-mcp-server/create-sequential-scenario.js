#!/usr/bin/env node

const axios = require('axios');

async function createSequentialResourceScenario() {
  const apiToken = '1da281d0-9ffb-4d7c-9c49-644febffd6da';
  const teamId = 719027;
  
  console.log('🚀 Creating Sequential AI Resource Generation Scenario...');
  console.log('Flow: Product Description → PDR → Persona → ICP → Negative → Value → Potential → Moment → Empathy');
  
  try {
    const scenarioConfig = {
      name: 'H&S Sequential AI Resources Generator',
      teamId: teamId,
      description: 'Sequential AI resource generation: Each output builds on previous context for rich, interconnected resources',
      scheduling: JSON.stringify({
        type: "indefinitely",
        interval: 900
      }),
      blueprint: JSON.stringify({
        flow: [
          // 1. Webhook Trigger
          {
            id: 1,
            module: "builtin:BasicWebhook",
            version: 1,
            parameters: {},
            mapper: {},
            metadata: {
              designer: { x: 0, y: 0 }
            }
          },
          
          // 2. Parse Input JSON
          {
            id: 2,
            module: "json:ParseJSON",
            version: 1,
            parameters: {},
            mapper: {
              json: "{{1.productDescription}}"
            },
            metadata: {
              designer: { x: 200, y: 0 }
            }
          },
          
          // 3. Generate PDR (First in chain)
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
              prompt: "You are an expert product strategist and market analyst. Create a comprehensive, refined product description with precise market positioning and technical details.\n\nUsing this initial product description: \"{{2.productDescription}}\"\n\nCreate a comprehensive PDR (Refined Product Description) that expands and refines this into a professional, market-ready analysis.\n\nOUTPUT REQUIREMENTS: Respond with a JSON object containing exactly these fields:\n\n{\n  \"product_name\": \"Clear, market-ready product name\",\n  \"target_market\": \"Detailed target market description\",\n  \"key_benefits\": \"Top 5-7 key benefits with impact descriptions\",\n  \"competitive_advantages\": \"Unique differentiators vs. competitors\",\n  \"market_positioning\": \"Where this product fits in the market landscape\",\n  \"recommended_price_point\": 29.99,\n  \"value_proposition\": \"Clear, compelling value statement\",\n  \"use_cases\": \"3-5 specific use cases with scenarios\",\n  \"technical_specifications\": \"Key technical requirements, integrations, compatibility\",\n  \"implementation_timeline\": \"Typical deployment/adoption timeline\",\n  \"success_metrics\": \"How customers will measure success with this product\",\n  \"quality_score\": 8.5\n}\n\nEnsure all financial values are numbers (not strings), and quality_score is 1-10 based on market viability and clarity."
            },
            metadata: {
              designer: { x: 400, y: 0 }
            }
          },
          
          // 4. Store PDR in Airtable
          {
            id: 4,
            module: "airtable2:ActionCreateRecord",
            version: 3,
            parameters: {
              base: "app0jJkgTCqn46vp9",
              typecast: false
            },
            mapper: {
              table: "PDR_Resources",
              fields: {
                "Customer Email": "{{1.customerEmail}}",
                "Generation Date": "{{now}}",
                "Product Name": "{{parseJSON(3.choices[].text).product_name}}",
                "Target Market": "{{parseJSON(3.choices[].text).target_market}}",
                "Key Benefits": "{{parseJSON(3.choices[].text).key_benefits}}",
                "Competitive Advantages": "{{parseJSON(3.choices[].text).competitive_advantages}}",
                "Market Positioning": "{{parseJSON(3.choices[].text).market_positioning}}",
                "Recommended Price Point": "{{parseJSON(3.choices[].text).recommended_price_point}}",
                "Value Proposition": "{{parseJSON(3.choices[].text).value_proposition}}",
                "Use Cases": "{{parseJSON(3.choices[].text).use_cases}}",
                "Technical Specifications": "{{parseJSON(3.choices[].text).technical_specifications}}",
                "Implementation Timeline": "{{parseJSON(3.choices[].text).implementation_timeline}}",
                "Success Metrics": "{{parseJSON(3.choices[].text).success_metrics}}",
                "Raw JSON Data": "{{3.choices[].text}}",
                "Quality Score": "{{parseJSON(3.choices[].text).quality_score}}"
              }
            },
            metadata: {
              designer: { x: 600, y: 0 }
            }
          },
          
          // 5. Generate Target Buyer Persona (uses PDR context)
          {
            id: 5,
            module: "openai-gpt-3:createCompletion",
            version: 1,
            parameters: {
              model: "gpt-4",
              max_tokens: 2500,
              temperature: 0.8
            },
            mapper: {
              prompt: "You are an expert buyer persona researcher with deep knowledge of B2B and B2C customer psychology and buying behavior.\n\nORIGINAL PRODUCT: \"{{2.productDescription}}\"\n\nREFINED PRODUCT ANALYSIS (PDR):\n{{3.choices[].text}}\n\nUsing the refined product analysis above, create a detailed Target Buyer Persona representing the IDEAL customer for this product.\n\nOUTPUT REQUIREMENTS: Respond with a JSON object containing exactly these fields:\n\n{\n  \"persona_name\": \"Give them a realistic name (e.g., 'Sarah Marketing Manager')\",\n  \"age_range\": \"Age range (e.g., '28-35')\",\n  \"job_title\": \"Primary job title\",\n  \"industry\": \"Primary industry they work in\",\n  \"company_size\": \"Startup|Small|Medium|Large|Enterprise\",\n  \"annual_income\": 65000,\n  \"education_level\": \"Education background\",\n  \"geographic_location\": \"Primary location/region\",\n  \"pain_points\": \"3-5 major pain points this product solves for them\",\n  \"goals_and_objectives\": \"Professional and personal goals\",\n  \"preferred_communication_channels\": [\"Email\", \"Phone\", \"Social Media\"],\n  \"buying_behavior\": \"How they typically research and purchase products\",\n  \"influences_and_decision_factors\": \"What influences their buying decisions\",\n  \"day_in_life_summary\": \"Typical day description showing when/how product fits\",\n  \"technology_comfort_level\": \"Low|Medium|High|Expert\",\n  \"budget_authority\": \"None|Limited|Moderate|Full\",\n  \"decision_timeline\": \"Typical time from awareness to purchase\",\n  \"objections_and_concerns\": \"Common objections and concerns they raise\",\n  \"success_metrics\": \"How they define success with the product\",\n  \"quality_score\": 8.5\n}\n\nEnsure persona feels real and authentic, based on the specific product context."
            },
            metadata: {
              designer: { x: 800, y: 0 }
            }
          },
          
          // 6. Store Target Buyer Persona
          {
            id: 6,
            module: "airtable2:ActionCreateRecord",
            version: 3,
            parameters: {
              base: "app0jJkgTCqn46vp9",
              typecast: false
            },
            mapper: {
              table: "Target_Buyer_Personas",
              fields: {
                "Customer Email": "{{1.customerEmail}}",
                "Generation Date": "{{now}}",
                "Persona Name": "{{parseJSON(5.choices[].text).persona_name}}",
                "Age Range": "{{parseJSON(5.choices[].text).age_range}}",
                "Job Title": "{{parseJSON(5.choices[].text).job_title}}",
                "Industry": "{{parseJSON(5.choices[].text).industry}}",
                "Company Size": "{{parseJSON(5.choices[].text).company_size}}",
                "Annual Income": "{{parseJSON(5.choices[].text).annual_income}}",
                "Education Level": "{{parseJSON(5.choices[].text).education_level}}",
                "Geographic Location": "{{parseJSON(5.choices[].text).geographic_location}}",
                "Pain Points": "{{parseJSON(5.choices[].text).pain_points}}",
                "Goals and Objectives": "{{parseJSON(5.choices[].text).goals_and_objectives}}",
                "Preferred Communication Channels": "{{parseJSON(5.choices[].text).preferred_communication_channels}}",
                "Buying Behavior": "{{parseJSON(5.choices[].text).buying_behavior}}",
                "Influences and Decision Factors": "{{parseJSON(5.choices[].text).influences_and_decision_factors}}",
                "Day in Life Summary": "{{parseJSON(5.choices[].text).day_in_life_summary}}",
                "Technology Comfort Level": "{{parseJSON(5.choices[].text).technology_comfort_level}}",
                "Budget Authority": "{{parseJSON(5.choices[].text).budget_authority}}",
                "Decision Timeline": "{{parseJSON(5.choices[].text).decision_timeline}}",
                "Objections and Concerns": "{{parseJSON(5.choices[].text).objections_and_concerns}}",
                "Success Metrics": "{{parseJSON(5.choices[].text).success_metrics}}",
                "Raw JSON Data": "{{5.choices[].text}}",
                "Quality Score": "{{parseJSON(5.choices[].text).quality_score}}"
              }
            },
            metadata: {
              designer: { x: 1000, y: 0 }
            }
          },
          
          // 7. Generate ICP (uses PDR + Persona context)
          {
            id: 7,
            module: "openai-gpt-3:createCompletion",
            version: 1,
            parameters: {
              model: "gpt-4",
              max_tokens: 2500,
              temperature: 0.7
            },
            mapper: {
              prompt: "You are an expert B2B sales strategist specializing in ideal customer profiling and account-based marketing.\n\nORIGINAL PRODUCT: \"{{2.productDescription}}\"\n\nREFINED PRODUCT ANALYSIS (PDR):\n{{3.choices[].text}}\n\nTARGET BUYER PERSONA:\n{{5.choices[].text}}\n\nUsing the product analysis and buyer persona above, create a comprehensive Ideal Customer Profile (ICP) focusing on the COMPANY characteristics that make the best customers.\n\nOUTPUT REQUIREMENTS: Respond with a JSON object with these exact fields:\n\n{\n  \"company_size_range\": \"Employee count range (e.g., '50-200 employees')\",\n  \"industry_verticals\": \"Primary industries and verticals that are ideal fits\",\n  \"annual_revenue_range\": \"Revenue range (e.g., '$10M-$50M annually')\",\n  \"employee_count\": 150,\n  \"geographic_markets\": \"Geographic regions/markets to target\",\n  \"technology_stack\": \"Technology infrastructure and tools they likely use\",\n  \"budget_range\": \"Typical budget range for this type of solution\",\n  \"decision_makers\": \"Key decision makers involved in purchase process\",\n  \"organizational_structure\": \"How the organization is typically structured\",\n  \"growth_stage\": \"Startup|Growth|Mature|Enterprise\",\n  \"buying_process\": \"Typical procurement and decision-making process\",\n  \"success_indicators\": \"Signs that indicate a good fit prospect\",\n  \"implementation_readiness\": \"Characteristics that show implementation readiness\",\n  \"support_requirements\": \"Level of support and service they typically need\",\n  \"contract_preferences\": \"Contract terms, length, and structure preferences\",\n  \"integration_needs\": \"Technical integrations they commonly require\",\n  \"compliance_requirements\": \"Industry compliance and regulatory requirements\",\n  \"quality_score\": 8.5\n}"
            },
            metadata: {
              designer: { x: 1200, y: 0 }
            }
          },
          
          // 8. Store ICP
          {
            id: 8,
            module: "airtable2:ActionCreateRecord",
            version: 3,
            parameters: {
              base: "app0jJkgTCqn46vp9",
              typecast: false
            },
            mapper: {
              table: "Ideal_Customer_Profiles",
              fields: {
                "Customer Email": "{{1.customerEmail}}",
                "Generation Date": "{{now}}",
                "Company Size Range": "{{parseJSON(7.choices[].text).company_size_range}}",
                "Industry Verticals": "{{parseJSON(7.choices[].text).industry_verticals}}",
                "Annual Revenue Range": "{{parseJSON(7.choices[].text).annual_revenue_range}}",
                "Employee Count": "{{parseJSON(7.choices[].text).employee_count}}",
                "Geographic Markets": "{{parseJSON(7.choices[].text).geographic_markets}}",
                "Technology Stack": "{{parseJSON(7.choices[].text).technology_stack}}",
                "Budget Range": "{{parseJSON(7.choices[].text).budget_range}}",
                "Decision Makers": "{{parseJSON(7.choices[].text).decision_makers}}",
                "Organizational Structure": "{{parseJSON(7.choices[].text).organizational_structure}}",
                "Growth Stage": "{{parseJSON(7.choices[].text).growth_stage}}",
                "Buying Process": "{{parseJSON(7.choices[].text).buying_process}}",
                "Success Indicators": "{{parseJSON(7.choices[].text).success_indicators}}",
                "Implementation Readiness": "{{parseJSON(7.choices[].text).implementation_readiness}}",
                "Support Requirements": "{{parseJSON(7.choices[].text).support_requirements}}",
                "Contract Preferences": "{{parseJSON(7.choices[].text).contract_preferences}}",
                "Integration Needs": "{{parseJSON(7.choices[].text).integration_needs}}",
                "Compliance Requirements": "{{parseJSON(7.choices[].text).compliance_requirements}}",
                "Raw JSON Data": "{{7.choices[].text}}",
                "Quality Score": "{{parseJSON(7.choices[].text).quality_score}}"
              }
            },
            metadata: {
              designer: { x: 1400, y: 0 }
            }
          }
          
          // Continue with remaining resources... (Negative Persona, Value Messaging, Product Potential, Moment in Life, Empathy Map)
          // Each following same pattern: AI Generation → Airtable Storage → Context for Next
        ],
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
    
    console.log('📤 Creating sequential AI scenario...');
    
    const response = await axios({
      method: 'POST',
      url: 'https://us1.make.com/api/v2/scenarios',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json'
      },
      data: scenarioConfig
    });
    
    console.log('✅ Sequential AI scenario created!');
    console.log('Scenario ID:', response.data.scenario.id);
    console.log('Name:', response.data.scenario.name);
    
    return response.data.scenario.id;
    
  } catch (error) {
    console.error('❌ Error creating sequential scenario:');
    console.error('Status:', error.response?.status);
    console.error('Data:', JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
}

createSequentialResourceScenario()
  .then(scenarioId => {
    console.log(`\n🎉 SUCCESS! Sequential AI Resources scenario created: ${scenarioId}`);
    console.log('\n🔄 Flow: Product Description → PDR → Target Persona → ICP → [continues with 5 more resources]');
    console.log('\n✅ Each AI generation builds on previous context for rich, interconnected resources!');
    console.log('\n📋 Next: Add remaining 5 resources to complete the full sequence');
  })
  .catch(error => {
    console.error('\n💥 Failed to create sequential scenario');
  });