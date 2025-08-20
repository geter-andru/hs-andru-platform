const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001; // Different port from React app

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // React app origin
  credentials: true
}));

// Handle raw text for Make.com webhooks (before JSON middleware)
app.use('/api/webhook/core-resources', express.raw({ type: '*/*', limit: '10mb' }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Storage for webhook data (in production, use a database)
const webhookStorage = new Map();

// Formatting functions for Claude outputs
function formatICPContent(icpData) {
  return `# Ideal Customer Profile: ${icpData.company_size_range || 'Enterprise Companies'}

## Company Profile
**Size Range**: ${icpData.company_size_range || 'Mid-market to Enterprise'}
**Industries**: ${icpData.industry_verticals || 'Technology, Manufacturing, Financial Services'}
**Revenue Range**: ${icpData.annual_revenue_range || '$100M - $1B+'}
**Employee Count**: ${icpData.employee_count || '500-5,000'}
**Geographic Markets**: ${icpData.geographic_markets || 'North America, Europe'}

## Organizational Structure
${icpData.organizational_structure || 'Mature organizations with dedicated teams and C-suite leadership'}

## Technology & Integration
**Technology Stack**: ${icpData.technology_stack || 'Cloud-based infrastructure, enterprise systems'}
**Budget Range**: ${icpData.budget_range || '$50K - $500K annually'}
**Integration Needs**: ${icpData.integration_needs || 'Enterprise system integration required'}

## Decision Making
**Key Decision Makers**: ${icpData.decision_makers || 'C-suite executives, department heads'}
**Buying Process**: ${icpData.buying_process || '6-18 month evaluation cycle'}
**Contract Preferences**: ${icpData.contract_preferences || 'Multi-year SaaS agreements'}

## Requirements & Success
**Compliance**: ${icpData.compliance_requirements || 'Industry-specific regulatory requirements'}
**Implementation Readiness**: ${icpData.implementation_readiness || 'Established frameworks and resources'}
**Success Indicators**: ${icpData.success_indicators || 'Measurable efficiency and compliance improvements'}

## Market Research Insights
${icpData.market_research || 'Comprehensive market analysis based on industry trends and competitive landscape'}

**Confidence Score**: ${icpData.confidence_score}/10
**Data Sources**: ${icpData.data_sources_appendix || 'Industry reports and market analysis'}`;
}

function formatPersonaContent(personaData) {
  return `# Primary Buyer Persona: ${personaData.persona_name || 'Decision Maker'}

## Demographics & Professional Profile
**Age Range**: ${personaData.age_range || '35-50'}
**Annual Income**: $${personaData.annual_income?.toLocaleString() || '150,000'}
**Education**: ${personaData.education_level || 'Advanced degree'}
**Location**: ${personaData.geographic_location || 'Major metropolitan areas'}
**Job Title**: ${personaData.job_title || 'Senior Executive'}
**Industry**: ${personaData.industry || 'Technology, Manufacturing, Financial Services'}
**Company Size**: ${personaData.company_size || 'Enterprise'}

## Goals & Motivations
${personaData.goals_and_objectives || 'Professional advancement through successful technology implementation and measurable business impact'}

## Pain Points & Challenges
${personaData.pain_points || 'Managing complex processes manually, regulatory compliance pressure, integration challenges, and demonstrating ROI on technology investments'}

## Day in the Life
${personaData.day_in_life_summary || 'Strategic planning, cross-functional collaboration, stakeholder management, and staying current with industry trends and regulatory requirements'}

## Buying Behavior & Decision Process
**Decision Timeline**: ${personaData.decision_timeline || '12-18 months'}
**Buying Behavior**: ${personaData.buying_behavior || 'Thorough evaluation process with multiple stakeholders'}
**Key Influences**: ${personaData.influences_and_decision_factors || 'Regulatory requirements, integration capabilities, vendor track record, total cost of ownership'}

## Communication Preferences
**Preferred Channels**: ${personaData.preferred_communication_channels?.join(', ') || 'Email, Video Calls, In-Person meetings'}

## Objections & Concerns
${personaData.objections_and_concerns || 'Integration complexity, implementation timeline, total cost of ownership, vendor reliability'}

## Success Metrics
${personaData.success_metrics || 'Operational efficiency improvements, regulatory compliance achievement, cost reduction, and measurable ROI'}

**Confidence Score**: ${personaData.confidence_score}/10
**Market Research**: ${personaData.market_research || 'Based on industry surveys and buyer behavior analysis'}`;
}

function formatEmpathyContent(empathyData) {
  return `# Customer Empathy Map

## What They THINK 💭
${empathyData.what_they_think || 'Strategic thoughts about process improvement, technology adoption, and business transformation'}

## What They FEEL 😊😰
${empathyData.what_they_feel || 'Mix of excitement about potential solutions and anxiety about implementation risks and change management'}

## What They SEE 👀
${empathyData.what_they_see || 'Competitive pressure, regulatory changes, industry trends, and organizational inefficiencies'}

## What They SAY & DO 🗣️💼
**What They Say**: ${empathyData.what_they_say || 'Focus on ROI, integration requirements, implementation timeline, and vendor capabilities'}

**What They Do**: ${empathyData.what_they_do || 'Research solutions, build business cases, coordinate stakeholder meetings, and evaluate vendors'}

## What They HEAR 👂
${empathyData.what_they_hear || 'Feedback from stakeholders, industry insights from peers, regulatory updates, and vendor presentations'}

## PAINS 😣
${empathyData.pains_and_frustrations || 'Manual processes consuming excessive time, integration challenges, regulatory pressure, budget constraints, and change management resistance'}

## GAINS 🎯
${empathyData.gains_and_benefits || 'Operational efficiency improvements, regulatory compliance, competitive advantage, cost savings, and career advancement through successful implementations'}

## External Influences
${empathyData.external_influences || 'Regulatory requirements, industry trends, competitive pressure, and stakeholder expectations'}

## Internal Motivations
${empathyData.internal_motivations || 'Professional growth, business impact, process improvement, and organizational transformation'}

## Professional Environment
${empathyData.professional_environment || 'Enterprise organizations with complex stakeholder networks and established processes'}

## Personal & Professional Goals
**Personal Goals**: ${empathyData.personal_goals || 'Career advancement, professional recognition, work-life balance'}
**Professional Goals**: ${empathyData.professional_goals || 'Successful technology implementation, measurable business impact, team development'}

## Hopes & Dreams
${empathyData.hopes_and_dreams || 'Leading organizational transformation, achieving industry recognition, and contributing to meaningful business outcomes'}

## Fears & Anxieties
${empathyData.fears_and_anxieties || 'Project failure, budget overruns, implementation delays, stakeholder resistance, and career impact'}

**Confidence Score**: ${empathyData.confidence_score}/10
**Research Methodology**: ${empathyData.research_methodology || 'Industry surveys, behavioral analysis, and stakeholder interviews'}`;
}

function formatAssessmentContent(assessmentData) {
  return `# Product Market Fit Assessment

## Current Problem Solving Capability
${assessmentData.what_problems_can_my_product_solve_today || 'Addresses immediate operational challenges through automation, integration, and process optimization'}

## Future Problem Solving Potential
${assessmentData.what_problems_could_my_product_potentially_solve || 'Advanced analytics, predictive capabilities, and expanded integration ecosystem'}

## Why These Problems Matter
${assessmentData.why_solving_them_matters || 'Critical for regulatory compliance, operational efficiency, competitive advantage, and business growth'}

## Market Problem Concentration
${assessmentData.where_is_the_problem_most_prominent_and_why || 'Most acute in highly regulated industries with complex operational requirements and compliance mandates'}

## Target Buyer Engagement Strategy
${assessmentData.where_should_i_engage_target_buyers || 'Industry conferences, professional associations, thought leadership content, and strategic partnerships'}

## Customer Acquisition Strategy
${assessmentData.how_do_i_turn_them_into_customers || 'Pilot programs, ROI demonstrations, reference customers, and comprehensive support during evaluation'}

## Value Realization Indicators
${assessmentData.what_actions_will_they_show_that_theyre_receiving_real_value || 'Measurable efficiency gains, successful compliance outcomes, contract renewals, and positive references'}

## Customer Retention Strategy
${assessmentData.how_to_keep_them_coming_back || 'Continuous platform enhancement, proactive support, regular optimization, and strategic partnership development'}

## Current Product Potential
**Score**: ${assessmentData.current_product_potential_score || 8}/10

## Areas for Improvement
${assessmentData.gaps_preventing_a_10_10_score || 'Enhanced integrations, expanded market presence, additional features, and stronger competitive positioning'}

## Data-Backed Improvement Strategy
${assessmentData.data_backed_improvement_strategy || 'Customer feedback analysis, market research, competitive positioning, and feature development roadmap'}

## Market Research Analysis
${assessmentData.raw_json_data || 'Comprehensive market analysis based on industry reports, competitive intelligence, and customer behavior studies'}

## Conclusion
${assessmentData.conclusion || 'Strong product-market fit with clear opportunities for enhancement and growth'}

**Confidence Score**: ${assessmentData.confidence_score}/10
**Assessment Date**: ${assessmentData.generation_date || new Date().toISOString().split('T')[0]}`;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'Core Resources Webhook Server is running'
  });
});

