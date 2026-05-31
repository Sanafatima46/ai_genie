import React, { useState, useEffect } from 'react';
import logo from '../assets/genie.png';

const FloatingGenie = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = window.scrollY / scrollHeight;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate horizontal position: Move from 5% to 85% of viewport width
  // Easing: Using a cubic-bezier-like approach for "realistic" motion
  const horizontalPos = 5 + (scrollProgress * 80);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(3deg); }
        }
        
        @keyframes magic-glow {
          0%, 100% { opacity: 0.5; filter: blur(20px) scale(1); }
          50% { opacity: 0.8; filter: blur(35px) scale(1.2); }
        }

        @keyframes particle-drift {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(var(--tw-x), var(--tw-y)) scale(0); opacity: 0; }
        }

        .genie-container {
          position: absolute;
          top: 30%;
          transition: left 1.5s cubic-bezier(0.25, 0.1, 0.25, 1);
          will-change: left;
        }

        .genie-float {
          animation: float 6s ease-in-out infinite;
        }

        .magic-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(168, 85, 247, 0) 70%);
          border-radius: 50%;
          animation: magic-glow 4s ease-in-out infinite;
          z-index: -1;
        }

        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 10px #6366f1, 0 0 20px #a855f7;
          pointer-events: none;
          animation: particle-drift 3s linear infinite;
        }
      `}</style>

      <div 
        className="genie-container w-32 h-32 md:w-48 md:h-48"
        style={{ left: `${horizontalPos}%` }}
      >
        <div className="genie-float relative w-full h-full">
          {/* Magic Glow */}
          <div className="magic-glow"></div>
          
          {/* Particles */}
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="particle"
              style={{
                '--tw-x': `${(Math.random() - 0.5) * 200}px`,
                '--tw-y': `${(Math.random() - 0.5) * 200}px`,
                left: '50%',
                top: '50%',
                animationDelay: `${i * 0.5}s`,
                opacity: 0
              }}
            ></div>
          ))}

          {/* Genie Logo */}
          <img 
            src={logo} 
            alt="Floating Genie" 
            className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.8))'
            }}
          />
          
          {/* Secondary smaller glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-purple-500/20 blur-xl rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default FloatingGenie;
