import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import AuthenticatedApp from './components/auth/AuthenticatedApp';
import CustomerDashboard from './pages/CustomerDashboard';
import SimplifiedPlatform from './pages/SimplifiedPlatform';
import Phase1Test from './components/test/Phase1Test';
import TestLauncher from './components/test/TestLauncher';
import AssessmentPersonalizationTest from './components/test/AssessmentPersonalizationTest';
import AssessmentContextTest from './components/test/AssessmentContextTest';
import CompetencyDashboardTest from './components/test/CompetencyDashboardTest';
import SimplifiedPlatformTest from './components/test/SimplifiedPlatformTest';
import Phase3ExportTest from './components/test/Phase3ExportTest';
import PremiumDashboardTest from './components/test/PremiumDashboardTest';
import SimplifiedDashboardPremiumTest from './components/test/SimplifiedDashboardPremiumTest';
import SarahChenWorkflowTestRunner from './components/test/SarahChenWorkflowTestRunner';
import Phase4IntegrationTest from './components/test/Phase4IntegrationTest';
import Phase5SystemTest from './components/test/Phase5SystemTest';
import SarahChenUserJourneyTest from './components/test/SarahChenUserJourneyTest';
import testEnvironmentVariables from './utils/testEnv';

function App() {
  useEffect(() => {
    // Test environment variables on app load
    const envValid = testEnvironmentVariables();
    if (!envValid) {
      console.warn('⚠️ Some environment variables are missing. Check your .env file and restart the development server.');
    }
  }, []);

  // Check if we're in test mode or legacy mode
  const isTestRoute = window.location.pathname.startsWith('/test') || 
                     window.location.pathname.startsWith('/customer') ||
                     window.location.search.includes('token=');

  // Use legacy routing for test/admin routes, new auth for main app
  if (isTestRoute) {
    return (
      <ErrorBoundary>
        <Router>
          <div className="App">
            <Routes>
              {/* Customer Routes - Default to Standard Platform */}
              <Route path="/customer/:customerId/dashboard/*" element={<CustomerDashboard />} />
              <Route path="/customer/:customerId" element={<CustomerDashboard />} />
              
              {/* Simplified Platform Routes (for admin toggle) */}
              <Route path="/customer/:customerId/simplified/*" element={<SimplifiedPlatform />} />
              
              {/* Legacy Full Routes (redirect to dashboard) */}
              <Route path="/customer/:customerId/full/*" element={<CustomerDashboard />} />
              
              {/* Test Routes */}
              <Route path="/test" element={<Phase1Test />} />
              <Route path="/test-launcher" element={<TestLauncher />} />
              <Route path="/test-assessment" element={<AssessmentPersonalizationTest />} />
              <Route path="/test-context" element={<AssessmentContextTest />} />
              <Route path="/test-competency" element={<CompetencyDashboardTest />} />
              <Route path="/test-simplified" element={<SimplifiedPlatformTest />} />
              <Route path="/test-phase3" element={<Phase3ExportTest />} />
              <Route path="/test-premium" element={<PremiumDashboardTest />} />
              <Route path="/test-premium-dashboard" element={<SimplifiedDashboardPremiumTest />} />
              <Route path="/test-sarah-chen" element={<SarahChenWorkflowTestRunner />} />
              <Route path="/test-phase4" element={<Phase4IntegrationTest />} />
              <Route path="/test-phase5" element={<Phase5SystemTest />} />
              <Route path="/test-sarah-journey" element={<SarahChenUserJourneyTest />} />
              
              {/* Default - redirect to standard platform */}
              <Route path="*" element={<CustomerDashboard />} />
            </Routes>
          </div>
        </Router>
      </ErrorBoundary>
    );
  }

  // Use new Google authentication for main app
  return (
    <ErrorBoundary>
      <AuthenticatedApp />
    </ErrorBoundary>
  );
}

export default App;