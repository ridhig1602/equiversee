export interface PersonalityResult {
  type: 'CALM_INVESTOR' | 'RISK_LOVER' | 'OVERTHINKER' | 'ANALYTICAL' | 'IMPULSIVE';
  badge: string;
  description: string;
  strengths: string[];
  improvements: string[];
}

export const personalityQuestions = [
  {
    id: 1,
    question: "When a stock drops 10%, your first reaction is:",
    options: [
      { text: "Sell immediately to prevent more loss", score: { IMPULSIVE: 2, OVERTHINKER: 1 } },
      { text: "Research why it dropped and hold", score: { ANALYTICAL: 2, CALM_INVESTOR: 1 } },
      { text: "Buy more - it's a discount!", score: { RISK_LOVER: 2 } }
    ]
  },
  {
    id: 2,
    question: "How often do you check your portfolio?",
    options: [
      { text: "Multiple times daily", score: { OVERTHINKER: 2, IMPULSIVE: 1 } },
      { text: "Once a day", score: { ANALYTICAL: 1 } },
      { text: "A few times weekly", score: { CALM_INVESTOR: 2 } }
    ]
  },
  {
    id: 3, 
    question: "Your investment research involves:",
    options: [
      { text: "Following social media trends", score: { IMPULSIVE: 2 } },
      { text: "Detailed technical analysis", score: { ANALYTICAL: 2 } },
      { text: "Gut feeling and quick decisions", score: { RISK_LOVER: 2 } }
    ]
  }
];

export function calculatePersonality(answers: number[]): PersonalityResult {
  const scores = {
    CALM_INVESTOR: 0,
    RISK_LOVER: 0,
    OVERTHINKER: 0,
    ANALYTICAL: 0,
    IMPULSIVE: 0
  };

  // Calculate scores
  answers.forEach((answerIndex, questionIndex) => {
    const question = personalityQuestions[questionIndex];
    const selectedOption = question.options[answerIndex];
    
    Object.entries(selectedOption.score).forEach(([type, score]) => {
      scores[type as keyof typeof scores] += score;
    });
  });

  // Find dominant personality
  const dominantType = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0];

  return getPersonalityDetails(dominantType as keyof typeof scores);
}

function getPersonalityDetails(type: 'CALM_INVESTOR' | 'RISK_LOVER' | 'OVERTHINKER' | 'ANALYTICAL' | 'IMPULSIVE'): PersonalityResult {
  const personalities = {
    CALM_INVESTOR: {
      type: 'CALM_INVESTOR',
      badge: '🪷 Calm Investor',
      description: 'You stay composed during market volatility',
      strengths: ['Emotional control', 'Long-term thinking', 'Patience'],
      improvements: ['Could take more calculated risks']
    },
    RISK_LOVER: {
      type: 'RISK_LOVER', 
      badge: '🎯 Risk Lover',
      description: 'You thrive on high-risk, high-reward opportunities',
      strengths: ['Quick decision making', 'High risk tolerance'],
      improvements: ['Consider risk management', 'Avoid impulsive moves']
    },
    OVERTHINKER: {
      type: 'OVERTHINKER',
      badge: '🤔 Overthinker', 
      description: 'You analyze every detail but sometimes hesitate',
      strengths: ['Thorough research', 'Attention to detail'],
      improvements: ['Trust your analysis', 'Avoid analysis paralysis']
    },
    ANALYTICAL: {
      type: 'ANALYTICAL',
      badge: '📊 Analytical Master',
      description: 'You make data-driven investment decisions',
      strengths: ['Strong research skills', 'Logical thinking'],
      improvements: ['Balance data with intuition']
    },
    IMPULSIVE: {
      type: 'IMPULSIVE',
      badge: '⚡ Impulsive Trader',
      description: 'You make quick decisions based on instincts',
      strengths: ['Fast execution', 'Opportunity spotting'],
      improvements: ['Add more research', 'Set stop losses']
    }
  };

  return personalities[type];
}