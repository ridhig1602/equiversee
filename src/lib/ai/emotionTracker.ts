export interface EmotionData {
  type: 'FEAR' | 'GREED' | 'CONFIDENCE' | 'ANXIETY' | 'EXCITEMENT';
  intensity: number; // 0-100
  triggers: string[];
  timestamp: Date;
  physiologicalSigns?: {
    heartRate?: number;
    stressLevel?: number;
    confidence?: number;
  };
}

export class EmotionTracker {
  private static emotionHistory: EmotionData[] = [];

  static trackEmotion(
    marketCondition: string, 
    userAction: string, 
    physiologicalData?: any
  ): EmotionData {
    const emotion = this.analyzeEmotion(marketCondition, userAction, physiologicalData);
    
    this.emotionHistory.push(emotion);
    
    // Keep only last 100 emotions
    if (this.emotionHistory.length > 100) {
      this.emotionHistory = this.emotionHistory.slice(-100);
    }
    
    return emotion;
  }

  static getCurrentEmotion(): EmotionData | null {
    return this.emotionHistory.length > 0 
      ? this.emotionHistory[this.emotionHistory.length - 1] 
      : null;
  }

  static getEmotionTrend(): { trend: 'IMPROVING' | 'DETERIORATING' | 'STABLE'; score: number } {
    if (this.emotionHistory.length < 3) {
      return { trend: 'STABLE', score: 50 };
    }

    const recentEmotions = this.emotionHistory.slice(-5);
    const positiveEmotions = recentEmotions.filter(e => 
      e.type === 'CONFIDENCE' || e.type === 'EXCITEMENT'
    ).length;
    
    const score = (positiveEmotions / recentEmotions.length) * 100;
    
    if (score > 70) return { trend: 'IMPROVING', score };
    if (score < 30) return { trend: 'DETERIORATING', score };
    return { trend: 'STABLE', score };
  }

  static shouldIntervene(): { intervene: boolean; reason: string } {
    const current = this.getCurrentEmotion();
    if (!current) return { intervene: false, reason: '' };

    // High fear or greed requires intervention
    if ((current.type === 'FEAR' || current.type === 'GREED') && current.intensity > 70) {
      return { 
        intervene: true, 
        reason: `High ${current.type.toLowerCase()} detected with ${current.intensity}% intensity` 
      };
    }

    // Rapid emotion changes
    if (this.emotionHistory.length >= 3) {
      const recent = this.emotionHistory.slice(-3);
      const intensityChanges = recent.map(e => e.intensity);
      const maxChange = Math.max(...intensityChanges) - Math.min(...intensityChanges);
      
      if (maxChange > 50) {
        return { intervene: true, reason: 'Rapid emotional changes detected' };
      }
    }

    return { intervene: false, reason: '' };
  }

  private static analyzeEmotion(
    marketCondition: string, 
    userAction: string, 
    physiologicalData?: any
  ): EmotionData {
    let emotionType: EmotionData['type'] = 'CONFIDENCE';
    let intensity = 50;
    const triggers: string[] = [];

    // Market condition analysis
    if (marketCondition.includes('volatile') || marketCondition.includes('crash')) {
      emotionType = 'FEAR';
      intensity += 30;
      triggers.push('Market volatility');
    } else if (marketCondition.includes('bull') || marketCondition.includes('rally')) {
      emotionType = 'EXCITEMENT';
      intensity += 20;
      triggers.push('Market uptrend');
    }

    // User action analysis
    if (userAction.includes('sell') || userAction.includes('exit')) {
      emotionType = userAction.includes('panic') ? 'FEAR' : 'CONFIDENCE';
      intensity += userAction.includes('panic') ? 40 : 10;
      triggers.push('Selling pressure');
    } else if (userAction.includes('buy') || userAction.includes('enter')) {
      emotionType = userAction.includes('aggressive') ? 'GREED' : 'CONFIDENCE';
      intensity += userAction.includes('aggressive') ? 35 : 15;
      triggers.push('Buying activity');
    }

    // Physiological data integration
    const physiologicalSigns: EmotionData['physiologicalSigns'] = {};
    if (physiologicalData) {
      if (physiologicalData.heartRate > 90) {
        intensity += 20;
        physiologicalSigns.heartRate = physiologicalData.heartRate;
        triggers.push('Elevated heart rate');
      }
      if (physiologicalData.stressLevel > 70) {
        intensity += 25;
        physiologicalSigns.stressLevel = physiologicalData.stressLevel;
        triggers.push('High stress detected');
      }
    }

    // Cap intensity at 100
    intensity = Math.min(100, Math.max(0, intensity));

    return {
      type: emotionType,
      intensity,
      triggers,
      timestamp: new Date(),
      physiologicalSigns: Object.keys(physiologicalSigns).length > 0 ? physiologicalSigns : undefined
    };
  }

  static getEmotionHistory(): EmotionData[] {
    return [...this.emotionHistory];
  }

  static clearHistory(): void {
    this.emotionHistory = [];
  }
}
