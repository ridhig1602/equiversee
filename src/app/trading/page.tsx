'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { saveUserTradingData, loadUserTradingData } from '@/utils/userData'
import { TradingXP } from '@/lib/tradingXP' // ← ADDED

// Helper function to avoid hydration errors
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-IN').format(num)
}

// Mock stock data
const MOCK_STOCKS = [
  { 
    symbol: 'RELIANCE', 
    name: 'Reliance Industries', 
    currentPrice: 2456.75, 
    change: 32.50, 
    changePercent: 1.34, 
    volume: 4521890, 
    marketCap: '15.2L Cr', 
    sector: 'Energy' 
  },
  { 
    symbol: 'TCS', 
    name: 'Tata Consultancy', 
    currentPrice: 3456.25, 
    change: -28.75, 
    changePercent: -0.82, 
    volume: 2890450, 
    marketCap: '12.8L Cr', 
    sector: 'IT' 
  },
  { 
    symbol: 'INFY', 
    name: 'Infosys', 
    currentPrice: 1678.90, 
    change: 34.60, 
    changePercent: 2.10, 
    volume: 5678321, 
    marketCap: '6.9L Cr', 
    sector: 'IT' 
  },
  { 
    symbol: 'HDFCBANK', 
    name: 'HDFC Bank', 
    currentPrice: 1567.30, 
    change: 7.80, 
    changePercent: 0.50, 
    volume: 3890456, 
    marketCap: '11.5L Cr', 
    sector: 'Banking' 
  },
  { 
    symbol: 'BAJFINANCE', 
    name: 'Bajaj Finance', 
    currentPrice: 6789.45, 
    change: -103.25, 
    changePercent: -1.50, 
    volume: 1234567, 
    marketCap: '4.2L Cr', 
    sector: 'Finance' 
  }
]

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

