const fs = require('fs');
const path = require('path');

// Create a complete test session that the frontend can find
const testSessionData = {
  sessionId: "frontend-test-session-123",
  customerId: "CUST_5", 
  recordId: "recKU4vMCwMzVvFxD",
  productName: "Test Product from Frontend",
  businessType: "B2B",
  generationStatus: "completed",
  timestamp: new Date().toISOString(),
  qualityMetrics: {
    overall_confidence: 8.7,
    icp_confidence: 8.5,
    persona_confidence: 9.0,
    empathy_confidence: 8.2,
    assessment_confidence: 9.1,
    validation_status: "completed",
    total_modules_valid: 4
  },
  validationResults: {
    content_quality_check: "passed",
    business_logic_validation: "passed", 
    factual_accuracy_check: "passed",
    completeness_score: 87,
    recommendation: "approved_for_delivery",
    notes: "High-quality Core Resources generated successfully for frontend testing"
  },
  resources: {
    icp_analysis: {
      title: "Ideal Customer Profile Analysis",
      confidence_score: 8.5,
      content: {
        text: `# Ideal Customer Profile: Test Product from Frontend

## Company Profile
**Size Range**: Mid-market to Enterprise (500-5,000 employees)
**Industries**: Technology, Manufacturing, Financial Services
**Revenue Range**: $100M - $1B+
**Employee Count**: 1,500
**Geographic Markets**: North America, Europe

## Organizational Structure
Mature organizations with dedicated teams and C-suite leadership for digital transformation initiatives

## Technology & Integration
**Technology Stack**: Cloud-based infrastructure, enterprise ERP systems, API-ready platforms
**Budget Range**: $50K - $300K annually for B2B solutions
**Integration Needs**: Seamless integration with existing business systems

## Decision Making
**Key Decision Makers**: C-suite executives, department heads, technology leaders
**Buying Process**: 6-12 month evaluation cycle with multiple stakeholders
**Contract Preferences**: Multi-year SaaS agreements with scalable pricing

## Requirements & Success
**Compliance**: Industry-specific regulatory requirements
**Implementation Readiness**: Established IT frameworks and dedicated resources
**Success Indicators**: Measurable efficiency improvements and ROI demonstration

## Market Research Insights
Strong market demand for B2B solutions that provide immediate value while integrating seamlessly with existing technology stacks. Buyers prioritize proven ROI and reliable vendor partnerships.

**Confidence Score**: 8.5/10
**Data Sources**: Industry reports and market analysis`,
        format: "markdown"
      },
      generated: true,
      generation_method: 'claude_with_web_research',
      web_research_sources: ["Industry market analysis", "B2B buyer behavior studies"],
      analysis_date: new Date().toISOString()
    },
    persona: {
      title: "Target Buyer Personas",
      confidence_score: 9.0,
      content: {
        text: `# Primary Buyer Persona: Technology Decision Maker

## Demographics & Professional Profile
**Age Range**: 35-50
**Annual Income**: $180,000
**Education**: Advanced degree in Technology/Business
**Location**: Major metropolitan areas
**Job Title**: CTO, VP Technology, Director of Operations
**Industry**: Technology, Manufacturing, Financial Services
**Company Size**: Enterprise

## Goals & Motivations
Drive digital transformation while ensuring operational efficiency and measurable ROI. Seeking solutions that integrate seamlessly with existing infrastructure while providing immediate business value.

## Pain Points & Challenges
Managing complex technology stacks, integration challenges between systems, demonstrating ROI on technology investments, balancing innovation with operational stability.

## Day in the Life
Strategic technology planning, vendor evaluations, cross-functional collaboration with business stakeholders, staying current with emerging technologies and industry trends.

## Buying Behavior & Decision Process
**Decision Timeline**: 6-12 months
**Buying Behavior**: Thorough evaluation with technical assessment and business case development
**Key Influences**: Integration capabilities, vendor stability, proven ROI, peer references

## Communication Preferences
**Preferred Channels**: Email, Video Calls, In-Person meetings, Technical documentation

## Objections & Concerns
Integration complexity, vendor lock-in, total cost of ownership, implementation timeline impact on operations

## Success Metrics
Successful system integration, operational efficiency gains, cost reduction achievements, stakeholder satisfaction

**Confidence Score**: 9.0/10
**Market Research**: Based on enterprise technology buyer behavior studies`,
        format: "markdown"
      },
      generated: true,
      generation_method: 'claude_with_web_research',
      personas_count: 1,
      web_research_sources: ["Enterprise technology buyer surveys", "B2B decision maker analysis"]
    },
    empathyMap: {
      title: "Customer Empathy Map",
      confidence_score: 8.2,
      content: {
        text: `# Customer Empathy Map: Technology Decision Maker

## What They THINK 💭
How can we leverage technology to drive business growth while managing risk? Our current systems are limiting our ability to scale efficiently. We need solutions that integrate well and provide measurable value.

## What They FEEL 😊😰
Excited about technology's potential but cautious about implementation risks. Pressured to deliver results while ensuring operational stability. Confident in technical assessment but concerned about stakeholder buy-in.

## What They SEE 👀
Competitive pressure from more agile organizations, emerging technologies disrupting traditional approaches, internal inefficiencies that technology could solve, budget constraints requiring careful investment decisions.

## What They SAY & DO 🗣️💼
**What They Say**: "We need solutions that integrate seamlessly with our existing infrastructure and provide clear ROI"

**What They Do**: Research vendors extensively, conduct pilot programs, build detailed business cases, coordinate with multiple stakeholders for evaluation

## What They HEAR 👂
Feedback from internal teams about system limitations, vendor presentations about new capabilities, industry insights from conferences and peer networks, pressure from leadership for digital transformation.

## PAINS 😣
Integration complexity with legacy systems, vendor reliability concerns, implementation timeline pressure, budget justification requirements, change management challenges

## GAINS 🎯
Operational efficiency improvements, competitive advantage through technology, stakeholder satisfaction, career advancement through successful implementations, measurable business impact

## External Influences
Industry trends, competitive pressure, regulatory requirements, customer expectations, technology advancement pace

## Internal Motivations
Professional growth through successful technology leadership, business impact through operational improvements, organizational transformation

## Professional Environment
Enterprise organizations with complex technology stacks, multiple stakeholders, established processes, and strategic focus on digital transformation

## Personal & Professional Goals
**Personal Goals**: Career advancement, professional recognition, work-life balance
**Professional Goals**: Successful technology implementations, measurable business impact, team development

## Hopes & Dreams
Leading digital transformation initiatives that provide significant business value, establishing the organization as a technology leader, building high-performing teams

## Fears & Anxieties
Technology implementation failures, budget overruns, stakeholder resistance to change, vendor relationship issues, career impact of project outcomes

**Confidence Score**: 8.2/10
**Research Methodology**: Enterprise decision maker behavioral analysis`,
        format: "markdown"
      },
      generated: true,
      generation_method: 'claude_with_web_research',
      map_completion_date: new Date().toISOString(),
      research_methodology: 'behavioral_analysis_and_industry_research'
    },
    productPotential: {
      title: "Product Market Fit Assessment",
      confidence_score: 9.1,
      content: {
        text: `# Product Market Fit Assessment: Test Product from Frontend

## Current Problem Solving Capability
Addresses immediate operational challenges through automation, integration, and process optimization for B2B organizations seeking scalable technology solutions.

## Future Problem Solving Potential
Advanced analytics capabilities, AI-powered insights, expanded integration ecosystem, predictive features for proactive decision making

## Why These Problems Matter
Critical for operational efficiency, competitive advantage, regulatory compliance, and business growth in increasingly digital marketplace

## Market Problem Concentration
Most prominent in mid-market to enterprise B2B organizations with complex technology stacks requiring seamless integration and measurable ROI

## Target Buyer Engagement Strategy
Industry conferences, technology forums, thought leadership content, strategic partnerships with system integrators, digital marketing to technology decision makers

## Customer Acquisition Strategy
Pilot programs demonstrating clear value, comprehensive ROI analysis, reference customers and case studies, technical integration assessments, dedicated customer success management

## Value Realization Indicators
Operational efficiency improvements, successful system integrations, cost reduction achievements, positive stakeholder feedback, contract renewals and expansions

## Customer Retention Strategy
Continuous platform enhancement, proactive customer success management, regular optimization recommendations, strategic relationship building, competitive pricing with clear value demonstration

## Current Product Potential
**Score**: 8.5/10

## Areas for Improvement
Enhanced integration capabilities, expanded industry-specific features, stronger competitive positioning, broader market presence, advanced analytics capabilities

## Data-Backed Improvement Strategy
Customer feedback integration, market research insights, competitive analysis, feature development based on user behavior, strategic partnerships for market expansion

## Market Research Analysis
Strong market demand in B2B technology sector with growing emphasis on integration capabilities and measurable ROI. Buyers prioritize vendor stability and proven implementation success.

## Conclusion
Strong product-market fit with clear opportunities for enhancement through deeper integrations and expanded capabilities

**Confidence Score**: 9.1/10
**Assessment Date**: ${new Date().toISOString().split('T')[0]}`,
        format: "markdown"
      },
      generated: true,
      generation_method: 'claude_with_web_research',
      assessment_date: new Date().toISOString(),
      market_research_sources: ["B2B technology market analysis", "Enterprise software adoption studies"]
    }
  }
};

// Write the test session data to the webhook-data directory
const dataDir = path.join(__dirname, 'webhook-data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const filePath = path.join(dataDir, `${testSessionData.sessionId}.json`);
fs.writeFileSync(filePath, JSON.stringify(testSessionData, null, 2));

console.log('✅ Frontend test session created successfully!');
console.log(`📁 Session ID: ${testSessionData.sessionId}`);
console.log(`📁 File: ${filePath}`);
console.log(`🔗 Test URL: http://localhost:3000/customer/CUST_5/simplified/icp?token=dotun-quick-access-2025`);
console.log('');
console.log('To test:');
console.log('1. Navigate to the ICP Analysis tool');
console.log('2. Go to "Generate Resources" tab');
console.log('3. Fill out the form and click "Generate Core Resources"');
console.log('4. The loading screen should complete and show the generated resources');