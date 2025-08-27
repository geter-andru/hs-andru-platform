import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Lock, CreditCard, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { airtableService } from '../../services/airtableService';

const PaymentProtectedRoute = ({ children, customerId, requiredAccess = 'paid' }) => {
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const data = await airtableService.getCustomerAssets(customerId);
        setCustomerData(data);
      } catch (error) {
        console.error('Error fetching customer data for access control:', error);
        
        // Fallback to authService for admin/test users
        try {
          const { authService } = await import('../../services/authService');
          const session = authService.getCurrentSession();
          if (session?.customerData) {
            setCustomerData({
              ...session.customerData,
              paymentStatus: session.customerData.paymentStatus || 
                           (session.customerData.isAdmin ? 'Completed' : 'Pending')
            });
          } else {
            setCustomerData(null);
          }
        } catch (fallbackError) {
          console.error('Fallback auth service fetch failed:', fallbackError);
          setCustomerData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomerData();
    } else {
      setLoading(false);
    }
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-pulse text-gray-400">
          Checking access permissions...
        </div>
      </div>
    );
  }

  // Check access based on payment status
  const hasAccess = () => {
    if (requiredAccess === 'assessment') {
      // Assessment results accessible to anyone who has taken assessment
      return true; // For now, assuming if they got this far they took assessment
    }
    
    if (requiredAccess === 'paid') {
      return customerData?.paymentStatus === 'Completed';
    }
    
    return false;
  };

  if (!hasAccess()) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md text-center bg-gray-800/30 rounded-xl p-8 border border-gray-700"
        >
          <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-gray-400" />
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-3">
            Upgrade Required
          </h2>
          
          <p className="text-gray-400 mb-6">
            This feature requires a completed payment to access. Upgrade to unlock all Revenue Intelligence tools.
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={() => {
                // Get assessment data from sessionStorage for waitlist
                const storedResults = sessionStorage.getItem('assessmentResults');
                let waitlistUrl = 'http://localhost:3001/waitlist';
                
                if (storedResults) {
                  try {
                    const assessmentData = JSON.parse(storedResults);
                    const params = new URLSearchParams({
                      email: assessmentData.userInfo?.email || '',
                      company: assessmentData.userInfo?.company || '',
                      score: assessmentData.results?.overallScore || '0',
                      challenges: assessmentData.results?.buyerScore || '0',
                      sessionId: customerId
                    });
                    waitlistUrl += '?' + params.toString();
                  } catch (error) {
                    console.error('Error parsing assessment data:', error);
                  }
                }
                
                window.location.href = waitlistUrl;
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Upgrade Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button 
              onClick={() => window.location.href = `/customer/${customerId}/simplified/assessment`}
              className="w-full text-gray-400 hover:text-white px-6 py-3 rounded-lg transition-colors"
            >
              ← Back to Assessment Results
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return children;
};

export default PaymentProtectedRoute;