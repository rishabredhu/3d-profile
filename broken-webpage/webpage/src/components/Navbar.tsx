import React, { useState } from 'react';
import { FaGithub as FaGithubIcon, FaLinkedin } from 'react-icons/fa';
import { FaTwitter as FaTwitterX } from 'react-icons/fa6';

/**
 * Navbar Component
 * 
 * This component renders a semi-transparent, interactive navigation bar
 * with social links, name, and designation. It includes Babylon.js
 * effects for a dynamic background with colorful particle separation.
 * The social icons have hover effects for better interactivity.
 * The background has a slight yellow tint for visual appeal.
 * The name, designation, and icons are now displayed in orange for better visibility.
 */
import { useEffect, useRef } from 'react';

import * as BABYLON from '@babylonjs/core';


import { socialLinks } from '../../config';
import { FaGithub as FaFileAlt, FaEnvelope } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const name = "Rishab Singh";
  const designation = "Full Stack Developer";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const engine = new BABYLON.Engine(canvasRef.current, true);
      const scene = new BABYLON.Scene(engine);

      const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene);
      camera.attachControl(canvasRef.current, true);

      const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

      // Colorful Particle System
      const particleSystem = new BABYLON.ParticleSystem("particles", 500, scene);
      particleSystem.particleTexture = new BABYLON.Texture("../assets/chemical.jpg", scene);
      particleSystem.emitter = new BABYLON.Vector3(0, 0, 0);
      particleSystem.minEmitBox = new BABYLON.Vector3(-5, -5, -5);
      particleSystem.maxEmitBox = new BABYLON.Vector3(5, 5, 5);
      
      // Colorful gradient with a slight yellow tint
      particleSystem.addColorGradient(0, new BABYLON.Color4(1, 0.9, 0.4, 1));    // Light yellow-orange
      particleSystem.addColorGradient(0.2, new BABYLON.Color4(1, 0.85, 0.3, 1)); // Medium-light yellow-orange
      particleSystem.addColorGradient(0.4, new BABYLON.Color4(1, 0.8, 0.2, 1));  // Medium yellow-orange
      particleSystem.addColorGradient(0.6, new BABYLON.Color4(1, 0.75, 0.1, 1)); // Medium-dark yellow-orange
      particleSystem.addColorGradient(0.8, new BABYLON.Color4(1, 0.7, 0, 1));    // Dark yellow-orange
      particleSystem.addColorGradient(1, new BABYLON.Color4(1, 0.65, 0, 1));     // Very dark yellow-orange

      particleSystem.minSize = 0.01;
      particleSystem.maxSize = 0.09;
      particleSystem.minLifeTime = 1;
      particleSystem.maxLifeTime = 5;
      particleSystem.emitRate = 1000;
      particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
      particleSystem.gravity = new BABYLON.Vector3(0, -0.1, 0);
      particleSystem.direction1 = new BABYLON.Vector3(-1, 1, -1);
      particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
      particleSystem.minAngularSpeed = 0;
      particleSystem.maxAngularSpeed = Math.PI;
      particleSystem.minEmitPower = 0.05;
      particleSystem.maxEmitPower = 0.22;
      particleSystem.updateSpeed = 0.01;

      // Particle separation effect
      particleSystem.addVelocityGradient(0, 1);
      particleSystem.addVelocityGradient(1, 0.1);

      particleSystem.start();

      engine.runRenderLoop(() => {
        scene.render();
      });

      window.addEventListener('resize', () => {
        engine.resize();
      });

      return () => {
        engine.dispose();
      };
    }
  }, []);

  // Define keyframes for the icon animation
  const iconKeyframes = `
    @keyframes iconFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
  `;

  // Enhanced icon style with animation
  const iconStyle = (iconName: string) => ({
    transition: 'all 0.3s ease',
    transform: hoveredIcon === iconName ? 'scale(1.2) rotate(10deg)' : 'scale(1) rotate(0deg)',
    filter: hoveredIcon === iconName ? 'drop-shadow(0 0 8px rgba(255,165,0,0.9))' : 'none',
    color: hoveredIcon === iconName ? '#FFA500' : '#FF8C00', // Brighter orange on hover
    animation: hoveredIcon === iconName ? 'iconFloat 1s ease-in-out infinite' : 'none',
  });

  // Create a mapping of icon names to components
  const iconComponents = {
    FaGithubIcon,
    FaLinkedin,
    FaTwitterX,
    FaFileAlt,
    FaEnvelope
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-yellow-50 to-orange-50 bg-opacity-90 backdrop-blur-sm z-50 shadow-lg">
      <style>{iconKeyframes}</style>
      <canvas ref={canvasRef} style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }} />
      <nav className="container mx-auto px-6 py-4 relative">
        <div className="flex justify-between items-center">
          <div className="text-orange-600">
            <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
            <p className="text-sm font-medium text-orange-500">{designation}</p>
          </div>
          <div className="flex space-x-6">
            {socialLinks.map((item) => {
              const IconComponent = iconComponents[item.icon as keyof typeof iconComponents];
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-300 transition-colors"
                  onMouseEnter={() => setHoveredIcon(item.name)}
                  onMouseLeave={() => setHoveredIcon(null)}
                >
                  <IconComponent size={28} style={iconStyle(item.name)} />
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;