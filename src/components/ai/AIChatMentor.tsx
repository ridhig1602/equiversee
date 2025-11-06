'use client'
import { useState, useRef, useEffect } from 'react'

const AI_RESPONSES = {
  greeting: "Hi! I'm your AI Trading Mentor. I can help analyze your trading behavior, detect biases, and provide personalized advice. What would you like to discuss?",
  fear: "I notice some fear in your recent trades. Remember: Markets always recover. Stick to your strategy and avoid panic selling.",
  greed: "You're showing signs of greed. Consider taking profits and rebalancing. Greed often leads to missed exit points.",
  bias: "I'm detecting confirmation bias - you're seeking information that supports your existing views. Try playing devil's advocate with your next trade.",
  risk: "Your risk exposure seems high. The 1% rule suggests risking no more than 1% of your portfolio on a single trade.",
  learning: "Based on your trading patterns, I recommend studying risk management and emotional discipline. Check our Learning section!"
}

export default function AIChatMentor() {
  const [messages, setMessages] = useState([{ text: AI_RESPONSES.greeting, isUser: false }])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    setMessages(prev => [...prev, { text: input, isUser: true }])
    
    // AI "thinking" delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(input)
      setMessages(prev => [...prev, { text: aiResponse, isUser: false }])
    }, 1000 + Math.random() * 2000) // Realistic delay
    
    setInput('')
  }

  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase()
    
    if (input.includes('fear') || input.includes('scared') || input.includes('panic')) 
      return AI_RESPONSES.fear
    if (input.includes('greed') || input.includes('profit') || input.includes('more money')) 
      return AI_RESPONSES.greed
    if (input.includes('bias') || input.includes('mistake') || input.includes('wrong')) 
      return AI_RESPONSES.bias
    if (input.includes('risk') || input.includes('loss') || input.includes('safe')) 
      return AI_RESPONSES.risk
    if (input.includes('learn') || input.includes('study') || input.includes('improve')) 
      return AI_RESPONSES.learning
    
    return "I understand. As your AI mentor, I recommend focusing on consistent risk management and emotional control. Would you like me to analyze your recent trading behavior?"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-[500px] flex flex-col">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-lg">🧠</span>
          </div>
          <div>
            <h3 className="font-semibold">AI Trading Mentor</h3>
            <p className="text-sm opacity-90">Online • Analyzing your behavior</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-3 ${
              message.isUser 
                ? 'bg-blue-500 text-white rounded-br-none' 
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}>
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your AI mentor about trading, emotions, or biases..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-600 transition-colors"
          >
            ↑
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          AI Mentor analyzes your behavior and provides personalized advice
        </p>
      </div>
    </div>
  )
}
