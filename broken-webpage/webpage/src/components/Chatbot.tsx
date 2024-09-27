'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button, Input, ScrollArea } from './ui/Elements'
import { FaTimes } from 'react-icons/fa'
import Particles from './Particles'
import { Canvas } from '@react-three/fiber'

interface Message {
  id: number
  text: string
  isUser: boolean
}

interface HolographicChatbotProps {
  onClose: () => void
}

async function getResponseFromLLM(input: string): Promise<string> {
  return `AI response to: "${input}"`
}

const Chatbot: React.FC<HolographicChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessage: Message = { id: Date.now(), text: input, isUser: true }
      setMessages((prev) => [...prev, newMessage])
      setInput('')
      setIsTyping(true)

      try {
        const response = await getResponseFromLLM(input)
        const botResponse: Message = {
          id: Date.now(),
          text: response,
          isUser: false,
        }
        setMessages((prev) => [...prev, botResponse])
      } catch (error) {
        console.error('Error getting response from LLM:', error)
        const errorMessage: Message = {
          id: Date.now(),
          text: "I'm sorry, I couldn't process your request. Please try again.",
          isUser: false,
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsTyping(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      
        <Particles />
      

      <motion.div
        className="relative w-full max-w-3xl bg-gray-900 rounded-lg shadow-lg h-3/4 overflow-hidden z-10"
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: '0%' }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', stiffness: 70, damping: 15 }}
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-white hover:text-gray-300 z-20"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        {/* Chat Messages */}
        <ScrollArea
          className="h-[calc(100%-100px)] overflow-y-auto p-4"
          ref={scrollAreaRef}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 flex ${
                message.isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  message.isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-white'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="mb-2 flex justify-start">
              <div className="px-4 py-2 rounded-lg max-w-xs bg-gray-800 text-white">
                The AI is typing...
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex items-center p-4"
        >
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 mr-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-0 rounded-lg"
          />
          <Button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Send
          </Button>
        </form>
      </motion.div>
    </div>
  )
}

export default Chatbot
