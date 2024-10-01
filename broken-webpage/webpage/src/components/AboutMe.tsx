import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

/**
 * AboutMe component: Renders a Star Wars-themed scrolling text about the user
 * 
 * This component creates a scrolling text effect similar to the opening crawl
 * in Star Wars movies. It displays information about the user in a cinematic style.
 */
const AboutMe: React.FC = () => {
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollHeight = containerRef.current?.scrollHeight || 0;
    const viewportHeight = window.innerHeight;

    controls.start({
      y: [viewportHeight, -scrollHeight],
      transition: {
        duration: 60,
        ease: 'linear',
      },
    });
  }, [controls]);

  return (
    <div className="bg-black text-yellow-300 h-screen overflow-hidden perspective-1000 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10"></div>
      <motion.div
        ref={containerRef}
        className="text-center transform-style-3d rotate-x-20 absolute w-full"
        animate={controls}
        style={{ 
          transformStyle: 'preserve-3d',
          transform: 'rotateX(20deg)',
          top: '100%',  // Start the text below the viewport
        }}
      >
        <h2 className="text-4xl font-bold mb-8">A long time ago in a galaxy far, far away...</h2>
        <h1 className="text-6xl font-bold mb-12">RISHAB SINGH</h1>
        <div className="text-2xl max-w-3xl mx-auto space-y-8">
          <p>
            Episode IV: A NEW DEVELOPER
          </p>
          <p>
            It is a period of technological revolution. Rebel developers, striking from hidden
            keyboards, have won their first victories against the evil Galactic Empire of legacy code.
          </p>
          <p>
            During the battle, Rebel spies managed to steal secret plans to the Empire's ultimate weapon,
            CLEAN CODE, an armored paradigm with enough power to refactor an entire codebase.
          </p>
          <p>
            Pursued by the Empire's sinister agents, Rishab Singh races home aboard his starship,
            custodian of the stolen plans that can save his people and restore freedom to the galaxy....
          </p>
          <p>
            Armed with a diverse skill set including React, TypeScript, and Node.js, Rishab embarks on
            a journey to create innovative web applications and contribute to open-source projects.
          </p>
          <p>
            His mission: To explore strange new technologies, to seek out new frameworks and new
            methodologies, to boldly code where no developer has coded before!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutMe;
