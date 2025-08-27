import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function WelcomePage() {
  const [welcomeData, setWelcomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadWelcomeData = async () => {
      try {
        // Get session ID from URL or sessionStorage
        const sessionId = searchParams.get('sessionId') || sessionStorage.getItem('assessmentSessionId');
        
        if (!sessionId) {
          console.error('No session ID found for welcome page');
          setLoading(false);
          return;
        }

        // Fetch complete assessment + customer data
        const response = await fetch(`${window.location.origin}/api/welcome/${sessionId}`);
        
        if (response.ok) {
          const data = await response.json();
          setWelcomeData(data);
        } else {
          console.error('Failed to load welcome data');
        }
        
      } catch (error) {
        console.error('Welcome data loading error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWelcomeData();
  }, [searchParams]);

  const handleAccessPlatform = () => {
    if (welcomeData?.accessToken) {
      // Redirect to platform with access token
      window.location.href = `/customer/${welcomeData.sessionId}?token=${welcomeData.accessToken}`;
    } else {
      alert('Access token not found. Please contact support.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-pulse text-gray-400 text-lg">
            Preparing your personalized revenue intelligence...
          </div>
        </motion.div>
      </div>
    );
  }

  if (!welcomeData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-red-400 mb-4">Welcome Data Not Found</h1>
          <p className="text-gray-400 mb-6">Your assessment session may have expired.</p>
          <button 
            onClick={() => window.location.href = 'https://assessment.andru-ai.com/'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-black to-gray-900 border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          {/* Achievement Badge */}
          <motion.div 
            className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg ${
              welcomeData.qualification === 'Qualified' ? 'bg-gradient-to-r from-green-500 to-green-600 text-black' :
              welcomeData.qualification === 'Promising' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
              'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black'
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="mr-2">🎯</span>
            Assessment Complete - {welcomeData.qualification} Level
          </motion.div>
          
          {/* Welcome Headline */}
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 text-white leading-tight tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Welcome, {welcomeData.company ? `${welcomeData.company} Leader` : 'Strategic Leader'}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-400 mb-10 font-light max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Your personalized revenue intelligence tools are ready
          </motion.p>
        </div>
      </section>

      {/* Current State → Promised Land */}
      <section className="relative bg-gradient-to-b from-gray-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {/* Current State */}
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-red-400">Current State</h2>
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 mb-4">
                <p className="text-gray-300 text-lg leading-relaxed">
                  <strong className="text-red-400">Challenge:</strong> {welcomeData.topChallenge}
                </p>
                <div className="mt-4 text-sm text-gray-400">
                  Score: {welcomeData.overallScore}% Revenue Readiness
                </div>
              </div>
              
              {welcomeData.icpContent && (
                <div className="bg-gray-800/50 rounded-lg p-4 text-left">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Current Customer Understanding:</h4>
                  <p className="text-gray-300 text-sm">
                    {typeof welcomeData.icpContent === 'string' 
                      ? welcomeData.icpContent.substring(0, 150) + '...'
                      : 'Basic customer profile identified'}
                  </p>
                </div>
              )}
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-4xl text-cyan-400"
              >
                →
              </motion.div>
            </div>

            {/* Promised Land */}
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-green-400">Promised Land</h2>
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 mb-4">
                <p className="text-gray-300 text-lg leading-relaxed">
                  <strong className="text-green-400">Solution:</strong> Systematic revenue intelligence with 3 personalized tools
                </p>
                <div className="mt-4 text-sm text-gray-400">
                  Target: 80%+ Revenue Readiness
                </div>
              </div>
              
              {welcomeData.tbpContent && (
                <div className="bg-gray-800/50 rounded-lg p-4 text-left">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Enhanced Buyer Understanding:</h4>
                  <p className="text-gray-300 text-sm">
                    {typeof welcomeData.tbpContent === 'string' 
                      ? welcomeData.tbpContent.substring(0, 150) + '...'
                      : 'Comprehensive buyer persona framework ready'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Platform Access CTA */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
          >
            <button
              onClick={handleAccessPlatform}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-black px-12 py-6 rounded-xl text-lg font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:transform hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/25 relative overflow-hidden group"
            >
              <span className="relative z-10">Access Your Revenue Intelligence Platform</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            </button>
            
            <p className="text-gray-400 text-sm mt-4">
              Your tools: ICP Analysis • Cost Calculator • Business Case Builder
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}