import React, { useState } from 'react';
import { Target, User, Brain, TrendingUp, Eye, X, Star } from 'lucide-react';

/**
 * CoreResourcesSection - Display AI-generated Core Resources
 * Features:
 * - Classic collection of 4 core resources (ICP, Persona, Empathy Map, Market Potential)
 * - Modal-based resource viewing
 * - Professional dark theme styling
 * - Integration with customer data context
 */

const SalesSageResourceCard = ({ title, description, icon: Icon, content, onView, isGenerated }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full flex items-center text-xs font-medium">
          <Star className="w-3 h-3 mr-1" />
          <span>Core</span>
        </div>
        {isGenerated && (
          <div className="text-xs text-green-400 mt-1">✓ Generated</div>
        )}
      </div>
    </div>
    
    <div className="mb-4">
      <div className="text-xs text-gray-500 mb-2">Status:</div>
      <div className="text-sm text-gray-300">
        {content ? "Ready for immediate use" : "Click generate to create this resource"}
      </div>
    </div>
    
    <button
      onClick={() => onView({ title, description, content, icon: Icon })}
      className={`w-full py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium ${
        content 
          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
      }`}
      disabled={!content}
    >
      <Eye className="w-4 h-4" />
      {content ? 'View Resource' : 'Generate First'}
    </button>
  </div>
);

const ResourceModal = ({ resource, onClose }) => (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
            <resource.icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{resource.title}</h2>
            <p className="text-sm text-gray-400">{resource.description}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        {resource.content ? (
          <div className="space-y-6">
            {/* Confidence Score */}
            {resource.content.confidence_score && (
              <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-400">Confidence Score:</div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-white">{resource.content.confidence_score}/10</div>
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-8 rounded ${
                          i < Math.floor(resource.content.confidence_score)
                            ? 'bg-gradient-to-t from-yellow-500 to-orange-500'
                            : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Main Content */}
            {resource.content.text && (
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                  {resource.content.text}
                </div>
              </div>
            )}
            
            {/* Structured Data */}
            {resource.content.data && Object.keys(resource.content.data).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Detailed Analysis
                </h3>
                {Object.entries(resource.content.data).map(([key, value]) => {
                  if (!value) return null;
                  const formattedKey = key
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                  
                  return (
                    <div key={key} className="space-y-2">
                      <h4 className="text-sm font-medium text-blue-400">{formattedKey}:</h4>
                      <div className="pl-4 text-gray-300 text-sm">
                        {typeof value === 'string' || typeof value === 'number' ? (
                          <p>{value}</p>
                        ) : (
                          <pre className="whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <resource.icon className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Resource Not Available</h3>
            <p className="text-gray-400 mb-4">
              This resource hasn't been generated yet. Use the Product Input section above to create Core Resources.
            </p>
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

const CoreResourcesSection = ({ customerData }) => {
  const [selectedResource, setSelectedResource] = useState(null);
  
  // Check for pending generation
  const pendingGeneration = JSON.parse(localStorage.getItem('pendingSalesSageGeneration') || 'null');
  const isRecentlyGenerated = pendingGeneration && (Date.now() - pendingGeneration.timestamp < 300000); // 5 minutes
  
  // Map the webhook response format to display format
  const resources = customerData?.salesSageResources || {};
  
  const salesSageResources = [
    {
      id: 'icp',
      title: resources.icp_analysis?.title || 'Ideal Customer Profile',
      description: 'Systematic buyer understanding and targeting framework',
      icon: Target,
      content: resources.icp_analysis ? {
        text: resources.icp_analysis.content,
        confidence_score: resources.icp_analysis.confidence_score,
        data: {
          company_size_range: resources.icp_analysis.company_size_range,
          industry_verticals: resources.icp_analysis.industry_verticals,
          annual_revenue_range: resources.icp_analysis.annual_revenue_range,
          geographic_markets: resources.icp_analysis.geographic_markets,
          technology_stack: resources.icp_analysis.technology_stack,
          budget_range: resources.icp_analysis.budget_range,
          decision_makers: resources.icp_analysis.decision_makers,
          growth_stage: resources.icp_analysis.growth_stage
        }
      } : null
    },
    {
      id: 'persona',
      title: resources.buyer_personas?.title || 'Target Buyer Persona', 
      description: 'Detailed buyer characteristics and behavior patterns',
      icon: User,
      content: resources.buyer_personas ? {
        text: resources.buyer_personas.content,
        confidence_score: resources.buyer_personas.confidence_score,
        data: {
          persona_name: resources.buyer_personas.persona_name,
          job_title: resources.buyer_personas.job_title,
          pain_points: resources.buyer_personas.pain_points,
          goals_and_objectives: resources.buyer_personas.goals_and_objectives,
          decision_timeline: resources.buyer_personas.decision_timeline,
          success_metrics: resources.buyer_personas.success_metrics
        }
      } : null
    },
    {
      id: 'empathy',
      title: resources.empathy_map?.title || 'Customer Empathy Map',
      description: 'Deep customer psychology and motivation insights',
      icon: Brain,
      content: resources.empathy_map ? {
        text: resources.empathy_map.content,
        confidence_score: resources.empathy_map.confidence_score,
        data: {
          what_they_think: resources.empathy_map.what_they_think,
          what_they_feel: resources.empathy_map.what_they_feel,
          what_they_see: resources.empathy_map.what_they_see,
          what_they_do: resources.empathy_map.what_they_do,
          what_they_hear: resources.empathy_map.what_they_hear,
          pains_and_frustrations: resources.empathy_map.pains_and_frustrations,
          gains_and_benefits: resources.empathy_map.gains_and_benefits
        }
      } : null
    },
    {
      id: 'potential',
      title: resources.product_assessment?.title || 'Product Market Potential',
      description: 'Market opportunity and competitive positioning analysis',
      icon: TrendingUp,
      content: resources.product_assessment ? {
        text: resources.product_assessment.content,
        confidence_score: resources.product_assessment.confidence_score,
        data: {
          current_product_potential_score: resources.product_assessment.current_product_potential_score,
          gaps_preventing_10: resources.product_assessment.gaps_preventing_10,
          market_opportunity: resources.product_assessment.market_opportunity,
          problems_solved_today: resources.product_assessment.problems_solved_today,
          customer_conversion: resources.product_assessment.customer_conversion,
          value_indicators: resources.product_assessment.value_indicators
        }
      } : null
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Core Resources</h2>
            <p className="text-sm text-gray-400">AI-generated sales intelligence for your product</p>
          </div>
        </div>
        <div className="text-right">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-medium">
            Classic Collection
          </div>
          {isRecentlyGenerated && (
            <div className="text-xs text-green-400 mt-1">⏳ Generation in progress...</div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {salesSageResources.map(resource => (
          <SalesSageResourceCard
            key={resource.id}
            {...resource}
            isGenerated={!!resource.content}
            onView={setSelectedResource}
          />
        ))}
      </div>
      
      {!salesSageResources.some(r => r.content) && !isRecentlyGenerated && (
        <div className="text-center py-8 bg-gray-800/50 rounded-xl border border-gray-700 mt-6">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No Core Resources Yet</h3>
          <p className="text-gray-400 mb-4 max-w-md mx-auto">
            Use the Product Input section above to generate AI-powered sales resources tailored to your product.
          </p>
        </div>
      )}
      
      {selectedResource && (
        <ResourceModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  );
};

export default CoreResourcesSection;