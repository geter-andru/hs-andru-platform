// SupabaseAuthContext.jsx - Unified authentication context
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setError(error.message);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle specific auth events
      switch (event) {
        case 'SIGNED_IN':
          console.log('User signed in:', session.user.email);
          break;
        case 'SIGNED_OUT':
          console.log('User signed out');
          break;
        case 'USER_UPDATED':
          console.log('User updated:', session.user);
          break;
        case 'PASSWORD_RECOVERY':
          console.log('Password recovery initiated');
          break;
        default:
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign in with email and password
  const signInWithEmail = async (email, password) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Sign up with email and password
  const signUpWithEmail = async (email, password, metadata = {}) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata, // Additional user metadata
        },
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Update password
  const updatePassword = async (newPassword) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Check if user has a specific role or permission
  const hasRole = (role) => {
    return user?.app_metadata?.role === role;
  };

  // Get user metadata
  const getUserMetadata = () => {
    return {
      ...user?.user_metadata,
      email: user?.email,
      id: user?.id,
      role: user?.app_metadata?.role,
    };
  };

  const value = {
    user,
    session,
    loading,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    hasRole,
    getUserMetadata,
    isAuthenticated: !!session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;