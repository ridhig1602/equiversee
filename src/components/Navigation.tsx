'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Learn', href: '/learn' },
    { name: 'Trading', href: '/trading' },
    { name: 'AI Mentor', href: '/ai-mentor' }, // 🆕 NEW AI MENTOR LINK
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Mentorship', href: '/mentorship' },
  ]

  return (
    <nav className="border-b border-white/10 bg-slate-900/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <span className="text-xl font-bold text-white">Equiverse</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-all duration-200 ${
                  pathname === item.href
                    ? 'text-white font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
                >
                  <span className="text-xl">{user.avatar}</span>
                  <span className="hidden sm:block">{user.name}</span>
                  <span>▼</span>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/10 rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-300 border-b border-white/10">
                      {user.email}
                    </div>
                    <button
                      onClick={() => {
                        logout()
                        setShowDropdown(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}