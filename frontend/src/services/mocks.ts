import type { Quiz, User, Question } from '../types';

export const MOCK_USER: User = {
  id: 'me',
  name: 'Alex Gamer',
  username: 'AlexGamer',
  level: 42,
  total_xp: 15400,
  xpToNextLevel: 20000,
  title: 'Quiz Master',
  totalInk: 1250,
  inkDrops: 4,
  maxInkDrops: 5,
  streak: 12,
  coins: 250,
  equipped: {
    title: 'Mestre Arcanista',
  },
  stats: {
    MATEMATICA: { points: 750 },
    NATUREZA: { points: 920 },
    HUMANAS: { points: 640 },
    LINGUAGENS: { points: 480 }
  },
  arena_points: 2790,
  achievements: [],
  avatarUrl: 'https://i.pravatar.cc/150?u=me',
};

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: "q1",
    statement: "Qual é a capital da França?",
    options: [
      { id: "a", text: "Londres" },
      { id: "b", text: "Paris" },
      { id: "c", text: "Berlim" },
      { id: "d", text: "Madri" }
    ],
    correctOptionId: "b",
    explanation: "Paris é a capital e a cidade mais populosa da França."
  },
  {
    id: "q2",
    statement: "Quanto é 2 + 2?",
    options: [
      { id: "a", text: "3" },
      { id: "b", text: "4" },
      { id: "c", text: "5" },
      { id: "d", text: "6" }
    ],
    correctOptionId: "b",
    explanation: "A soma básica de 2 e 2 resulta em 4."
  }
];

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: '1',
    title: 'Advanced React Hooks',
    description: 'Teste seus conhecimentos sobre useMemo, useCallback e hooks customizados.',
    area: 'LINGUAGENS',
    author: { id: 'u1', name: 'FrontendMaster' },
    rating: 4.8,
    playCount: 1250,
    questionsCount: 2,
    difficulty: 'hard',
    category: 'Programming',
    tags: ['React', 'Hooks', 'Web'],
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    createdAt: '2026-04-10T10:00:00Z',
    questions: DEFAULT_QUESTIONS
  },
  {
    id: '2',
    title: 'Conhecimentos Gerais 2026',
    description: 'Um mix de história, geografia e cultura pop.',
    area: 'HUMANAS',
    author: { id: 'u2', name: 'QuizKing' },
    rating: 4.5,
    playCount: 8900,
    questionsCount: 2,
    difficulty: 'easy',
    category: 'Trivia',
    tags: ['História', 'Geografia'],
    imageUrl: 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?w=800&q=80',
    createdAt: '2026-04-09T14:30:00Z',
    questions: DEFAULT_QUESTIONS
  },
  {
    id: '3',
    title: 'Logaritmos e Funções',
    description: 'Domine a arte das funções exponenciais.',
    area: 'MATEMATICA',
    author: { id: 'u3', name: 'MathWizard' },
    rating: 4.8,
    playCount: 1023,
    questionsCount: 2,
    difficulty: 'medium',
    category: 'Math',
    tags: ['Cálculo', 'Funções'],
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    createdAt: '2026-04-08T09:15:00Z',
    questions: DEFAULT_QUESTIONS
  },
  {
    id: '4',
    title: 'Células e Genética',
    description: 'Você conhece o básico da vida?',
    area: 'NATUREZA',
    author: { id: 'u4', name: 'BioMaster' },
    rating: 4.7,
    playCount: 891,
    questionsCount: 2,
    difficulty: 'hard',
    category: 'Biology',
    tags: ['DNA', 'Biologia'],
    imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80',
    createdAt: '2026-04-07T16:45:00Z',
    questions: DEFAULT_QUESTIONS
  },
  {
    id: '5',
    title: 'Capitais do Mundo',
    description: 'Você consegue nomear as capitais do mundo todo?',
    area: 'HUMANAS',
    author: { id: 'u5', name: 'Globetrotter' },
    rating: 4.1,
    playCount: 723,
    questionsCount: 2,
    difficulty: 'medium',
    category: 'Geography',
    tags: ['Mundo', 'Geografia'],
    imageUrl: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&q=80',
    createdAt: '2026-04-06T11:20:00Z',
    questions: DEFAULT_QUESTIONS
  },
];

