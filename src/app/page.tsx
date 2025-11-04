import LevelSystem from '@/components/gamification/LevelSystem';
import MarketMoodBoard from '@/components/market/MarketMoodBoard';
import LearningChallenges from '@/components/challenges/LearningChallenges';
import EmotionCheckin from '@/components/personality/EmotionCheckin';
import VirtualMarketplace from '@/components/gamification/VirtualMarketplace';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Row: Level + Market Mood */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <LevelSystem />
          </div>
          <div>
            <MarketMoodBoard />
          </div>
        </div>

        {/* Middle Row: Personality + Challenges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <EmotionCheckin />
          <LearningChallenges />
        </div>

        {/* Bottom Row: Marketplace */}
        <div>
          <VirtualMarketplace />
        </div>
      </div>
    </div>
  );
}
