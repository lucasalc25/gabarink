import axios from 'axios';
import type { Question } from '../types';
import { aiService } from './aiService';

const ENEM_API_BASE = 'https://api.enem.dev/v1';

export interface EnemQuestion {
  id: string;
  index: number;
  title: string;
  context: string;
  alternativesIntroduction: string;
  discipline: string;
  language: string | null;
  correctAlternative: string;
  alternatives: {
    letter: string;
    text: string;
  }[];
}

export const enemService = {
  getSimulationQuestions: async (limit: number = 10): Promise<Question[]> => {
    try {
      const year = 2022;
      const response = await axios.get(`${ENEM_API_BASE}/exams/${year}/questions`);
      const allQuestions: EnemQuestion[] = response.data.questions || [];
      
      if (!Array.isArray(allQuestions)) return [];

      const portugueseQuestions = allQuestions.filter(q => q.language === null);
      const shuffled = [...portugueseQuestions].sort(() => 0.5 - Math.random()).slice(0, limit);
      
      const mapped = await Promise.all(shuffled.map(async q => {
        // AI AGENT: Now handles all the "cleaning" and "reformulating" without fragile Regex
        const processed = await aiService.processQuestion(q.context, q.alternativesIntroduction);
        
        return {
          id: q.id || Math.random().toString(),
          statement: processed.statement,
          options: q.alternatives.map(alt => ({
            id: alt.letter,
            text: alt.text
          })),
          correctOptionId: q.correctAlternative,
          imageUrl: processed.imageUrl,
          explanation: `Questão do ENEM ${year}. Disciplina: ${q.discipline}.`
        };
      }));

      return mapped;
    } catch (error) {
      console.error("Error fetching ENEM questions:", error);
      return [];
    }
  },

  getWeeklyChallenge: async (): Promise<Question | null> => {
    try {
      const years = [2019, 2020, 2021, 2022];
      const year = years[Math.floor(Math.random() * years.length)];
      const response = await axios.get(`${ENEM_API_BASE}/exams/${year}/questions`);
      const allQuestions: EnemQuestion[] = response.data.questions || [];
      
      if (!Array.isArray(allQuestions)) return null;

      const hardQuestions = allQuestions.filter(q => 
        q.language === null && (
          q.discipline?.toLowerCase().includes('matemática') || 
          q.discipline?.toLowerCase().includes('natureza')
        )
      );
      
      const selected = (hardQuestions.length > 0 ? hardQuestions : allQuestions)[Math.floor(Math.random() * (hardQuestions.length > 0 ? hardQuestions.length : allQuestions.length))];
      
      if (!selected) return null;

      const processed = await aiService.processQuestion(selected.context, selected.alternativesIntroduction, true);

      return {
        id: selected.id || Math.random().toString(),
        statement: processed.statement,
        options: selected.alternatives.map(alt => ({
          id: alt.letter,
          text: alt.text
        })),
        correctOptionId: selected.correctAlternative,
        imageUrl: processed.imageUrl,
        explanation: `DESAFIO SEMANAL: Questão do ENEM ${year}. Esta é uma questão de nível avançado.`
      };
    } catch (error) {
      console.error("Error fetching Weekly Challenge:", error);
      return null;
    }
  }
};
