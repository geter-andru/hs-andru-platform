import React, { useState, useEffect } from 'react';
import { Users, Share2, MessageCircle, Bell, Copy, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const TeamCollaborationHub = ({ toolData, toolType, assessmentData, customerId }) => {
  const [activeShares, setActiveShares] = useState([]);
  const [teamMembers, setTeamMembers] = useState([
    { id: 'cto', role: 'CTO', email: '', status: 'pending' },
    { id: 'vp-sales', role: 'VP Sales', email: '', status: 'pending' },
    { id: 'head-marketing', role: 'Head of Marketing', email: '', status: 'pending' }
  ]);
  const [shareOptions, setShareOptions] = useState({
    includeAssessment: true,
    includeRecommendations: true,
    allowComments: true,
    trackViews: true
  });
  const [copied, setCopied] = useState(null);

  // Generate shareable link with embedded assessment context
  const generateShareableLink = (targetRole = 'general') => {
    const baseUrl = window.location.origin;
    const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const shareData = {
      toolType,
      toolData,
      assessmentContext: shareOptions.includeAssessment ? {
        score: assessmentData.score,
        challenges: assessmentData.challenges,
        company: assessmentData.productName,
        sessionId: assessmentData.sessionId
      } : null,
      targetRole,
      sharedBy: customerId,
      shareOptions,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };

    // Store share data (in production, this would go to database)
    localStorage.setItem(`share_${shareId}`, JSON.stringify(shareData));
    
    return `${baseUrl}/shared/${shareId}`;
  };

  // Role-specific sharing templates
  const getSharingTemplate = (role, link) => {
    const templates = {
      cto: {
        subject: `Technical Revenue Intelligence Analysis - ${assessmentData.productName}`,
        body: `Hi [CTO Name],

Completed our revenue intelligence assessment. Technical score: ${assessmentData.score}/100.

Key technical implications:
• ${assessmentData.challenges} operational gaps affecting revenue velocity
• Customer intelligence infrastructure needs assessment
• Sales-engineering alignment optimization required

Review full analysis: ${link}

This directly impacts our technical roadmap and product-market fit validation.

Best,
[Your name]`
      },
      'vp-sales': {
        subject: `Revenue Intelligence Analysis Results - Action Required`,
        body: `Hi [VP Sales],

Assessment complete. Sales effectiveness score: ${assessmentData.score}/100.

Critical findings:
• ${assessmentData.challenges} gaps in current sales methodology
• Immediate ROI opportunity: $${((assessmentData.score * 50000 / 12) * 0.15 / 10).toLocaleString()} savings in 3 days
• Revenue acceleration tools available for implementation

Full analysis and action plan: ${link}

Let's schedule alignment call within 48 hours.

Best,
[Your name]`
      },
      'head-marketing': {
        subject: `Market Intelligence Analysis - ${assessmentData.productName}`,
        body: `Hi [Marketing Lead],

Completed revenue intelligence assessment. Market positioning score: ${assessmentData.score}/100.

Marketing implications:
• Customer intelligence gaps affecting campaign targeting
• Value proposition optimization opportunities
• Competitive positioning analysis needed

Review findings: ${link}

This impacts our entire GTM strategy and messaging framework.

Best,
[Your name]`
      }
    };

    return templates[role] || templates['vp-sales'];
  };

  const shareWithRole = (role) => {
    const link = generateShareableLink(role);
    const template = getSharingTemplate(role, link);
    
    // Create mailto link
    const member = teamMembers.find(m => m.id === role);
    const mailto = `mailto:${member?.email || ''}?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`;
    
    // Track share
    const newShare = {
      id: `share_${Date.now()}`,
      role,
      link,
      createdAt: new Date().toISOString(),
      status: 'sent'
    };
    
    setActiveShares(prev => [...prev, newShare]);
    
    // Open email client
    window.location.href = mailto;
  };

  const copyLink = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const updateTeamMemberEmail = (id, email) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === id ? { ...member, email } : member
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Users className="w-6 h-6 text-cyan-400" />
        <h2 className="text-xl font-semibold text-white">Team Collaboration</h2>
      </div>

      {/* Share Options */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <h3 className="font-medium text-white mb-3">Sharing Settings</h3>
        <div className="space-y-2">
          {Object.entries(shareOptions).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setShareOptions(prev => ({ ...prev, [key]: e.target.checked }))}
                className="rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-gray-300 text-sm">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Team Members */}
      <div className="space-y-4">
        <h3 className="font-medium text-white">Share with Key Stakeholders</h3>
        
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/30 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-black font-medium text-sm">
                  {member.role.split(' ').map(w => w[0]).join('')}
                </span>
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-white">{member.role}</h4>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={member.email}
                  onChange={(e) => updateTeamMemberEmail(member.id, e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-gray-300 text-sm mt-1 w-full"
                />
              </div>
              
              <button
                onClick={() => shareWithRole(member.id)}
                disabled={!member.email}
                className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Share Links */}
      <div className="space-y-3">
        <h3 className="font-medium text-white">Quick Share Options</h3>
        
        <div className="space-y-2">
          {['Executive Summary Link', 'Detailed Analysis Link', 'Action Items Only'].map((option, index) => {
            const link = generateShareableLink(option.toLowerCase().replace(/ /g, '-'));
            return (
              <div key={option} className="flex items-center space-x-3 bg-gray-800/30 rounded-lg p-3 border border-gray-700">
                <span className="text-gray-300 text-sm flex-1">{option}</span>
                <button
                  onClick={() => copyLink(link, option)}
                  className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {copied === option ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span className="text-xs">
                    {copied === option ? 'Copied' : 'Copy'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Shares */}
      {activeShares.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-white">Recent Shares</h3>
          
          {activeShares.slice(0, 3).map((share) => (
            <div key={share.id} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white text-sm font-medium">
                    {teamMembers.find(m => m.id === share.role)?.role || share.role}
                  </span>
                  <p className="text-gray-400 text-xs">
                    Shared {new Date(share.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="text-green-400 text-xs">
                  {share.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Collaboration Statistics */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-4 border border-gray-700">
        <h4 className="font-medium text-white mb-3">Team Engagement</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-mono text-cyan-400">{activeShares.length}</div>
            <div className="text-xs text-gray-400">Shares Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono text-green-400">{teamMembers.filter(m => m.email).length}</div>
            <div className="text-xs text-gray-400">Team Members</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCollaborationHub;