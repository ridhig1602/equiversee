'use client';
import { useState, useEffect } from 'react';
import { BehavioralAnalyzer, type TradingBehavior, type BehavioralScore } from '@/lib/ai/behavioralAnalysis';
import { BiasDetector, type CognitiveBias } from '@/lib/ai/biasDetector';
import { EmotionTracker } from '@/lib/ai/emotionTracker';

interface BehavioralInsightsProps {
  tradeHistory?: any[];
  marketCondition?: string;
  className?: string;
}

export default function BehavioralInsights({ 
  tradeHistory = [], 
  marketCondition = 'stable',
  className = '' 
}: BehavioralInsightsProps) {
  const [currentBehavior, setCurrentBehavior] = useState<TradingBehavior | null>(null);
  const [behavioralScore, setBehavioralScore] = useState<BehavioralScore | null>(null);
  const [detectedBiases, setDetectedBiases] = useState<CognitiveBias[]>([]);
  const [emotionTrend, setEmotionTrend] = useState<any>(null);

  useEffect(() => {
    // Analyze current behavior
    const behavior = BehavioralAnalyzer.analyzeTradingPattern(tradeHistory, marketCondition);
    setCurrentBehavior(behavior);

    // Calculate behavioral score
    const score = BehavioralAnalyzer.calculateBehavioralScore(tradeHistory);
    setBehavioralScore(score);

    // Detect cognitive biases
    const biases = BiasDetector.detectBiases(tradeHistory, behavior, { marketCondition });
    setDetectedBiases(biases);

    // Get emotion trend
    const trend = EmotionTracker.getEmotionTrend();
    setEmotionTrend(trend);
  }, [tradeHistory, marketCondition]);

  const getEmotionColor = (emotion?: string) => {
    switch (emotion) {
      case 'FEAR': return 'text-red-500 bg-red-50';
      case 'GREED': return 'text-yellow-600 bg-yellow-50';
      case 'PANIC': return 'text-red-700 bg-red-100';
      case 'CONFIDENCE': return 'text-green-600 bg-green-50';
      case 'CALM': return 'text-blue-500 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!currentBehavior || !behavioralScore) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">�� Behavioral Insights</h3>
      
      {/* Current Emotional State */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Current Emotion</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmotionColor(currentBehavior.emotion)}`}>
            {currentBehavior.emotion}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${currentBehavior.confidence}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low Confidence</span>
          <span>High Confidence</span>
        </div>
      </div>

      {/* Behavioral Score */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{behavioralScore.overallScore.toFixed(0)}</div>
          <div className="text-xs text-gray-500">Overall Score</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${getScoreColor(behavioralScore.emotionalControl)}`}>
            {behavioralScore.emotionalControl.toFixed(0)}
          </div>
          <div className="text-xs text-gray-500">Emotional Control</div>
        </div>
      </div>

      {/* Detected Biases */}
      {detectedBiases.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">⚠️ Detected Biases</h4>
          <div className="space-y-2">
            {detectedBiases.slice(0, 2).map((bias, index) => (
              <div key={index} className="bg-orange-50 border border-orange-200 rounded p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-orange-800">{bias.type.replace('_', ' ')}</span>
                  <span className="text-xs text-orange-600">{bias.strength.toFixed(0)}%</span>
                </div>
                <p className="text-xs text-orange-700 mb-2">{bias.description}</p>
                <p className="text-xs text-orange-600 font-medium">💡 {bias.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emotion Trend */}
      {emotionTrend && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Emotion Trend</span>
            <span className={`text-xs font-medium ${
              emotionTrend.trend === 'IMPROVING' ? 'text-green-600' :
              emotionTrend.trend === 'DETERIORATING' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {emotionTrend.trend}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Based on recent emotional patterns and market interactions
          </div>
        </div>
      )}
    </div>
  );
}
