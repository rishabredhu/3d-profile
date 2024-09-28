import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Pixelation } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';
import { Vector3, Group } from 'three';
import AuroraBorealis from './AuroraBorealis';
import { FaComments } from 'react-icons/fa';
import Navbar from './NavBar';
import ChatbotComponent from './Chatbot';
import AuroraEffect from './AuroraParticle';
import AbstractFont from './theme1/AbstractFont';
import { Button, ScrollArea } from './ui/Elements';
import { Text3D } from '@react-three/drei';

// Rotating scene component
const RotatingScene = ({ children }: { children: React.ReactNode }) => {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(clock.getElapsedTime() * 0.1) * 0.2;
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

/**
 * Portfolio component
 */
export default function Portfolio() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className="fixed inset-0 bg-black text-white overflow-hidden font-sans">
        {/* Full-size Canvas */}
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
            <RotatingScene>
              <AuroraBorealis />
              <EffectComposer>
                <Bloom
                  kernelSize={KernelSize.LARGE}
                  luminanceThreshold={15}
                  luminanceSmoothing={0.05}
                  intensity={1.5}
                />
                <Pixelation granularity={0.5} />
                
              </EffectComposer>
              <AuroraEffect />
            </RotatingScene>
          </Canvas>
        </div>

        

        
        {/* Navbar moved to footer */}
        {/* <footer className="fixed bottom-0 left-0 right-0"> */}
          <Navbar />
        {/* </footer> */}


        {/* Render Chatbot when showChatbot is true */}
        {showChatbot && <ChatbotComponent onClose={toggleChatbot} />}

        {/* Chatbot Toggle Button */}
        <button
          onClick={toggleChatbot}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300"
          aria-label="Toggle Chatbot"
        >
          <FaComments size={24} />
        </button>
      </div>
    </ScrollArea>
  );
}
