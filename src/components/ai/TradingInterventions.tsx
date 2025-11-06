'use client';
import { useState, useEffect } from 'react';
import { BiasDetector, type CognitiveBias } from '@/lib/ai/biasDetector';
import { BehavioralAnalyzer, type TradingBehavior } from '@/lib/ai/behavioralAnalysis';

interface TradingInterventionsProps {
  tradeHistory?: any[];
  currentBehavior?: TradingBehavior;
  marketCondition?: string;
  onIntervention?: (type: string, message: string) => void;
  className?: string;
}

type InterventionType = 
  | 'RISK_WARNING' 
  | 'EMOTION_ALERT' 
  | 'BIAS_DETECTED' 
  | 'STRATEGY_REMINDER' 
  | 'SUGGEST_BREAK';

interface Intervention {
  type: InterventionType;
  title: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: Date;
  acknowledged: boolean;
}

export default function TradingInterventions({ 
  tradeHistory = [],
  currentBehavior,
  marketCondition = 'stable',
  onIntervention,
  className = ''
}: TradingInterventionsProps) {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [detectedBiases, setDetectedBiases] = useState<CognitiveBias[]>([]);

  useEffect(() => {
    analyzeAndGenerateInterventions();
  }, [tradeHistory, currentBehavior, marketCondition]);

  const analyzeAndGenerateInterventions = () => {
    const newInterventions: Intervention[] = [];
    const biases = BiasDetector.detectBiases(tradeHistory, currentBehavior, { marketCondition });
    setDetectedBiases(biases);

    // Bias-based interventions
    biases.forEach(bias => {
      if (bias.strength > 50) {
        newInterventions.push({
          type: 'BIAS_DETECTED',
          title: `Cognitive Bias Detected: ${bias.type.replace('_', ' ')}`,
          message: bias.recommendation,
          severity: 'HIGH',
          timestamp: new Date(),
          acknowledged: false
        });
      }
    });

    // Emotion-based interventions
    if (currentBehavior) {
      if (currentBehavior.emotion === 'FEAR' && currentBehavior.confidence > 70) {
        newInterventions.push({
          type: 'EMOTION_ALERT',
          title: 'High Fear Detected',
          message: 'Consider that fear often leads to missed opportunities. Review historical recovery patterns.',
          severity: 'MEDIUM',
          timestamp: new Date(),
          acknowledged: false
        });
      }

      if (currentBehavior.emotion === 'GREED' && currentBehavior.confidence > 80) {
        newInterventions.push({
          type: 'RISK_WARNING',
          title: 'Greed Influencing Decisions',
          message: 'High confidence during greed phases can lead to excessive risk. Review position sizing.',
          severity: 'HIGH',
          timestamp: new Date(),
          acknowledged: false
        });
      }
    }

    // Trading pattern interventions
    if (tradeHistory.length > 10) {
      const recentTrades = tradeHistory.slice(-5);
      const highRiskTrades = recentTrades.filter(trade => trade.riskLevel > 7);
      
      if (highRiskTrades.length >= 3) {
        newInterventions.push({
          type: 'RISK_WARNING',
          title: 'High Risk Trading Pattern',
          message: 'Multiple high-risk trades detected. Consider diversifying and reducing position sizes.',
          severity: 'HIGH',
          timestamp: new Date(),
          acknowledged: false
        });
      }

      // Suggest break if high frequency
      if (recentTrades.length >= 4) {
        newInterventions.push({
          type: 'SUGGEST_BREAK',
          title: 'Consider Taking a Break',
          message: 'High trading frequency detected. Stepping away can provide perspective and reduce emotional trading.',
          severity: 'LOW',
          timestamp: new Date(),
          acknowledged: false
        });
      }
    }

    // Market condition interventions
    if (marketCondition.includes('volatile') && tradeHistory.length > 0) {
      newInterventions.push({
        type: 'STRATEGY_REMINDER',
        title: 'Volatile Market Conditions',
        message: 'Remember your risk management rules. Consider smaller position sizes and wider stops.',
        severity: 'MEDIUM',
        timestamp: new Date(),
        acknowledged: false
      });
    }

    setInterventions(prev => {
      const existingIds = new Set(prev.map(i => i.title));
      const uniqueNew = newInterventions.filter(i => !existingIds.has(i.title));
      return [...prev, ...uniqueNew].slice(-5); // Keep only last 5
    });

    // Notify parent component
    newInterventions.forEach(intervention => {
      onIntervention?.(intervention.type, intervention.message);
    });
  };

  const acknowledgeIntervention = (title: string) => {
    setInterventions(prev => 
      prev.map(i => i.title === title ? { ...i, acknowledged: true } : i)
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'border-red-300 bg-red-50';
      case 'MEDIUM': return 'border-yellow-300 bg-yellow-50';
      case 'LOW': return 'border-blue-300 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'HIGH': return '🔴';
      case 'MEDIUM': return '🟡';
      case 'LOW': return '🔵';
      default: return '⚪';
    }
  };

  const getInterventionIcon = (type: InterventionType) => {
    switch (type) {
      case 'RISK_WARNING': return '⚠️';
      case 'EMOTION_ALERT': return '😟';
      case 'BIAS_DETECTED': return '🧠';
      case 'STRATEGY_REMINDER': return '📋';
      case 'SUGGEST_BREAK': return '☕';
      default: return '💡';
    }
  };

  const unacknowledgedInterventions = interventions.filter(i => !i.acknowledged);

  if (unacknowledgedInterventions.length === 0) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-2 text-green-800">
          <span>✅</span>
          <div>
            <div className="font-medium">Good Trading Discipline</div>
            <div className="text-sm">No interventions needed at this time.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">🎯 Trading Interventions</h3>
      
      {unacknowledgedInterventions.map((intervention, index) => (
        <div 
          key={index}
          className={`border-l-4 rounded-r-lg p-4 animate-fade-in ${getSeverityColor(intervention.severity)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <span className="text-xl">{getInterventionIcon(intervention.type)}</span>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm">{getSeverityIcon(intervention.severity)}</span>
                  <h4 className="font-semibold text-gray-900">{intervention.title}</h4>
                </div>
                <p className="text-sm text-gray-700 mb-2">{intervention.message}</p>
                
                {/* Bias-specific recommendations */}
                {intervention.type === 'BIAS_DETECTED' && (
                  <div className="bg-white rounded p-2 border border-gray-200">
                    <div className="text-xs font-medium text-gray-600 mb-1">Mitigation Strategies:</div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {BiasDetector.getBiasMitigationStrategies(
                        detectedBiases.find(b => b.type === intervention.title.split(': ')[1] as any)?.type || 'OVERCONFIDENCE'
                      ).map((strategy, idx) => (
                        <li key={idx}>• {strategy}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => acknowledgeIntervention(intervention.title)}
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              ✕
            </button>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-gray-500">
              {intervention.timestamp.toLocaleTimeString()}
            </span>
            <button
              onClick={() => acknowledgeIntervention(intervention.title)}
              className="text-xs bg-white border border-gray-300 rounded px-2 py-1 hover:bg-gray-50"
            >
              Acknowledge
            </button>
          </div>
        </div>
      ))}

      {/* Proactive Tips */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">💡 Proactive Tips</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div>• Review your trading plan before each session</div>
          <div>• Set emotional stop-losses alongside financial ones</div>
          <div>• Keep a trading journal to track emotional patterns</div>
          <div>• Take regular breaks to maintain perspective</div>
        </div>
      </div>
    </div>
  );
}
