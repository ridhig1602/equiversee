'use client';
import { useState, useEffect } from 'react';
import { DailyChallenge, dailyChallenges, completeChallenge } from '@/lib/challenges';

export default function LearningChallenges() {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = () => {
    const updatedChallenges = dailyChallenges.map(challenge => ({
      ...challenge,
      completed: localStorage.getItem(`challenge-${challenge.id}`) === 'completed'
    }));
    setChallenges(updatedChallenges);
  };

  const handleComplete = (challengeId: string) => {
    const xpEarned = completeChallenge(challengeId);
    
    const currentXP = parseInt(localStorage.getItem('user-xp') || '0');
    localStorage.setItem('user-xp', (currentXP + xpEarned).toString());
    
    loadChallenges();
    
    alert(`🎉 Challenge completed! +${xpEarned} XP earned!`);
  };

  const completedCount = challenges.filter(c => c.completed).length;
  const totalCount = challenges.length;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Daily Challenges</h3>
        <span className="text-sm text-gray-500">
          {completedCount}/{totalCount} completed
        </span>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className={`p-4 border rounded-lg ${
              challenge.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold">{challenge.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  +{challenge.xpReward} XP
                </span>
              </div>
              
              <button
                onClick={() => handleComplete(challenge.id)}
                disabled={challenge.completed}
                className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium ${
                  challenge.completed
                    ? 'bg-green-500 text-white cursor-default'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {challenge.completed ? '✅ Done' : 'Start'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {completedCount === totalCount && (
        <div className="mt-4 p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg text-white text-center">
          🎊 All daily challenges completed! Amazing work!
        </div>
      )}
    </div>
  );
}
