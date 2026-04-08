import apiClient from './apiClient';
import { MOCK_RANKING, simulateNetwork } from './mocks';

const USE_MOCKS = true;

export const rankingService = {
  getRanking: async (period: 'weekly' | 'all-time' = 'weekly'): Promise<any> => {
    if (USE_MOCKS) return simulateNetwork(MOCK_RANKING);
    const response = await apiClient.get('/ranking/', { params: { period } });
    return response.data;
  }
};
