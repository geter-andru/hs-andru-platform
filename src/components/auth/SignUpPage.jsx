import React, { useState } from 'react';
import { Rocket, ArrowRight } from 'lucide-react';
import GoogleSignIn from './GoogleSignIn';
import GoogleSignInRedirect from './GoogleSignInRedirect';

const SignUpPage = ({ onSignInSuccess, onSignInError }) => {
  const [showSignIn, setShowSignIn] = useState(false);

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

          {!showSignIn && (
            <button
              onClick={() => setShowSignIn(true)}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-xl"
            >
              <span>Start Your Revenue Assessment</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {showSignIn && (
          <div className="max-w-md mx-auto mt-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                Access Your Revenue Intelligence Platform
              </h3>
              <p className="text-gray-400 text-sm">
                Sign in with Google to continue your assessment and unlock personalized insights
              </p>
            </div>
            
            {/* Use redirect method temporarily to avoid OAuth config issues */}
            <GoogleSignInRedirect 
              onSignInSuccess={onSignInSuccess}
              onSignInError={onSignInError}
            />
            
            {/* Original method - uncomment after fixing Google Console config */}
            {/* 
            <GoogleSignIn 
              onSignInSuccess={onSignInSuccess}
              onSignInError={onSignInError}
            />
            */}
          </div>
        )}
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