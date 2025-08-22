import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams, useSearchParams, Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { FeatureFlagProvider } from '../contexts/FeatureFlagContext';
import { UserIntelligenceProvider } from '../contexts/simplified/UserIntelligenceContext';
import ModernSidebarLayout from '../components/layout/ModernSidebarLayout';
import SimplifiedDashboard from '../components/simplified/SimplifiedDashboard';
import SimplifiedDashboardPremium from '../components/simplified/SimplifiedDashboardPremium';
import RevenueIntelligenceDashboard from '../components/dashboard/RevenueIntelligenceDashboard';
import SimplifiedICP from '../components/simplified/SimplifiedICP';
import SimplifiedFinancialImpact from '../components/simplified/SimplifiedFinancialImpact';
import SimplifiedResourceLibrary from '../components/simplified/SimplifiedResourceLibrary';
import ErrorBoundary from '../components/common/ErrorBoundary';
import ResourcesReadyNotification from '../components/notifications/ResourcesReadyNotification';

const SimplifiedPlatform = () => {
  const { customerId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current active route for sidebar navigation
  const getActiveRoute = () => {
    const path = location.pathname;
    if (path.includes('dashboard-premium')) return 'dashboard-premium';
    if (path.includes('dashboard')) return 'dashboard';
    if (path.includes('icp')) return 'icp';
    if (path.includes('financial')) return 'financial';
    if (path.includes('resources')) return 'resources';
    return 'dashboard';
  };

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const token = searchParams.get('token');
        
        if (!customerId) {
          throw new Error('Customer ID is required');
        }

        // Check existing session
        let session = authService.getCurrentSession();
        
        // If no session but token provided, validate credentials and create session
        if (!session && token) {
          const authResult = await authService.validateCredentials(customerId, token);
          if (!authResult.valid) {
            throw new Error(authResult.error || 'Authentication failed');
          }
          session = authService.generateSession(authResult.customerData, token);
        }
        
        if (!session) {
          throw new Error('Authentication required');
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    validateAccess();
  }, [customerId, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading simplified platform...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Error</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <a 
            href="/customer/dru78DR9789SDF862?token=admin-demo-token-2025"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Try Admin Demo
          </a>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <ErrorBoundary>
      <FeatureFlagProvider customerId={customerId}>
        <UserIntelligenceProvider customerId={customerId}>
          <div className="relative">
            {/* Modern Sidebar Layout wrapping all routes */}
            <ModernSidebarLayout customerId={customerId} activeRoute={getActiveRoute()}>
              <Routes>
                <Route path="dashboard" element={<SimplifiedDashboard customerId={customerId} />} />
                <Route path="dashboard-premium" element={<RevenueIntelligenceDashboard customerId={customerId} variant="premium" />} />
                <Route path="icp" element={<SimplifiedICP customerId={customerId} />} />
                <Route path="financial" element={<SimplifiedFinancialImpact customerId={customerId} />} />
                <Route path="resources" element={<SimplifiedResourceLibrary customerId={customerId} />} />
                
                {/* Default redirect to dashboard */}
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ModernSidebarLayout>
            
            {/* Global Resources Ready Notification */}
            <ResourcesReadyNotification customerId={customerId} />
          </div>
        </UserIntelligenceProvider>
      </FeatureFlagProvider>
    </ErrorBoundary>
  );
};

export default SimplifiedPlatform;