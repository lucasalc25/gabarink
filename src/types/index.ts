export type AreaENEM = 'MATEMATICA' | 'NATUREZA' | 'HUMANAS' | 'LINGUAGENS';

export interface AreaStats {
  score: number; // 400 to 1000
  league: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  title: string;
  totalInk: number;
  inkDrops: number;
  maxInkDrops: number;
  streak: number;
  equipped: {
    title: string;
    avatar?: string;
    frame?: string;
  };
  stats: Record<AreaENEM, AreaStats>;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
  progress?: number;
  goal?: number;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  progress: number;
  goal: number;
  completed: boolean;
  rewardXp: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  area: AreaENEM;
  sections: Section[];
}

export interface Section {
  id: string;
  name: string;
  units: Unit[];
}

export interface Unit {
  id: string;
  name: string;
  description?: string;
  progress?: number;
  type: 'theory' | 'quiz' | 'exam';
  status: 'locked' | 'available' | 'in-progress' | 'completed';
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  area: AreaENEM;
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
  area: AreaENEM;
  imageUrl?: string;
  options: string[];
  correctOptionIndex: number;
  timeLimitSeconds: number;
}

export interface RankingEntry {
  position: number;
  user: User;
  accuracy: number;
  isCurrentUser?: boolean;
}
