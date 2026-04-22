import apiClient from './apiClient';
import type { Quiz } from '../types';
import { MOCK_QUIZZES, simulateNetwork } from './mocks';

const USE_MOCKS = true;

export interface QuizFilters {
  searchQuery?: string;
  category?: string;
  difficulty?: string;
  minRating?: number;
  dateRange?: 'all' | '24h' | '7d' | '30d';
  sortBy?: 'playCount' | 'createdAt' | 'questionsCount' | 'rating' | 'title';
  sortDesc?: boolean;
}

export const quizService = {
  getQuizzes: async (filters?: QuizFilters): Promise<Quiz[]> => {
    if (USE_MOCKS) {
      let filtered = [...MOCK_QUIZZES];
      if (filters?.searchQuery) {
        const q = filters.searchQuery.toLowerCase();

        // Map elements to their relevance score
        const scored = filtered.map(quiz => {
          let score = 0;
          const title = quiz.title.toLowerCase();
          const desc = quiz.description.toLowerCase();
          const cat = quiz.category.toLowerCase();

          if (title === q) score += 10;
          else if (title.includes(q)) score += 5;

          if (cat === q) score += 4;
          else if (cat.includes(q)) score += 3;

          if (desc.includes(q)) score += 1;

          return { quiz, score };
        });

        // Filter out irrelevant results and sort by relevance
        filtered = scored
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .map(item => item.quiz);
      }
      if (filters?.category && filters.category !== 'All') {
        const cats = filters.category.split(',').map(s => s.trim());
        filtered = filtered.filter(q => cats.includes(q.category) || cats.includes('All'));
      }
      if (filters?.difficulty && filters.difficulty !== 'All') {
        const diffs = filters.difficulty.split(',').map(s => s.trim());
        filtered = filtered.filter(q => diffs.includes(q.difficulty) || diffs.includes('All'));
      }
      if (filters?.minRating) {
        filtered = filtered.filter(q => q.rating >= filters.minRating!);
      }
      if (filters?.dateRange && filters.dateRange !== 'all') {
        const thresholdDate = new Date();
        if (filters.dateRange === '24h') {
          thresholdDate.setHours(thresholdDate.getHours() - 24);
        } else if (filters.dateRange === '7d') {
          thresholdDate.setDate(thresholdDate.getDate() - 7);
        } else if (filters.dateRange === '30d') {
          thresholdDate.setDate(thresholdDate.getDate() - 30);
        }
        filtered = filtered.filter(q => new Date(q.createdAt) >= thresholdDate);
      }
      if (filters?.sortBy) {
        filtered.sort((a, b) => {
          const fieldA = a[filters.sortBy as keyof Quiz] as number | string;
          const fieldB = b[filters.sortBy as keyof Quiz] as number | string;
          if (fieldA < fieldB) return filters.sortDesc ? 1 : -1;
          if (fieldA > fieldB) return filters.sortDesc ? -1 : 1;
          return 0;
        });
      }
      return simulateNetwork(filtered);
    }
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortDesc !== undefined) params.append('sortDesc', String(filters.sortDesc));

    const response = await apiClient.get<Quiz[]>(`/quizzes/?${params.toString()}`);
    return response.data;
  },

  getQuizById: async (id: string): Promise<Quiz | undefined> => {
    if (USE_MOCKS) return simulateNetwork(MOCK_QUIZZES.find(q => q.id === id));
    const response = await apiClient.get<Quiz>(`/quizzes/${id}/`);
    return response.data;
  },

  createQuiz: async (quizData: Partial<Quiz>): Promise<Quiz> => {
    if (USE_MOCKS) return simulateNetwork({ ...quizData, id: Math.random().toString(36).substr(2, 9) } as Quiz);
    const response = await apiClient.post<Quiz>('/quizzes/', quizData);
    return response.data;
  },

  getTemplates: async (): Promise<Quiz[]> => {
    if (USE_MOCKS) return simulateNetwork(MOCK_QUIZZES);
    const response = await apiClient.get<Quiz[]>('/quizzes/templates/');
    return response.data;
  },

  generateAIQuiz: async (topic: string, difficulty: string, questionsCount: number): Promise<Quiz> => {
    if (USE_MOCKS) {
      await simulateNetwork(null);
      return {
        id: 'ai-' + Math.random().toString(36).substr(2, 9),
        title: `Quiz about ${topic}`,
        description: `Experience a deep dive into ${topic} with this AI-generated challenge.`,
        category: 'AI Generated',
        difficulty: difficulty.toLowerCase() as any,
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
        questionsCount,
        rating: 4.5,
        playCount: 0,
        createdAt: new Date().toISOString(),
        tags: [topic.toLowerCase(), 'ai', 'dynamic'],
        author: { id: 'ai', name: 'Quizzy AI', level: 99, avatarUrl: '' }
      } as Quiz;
    }
    const response = await apiClient.post<Quiz>('/quizzes/generate/', { topic, difficulty, questionsCount });
    return response.data;
  },

  listSubjects: async (): Promise<Subject[]> => {
    if (USE_MOCKS) {
      return simulateNetwork([
        {
          id: "s1",
          name: "Matemática",
          icon: "calculator",
          color: "blue",
          area: "MATEMATICA",
          sections: [
            {
              id: "sec1",
              name: "Álgebra",
              units: [
                { id: "u1", name: "Equações Lineares", description: "O básico das equações", progress: 100, type: "theory", status: "completed" },
                { id: "u2", name: "Equações Quadráticas", description: "Fórmula de Bhaskara", progress: 40, type: "quiz", status: "in-progress" },
              ]
            }
          ]
        },
        {
          id: "s2",
          name: "Português",
          area: "LINGUAGENS",
          icon: "book",
          color: "red",
          sections: []
        }
      ]);
    }
    const response = await apiClient.get('/subjects/');
    return response.data;
  },

  listTemplates: async (): Promise<Quiz[]> => {
    return quizService.getTemplates();
  }
};
