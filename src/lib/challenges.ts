export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'LEARNING' | 'TRADING' | 'ANALYSIS';
  xpReward: number;
  completed: boolean;
  action: string;
}

export const dailyChallenges: DailyChallenge[] = [
  {
    id: '1',
    title: '📚 Learn About SIP',
    description: 'Watch a 5-minute video on Systematic Investment Plans',
    type: 'LEARNING',
    xpReward: 50,
    completed: false,
    action: '/learn'
  },
  {
    id: '2',
    title: '🔮 Predict Market Trend',
    description: 'Make a prediction for tomorrow\'s market direction',
    type: 'ANALYSIS', 
    xpReward: 75,
    completed: false,
    action: '/trading'
  },
  {
    id: '3',
    title: '💼 Make Your First Trade',
    description: 'Execute a mock trade in the simulator',
    type: 'TRADING',
    xpReward: 100,
    completed: false,
    action: '/trading'
  },
  {
    id: '4',
    title: '🧠 Take Personality Quiz',
    description: 'Discover your investor personality type',
    type: 'LEARNING',
    xpReward: 150,
    completed: false,
    action: '/personality'
  }
];

export function completeChallenge(challengeId: string): number {
  const challenge = dailyChallenges.find(c => c.id === challengeId);
  if (challenge && !challenge.completed) {
    challenge.completed = true;
    localStorage.setItem(`challenge-${challengeId}`, 'completed');
    
    // Award XP through the XP manager
    const currentXP = parseInt(localStorage.getItem('user-xp') || '0');
    const newXP = currentXP + challenge.xpReward;
    localStorage.setItem('user-xp', newXP.toString());
    
    // Trigger XP update event
    window.dispatchEvent(new CustomEvent('xp-updated', { 
      detail: { newXP, xpEarned: challenge.xpReward, action: 'daily_challenge' }
    }));
    
    return challenge.xpReward;
  }
  return 0;
}
