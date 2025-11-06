export interface TradingBehavior {
  emotion: 'FEAR' | 'GREED' | 'CONFIDENCE' | 'PANIC' | 'CALM';
  confidence: number;
  riskAppetite: number;
  detectedBiases: string[];
}

export interface BehavioralScore {
  emotionalControl: number;
  decisionQuality: number;
  riskManagement: number;
  consistency: number;
  overallScore: number;
}

export class BehavioralAnalyzer {
  static analyzeTradingPattern(actions: any[], marketCondition: string): TradingBehavior {
    const recentActions = actions.slice(-5);
    const emotionalScore = this.calculateEmotionalScore(recentActions);
    const biasList = this.detectBiases(recentActions);
    
    return {
      emotion: this.determineEmotion(emotionalScore),
      confidence: Math.min(emotionalScore * 20, 100),
      riskAppetite: this.calculateRiskAppetite(recentActions),
      detectedBiases: biasList
    };
  }

  static calculateBehavioralScore(tradeHistory: any[]): BehavioralScore {
    const emotionalControl = this.assessEmotionalStability(tradeHistory);
    const decisionQuality = this.assessDecisionQuality(tradeHistory);
    const riskManagement = this.assessRiskManagement(tradeHistory);
    const consistency = this.assessConsistency(tradeHistory);
    
    const overallScore = (emotionalControl + decisionQuality + riskManagement + consistency) / 4;
    
    return {
      emotionalControl,
      decisionQuality,
      riskManagement,
      consistency,
      overallScore
    };
  }

  private static calculateEmotionalScore(actions: any[]): number {
    if (actions.length === 0) return 0.5;
    
    const volatility = actions.reduce((acc, action, idx, arr) => {
      if (idx === 0) return 0;
      return acc + Math.abs(action.amount - arr[idx - 1].amount);
    }, 0);
    
    return Math.max(0, 1 - volatility / actions.length);
  }

  private static determineEmotion(score: number): TradingBehavior['emotion'] {
    if (score < 0.3) return 'PANIC';
    if (score < 0.5) return 'FEAR';
    if (score < 0.7) return 'CALM';
    if (score < 0.9) return 'CONFIDENCE';
    return 'GREED';
  }

  private static detectBiases(actions: any[]): string[] {
    const biases: string[] = [];
    
    if (actions.length >= 3) {
      // Loss aversion detection
      const lossActions = actions.filter(a => a.profit < 0);
      if (lossActions.length / actions.length > 0.7) {
        biases.push('LOSS_AVERSION');
      }
      
      // Overconfidence detection
      const highRiskActions = actions.filter(a => a.riskLevel > 7);
      if (highRiskActions.length > actions.length / 2) {
        biases.push('OVERCONFIDENCE');
      }
    }
    
    return biases;
  }

  private static calculateRiskAppetite(actions: any[]): number {
    if (actions.length === 0) return 5;
    return actions.reduce((sum, action) => sum + (action.riskLevel || 5), 0) / actions.length;
  }

  private static assessEmotionalStability(history: any[]): number {
    const emotionalSwings = history.filter((_, idx, arr) => 
      idx > 0 && Math.abs((arr[idx].emotionScore || 0.5) - (arr[idx-1].emotionScore || 0.5)) > 0.3
    ).length;
    
    return Math.max(0, 100 - (emotionalSwings / history.length) * 100);
  }

  private static assessDecisionQuality(history: any[]): number {
    const profitableDecisions = history.filter(action => action.profit > 0).length;
    return history.length > 0 ? (profitableDecisions / history.length) * 100 : 50;
  }

  private static assessRiskManagement(history: any[]): number {
    const highRiskLosses = history.filter(action => 
      action.riskLevel > 7 && action.profit < 0
    ).length;
    
    const totalHighRisk = history.filter(action => action.riskLevel > 7).length;
    
    return totalHighRisk > 0 ? Math.max(0, 100 - (highRiskLosses / totalHighRisk) * 100) : 80;
  }

  private static assessConsistency(history: any[]): number {
    if (history.length < 3) return 50;
    
    const returns = history.map(action => action.profit || 0);
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length;
    
    return Math.max(0, 100 - Math.sqrt(variance) * 10);
  }
}
