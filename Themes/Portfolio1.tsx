'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import * as THREE from 'three'
import { JellySphere, Particles } from './broken-webpage/webpage/src/components/Scene'


// Custom Button component
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
  <button
    className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
)

export default function Portfolio() {
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const scrollRef = useRef(0)

  useEffect(() => {
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.overflow = 'hidden'

    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 99) {
          clearInterval(timer)
          setTimeout(() => setLoading(false), 1000)
          return 99
        }
        return prev + 1
      })
    }, 20)

    const handleScroll = () => {
      scrollRef.current = window.scrollY
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      clearInterval(timer)
      document.body.style.margin = ''
      document.body.style.padding = ''
      document.body.style.overflow = ''
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-black text-white">
        <h1 className="text-6xl font-serif mb-2">Rishab Singh</h1>
        <p className="text-2xl mb-8">
          Software Engineer <span className="text-3xl text-blue-500">*</span>
        </p>
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
        <p className="text-xl mt-4">{loadingProgress.toString().padStart(3, '0')}%</p>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <JellySphere scroll={scrollRef} />
        <Particles scroll={scrollRef} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
        <EffectComposer>
          <Bloom kernelSize={KernelSize.LARGE} luminanceThreshold={0.15} luminanceSmoothing={0.025} intensity={0.5} />
        </EffectComposer>
      </Canvas>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-50 pointer-events-none"></div>
      <nav className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="text-2xl font-serif">Rishab.</div>
        <div className="flex items-center space-x-4">
          <Button className="text-white hover:text-blue-300 transition-colors">Projects</Button>
          <Button className="text-white hover:text-blue-300 transition-colors">About</Button>
          <Button className="text-white hover:text-blue-300 transition-colors">Contact</Button>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-black font-bold">RS</span>
          </div>
        </div>
      </nav>
      <main className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 leading-tight">
          BUILDING YOUR NEXT <br />
          <span className="text-blue-500">GREAT PRODUCT</span>
        </h2>
        <p className="text-xl sm:text-2xl md:text-3xl mb-8">Innovation In Every Pixel</p>
        <Button className="text-lg px-8 py-4">Explore My Work</Button>
      </main>
      <footer className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-sm">
        <div>Rishab Singh | Software Engineer</div>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-blue-300 transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-blue-300 transition-colors">GitHub</a>
          <a href="#" className="hover:text-blue-300 transition-colors">Twitter</a>
        </div>
      </footer>
    </div>
  )
}