'use client';
import { useState, useEffect } from 'react';
import { MarketMood, getMarketMood } from '@/lib/marketMood';

export default function MarketMoodBoard() {
  const [mood, setMood] = useState<MarketMood | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarketMood();
    const interval = setInterval(loadMarketMood, 300000);
    return () => clearInterval(interval);
  }, []);

  const loadMarketMood = async () => {
    setLoading(true);
    const marketMood = await getMarketMood();
    setMood(marketMood);
    setLoading(false);
  };

  if (loading || !mood) {
    return (
      <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-6 text-white shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-400 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-400 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-400 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br ${mood.color} rounded-xl p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Market Mood</h3>
        <button 
          onClick={loadMarketMood}
          className="text-sm bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30"
        >
          Refresh
        </button>
      </div>
      
      <div className="text-center">
        <div className="text-4xl mb-2">{mood.emoji}</div>
        <p className="text-lg font-semibold mb-1">{mood.description}</p>
        <p className="text-sm opacity-90">Confidence: {mood.confidence}%</p>
      </div>
      
      <div className="mt-4 flex justify-center space-x-2">
        {['📊', '💹', '🎯', '⚡'].map((icon, i) => (
          <span key={i} className="text-xl opacity-80">{icon}</span>
        ))}
      </div>
    </div>
  );
}
