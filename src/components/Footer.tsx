export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-900/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-xl font-bold text-white">Equiverse</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Empowering the next generation of investors through AI-powered gamified financial education and risk-free virtual trading.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><a href="/learn" className="text-gray-400 hover:text-white transition-colors">Learning Modules</a></li>
              <li><a href="/trading" className="text-gray-400 hover:text-white transition-colors">Trading Simulator</a></li>
              <li><a href="/leaderboard" className="text-gray-400 hover:text-white transition-colors">Leaderboard</a></li>
              <li><a href="/mentorship" className="text-gray-400 hover:text-white transition-colors">Mentorship</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Equiverse. Made with ❤️ for financial education.
          </p>
        </div>
      </div>
    </footer>
  )
}