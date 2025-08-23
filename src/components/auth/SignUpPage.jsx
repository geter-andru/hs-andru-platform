import React, { useState, useEffect } from 'react';
import { Rocket, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../../services/profileService';

const SignUpPage = ({ onSignInSuccess, onSignInError }) => {
  const navigate = useNavigate();
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    // Check if user has a stored email from previous waitlist signup
    const checkStoredWaitlistStatus = async () => {
      const storedEmail = localStorage.getItem('waitlist_email');
      if (storedEmail) {
        setCheckingStatus(true);
        try {
          const { status, isApproved } = await profileService.checkWaitlistStatus(storedEmail);
          if (isApproved) {
            // User is approved, redirect to login
            console.log('Waitlist approved user detected, redirecting to login');
            navigate('/login');
          } else {
            // User is on waitlist but not approved yet - show normal page
            console.log('User on waitlist but not yet approved');
          }
        } catch (error) {
          console.error('Error checking waitlist status:', error);
          // On error, show normal page (graceful fallback)
        } finally {
          setCheckingStatus(false);
        }
      } else {
        // No stored email means new user - they should see the normal page
        // which will redirect them to andru-ai.com for signup
        console.log('New user detected - showing landing page with andru-ai.com redirect');
      }
    };

    checkStoredWaitlistStatus();
  }, [navigate]);

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking access status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Rocket className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">H&S Revenue Intelligence</h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Turn Product Features Into
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Revenue Intelligence
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The AI-powered platform that transforms technical capabilities into compelling business cases, 
              qualified prospects, and closed deals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">35%</div>
              <div className="text-sm text-gray-400">Higher Close Rates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">40%</div>
              <div className="text-sm text-gray-400">Faster Sales Cycles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">$2.3M</div>
              <div className="text-sm text-gray-400">Avg Deal Increase</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://andru-ai.com"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-xl"
            >
              <span>Start Your Revenue Assessment</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            
            <div className="text-gray-400">or</div>
            
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 text-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 hover:text-white transition-all duration-200"
            >
              <span>Sign In</span>
            </button>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 H&S Revenue Intelligence Platform. Built for technical founders who demand results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;