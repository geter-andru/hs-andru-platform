import React from 'react';
import { Shield, Check } from 'lucide-react';

const GoogleSignInRedirect = ({ onSignInSuccess, onSignInError }) => {
  
  const handleRedirectSignIn = () => {
    console.log('GoogleSignIn: Using redirect method...');
    
    // Google OAuth 2.0 redirect URL - using the correct endpoint
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = window.location.origin; // This will be http://localhost:3000
    const scope = 'email profile openid';
    const responseType = 'code';
    const state = Math.random().toString(36).substring(7); // Simple state for security
    
    // Store state for verification when user returns
    sessionStorage.setItem('googleOAuthState', state);
    
    // Use the correct Google OAuth 2.0 authorization endpoint
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=${responseType}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${state}&` +
      `access_type=offline&` +
      `prompt=consent`;
    
    console.log('GoogleSignIn: Redirecting to:', googleAuthUrl);
    console.log('GoogleSignIn: Client ID:', clientId);
    console.log('GoogleSignIn: Redirect URI:', redirectUri);
    
    // Redirect to Google
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="space-y-4">
      {/* Debug Info */}
      <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
        <div>Client ID: {process.env.REACT_APP_GOOGLE_CLIENT_ID ? 'Configured' : 'Missing'}</div>
        <div>Redirect URI: {window.location.origin}</div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
        <strong>OAuth Configuration Required:</strong>
        <br />
        Add <code>{window.location.origin}</code> to your Google OAuth "Authorized JavaScript origins" and "Authorized redirect URIs"
      </div>

      <button
        onClick={handleRedirectSignIn}
        className="w-full bg-white text-gray-700 border border-gray-300 rounded-lg px-6 py-3 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-center gap-3"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>Continue with Google (Redirect Method)</span>
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

      <div className="text-xs text-gray-500 text-center border-t pt-3 mt-4">
        <p>For sales demos, admin access is still available via direct URL</p>
      </div>
    </div>
  );
};

export default GoogleSignInRedirect;