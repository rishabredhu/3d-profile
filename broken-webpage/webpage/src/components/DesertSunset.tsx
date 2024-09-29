import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import sunsetImage from '../assets/mkbhd/70.jpg'

/**
 * DesertSunset Component
 * 
 * This component creates a full-screen interactive desert sunset scene using Three.js.
 * It includes a background image, 3D particle effects, and parallax scrolling.
 */
export default function DesertSunset() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particleMaterialRef = useRef<THREE.ShaderMaterial | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Set up Three.js scene, camera, and renderer
    sceneRef.current = new THREE.Scene()
    cameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    rendererRef.current = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true })

    const renderer = rendererRef.current
    const camera = cameraRef.current
    const scene = sceneRef.current

    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.position.z = 5

    // Create particles for the scene
    const particlesCount = 2000
    const positions = new Float32Array(particlesCount * 3)
    const scales = new Float32Array(particlesCount)
    const randomness = new Float32Array(particlesCount)

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = Math.random() * 10 - 5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      scales[i] = Math.random() * 0.5 + 0.5
      randomness[i] = Math.random()
    }

    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1))
    particleGeometry.setAttribute('randomness', new THREE.BufferAttribute(randomness, 1))

    // Create particle material
    particleMaterialRef.current = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        // Add other uniforms as needed
      },
      vertexShader: `
        // Add your vertex shader code here
      `,
      fragmentShader: `
        // Add your fragment shader code here
      `,
    })

    // Create particle system
    const particleSystem = new THREE.Points(particleGeometry, particleMaterialRef.current)
    scene.add(particleSystem)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      const time = Date.now() * 0.001
      if (particleMaterialRef.current && particleMaterialRef.current.uniforms) {
        particleMaterialRef.current.uniforms.time.value = time
      }

      // Apply parallax effect to camera based on scroll position
      if (camera) {
        camera.position.y = scrollY * -0.005
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera)
      }
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
    }

    window.addEventListener('resize', handleResize)

    // Handle scroll for parallax effect
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)

    // Clean up event listeners and Three.js objects on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      if (renderer) {
        renderer.dispose()
      }
      if (particleGeometry) {
        particleGeometry.dispose()
      }
      if (particleMaterialRef.current) {
        particleMaterialRef.current.dispose()
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Background Image */}
      <img 
        src={sunsetImage} 
        alt="Desert Sunset" 
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 3D Particles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Content container */}
      <div className="absolute inset-0 flex flex-col justify-end pb-20 px-4 sm:px-6 lg:px-8">
        {/* Joshua trees and desert plants silhouettes with parallax effect */}
        <div className="absolute bottom-0 left-0 right-0" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
          <svg
            viewBox="0 0 1200 300"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0,300 L50,280 Q75,260 100,280 L150,300 L200,280 Q225,260 250,280 L300,300 L350,280 Q375,240 400,280 L450,300 L500,280 Q525,220 550,280 L600,300 L650,280 Q675,240 700,280 L750,300 L800,280 Q825,260 850,280 L900,300 L950,280 Q975,240 1000,280 L1050,300 L1100,280 Q1125,260 1150,280 L1200,300 Z"
              fill="black"
            />
          </svg>
        </div>

        {/* Text content with parallax effect */}
        <div className="relative text-center" style={{ transform: `translateY(${scrollY * -0.3}px)` }}>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Rishab Singh
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            helping you create your next great idea, product or service. 
          </p>
        </div>
      </div>
    </div>
  )
}