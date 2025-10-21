'use client'
import { motion } from 'framer-motion'

export default function LeaderboardPage() {
  const leaderboardData = [
    { rank: 1, name: 'Arjun Kumar', score: 9850, profit: '+₹45,230', avatar: '👨‍💻' },
    { rank: 2, name: 'Neha Singh', score: 9420, profit: '+₹38,150', avatar: '👩‍🎓' },
    { rank: 3, name: 'Rahul Verma', score: 9150, profit: '+₹32,890', avatar: '👨‍💼' },
    { rank: 4, name: 'Priya Patel', score: 8870, profit: '+₹28,450', avatar: '👩‍💻' },
    { rank: 5, name: 'Amit Sharma', score: 8560, profit: '+₹25,670', avatar: '👨‍🎓' },
    { rank: 6, name: 'Sneha Reddy', score: 8230, profit: '+₹22,340', avatar: '👩‍🏫' },
    { rank: 7, name: 'Vikram Malhotra', score: 7980, profit: '+₹19,870', avatar: '👨‍🚀' },
    { rank: 8, name: 'Ananya Das', score: 7650, profit: '+₹17,650', avatar: '👩‍🚀' }
  ]

  const challenges = [
    { title: 'Weekly Trading Challenge', reward: '5,000 Points', participants: '1,234', endsIn: '2 days' },
    { title: 'Risk Management Master', reward: '3,000 Points', participants: '856', endsIn: '5 days' },
    { title: 'Portfolio Diversity Pro', reward: '2,500 Points', participants: '642', endsIn: '7 days' }
  ]

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
            Leaderboard & Challenges
          </h1>
          <p className="text-xl text-gray-300">
            Compete with traders worldwide and climb the ranks!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Global Leaderboard</h2>
              
              {/* Top 3 Podium */}
              <div className="flex justify-center items-end space-x-4 mb-8">
                {leaderboardData.slice(0, 3).map((user, index) => (
                  <motion.div
                    key={user.rank}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className={`text-center ${
                      index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'
                    }`}
                  >
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl mb-2 mx-auto ${
                      index === 0 ? 'bg-yellow-500/20 border-2 border-yellow-400' :
                      index === 1 ? 'bg-gray-400/20 border-2 border-gray-400' :
                      'bg-orange-500/20 border-2 border-orange-400'
                    }`}>
                      {user.avatar}
                    </div>
                    <div className={`text-lg font-bold ${
                      index === 0 ? 'text-yellow-400' :
                      index === 1 ? 'text-gray-400' :
                      'text-orange-400'
                    }`}>
                      #{user.rank}
                    </div>
                    <div className="text-white font-semibold">{user.name}</div>
                    <div className="text-green-400 text-sm">{user.profit}</div>
                  </motion.div>
                ))}
              </div>

              {/* Leaderboard List */}
              <div className="space-y-3">
                {leaderboardData.slice(3).map((user, index) => (
                  <motion.div
                    key={user.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + 3) * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-lg">{user.avatar}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">{user.name}</div>
                        <div className="text-sm text-gray-400">Rank #{user.rank}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">{user.score} pts</div>
                      <div className="text-green-400 text-sm">{user.profit}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Challenges */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Active Challenges</h2>
              
              <div className="space-y-4">
                {challenges.map((challenge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300"
                  >
                    <h3 className="font-semibold text-white mb-2">{challenge.title}</h3>
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>Reward: {challenge.reward}</span>
                      <span>{challenge.participants} players</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Ends in {challenge.endsIn}</span>
                      <button className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                        Join
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* User Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <h3 className="font-semibold text-white mb-4">Your Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current Rank</span>
                    <span className="text-white">#42</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Points</span>
                    <span className="text-white">3,450</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Virtual Profit</span>
                    <span className="text-green-400">+₹12,340</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Challenges Completed</span>
                    <span className="text-white">7</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}