import React, { useEffect, useState, useCallback } from 'react';
import { LogIn, Shield, Check } from 'lucide-react';

const GoogleSignIn = ({ onSignInSuccess, onSignInError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Look up customer by email in Airtable
  const lookupCustomerByEmail = async (email) => {
    try {
      // Import airtableService
      const { airtableService } = await import('../../services/airtableService');
      
      // Search for customer by email
      const customerData = await airtableService.getCustomerByEmail(email);
      
      if (customerData) {
        return customerData;
      }

      // If no customer found, create a new customer record
      return await createNewCustomer(email);
      
    } catch (error) {
      console.error('Customer lookup error:', error);
      // Return null if lookup fails - user can still sign in
      return null;
    }
  };

  // Create new customer record for first-time Google sign-ins
  const createNewCustomer = async (email) => {
    try {
      // Import airtableService
      const { airtableService } = await import('../../services/airtableService');
      
      // Create new customer using airtableService
      const googleUser = {
        email,
        name: email.split('@')[0], // Use email prefix as default name
      };
      
      return await airtableService.createCustomerFromGoogle(googleUser);
      
    } catch (error) {
      console.error('Failed to create new customer:', error);
      return null;
    }
  };

  // Handle Google credential response
  const handleCredentialResponse = useCallback(async (response) => {
    console.log('GoogleSignIn: Handling credential response...');
    setIsLoading(true);

    try {
      // Validate token with Netlify function
      const validationResponse = await fetch('/.netlify/functions/google-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: response.credential,
        }),
      });

      const validationData = await validationResponse.json();

      if (!validationData.success) {
        throw new Error(validationData.error || 'Token validation failed');
      }

      const { user } = validationData;

      // Look up customer in Airtable by email
      const customerData = await lookupCustomerByEmail(user.email);

      // Create session data
      const sessionData = {
        user,
        customerData,
        isAuthenticated: true,
        authMethod: 'google',
        loginTime: new Date().toISOString(),
        token: response.credential, // Store Google JWT for API calls
      };

      // Store in session storage
      sessionStorage.setItem('authSession', JSON.stringify(sessionData));

      // Notify parent component
      if (onSignInSuccess) {
        onSignInSuccess(sessionData);
      }

    } catch (error) {
      console.error('Sign-in error:', error);
      if (onSignInError) {
        onSignInError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [onSignInSuccess, onSignInError]);

  // Load Google Identity Services
  useEffect(() => {
    console.log('GoogleSignIn: Loading Google Services...');
    console.log('GoogleSignIn: Client ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);
    
    const loadGoogleScript = () => {
      if (window.google?.accounts) {
        console.log('GoogleSignIn: Google already loaded, initializing...');
        initializeGoogle();
        return;
      }

      console.log('GoogleSignIn: Loading Google script...');
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      script.onerror = () => {
        console.error('GoogleSignIn: Failed to load Google script');
        if (onSignInError) {
          onSignInError('Failed to load Google Sign-In script');
        }
      };
      document.head.appendChild(script);
    };

    const initializeGoogle = () => {
      console.log('GoogleSignIn: Initializing Google Services...');
      if (!window.google?.accounts) {
        console.error('GoogleSignIn: Google Identity Services failed to load');
        return;
      }

      try {
        // Initialize Google Identity Services
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false, // Disable FedCM to avoid browser issues
        });

        // Render the Google button directly for better reliability
        const buttonContainer = document.getElementById('google-signin-button');
        if (buttonContainer) {
          console.log('GoogleSignIn: Rendering Google native button...');
          window.google.accounts.id.renderButton(buttonContainer, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            shape: 'rectangular',
            text: 'signin_with',
            logo_alignment: 'left',
            width: '100%'
          });
        }

        console.log('GoogleSignIn: Google initialized successfully');
        setGoogleLoaded(true);
      } catch (error) {
        console.error('GoogleSignIn: Failed to initialize Google Sign-In:', error);
        if (onSignInError) {
          onSignInError('Failed to initialize Google Sign-In');
        }
      }
    };

    loadGoogleScript();
  }, [handleCredentialResponse, onSignInError]);

  // Trigger Google Sign-In popup
  const handleSignIn = () => {
    console.log('=== GOOGLE SIGN-IN DEBUG ===');
    console.log('GoogleSignIn: Sign-in button clicked');
    console.log('GoogleSignIn: Google loaded:', googleLoaded);
    console.log('GoogleSignIn: Google available:', !!window.google?.accounts);
    console.log('GoogleSignIn: Client ID from env:', process.env.REACT_APP_GOOGLE_CLIENT_ID);
    console.log('GoogleSignIn: Window.google object:', window.google);
    
    if (!googleLoaded) {
      console.error('GoogleSignIn: Google not loaded yet');
      alert('Google Sign-In is still loading. Please wait a moment and try again.');
      return;
    }

    if (!window.google?.accounts) {
      console.error('GoogleSignIn: Google accounts API not available');
      alert('Google Sign-In service is not available. Please refresh the page.');
      if (onSignInError) {
        onSignInError('Google Sign-In not ready. Please refresh the page.');
      }
      return;
    }

    try {
      console.log('GoogleSignIn: Attempting to show prompt...');
      
      // Try the renderButton approach as backup
      const buttonContainer = document.getElementById('google-signin-button');
      if (buttonContainer) {
        console.log('GoogleSignIn: Rendering Google button...');
        window.google.accounts.id.renderButton(buttonContainer, {
          theme: 'outline',
          size: 'large',
          width: '100%'
        });
      }
      
      // Also try the prompt approach
      window.google.accounts.id.prompt((notification) => {
        console.log('GoogleSignIn: Prompt notification:', notification);
        console.log('GoogleSignIn: Notification type:', {
          isDisplayed: notification.isDisplayed?.(),
          isNotDisplayed: notification.isNotDisplayed?.(),
          isSkippedMoment: notification.isSkippedMoment?.(),
          isDismissedMoment: notification.isDismissedMoment?.(),
          getMomentType: notification.getMomentType?.()
        });
        
        if (notification.isNotDisplayed?.() || notification.isSkippedMoment?.()) {
          console.log('GoogleSignIn: Popup was not displayed or skipped - trying alternative approach');
          // Fallback: try to manually trigger sign-in
          if (window.google?.accounts?.oauth2) {
            console.log('GoogleSignIn: Trying OAuth2 flow...');
            const client = window.google.accounts.oauth2.initTokenClient({
              client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
              scope: 'email profile',
              callback: (response) => {
                console.log('GoogleSignIn: OAuth2 response:', response);
              }
            });
            client.requestAccessToken();
          }
        }
      });
    } catch (error) {
      console.error('GoogleSignIn: Failed to show Google Sign-In:', error);
      alert(`Google Sign-In error: ${error.message}`);
      if (onSignInError) {
        onSignInError('Failed to show Google Sign-In popup');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Debug Info */}
      <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
        <div>Client ID: {process.env.REACT_APP_GOOGLE_CLIENT_ID ? 'Configured' : 'Missing'}</div>
        <div>Google Loaded: {googleLoaded ? 'Yes' : 'No'}</div>
        <div>Google Available: {window.google?.accounts ? 'Yes' : 'No'}</div>
      </div>

      {/* Test Environment Button */}
      <button
        onClick={() => {
          console.log('=== ENVIRONMENT TEST ===');
          console.log('REACT_APP_GOOGLE_CLIENT_ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);
          console.log('All env vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP')));
          alert(`Client ID: ${process.env.REACT_APP_GOOGLE_CLIENT_ID || 'NOT FOUND'}`);
        }}
        className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm"
      >
        Test Environment Variables
      </button>

      <button
        onClick={handleSignIn}
        disabled={!googleLoaded || isLoading}
        className="w-full bg-white text-gray-700 border border-gray-300 rounded-lg px-6 py-3 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </>
        )}
      </button>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="w-4 h-4 text-green-500" />
          <span>Secure OAuth 2.0 authentication</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Check className="w-4 h-4 text-green-500" />
          <span>Links to your existing customer profile</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Check className="w-4 h-4 text-green-500" />
          <span>No passwords to remember</span>
        </div>
      </div>

      {/* Alternative Google Button Container */}
      <div id="google-signin-button" className="w-full"></div>

      <div className="text-xs text-gray-500 text-center border-t pt-3 mt-4">
        <p>For sales demos, admin access is still available via direct URL</p>
      </div>
    </div>
  );
};

export default GoogleSignIn;