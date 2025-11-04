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
    
    let sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    let confidence = 0;
    
    if (hour >= 9 && hour <= 15) {
      if (random > 0.6) {
        sentiment = 'BULLISH';
        confidence = 70 + (random * 20);
      } else if (random < 0.3) {
        sentiment = 'BEARISH'; 
        confidence = 60 + (random * 25);
      } else {
        sentiment = 'NEUTRAL';
        confidence = 50 + (random * 20);
      }
    } else {
      sentiment = 'NEUTRAL';
      confidence = 40 + (random * 30);
    }
    
    return getMoodDetails(sentiment, confidence);
  } catch (error) {
    console.error('Market mood error:', error);
    return getMoodDetails('NEUTRAL', 50);
  }
}

function getMoodDetails(sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL', confidence: number): MarketMood {
  const moods = {
    BULLISH: {
      sentiment: 'BULLISH' as const,
      emoji: '📈🚀',
      color: 'from-green-500 to-emerald-600',
      description: 'Market is bullish with strong momentum!',
      trend: 'UP' as const,
      volatility: Math.random() > 0.5 ? 'HIGH' as const : 'MEDIUM' as const
    },
    BEARISH: {
      sentiment: 'BEARISH' as const,
      emoji: '📉😰',
      color: 'from-red-500 to-orange-600',
      description: 'Market is bearish with caution advised',
      trend: 'DOWN' as const,
      volatility: Math.random() > 0.5 ? 'HIGH' as const : 'MEDIUM' as const
    },
    NEUTRAL: {
      sentiment: 'NEUTRAL' as const,
      emoji: '📊🤔',
      color: 'from-blue-500 to-cyan-600',
      description: 'Market is consolidating, waiting for direction',
      trend: 'SIDEWAYS' as const,
      volatility: 'LOW' as const
    }
  };
  
  const mood = moods[sentiment];
  
  return {
    ...mood,
    confidence: Math.round(confidence)
  };
}

export function getRandomMarketEvent() {
  return marketEvents[Math.floor(Math.random() * marketEvents.length)];
}
