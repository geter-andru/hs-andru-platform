const axios = require('axios');

// Test the simplified 7-module Make.com payload structure
const testPayload = {
  session_id: "test-simplified-123",
  customer_id: "CUST_5", 
  record_id: "recKU4vMCwMzVvFxD",
  product_name: "AI Sales Assistant",
  business_type: "B2B",
  generation_status: "completed",
  timestamp: new Date().toISOString(),
  
  // Simplified raw content data from 7-module Make.com scenario
  raw_content_data: {
    ideal_customer_profile: {
      title: "Ideal Customer Profile Analysis",
      confidence_score: 9.1,
      content: {
        text: `# Ideal Customer Profile: AI Sales Assistant

## Target Company Profile
**Company Size**: 100-500 employees  
**Industry**: Technology, SaaS, Professional Services  
**Revenue Range**: $10M-100M annually  
**Growth Stage**: Scaling/Growth phase  
**Geographic Focus**: North America, Europe  

## Firmographic Characteristics
- **Technology Stack**: Cloud-first, API-driven infrastructure
- **Sales Team Size**: 10-50 sales professionals
- **Current Tools**: CRM (HubSpot/Salesforce), some automation
- **Decision Timeline**: 3-6 month evaluation cycles
- **Budget Authority**: $50K-250K annual technology budget

## Key Decision Makers
**Primary Buyer**: VP/Director of Sales Operations  
**Economic Buyer**: CFO/COO  
**Technical Buyer**: CTO/IT Director  
**End Users**: Sales Managers, Account Executives, SDRs  

## Pain Points & Triggers
- Manual lead qualification consuming 40%+ of sales time
- Inconsistent lead scoring across team members  
- Poor visibility into pipeline quality and conversion
- Difficulty scaling personalized outreach
- Integration challenges between sales tools

## Buying Triggers
- Rapid team growth requiring process standardization
- Missing revenue targets due to inefficient processes
- Competitive pressure demanding faster sales cycles
- Leadership mandate for sales automation/AI adoption

## Success Criteria
- 30%+ reduction in time-to-qualify leads
- 15%+ improvement in conversion rates
- Seamless integration with existing CRM
- Adoption rate >80% within 90 days
- Measurable ROI within 6 months`,
        format: "markdown"
      },
      analysis_date: new Date().toISOString(),
      web_research_sources: [
        "gartner.com - Sales Technology Market Analysis",
        "salesforce.com - State of Sales Report 2024", 
        "hubspot.com - Sales Enablement Trends"
      ]
    },

    target_buyer_personas: {
      title: "Target Buyer Personas",
      confidence_score: 8.9,
      content: {
        text: `# Primary Buyer Persona: Sales Operations Director

## Demographics
**Name**: Sarah Martinez (Persona Example)  
**Age**: 35-45 years old  
**Education**: MBA or Bachelor's + 10+ years experience  
**Location**: Major metropolitan areas  
**Company Size**: 200-500 employees  

## Professional Profile
**Role**: Director/VP of Sales Operations  
**Reports To**: Chief Revenue Officer/VP Sales  
**Team Size**: 3-8 direct reports  
**Experience**: 8-15 years in sales/operations  
**Previous Roles**: Sales Manager → Sr. Sales Manager → Sales Ops  

## Daily Responsibilities
- Sales process optimization and standardization
- CRM administration and data quality management  
- Sales performance analytics and reporting
- Tool evaluation and vendor management
- Cross-functional collaboration with Marketing/CS

## Goals & Motivations
**Professional Goals**:
- Increase sales team productivity by 25%
- Implement predictable, scalable sales processes
- Establish data-driven decision making culture
- Build career path toward VP/CRO role

**Personal Motivations**:
- Recognition as strategic business partner
- Autonomy in process design and tool selection
- Continuous learning and skill development
- Work-life balance with remote flexibility

## Challenges & Pain Points
**Daily Frustrations**:
- Spending 60% of time on manual reporting
- Inconsistent data entry across sales team
- Integration complexity between 8+ tools
- Constant requests for ad-hoc analysis

**Strategic Challenges**:
- Proving ROI of sales operations initiatives
- Getting executive buy-in for new technology
- Balancing automation with human touch
- Managing change resistance from sales team

## Information Sources & Preferences
**Professional Development**:
- Sales Operations forums and communities
- LinkedIn Learning and industry webinars
- Vendor-sponsored events and demos
- Peer networking and best practice sharing

**Communication Preferences**:
- Email for initial outreach and documentation
- Video calls for demos and discovery
- Slack/Teams for quick internal communication
- Phone calls for urgent decisions only

## Buying Process & Decision Criteria
**Evaluation Process**:
1. Internal needs assessment (2-4 weeks)
2. Vendor research and RFP creation (3-4 weeks)  
3. Demo and pilot programs (4-6 weeks)
4. Reference calls and final evaluation (2-3 weeks)
5. Contract negotiation and approval (2-4 weeks)

**Decision Criteria** (weighted):
- Ease of CRM integration (25%)
- User adoption potential (20%)
- ROI and cost justification (20%)
- Vendor support and training (15%)
- Scalability and future features (10%)
- Security and compliance (10%)

## Objections & Concerns
**Common Objections**:
- "Our current process works fine"
- "Implementation will disrupt sales productivity"  
- "Budget is already allocated for this year"
- "Sales team won't adopt another tool"

**Underlying Concerns**:
- Risk of project failure reflecting poorly
- Complexity of change management
- Vendor reliability and long-term viability
- Hidden costs and scope creep`,
        format: "markdown"
      },
      personas_count: 3,
      web_research_sources: [
        "salesoperations.org - Buyer Research Study",
        "linkedin.com - Sales Operations Professional Groups",
        "g2.com - Sales Tool Buyer Reviews"
      ]
    },

    empathy_map: {
      title: "Customer Empathy Map",
      confidence_score: 8.7,
      content: {
        text: `# Customer Empathy Map: Sales Operations Director

## What They THINK 💭
**Strategic Thoughts**:
- "How can I make our sales process more predictable?"
- "We need better visibility into pipeline quality"
- "Our manual processes don't scale past 50 reps"
- "I need to prove ROI on every technology investment"

**Daily Concerns**:
- "Another urgent reporting request from leadership"
- "Why is our data quality still so inconsistent?"
- "How do I get the sales team to actually use our tools?"
- "Am I choosing the right vendors for long-term success?"

**Future Planning**:
- "What skills do I need for the next career level?"
- "How do we prepare for 2x growth next year?"
- "Which automation investments will have biggest impact?"

## What They FEEL 😊😰
**Positive Emotions**:
- Excited about technology that actually works
- Confident when presenting clean, accurate data
- Accomplished when processes run smoothly
- Proud of team performance improvements

**Negative Emotions**:
- Frustrated with manual, repetitive tasks
- Anxious about project implementation risks
- Overwhelmed by vendor evaluation complexity
- Stressed by competing leadership priorities

**Emotional Triggers**:
- Fear of sales team rejection/resistance
- Imposter syndrome in technical discussions
- Pressure to deliver immediate results
- Excitement about innovative solutions

## What They SEE 👀
**In Their Industry**:
- Competitors automating faster than them
- Sales technology advancing rapidly
- Industry benchmarks they're missing
- Best practices from peer companies

**In Their Organization**:
- Sales reps struggling with manual tasks
- Leadership demanding better forecasting
- Marketing generating more leads than sales can handle
- Customer success team with better tools/processes

**In Their Daily Work**:
- Inconsistent CRM data entry
- Time wasted on preventable errors
- Successful pilots not scaling to full team
- Promising vendors with poor implementation

## What They SAY & DO 🗣️💼
**What They Say**:
- "We need a solution that actually gets adopted"
- "Show me the ROI calculation and timeline"
- "How does this integrate with our existing stack?"
- "What's your implementation and training approach?"

**What They Do**:
- Research vendors during evening hours
- Build business cases with detailed projections
- Schedule demos for multiple stakeholders
- Conduct reference calls with similar companies
- Create pilot programs before full rollout
- Document everything for audit trails

**Communication Patterns**:
- Speaks in business metrics and KPIs
- Asks tactical questions about implementation
- Seeks validation from peers and references
- Presents options with recommendation to leadership

## PAINS 😣
**Operational Pains**:
- 40+ hours/week on manual reporting and analysis
- Constant data quality issues requiring cleanup
- Integration failures between sales tools
- Lack of real-time visibility into sales activities

**Strategic Pains**:
- Difficulty proving operations impact on revenue
- Slow vendor evaluation and procurement process
- Change management resistance from sales team
- Limited budget for process improvement initiatives

**Personal Pains**:
- Working nights/weekends to keep up with requests
- Feeling like order-taker rather than strategic partner
- Imposter syndrome when discussing technical solutions
- Career progression uncertainty in growing company

## GAINS 🎯
**Operational Gains**:
- Automated reporting saving 15+ hours/week
- Real-time dashboards for proactive management
- Seamless data flow between all sales tools
- Self-service analytics for sales managers

**Strategic Gains**:
- Recognition as revenue-driving business partner
- Increased influence in go-to-market decisions
- Successful track record of technology implementations
- Predictable, scalable sales operations framework

**Personal Gains**:
- Career advancement to VP/CRO level
- Industry recognition and speaking opportunities
- Work-life balance through process automation
- Confidence in technical vendor discussions

## Key Insights for Engagement
**Engagement Strategy**:
- Lead with business impact metrics, not features
- Provide reference customers in similar growth stage  
- Offer pilot program to reduce implementation risk
- Include change management support in proposal
- Demonstrate seamless integration capabilities
- Present clear ROI timeline with milestone tracking`,
        format: "markdown"
      },
      map_completion_date: new Date().toISOString(),
      research_methodology: "web_research_and_industry_analysis"
    },

    product_potential_assessment: {
      title: "Product Market Fit Assessment",
      confidence_score: 9.3,
      content: {
        text: `# Product Market Fit Assessment: AI Sales Assistant

## Market Opportunity Analysis

### Total Addressable Market (TAM)
**Global Sales Technology Market**: $45.2B (2024)
- CRM Software: $63.9B by 2028
- Sales Analytics: $4.9B by 2027  
- Sales Automation: $7.8B by 2026
- AI in Sales: $18.6B by 2028

### Serviceable Addressable Market (SAM)
**Mid-Market B2B Sales Automation**: $12.3B
- Companies with 100-500 employees: 200K+ globally
- Average sales technology spend: $60K annually
- AI/Automation subset: ~30% of market

### Serviceable Obtainable Market (SOM)
**Realistic 5-Year Capture**: $485M
- 0.8% market share achievable
- 3,200 customers at $150K lifetime value
- Growth rate: 40% annually for first 3 years

## Competitive Landscape Analysis

### Direct Competitors
**Tier 1 - Established Players**:
- Salesforce Einstein ($150-500/user/month)
- HubSpot Sales Hub ($450-1200/month)
- Outreach.io ($100-200/user/month)

**Tier 2 - Emerging Solutions**:
- Gong.io ($8K-25K annually)
- Chorus.ai (acquired by ZoomInfo)
- People.ai ($100-150/user/month)

### Competitive Advantages
**Technical Differentiation**:
- Real-time AI lead scoring vs batch processing
- Native CRM integration vs complex APIs
- Multi-modal data analysis (email, calls, social)
- Explainable AI for sales team confidence

**Go-to-Market Advantages**:
- Faster implementation (2 weeks vs 3 months)
- Higher user adoption (85% vs 60% industry average)
- Better mid-market pricing and support
- Vertical specialization opportunities

### Market Gaps & Opportunities
**Underserved Segments**:
- Companies growing from 50-200 employees
- Non-tech industries adopting sales automation
- International markets (EMEA, APAC expansion)
- Specific verticals (healthcare, financial services)

## Product-Market Fit Indicators

### Current State Assessment (8.5/10)
**Strong Indicators**:
- 40% of prospects convert to pilots
- 78% pilot-to-paid conversion rate
- $150K average annual contract value
- 15% month-over-month growth in trials

**Areas for Improvement**:
- Geographic expansion beyond North America
- Enterprise segment penetration
- Integration ecosystem expansion
- Customer success program maturation

### Customer Validation Metrics
**Product Engagement**:
- Daily active usage: 73% of licenses
- Feature adoption: 85% use core features within 30 days
- Support ticket volume: 2.3 per customer/month
- Customer satisfaction: 4.2/5 average rating

**Business Impact**:
- Average 23% improvement in lead conversion
- 31% reduction in time-to-qualification  
- $430K average annual revenue impact per customer
- 89% would recommend to peer company

## Growth Potential & Scenarios

### Conservative Scenario (3x Growth)
**Year 1-2 Projections**:
- 150 new customers annually
- $22.5M ARR by end of Year 2
- 45% gross margin maintained
- $8M in funding required

### Realistic Scenario (7x Growth)  
**Year 1-3 Projections**:
- 380 new customers annually by Year 3
- $57M ARR by end of Year 3
- 52% gross margin improvement
- $15M Series A funding round

### Aggressive Scenario (12x Growth)
**Year 1-5 Projections**:
- 800 new customers annually by Year 5
- $120M ARR by end of Year 5
- International expansion (30% revenue)
- IPO readiness assessment

## Market Timing & Trends

### Favorable Market Conditions
**Technology Adoption**:
- 73% of companies increasing sales tech spend
- AI acceptance in sales grew 340% in 2023
- Remote selling driving automation demand
- Integration-first purchasing decisions

**Economic Factors**:
- Sales efficiency mandate due to economic uncertainty
- Venture funding available for proven SaaS models
- Talent shortage driving automation adoption
- Customer acquisition costs rising across industries

### Risk Factors & Mitigation
**Market Risks**:
- Economic downturn reducing technology spend
- Large players (Salesforce, Microsoft) entering space
- Customer churn due to economic pressures
- Commoditization of AI sales features

**Mitigation Strategies**:
- Focus on ROI-positive customers
- Build defensible data moats
- Develop platform ecosystem strategy
- Invest in customer success and retention

## Strategic Recommendations

### Product Development Priorities
1. **Enterprise Features**: Advanced security, audit trails, SAML SSO
2. **Integration Expansion**: 50+ native integrations vs current 12
3. **Vertical Solutions**: Industry-specific AI models and workflows
4. **International**: Multi-language support and local compliance

### Go-to-Market Strategy
1. **Channel Partnerships**: CRM implementation partners, consultants
2. **Content Marketing**: Thought leadership in sales AI space
3. **Customer Advocacy**: Reference program and case study development
4. **Geographic Expansion**: EU and APAC market entry strategy

### Funding & Investment
**Recommended Approach**:
- Series A: $15M for growth acceleration
- Focus on unit economics and retention
- International expansion as growth driver
- Strategic partnerships for market validation

**Key Metrics to Track**:
- Monthly Recurring Revenue growth rate
- Customer Acquisition Cost payback period
- Net Revenue Retention rate
- Product-qualified lead conversion rates`,
        format: "markdown"
      },
      assessment_date: new Date().toISOString(),
      market_research_sources: [
        "gartner.com - Sales Technology Market Sizing",
        "forrester.com - B2B Sales Automation Trends",
        "crunchbase.com - Sales AI Funding Analysis",
        "salesforce.com - State of Sales Report 2024"
      ]
    }
  },

  // Quality control metrics from validation module
  quality_metrics: {
    overall_confidence: 8.95,
    icp_confidence: 9.1,
    persona_confidence: 8.9,
    empathy_confidence: 8.7,
    assessment_confidence: 9.3,
    content_completeness: 0.92,
    research_depth: 0.88,
    business_relevance: 0.94
  },

  // Validation results from quality control
  validation_results: {
    content_quality_check: "passed",
    business_logic_validation: "passed", 
    factual_accuracy_check: "passed",
    completeness_score: 92,
    recommendation: "approved_for_delivery",
    notes: "High-quality analysis with strong web research integration. All four resources meet publication standards."
  }
};

async function testWebhookPayload() {
  try {
    console.log('🧪 Testing simplified webhook payload structure...\n');
    
    const response = await axios.post('http://localhost:3001/api/webhook/core-resources', testPayload, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Webhook Response:', response.data);
    
    // Test retrieval
    console.log('\n🔍 Testing resource retrieval...');
    const getResponse = await axios.get(`http://localhost:3001/api/webhook/core-resources/${testPayload.session_id}`);
    
    console.log('✅ Retrieval successful!');
    console.log('📊 Quality Metrics:', getResponse.data.data.qualityMetrics);
    console.log('🔍 Validation Results:', getResponse.data.data.validationResults);
    console.log('📝 Resources Generated:', Object.keys(getResponse.data.data.resources).filter(key => getResponse.data.data.resources[key] !== null));
    
  } catch (error) {
    console.error('❌ Test failed:', error.response ? error.response.data : error.message);
  }
}

testWebhookPayload();