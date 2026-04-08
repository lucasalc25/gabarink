import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'pt' | 'en' | 'es';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  // Header
  home: { pt: 'Início', en: 'Home', es: 'Inicio' },
  ranking: { pt: 'Ranking', en: 'Ranking', es: 'Ranking' },
  templates: { pt: 'Modelos', en: 'Templates', es: 'Plantillas' },
  create: { pt: 'Criar', en: 'Create', es: 'Crear' },
  notifications: { pt: 'Notificações', en: 'Notifications', es: 'Notificaciones' },
  markAllRead: { pt: 'Marcar todas como lidas', en: 'Mark all as read', es: 'Marcar todas como leídas' },
  viewAllNotifications: { pt: 'Ver todas as notificações', en: 'View all notifications', es: 'Ver todas las notificaciones' },
  markRead: { pt: 'Lidas', en: 'Read', es: 'Leídas' },
  profile: { pt: 'Perfil', en: 'Profile', es: 'Perfil' },
  myQuizzes: { pt: 'Meus quizzes', en: 'My quizzes', es: 'Mis quizzes' },
  language: { pt: 'Idioma', en: 'Language', es: 'Idioma' },
  logout: { pt: 'Sair', en: 'Logout', es: 'Salir' },
  login: { pt: 'Entrar', en: 'Login', es: 'Entrar' },
  register: { pt: 'Cadastrar', en: 'Sign up', es: 'Registrarse' },
  theme: { pt: 'Tema', en: 'Theme', es: 'Tema' },
  light: { pt: 'Claro', en: 'Light', es: 'Claro' },
  dark: { pt: 'Escuro', en: 'Dark', es: 'Oscuro' },
  // Home
  aiQuizzes: { pt: 'Quizzes com IA', en: 'AI-Powered Quizzes', es: 'Quizzes con IA' },
  heroTitle: { pt: 'Desafie sua mente, ganhe recompensas.', en: 'Challenge Your Mind, Earn Rewards.', es: 'Desafía tu mente, gana recompensas.' },
  heroSub: { pt: 'Crie, jogue e compartilhe quizzes interativos. Use IA para gerar um quiz instantaneamente.', en: 'Create, play, and share interactive quizzes. Use AI to instantly generate a quiz.', es: 'Crea, juega y comparte quizzes interactivos. Usa IA para generar un quiz al instante.' },
  startExploring: { pt: 'Começar a explorar', en: 'Start Exploring', es: 'Empezar a explorar' },
  playRandom: { pt: 'Jogar aleatório', en: 'Play Random', es: 'Jugar aleatorio' },
  trendingNow: { pt: 'Bombando agora', en: 'Trending Now', es: 'Tendencias ahora' },
  sortBy: { pt: 'Ordenar por', en: 'Sort by', es: 'Ordenar por' },
  // Categories
  catAll: { pt: 'Todos', en: 'All', es: 'Todos' },
  catProgramming: { pt: 'Programação', en: 'Programming', es: 'Programación' },
  catHistory: { pt: 'História', en: 'History', es: 'Historia' },
  catGeography: { pt: 'Geografia', en: 'Geography', es: 'Geografía' },
  catTrivia: { pt: 'Conhecimentos Gerais', en: 'Trivia', es: 'Trivia' },
  catScience: { pt: 'Ciência', en: 'Science', es: 'Ciencia' },
  catMath: { pt: 'Matemática', en: 'Math', es: 'Matemática' },
  // Sort
  sortRating: { pt: 'Avaliação', en: 'Rating', es: 'Evaluación' },
  sortPlays: { pt: 'Partidas', en: 'Plays', es: 'Partidas' },
  sortQuestions: { pt: 'Questões', en: 'Questions', es: 'Preguntas' },
  // Card
  partidas: { pt: 'partidas', en: 'plays', es: 'partidas' },
  perguntas: { pt: 'perguntas', en: 'questions', es: 'preguntas' },
  by: { pt: 'por', en: 'by', es: 'por' },
  // Templates Page
  templatesTitle: { pt: 'Modelos de Quiz', en: 'Quiz Templates', es: 'Plantillas de Quiz' },
  templatesSub: { pt: 'Pule a página em branco! Escolha um modelo pronto para começar seu projeto.', en: 'Skip the blank page! Choose a ready-to-use template to start your project.', es: '¡Salta la página en blanco! Elige una plantilla lista para usar.' },
  useTemplate: { pt: 'Usar Modelo', en: 'Use Template', es: 'Usar Plantilla' },
  editable: { pt: 'Editável', en: 'Editable', es: 'Editable' },
  searchTemplates: { pt: 'Buscar modelos por título ou tópico...', en: 'Search templates by title or topic...', es: 'Buscar plantillas por título o tema...' },
  // Ranking Page
  rankingTitle: { pt: 'Ranking Global', en: 'Global Ranking', es: 'Ranking Global' },
  rankingSub: { pt: 'Compita com outros e suba na tabela de líderes', en: 'Compete with others and climb the leaderboard', es: 'Compite con otros y sube en la tabla de líderes' },
  weekly: { pt: 'Semanal', en: 'Weekly', es: 'Semanal' },
  allTime: { pt: 'Todo o tempo', en: 'All Time', es: 'Todo el tiempo' },
  // Common Labels / Categories
  catGeneral: { pt: 'Geral', en: 'General', es: 'General' },
  catPopCulture: { pt: 'Cultura Pop', en: 'Pop Culture', es: 'Cultura Pop' },
  diffEasy: { pt: 'Fácil', en: 'Easy', es: 'Fácil' },
  diffMedium: { pt: 'Médio', en: 'Medium', es: 'Medio' },
  diffHard: { pt: 'Difícil', en: 'Hard', es: 'Difícil' },
  noTemplatesFound: { pt: 'Nenhum modelo encontrado', en: 'No templates found', es: 'No se encontraron plantillas' },
  tryAdjustingFilters: { pt: 'Tente ajustar seus filtros ou busca para encontrar o que procura.', en: 'Try adjusting your filters or search to find what you are looking for.', es: 'Intenta ajustar tus filtros o búsqueda para encontrar lo que buscas.' },
  clearFilters: { pt: 'Limpar filtros', en: 'Clear filters', es: 'Limpiar filtros' },
  loginRequired: { pt: 'Você precisa estar logado para realizar esta ação. Ir para login?', en: 'You must be logged in to perform this action. Go to login?', es: 'Debes iniciar sesión para realizar esta acción. ¿Ir a iniciar sesión?' },
  // Templates Content
  t1_title: { pt: 'Exploração Espacial 101', en: 'Space Exploration 101', es: 'Exploración Espacial 101' },
  t1_desc: { pt: 'Aprenda sobre a história das viagens espaciais e do sistema solar com este quiz abrangente.', en: 'Learn about the history of space travel and the solar system with this comprehensive starter quiz.', es: 'Aprende sobre la historia de los viajes espaciales y el sistema solar con este cuestionario.' },
  t2_title: { pt: 'Hits da Cultura Pop Anos 90', en: '90s Pop Culture Hits', es: 'Éxitos de la Cultura Pop de los 90' },
  t2_desc: { pt: 'Reviva a era de ouro da música e dos filmes dos anos 90. Nostalgia para todas as idades.', en: 'Relive the golden era of music and movies from the 1990s. Pure nostalgia for all ages.', es: 'Revive la era dorada de la música y el cine de los años 90.' },
  t3_title: { pt: 'Impérios do Mundo Antigo', en: 'Ancient World Empires', es: 'Imperios del Mundo Antiguo' },
  t3_desc: { pt: 'Teste seus conhecimentos sobre Romanos, Egípcios e as Grandes Dinastias que moldaram nossa história.', en: 'Test your knowledge on Romans, Egyptians, and the Great Dynasties that shaped our history.', es: 'Pon a prueba tus conocimientos sobre los romanos, los egipcios y las grandes dinastías.' },
  t4_title: { pt: 'Mestre em Capitais do Mundo', en: 'Capital Cities Master', es: 'Maestro de Capitales del Mundo' },
  t4_desc: { pt: 'Você conhece todas as capitais do mundo? Este modelo inclui dados de mais de 100 países.', en: 'Do you know all the world capitals? This template includes data for over 100 countries.', es: '¿Conoces todas las capitales del mundo? Esta plantilla incluye datos de más de 100 países.' },
  t5_title: { pt: 'Blitz de Conhecimentos Gerais', en: 'General Trivia Blitz', es: 'Flash de Conocimientos Generales' },
  t5_desc: { pt: 'O modelo perfeito para seu próximo encontro com amigos. Tópicos mistos com perguntas rápidas.', en: 'The perfect template for your next friend gathering. Mixed topics with fun and quick questions.', es: 'La plantilla perfecta para tu próxima reunión de amigos.' },
  t6_title: { pt: 'Básico de Biologia Moderna', en: 'Modern Biology Basics', es: 'Conceptos Básicos de Biología Moderna' },
  t6_desc: { pt: 'Foque em células, DNA e os blocos de construção da vida com este modelo cientificamente preciso.', en: 'Focus on cells, DNA, and the building blocks of life with this scientifically accurate template.', es: 'Enfócate en las células, el ADN y los componentes básicos de la vida.' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'pt';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, fallback?: string) => {
    return translations[key]?.[language] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
