
import { awardXP } from './gamification';

export class XPManager {
  static awardXPForAction(action: string) {
    const currentXP = parseInt(localStorage.getItem('user-xp') || '0');
    const xpEarned = awardXP(action, currentXP);
    const newXP = currentXP + xpEarned;
    
    localStorage.setItem('user-xp', newXP.toString());
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('xp-updated', { 
        detail: { newXP, xpEarned, action }
      }));
    }
    
    return xpEarned;
  }

  static getCurrentXP(): number {
    return parseInt(localStorage.getItem('user-xp') || '0');
  }

  static initializeUser() {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('user-xp')) {
        localStorage.setItem('user-xp', '0');
      }
      if (!localStorage.getItem('total-trades')) {
        localStorage.setItem('total-trades', '0');
      }
      if (!localStorage.getItem('daily-streak')) {
        localStorage.setItem('daily-streak', '0');
        localStorage.setItem('last-active-date', new Date().toDateString());
      }
    }
  }
}

if (typeof window !== 'undefined') {
  XPManager.initializeUser();
}
