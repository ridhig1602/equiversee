export interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  rank: string;
  completedModules: string[];
  dailyStreak: number;
  lastActiveDate: string;
  totalTrades: number;
  badges: string[];
}

export const LEVEL_SYSTEM = [
  { level: 1, name: "💰 Investing Rookie", xpRequired: 0, badge: "🌱" },
  { level: 2, name: "📈 Market Learner", xpRequired: 1000, badge: "🎯" },
  { level: 3, name: "💼 Portfolio Manager", xpRequired: 2500, badge: "⚡" },
  { level: 4, name: "🎮 Trading Pro", xpRequired: 5000, badge: "🚀" },
  { level: 5, name: "🏆 Market Wizard", xpRequired: 10000, badge: "👑" }
];

export const RANKS = {
  0: "Newbie",
  1000: "Investor", 
  2500: "Trader",
  5000: "Expert",
  10000: "Master"
};

export function awardXP(action: string, currentXP: number): number {
  const xpRewards: { [key: string]: number } = {
    'daily_login': 50,
    'complete_trade': 25,
    'profit_trade': 50,
    'complete_module': 200,
    'complete_quiz': 100,
    'personality_test': 150,
    'daily_challenge': 75,
    'invite_friend': 300
  };

  return xpRewards[action] || 10;
}

export function calculateLevel(xp: number): number {
  for (let i = LEVEL_SYSTEM.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_SYSTEM[i].xpRequired) {
      return LEVEL_SYSTEM[i].level;
    }
  }
  return 1;
}

export function getRank(xp: number): string {
  const ranks = Object.entries(RANKS)
    .sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
  
  for (const [threshold, rank] of ranks) {
    if (xp >= parseInt(threshold)) {
      return rank;
    }
  }
  return "Newbie";
}

export function updateDailyStreak(lastActive: string): number {
  const today = new Date().toDateString();
  const lastDate = new Date(lastActive).toDateString();
  
  if (lastActive === today) {
    return getCurrentStreak();
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (lastDate === yesterday.toDateString()) {
    const currentStreak = getCurrentStreak();
    localStorage.setItem('daily-streak', (currentStreak + 1).toString());
    localStorage.setItem('last-active-date', today);
    return currentStreak + 1;
  } else {
    localStorage.setItem('daily-streak', '1');
    localStorage.setItem('last-active-date', today);
    return 1;
  }
}

function getCurrentStreak(): number {
  return parseInt(localStorage.getItem('daily-streak') || '0');
}
