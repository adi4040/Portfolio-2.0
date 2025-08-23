import React, { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';

const Research = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentScene, setCurrentScene] = useState('/scene.splinecode');
  const [retryCount, setRetryCount] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const scenes = [
    '/aibrain.splinecode', // Local file
    'https://prod.spline.design/ir9kbJM-dAchwBAK/scene.splinecode' // Remote URL as fallback
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLoad = () => {
    console.log('Spline scene loaded successfully from:', currentScene);
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = (error) => {
    console.error('Spline scene failed to load from:', currentScene, error);
    
    if (retryCount < scenes.length - 1) {
      // Try the next scene
      const nextScene = scenes[retryCount + 1];
      console.log('Retrying with scene:', nextScene);
      setCurrentScene(nextScene);
      setRetryCount(retryCount + 1);
      setIsLoading(true);
      setHasError(false);
    } else {
      // All scenes failed
      setHasError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reset when component mounts
    setCurrentScene(scenes[0]);
    setRetryCount(0);
    setIsLoading(true);
    setHasError(false);
  }, [scenes]);

  const handleCardHover = (cardIndex) => {
    if (!isMobile) {
      setHoveredCard(cardIndex);
    }
  };

  const handleCardLeave = () => {
    if (!isMobile) {
      setHoveredCard(null);
    }
  };

  const getCardStyle = (cardIndex) => {
    if (isMobile) {
      // On mobile, always show glassmorphism effect
      return {
        background: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      };
    } else {
      // On desktop, show glassmorphism only on hover
      return {
        background: hoveredCard === cardIndex ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        backgroundColor: hoveredCard === cardIndex ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        backdropFilter: hoveredCard === cardIndex ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: hoveredCard === cardIndex ? 'blur(10px)' : 'none',
        border: hoveredCard === cardIndex ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent'
      };
    }
  };

  return (
    <section id="research" className="section-content py-20 animate-on-scroll slide-up relative overflow-hidden">
      {/* Spline Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'transparent',
          backgroundColor: 'transparent'
        }}
      >
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-30 z-10">
            <div className="text-center">
              <i className="fas fa-exclamation-triangle text-red-400 text-2xl mb-2"></i>
              <p className="text-red-400 font-semibold text-sm">3D Background Failed</p>
            </div>
          </div>
        )}
        
        <Spline
          scene={currentScene}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            opacity: 0.9, // Increased opacity for better visibility
            filter: 'blur(0.5px)', // Reduced blur for sharper appearance
            pointerEvents: 'none', // Disable mouse interactions
            transform: 'scale(1.5) translateX(-30%)', // Centered the model
            background: 'transparent',
            backgroundColor: 'transparent'
          }}
        />
      </div>

      {/* Research Content */}
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="section-title text-3xl font-bold mb-12 font-display">
          Research Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            className="glassmorphism-card p-8 transition-all duration-300 ease-in-out"
            style={getCardStyle(0)}
            onMouseEnter={() => handleCardHover(0)}
            onMouseLeave={handleCardLeave}
          >
            <div className="research-item">
              <i className="fas fa-microchip text-green-400 text-3xl mb-4"></i>
              <h3 className="text-xl font-bold text-slate-200 mb-2">
                Brainwave-based Biometric Authentication Research
              </h3>
              <p className="text-slate-400 text-sm mb-2">Under-Research</p>
              <p className="text-slate-300">
                Research on how single-channel electrodes (FP1 and FP2)
                could contribute to the biometric authentication using
                differential signals
              </p>
              <div className="mt-4">
                <span className="text-yellow-400">
                  <i className="fas fa-hourglass-half mr-2"></i>In Progress
                </span>
              </div>
            </div>
          </div>

          <div 
            className="glassmorphism-card p-8 transition-all duration-300 ease-in-out"
            style={getCardStyle(1)}
            onMouseEnter={() => handleCardHover(1)}
            onMouseLeave={handleCardLeave}
          >
            <div className="research-item">
              <i className="fa-solid fa-leaf text-green-400 text-3xl mb-4"></i>
              <h3 className="text-xl font-bold text-slate-200 mb-2">
                EcoConnect- A passive income opportunity for electric
                vehicle owners
              </h3>
              <p className="text-slate-400 text-sm mb-2">
                Researched for EVA2Z Electric
              </p>
              <p className="text-slate-300">
                Researching the feasibility of implementation of EcoConnect
                in the actual environment, user pain points, tech stack
                reviews,etc.
              </p>
              <div className="mt-4">
                <span className="text-green-400">
                  <i className="fas fa-check-circle mr-2"></i>Completed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Research;
