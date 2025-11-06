'use client';
import { useState, useEffect } from 'react';
import { EmotionTracker } from '@/lib/ai/emotionTracker';

interface EmotionAlertsProps {
  marketCondition?: string;
  userAction?: string;
  physiologicalData?: any;
  className?: string;
}

export default function EmotionAlerts({ 
  marketCondition = 'stable',
  userAction = '',
  physiologicalData,
  className = ''
}: EmotionAlertsProps) {
  const [currentEmotion, setCurrentEmotion] = useState<any>(null);
  const [intervention, setIntervention] = useState<{ intervene: boolean; reason: string } | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Track emotion based on current context
    const emotion = EmotionTracker.trackEmotion(marketCondition, userAction, physiologicalData);
    setCurrentEmotion(emotion);

    // Check if intervention is needed
    const shouldIntervene = EmotionTracker.shouldIntervene();
    setIntervention(shouldIntervene);

    // Show alert if intervention needed
    if (shouldIntervene.intervene && !showAlert) {
      setShowAlert(true);
      
      // Auto-hide alert after 10 seconds
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [marketCondition, userAction, physiologicalData]);

  const getEmotionIcon = (emotionType: string) => {
    switch (emotionType) {
      case 'FEAR': return '😨';
      case 'GREED': return '😈';
      case 'PANIC': return '😱';
      case 'EXCITEMENT': return '🎉';
      case 'CONFIDENCE': return '💪';
      case 'ANXIETY': return '😰';
      default: return '😐';
    }
  };

  const getAlertColor = (emotionType: string) => {
    switch (emotionType) {
      case 'FEAR':
      case 'PANIC':
      case 'ANXIETY':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'GREED':
      case 'EXCITEMENT':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800';
    }
  };

  if (!currentEmotion) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Current Emotion Indicator */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getEmotionIcon(currentEmotion.type)}</span>
          <div>
            <div className="text-sm font-medium text-gray-900">{currentEmotion.type}</div>
            <div className="text-xs text-gray-500">
              Intensity: {currentEmotion.intensity}%
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Now</div>
          {currentEmotion.physiologicalSigns && (
            <div className="text-xs text-gray-400">
              {currentEmotion.physiologicalSigns.heartRate && `❤️ ${currentEmotion.physiologicalSigns.heartRate}bpm`}
            </div>
          )}
        </div>
      </div>

      {/* Intervention Alert */}
      {showAlert && intervention?.intervene && (
        <div className={`border-2 rounded-lg p-4 animate-pulse ${getAlertColor(currentEmotion.type)}`}>
          <div className="flex items-start space-x-3">
            <div className="text-xl">⚠️</div>
            <div className="flex-1">
              <div className="font-semibold mb-1">Behavioral Alert</div>
              <div className="text-sm mb-2">{intervention.reason}</div>
              
              {/* Suggested Actions */}
              <div className="text-xs space-y-1">
                <div className="font-medium">Suggested Actions:</div>
                {currentEmotion.type === 'FEAR' || currentEmotion.type === 'PANIC' ? (
                  <>
                    <div>• Take deep breaths and pause trading</div>
                    <div>• Review your long-term investment strategy</div>
                    <div>• Consider market historical recovery patterns</div>
                  </>
                ) : currentEmotion.type === 'GREED' ? (
                  <>
                    <div>• Review position sizing and risk management</div>
                    <div>• Consider taking partial profits</div>
                    <div>• Remember that markets move in cycles</div>
                  </>
                ) : (
                  <>
                    <div>• Step away from screens for 15 minutes</div>
                    <div>• Review your trading plan</div>
                    <div>• Consult your risk management rules</div>
                  </>
                )}
              </div>
            </div>
            <button 
              onClick={() => setShowAlert(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Emotion Triggers */}
      {currentEmotion.triggers.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="text-xs font-medium text-gray-700 mb-2">�� Current Triggers</div>
          <div className="flex flex-wrap gap-1">
            {currentEmotion.triggers.map((trigger: string, index: number) => (
              <span 
                key={index}
                className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
              >
                {trigger}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick Emotion Check-in */}
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <div className="text-xs font-medium text-gray-700 mb-2">🎯 Quick Self-Check</div>
        <div className="text-xs text-gray-600 space-y-1">
          <div>• Am I trading based on logic or emotion?</div>
          <div>• Does this fit my long-term strategy?</div>
          <div>• Have I considered the risks properly?</div>
        </div>
      </div>
    </div>
  );
}
