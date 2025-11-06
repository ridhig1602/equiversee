export interface CognitiveBias {
  type: BiasType;
  strength: number; // 0-100
  description: string;
  impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  recommendation: string;
}

export type BiasType = 
  | 'LOSS_AVERSION' 
  | 'OVERCONFIDENCE' 
  | 'CONFIRMATION_BIAS' 
  | 'RECENCY_BIAS' 
  | 'HERD_MENTALITY' 
  | 'ANCHORING' 
  | 'SUNK_COST_FALLACY';

export class BiasDetector {
  static detectBiases(
    tradeHistory: any[], 
    currentBehavior: any, 
    marketContext: any
  ): CognitiveBias[] {
    const biases: CognitiveBias[] = [];

    // Loss Aversion Detection
    const lossAversionScore = this.detectLossAversion(tradeHistory);
    if (lossAversionScore > 30) {
      biases.push({
        type: 'LOSS_AVERSION',
        strength: lossAversionScore,
        description: 'Fear of losses outweighing desire for gains',
        impact: 'NEGATIVE',
        recommendation: 'Focus on long-term strategy rather than short-term fluctuations'
      });
    }

    // Overconfidence Detection
    const overconfidenceScore = this.detectOverconfidence(tradeHistory, currentBehavior);
    if (overconfidenceScore > 40) {
      biases.push({
        type: 'OVERCONFIDENCE',
        strength: overconfidenceScore,
        description: 'Overestimating knowledge or predictive ability',
        impact: 'NEGATIVE',
        recommendation: 'Review past mistakes and consider more conservative positions'
      });
    }

    // Confirmation Bias Detection
    const confirmationBiasScore = this.detectConfirmationBias(currentBehavior, marketContext);
    if (confirmationBiasScore > 35) {
      biases.push({
        type: 'CONFIRMATION_BIAS',
        strength: confirmationBiasScore,
        description: 'Seeking information that confirms existing beliefs',
        impact: 'NEGATIVE',
        recommendation: 'Actively seek contradictory evidence before making decisions'
      });
    }

    // Recency Bias Detection
    const recencyBiasScore = this.detectRecencyBias(tradeHistory, marketContext);
    if (recencyBiasScore > 25) {
      biases.push({
        type: 'RECENCY_BIAS',
        strength: recencyBiasScore,
        description: 'Giving more weight to recent events',
        impact: 'NEGATIVE',
        recommendation: 'Consider historical patterns and long-term trends'
      });
    }

    // Herd Mentality Detection
    const herdMentalityScore = this.detectHerdMentality(currentBehavior, marketContext);
    if (herdMentalityScore > 45) {
      biases.push({
        type: 'HERD_MENTALITY',
        strength: herdMentalityScore,
        description: 'Following crowd behavior without independent analysis',
        impact: 'NEGATIVE',
        recommendation: 'Make decisions based on research, not popularity'
      });
    }

    return biases.sort((a, b) => b.strength - a.strength);
  }

  private static detectLossAversion(tradeHistory: any[]): number {
    if (tradeHistory.length < 5) return 0;

    const losingTrades = tradeHistory.filter(trade => trade.profit < 0);
    const winningTrades = tradeHistory.filter(trade => trade.profit > 0);
    
    // High ratio of holding losing positions vs cutting winners
    const avgLossDuration = losingTrades.reduce((sum, trade) => sum + (trade.holdingPeriod || 1), 0) / losingTrades.length;
    const avgWinDuration = winningTrades.reduce((sum, trade) => sum + (trade.holdingPeriod || 1), 0) / winningTrades.length;
    
    if (avgLossDuration > avgWinDuration * 2) {
      return Math.min(100, (avgLossDuration / avgWinDuration) * 25);
    }
    
    return 0;
  }

  private static detectOverconfidence(tradeHistory: any[], currentBehavior: any): number {
    let score = 0;

    // High frequency trading indicates overconfidence
    if (tradeHistory.length > 20) {
      score += Math.min(30, tradeHistory.length / 2);
    }

    // Large position sizes relative to portfolio
    if (currentBehavior?.positionSize > 0.3) { // More than 30% of portfolio
      score += 40;
    }

    // Ignoring stop losses
    const tradesWithoutStops = tradeHistory.filter(trade => !trade.stopLoss).length;
    if (tradesWithoutStops / tradeHistory.length > 0.7) {
      score += 30;
    }

    return Math.min(100, score);
  }

  private static detectConfirmationBias(currentBehavior: any, marketContext: any): number {
    let score = 0;

    // Only following bullish/bearish analysts that match existing view
    if (currentBehavior?.researchSources && currentBehavior.researchSources.length < 3) {
      score += 25;
    }

    // Dismissing contradictory news
    if (currentBehavior?.ignoredWarnings > 2) {
      score += 35;
    }

    // Repeatedly checking positions that are winning
    if (currentBehavior?.positionChecks > 10) {
      score += 20;
    }

    return Math.min(100, score);
  }

  private static detectRecencyBias(tradeHistory: any[], marketContext: any): number {
    if (tradeHistory.length < 10) return 0;

    const recentTrades = tradeHistory.slice(-5);
    const olderTrades = tradeHistory.slice(0, -5);

    // Higher activity in recent trades vs older period
    const recentActivity = recentTrades.length;
    const olderActivity = olderTrades.length / (olderTrades.length > 0 ? 1 : 1);
    
    if (recentActivity > olderActivity * 3) {
      return Math.min(100, (recentActivity / olderActivity) * 20);
    }

    return 0;
  }

  private static detectHerdMentality(currentBehavior: any, marketContext: any): number {
    let score = 0;

    // Following popular stocks without fundamental analysis
    if (currentBehavior?.popularStocksRatio > 0.8) {
      score += 40;
    }

    // Trading based on social media trends
    if (currentBehavior?.socialMediaInfluence > 5) {
      score += 35;
    }

    // Buying during FOMO periods
    if (currentBehavior?.fomoTrades > 2) {
      score += 25;
    }

    return Math.min(100, score);
  }

  static getBiasMitigationStrategies(biasType: BiasType): string[] {
    const strategies: { [key in BiasType]: string[] } = {
      LOSS_AVERSION: [
        'Set predetermined stop-loss levels',
        'Focus on overall portfolio performance',
        'Review historical recovery patterns'
      ],
      OVERCONFIDENCE: [
        'Maintain trading journal with mistakes',
        'Set position size limits',
        'Regularly review worst-case scenarios'
      ],
      CONFIRMATION_BIAS: [
        'Seek contradictory evidence actively',
        'Assign a "devil\'s advocate" role',
        'Use checklist with opposing viewpoints'
      ],
      RECENCY_BIAS: [
        'Review longer-term charts and data',
        'Consider mean reversion probabilities',
        'Analyze full market cycles'
      ],
      HERD_MENTALITY: [
        'Develop independent research process',
        'Avoid investment forums during decision making',
        'Set criteria-based entry/exit rules'
      ],
      ANCHORING: [
        'Use multiple valuation methods',
        'Regularly update price targets',
        'Ignore purchase price in current decisions'
      ],
      SUNK_COST_FALLACY: [
        'Evaluate positions as if new money',
        'Set time-based review points',
        'Focus on future potential only'
      ]
    };

    return strategies[biasType] || ['Maintain disciplined approach and regular review'];
  }
}
