import { authService } from './authService';
import { quizService } from './quizService';
import { rankingService } from './rankingService';
import { userService } from './userService';

export const api = {
  ...authService,
  ...quizService,
  ...rankingService,
  ...userService
};

export default api;
