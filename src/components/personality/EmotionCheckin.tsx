'use client';
import { useState } from 'react';
import { personalityQuestions, calculatePersonality, PersonalityResult } from '@/lib/personalityQuiz';

export default function EmotionCheckin() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<PersonalityResult | null>(null);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const personalityResult = calculatePersonality(newAnswers);
      setResult(personalityResult);
      setShowResult(true);
      
      localStorage.setItem('investor-personality', JSON.stringify(personalityResult));
      
      const currentXP = parseInt(localStorage.getItem('user-xp') || '0');
      localStorage.setItem('user-xp', (currentXP + 150).toString());
    }
  };

  if (showResult && result) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border text-center">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Your Investor Personality</h3>
        <div className="text-4xl mb-4">{result.badge}</div>
        <p className="text-gray-700 mb-4 text-lg">{result.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div>
            <h4 className="font-semibold text-green-600 text-lg">Strengths</h4>
            <ul className="list-disc list-inside text-gray-700">
              {result.strengths.map((strength: string, i: number) => (
                <li key={i} className="mb-1">{strength}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-orange-600 text-lg">Improvements</h4>
            <ul className="list-disc list-inside text-gray-700">
              {result.improvements.map((improvement: string, i: number) => (
                <li key={i} className="mb-1">{improvement}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <button 
          onClick={() => setShowResult(false)}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold"
        >
          Continue Trading
        </button>
      </div>
    );
  }

  const question = personalityQuestions[currentQuestion];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border">
      <div className="text-center mb-4">
        <span className="text-sm text-gray-600 font-medium">
          Question {currentQuestion + 1} of {personalityQuestions.length}
        </span>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / personalityQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-6 text-center text-gray-800">
        {question.question}
      </h3>
      
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-gray-800 font-medium text-lg"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
