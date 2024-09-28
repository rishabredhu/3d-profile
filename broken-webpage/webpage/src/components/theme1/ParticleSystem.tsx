import { useRef } from 'react';
import { Points } from 'three';
import { useFrame } from '@react-three/fiber';

import React, { useMemo } from 'react';

/**
 * ParticleSystem Component
 * 
 * This component creates a particle system using React and Three.js.
 * It generates a cloud of small, white particles that rotate slowly.
 * 
 * @component
 * @example
 * <ParticleSystem />
 */
const ParticleSystem: React.FC = () => {
  const particles = useRef<Points | null>(null); // Use Points | null for proper typing
  const count = 50000;

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    const { clock } = state;
    if (particles.current) {
      particles.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        attach="material"  // Ensure proper attachment for the material
        size={0.02} 
        color="#ffffff" 
        transparent 
        opacity={0.06} 
      />
    </points>
  );
};

export default ParticleSystem;
