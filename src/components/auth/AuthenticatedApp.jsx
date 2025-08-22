import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from './SignUpPage';
import SimplifiedPlatform from '../../pages/SimplifiedPlatform';
import { authService } from '../../services/authService';

const AuthenticatedApp = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    customerData: null,
    loading: true
  });
  const [authError, setAuthError] = useState(null);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Check for OAuth callback (when user returns from Google)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        if (code && state) {
          console.log('OAuth callback detected, processing...');
          
          // Verify state matches what we stored
          const storedState = sessionStorage.getItem('googleOAuthState');
          if (state !== storedState) {
            console.error('OAuth state mismatch');
            setAuthError('Authentication failed: Invalid state');
            setAuthState({
              isAuthenticated: false,
              user: null,
              customerData: null,
              loading: false
            });
            return;
          }
          
          try {
            // For local development, skip the Netlify function and create a mock user
            // In production, this would go through the Netlify function
            console.log('Processing OAuth callback with code:', code);
            
            let data;
            
            // Check if we're in local development
            if (window.location.hostname === 'localhost') {
              console.log('Local development detected - using mock authentication');
              
              // Create a mock successful response for local development
              // In production, the Netlify function would validate the code with Google
              data = {
                success: true,
                user: {
                  googleId: 'mock_google_id_' + Date.now(),
                  email: 'demo@example.com', // This would come from Google in production
                  name: 'Demo User',
                  firstName: 'Demo',
                  lastName: 'User',
                  picture: null,
                  emailVerified: true
                },
                idToken: 'mock_token_for_development'
              };
              
              // Show a message that this is development mode
              console.log('📝 Development Mode: Using mock authentication');
              console.log('📝 In production, this would validate with Google OAuth');
              
              // Add a temporary notice for the user
              setTimeout(() => {
                alert('🔧 Development Mode: Google OAuth simulation\n\nYou\'ve been logged in with a demo account.\n\nIn production, your actual Google account would be used.');
              }, 1000);
              
            } else {
              // Production: use Netlify function
              const response = await fetch('/.netlify/functions/google-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  code, 
                  redirectUri: window.location.origin 
                })
              });
              
              data = await response.json();
            }
            
            if (data.success) {
              // Generate a randomized customer ID unique to our platform
              const generateCustomerId = () => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let result = 'dru'; // Start with 'dru' for Andru platform
                for (let i = 0; i < 14; i++) { // 14 characters to make 17 total (dru + 14)
                  result += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return result;
              };

              const randomCustomerId = generateCustomerId();
              console.log('🆔 Generated Customer ID:', randomCustomerId);
              
              // Create mock customer data for development
              const mockCustomerData = {
                customerId: randomCustomerId,
                customer_id: randomCustomerId,
                customerName: data.user.name || 'Demo User',
                customer_name: data.user.name || 'Demo User',
                email: data.user.email,
                company: 'Demo Company',
                isNewUser: true, // Since this is a new Google sign-in
                demoMode: true,
                id: randomCustomerId // Airtable record ID format
              };
              
              // Create session data similar to the original flow
              const sessionData = {
                user: data.user,
                customerData: window.location.hostname === 'localhost' ? mockCustomerData : null,
                isAuthenticated: true,
                authMethod: 'google',
                loginTime: new Date().toISOString(),
                token: data.idToken
              };
              
              sessionStorage.setItem('authSession', JSON.stringify(sessionData));
              sessionStorage.removeItem('googleOAuthState');
              
              // Clean up URL
              window.history.replaceState({}, document.title, window.location.pathname);
              
              handleSignInSuccess(sessionData);
              return;
            } else {
              throw new Error(data.error || 'Authentication failed');
            }
          } catch (error) {
            console.error('OAuth callback error:', error);
            setAuthError(error.message);
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
        
        // Normal auth state check
        const currentAuth = authService.getCurrentAuth();
        
        if (currentAuth.isAuthenticated) {
          setAuthState({
            isAuthenticated: true,
            user: currentAuth.user,
            customerData: currentAuth.customerData,
            loading: false
          });
          console.log('Restored authentication session for:', currentAuth.user?.email);
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            customerData: null,
            loading: false
          });
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          customerData: null,
          loading: false
        });
      }
    };

    checkAuthState();
  }, []);

  // Handle successful Google sign-in
  const handleSignInSuccess = (sessionData) => {
    // Generate fallback customer ID if needed
    const generateCustomerId = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = 'dru'; // Start with 'dru' for Andru platform
      for (let i = 0; i < 14; i++) { // 14 characters to make 17 total
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    // Ensure we have customer data for routing
    const customerData = sessionData.customerData || {
      customerId: generateCustomerId(),
      customer_id: generateCustomerId(),
      customerName: sessionData.user?.name || 'Demo User',
      customer_name: sessionData.user?.name || 'Demo User',
      email: sessionData.user?.email || 'demo@example.com',
      company: 'Demo Company',
      demoMode: true,
      isNewUser: true
    };
    
    setAuthState({
      isAuthenticated: true,
      user: sessionData.user,
      customerData: customerData,
      loading: false
    });
    setAuthError(null);
    
    console.log('User signed in successfully:', sessionData.user?.email);
    console.log('Customer ID:', customerData.customerId);
    
    // Optional: Navigate to dashboard or show welcome message
    if (customerData?.isNewUser) {
      console.log('New user detected - could show onboarding');
    }
  };

  // Handle sign-in errors
  const handleSignInError = (error) => {
    setAuthError(error);
    setAuthState(prev => ({
      ...prev,
      loading: false
    }));
    console.error('Sign-in error:', error);
  };

  // Handle sign-out
  const handleSignOut = () => {
    authService.signOut();
    setAuthState({
      isAuthenticated: false,
      user: null,
      customerData: null,
      loading: false
    });
    setAuthError(null);
    console.log('User signed out');
  };

  // Show loading state
  if (authState.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Revenue Intelligence Platform...</p>
        </div>
      </div>
    );
  }

  // Show sign-up page if not authenticated
  if (!authState.isAuthenticated) {
    return (
      <div>
        <SignUpPage 
          onSignInSuccess={handleSignInSuccess}
          onSignInError={handleSignInError}
        />
        
        {authError && (
          <div className="fixed bottom-4 right-4 bg-red-900/90 border border-red-700 rounded-lg p-4 max-w-md">
            <h4 className="text-red-400 font-medium mb-1">Authentication Error</h4>
            <p className="text-red-300 text-sm">{authError}</p>
            <button
              onClick={() => setAuthError(null)}
              className="text-red-400 hover:text-red-300 text-sm mt-2 underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    );
  }

  // Show main application for authenticated users
  return (
    <Router>
      <Routes>
        <Route 
          path="/customer/:customerId/*" 
          element={
            <SimplifiedPlatform 
              authState={authState}
              onSignOut={handleSignOut}
            />
          } 
        />
        
        <Route 
          path="/" 
          element={
            <Navigate 
              to={`/customer/${authState.customerData?.customerId}/simplified/dashboard`}
              replace 
            />
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <Navigate 
              to="/customer/dru78DR9789SDF862/simplified/dashboard?token=admin-demo-token-2025"
              replace 
            />
          } 
        />
        
        <Route 
          path="*" 
          element={
            <Navigate 
              to={`/customer/${authState.customerData?.customerId}/simplified/dashboard`}
              replace 
            />
          } 
        />
      </Routes>
    </Router>
  );
};

export default AuthenticatedApp;