export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'LESSON' | 'ADVICE' | 'FEATURE' | 'BADGE';
  icon: string;
}

export const marketplaceItems: MarketplaceItem[] = [
  {
    id: 'expert-advice',
    name: '💬 Expert Advice Session',
    description: '15-minute chat with investment expert',
    cost: 5000,
    type: 'ADVICE',
    icon: '💬'
  },
  {
    id: 'advanced-course',
    name: '🎓 Advanced Trading Course',
    description: 'Unlock premium technical analysis course',
    cost: 3000,
    type: 'LESSON', 
    icon: '🎓'
  },
  {
    id: 'golden-badge',
    name: '⭐ Golden Investor Badge',
    description: 'Exclusive badge for your profile',
    cost: 2000,
    type: 'BADGE',
    icon: '⭐'
  },
  {
    id: 'mock-ipo',
    name: '📈 Mock IPO Access',
    description: 'Participate in simulated IPOs',
    cost: 1500,
    type: 'FEATURE',
    icon: '📈'
  }
];

export function purchaseItem(itemId: string, userXP: number): boolean {
  const item = marketplaceItems.find(i => i.id === itemId);
  if (!item || userXP < item.cost) return false;
  
  const newXP = userXP - item.cost;
  localStorage.setItem('user-xp', newXP.toString());
  
  const purchases = JSON.parse(localStorage.getItem('marketplace-purchases') || '[]');
  purchases.push(itemId);
  localStorage.setItem('marketplace-purchases', JSON.stringify(purchases));
  
  return true;
}
