// SupabaseAuth.jsx - Unified authentication component with email and Google
import React, { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

const SupabaseAuth = ({ redirectTo = '/customer/SUPABASE_USER/simplified/dashboard?token=supabase-auth' }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) {
        // User is already logged in, redirect
        navigate(redirectTo);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        // User just logged in, redirect
        navigate(redirectTo);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to H&S Platform
          </h1>
          <p className="text-gray-400">
            Sign in to access your revenue intelligence tools
          </p>
        </div>

        {/* Auth UI Component */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#3b82f6',
                    brandAccent: '#2563eb',
                    brandButtonText: 'white',
                    defaultButtonBackground: '#1f2937',
                    defaultButtonBackgroundHover: '#374151',
                    defaultButtonBorder: '#374151',
                    defaultButtonText: 'white',
                    dividerBackground: '#374151',
                    inputBackground: '#111827',
                    inputBorder: '#374151',
                    inputBorderHover: '#4b5563',
                    inputBorderFocus: '#3b82f6',
                    inputText: 'white',
                    inputLabelText: '#9ca3af',
                    inputPlaceholder: '#6b7280',
                    messageText: '#ef4444',
                    messageBackground: '#fef2f2',
                    messageBorder: '#fecaca',
                    anchorTextColor: '#3b82f6',
                    anchorTextHoverColor: '#2563eb',
                  },
                  space: {
                    spaceSmall: '0.5rem',
                    spaceMedium: '1rem',
                    spaceLarge: '1.5rem',
                  },
                  fontSizes: {
                    baseBodySize: '14px',
                    baseInputSize: '14px',
                    baseLabelSize: '12px',
                    baseButtonSize: '14px',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '0.5rem',
                    buttonBorderRadius: '0.5rem',
                    inputBorderRadius: '0.5rem',
                  },
                },
              },
              className: {
                container: 'supabase-auth-container',
                button: 'supabase-auth-button',
                input: 'supabase-auth-input',
              },
            }}
            providers={['google']}
            redirectTo={`${window.location.origin}/customer/SUPABASE_USER/simplified/dashboard?token=supabase-auth`}
            onlyThirdPartyProviders={false}
            view="sign_in"
            showLinks={true}
            magicLink={false}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Password',
                  email_input_placeholder: 'Your email address',
                  password_input_placeholder: 'Your password',
                  button_label: 'Sign in',
                  loading_button_label: 'Signing in...',
                  social_provider_text: 'Sign in with {{provider}}',
                  link_text: "Don't have an account? Sign up",
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Password',
                  email_input_placeholder: 'Your email address',
                  password_input_placeholder: 'Create a password',
                  button_label: 'Sign up',
                  loading_button_label: 'Creating account...',
                  social_provider_text: 'Sign up with {{provider}}',
                  link_text: 'Already have an account? Sign in',
                  confirmation_text: 'Check your email for the confirmation link',
                },
                magic_link: {
                  email_label: 'Email',
                  email_input_placeholder: 'Your email address',
                  button_label: 'Send magic link',
                  loading_button_label: 'Sending magic link...',
                  link_text: 'Sign in with password instead',
                  confirmation_text: 'Check your email for the magic link',
                },
                forgotten_password: {
                  email_label: 'Email',
                  email_input_placeholder: 'Your email address',
                  button_label: 'Send reset instructions',
                  loading_button_label: 'Sending reset instructions...',
                  link_text: 'Back to sign in',
                  confirmation_text: 'Check your email for the password reset link',
                },
              },
            }}
          />
        </div>

        {/* Additional Options */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-blue-400 hover:text-blue-300">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-400 hover:text-blue-300">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Need help?{' '}
            <a href="/support" className="text-blue-400 hover:text-blue-300">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupabaseAuth;