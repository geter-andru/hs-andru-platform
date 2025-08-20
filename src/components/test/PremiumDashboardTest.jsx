import React, { useEffect } from 'react';
import SimplifiedDashboardPremium from '../simplified/SimplifiedDashboardPremium';
import { UserIntelligenceProvider } from '../../contexts/simplified/UserIntelligenceContext';
import { authService } from '../../services/authService';

/**
 * Test component for SimplifiedDashboardPremium
 * Tests Phase 2: Enhanced Competency Overview implementation
 */
const PremiumDashboardTest = () => {
  // Set up test session for the premium dashboard test
  useEffect(() => {
    const testCustomerData = {
      customerId: 'TEST_PREMIUM',
      customerName: 'Premium Test User',
      company: 'Test Premium Company',
      id: 'test-record-id',
      isAdmin: false,
      demoMode: true
    };
    
    // Generate the test session using the correct authService method
    authService.generateSession(testCustomerData, 'test-premium-token-2025');
  }, []);

  return (
    <UserIntelligenceProvider customerId="TEST_PREMIUM">
      <div className="min-h-screen bg-black">
        <div className="p-4 bg-gray-900 border-b border-gray-800">
          <h1 className="text-white text-xl font-bold">
            🧪 Premium Dashboard Test - Phase 2: Enhanced Competency Overview
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Testing circular progress bars, trend analysis, and 30-day charts
          </p>
        </div>
        
        <SimplifiedDashboardPremium customerId="TEST_PREMIUM" />
      </div>
    </UserIntelligenceProvider>
  );
};

export default PremiumDashboardTest;