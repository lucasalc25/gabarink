import { useState, useEffect, useCallback } from 'react';
import { quizService, type QuizFilters } from '../services/quizService';
import type { Quiz } from '../types';

export function useQuizzes(filters?: QuizFilters) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await quizService.getQuizzes(filters);
      setQuizzes(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar quizzes');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  return { quizzes, loading, error, refresh: fetchQuizzes };
}
