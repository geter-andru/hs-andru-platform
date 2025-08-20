const axios = require('axios');

// Test the webhook with the actual Make.com JavaScript execution result
const testMakecomPayload = async () => {
  console.log('🧪 Testing Make.com JavaScript execution result payload...');
  
  const actualPayload = `(() => {
  try {
    // Parse all Claude outputs
    const icpData = JSON.parse(\`{
  "generation_date": "2025-01-27",
  "company_size_range": "Mid-market to large enterprises (500-10,000+ employees)",
  "industry_verticals": "Manufacturing, Energy & Utilities, Transportation & Logistics, Technology, Financial Services, Retail & Consumer Goods, Healthcare, Real Estate & Construction",
  "annual_revenue_range": "$100M - $10B+",
  "employee_count": 1500,
  "geographic_markets": "North America, Europe, Asia-Pacific (primarily US, Canada, UK, Germany, Australia, Japan)",
  "organizational_structure": "Publicly traded companies or large private companies with dedicated sustainability teams, ESG departments, and C-suite sustainability leadership",
  "growth_stage": "Mature",
  "technology_stack": "Cloud-based infrastructure, existing ERP systems (SAP, Oracle, Microsoft Dynamics), supply chain management platforms, data analytics tools, API-ready systems",
  "budget_range": "$50,000 - $500,000 annually for emissions tracking solutions",
  "integration_needs": "Deep integration with ERP systems, supply chain management platforms, energy management systems, financial reporting tools, and third-party data providers",
  "compliance_requirements": "SEC climate disclosure rules, EU CSRD, TCFD reporting, CDP disclosure, SBTi commitments, ISO 14001 environmental management standards",
  "decision_makers": "Chief Sustainability Officers, VP of ESG, Environmental Directors, Chief Financial Officers, Chief Technology Officers, Procurement Directors",
  "buying_process": "6-18 month evaluation cycle involving sustainability team, IT department, procurement, legal, and C-suite approval with RFP processes and pilot programs",
  "contract_preferences": "Multi-year SaaS agreements (2-3 years) with scalable pricing models, professional services for implementation, and ongoing support packages",
  "implementation_readiness": "Established data governance frameworks, dedicated IT resources, existing sustainability reporting processes, and executive sponsorship for digital transformation",
  "support_requirements": "24/7 technical support, dedicated customer success management, training programs, regulatory update services, and integration consulting",
  "success_indicators": "Automated data collection reducing manual effort by 70%+, improved data accuracy and audit readiness, faster regulatory reporting cycles, enhanced supply chain visibility, and measurable emissions reduction tracking",
  "market_research": "The global carbon accounting software market is experiencing rapid growth, valued at approximately $12.3 billion in 2023 and projected to reach $34.5 billion by 2030 with a CAGR of 15.8%. Key market drivers include increasing regulatory pressure from SEC climate disclosure rules, EU Corporate Sustainability Reporting Directive (CSRD), and growing investor ESG demands. Major competitors include Persefoni, Watershed, Sweep, Plan A, and Salesforce Net Zero Cloud, with pricing typically ranging from $50K-$500K annually. Target customers are predominantly large enterprises in carbon-intensive industries facing Scope 3 emissions tracking challenges, which represent 70-90% of most companies' carbon footprints. The market shows strong demand from publicly traded companies preparing for mandatory climate disclosures, with 89% of Fortune 500 companies now having sustainability commitments. Key pain points include manual data collection inefficiencies, lack of supply chain visibility, complex regulatory compliance requirements, and difficulty in tracking Scope 3 emissions across global operations. Buying patterns indicate preference for comprehensive platforms over point solutions, with implementation timelines averaging 6-12 months for enterprise deployments.",
  "data_sources_appendix": "Market research synthesized from industry reports on carbon accounting software market trends, competitor analysis of emissions tracking platforms, regulatory compliance requirements research, and enterprise sustainability technology adoption patterns from 2023-2024 market studies",
  "confidence_score": 8,
  "confidence_score_reasoning": "High confidence based on clear market trends and regulatory drivers, though specific customer data for Emit Earth may vary from broader market patterns."
}
\`);
    const personaData = JSON.parse(\`{
  "generation_date": "2025-01-27",
  "persona_name": "Sarah Chen - Chief Sustainability Officer",
  "age_range": "38-45",
  "annual_income": 185000,
  "education_level": "Master's degree in Environmental Science, Engineering, or MBA with sustainability focus",
  "geographic_location": "Major metropolitan areas in North America and Europe (NYC, San Francisco, London, Toronto)",
  "job_title": "Chief Sustainability Officer",
  "industry": "Manufacturing, Energy & Utilities, Technology, Financial Services",
  "company_size": "Enterprise",
  "technology_comfort_level": "High",
  "budget_authority": "Full",
  "pain_points": "Struggling with manual data collection across multiple systems and geographies, difficulty tracking Scope 3 emissions from complex supply chains, pressure to meet aggressive net-zero commitments, lack of real-time visibility into emissions data, audit readiness concerns, and managing regulatory compliance across multiple jurisdictions including SEC climate disclosure rules and EU CSRD requirements",
  "goals_and_objectives": "Achieve company net-zero commitments by 2030-2050, automate emissions data collection to reduce manual effort by 70%+, improve data accuracy and audit readiness for regulatory reporting, enhance supply chain emissions visibility, demonstrate measurable progress to investors and stakeholders, and establish the company as an ESG leader in their industry",
  "buying_behavior": "Conducts thorough 6-18 month evaluation processes involving multiple stakeholders, requires pilot programs and proof-of-concept demonstrations, heavily researches vendor capabilities and references, prefers comprehensive platforms over point solutions, and seeks long-term strategic partnerships rather than transactional relationships",
  "influences_and_decision_factors": "Regulatory compliance requirements, integration capabilities with existing ERP and supply chain systems, data accuracy and audit trail capabilities, vendor track record and customer references, total cost of ownership, implementation timeline, ongoing support quality, and ability to scale across global operations",
  "day_in_life_summary": "Starts day reviewing sustainability KPI dashboards, attends cross-functional meetings with operations and procurement teams, analyzes emissions data trends, coordinates with external auditors and consultants, presents progress updates to C-suite and board members, manages sustainability team priorities, and stays current on evolving regulations and industry best practices",
  "preferred_communication_channels": ["Email", "Video Calls", "In-Person", "Phone"],
  "decision_timeline": "12-18 months from initial research to contract signature, including 3-6 months for vendor evaluation, 2-4 months for pilot programs, and 3-6 months for stakeholder alignment and procurement processes",
  "objections_and_concerns": "Integration complexity with legacy systems, data security and privacy concerns, implementation timeline disrupting current reporting cycles, total cost of ownership including professional services, vendor stability and long-term viability, and ability to handle complex global supply chain data",
  "success_metrics": "Automated data collection reducing manual effort by 70%+, improved data accuracy from 60% to 95%+, faster regulatory reporting cycles from months to weeks, enhanced supply chain emissions visibility covering 80%+ of Scope 3 emissions, successful audit completion, and measurable emissions reduction tracking supporting net-zero commitments",
  "market_research": "Current research indicates CSOs in large enterprises earn $150K-$250K annually with 10-15 years experience in sustainability, environmental consulting, or operations roles. 78% hold advanced degrees and 65% have technical backgrounds. Key buying influences include regulatory pressure (89% cite as top driver), investor demands (76%), and operational efficiency needs (68%). Decision processes average 14 months with 6-8 stakeholders involved. Primary pain points include manual data collection (cited by 84% of CSOs), Scope 3 tracking challenges (79%), and audit readiness concerns (71%). Communication preferences favor detailed email follow-ups (92%), video demonstrations (87%), and in-person relationship building (73%). Budget authority varies but 68% have full authority for sustainability technology purchases under $300K.",
  "data_sources_appendix": "Salary data from Glassdoor, PayScale, and Robert Half 2024 sustainability salary guides; buying behavior research from Forrester B2B buying journey studies; pain points analysis from Deloitte and PwC sustainability surveys; communication preferences from LinkedIn Sales Navigator insights; regulatory compliance data from SEC and EU CSRD implementation studies; market sizing from Grand View Research carbon accounting software market reports",
  "confidence_score": 9,
  "confidence_score_reasoning": "Very high confidence based on extensive market research data, regulatory trends, and established patterns in enterprise sustainability technology adoption. Minor uncertainty around specific salary ranges which can vary by geography and company size."
}
\`);
    const empathyData = JSON.parse(\`{
  "generation_date": "2025-01-27",
  "what_they_think": "I need to transform our sustainability reporting from a manual, error-prone process into an automated, audit-ready system. The regulatory landscape is moving fast with SEC climate disclosure rules and EU CSRD requirements - we can't afford to be caught unprepared. Our current approach of spreadsheets and manual data collection is unsustainable and puts our company at risk. I need a solution that integrates seamlessly with our existing ERP systems and provides real-time visibility into our Scope 1, 2, and 3 emissions. The board and investors are asking tough questions about our net-zero commitments, and I need data-driven answers.",
  "what_they_feel": "Overwhelmed by the complexity of tracking emissions across global operations and supply chains. Anxious about meeting regulatory deadlines and audit requirements. Frustrated with the time-consuming manual processes that pull my team away from strategic initiatives. Excited about the potential of AI and automation to solve these challenges. Pressured to deliver measurable results quickly while ensuring data accuracy. Cautiously optimistic about new technologies but concerned about implementation risks and vendor reliability.",
  "what_they_see": "Competitors announcing ambitious net-zero commitments with sophisticated tracking systems. Regulatory bodies issuing new requirements with tight deadlines. Board presentations showing inconsistent or incomplete emissions data. Team members spending 60-70% of their time on manual data collection instead of strategic analysis. Audit firms requesting more detailed documentation and data trails. Industry conferences showcasing advanced emissions tracking technologies. Investor reports highlighting ESG performance gaps.",
  "what_they_say": "We need to automate our emissions tracking to meet regulatory requirements and investor expectations. Our current manual processes are too slow and error-prone for the scale we're operating at. I'm looking for a comprehensive platform that can integrate with our existing systems and provide audit-ready data. We need real-time visibility into our supply chain emissions to make informed decisions. The ROI needs to be clear - both in terms of efficiency gains and risk mitigation. Implementation timeline is critical - we can't disrupt our current reporting cycles.",
  "what_they_do": "Researches emissions tracking platforms and attends vendor demonstrations. Conducts stakeholder meetings with IT, procurement, and operations teams. Reviews regulatory requirements and compliance deadlines. Analyzes current data collection processes and identifies inefficiencies. Builds business cases for sustainability technology investments. Networks with peers at industry conferences to understand best practices. Coordinates with external auditors and consultants on data requirements. Presents progress updates to executive leadership and board members.",
  "what_they_hear": "CFOs asking about the cost-benefit analysis of sustainability investments. IT teams expressing concerns about system integration complexity. Procurement teams pushing for competitive bidding processes. Audit firms emphasizing the need for better data governance and documentation. Industry peers sharing success stories about automation and efficiency gains. Regulatory experts warning about upcoming compliance deadlines. Investors asking detailed questions about Scope 3 emissions and supply chain visibility. Executive leadership demanding faster progress on net-zero commitments.",
  "pains_and_frustrations": "Manual data collection consuming 70% of team resources with high error rates. Lack of real-time visibility into emissions data across global operations. Difficulty tracking Scope 3 emissions from complex, multi-tier supply chains. Pressure to meet aggressive regulatory deadlines with inadequate systems. Integration challenges with legacy ERP and supply chain management systems. Audit readiness concerns due to poor data documentation and trails. Budget constraints limiting technology investment options. Long vendor evaluation cycles delaying critical implementations.",
  "gains_and_benefits": "Automated data collection reducing manual effort by 70%+ and improving accuracy from 60% to 95%+. Real-time emissions visibility enabling proactive decision-making and trend analysis. Streamlined regulatory reporting reducing cycle times from months to weeks. Enhanced supply chain transparency covering 80%+ of Scope 3 emissions. Improved audit readiness with comprehensive data trails and documentation. Cost savings from operational efficiency and reduced consultant dependency. Competitive advantage through ESG leadership and investor confidence. Career advancement opportunities through successful digital transformation.",
  "external_influences": "Regulatory pressure from SEC climate disclosure rules, EU CSRD, and other emerging requirements. Investor demands for ESG transparency and net-zero progress reporting. Industry peer benchmarking and competitive positioning concerns. Customer and supply chain partner sustainability requirements. Audit firm recommendations for improved data governance. Industry association best practice guidelines. Media coverage of climate commitments and corporate accountability. Stakeholder activism and public scrutiny of environmental performance.",
  "internal_motivations": "Personal commitment to environmental sustainability and climate action. Professional reputation and career advancement through successful technology implementation. Desire to transform manual processes into strategic, value-added activities. Need to demonstrate ROI and business value from sustainability investments. Drive to establish the company as an ESG leader in their industry. Motivation to build a high-performing, technology-enabled sustainability team. Aspiration to contribute meaningfully to corporate net-zero commitments and global climate goals.",
  "social_environment": "Active in professional sustainability networks and industry associations. Participates in ESG conferences, webinars, and peer learning groups. Engages with climate tech startup ecosystem and innovation communities. Maintains relationships with environmental consultants, auditors, and regulatory experts. Connected with academic researchers and policy makers in climate space. Involved in corporate sustainability councils and working groups. Participates in industry benchmarking studies and best practice sharing initiatives.",
  "professional_environment": "Works in large enterprise organizations with dedicated sustainability teams and ESG departments. Collaborates closely with IT, operations, procurement, and finance functions. Reports to C-suite executives and presents to board committees. Manages cross-functional projects involving multiple business units and geographies. Interfaces with external auditors, consultants, and regulatory bodies. Leads vendor evaluation processes with procurement and legal teams. Coordinates with investor relations on ESG communications and reporting.",
  "personal_goals": "Build expertise in emerging sustainability technologies and data analytics. Establish thought leadership in corporate climate action and emissions tracking. Develop strong professional network in climate tech and ESG space. Achieve work-life balance while managing demanding regulatory deadlines. Maintain credibility and trust with executive leadership and board members. Contribute to meaningful climate action through corporate sustainability leadership. Advance career to senior executive roles in sustainability or operations.",
  "professional_goals": "Successfully implement automated emissions tracking system reducing manual effort by 70%+. Achieve audit-ready compliance with all regulatory requirements including SEC and EU CSRD. Establish company as ESG leader with top-quartile performance in industry benchmarks. Build high-performing sustainability team with advanced technical capabilities. Demonstrate clear ROI from sustainability technology investments. Support company achievement of net-zero commitments through data-driven insights. Transform sustainability function from compliance-focused to strategic business enabler.",
  "hopes_and_dreams": "Lead their organization to become a recognized leader in corporate climate action and ESG performance. Successfully implement cutting-edge technology that transforms how the company manages environmental impact. Build a legacy of meaningful contribution to global climate goals through corporate sustainability leadership. Advance to C-suite executive role with expanded responsibility for ESG and sustainability strategy. Mentor next generation of sustainability professionals and share knowledge with industry peers. See their company achieve net-zero commitments ahead of schedule through data-driven decision making.",
  "fears_and_anxieties": "Failing to meet regulatory compliance deadlines resulting in fines, penalties, or reputational damage. Implementing technology solution that doesn't deliver promised ROI or efficiency gains. Integration failures that disrupt current reporting processes and create operational chaos. Vendor selection mistakes leading to poor performance, cost overruns, or contract disputes. Losing credibility with executive leadership due to project delays or budget overruns. Being unprepared for audit requirements resulting in qualified opinions or compliance failures. Career stagnation if unable to demonstrate measurable success in sustainability technology implementation.",
  "raw_json_data": "Based on comprehensive analysis of enterprise sustainability decision-makers, particularly Chief Sustainability Officers in large organizations implementing emissions tracking technology. Research indicates high stress levels due to regulatory pressure, with 89% citing compliance as top concern. Decision-makers average 12-18 month evaluation cycles with 6-8 stakeholders involved. Key emotional drivers include professional reputation (78% cite as important), environmental impact (71%), and career advancement (65%). Pain points center on manual processes (84% report as major issue), data accuracy concerns (79%), and integration complexity (73%). Success metrics focus on automation efficiency, regulatory compliance, and audit readiness. Social environment heavily influenced by peer networks and industry associations, with 92% participating in professional sustainability groups.",
  "data_sources_appendix": "Deloitte Global Chief Sustainability Officer Survey 2024, PwC ESG Technology Implementation Study 2024, Forrester B2B Buying Journey Research for Climate Tech 2024, McKinsey Sustainability Technology Adoption Report 2024, CDP Corporate Climate Action Survey 2024, Salesforce State of the Connected Customer Report 2024, Gartner Enterprise Software Buying Behavior Analysis 2024, Harvard Business Review ESG Leadership Studies 2024, LinkedIn Professional Network Analysis for Sustainability Executives 2024",
  "confidence_score": 9,
  "confidence_score_reasoning": "Very high confidence based on extensive market research, regulatory analysis, and established behavioral patterns of enterprise sustainability executives. Minor uncertainty around specific emotional responses which can vary by individual personality and organizational culture."
}
\`);
    const assessmentData = JSON.parse(\`{
  "generation_date": "2025-01-27",
  "what_problems_can_my_product_solve_today": "Emit Earth's AI-powered emissions tracking system solves critical immediate problems for large enterprises: eliminating 70%+ of manual data collection effort across ERP and supply chain systems, providing real-time visibility into Scope 1, 2, and 3 emissions, ensuring audit-ready compliance with SEC climate disclosure rules and EU CSRD requirements, reducing data accuracy errors from 40% to under 5%, streamlining regulatory reporting cycles from months to weeks, and enabling automated trend analysis for informed sustainability decision-making. The platform addresses the urgent need for integrated emissions tracking across complex global operations while maintaining data governance standards required by auditors and regulators.",
  "what_problems_could_my_product_potentially_solve": "Future capabilities could expand to predictive emissions modeling using AI to forecast impact of business decisions, automated carbon offset procurement and verification, real-time supply chain emissions alerts and recommendations, integration with IoT sensors for direct emissions monitoring, blockchain-based emissions data verification for enhanced trust, automated ESG reporting across multiple frameworks (TCFD, GRI, SASB), AI-powered sustainability recommendations for operational optimization, carbon pricing scenario modeling, automated Scope 3 supplier engagement and data collection, and comprehensive emissions benchmarking against industry peers and competitors.",
  "why_solving_them_matters": "These problems are critical because regulatory compliance failures can result in significant financial penalties, reputational damage, and investor confidence loss. With 89% of Fortune 500 companies having net-zero commitments and mandatory climate disclosures beginning in 2024, accurate emissions tracking is no longer optional but essential for business continuity. Manual tracking processes consume 60-70% of sustainability teams' time, preventing strategic focus on actual emissions reduction. Poor data quality undermines credibility with investors, auditors, and stakeholders, while lack of supply chain visibility leaves companies exposed to Scope 3 emissions representing 70-90% of their total carbon footprint. Solving these challenges enables companies to transform from reactive compliance to proactive climate leadership, driving competitive advantage and long-term business value.",
  "where_is_the_problem_most_prominent_and_why": "The problem is most acute in manufacturing, energy & utilities, and transportation & logistics industries due to complex global supply chains, high carbon intensity, and extensive regulatory scrutiny. Large enterprises with $1B+ revenue face the greatest pressure due to SEC climate disclosure requirements, investor ESG demands, and public visibility. Geographic concentration is highest in North America and Europe where regulatory frameworks are most advanced, with particular intensity in the US (SEC rules), UK (TCFD mandatory reporting), and EU (CSRD requirements). Companies with 1,000+ employees and global operations experience the most complexity due to multiple reporting jurisdictions, diverse data sources, and extensive supply chain networks requiring Scope 3 emissions tracking across hundreds or thousands of suppliers.",
  "where_should_i_engage_target_buyers": "Primary engagement should focus on industry conferences like Sustainable Brands, Climate Week NYC, and COP events where Chief Sustainability Officers and ESG leaders gather. Digital channels include LinkedIn targeting CSOs, VP ESG, and Environmental Directors at Fortune 1000 companies, sustainability-focused webinars and thought leadership content, and partnerships with Big 4 consulting firms (Deloitte, PwC, EY, KPMG) who advise on ESG implementation. Direct outreach through account-based marketing to publicly traded companies preparing for mandatory climate disclosures, participation in industry associations like BSR and WBCSD, and strategic partnerships with ERP vendors (SAP, Oracle, Microsoft) for integrated go-to-market approaches. Trade publications like GreenBiz, Environmental Leader, and ESG Today provide thought leadership platforms to establish credibility.",
  "how_do_i_turn_them_into_customers": "Convert prospects through comprehensive pilot programs demonstrating 70%+ efficiency gains and improved data accuracy, detailed ROI analysis showing cost savings from reduced manual effort and consultant dependency, integration assessments proving seamless connectivity with existing ERP and supply chain systems, and audit-ready compliance demonstrations meeting SEC and EU CSRD requirements. Provide extensive customer references from similar industry verticals and company sizes, offer phased implementation approaches reducing risk and disruption, ensure dedicated customer success management throughout 6-18 month buying cycles, and create compelling business cases highlighting regulatory risk mitigation, operational efficiency, and competitive ESG positioning. Success requires building trust through technical expertise, regulatory knowledge, and proven implementation track record.",
  "what_actions_will_they_show_that_theyre_receiving_real_value": "Customers receiving real value will demonstrate measurable outcomes including 70%+ reduction in manual data collection time, improvement in data accuracy from 60% to 95%+, successful completion of external audits with clean opinions, faster regulatory reporting cycles from 3-6 months to 2-4 weeks, enhanced supply chain emissions visibility covering 80%+ of Scope 3 emissions, and successful compliance with SEC climate disclosure rules and EU CSRD requirements. Additional indicators include expansion of platform usage across business units, renewal of multi-year contracts with increased scope, positive references and case studies shared publicly, achievement of sustainability certifications and awards, improved ESG ratings from agencies like MSCI and Sustainalytics, and measurable progress toward net-zero commitments supported by data-driven insights.",
  "how_to_keep_them_coming_back": "Retention requires continuous platform enhancement with new regulatory frameworks and reporting standards, proactive customer success management with quarterly business reviews and optimization recommendations, regular training programs for evolving team needs, 24/7 technical support ensuring system reliability during critical reporting periods, and thought leadership through regulatory updates and industry best practices. Provide advanced analytics and benchmarking capabilities, expand integration partnerships with new ERP and supply chain platforms, offer additional modules for carbon accounting and offset management, maintain competitive pricing with clear ROI demonstration, and build long-term strategic partnerships through executive relationship management. Success metrics should include 90%+ customer retention rates, net revenue retention above 110%, and high Net Promoter Scores indicating strong customer advocacy.",
  "current_product_potential_score": 8,
  "gaps_preventing_a_10_10_score": "Key gaps include limited brand recognition compared to established competitors like Persefoni and Watershed, need for more extensive customer references and case studies in target verticals, requirement for deeper integration partnerships with major ERP vendors, potential scalability challenges for very large enterprise deployments, need for enhanced predictive analytics and AI capabilities beyond current offerings, limited geographic presence in Asia-Pacific markets, requirement for industry-specific emissions factors and benchmarking data, need for more comprehensive Scope 3 supplier engagement tools, potential gaps in emerging regulatory frameworks beyond SEC and EU requirements, and need for stronger channel partnerships with consulting firms and system integrators.",
  "data_backed_improvement_strategy": "Focus on building 10+ marquee customer references across target verticals within 12 months, establish strategic partnerships with SAP, Oracle, and Microsoft for integrated go-to-market approaches, invest in predictive analytics and AI capabilities to differentiate from competitors, expand geographic presence in Asia-Pacific through local partnerships, develop industry-specific solutions for manufacturing, energy, and logistics sectors, build comprehensive supplier engagement platform for Scope 3 tracking, establish thought leadership through regulatory expertise and market education, implement account-based marketing targeting Fortune 1000 companies, achieve SOC 2 Type II and ISO 27001 certifications for enterprise security requirements, and develop channel partner program with Big 4 consulting firms to accelerate market penetration and credibility.",
  "conclusion": "By focusing on these areas, Intelligent Emissions Tracking Systems by Emit Earth Inc can strengthen its market position and achieve a higher product-market fit score within 18-24 months.",
  "raw_json_data": "Analysis based on carbon accounting software market valued at $12.3B in 2023 growing to $34.5B by 2030 at 15.8% CAGR. Key market drivers include SEC climate disclosure rules affecting 2,800+ public companies, EU CSRD impacting 50,000+ companies, and 89% of Fortune 500 having net-zero commitments. Competitive landscape includes Persefoni ($101M Series B), Watershed ($70M Series B), Sweep ($22M Series A), with typical enterprise pricing $50K-$500K annually. Customer acquisition costs average $25K-$75K with 12-18 month sales cycles. Product-market fit indicators show 85%+ customer satisfaction, 90%+ retention rates, and 110%+ net revenue retention for successful platforms. Primary challenges include manual data collection (84% of enterprises), Scope 3 tracking complexity (79%), and audit readiness (71%). Success metrics include 70%+ efficiency gains, 95%+ data accuracy, and weeks vs months reporting cycles. Market opportunity concentrated in manufacturing (28%), energy/utilities (22%), and technology (18%) sectors.",
  "data_sources_appendix": "Grand View Research Carbon Accounting Software Market Report 2024, Forrester B2B Climate Tech Buying Journey 2024, Deloitte Global CSO Survey 2024, PwC ESG Technology Implementation Study 2024, McKinsey Sustainability Technology Report 2024, Crunchbase Climate Tech Funding Database 2024, SEC Climate Disclosure Rules Implementation Guide 2024, EU CSRD Compliance Requirements Analysis 2024, CDP Corporate Climate Action Survey 2024, Sustainalytics ESG Technology Vendor Analysis 2024",
  "confidence_score": 9,
  "confidence_score_reasoning": "Very high confidence based on comprehensive market research, regulatory analysis, and established patterns in enterprise climate tech adoption, with minor uncertainty around specific competitive positioning details."
}
\`);

    // Validation checks
    const validations = {
      icp_valid: icpData && icpData.confidence_score >= 6,
      persona_valid: personaData && personaData.confidence_score >= 6,
      empathy_valid: empathyData && empathyData.confidence_score >= 6,
      assessment_valid: assessmentData && assessmentData.confidence_score >= 6,
      all_json_valid: !!(icpData && personaData && empathyData && assessmentData)
    };

    // Calculate quality metrics
    const confidenceScores = [
      icpData?.confidence_score || 0,
      personaData?.confidence_score || 0,
      empathyData?.confidence_score || 0,
      assessmentData?.confidence_score || 0
    ];

    const averageConfidence = confidenceScores.reduce((a, b) => a + b, 0) / 4;
    const allValid = validations.all_json_valid && averageConfidence >= 6;

    // Return validation results
    return {
      status: allValid ? "ready_for_upload" : "quality_issues",
      average_confidence: Math.round(averageConfidence * 10) / 10,
      individual_scores: confidenceScores,
      validations: validations,
      timestamp: new Date().toISOString(),
      recommendations: averageConfidence < 6 ? "Consider regenerating low-scoring modules" : "Proceed with data upload",
      total_modules_valid: Object.values(validations).filter(Boolean).length
    };

  } catch (error) {
    // Error handling
    return {
      status: "validation_error",
      error: error.message,
      timestamp: new Date().toISOString(),
      recommendations: "Check Claude module outputs for valid JSON format"
    };
  }
})()`;

  try {
    const response = await axios.post('http://localhost:3001/api/webhook/core-resources', actualPayload, {
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': 'test-makecom-js-execution',
        'x-customer-id': 'CUST_5',
        'x-record-id': 'recKU4vMCwMzVvFxD',
        'x-product-name': 'Emit Earth Emissions Tracker',
        'x-business-type': 'B2B'
      }
    });

    console.log('✅ Webhook Response:', JSON.stringify(response.data, null, 2));
    
    // Now test retrieving the resources
    console.log('\n🔍 Testing resource retrieval...');
    const retrievalResponse = await axios.get('http://localhost:3001/api/webhook/core-resources/test-makecom-js-execution');
    
    if (retrievalResponse.data.success) {
      console.log('✅ Retrieval successful!');
      console.log('📊 Quality Metrics:', JSON.stringify(retrievalResponse.data.data.qualityMetrics, null, 2));
      console.log('🔍 Validation Results:', JSON.stringify(retrievalResponse.data.data.validationResults, null, 2));
      console.log('📝 Resources Generated:', Object.keys(retrievalResponse.data.data.resources));
      
      // Test one of the formatted resources
      console.log('\n📖 Sample ICP Analysis (first 500 chars):');
      console.log(retrievalResponse.data.data.resources.icp_analysis.content.text.substring(0, 500) + '...');
    } else {
      console.log('❌ Retrieval failed:', retrievalResponse.data);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testMakecomPayload();