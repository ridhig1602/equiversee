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
      
      // Award XP for completing personality test
      const currentXP = parseInt(localStorage.getItem('user-xp') || '0');
      localStorage.setItem('user-xp', (currentXP + 150).toString());
    }
  };

  if (showResult && result) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border text-center">
        <h3 className="text-2xl font-bold mb-4">Your Investor Personality</h3>
        <div className="text-4xl mb-4">{result.badge}</div>
        <p className="text-gray-600 mb-4">{result.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div>
            <h4 className="font-semibold text-green-600">Strengths</h4>
            <ul className="list-disc list-inside">
              {result.strengths.map((strength: string, i: number) => (
                <li key={i}>{strength}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-orange-600">Improvements</h4>
            <ul className="list-disc list-inside">
              {result.improvements.map((improvement: string, i: number) => (
                <li key={i}>{improvement}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <button 
          onClick={() => setShowResult(false)}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continue Trading
        </button>
      </div>
    );
  }

  const question = personalityQuestions[currentQuestion];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border">
      <div className="text-center mb-2">
        <span className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {personalityQuestions.length}
        </span>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / personalityQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-6 text-center">{question.question}</h3>
      
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className="w-full p-4 text-left border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
