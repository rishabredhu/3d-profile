/** @jsxImportSource @emotion/react */
import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { FaLinkedin, FaGithub, FaTwitter, FaFileAlt, FaEnvelope } from 'react-icons/fa'
import { IconType } from 'react-icons'
import { css } from '@emotion/react';

const SocialIcon = ({ Icon, href, color }: { Icon: IconType; href: string; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime) * 0.2
    }
  })

  return (
    <mesh
      ref={meshRef}
      onClick={() => window.open(href, '_blank')}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'default')}
    >
      {/* Box geometry */}
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
      {/* Instead of rendering an icon directly, convert it to string and render as Text */}
      <Text
        position={[0, 0, 0.55]} // Slightly in front of the box
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {Icon.name} {/* Use icon name or pass an appropriate string */}
      </Text>
    </mesh>
  )
}

const Navbar = () => {
  const pixelateAnimation = css`
    @keyframes pixelate {
      0% {
        transform: scale(1);
      }
      // ... rest of the animation keyframes ...
    }
  `;

  return (
    <nav className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
      <div className="text-2xl font-bold text-white">
        {['R', 'i', 's', 'h', 'a', 'b', '   ', 'S', 'i', 'n', 'g', 'h'].map((char, index) => (
          <span
            key={index}
            className="inline-block pixel-char"
            style={{
              animation: `pixelate 0.5s ease-in-out ${index * 0.1}s infinite alternate`,
            }}
          >
            {char}
          </span>
        ))}
      </div>
      <div css={pixelateAnimation}>
        Hire 
      </div>
      <div className="flex space-x-4">
        {/* Render social icons as regular React components */}
        <a href="https://www.linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="text-2xl text-[#0077B5] hover:text-blue-400 transition-colors" />
        </a>
        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
          <FaGithub className="text-2xl text-[#333] hover:text-gray-600 transition-colors" />
        </a>
        <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="text-2xl text-[#1DA1F2] hover:text-blue-300 transition-colors" />
        </a>
        <a href="/path-to-your-resume.pdf" target="_blank" rel="noopener noreferrer">
          <FaFileAlt className="text-2xl text-[#FFA500] hover:text-yellow-300 transition-colors" />
        </a>
        <a href="mailto:your.email@example.com">
          <FaEnvelope className="text-2xl text-[#D44638] hover:text-red-400 transition-colors" />
        </a>
      </div>
    </nav>
  )
}

export default Navbar
