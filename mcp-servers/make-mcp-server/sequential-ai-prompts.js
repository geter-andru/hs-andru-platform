#!/usr/bin/env node

/**
 * Sequential AI Resource Generation Prompts
 * Each prompt builds upon previous outputs for contextually rich resources
 */

class SequentialAIPrompts {
  
  // 1. PDR (Refined Product Description) - First in chain, uses raw product description
  static getPDRPrompt(productDescription) {
    return {
      systemPrompt: "You are an expert product strategist and market analyst. Create a comprehensive, refined product description with precise market positioning and technical details.",
      userPrompt: `
Using this initial product description: "${productDescription}"

Create a comprehensive PDR (Refined Product Description) that expands and refines this into a professional, market-ready analysis.

OUTPUT REQUIREMENTS: Respond with a JSON object containing exactly these fields:

{
  "product_name": "Clear, market-ready product name",
  "target_market": "Detailed target market description with demographics and psychographics",
  "key_benefits": "Top 5-7 key benefits with impact descriptions",
  "competitive_advantages": "Unique differentiators vs. competitors",
  "market_positioning": "Where this product fits in the market landscape",
  "recommended_price_point": 29.99,
  "value_proposition": "Clear, compelling value statement",
  "use_cases": "3-5 specific use cases with scenarios",
  "technical_specifications": "Key technical requirements, integrations, compatibility",
  "implementation_timeline": "Typical deployment/adoption timeline",
  "success_metrics": "How customers will measure success with this product",
  "quality_score": 8.5
}

Ensure all financial values are numbers (not strings), and quality_score is 1-10 based on market viability and clarity.`,
      temperature: 0.7,
      maxTokens: 2000
    };
  }

  // 2. Target Buyer Persona - Uses PDR context
  static getTargetBuyerPersonaPrompt(productDescription, pdrData) {
    return {
      systemPrompt: "You are an expert buyer persona researcher with deep knowledge of B2B and B2C customer psychology and buying behavior.",
      userPrompt: `
ORIGINAL PRODUCT: "${productDescription}"

REFINED PRODUCT ANALYSIS (PDR):
${JSON.stringify(pdrData, null, 2)}

Using the refined product analysis above, create a detailed Target Buyer Persona representing the IDEAL customer for this product.

OUTPUT REQUIREMENTS: Respond with a JSON object containing exactly these fields:

{
  "persona_name": "Give them a realistic name (e.g., 'Sarah Marketing Manager')",
  "age_range": "Age range (e.g., '28-35')",
  "job_title": "Primary job title",
  "industry": "Primary industry they work in",
  "company_size": "Startup" | "Small" | "Medium" | "Large" | "Enterprise",
  "annual_income": 65000,
  "education_level": "Education background",
  "geographic_location": "Primary location/region",
  "pain_points": "3-5 major pain points this product solves for them",
  "goals_and_objectives": "Professional and personal goals",
  "preferred_communication_channels": ["Email", "Phone", "Social Media"],
  "buying_behavior": "How they typically research and purchase products",
  "influences_and_decision_factors": "What influences their buying decisions",
  "day_in_life_summary": "Typical day description showing when/how product fits",
  "technology_comfort_level": "Low" | "Medium" | "High" | "Expert",
  "budget_authority": "None" | "Limited" | "Moderate" | "Full",
  "decision_timeline": "Typical time from awareness to purchase",
  "objections_and_concerns": "Common objections and concerns they raise",
  "success_metrics": "How they define success with the product",
  "quality_score": 8.5
}

Ensure persona feels real and authentic, based on the specific product context.`,
      temperature: 0.8,
      maxTokens: 2500
    };
  }

