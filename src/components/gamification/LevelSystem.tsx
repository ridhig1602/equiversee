'use client';
import { useState, useEffect } from 'react';
import { UserProgress, LEVEL_SYSTEM, calculateLevel, getRank } from '@/lib/gamification';
import { XPManager } from '@/lib/xpManager';

export default function LevelSystem() {
  const [progress, setProgress] = useState<UserProgress>({
    level: 1,
    xp: 0,
    xpToNextLevel: 1000,
    rank: "Newbie",
    completedModules: [],
    dailyStreak: 0,
    lastActiveDate: new Date().toDateString(),
    totalTrades: 0,
    badges: []
  });

  useEffect(() => {
    loadProgress();
    
    // Listen for XP updates
    const handleXPUpdate = () => loadProgress();
    window.addEventListener('xp-updated', handleXPUpdate);
    
    return () => window.removeEventListener('xp-updated', handleXPUpdate);
  }, []);

  const loadProgress = () => {
    const savedXP = XPManager.getCurrentXP();
    const level = calculateLevel(savedXP);
    const currentLevel = LEVEL_SYSTEM.find(l => l.level === level) || LEVEL_SYSTEM[0];
    const nextLevel = LEVEL_SYSTEM.find(l => l.level === level + 1);
    const totalTrades = parseInt(localStorage.getItem('total-trades') || '0');
    const dailyStreak = parseInt(localStorage.getItem('daily-streak') || '0');
    
    setProgress({
      ...progress,
      xp: savedXP,
      level: level,
      xpToNextLevel: nextLevel ? nextLevel.xpRequired - savedXP : 0,
      rank: getRank(savedXP),
      totalTrades: totalTrades,
      dailyStreak: dailyStreak
    });
  };

  const currentLevel = LEVEL_SYSTEM.find(l => l.level === progress.level) || LEVEL_SYSTEM[0];
  const nextLevel = LEVEL_SYSTEM.find(l => l.level === progress.level + 1);
  const progressPercent = nextLevel 
    ? ((progress.xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100
    : 100;

  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">{currentLevel.badge} {currentLevel.name}</h2>
          <p className="text-purple-100">Rank: {progress.rank}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{progress.xp.toLocaleString()} XP</p>
          <p className="text-purple-100">Level {progress.level}</p>
        </div>
      </div>

      {nextLevel && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress to {nextLevel.name}</span>
            <span>{Math.floor(progressPercent)}%</span>
          </div>
          <div className="w-full bg-purple-300 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-purple-100 mt-1">
            {progress.xpToNextLevel} XP needed for next level
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-white/20 rounded-lg p-3">
          <p className="text-2xl font-bold">{progress.dailyStreak}</p>
          <p className="text-sm">Day Streak</p>
        </div>
        <div className="bg-white/20 rounded-lg p-3">
          <p className="text-2xl font-bold">{progress.totalTrades}</p>
          <p className="text-sm">Total Trades</p>
        </div>
      </div>
    </div>
  );
}
