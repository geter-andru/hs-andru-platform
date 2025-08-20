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
        {resource.content?.html ? (
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: resource.content.html }} 
          />
        ) : resource.content?.text ? (
          <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
            {resource.content.text}
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
  
  const salesSageResources = [
    {
      id: 'icp',
      title: 'Ideal Customer Profile',
      description: 'Systematic buyer understanding and targeting framework',
      icon: Target,
      content: customerData?.salesSageResources?.icp
    },
    {
      id: 'persona',
      title: 'Target Buyer Persona', 
      description: 'Detailed buyer characteristics and behavior patterns',
      icon: User,
      content: customerData?.salesSageResources?.persona
    },
    {
      id: 'empathy',
      title: 'Customer Empathy Map',
      description: 'Deep customer psychology and motivation insights',
      icon: Brain,
      content: customerData?.salesSageResources?.empathyMap
    },
    {
      id: 'potential',
      title: 'Product Market Potential',
      description: 'Market opportunity and competitive positioning analysis',
      icon: TrendingUp,
      content: customerData?.salesSageResources?.productPotential
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