  // 3. Ideal Customer Profile - Uses PDR + Target Buyer Persona
  static getICPPrompt(productDescription, pdrData, targetBuyerPersona) {
    return {
      systemPrompt: "You are an expert B2B sales strategist specializing in ideal customer profiling and account-based marketing.",
      userPrompt: `
ORIGINAL PRODUCT: "${productDescription}"

REFINED PRODUCT ANALYSIS (PDR):
${JSON.stringify(pdrData, null, 2)}

TARGET BUYER PERSONA:
${JSON.stringify(targetBuyerPersona, null, 2)}

Using the product analysis and buyer persona above, create a comprehensive Ideal Customer Profile (ICP) focusing on the COMPANY characteristics that make the best customers.

OUTPUT REQUIREMENTS: Respond with a JSON object containing exactly these fields:

{
  "company_size_range": "Employee count range (e.g., '50-200 employees')",
  "industry_verticals": "Primary industries and verticals that are ideal fits",
  "annual_revenue_range": "Revenue range (e.g., '$10M-$50M annually')",
  "employee_count": 150,
  "geographic_markets": "Geographic regions/markets to target",
  "technology_stack": "Technology infrastructure and tools they likely use",
  "budget_range": "Typical budget range for this type of solution",
  "decision_makers": "Key decision makers involved in purchase process",
  "organizational_structure": "How the organization is typically structured",
  "growth_stage": "Startup" | "Growth" | "Mature" | "Enterprise",
  "buying_process": "Typical procurement and decision-making process",
  "success_indicators": "Signs that indicate a good fit prospect",
  "implementation_readiness": "Characteristics that show implementation readiness",
  "support_requirements": "Level of support and service they typically need",
  "contract_preferences": "Contract terms, length, and structure preferences",
  "integration_needs": "Technical integrations they commonly require",
  "compliance_requirements": "Industry compliance and regulatory requirements",
  "quality_score": 8.5
}

Focus on company-level characteristics that complement the individual buyer persona.`,
      temperature: 0.7,
      maxTokens: 2500
    };
  }

  // 4. Negative Buyer Persona - Uses all previous context to identify anti-patterns
  static getNegativeBuyerPersonaPrompt(productDescription, pdrData, targetBuyerPersona, icpData) {
    return {
      systemPrompt: "You are an expert at identifying poor-fit customers and preventing bad sales deals through negative persona profiling.",
      userPrompt: `
ORIGINAL PRODUCT: "${productDescription}"

CONTEXT FROM PREVIOUS ANALYSIS:
PDR: ${JSON.stringify(pdrData, null, 2)}
TARGET BUYER: ${JSON.stringify(targetBuyerPersona, null, 2)}
ICP: ${JSON.stringify(icpData, null, 2)}

Based on the ideal customer profiles above, create a Negative Buyer Persona identifying customers to AVOID - those who would be poor fits, high churn risks, or unprofitable.

OUTPUT REQUIREMENTS: Respond with a JSON object containing exactly these fields:

{
  "persona_type": "Type of negative persona (e.g., 'Price-Only Shopper', 'Wrong Industry Fit')",
  "demographic_red_flags": "Demographic characteristics that indicate poor fit",
  "behavioral_indicators": "Behavioral patterns that signal problems",
  "company_characteristics": "Company traits that make them unsuitable",
  "budget_misalignment": "Budget-related issues that indicate poor fit",
  "expectation_mismatches": "Unrealistic expectations that lead to problems",
  "support_burden_indicators": "Signs they'll require excessive support",
  "churn_risk_factors": "Characteristics that predict high churn probability",
  "poor_fit_reasons": "Specific reasons why they're not ideal customers",
  "alternative_solutions_better_suited": "Other solutions that would serve them better",
  "warning_signs": "Early warning signs to watch for during sales process",
  "qualification_questions": "Questions to ask to identify negative personas",
  "disqualification_criteria": "Hard criteria for disqualifying prospects",
  "quality_score": 8.5
}

Focus on protecting sales efficiency and customer success by identifying poor-fit patterns.`,
      temperature: 0.7,
      maxTokens: 2500
    };
  }

  // 5. Value Messaging - Uses all persona and product context
  static getValueMessagingPrompt(productDescription, pdrData, targetBuyerPersona, icpData, negativeBuyerPersona) {
    return {
      systemPrompt: "You are an expert messaging strategist and copywriter specializing in value proposition development and stakeholder-specific messaging.",
      userPrompt: `
ORIGINAL PRODUCT: "${productDescription}"

CONTEXT FROM PREVIOUS ANALYSIS:
PDR: ${JSON.stringify(pdrData, null, 2)}
TARGET BUYER: ${JSON.stringify(targetBuyerPersona, null, 2)}
ICP: ${JSON.stringify(icpData, null, 2)}
NEGATIVE PERSONA: ${JSON.stringify(negativeBuyerPersona, null, 2)}

Using all the customer intelligence above, create comprehensive Value Messaging that speaks to different stakeholder levels and addresses their specific needs and concerns.

OUTPUT REQUIREMENTS: Respond with a JSON object containing exactly these fields:

{
  "primary_value_proposition": "Main value statement - compelling and differentiated",
  "secondary_value_props": "2-3 secondary value propositions for different angles",
  "executive_level_messaging": "C-level messaging focusing on strategic outcomes",
  "manager_level_messaging": "Mid-management messaging on efficiency and results",
  "end_user_messaging": "Day-to-day user messaging on ease and productivity",
  "technical_audience_messaging": "IT/technical audience messaging on implementation",
  "proof_points": "Specific evidence, data, and validation points",
  "competitive_differentiators": "What makes this unique vs. alternatives",
  "roi_statements": "Quantified return on investment messaging",
  "risk_mitigation_messages": "How this reduces risk and ensures success",
  "urgency_creators": "Messages that create urgency to act now",
  "social_proof_elements": "Types of social proof that would be most effective",
  "objection_responses": "Responses to common objections from negative persona insights",
  "call_to_action_variations": "Different CTAs for different contexts",
  "messaging_hierarchy": "Priority order of messages for different sales stages",
  "channel_specific_adaptations": "How messaging adapts across channels",
  "quality_score": 8.5
}

Ensure messaging is specific to the personas and avoids generic corporate speak.`,
      temperature: 0.8,
      maxTokens: 3000
    };
  }

  // 6. Product Potential Assessment - Uses all previous context for market analysis
  static getProductPotentialPrompt(productDescription, pdrData, targetBuyerPersona, icpData, negativeBuyerPersona, valueMessaging) {
    return {
      systemPrompt: "You are an expert market analyst and business strategist with deep experience in market sizing, competitive analysis, and business potential assessment.",
      userPrompt: `
ORIGINAL PRODUCT: "${productDescription}"

COMPLETE CUSTOMER INTELLIGENCE:
PDR: ${JSON.stringify(pdrData, null, 2)}
TARGET BUYER: ${JSON.stringify(targetBuyerPersona, null, 2)}
ICP: ${JSON.stringify(icpData, null, 2)}
NEGATIVE PERSONA: ${JSON.stringify(negativeBuyerPersona, null, 2)}
VALUE MESSAGING: ${JSON.stringify(valueMessaging, null, 2)}

Using all the intelligence above, assess the market potential and business opportunity for this product.

OUTPUT REQUIREMENTS: Respond with a JSON object containing exactly these fields:

{
  "total_addressable_market": 500000000,
  "serviceable_addressable_market": 150000000,
  "serviceable_obtainable_market": 15000000,
  "market_growth_rate": 15.5,
  "competitive_density": "Low" | "Medium" | "High" | "Saturated",
  "barriers_to_entry": "Challenges new competitors would face entering this market",
  "success_probability": 75.5,
  "key_success_factors": "Critical factors that will determine success",
  "major_risks": "Significant risks that could impact success",
  "market_opportunities": "Emerging opportunities and trends to capitalize on",
  "technology_trends_impact": "How technology trends affect this market",
  "regulatory_considerations": "Regulatory factors that could impact the market",
  "resource_requirements": "Resources needed to capture market opportunity",
  "timeline_to_market": "Realistic timeline to achieve market penetration",
  "break_even_analysis": "Analysis of path to profitability",
  "scaling_potential": "How the opportunity scales with growth",
  "exit_strategy_options": "Potential exit strategies and valuations",
  "quality_score": 8.5
}

Base market sizing on the specific ICP characteristics and ensure financial values are realistic numbers.`,
      temperature: 0.6,
      maxTokens: 2500
    };
  }