export const MOCK_RANKING = [
  { rank: 1, user: { ...MOCK_USER, id: 'u1', username: 'EliteMaster', stats: { MATEMATICA: { points: 1000 }, NATUREZA: { points: 980 }, HUMANAS: { points: 950 }, LINGUAGENS: { points: 990 } } }, accuracy: 99 },
  { rank: 2, user: { ...MOCK_USER, id: 'u2', username: 'QuizGod', stats: { MATEMATICA: { points: 950 }, NATUREZA: { points: 920 }, HUMANAS: { points: 910 }, LINGUAGENS: { points: 940 } } }, accuracy: 98 },
  { rank: 10, user: { ...MOCK_USER, id: 'u10', username: 'PlatinaNinja', stats: { MATEMATICA: { points: 750 }, NATUREZA: { points: 680 }, HUMANAS: { points: 710 }, LINGUAGENS: { points: 740 } } }, accuracy: 92 },
  { rank: 11, user: { ...MOCK_USER, id: 'u11', username: 'GoldHunter', stats: { MATEMATICA: { points: 550 }, NATUREZA: { points: 480 }, HUMANAS: { points: 510 }, LINGUAGENS: { points: 540 } } }, accuracy: 88 },
  { rank: 50, user: { ...MOCK_USER, id: 'u50', username: 'SilverFox', stats: { MATEMATICA: { points: 350 }, NATUREZA: { points: 320 }, HUMANAS: { points: 310 }, LINGUAGENS: { points: 340 } } }, accuracy: 85 },
  { rank: 51, user: { ...MOCK_USER, id: 'u51', username: 'BronzeKnight', stats: { MATEMATICA: { points: 200 }, NATUREZA: { points: 180 }, HUMANAS: { points: 150 }, LINGUAGENS: { points: 190 } } }, accuracy: 82 },
  { rank: 100, user: { ...MOCK_USER, id: 'u100', username: 'IronStarter', stats: { MATEMATICA: { points: 50 }, NATUREZA: { points: 40 }, HUMANAS: { points: 30 }, LINGUAGENS: { points: 60 } } }, accuracy: 75 },
  { rank: 101, user: { ...MOCK_USER, id: 'u101', username: 'NewbieQuiz', stats: { MATEMATICA: { points: 20 }, NATUREZA: { points: 15 }, HUMANAS: { points: 10 }, LINGUAGENS: { points: 25 } } }, accuracy: 70 },
  { rank: 102, user: { ...MOCK_USER, id: 'u102', username: 'MathBeginner', stats: { MATEMATICA: { points: 120 }, NATUREZA: { points: 10 }, HUMANAS: { points: 10 }, LINGUAGENS: { points: 10 } } }, accuracy: 72 },
  { rank: 103, user: { ...MOCK_USER, id: 'u103', username: 'NatureFan', stats: { MATEMATICA: { points: 10 }, NATUREZA: { points: 280 }, HUMANAS: { points: 10 }, LINGUAGENS: { points: 10 } } }, accuracy: 78 },
  { rank: 104, user: { ...MOCK_USER, id: 'u104', username: 'HistoryLover', stats: { MATEMATICA: { points: 10 }, NATUREZA: { points: 10 }, HUMANAS: { points: 450 }, LINGUAGENS: { points: 10 } } }, accuracy: 80 },
  { rank: 105, user: { ...MOCK_USER, id: 'u105', username: 'LanguagePro', stats: { MATEMATICA: { points: 10 }, NATUREZA: { points: 10 }, HUMANAS: { points: 10 }, LINGUAGENS: { points: 650 } } }, accuracy: 84 },
  { rank: 5, user: MOCK_USER, accuracy: 95 }
];

export const simulateNetwork = <T>(data: T, delay = 800): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};
