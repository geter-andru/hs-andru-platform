/**
 * Dashboard Access Control Component
 * 
 * Restricts dashboard access to admin users only during UX improvements.
 * Provides user-friendly messaging for non-admin users.
 */

import React from 'react';
import { motion } from 'motion/react';
import { Lock, Settings, Users, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import AdminModeIndicator from '../admin/AdminModeIndicator';

const DashboardAccessControl = ({ children, customerData }) => {
  const session = authService.getCurrentSession();
  const isAdmin = session?.isAdmin || session?.adminAccess || customerData?.isAdmin || customerData?.adminAccess;

  // Allow admin users full access
  if (isAdmin) {
    return (
      <>
        <AdminModeIndicator />
        {children}
      </>
    );
  }

  // Block non-admin users with informative message
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <motion.div
        className="max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Main Access Denied Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
          {/* Lock Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Lock className="w-8 h-8 text-orange-400" />
          </motion.div>

          {/* Main Message */}
          <motion.h1
            className="text-2xl font-bold text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Dashboard Temporarily Unavailable
          </motion.h1>

          <motion.p
            className="text-gray-300 mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            We're enhancing the dashboard experience with improved UX and new features. 
            Access is temporarily restricted while we perfect the interface for technical founders like you.
          </motion.p>

          {/* What's Coming Section */}
          <motion.div
            className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <div className="flex items-center justify-center mb-4">
              <Settings className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-blue-400 font-semibold">What's Being Improved</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-gray-300">
                <div className="font-medium text-white mb-1">Enhanced Navigation</div>
                <div>Streamlined tool access and workflow optimization</div>
              </div>
              <div className="text-gray-300">
                <div className="font-medium text-white mb-1">Improved Analytics</div>
                <div>Better revenue intelligence insights and tracking</div>
              </div>
              <div className="text-gray-300">
                <div className="font-medium text-white mb-1">Mobile Experience</div>
                <div>Optimized interface for busy technical founders</div>
              </div>
            </div>
          </motion.div>

          {/* Access Information */}
          <motion.div
            className="bg-gray-700/50 border border-gray-600 rounded-xl p-6 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <div className="flex items-center justify-center mb-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-yellow-400 font-semibold">Current Access Status</span>
            </div>
            <p className="text-gray-300 text-sm">
              <strong className="text-white">Customer ID:</strong> {customerData?.customerId || session?.customerId || 'Unknown'}<br />
              <strong className="text-white">Access Level:</strong> Standard User (Dashboard access restricted)<br />
              <strong className="text-white">Admin Access:</strong> Required for dashboard during improvements
            </p>
          </motion.div>

          {/* Available Actions */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <div className="text-gray-400 text-sm mb-4">
              While dashboard access is restricted, these options remain available:
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => window.location.href = '/customer/' + (customerData?.customerId || session?.customerId) + '/icp'}
                className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Users className="w-4 h-4 mr-2" />
                ICP Analysis Tool
              </button>
              
              <button
                onClick={() => window.location.href = '/customer/' + (customerData?.customerId || session?.customerId) + '/cost-calculator'}
                className="flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Settings className="w-4 h-4 mr-2" />
                Cost Calculator
              </button>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-xs">
                Updates will be available soon. Thank you for your patience as we enhance your revenue intelligence platform.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardAccessControl;