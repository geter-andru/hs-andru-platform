import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, Brain, Zap, Coffee, Rocket } from 'lucide-react';
import webhookService from '../../../services/webhookService';

/**
 * Loading screen with witty progress updates for Core Resources generation
 * Total duration: 5 minutes with staged messages
 */

const CoreResourcesLoadingScreen = ({ sessionId, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');
  const [subMessage, setSubMessage] = useState('');
  const [currentIcon, setCurrentIcon] = useState(null);

  // Witty progress messages with timing (300 seconds total - 5 minutes)
  const progressStages = [
    { 
      time: 0, 
      progress: 0, 
      message: "Initializing AI engines...", 
      subMessage: "Warming up the neural networks ⚡",
      icon: Zap 
    },
    { 
      time: 25, 
      progress: 8, 
      message: "Analyzing your product DNA...", 
      subMessage: "Discovering what makes your solution unique 🧬",
      icon: Brain 
    },
    { 
      time: 50, 
      progress: 16, 
      message: "Researching market intelligence...", 
      subMessage: "Scanning 1,000+ data points across the web 🌐",
      icon: Sparkles 
    },
    { 
      time: 75, 
      progress: 25, 
      message: "Crafting your Ideal Customer Profile...", 
      subMessage: "Finding your perfect match in the market 💝",
      icon: Brain 
    },
    { 
      time: 100, 
      progress: 33, 
      message: "Building buyer personas...", 
      subMessage: "Getting inside your customers' minds 🧠",
      icon: Coffee 
    },
    { 
      time: 125, 
      progress: 42, 
      message: "Brewing a strong cup of insights...", 
      subMessage: "Extra shot of competitive intelligence ☕",
      icon: Coffee 
    },
    { 
      time: 150, 
      progress: 50, 
      message: "Mapping customer emotions...", 
      subMessage: "Understanding their hopes, dreams, and fears 💭",
      icon: Brain 
    },
    { 
      time: 175, 
      progress: 58, 
      message: "Calculating market potential...", 
      subMessage: "Crunching numbers like a Wall Street quant 📊",
      icon: Zap 
    },
    { 
      time: 200, 
      progress: 67, 
      message: "Cross-referencing with industry benchmarks...", 
      subMessage: "Making sure you're ahead of the curve 📈",
      icon: Sparkles 
    },
    { 
      time: 225, 
      progress: 75, 
      message: "Applying secret sauce algorithms...", 
      subMessage: "This is where the magic happens ✨",
      icon: Rocket 
    },
    { 
      time: 250, 
      progress: 83, 
      message: "Quality checking with our AI council...", 
      subMessage: "Four AI models walk into a bar... 🤖",
      icon: Brain 
    },
    { 
      time: 275, 
      progress: 92, 
      message: "Polishing your Core Resources...", 
      subMessage: "Making them shine like diamonds 💎",
      icon: Sparkles 
    },
    { 
      time: 295, 
      progress: 98, 
      message: "Finalizing your strategic intelligence...", 
      subMessage: "Almost there... preparing for liftoff! 🚀",
      icon: Rocket 
    },
    { 
      time: 300, 
      progress: 100, 
      message: "Core Resources generated successfully!", 
      subMessage: "Your competitive advantage awaits ✅",
      icon: Sparkles 
    }
  ];

  useEffect(() => {
    const startTime = Date.now();
    let completed = false;
    
    const updateProgress = async () => {
      // Check if resources are ready early
      if (!completed && sessionId) {
        try {
          const resources = await webhookService.getResources(sessionId);
          if (resources && Object.keys(resources).length > 0) {
            console.log('🎉 Resources ready early!', resources);
            completed = true;
            setProgress(100);
            setCurrentMessage("Core Resources generated successfully!");
            setSubMessage("Your competitive advantage awaits ✅");
            setCurrentIcon(Sparkles);
            
            if (onComplete) {
              setTimeout(() => {
                onComplete();
              }, 1000); // Small delay for visual effect
            }
            return false; // Stop the interval
          }
        } catch (error) {
          console.log('Checking for resources...', error.message);
        }
      }
      
      const elapsed = (Date.now() - startTime) / 1000; // Convert to seconds
      
      // Find the appropriate stage based on elapsed time
      let currentStage = progressStages[0];
      for (const stage of progressStages) {
        if (elapsed >= stage.time) {
          currentStage = stage;
        }
      }
      
      // Interpolate progress between stages for smooth animation
      const nextStageIndex = progressStages.findIndex(s => s.time > elapsed);
      if (nextStageIndex > 0 && nextStageIndex < progressStages.length) {
        const prevStage = progressStages[nextStageIndex - 1];
        const nextStage = progressStages[nextStageIndex];
        const stageProgress = (elapsed - prevStage.time) / (nextStage.time - prevStage.time);
        const interpolatedProgress = prevStage.progress + 
          (nextStage.progress - prevStage.progress) * stageProgress;
        setProgress(Math.min(interpolatedProgress, 100));
      } else {
        setProgress(currentStage.progress);
      }
      
      setCurrentMessage(currentStage.message);
      setSubMessage(currentStage.subMessage);
      setCurrentIcon(currentStage.icon);
      
      // Complete after 4 minutes (allowing for Make.com 3-minute processing + buffer)
      if (elapsed >= 240) {
        console.log('⏰ Loading screen timeout after 4 minutes - using fallback resources');
        if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, 500); // Small delay for visual effect
        }
        return false; // Stop the interval
      }
      
      return true; // Continue the interval
    };
    
    // Initial update
    updateProgress();
    
    // Update every 3 seconds for resource checking + 1 second for progress animation
    const interval = setInterval(async () => {
      const shouldContinue = await updateProgress();
      if (!shouldContinue) {
        clearInterval(interval);
      }
    }, 3000); // Reduced polling frequency to be less aggressive on webhook endpoints
    
    return () => clearInterval(interval);
  }, [sessionId, onComplete]);

  const IconComponent = currentIcon || Loader2;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <IconComponent className={`w-10 h-10 text-white ${currentIcon === Loader2 ? 'animate-spin' : 'animate-pulse'}`} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Generating Core Resources</h2>
          <p className="text-gray-400">Leveraging AI to create strategic sales intelligence</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Progress</span>
            <span className="text-blue-400 font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Status Messages */}
        <div className="text-center space-y-2 mb-6">
          <p className="text-white font-medium text-lg">{currentMessage}</p>
          <p className="text-gray-400 text-sm">{subMessage}</p>
        </div>

        {/* Resource Preview Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`bg-gray-800 rounded-lg p-3 border transition-all duration-300 ${
            progress >= 25 ? 'border-green-500/50 opacity-100' : 'border-gray-700 opacity-50'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${progress >= 25 ? 'bg-green-400' : 'bg-gray-600'}`} />
              <span className="text-sm font-medium text-gray-300">ICP Analysis</span>
            </div>
            <p className="text-xs text-gray-500">
              {progress >= 25 ? 'Generated ✓' : 'Pending...'}
            </p>
          </div>

          <div className={`bg-gray-800 rounded-lg p-3 border transition-all duration-300 ${
            progress >= 50 ? 'border-green-500/50 opacity-100' : 'border-gray-700 opacity-50'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${progress >= 50 ? 'bg-green-400' : 'bg-gray-600'}`} />
              <span className="text-sm font-medium text-gray-300">Buyer Personas</span>
            </div>
            <p className="text-xs text-gray-500">
              {progress >= 50 ? 'Generated ✓' : 'Pending...'}
            </p>
          </div>

          <div className={`bg-gray-800 rounded-lg p-3 border transition-all duration-300 ${
            progress >= 75 ? 'border-green-500/50 opacity-100' : 'border-gray-700 opacity-50'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${progress >= 75 ? 'bg-green-400' : 'bg-gray-600'}`} />
              <span className="text-sm font-medium text-gray-300">Empathy Map</span>
            </div>
            <p className="text-xs text-gray-500">
              {progress >= 75 ? 'Generated ✓' : 'Pending...'}
            </p>
          </div>

          <div className={`bg-gray-800 rounded-lg p-3 border transition-all duration-300 ${
            progress >= 90 ? 'border-green-500/50 opacity-100' : 'border-gray-700 opacity-50'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${progress >= 90 ? 'bg-green-400' : 'bg-gray-600'}`} />
              <span className="text-sm font-medium text-gray-300">Market Assessment</span>
            </div>
            <p className="text-xs text-gray-500">
              {progress >= 90 ? 'Generated ✓' : 'Pending...'}
            </p>
          </div>
        </div>

        {/* Fun fact footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            💡 Fun fact: Our AI is analyzing {Math.floor(progress * 10)} market signals right now
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoreResourcesLoadingScreen;