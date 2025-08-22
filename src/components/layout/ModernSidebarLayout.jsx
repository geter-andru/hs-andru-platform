import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BarChart3, 
  Target, 
  Calculator, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import QuickActionsGrid from '../simplified/cards/QuickActionsGrid';
import MilestoneTrackerWidget from '../simplified/cards/MilestoneTrackerWidget';

/**
 * ModernSidebarLayout - Professional SaaS interface with fixed sidebar navigation
 * 
 * Features:
 * - Fixed 260px left sidebar with dark background (#1a1a1a)
 * - Main content area with fluid width and proper padding
 * - CSS Grid layout: grid-template-columns: 260px 1fr
 * - Persistent sidebar across all routes
 * - Modern header with 60px height
 * - Professional dark theme color scheme
 */

const ModernSidebarLayout = ({ children, customerId, activeRoute = 'dashboard' }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation items with modern iconography
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      route: '/customer/' + customerId + '/simplified/dashboard',
      description: 'Revenue Intelligence Overview',
      isPremium: true, // PRO icon moved here since dashboard has premium toggle
      iconColor: 'text-purple-400' // Colored icon
    },
    {
      id: 'icp',
      label: 'ICP Analysis',
      icon: Target,
      route: '/customer/' + customerId + '/simplified/icp',
      description: 'Ideal Customer Profiling',
      iconColor: 'text-blue-400' // Colored icon
    },
    {
      id: 'financial',
      label: 'Financial Impact',
      icon: Calculator,
      route: '/customer/' + customerId + '/simplified/financial',
      description: 'ROI & Cost Analysis',
      iconColor: 'text-gray-400' // Uncolored (locked feature)
    },
    {
      id: 'resources',
      label: 'Resource Library',
      icon: FileText,
      route: '/customer/' + customerId + '/simplified/resources',
      description: 'Templates & Documentation',
      iconColor: 'text-green-400' // Colored icon
    }
  ];

  const sidebarWidth = sidebarCollapsed ? '72px' : '260px';

  // Handle mobile responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(false); // Always show full sidebar on mobile (when open)
        setMobileMenuOpen(false); // Close mobile menu on resize
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-[#1a1a1a] border-b border-gray-800 flex items-center justify-between px-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">H&S Revenue</span>
          </div>

          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {customerId ? customerId.charAt(customerId.length - 1) : 'U'}
            </span>
          </div>
        </header>

        {/* Mobile Overlay Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {/* Mobile Sidebar */}
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-16 left-0 bottom-0 w-80 bg-[#1a1a1a] border-r border-gray-800 z-50 overflow-y-auto"
              >
                <nav className="p-4 space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeRoute === item.id;
                    
                    return (
                      <a
                        key={item.id}
                        href={item.route}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`
                          block px-4 py-3 rounded-lg transition-all duration-200
                          ${isActive 
                            ? 'bg-purple-600/20 border border-purple-500/30 text-purple-300' 
                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : item.iconColor || 'text-gray-400'}`} />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{item.label}</span>
                              {item.isPremium && (
                                <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-purple-500 to-blue-500 rounded text-white font-medium">
                                  PRO
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 mt-0.5">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Main Content */}
        <main className="p-4">
          {children}
        </main>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid min-h-screen" style={{
        gridTemplateColumns: `${sidebarWidth} 1fr`,
        transition: 'grid-template-columns 0.3s ease'
      }}>
        {/* Fixed Left Sidebar */}
        <motion.aside 
          className="bg-[#1a1a1a] border-r border-gray-800 flex flex-col"
          initial={{ width: sidebarCollapsed ? 72 : 260 }}
          animate={{ width: sidebarCollapsed ? 72 : 260 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
            {!sidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">H&S Revenue</div>
                  <div className="text-xs text-gray-400">Intelligence</div>
                </div>
              </motion.div>
            )}
            
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="py-4 space-y-4">
            {/* Dashboard - standalone */}
            {navigationItems.filter(item => item.id === 'dashboard').map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.id;
              
              return (
                <motion.a
                  key={item.id}
                  href={item.route}
                  className={`
                    mx-2 px-3 py-2.5 rounded-lg flex items-center space-x-3 transition-all duration-200
                    ${isActive 
                      ? 'bg-purple-600/20 border border-purple-500/30 text-purple-300' 
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }
                    ${sidebarCollapsed ? 'justify-center' : ''}
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : item.iconColor || 'text-gray-400'}`} />
                  
                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium truncate">{item.label}</span>
                        {item.isPremium && (
                          <span className="px-1.5 py-0.5 text-xs bg-gradient-to-r from-purple-500 to-blue-500 rounded text-white font-medium">
                            PRO
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  )}
                </motion.a>
              );
            })}
            
            {/* Customer Intelligence Tools section */}
            {!sidebarCollapsed && (
              <div className="px-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Customer Intelligence Tools
                </h3>
              </div>
            )}
            
            <div className={sidebarCollapsed ? '' : 'space-y-1'}>
              {navigationItems.filter(item => item.id !== 'dashboard').map((item) => {
                const Icon = item.icon;
                const isActive = activeRoute === item.id;
                
                return (
                  <motion.a
                    key={item.id}
                    href={item.route}
                    className={`
                      mx-2 px-3 py-2.5 rounded-lg flex items-center space-x-3 transition-all duration-200
                      ${isActive 
                        ? 'bg-purple-600/20 border border-purple-500/30 text-purple-300' 
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      }
                      ${sidebarCollapsed ? 'justify-center' : ''}
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : item.iconColor || 'text-gray-400'}`} />
                    
                    {!sidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium truncate">{item.label}</span>
                          {item.isPremium && (
                            <span className="px-1.5 py-0.5 text-xs bg-gradient-to-r from-purple-500 to-blue-500 rounded text-white font-medium">
                              PRO
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 truncate mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    )}
                  </motion.a>
                );
              })}
            </div>
          </nav>

          {/* Milestone Tracker Section - positioned right after navigation */}
          {!sidebarCollapsed && (
            <div className="px-4 pb-4 border-b border-gray-800">
              <div className="mb-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Progress Tracking
                </h3>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <MilestoneTrackerWidget />
              </div>
            </div>
          )}

          {/* Quick Actions Section - positioned right after milestone tracker */}
          {!sidebarCollapsed && (
            <div className="px-4 pb-4 border-b border-gray-800">
              <div className="mb-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Quick Actions
                </h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <QuickActionsGrid className="space-y-1" />
              </div>
            </div>
          )}

          {/* Flexible spacer to push footer to bottom */}
          <div className="flex-1"></div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-800">
            {!sidebarCollapsed ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">Customer {customerId}</div>
                  <div className="text-xs text-gray-400">Premium Access</div>
                </div>
                <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                  <Settings className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ) : (
              <button className="w-full p-2 rounded-lg hover:bg-gray-700 transition-colors flex justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div className="flex flex-col min-h-screen">
          {/* Clean Header - 60px height */}
          <header className="h-16 bg-[#1a1a1a] border-b border-gray-800 flex items-center justify-between px-6">
            {/* Search and Quick Actions */}
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search intelligence..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <Bell className="w-5 h-5 text-gray-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"></div>
              </button>
              
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {customerId ? customerId.charAt(customerId.length - 1) : 'U'}
                </span>
              </div>
            </div>
          </header>

          {/* Main Content with Fluid Width and Proper Padding */}
          <main className="flex-1 bg-[#0f0f0f] p-6">
            <div className="max-w-none mx-auto h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ModernSidebarLayout;