  // 7. Moment in Life Description - Uses persona and messaging insights
  static getMomentInLifePrompt(productDescription, targetBuyerPersona, icpData, valueMessaging) {
    return {
      systemPrompt: "You are an expert customer journey researcher specializing in trigger moments and emotional decision-making contexts.",
      userPrompt: `
ORIGINAL PRODUCT: "${productDescription}"

KEY CUSTOMER INSIGHTS:
TARGET BUYER: ${JSON.stringify(targetBuyerPersona, null, 2)}
ICP: ${JSON.stringify(icpData, null, 2)}
VALUE MESSAGING: ${JSON.stringify(valueMessaging, null, 2)}

Create a detailed "Moment in Life" description capturing the specific situation and emotional context when the target buyer would be most receptive to this product.

OUTPUT REQUIREMENTS: Respond with a JSON object containing exactly these fields:

{
  "trigger_event": "The specific event or situation that triggers the need",
  "emotional_state": "Primary emotional state during this moment",
  "urgency_level": "Low" | "Medium" | "High" | "Critical",
  "context_and_situation": "Full context of their situation and environment",
  "alternatives_being_considered": "What alternatives they're evaluating",
  "decision_timeline": "How quickly they need to make a decision",
  "influencing_factors": "External factors influencing their decision",
  "environmental_pressures": "Organizational or personal pressures they face",
  "support_system_available": "Who they can turn to for help or advice",
  "information_seeking_behavior": "How they research and gather information",
  "decision_criteria": "What criteria they use to evaluate options",
  "success_definition": "How they define a successful outcome",
  "failure_consequences": "What happens if they make the wrong choice",
  "budget_considerations": "Budget constraints and approval processes",
  "implementation_concerns": "Worries about implementing the solution",
  "quality_score": 8.5
}

Make this moment vivid and specific, showing deep understanding of the customer's world.`,
      temperature: 0.8,
      maxTokens: 2500
    };
  }

  // 8. Empathy Map - Final comprehensive emotional and behavioral mapping
  static getEmpathyMapPrompt(productDescription, targetBuyerPersona, valueMessaging, momentInLife) {
    return {
      systemPrompt: "You are an expert in customer empathy mapping and behavioral psychology, with deep skills in understanding customer thoughts, feelings, and behaviors.",
      userPrompt: `
ORIGINAL PRODUCT: "${productDescription}"

CUSTOMER INTELLIGENCE:
TARGET BUYER: ${JSON.stringify(targetBuyerPersona, null, 2)}
VALUE MESSAGING: ${JSON.stringify(valueMessaging, null, 2)}
MOMENT IN LIFE: ${JSON.stringify(momentInLife, null, 2)}

Create a comprehensive Empathy Map that captures the customer's complete cognitive and emotional experience related to this product need.

OUTPUT REQUIREMENTS: Respond with a JSON object containing exactly these fields:

{
  "what_they_think": "Internal thoughts and beliefs about the problem/solution",
  "what_they_feel": "Emotions, feelings, and emotional responses",
  "what_they_see": "What they observe in their environment and market",
  "what_they_say": "What they verbalize to others about their situation",
  "what_they_do": "Actions and behaviors related to solving the problem",
  "what_they_hear": "What others are saying that influences them",
  "pains_and_frustrations": "Specific pain points and frustrations they experience",
  "gains_and_benefits": "Desired outcomes and benefits they seek",
  "external_influences": "External factors affecting their perspective",
  "internal_motivations": "Internal drivers and motivations",
  "social_environment": "Social context and peer influences",
  "professional_environment": "Work environment and professional pressures",
  "personal_goals": "Individual aspirations and objectives",
  "professional_goals": "Career and business objectives",
  "fears_and_anxieties": "Specific fears about the problem or solution",
  "hopes_and_dreams": "Positive outcomes they hope to achieve",
  "quality_score": 8.5
}

Ensure deep emotional insight that goes beyond surface-level observations.`,
      temperature: 0.8,
      maxTokens: 3000
    };
  }
}

module.exports = SequentialAIPrompts;