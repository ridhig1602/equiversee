'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface Mentor {
  id: number
  name: string
  role: string
  experience: string
  specialization: string
  rating: number
  sessions: number
  avatar: string
  bio: string
  availability: string[]
  price: string
}

export default function MentorshipPage() {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('')

  const mentors: Mentor[] = [
    {
      id: 1,
      name: 'Rajiv Mehta',
      role: 'Senior Portfolio Manager',
      experience: '15+ years',
      specialization: 'Equity Markets, Portfolio Strategy',
      rating: 4.9,
      sessions: 234,
      avatar: '👨‍💼',
      bio: 'Former hedge fund manager with expertise in long-term wealth building and risk management strategies.',
      availability: ['Mon', 'Wed', 'Fri'],
      price: 'Free'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      role: 'Financial Advisor',
      experience: '12+ years',
      specialization: 'Personal Finance, Investment Planning',
      rating: 4.8,
      sessions: 189,
      avatar: '👩‍💼',
      bio: 'Certified financial planner helping beginners build strong financial foundations and investment habits.',
      availability: ['Tue', 'Thu', 'Sat'],
      price: 'Free'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      role: 'Trading Expert',
      experience: '10+ years',
      specialization: 'Technical Analysis, Day Trading',
      rating: 4.7,
      sessions: 156,
      avatar: '👨‍🚀',
      bio: 'Professional trader specializing in technical analysis and short-term trading strategies.',
      availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      price: 'Free'
    },
    {
      id: 4,
      name: 'Neha Gupta',
      role: 'Wealth Manager',
      experience: '14+ years',
      specialization: 'Retirement Planning, Mutual Funds',
      rating: 4.9,
      sessions: 201,
      avatar: '👩‍🎓',
      bio: 'Wealth management expert focused on sustainable investing and retirement planning strategies.',
      availability: ['Wed', 'Thu', 'Sat'],
      price: 'Free'
    }
  ]

  const handleBookSession = (mentor: Mentor) => {
    if (!bookingDate || !bookingTime) {
      toast.error('Please select date and time')
      return
    }
    setSelectedMentor(null)
    setBookingDate('')
    setBookingTime('')
    toast.success(`Session booked with ${mentor.name} on ${bookingDate} at ${bookingTime}`)
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
            AI Mentorship Hub
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Learn from experienced financial mentors and get personalized guidance on your investment journey
          </p>
        </motion.div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {mentors.map((mentor, index) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  {mentor.avatar}
                </div>
                <h3 className="text-xl font-semibold text-white">{mentor.name}</h3>
                <p className="text-gray-400 text-sm">{mentor.role}</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Experience</span>
                  <span className="text-white">{mentor.experience}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Rating</span>
                  <span className="text-yellow-400">{mentor.rating} ★</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Sessions</span>
                  <span className="text-white">{mentor.sessions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Price</span>
                  <span className="text-green-400">{mentor.price}</span>
                </div>
              </div>

              <div className="text-sm text-gray-300 mb-4 line-clamp-3">
                {mentor.bio}
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {mentor.availability.map((day) => (
                  <span key={day} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                    {day}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setSelectedMentor(mentor)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                Book Session
              </button>
            </motion.div>
          ))}
        </div>

        {/* Booking Modal */}
        {selectedMentor && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-white mb-2">
                Book with {selectedMentor.name}
              </h3>
              <p className="text-gray-400 mb-6">{selectedMentor.role}</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Select Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Select Time</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="">Choose time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelectedMentor(null)}
                    className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleBookSession(selectedMentor)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* AI Mentor Feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">AI Financial Assistant</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Get instant answers to your financial questions with our AI-powered assistant. 
            Available 24/7 to help with investment strategies, market analysis, and personal finance guidance.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105">
            🤖 Chat with AI Assistant
          </button>
        </motion.div>
      </div>
    </div>
  )
}