export default function TradingPage() {
  const { user } = useAuth()
  const [walletBalance, setWalletBalance] = useState(100000)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedStock, setSelectedStock] = useState('')
  const [quantity, setQuantity] = useState('')
  const [stocks] = useState(MOCK_STOCKS)

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      const userData = loadUserTradingData(user.id)
      setWalletBalance(userData.walletBalance)
      setPortfolio(userData.portfolio)
      setTransactions(userData.transactions)
    }
  }, [user])

  // Save user data whenever it changes
  useEffect(() => {
    if (user && portfolio.length > 0) {
      saveUserTradingData(user.id, {
        walletBalance,
        portfolio,
        transactions
      })
    }
  }, [walletBalance, portfolio, transactions, user])

  // Calculate portfolio value
  const portfolioValue = portfolio.reduce((total, item) => {
    return total + (item.quantity * item.currentPrice)
  }, 0)

  const totalProfitLoss = portfolio.reduce((total, item) => {
    return total + (item.quantity * (item.currentPrice - item.buyPrice))
  }, 0)

  const buyStock = () => {
    if (!user) {
      toast.error('Please sign in to trade')
      return
    }

    const stock = stocks.find(s => s.symbol === selectedStock)
    if (!stock || !quantity) {
      toast.error('Please select stock and quantity')
      return
    }

    const qty = parseInt(quantity)
    const price = stock.currentPrice
    const totalCost = price * qty

    if (totalCost > walletBalance) {
      toast.error('Insufficient balance!')
      return
    }

    // Update portfolio
    const existingItem = portfolio.find(item => item.symbol === selectedStock)
    let newPortfolio: PortfolioItem[]
    
    if (existingItem) {
      newPortfolio = portfolio.map(item => 
        item.symbol === selectedStock 
          ? {
              ...item,
              quantity: item.quantity + qty,
              buyPrice: (item.buyPrice * item.quantity + price * qty) / (item.quantity + qty)
            }
          : item
      )
    } else {
      newPortfolio = [...portfolio, {
        symbol: selectedStock,
        quantity: qty,
        buyPrice: price,
        currentPrice: price
      }]
    }

    // Add transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'BUY',
      symbol: selectedStock,
      quantity: qty,
      price: price,
      total: totalCost,
      timestamp: new Date()
    }

    setPortfolio(newPortfolio)
    setTransactions([newTransaction, ...transactions])
    setWalletBalance(prev => prev - totalCost)

    // 🎮 XP SYSTEM - Add these 2 lines
    const xpEarned = TradingXP.awardXPForTrade('BUY', qty);
    TradingXP.updateTradingStats();
    
    toast.success(`✅ Bought ${qty} shares of ${stock.symbol} for ₹${formatNumber(totalCost)}`)
    setQuantity('')
  }

  const sellStock = (symbol: string) => {
    if (!user) {
      toast.error('Please sign in to trade')
      return
    }

    const stock = stocks.find(s => s.symbol === symbol)
    const portfolioItem = portfolio.find(item => item.symbol === symbol)
    
    if (!stock || !portfolioItem) return

    const price = stock.currentPrice
    const totalValue = price * portfolioItem.quantity

    // Remove from portfolio
    const newPortfolio = portfolio.filter(item => item.symbol !== symbol)

    // Add transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'SELL',
      symbol: symbol,
      quantity: portfolioItem.quantity,
      price: price,
      total: totalValue,
      timestamp: new Date()
    }

    setPortfolio(newPortfolio)
    setTransactions([newTransaction, ...transactions])
    setWalletBalance(prev => prev + totalValue)

    // 🎮 XP SYSTEM - Add these 3 lines
    const profit = (price - portfolioItem.buyPrice) * portfolioItem.quantity;
    const xpEarned = TradingXP.awardXPForTrade('SELL', portfolioItem.quantity, profit);
    TradingXP.updateTradingStats();
    
    toast.success(`💰 Sold ${portfolioItem.quantity} shares of ${symbol} for ₹${formatNumber(totalValue)}`)
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Virtual Trading Simulator
          </h1>
          <p className="text-xl text-gray-300">
            {user ? `Welcome back, ${user.name}!` : 'Practice trading with ₹100,000 virtual money'}
          </p>
          {!user && (
            <p className="text-yellow-400 mt-2">
              Sign in to save your progress permanently!
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Wallet Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
            >
              <h2 className="text-2xl font-bold mb-2">Virtual Wallet</h2>
              <div className="text-3xl font-bold mb-2">₹{formatNumber(walletBalance)}</div>
              <div className="flex justify-between text-sm">
                <span>Portfolio Value:</span>
                <span>₹{formatNumber(portfolioValue)}</span>
              </div>
              <div className={`flex justify-between text-sm ${totalProfitLoss >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                <span>Total P&L:</span>
                <span>{totalProfitLoss >= 0 ? '+' : ''}₹{formatNumber(totalProfitLoss)}</span>
              </div>
              {user && (
                <div className="text-xs text-blue-200 mt-2">
                  ✅ Data saved for {user.name}
                </div>
              )}
            </motion.div>

            {/* Trading Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Trade Stocks</h3>
              
              {!user && (
                <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-300 text-sm">
                    🔒 Sign in to save your trades permanently
                  </p>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Select Stock</label>
                  <select 
                    value={selectedStock}
                    onChange={(e) => setSelectedStock(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="">Choose a stock</option>
                    {stocks.map(stock => (
                      <option key={stock.symbol} value={stock.symbol}>
                        {stock.symbol} - ₹{stock.currentPrice}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                    placeholder="Enter quantity"
                  />
                </div>

                <button
                  onClick={buyStock}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
                >
                  Buy Stock
                </button>
              </div>
            </motion.div>

            {/* PORTFOLIO SECTION */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Your Portfolio</h3>
              
              {portfolio.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📭</div>
                  <p className="text-gray-400">No stocks in portfolio</p>
                  <p className="text-sm text-gray-500 mt-2">Buy stocks to see them here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolio.map((item) => {
                    const profitLoss = (item.currentPrice - item.buyPrice) * item.quantity
                    const profitLossPercent = ((item.currentPrice - item.buyPrice) / item.buyPrice) * 100
                    
                    return (
                      <div key={item.symbol} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <div className="font-semibold text-white">{item.symbol}</div>
                          <div className="text-sm text-gray-400">{item.quantity} shares</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-white">₹{formatNumber(item.quantity * item.currentPrice)}</div>
                          <div className={`text-sm ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {profitLoss >= 0 ? '+' : ''}₹{profitLoss.toFixed(0)} ({profitLossPercent.toFixed(1)}%)
                          </div>
                          <button
                            onClick={() => sellStock(item.symbol)}
                            className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded mt-1 hover:bg-red-500/30 transition-colors"
                          >
                            Sell All
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Portfolio Performance</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { time: '9:00', value: 100000 },
                    { time: '10:00', value: 101200 },
                    { time: '11:00', value: 100500 },
                    { time: '12:00', value: 102300 },
                    { time: '13:00', value: 103100 },
                    { time: '14:00', value: 102800 },
                    { time: '15:00', value: portfolioValue || 103500 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      dot={{ fill: '#8B5CF6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Stocks List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">📈 Available Stocks</h3>
              <div className="space-y-3">
                {stocks.map((stock) => (
                  <div 
                    key={stock.symbol} 
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedStock(stock.symbol)}
                  >
                    <div>
                      <div className="font-semibold text-white">{stock.symbol}</div>
                      <div className="text-sm text-gray-400">{stock.name}</div>
                      <div className="text-xs text-gray-500">{stock.sector} • {stock.marketCap}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">₹{stock.currentPrice}</div>
                      <div className={`text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                      </div>
                      <div className="text-xs text-gray-400">Vol: {formatNumber(stock.volume)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Transaction History */}
            {transactions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  Transaction History {user && `(${transactions.length} trades)`}
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'BUY' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          <span className={transaction.type === 'BUY' ? 'text-green-400' : 'text-red-400'}>
                            {transaction.type === 'BUY' ? '⬆️' : '⬇️'}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-white">{transaction.symbol}</div>
                          <div className="text-sm text-gray-400">
                            {transaction.type} • {transaction.quantity} shares
                          </div>
                          <div className="text-xs text-gray-500">
                            {transaction.timestamp.toLocaleDateString()} at {transaction.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${transaction.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                          {transaction.type === 'BUY' ? '-' : '+'}₹{formatNumber(transaction.total)}
                        </div>
                        <div className="text-sm text-gray-400">
                          @₹{transaction.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}