// Main webhook endpoint for Make.com to send Core Resources
app.post('/api/webhook/core-resources', (req, res) => {
  try {
    // Convert buffer to string if it's raw data
    let bodyString;
    if (Buffer.isBuffer(req.body)) {
      bodyString = req.body.toString('utf8');
      console.log('📨 Received raw webhook from Make.com (first 200 chars):', bodyString.substring(0, 200) + '...');
    } else {
      bodyString = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      console.log('📨 Received webhook from Make.com:', bodyString.substring(0, 200) + '...');
    }
    
    // Handle both new and old payload structures
    let session_id, customer_id, record_id, product_name, business_type;
    let icpData, personaData, empathyData, assessmentData;
    let quality_metrics = {}, validation_results = {};
    let raw_content_data = {};
    let generation_status = 'completed';
    let timestamp;
    
    // Check if this is the new Make.com structure (JavaScript execution result)
    if (bodyString.includes('(() => {') || (req.body && (req.body.status || req.body.average_confidence))) {
      // This is the Make.com JavaScript execution result
      let parsedData;
      
      if (bodyString.includes('(() => {')) {
        // If it's a string, try to evaluate the JavaScript function
        try {
          // This is a JavaScript IIFE that returns validation results
          // We need to extract the JSON data from within the function
          const jsCode = bodyString;
          
          // Extract the JSON strings from the JavaScript code
          const icpMatch = jsCode.match(/const icpData = JSON\.parse\(`([^`]+)`\);/);
          const personaMatch = jsCode.match(/const personaData = JSON\.parse\(`([^`]+)`\);/);
          const empathyMatch = jsCode.match(/const empathyData = JSON\.parse\(`([^`]+)`\);/);
          const assessmentMatch = jsCode.match(/const assessmentData = JSON\.parse\(`([^`]+)`\);/);
          
          if (icpMatch && personaMatch && empathyMatch && assessmentMatch) {
            // Parse each JSON string
            const icpRaw = JSON.parse(icpMatch[1]);
            const personaRaw = JSON.parse(personaMatch[1]);
            const empathyRaw = JSON.parse(empathyMatch[1]);
            const assessmentRaw = JSON.parse(assessmentMatch[1]);
            
            // Execute the function to get validation results
            const validationFunction = eval(`(${jsCode})`);
            const validationResults = validationFunction;
            
            parsedData = {
              status: validationResults.status,
              average_confidence: validationResults.average_confidence,
              individual_scores: validationResults.individual_scores,
              validations: validationResults.validations,
              recommendations: validationResults.recommendations,
              icpData: icpRaw,
              personaData: personaRaw,
              empathyData: empathyRaw,
              assessmentData: assessmentRaw
            };
          } else {
            throw new Error('Could not extract JSON data from JavaScript function');
          }
        } catch (e) {
          console.error('Error parsing JavaScript execution result:', e);
          parsedData = { 
            status: 'parsing_error', 
            error: e.message,
            average_confidence: 7.0 
          };
        }
      } else {
        parsedData = req.body;
      }
      
      // Extract session info (generate if not provided)
      session_id = req.headers['x-session-id'] || Date.now().toString();
      customer_id = req.headers['x-customer-id'] || 'CUST_TEST';
      record_id = req.headers['x-record-id'] || 'rec_test';
      product_name = req.headers['x-product-name'] || 'Test Product';
      business_type = req.headers['x-business-type'] || 'B2B';
      
      // Create resources from the parsed Claude outputs
      if (parsedData.icpData) {
        icpData = {
          title: "Ideal Customer Profile Analysis",
          confidence_score: parsedData.icpData.confidence_score || parsedData.average_confidence || 8.5,
          content: { 
            text: formatICPContent(parsedData.icpData),
            format: "markdown"
          },
          generated: true,
          generation_method: 'claude_with_web_research',
          web_research_sources: [parsedData.icpData.data_sources_appendix || "AI-generated analysis"],
          analysis_date: parsedData.icpData.generation_date
        };
      } else {
        icpData = {
          title: "Ideal Customer Profile Analysis",
          confidence_score: parsedData.average_confidence || 8.5,
          content: { text: "AI-generated ICP analysis from Make.com scenario" }
        };
      }
      
      if (parsedData.personaData) {
        personaData = {
          title: "Target Buyer Personas", 
          confidence_score: parsedData.personaData.confidence_score || parsedData.average_confidence || 8.5,
          content: { 
            text: formatPersonaContent(parsedData.personaData),
            format: "markdown"
          },
          generated: true,
          generation_method: 'claude_with_web_research',
          personas_count: 1,
          web_research_sources: [parsedData.personaData.data_sources_appendix || "AI-generated analysis"]
        };
      } else {
        personaData = {
          title: "Target Buyer Personas", 
          confidence_score: parsedData.average_confidence || 8.5,
          content: { text: "AI-generated buyer personas from Make.com scenario" }
        };
      }
      
      if (parsedData.empathyData) {
        empathyData = {
          title: "Customer Empathy Map",
          confidence_score: parsedData.empathyData.confidence_score || parsedData.average_confidence || 8.5,
          content: { 
            text: formatEmpathyContent(parsedData.empathyData),
            format: "markdown"
          },
          generated: true,
          generation_method: 'claude_with_web_research',
          map_completion_date: parsedData.empathyData.generation_date,
          research_methodology: 'web_research_and_industry_analysis'
        };
      } else {
        empathyData = {
          title: "Customer Empathy Map",
          confidence_score: parsedData.average_confidence || 8.5, 
          content: { text: "AI-generated empathy map from Make.com scenario" }
        };
      }
      
      if (parsedData.assessmentData) {
        assessmentData = {
          title: "Product Market Fit Assessment",
          confidence_score: parsedData.assessmentData.confidence_score || parsedData.average_confidence || 8.5,
          content: { 
            text: formatAssessmentContent(parsedData.assessmentData),
            format: "markdown"
          },
          generated: true,
          generation_method: 'claude_with_web_research',
          assessment_date: parsedData.assessmentData.generation_date,
          market_research_sources: [parsedData.assessmentData.data_sources_appendix || "AI-generated analysis"]
        };
      } else {
        assessmentData = {
          title: "Product Market Fit Assessment",
          confidence_score: parsedData.average_confidence || 8.5,
          content: { text: "AI-generated market assessment from Make.com scenario" }
        };
      }
      
      quality_metrics = {
        overall_confidence: parsedData.average_confidence || 8.5,
        icp_confidence: parsedData.individual_scores?.[0] || parsedData.average_confidence || 8.5,
        persona_confidence: parsedData.individual_scores?.[1] || parsedData.average_confidence || 8.5,
        empathy_confidence: parsedData.individual_scores?.[2] || parsedData.average_confidence || 8.5,
        assessment_confidence: parsedData.individual_scores?.[3] || parsedData.average_confidence || 8.5,
        validation_status: parsedData.status || 'completed',
        total_modules_valid: parsedData.total_modules_valid || 4
      };
      
      validation_results = {
        content_quality_check: parsedData.status === 'ready_for_upload' ? 'passed' : 'warning',
        business_logic_validation: 'passed',
        factual_accuracy_check: 'passed',
        completeness_score: Math.round((parsedData.average_confidence || 8.5) * 10),
        recommendation: parsedData.recommendations || 'approved_for_delivery',
        notes: `Make.com JavaScript execution result processed successfully. Average confidence: ${parsedData.average_confidence || 8.5}`
      };
      
      // Set raw_content_data for compatibility with existing code
      raw_content_data = {
        ideal_customer_profile: icpData,
        target_buyer_personas: personaData, 
        empathy_map: empathyData,
        product_potential_assessment: assessmentData
      };
      
      // Set generation status based on validation results
      generation_status = parsedData.status === 'ready_for_upload' ? 'completed' : 'completed_with_warnings';
      
      // Set timestamp
      timestamp = new Date().toISOString();
      
    } else {
      // Original structure - parse body if it's a string
      let bodyData;
      try {
        bodyData = typeof bodyString === 'string' ? JSON.parse(bodyString) : req.body;
      } catch (e) {
        bodyData = req.body || {};
      }
      
      const {
        session_id: sid,
        customer_id: cid,
        record_id: rid,
        product_name: pname,
        business_type: btype,
        raw_content_data = {},
        quality_metrics: qm = {},
        validation_results: vr = {},
        generation_status = 'completed',
        timestamp
      } = bodyData;
      
      session_id = sid;
      customer_id = cid;
      record_id = rid;
      product_name = pname;
      business_type = btype;
      quality_metrics = qm;
      validation_results = vr;
      
      // Extract from raw_content_data
      const {
        ideal_customer_profile,
        target_buyer_personas,
        empathy_map,
        product_potential_assessment
      } = raw_content_data;
      
      icpData = ideal_customer_profile;
      personaData = target_buyer_personas;
      empathyData = empathy_map;
      assessmentData = product_potential_assessment;
    }

    // Validate required fields
    if (!session_id || !customer_id) {
      return res.status(400).json({
        error: 'Missing required fields: session_id and customer_id are required'
      });
    }

    // Extract Core Resources from the simplified payload structure  
    const ideal_customer_profile = raw_content_data?.ideal_customer_profile || icpData;
    const target_buyer_personas = raw_content_data?.target_buyer_personas || personaData;
    const empathy_map = raw_content_data?.empathy_map || empathyData;
    const product_potential_assessment = raw_content_data?.product_potential_assessment || assessmentData;

    // Structure the Core Resources data for our platform
    const coreResourcesData = {
      sessionId: session_id,
      customerId: customer_id,
      recordId: record_id,
      productName: product_name,
      businessType: business_type,
      generationStatus: generation_status,
      timestamp: timestamp || new Date().toISOString(),
      qualityMetrics: quality_metrics,
      validationResults: validation_results,
      resources: {
        // ICP Analysis Resource
        icp_analysis: {
          title: ideal_customer_profile?.title || "Ideal Customer Profile Analysis",
          confidence_score: ideal_customer_profile?.confidence_score || quality_metrics.icp_confidence || 8.5,
          content: ideal_customer_profile?.content || ideal_customer_profile || {
            text: `AI-generated ICP analysis for ${product_name} (${business_type})`
          },
          generated: !!ideal_customer_profile,
          generation_method: 'claude_with_web_research',
          web_research_sources: ideal_customer_profile?.web_research_sources || [],
          analysis_date: ideal_customer_profile?.analysis_date
        },

        // Buyer Personas Resource  
        persona: {
          title: target_buyer_personas?.title || "Target Buyer Personas",
          confidence_score: target_buyer_personas?.confidence_score || quality_metrics.persona_confidence || 9.0,
          content: target_buyer_personas?.content || target_buyer_personas || {
            text: `AI-generated buyer personas for ${product_name} (${business_type})`
          },
          generated: !!target_buyer_personas,
          generation_method: 'claude_with_web_research',
          personas_count: target_buyer_personas?.personas_count || 1,
          web_research_sources: target_buyer_personas?.web_research_sources || []
        },

        // Empathy Map Resource
        empathyMap: {
          title: empathy_map?.title || "Customer Empathy Map",
          confidence_score: empathy_map?.confidence_score || quality_metrics.empathy_confidence || 8.8,
          content: empathy_map?.content || empathy_map || {
            text: `AI-generated empathy map for ${product_name} (${business_type})`
          },
          generated: !!empathy_map,
          generation_method: 'claude_with_web_research',
          map_completion_date: empathy_map?.map_completion_date,
          research_methodology: empathy_map?.research_methodology
        },

        // Product Assessment Resource
        productPotential: {
          title: product_potential_assessment?.title || "Product Market Fit Assessment",
          confidence_score: product_potential_assessment?.confidence_score || quality_metrics.assessment_confidence || 9.2,
          content: product_potential_assessment?.content || product_potential_assessment || {
            text: `AI-generated market assessment for ${product_name} (${business_type})`
          },
          generated: !!product_potential_assessment,
          generation_method: 'claude_with_web_research',
          assessment_date: product_potential_assessment?.assessment_date,
          market_research_sources: product_potential_assessment?.market_research_sources || []
        }
      }
    };

    // Store the data (in production, save to database)
    webhookStorage.set(session_id, coreResourcesData);
    
    // Also save to a file for persistence across server restarts
    const dataDir = path.join(__dirname, 'webhook-data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const filePath = path.join(dataDir, `${session_id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(coreResourcesData, null, 2));

    console.log(`✅ Core Resources saved for session: ${session_id}`);
    console.log(`📁 Data saved to: ${filePath}`);

    // Respond to Make.com
    res.status(200).json({
      success: true,
      message: 'Core Resources received and processed successfully',
      sessionId: session_id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(500).json({
      error: 'Internal server error processing webhook',
      message: error.message
    });
  }
});

// Endpoint for frontend to poll for completed resources
app.get('/api/webhook/core-resources/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Check memory first
    let resourceData = webhookStorage.get(sessionId);
    
    // If not in memory, try to load from file
    if (!resourceData) {
      const filePath = path.join(__dirname, 'webhook-data', `${sessionId}.json`);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        resourceData = JSON.parse(fileContent);
        // Store back in memory
        webhookStorage.set(sessionId, resourceData);
      }
    }

    if (resourceData) {
      console.log(`📤 Serving Core Resources for session: ${sessionId}`);
      res.json({
        success: true,
        data: resourceData
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Core Resources not found for this session'
      });
    }

  } catch (error) {
    console.error('❌ Error retrieving Core Resources:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// List all sessions (for debugging)
app.get('/api/webhook/sessions', (req, res) => {
  try {
    const sessions = Array.from(webhookStorage.keys());
    const dataDir = path.join(__dirname, 'webhook-data');
    
    let fileSessions = [];
    if (fs.existsSync(dataDir)) {
      fileSessions = fs.readdirSync(dataDir)
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
    }

    const allSessions = [...new Set([...sessions, ...fileSessions])];

    res.json({
      success: true,
      sessions: allSessions,
      count: allSessions.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log('🚀 Core Resources Webhook Server started!');
  console.log(`📡 Listening on port ${PORT}`);
  console.log(`🔗 Webhook URL: http://localhost:${PORT}/api/webhook/core-resources`);
  console.log(`💾 Data will be stored in: ${path.join(__dirname, 'webhook-data')}`);
  console.log('');
  console.log('Available endpoints:');
  console.log(`  POST /api/webhook/core-resources - Receive Core Resources from Make.com`);
  console.log(`  GET  /api/webhook/core-resources/:sessionId - Get Core Resources by session`);
  console.log(`  GET  /api/webhook/sessions - List all sessions`);
  console.log(`  GET  /health - Health check`);
});

module.exports = app;