'use client';
import { useState, useEffect } from 'react';
import BehavioralInsights from '@/components/ai/BehavioralInsights';
import EmotionAlerts from '@/components/ai/EmotionAlerts';
import TradingInterventions from '@/components/ai/TradingInterventions';
import { BehavioralAnalyzer, type BehavioralScore } from '@/lib/ai/behavioralAnalysis';
import { BiasDetector, type CognitiveBias } from '@/lib/ai/biasDetector';
import AIChatMentor from '@/components/ai/AIChatMentor'
import LiveAIAnalysis from '@/components/ai/LiveAIAnalysis'

// Mock data - replace with real data from your backend
const mockTradeHistory = [
  { symbol: 'AAPL', action: 'BUY', amount: 1000, profit: 150, riskLevel: 6, holdingPeriod: 5 },
  { symbol: 'TSLA', action: 'SELL', amount: 500, profit: -200, riskLevel: 8, holdingPeriod: 2 },
  { symbol: 'MSFT', action: 'BUY', amount: 800, profit: 300, riskLevel: 4, holdingPeriod: 10 },
  { symbol: 'NVDA', action: 'BUY', amount: 1200, profit: 450, riskLevel: 9, holdingPeriod: 3 },
  { symbol: 'GOOGL', action: 'SELL', amount: 600, profit: -100, riskLevel: 7, holdingPeriod: 1 },
];

export default function AIMentorPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'emotions' | 'biases' | 'interventions'>('overview');
  const [behavioralScore, setBehavioralScore] = useState<BehavioralScore | null>(null);
  const [allBiases, setAllBiases] = useState<CognitiveBias[]>([]);
  const [marketCondition, setMarketCondition] = useState('moderately volatile');
  const [userAction, setUserAction] = useState('');

  useEffect(() => {
    // Calculate initial behavioral score
    const score = BehavioralAnalyzer.calculateBehavioralScore(mockTradeHistory);
    setBehavioralScore(score);

    // Detect all biases
    const behavior = BehavioralAnalyzer.analyzeTradingPattern(mockTradeHistory, marketCondition);
    const biases = BiasDetector.detectBiases(mockTradeHistory, behavior, { marketCondition });
    setAllBiases(biases);
  }, []);

  const handleIntervention = (type: string, message: string) => {
    console.log('Intervention needed:', type, message);
    // Here you would typically send to your backend or show a notification
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 60) return { level: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (score >= 40) return { level: 'Needs Improvement', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { level: 'Requires Attention', color: 'text-red-600', bg: 'bg-red-50' };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧠 AI Behavioral Finance Mentor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your personal AI coach for smarter, more disciplined investing. 
            We analyze your emotions, detect biases, and help you make better decisions.
          </p>
        </div>

        {/* Main Score Card */}
        {behavioralScore && (
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Behavioral Score</h2>
                <p className="text-gray-600">Based on your recent trading patterns and emotional responses</p>
              </div>
              <div className="text-right">
                <div className={`text-5xl font-bold ${getScoreLevel(behavioralScore.overallScore).color}`}>
                  {behavioralScore.overallScore.toFixed(0)}
                </div>
                <div className={`text-sm font-medium ${getScoreLevel(behavioralScore.overallScore).color}`}>
                  {getScoreLevel(behavioralScore.overallScore).level}
                </div>
              </div>
            </div>
            
            {/* Score Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{behavioralScore.emotionalControl.toFixed(0)}</div>
                <div className="text-sm text-blue-800">Emotional Control</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{behavioralScore.decisionQuality.toFixed(0)}</div>
                <div className="text-sm text-green-800">Decision Quality</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{behavioralScore.riskManagement.toFixed(0)}</div>
                <div className="text-sm text-purple-800">Risk Management</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{behavioralScore.consistency.toFixed(0)}</div>
                <div className="text-sm text-orange-800">Consistency</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border mb-8">
          <div className="border-b">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'overview', name: 'Overview', icon: '��' },
                { id: 'emotions', name: 'Emotion Tracking', icon: '😊' },
                { id: 'biases', name: 'Bias Analysis', icon: '🧠' },
                { id: 'interventions', name: 'Interventions', icon: '🎯' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
  <div className="space-y-8">
    {/* AI Chat and Live Analysis - NEW COMPONENTS */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <AIChatMentor />
      <LiveAIAnalysis />
    </div>
    
    {/* Existing Components Below */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BehavioralInsights 
        tradeHistory={mockTradeHistory}
        marketCondition={marketCondition}
      />
      <EmotionAlerts 
        marketCondition={marketCondition}
        userAction={userAction}
      />
    </div>
  </div>
)}

            {activeTab === 'emotions' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-time Emotion Tracking</h3>
                  <EmotionAlerts 
                    marketCondition={marketCondition}
                    userAction={userAction}
                    className="max-w-2xl"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Emotion Management Tips</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Practice mindfulness before trading sessions</li>
                      <li>• Set emotional stop-losses alongside financial ones</li>
                      <li>• Keep an emotion journal for your trades</li>
                      <li>• Take breaks when you feel strong emotions</li>
                      <li>• Review your long-term strategy regularly</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Market Mood Correlation</h4>
                    <div className="text-sm text-gray-600 space-y-2">
                      <div>Understanding how market conditions affect your emotions:</div>
                      <div className="flex justify-between">
                        <span>Bull Markets:</span>
                        <span className="text-green-600">Increased confidence</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bear Markets:</span>
                        <span className="text-red-600">Increased fear</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Volatile Markets:</span>
                        <span className="text-yellow-600">Anxiety & excitement</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'biases' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Detected Cognitive Biases</h3>
                  
                  {allBiases.length > 0 ? (
                    <div className="space-y-4">
                      {allBiases.map((bias, index) => (
                        <div key={index} className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-orange-800">{bias.type.replace('_', ' ')}</h4>
                            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                              {bias.strength.toFixed(0)}% strength
                            </span>
                          </div>
                          <p className="text-orange-700 text-sm mb-3">{bias.description}</p>
                          
                          <div className="bg-white rounded p-3 border border-orange-200">
                            <div className="text-xs font-medium text-orange-800 mb-2">💡 Mitigation Strategies:</div>
                            <ul className="text-xs text-orange-700 space-y-1">
                              {BiasDetector.getBiasMitigationStrategies(bias.type).map((strategy, idx) => (
                                <li key={idx}>• {strategy}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">🎉</div>
                      <div className="font-medium">No significant biases detected!</div>
                      <div className="text-sm">Your trading behavior shows good discipline.</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'interventions' && (
              <div className="space-y-6">
                <TradingInterventions 
                  tradeHistory={mockTradeHistory}
                  marketCondition={marketCondition}
                  onIntervention={handleIntervention}
                />
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Proactive Learning</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Common Trading Mistakes</h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• Letting emotions override your trading plan</li>
                        <li>• Chasing losses with larger positions</li>
                        <li>• Ignoring risk management rules</li>
                        <li>• Trading based on FOMO (Fear Of Missing Out)</li>
                        <li>• Overconfidence after a few successful trades</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Success Habits</h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• Stick to your predefined trading plan</li>
                        <li>• Regular portfolio review and rebalancing</li>
                        <li>• Continuous learning and adaptation</li>
                        <li>• Emotional awareness and control</li>
                        <li>• Risk-first mindset in every decision</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Ready to Master Your Trading Psychology?</h2>
          <p className="mb-4 opacity-90">
            Start your journey to becoming a more disciplined and successful investor today.
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Begin Behavioral Training
          </button>
        </div>
      </div>
    </div>
  );
}
