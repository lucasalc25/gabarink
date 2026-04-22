import type { Quiz, User } from '../types';

export const MOCK_USER: User = {
  id: 'me',
  name: 'Alex Gamer',
  username: 'AlexGamer',
  level: 42,
  xp: 15400,
  xpToNextLevel: 20000,
  title: 'Quiz Master',
  totalInk: 1250,
  inkDrops: 4,
  maxInkDrops: 5,
  streak: 12,
  equipped: {
    title: 'Mestre Arcanista',
  },
  stats: {
    MATEMATICA: { score: 750, league: 'Heptagonal' },
    NATUREZA: { score: 920, league: 'Sistêmica' },
    HUMANAS: { score: 640, league: 'Povo' },
    LINGUAGENS: { score: 480, league: 'Fonema' }
  },
  achievements: [],
  avatarUrl: 'https://i.pravatar.cc/150?u=me',
};

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: '1',
    title: 'Advanced React Hooks',
    description: 'Teste seus conhecimentos sobre useMemo, useCallback e hooks customizados.',
    area: 'LINGUAGENS',
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
    area: 'HUMANAS',
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
    title: 'Logaritmos e Funções',
    description: 'Domine a arte das funções exponenciais.',
    area: 'MATEMATICA',
    author: { id: 'u3', name: 'MathWizard' },
    rating: 4.8,
    playCount: 1023,
    questionsCount: 15,
    difficulty: 'medium',
    category: 'Math',
    tags: ['Cálculo', 'Funções'],
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    createdAt: '2026-04-08T09:15:00Z',
  },
  {
    id: '4',
    title: 'Células e Genética',
    description: 'Você conhece o básico da vida?',
    area: 'NATUREZA',
    author: { id: 'u4', name: 'BioMaster' },
    rating: 4.7,
    playCount: 891,
    questionsCount: 12,
    difficulty: 'hard',
    category: 'Biology',
    tags: ['DNA', 'Biologia'],
    imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80',
    createdAt: '2026-04-07T16:45:00Z',
  },
  {
    id: '5',
    title: 'Capitais do Mundo',
    description: 'Você consegue nomear as capitais do mundo todo?',
    area: 'HUMANAS',
    author: { id: 'u5', name: 'Globetrotter' },
    rating: 4.1,
    playCount: 723,
    questionsCount: 20,
    difficulty: 'medium',
    category: 'Geography',
    tags: ['Mundo', 'Geografia'],
    imageUrl: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&q=80',
    createdAt: '2026-04-06T11:20:00Z',
  },
];

export const MOCK_RANKING = [
  {
    rank: 1,
    user: {
      ...MOCK_USER, id: 'u1', name: 'FrontendMaster', username: 'FrontendMaster', avatarUrl: 'https://i.pravatar.cc/150?u=1',
      stats: {
        MATEMATICA: { score: 980, league: 'Sistêmica' },
        NATUREZA: { score: 550, league: 'Molecular' },
        HUMANAS: { score: 420, league: 'Indivíduo' },
        LINGUAGENS: { score: 910, league: 'Sistêmica' }
      }
    },
    accuracy: 98
  },
  {
    rank: 2,
    user: {
      ...MOCK_USER, id: 'u2', name: 'MathWizard', username: 'MathWizard', avatarUrl: 'https://i.pravatar.cc/150?u=3',
      stats: {
        MATEMATICA: { score: 1000, league: 'Organísmica' },
        NATUREZA: { score: 810, league: 'Orgânica' },
        HUMANAS: { score: 405, league: 'Indivíduo' },
        LINGUAGENS: { score: 550, league: 'Sílaba' }
      }
    },
    accuracy: 95
  },
  {
    rank: 3,
    user: {
      ...MOCK_USER, id: 'u3', name: 'QuizKing', username: 'QuizKing', avatarUrl: 'https://i.pravatar.cc/150?u=2',
      stats: {
        MATEMATICA: { score: 620, league: 'Hexagonal' },
        NATUREZA: { score: 950, league: 'Sistêmica' },
        HUMANAS: { score: 840, league: 'Cultura' },
        LINGUAGENS: { score: 680, league: 'Verbo' }
      }
    },
    accuracy: 92
  },
  {
    rank: 4,
    user: {
      ...MOCK_USER, id: 'u4', name: 'Globetrotter', username: 'Globetrotter', avatarUrl: 'https://i.pravatar.cc/150?u=4',
      stats: {
        MATEMATICA: { score: 450, league: 'Quadrática' },
        NATUREZA: { score: 510, league: 'Molecular' },
        HUMANAS: { score: 980, league: 'Humanidade' },
        LINGUAGENS: { score: 720, league: 'Verso' }
      }
    },
    accuracy: 89
  },
  {
    rank: 5,
    user: {
      ...MOCK_USER, id: 'u5', name: 'ReactNinja', username: 'ReactNinja', avatarUrl: 'https://i.pravatar.cc/150?u=5',
      stats: {
        MATEMATICA: { score: 880, league: 'Octogonal' },
        NATUREZA: { score: 620, league: 'Celular' },
        HUMANAS: { score: 550, league: 'Clã' },
        LINGUAGENS: { score: 840, league: 'Estrofe' }
      }
    },
    accuracy: 94
  },
  {
    rank: 6,
    user: {
      ...MOCK_USER, id: 'u6', name: 'BioMaster', username: 'BioMaster', avatarUrl: 'https://i.pravatar.cc/150?u=6',
      stats: {
        MATEMATICA: { score: 510, league: 'Pentagonal' },
        NATUREZA: { score: 1000, league: 'Organísmica' },
        HUMANAS: { score: 610, league: 'Povo' },
        LINGUAGENS: { score: 405, league: 'Fonema' }
      }
    },
    accuracy: 91
  },
  {
    rank: 7,
    user: {
      ...MOCK_USER, id: 'u7', name: 'LinguisticsFan', username: 'LinguisticsFan', avatarUrl: 'https://i.pravatar.cc/150?u=7',
      stats: {
        MATEMATICA: { score: 410, league: 'Quadrática' },
        NATUREZA: { score: 420, league: 'Atômica' },
        HUMANAS: { score: 740, league: 'Sociedade' },
        LINGUAGENS: { score: 995, league: 'Literatura' }
      }
    },
    accuracy: 97
  },
  {
    rank: 8,
    user: {
      ...MOCK_USER, id: 'u8', name: 'TheThinker', username: 'TheThinker', avatarUrl: 'https://i.pravatar.cc/150?u=8',
      stats: {
        MATEMATICA: { score: 590, league: 'Pentagonal' },
        NATUREZA: { score: 610, league: 'Celular' },
        HUMANAS: { score: 880, league: 'Cultura' },
        LINGUAGENS: { score: 790, league: 'Estrofe' }
      }
    },
    accuracy: 88
  },
];

export const simulateNetwork = <T>(data: T, delay = 800): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};
