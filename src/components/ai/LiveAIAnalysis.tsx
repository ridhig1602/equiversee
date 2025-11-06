'use client'
import { useState, useEffect } from 'react'

export default function LiveAIAnalysis() {
  const [analysis, setAnalysis] = useState({
    emotion: 'CALM',
    confidence: 72,
    biases: ['CONFIRMATION_BIAS', 'RECENCY_BIAS'],
    riskScore: 65,
    recommendations: ['Consider diversifying your portfolio', 'Set stop-loss orders']
  })

  const [isAnalyzing, setIsAnalyzing] = useState(true)

  useEffect(() => {
    // Simulate AI analysis
    const timer = setTimeout(() => {
      setIsAnalyzing(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🧠</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis in Progress</h3>
          <p className="text-gray-600 mb-4">Analyzing your trading patterns and emotional signals...</p>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">AI Behavioral Analysis</h3>
        <div className="flex items-center space-x-2 text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium">LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-xl">
          <div className="text-2xl font-bold text-blue-600">{analysis.confidence}%</div>
          <div className="text-sm text-blue-800">Confidence Level</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-xl">
          <div className="text-2xl font-bold text-orange-600">{analysis.riskScore}%</div>
          <div className="text-sm text-orange-800">Risk Score</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Detected Biases</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.biases.map((bias, index) => (
              <span key={index} className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                ⚠️ {bias.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">AI Recommendations</h4>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          🤖 AI analysis based on your trading patterns and market data
        </p>
      </div>
    </div>
  )
}
