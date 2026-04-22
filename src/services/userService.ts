import { Achievement, AreaENEM, DailyMission, Notification } from "../types";
import { simulateNetwork } from "./mocks";

export const userService = {
  achievements: async (): Promise<Achievement[]> => {
    return simulateNetwork([
      {
        id: "1",
        name: "Primeiros Passos",
        description: "Complete seu primeiro quiz",
        unlocked: true,
        icon: "Droplet",
      },
      {
        id: "2",
        name: "Mestre do Fogo",
        description: "Mantenha uma ofensiva de 7 dias",
        unlocked: false,
        icon: "Flame",
        progress: 3,
        goal: 7,
      },
      {
        id: "3",
        name: "Explorador",
        description: "Jogue 10 quizzes diferentes",
        unlocked: true,
        icon: "Target",
      },
      {
        id: "4",
        name: "Colecionador",
        description: "Ganhe 500 gotas de tinta",
        unlocked: false,
        icon: "Beaker",
        progress: 120,
        goal: 500,
      },
    ]);
  },

  dailyMissions: async (): Promise<DailyMission[]> => {
    return simulateNetwork([
      {
        id: "m1",
        title: "Sessão de Estudos",
        description: "Estude por 15 minutos",
        progress: 10,
        goal: 15,
        completed: false,
        rewardXp: 50,
      },
      {
        id: "m2",
        title: "Expert em Quiz",
        description: "Acerte 10 questões seguidas",
        progress: 10,
        goal: 10,
        completed: true,
        rewardXp: 100,
      },
      {
        id: "m3",
        title: "Socializador",
        description: "Compartilhe um quiz com um amigo",
        progress: 0,
        goal: 1,
        completed: false,
        rewardXp: 30,
      },
    ]);
  },

  notifications: async (): Promise<Notification[]> => {
    return simulateNetwork([
      {
        id: "n1",
        title: "Novo Quiz Disponível!",
        body: "Confira o novo quiz de História Medieval.",
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "n2",
        title: "Ofensiva em Risco",
        body: "Não esqueça de praticar hoje para manter seu streak!",
        read: true,
        createdAt: new Date().toISOString(),
      },
    ]);
  },

  completeQuiz: async (area: AreaENEM, xpEarned: number) => {
    // Lógica de recompensa segmentada
    return simulateNetwork({
      success: true,
      xpEarned,
      area,
      message: `Você ganhou ${xpEarned} XP em ${area}!`
    });
  },
};
