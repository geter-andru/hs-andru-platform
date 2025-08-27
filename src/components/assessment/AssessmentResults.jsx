import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, ArrowRight } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function AssessmentResults({ customerId }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [assessmentData, setAssessmentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load assessment data from sessionStorage or API
  useEffect(() => {
    const loadAssessmentData = () => {
      try {
        // First try sessionStorage from assessment app
        const storedResults = sessionStorage.getItem('assessmentResults');
        if (storedResults) {
          const data = JSON.parse(storedResults);
          setAssessmentData(data);
          setLoading(false);
          return;
        }

        // Fallback to mock data for demo purposes
        const mockData = {
          results: {
            overallScore: 72,
            buyerScore: 68,
            techScore: 76,
            qualification: 'Promising'
          },
          generatedContent: {
            buyerGap: 45,
            icp: 'Comprehensive ICP analysis showing enterprise SaaS companies with 100-500 employees...',
            tbp: 'Target buyer personas including technical decision makers and business stakeholders...'
          },
          userInfo: {
            company: 'TechCorp',
            email: 'founder@techcorp.com'
          },
          questionTimings: []
        };
        
        setAssessmentData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading assessment data:', error);
        setLoading(false);
      }
    };

    loadAssessmentData();
  }, [customerId]);

  const handleLinkedInShare = () => {
    if (!assessmentData) return;
    
    const { results, userInfo, generatedContent } = assessmentData;
    const company = userInfo?.company || 'my company';
    const challenge = getTopChallenge();
    
    const linkedInText = `🎯 Just completed my Revenue Readiness Assessment: ${results.overallScore}% score!

As a technical founder at ${company}, I discovered my primary challenge is ${challenge}.

The assessment identified specific gaps in my buyer understanding and technical value translation - exactly the systematic intelligence I need to scale from $2M to $10M+ ARR.

Ready to transform technical capabilities into strategic enterprise partnerships. 

#TechnicalFounder #RevenueIntelligence #B2BSales #StartupGrowth`;

    const encodedText = encodeURIComponent(linkedInText);
    const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedText}`;
    window.open(linkedInUrl, '_blank');
  };

  const handlePDFDownload = () => {
    if (!assessmentData) return;
    
    const { results, userInfo } = assessmentData;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Revenue Readiness Assessment Report', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Company: ${userInfo?.company || 'N/A'}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);
    
    // Scores
    doc.setFontSize(16);
    doc.text('Assessment Scores', 20, 80);
    doc.setFontSize(12);
    doc.text(`Overall Revenue Readiness: ${results.overallScore}%`, 20, 100);
    doc.text(`Customer Understanding: ${results.buyerScore}%`, 20, 110);
    doc.text(`Technical Value Translation: ${results.techScore}%`, 20, 120);
    doc.text(`Qualification Level: ${results.qualification}`, 20, 130);
    
    // Top Challenge
    doc.setFontSize(16);
    doc.text('Primary Challenge', 20, 150);
    doc.setFontSize(12);
    doc.text(getTopChallenge(), 20, 170);
    
    doc.save(`revenue-assessment-${userInfo?.company || 'report'}.pdf`);
  };

  const getTopChallenge = () => {
    if (!assessmentData) return '';
    const { results } = assessmentData;
    if (results.buyerScore < 50) return "Customer Discovery & Buyer Understanding";
    if (results.techScore < 50) return "Technical Value Translation";
    if (results.qualification === 'Developing') return "Revenue Execution Fundamentals";
    return "Advanced Revenue Scaling";
  };

  const getProfessionalLevel = (score) => {
    if (score >= 80) return 'Revenue Intelligence Master';
    if (score >= 70) return 'Strategic Revenue Leader';
    if (score >= 60) return 'Revenue Competent';
    if (score >= 50) return 'Revenue Developing';
    return 'Revenue Foundation';
  };

  const getPercentile = (score) => {
    return Math.min(95, Math.floor(score * 1.2));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-pulse text-gray-400">
          Loading assessment results...
        </div>
      </div>
    );
  }

  if (!assessmentData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-gray-400 mb-4">No Assessment Data Found</h2>
        <p className="text-gray-500 mb-6">Complete an assessment to view your detailed results here.</p>
        <a 
          href="https://assessment.andru-ai.com/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Take Assessment →
        </a>
      </div>
    );
  }

  const { results, generatedContent } = assessmentData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Assessment Results</h1>
          <p className="text-gray-400">Your comprehensive revenue readiness analysis</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleLinkedInShare}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button
            onClick={handlePDFDownload}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'challenges', label: 'Challenges' },
            { id: 'recommendations', label: 'Recommendations' }
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSection === id
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Sections */}
      {activeSection === 'overview' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Scoring Dashboard */}
          <div className="bg-gray-800/30 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6 text-white">Revenue Readiness Dashboard</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{results.overallScore}%</div>
                <div className="text-sm text-gray-400">Overall Revenue Readiness</div>
                <div className="text-xs text-gray-500 mt-1">Combined assessment score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{results.buyerScore}%</div>
                <div className="text-sm text-gray-400">Customer Understanding</div>
                <div className="text-xs text-gray-500 mt-1">How well you know your buyers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{results.techScore}%</div>
                <div className="text-sm text-gray-400">Technical Value Translation</div>
                <div className="text-xs text-gray-500 mt-1">Converting features to business value</div>
              </div>
            </div>
            
            {/* Buyer Understanding Gap Display */}
            {generatedContent?.buyerGap !== undefined && (
              <div className="mb-6 p-4 rounded-lg bg-gray-900/50 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-white">Buyer Understanding Gap Analysis</h3>
                    <p className="text-sm text-gray-400">
                      Difference between your ideal customer description and market reality
                    </p>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${
                      generatedContent.buyerGap > 60 ? 'text-red-400' :
                      generatedContent.buyerGap > 40 ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {generatedContent.buyerGap}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {generatedContent.buyerGap > 60 ? 'Critical Gap' :
                       generatedContent.buyerGap > 40 ? 'Moderate Gap' :
                       'Well Aligned'}
                    </div>
                  </div>
                </div>
                {generatedContent.buyerGap > 40 && (
                  <p className="text-sm text-gray-300 mt-3">
                    💡 We've generated detailed ICP insights and buyer personas to help bridge this gap. 
                    Review your personalized recommendations in the tabs above.
                  </p>
                )}
              </div>
            )}
            
            <div className="border-t border-gray-700 pt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Professional Level:</span>
                <span className="font-semibold text-blue-400">{getProfessionalLevel(results.overallScore)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Percentile:</span>
                <span className="font-semibold text-green-400">Top {100 - getPercentile(results.overallScore)}% of technical founders</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeSection === 'challenges' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold mb-6 text-white">Top 3 Challenges Identified</h2>
          
          <div className="bg-gray-800/30 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔴</span>
                <h3 className="text-xl font-semibold text-white">{getTopChallenge()}</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-sm bg-red-500/20 text-red-400 border border-red-500/30">
                CRITICAL
              </span>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-400 mb-1">Evidence</div>
                <div className="text-gray-300">Assessment scoring indicates knowledge gaps in customer discovery</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Pattern</div>
                <div className="text-gray-300">Technical founders often focus on product features vs buyer value</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Revenue Impact</div>
                <div className="text-gray-300">25-40% longer sales cycles, lower conversion rates</div>
              </div>
            </div>
          </div>
          
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">View detailed challenge analysis and solutions in your ICP Analysis and Cost Calculator tools.</p>
            <button 
              onClick={() => window.location.href = `/customer/${customerId}/simplified/icp`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2"
            >
              <span>Explore Solutions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {activeSection === 'recommendations' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold mb-6 text-white">Prioritized Tool Recommendations</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-800/30 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-blue-400">ICP Analysis Framework</h3>
                <span className="text-sm text-gray-400">Priority #1</span>
              </div>
              
              <p className="text-gray-300 mb-4">
                Systematic customer intelligence framework to identify and qualify your ideal customers
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <div className="text-gray-400 mb-1">Why Recommended</div>
                  <div className="text-gray-300">Your buyer understanding score suggests gaps in customer discovery</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Expected Improvement</div>
                  <div className="text-green-400">30-50% improvement in qualification accuracy</div>
                </div>
              </div>
              
              <button 
                onClick={() => window.location.href = `/customer/${customerId}/simplified/icp`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Access Tool
              </button>
            </div>

            <div className="bg-gray-800/30 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-blue-400">Cost Calculator</h3>
                <span className="text-sm text-gray-400">Priority #2</span>
              </div>
              
              <p className="text-gray-300 mb-4">
                Quantify business impact with enterprise-grade financial modeling
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <div className="text-gray-400 mb-1">Why Recommended</div>
                  <div className="text-gray-300">Technical value translation needs quantifiable business metrics</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Expected Improvement</div>
                  <div className="text-green-400">ROI clarity for stakeholder conversations</div>
                </div>
              </div>
              
              <button 
                onClick={() => window.location.href = `/customer/${customerId}/simplified/financial`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Access Tool
              </button>
            </div>

            <div className="bg-gray-800/30 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-blue-400">Business Case Builder</h3>
                <span className="text-sm text-gray-400">Priority #3</span>
              </div>
              
              <p className="text-gray-300 mb-4">
                Convert insights into executive-ready business cases and proposals
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <div className="text-gray-400 mb-1">Why Recommended</div>
                  <div className="text-gray-300">Transform technical achievements into strategic value propositions</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Expected Improvement</div>
                  <div className="text-green-400">Executive-level communication capability</div>
                </div>
              </div>
              
              <button 
                onClick={() => window.location.href = `/customer/${customerId}/simplified/resources`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Access Tool
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};