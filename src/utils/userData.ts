interface PortfolioItem {
  symbol: string
  quantity: number
  buyPrice: number
  currentPrice: number
}

interface Transaction {
  id: string
  type: 'BUY' | 'SELL'
  symbol: string
  quantity: number
  price: number
  total: number
  timestamp: Date
}

interface UserTradingData {
  walletBalance: number
  portfolio: PortfolioItem[]
  transactions: Transaction[]
}

// Get user-specific storage key
const getUserKey = (userId: string, key: string) => `equiverse_${userId}_${key}`

// Save trading data for user
export const saveUserTradingData = (userId: string, data: UserTradingData) => {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(getUserKey(userId, 'trading_data'), JSON.stringify({
    ...data,
    transactions: data.transactions.map(t => ({
      ...t,
      timestamp: t.timestamp.toISOString()
    }))
  }))
}

// Load trading data for user
export const loadUserTradingData = (userId: string): UserTradingData => {
  if (typeof window === 'undefined') {
    return {
      walletBalance: 100000,
      portfolio: [],
      transactions: []
    }
  }
  
  const saved = localStorage.getItem(getUserKey(userId, 'trading_data'))
  if (saved) {
    const data = JSON.parse(saved)
    return {
      ...data,
      transactions: data.transactions.map((t: Transaction & { timestamp: string }) => ({
        ...t,
        timestamp: new Date(t.timestamp)
      }))
    }
  }
  
  // Default data for new users
  return {
    walletBalance: 100000,
    portfolio: [],
    transactions: []
  }
}

// Save quiz progress
export const saveUserQuizProgress = (userId: string, progress: Record<string, unknown>) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(getUserKey(userId, 'quiz_progress'), JSON.stringify(progress))
}

// Load quiz progress
export const loadUserQuizProgress = (userId: string): Record<string, unknown> => {
  if (typeof window === 'undefined') return {}
  
  const saved = localStorage.getItem(getUserKey(userId, 'quiz_progress'))
  return saved ? JSON.parse(saved) : {}
}