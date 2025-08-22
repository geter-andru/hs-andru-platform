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
    const checkAuthState = () => {
      try {
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
    setAuthState({
      isAuthenticated: true,
      user: sessionData.user,
      customerData: sessionData.customerData,
      loading: false
    });
    setAuthError(null);
    
    console.log('User signed in successfully:', sessionData.user.email);
    
    // Optional: Navigate to dashboard or show welcome message
    if (sessionData.customerData?.isNewUser) {
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
              to="/customer/CUST_4/simplified/dashboard?token=admin-demo-token-2025"
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