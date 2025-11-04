export interface MarketMood {
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  emoji: string;
  color: string;
  description: string;
  confidence: number;
  trend: 'UP' | 'DOWN' | 'SIDEWAYS';
  volatility: 'HIGH' | 'MEDIUM' | 'LOW';
}

const marketEvents = [
  { event: "📈 Strong Earnings", impact: 2 },
  { event: "📉 Inflation Concerns", impact: -2 },
  { event: "🏛️ Policy Changes", impact: 1 },
  { event: "🌍 Global Events", impact: -1 },
  { event: "💼 Corporate News", impact: 1 },
  { event: "🛢️ Commodity Prices", impact: -1 }
];

export async function getMarketMood(): Promise<MarketMood> {
  try {
    const hour = new Date().getHours();
    const random = Math.random();
    
    // More dynamic calculation
    let sentimentScore = 0;
    
    // Time-based sentiment
    if (hour >= 9 && hour <= 15) { // Market hours
      sentimentScore += 1;
    }
    
    // Random events
    const randomEvent = marketEvents[Math.floor(Math.random() * marketEvents.length)];
    sentimentScore += randomEvent.impact;
    
    // Add some randomness
    sentimentScore += (Math.random() - 0.5) * 2;
    
    let sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    let confidence = 0;
    
    if (sentimentScore > 1) {
      sentiment = 'BULLISH';
      confidence = 70 + (Math.random() * 20);
    } else if (sentimentScore < -1) {
      sentiment = 'BEARISH';
      confidence = 60 + (Math.random() * 25);
    } else {
      sentiment = 'NEUTRAL';
      confidence = 50 + (Math.random() * 20);
    }
    
    return getMoodDetails(sentiment, confidence);
  } catch (error) {
    return getMoodDetails('NEUTRAL', 50);
  }
}

function getMoodDetails(sentiment: string, confidence: number): MarketMood {
  const moods = {
    BULLISH: {
      sentiment: 'BULLISH',
      emoji: '📈🚀',
      color: 'from-green-500 to-emerald-600',
      description: 'Market is bullish with strong momentum!',
      trend: 'UP',
      volatility: Math.random() > 0.5 ? 'HIGH' : 'MEDIUM'
    },
    BEARISH: {
      sentiment: 'BEARISH', 
      emoji: '📉😰',
      color: 'from-red-500 to-orange-600',
      description: 'Market is bearish with caution advised',
      trend: 'DOWN',
      volatility: Math.random() > 0.5 ? 'HIGH' : 'MEDIUM'
    },
    NEUTRAL: {
      sentiment: 'NEUTRAL',
      emoji: '📊🤔', 
      color: 'from-blue-500 to-cyan-600',
      description: 'Market is consolidating, waiting for direction',
      trend: 'SIDEWAYS',
      volatility: 'LOW'
    }
  };
  
  const mood = moods[sentiment as keyof typeof moods];
  
  return {
    ...mood,
    confidence: Math.round(confidence)
  };
}

export function getRandomMarketEvent() {
  return marketEvents[Math.floor(Math.random() * marketEvents.length)];
}
