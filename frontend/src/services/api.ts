import { authService } from './authService';
import { quizService } from './quizService';
import { rankingService } from './rankingService';

export const api = {
  ...authService,
  ...quizService,
  ...rankingService
};

export default api;
