
import { XPManager } from './xpManager';

export class TradingXP {
  static awardXPForTrade(type: 'BUY' | 'SELL', quantity: number, profit?: number) {
    // Base XP for any trade
    let xpEarned = XPManager.awardXPForAction('complete_trade');
    
    // Bonus XP for larger trades
    if (quantity >= 100) {
      xpEarned += XPManager.awardXPForAction('complete_trade');
    }
    
    // Bonus XP for profitable trades
    if (profit && profit > 0) {
      xpEarned += XPManager.awardXPForAction('profit_trade');
    }
    
    return xpEarned;
  }

  static updateTradingStats() {
    const currentTrades = parseInt(localStorage.getItem('total-trades') || '0');
    localStorage.setItem('total-trades', (currentTrades + 1).toString());
    
    const today = new Date().toDateString();
    const lastActive = localStorage.getItem('last-active-date') || today;
    
    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActive === yesterday.toDateString()) {
        const currentStreak = parseInt(localStorage.getItem('daily-streak') || '0');
        localStorage.setItem('daily-streak', (currentStreak + 1).toString());
      } else {
        localStorage.setItem('daily-streak', '1');
      }
      localStorage.setItem('last-active-date', today);
    }
  }
}
