import EmotionCheckin from '@/components/personality/EmotionCheckin';

export default function PersonalityPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Discover Your Investor Personality
          </h1>
          <p className="text-lg text-gray-600">
            Take this quick quiz to understand your investing style and get personalized insights
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <EmotionCheckin />
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md border text-center">
            <div className="text-3xl mb-3">🪷</div>
            <h3 className="font-semibold mb-2">Calm Investor</h3>
            <p className="text-sm text-gray-600">Stays composed during market volatility</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border text-center">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">Risk Lover</h3>
            <p className="text-sm text-gray-600">Thrives on high-risk, high-reward opportunities</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border text-center">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold mb-2">Analytical Master</h3>
            <p className="text-sm text-gray-600">Makes data-driven investment decisions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
