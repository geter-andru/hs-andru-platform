// Debug script to test resource display
// Run this in browser console to simulate completed resources

console.log('🔍 Debugging resource generation...');

// Check current localStorage
console.log('Current localStorage:', Object.keys(localStorage));
console.log('Pending generation:', localStorage.getItem('pendingSalesSageGeneration'));

// Get current generation ID
const currentGenId = localStorage.getItem('current_generation_id');
console.log('Current generation ID:', currentGenId);

// Simulate completed resources
const mockResources = {
  icp_analysis: {
    title: "Ideal Customer Profile Analysis",
    confidence_score: 8.5,
    generation_date: new Date().toISOString(),
    content: "**Company Size Range:** 50-500 employees\n\n**Industry Verticals:** Technology, SaaS, Financial Services\n\n**Annual Revenue Range:** $10M - $100M\n\n**Geographic Markets:** North America, Europe\n\n**Technology Stack:** Cloud-based systems, CRM platforms\n\n**Budget Range:** $50K - $200K annually\n\n**Decision Makers:** CTO, VP Engineering, CEO",
    company_size_range: "50-500 employees",
    industry_verticals: "Technology, SaaS, Financial Services", 
    annual_revenue_range: "$10M - $100M",
    geographic_markets: "North America, Europe",
    technology_stack: "Cloud-based systems, CRM platforms",
    budget_range: "$50K - $200K annually",
    decision_makers: "CTO, VP Engineering, CEO",
    growth_stage: "Growth",
    generated: true
  },
  buyer_personas: {
    title: "Target Buyer Personas",
    confidence_score: 9.0,
    generation_date: new Date().toISOString(),
    content: "**VP of Revenue Operations**\n\n**Job Title:** Revenue Operations Leader\n\n**Pain Points:** Disconnected data, manual processes, poor forecasting\n\n**Goals & Objectives:** Automate revenue processes, improve data accuracy, enhance forecasting\n\n**Decision Timeline:** 3-6 months evaluation cycle\n\n**Success Metrics:** Increased forecast accuracy, reduced manual work, improved team productivity",
    persona_name: "VP of Revenue Operations",
    job_title: "Revenue Operations Leader", 
    pain_points: "Disconnected data, manual processes, poor forecasting",
    goals_and_objectives: "Automate revenue processes, improve data accuracy, enhance forecasting",
    decision_timeline: "3-6 months evaluation cycle",
    success_metrics: "Increased forecast accuracy, reduced manual work, improved team productivity",
    generated: true
  },
  empathy_map: {
    title: "Customer Empathy Map", 
    confidence_score: 8.8,
    generation_date: new Date().toISOString(),
    content: "**What They Think:** Need better data visibility and control\n\n**What They Feel:** Frustrated with current tools and processes\n\n**What They See:** Disconnected systems and manual workflows\n\n**What They Do:** Spend hours on manual data entry and reporting\n\n**What They Hear:** Complaints about data accuracy from leadership",
    what_they_think: "Need better data visibility and control",
    what_they_feel: "Frustrated with current tools and processes", 
    what_they_see: "Disconnected systems and manual workflows",
    what_they_do: "Spend hours on manual data entry and reporting",
    what_they_hear: "Complaints about data accuracy from leadership",
    pains_and_frustrations: "Time wasted on manual tasks, data inconsistencies",
    gains_and_benefits: "Automated processes, accurate forecasting, time savings",
    generated: true
  },
  product_assessment: {
    title: "Product Market Fit Assessment",
    confidence_score: 9.2, 
    generation_date: new Date().toISOString(),
    content: "**Current Product Potential Score:** 8.5/10\n\n**Problems You Solve Today:** Manual data entry, disconnected systems, poor forecasting accuracy\n\n**Gaps Preventing 10/10:** Need stronger integration ecosystem, more automated workflows\n\n**Market Opportunity:** Large and growing market demand for revenue operations automation",
    current_product_potential_score: 8.5,
    gaps_preventing_10: "Need stronger integration ecosystem, more automated workflows",
    market_opportunity: "Large and growing market demand for revenue operations automation", 
    problems_solved_today: "Manual data entry, disconnected systems, poor forecasting accuracy",
    customer_conversion: "Focus on ROI demonstrations and pilot programs",
    value_indicators: "Reduced manual work, improved accuracy, faster reporting",
    generated: true
  }
};

// Store the resources
if (currentGenId) {
  localStorage.setItem(`resources_${currentGenId}`, JSON.stringify(mockResources));
  console.log('✅ Stored mock resources for session:', currentGenId);
} else {
  const newId = 'debug-' + Date.now();
  localStorage.setItem('current_generation_id', newId);
  localStorage.setItem(`resources_${newId}`, JSON.stringify(mockResources));
  console.log('✅ Created new session and stored mock resources:', newId);
}

console.log('🔄 Now refresh the page to see the resources!');
