'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
// import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom, Pixelation } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
// import * as THREE from 'three'
import AuroraBorealis from './AuroraBorealis'
import { FaLinkedin, FaGithub, FaTwitter, FaFileAlt, FaEnvelope, FaMapMarkerAlt, FaComments } from 'react-icons/fa'
import Navbar from './NavBar'
import Chatbot from './Chatbot'


export default function Portfolio() {
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const scrollRef = useRef(0)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false) // State to control chatbot visibility


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
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-black text-white font-sans">
        <h1 className="text-6xl font-serif mb-2 text-blue-400 animate-pulse">Rishab Singh</h1>
        <p className="text-2xl mb-8 text-blue-300">
          Software Engineer <span className="text-3xl text-blue-500 animate-ping">*</span>
        </p>
        <div className="w-64 h-4 bg-gray-800 rounded-full overflow-hidden border-2 border-blue-500 shadow-lg shadow-blue-500/50">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-green-500 transition-all duration-300 ease-out"
            style={{ 
              width: `${loadingProgress}%`,
              boxShadow: '0 0 10px #3b82f6, 0 0 20px #3b82f6, 0 0 30px #3b82f6'
            }}
          ></div>
        </div>
        <p className="text-xl mt-4 font-mono text-blue-400">{loadingProgress.toString().padStart(3, '0')}%</p>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden font-sans">
      <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
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
      </Canvas>
      <Navbar />
      <main className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
        {/* ... main content ... */}
      </main>

      {/* Chatbot Toggle Button */}
      <button
        className="fixed bottom-4 right-4 bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
        onClick={() => setIsChatbotOpen(true)}
      >
        <FaComments className="text-white text-2xl" />
      </button>

      {/* Chatbot Component */}
      {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
    </div>
  )
}