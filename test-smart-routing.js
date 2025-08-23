#!/usr/bin/env node

/**
 * Test script for Smart Routing System
 * Tests complexity analysis and generation method selection
 */

// Standalone implementation for testing
class TestWebhookService {
  analyzeRequestComplexity(productData) {
    const productName = productData.productName || '';
    const description = productData.productDescription || '';
    const features = productData.keyFeatures || '';
    const businessType = productData.businessType || '';
    
    let complexityScore = 0;
    
    // Product name complexity
    if (productName.length > 20) complexityScore += 1;
    if (productName.toLowerCase().includes('ai') || productName.toLowerCase().includes('ml')) complexityScore += 2;
    
    // Description complexity
    if (description.length > 100) complexityScore += 2;
    if (description.length > 300) complexityScore += 2;
    if (description.toLowerCase().includes('enterprise')) complexityScore += 1;
    if (description.toLowerCase().includes('platform')) complexityScore += 1;
    
    // Features complexity
    if (features.length > 50) complexityScore += 1;
    if (features.split(',').length > 3) complexityScore += 2;
    
    // Business type factor
    if (businessType === 'B2B') complexityScore += 1;
    
    // Industry keywords that suggest complexity
    const complexKeywords = ['fintech', 'healthcare', 'enterprise', 'saas', 'platform', 'automation', 'integration', 'analytics'];
    const text = `${productName} ${description} ${features}`.toLowerCase();
    const keywordMatches = complexKeywords.filter(keyword => text.includes(keyword)).length;
    complexityScore += keywordMatches;
    
    // Classify complexity
    if (complexityScore <= 3) return { level: 'simple', score: complexityScore };
    if (complexityScore <= 7) return { level: 'medium', score: complexityScore };
    return { level: 'complex', score: complexityScore };
  }

  selectGenerationMethod(complexity) {
    const routingRules = {
      simple: 'template_only',        // Fast template-based generation
      medium: 'enhanced_fallback',    // Web research + templates
      complex: 'enhanced_fallback'    // Could be 'make_com' for highest quality
    };
    
    return routingRules[complexity] || 'enhanced_fallback';
  }
}

async function testSmartRouting() {
  console.log('🧪 Testing Smart Routing System');
  console.log('=' * 50);

  const service = new TestWebhookService();

  // Test scenarios with expected complexity levels
  const testScenarios = [
    {
      name: 'Simple To-Do App',
      data: {
        productName: 'TodoApp',
        productDescription: 'Simple task manager',
        businessType: 'B2C',
        keyFeatures: 'Add tasks, mark complete'
      },
      expectedComplexity: 'simple',
      expectedMethod: 'template_only'
    },
    {
      name: 'Basic B2B Tool',
      data: {
        productName: 'TeamCollab',
        productDescription: 'Team collaboration tool for small businesses with project management and communication features',
        businessType: 'B2B',
        keyFeatures: 'Project tracking, team chat, file sharing'
      },
      expectedComplexity: 'simple',
      expectedMethod: 'template_only'
    },
    {
      name: 'Enterprise SaaS Platform',
      data: {
        productName: 'Enterprise Analytics Dashboard',
        productDescription: 'Comprehensive analytics platform for enterprise customers with advanced reporting, data visualization, and integration capabilities for business intelligence',
        businessType: 'B2B',
        keyFeatures: 'Advanced analytics, custom dashboards, API integration, role-based access, automated reporting'
      },
      expectedComplexity: 'medium',
      expectedMethod: 'enhanced_fallback'
    },
    {
      name: 'AI-Powered Complex Solution',
      data: {
        productName: 'AI-Powered Healthcare Analytics Platform',
        productDescription: 'Sophisticated healthcare analytics platform leveraging artificial intelligence and machine learning to provide predictive insights, regulatory compliance automation, and integration with electronic health record systems for healthcare enterprise institutions',
        businessType: 'B2B',
        keyFeatures: 'AI predictive modeling, healthcare compliance, EHR integration, HIPAA compliance, clinical decision support, population health analytics, real-time monitoring, automated alerts'
      },
      expectedComplexity: 'complex',
      expectedMethod: 'enhanced_fallback'
    },
    {
      name: 'Fintech Enterprise Platform',
      data: {
        productName: 'Enterprise Fintech Risk Management and Compliance Automation Platform',
        productDescription: 'Advanced financial technology platform designed for enterprise financial institutions, providing comprehensive risk management, regulatory compliance automation, real-time fraud detection, and seamless integration with core banking systems',
        businessType: 'B2B',
        keyFeatures: 'Risk modeling, compliance automation, fraud detection, banking integration, regulatory reporting, audit trails, real-time monitoring, machine learning algorithms, multi-currency support, enterprise security'
      },
      expectedComplexity: 'complex',
      expectedMethod: 'enhanced_fallback'
    }
  ];

  let testsPassed = 0;
  let testsTotal = testScenarios.length;

  for (const scenario of testScenarios) {
    console.log(`\n🔍 Testing: ${scenario.name}`);
    console.log('-'.repeat(30));
    
    const complexity = service.analyzeRequestComplexity(scenario.data);
    const method = service.selectGenerationMethod(complexity.level);
    
    console.log(`📊 Complexity Score: ${complexity.score}`);
    console.log(`📋 Complexity Level: ${complexity.level}`);
    console.log(`🎯 Selected Method: ${method}`);
    console.log(`✅ Expected: ${scenario.expectedComplexity} → ${scenario.expectedMethod}`);
    
    // Verify results
    const complexityCorrect = complexity.level === scenario.expectedComplexity;
    const methodCorrect = method === scenario.expectedMethod;
    
    if (complexityCorrect && methodCorrect) {
      console.log(`✅ Test PASSED`);
      testsPassed++;
    } else {
      console.log(`❌ Test FAILED`);
      if (!complexityCorrect) {
        console.log(`   Complexity: expected ${scenario.expectedComplexity}, got ${complexity.level}`);
      }
      if (!methodCorrect) {
        console.log(`   Method: expected ${scenario.expectedMethod}, got ${method}`);
      }
    }
  }

  console.log(`\n📊 Smart Routing Test Results:`);
  console.log(`✅ Tests Passed: ${testsPassed}/${testsTotal}`);
  console.log(`📈 Success Rate: ${Math.round((testsPassed/testsTotal) * 100)}%`);
  
  if (testsPassed === testsTotal) {
    console.log('🎉 All smart routing tests passed!');
  } else {
    console.log('⚠️  Some tests failed - review complexity scoring logic');
  }

  console.log('\n🚀 Smart Routing System Analysis:');
  console.log('📋 Simple (score ≤3): template_only (instant)');
  console.log('📋 Medium (score 4-7): enhanced_fallback (10-20s)'); 
  console.log('📋 Complex (score 8+): enhanced_fallback (could route to make_com)');
}

// Run the test
testSmartRouting().catch(console.error);