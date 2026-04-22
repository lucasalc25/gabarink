import apiClient from './apiClient';
import { MOCK_RANKING, simulateNetwork } from './mocks';
import { RankingEntry } from '../types';

const USE_MOCKS = true;

export const rankingService = {
  global: async (): Promise<RankingEntry[]> => {
    if (USE_MOCKS) return simulateNetwork(MOCK_RANKING.map((r, i) => ({ ...r, position: i + 1 })));
    const response = await apiClient.get<RankingEntry[]>('/ranking/global');
    return response.data;
  },
  weekly: async (): Promise<RankingEntry[]> => {
    if (USE_MOCKS) return simulateNetwork(MOCK_RANKING.map((r, i) => ({ ...r, position: i + 1 })));
    const response = await apiClient.get<RankingEntry[]>('/ranking/weekly');
    return response.data;
  }
};
