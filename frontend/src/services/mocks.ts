import type { Quiz, User } from '../types';

export const MOCK_USER: User = {
  id: 'me',
  name: 'Alex Gamer',
  level: 42,
  xp: 15400,
  title: 'Quiz Master',
  achievements: [],
  avatarUrl: 'https://i.pravatar.cc/150?u=me',
};

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: '1',
    title: 'Advanced React Hooks',
    description: 'Teste seus conhecimentos sobre useMemo, useCallback e hooks customizados.',
    author: { id: 'u1', name: 'FrontendMaster' },
    rating: 4.8,
    playCount: 1250,
    questionsCount: 10,
    difficulty: 'hard',
    category: 'Programming',
    tags: ['React', 'Hooks', 'Web'],
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    createdAt: '2026-04-10T10:00:00Z',
  },
  {
    id: '2',
    title: 'Conhecimentos Gerais 2026',
    description: 'Um mix de história, geografia e cultura pop.',
    author: { id: 'u2', name: 'QuizKing' },
    rating: 4.5,
    playCount: 8900,
    questionsCount: 15,
    difficulty: 'easy',
    category: 'Trivia',
    tags: ['História', 'Geografia'],
    imageUrl: 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?w=800&q=80',
    createdAt: '2026-04-09T14:30:00Z',
  },
  {
    id: '3',
    title: 'Movie Quotes',
    description: 'Adivinhe o filme a partir de uma frase famosa!',
    author: { id: 'u3', name: 'CinemaFan' },
    rating: 4.8,
    playCount: 1023,
    questionsCount: 15,
    difficulty: 'medium',
    category: 'Trivia',
    tags: ['Filmes', 'Citações'],
    createdAt: '2026-04-08T09:15:00Z',
  },
  {
    id: '4',
    title: 'JavaScript Mastery',
    description: 'Você é um mago do JS? Prove isso agora!',
    author: { id: 'u4', name: 'QuizMaster' },
    rating: 4.7,
    playCount: 891,
    questionsCount: 12,
    difficulty: 'hard',
    category: 'Programming',
    tags: ['JS', 'Code'],
    createdAt: '2026-04-07T16:45:00Z',
  },
  {
    id: '5',
    title: 'Capital Cities',
    description: 'Você consegue nomear as capitais do mundo todo?',
    author: { id: 'u5', name: 'Globetrotter' },
    rating: 4.1,
    playCount: 723,
    questionsCount: 20,
    difficulty: 'medium',
    category: 'Geography',
    tags: ['Mundo', 'Geografia'],
    createdAt: '2026-04-06T11:20:00Z',
  },
];

export const MOCK_RANKING = [
  { rank: 1, user: { ...MOCK_USER, name: 'FrontendMaster', avatarUrl: 'https://i.pravatar.cc/150?u=1' }, score: 12500 },
  { rank: 2, user: { ...MOCK_USER, name: 'QuizKing', avatarUrl: 'https://i.pravatar.cc/150?u=2' }, score: 10200 },
  { rank: 3, user: { ...MOCK_USER, name: 'CinemaFan', avatarUrl: 'https://i.pravatar.cc/150?u=3' }, score: 9800 },
  { rank: 4, user: { ...MOCK_USER, name: 'Globetrotter', avatarUrl: 'https://i.pravatar.cc/150?u=4' }, score: 8500 },
  { rank: 5, user: { ...MOCK_USER, name: 'ReactNinja', avatarUrl: 'https://i.pravatar.cc/150?u=5' }, score: 7200 },
  { rank: 6, user: { ...MOCK_USER, name: 'CodeWizard', avatarUrl: 'https://i.pravatar.cc/150?u=6' }, score: 6100 },
  { rank: 7, user: { ...MOCK_USER, name: 'TriviaBot', avatarUrl: 'https://i.pravatar.cc/150?u=7' }, score: 5400 },
  { rank: 8, user: { ...MOCK_USER, name: 'AlphaUser', avatarUrl: 'https://i.pravatar.cc/150?u=8' }, score: 4200 },
];

export const simulateNetwork = <T>(data: T, delay = 800): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};
