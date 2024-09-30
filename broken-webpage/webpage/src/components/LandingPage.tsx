'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SphereParticle from '../components_deprecated/SphereParticle'
import Horse from './Horse'


// LandingPage component: Displays a loading screen with a running horse animation
const LandingPage: React.FC = () => {
  const [loading, setLoading] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLoading((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 20) // Adjust this value to change the loading speed

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-900 overflow-hidden">
      {/* Greased line background */}
      <SphereParticle />
      <Horse /> 
      
      {/* Loading text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white">Loading: {loading}%</h1>
      </div>

      {/* Running horse */}
      <motion.div
        className="absolute bottom-10"
        initial={{ x: '-100%' }}
        animate={{ x: `${loading}%` }}
        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
      >
        
      </motion.div>
    </div>
  )
}

export default LandingPage