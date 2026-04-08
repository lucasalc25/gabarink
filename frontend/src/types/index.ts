export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  title: string;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
  };
  rating: number;
  playCount: number;
  questionsCount: number;
  imageUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  imageUrl?: string;
  options: string[];
  correctOptionIndex: number;
  timeLimitSeconds: number;
}
