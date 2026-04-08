import { useState } from 'react';
import type { Quiz } from '@/types';
import { QuizCard } from '@/components/quiz/QuizCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles, Trophy, Flame, Filter, AlertCircle, Search, ArrowLeft, ArrowUpDown, ChevronDown, ChevronUp, Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuizzes } from '@/hooks/useQuizzes';

const CATEGORIES = [
  { id: 'Programming', label: 'Programming' },
  { id: 'History', label: 'History' },
  { id: 'Geography', label: 'Geography' },
  { id: 'Trivia', label: 'Trivia' },
  { id: 'Science', label: 'Science' },
  { id: 'Math', label: 'Math' }
];

const DIFFICULTIES = [
  { id: 'easy', label: 'Fácil' },
  { id: 'medium', label: 'Médio' },
  { id: 'hard', label: 'Difícil' }
];

export default function Home() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [dateFilter, setDateFilter] = useState('all');

  const [sortOption, setSortOption] = useState('relevance');

  const SORT_MAP: Record<string, { field?: string, desc: boolean }> = {
    relevance: { field: undefined, desc: true },
    playCount: { field: 'playCount', desc: true },
    rating: { field: 'rating', desc: true },
    newest: { field: 'createdAt', desc: true },
    oldest: { field: 'createdAt', desc: false },
    titleAsc: { field: 'title', desc: false },
    titleDesc: { field: 'title', desc: true },
    questionsCount: { field: 'questionsCount', desc: true }
  };

  const currentSort = SORT_MAP[sortOption] || SORT_MAP.relevance;

  // UI States
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('category');

  // To support multiple selection
  const { quizzes: filteredQuizzes, loading, error } = useQuizzes({
    searchQuery: searchQuery || undefined,
    category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
    difficulty: selectedDifficulties.length > 0 ? selectedDifficulties.join(',') : undefined,
    minRating: minRating > 0 ? minRating : undefined,
    dateRange: dateFilter !== 'all' ? (dateFilter as any) : undefined,
    sortBy: currentSort.field as any,
    sortDesc: currentSort.desc
  });

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setMinRating(0);
    setDateFilter('all');
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const toggleDifficulty = (id: string) => {
    setSelectedDifficulties(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  const toggleAccordion = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 space-y-6 md:space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-surface border border-white/5 p-6 md:p-12 hero-dark-force">
        <div className="relative z-10 max-w-2xl space-y-4 md:space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[12px] md:text-sm font-bold text-primary-light border border-white/5 uppercase tracking-wide">
            <Sparkles size={14} className="md:w-4 md:h-4" />
            {t('aiQuizzes')}
          </div>
          <h1 className="text-3xl md:text-6xl font-black tracking-tight text-text-white leading-[1.1]">
            {t('heroTitle')}
          </h1>
          <p className="text-base md:text-lg text-text-dim max-w-xl font-medium leading-relaxed">
            {t('heroSub')}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 md:pt-4">
            <Button size="lg" className="flex-1 sm:flex-none h-12 md:h-14 px-6 md:px-8 shadow-lg shadow-primary-base/20 transition-all font-bold">
              {t('startExploring')}
            </Button>
            <Button variant="secondary" size="lg" className="flex-1 sm:flex-none h-12 md:h-14 px-6 md:px-8 border-white/10 hover:bg-white/15 transition-all text-text-white/80 font-bold">
              {t('playRandom')}
            </Button>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-surface-darker z-10" />
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200')] bg-cover bg-center" />
        </div>
      </section>

      {/* Main Content Section */}
      <div className="space-y-6 relative">

        {/* Fixed positioning logical bar below hero */}
        <div className="bg-background pt-2 pb-4 space-y-3">
          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={20} />
            <Input
              placeholder="Buscar quizzes por título ou descrição..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-surface-dark border-white/5 focus:border-primary-base focus:ring-primary-base/20 rounded-2xl text-base shadow-sm"
            />
          </div>

          {/* Action Buttons: 50% width each */}
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              className="flex-1 h-12 rounded-xl font-bold bg-surface-dark border border-white/5 gap-2"
              onClick={() => setIsSortOpen(true)}
            >
              <ArrowUpDown size={16} />
              Ordenar
            </Button>
            <Button
              variant="secondary"
              className="flex-1 h-12 rounded-xl font-bold bg-surface-dark border border-white/5 gap-2"
              onClick={() => setIsFilterOpen(true)}
            >
              <Filter size={16} />
              Filtrar
              {(selectedCategories.length > 0 || selectedDifficulties.length > 0 || minRating > 0 || dateFilter !== 'all') && (
                <span className="w-2 h-2 rounded-full bg-primary-base absolute top-3 right-4 shadow-[0_0_8px_rgba(139,92,246,1)]" />
              )}
            </Button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mt-6">
          <h2 className="text-xl md:text-2xl font-black flex items-center gap-2.5 tracking-tight text-text-white uppercase">
            <div className="p-1.5 bg-error/10 rounded-lg">
              <Flame className="text-error" size={20} />
            </div>
            {searchQuery ? 'Resultados' : t('trendingNow')}
          </h2>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-[280px] bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-error/5 border border-error/10 rounded-[32px] gap-4">
            <AlertCircle size={48} className="text-error opacity-50" />
            <div className="text-center">
              <p className="text-text-white font-bold">{error}</p>
              <p className="text-text-dim text-sm">Verifique sua conexão e tente novamente.</p>
            </div>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="text-center py-20 bg-surface-dark rounded-2xl border border-white/5">
            <Trophy className="mx-auto h-12 w-12 text-text-dim mb-4" />
            <h3 className="text-xl font-bold">Nenhum resultado</h3>
            <p className="text-text-dim">Tente ajustar seus filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredQuizzes.map(quiz => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL ORDENAR --- */}
      {isSortOpen && (
        <div className="fixed inset-0 z-50 bg-gradient-surface flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center h-[72px] px-4 border-b border-border shrink-0">
            <button onClick={() => setIsSortOpen(false)} className="p-2 -ml-2 text-text-dim hover:text-white transition-colors">
              <ArrowLeft size={24} />
            </button>
            <h2 className="flex-1 text-center font-bold text-lg text-white pr-8">Ordenar por</h2>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {[
              { id: 'relevance', label: 'Mais relevantes' },
              { id: 'playCount', label: 'Popularidade' },
              { id: 'rating', label: 'Melhor avaliados' },
              { id: 'newest', label: 'Mais recentes' },
              { id: 'oldest', label: 'Mais antigos' },
              { id: 'titleAsc', label: 'Ordem alfabética (A-Z)' },
              { id: 'titleDesc', label: 'Ordem alfabética (Z-A)' },
              { id: 'questionsCount', label: 'Quantidade de questões' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => { setSortOption(opt.id); setIsSortOpen(false); }}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl font-bold transition-all border",
                  sortOption === opt.id
                    ? "bg-primary-base/10 text-primary-light border-primary-base/20"
                    : "bg-surface-dark border-white/5 text-text-white hover:bg-white/5"
                )}
              >
                <span>{opt.label}</span>
                {sortOption === opt.id && <div className="w-5 h-5 rounded-full bg-primary-base flex items-center justify-center"><Check size={14} className="text-white" /></div>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- MODAL FILTRAR --- */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 bg-gradient-surface flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center h-[72px] px-4 border-b border-border shrink-0">
            <button onClick={() => setIsFilterOpen(false)} className="p-2 -ml-2 text-text-dim hover:text-white transition-colors">
              <ArrowLeft size={24} />
            </button>
            <h2 className="flex-1 text-center font-bold text-lg text-white">Filtrar por</h2>
            <button onClick={clearFilters} className="text-sm font-bold text-primary-light shrink-0">
              Limpar
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 pb-32">

            {/* Accordion: Categoria */}
            <div className="bg-surface-dark border border-white/5 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleAccordion('category')}
                className="w-full flex items-center justify-between p-5 font-bold text-white hover:bg-white/5 transition-colors"
              >
                <span>Categoria {selectedCategories.length > 0 && <span className="ml-2 text-primary-light text-[12px] bg-primary-base/20 px-2.5 py-1 rounded-full">{selectedCategories.length}</span>}</span>
                {expandedSection === 'category' ? <ChevronUp size={18} className="text-text-dim" /> : <ChevronDown size={18} className="text-text-dim" />}
              </button>
              {expandedSection === 'category' && (
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={cn(
                        "flex items-center justify-between p-3.5 rounded-xl border text-[13px] font-bold transition-all text-left",
                        selectedCategories.includes(cat.id)
                          ? "bg-primary-base/10 text-primary-light border-primary-base/30 shadow-[0_0_10px_rgba(139,92,246,0.1)]"
                          : "bg-surface-darker text-text-dim border-white/5"
                      )}
                    >
                      {t(`cat${cat.id.replace(/\s+/g, '')}`) || cat.label}
                      {selectedCategories.includes(cat.id) ? <Check size={16} /> : <div className="w-[16px] h-[16px] rounded border border-white/10" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion: Dificuldade */}
            <div className="bg-surface-dark border border-white/5 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleAccordion('difficulty')}
                className="w-full flex items-center justify-between p-5 font-bold text-white hover:bg-white/5 transition-colors"
              >
                <span>Dificuldade {selectedDifficulties.length > 0 && <span className="ml-2 text-primary-light text-[12px] bg-primary-base/20 px-2.5 py-1 rounded-full">{selectedDifficulties.length}</span>}</span>
                {expandedSection === 'difficulty' ? <ChevronUp size={18} className="text-text-dim" /> : <ChevronDown size={18} className="text-text-dim" />}
              </button>
              {expandedSection === 'difficulty' && (
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  {DIFFICULTIES.map(diff => (
                    <button
                      key={diff.id}
                      onClick={() => toggleDifficulty(diff.id)}
                      className={cn(
                        "flex items-center justify-between p-3.5 rounded-xl border text-[13px] font-bold transition-all text-left",
                        selectedDifficulties.includes(diff.id)
                          ? "bg-primary-base/10 text-primary-light border-primary-base/30 shadow-[0_0_10px_rgba(139,92,246,0.1)]"
                          : "bg-surface-darker text-text-dim border-white/5"
                      )}
                    >
                      {diff.label}
                      {selectedDifficulties.includes(diff.id) ? <Check size={16} /> : <div className="w-[16px] h-[16px] rounded border border-white/10" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion: Avaliação */}
            <div className="bg-surface-dark border border-white/5 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleAccordion('rating')}
                className="w-full flex items-center justify-between p-5 font-bold text-white hover:bg-white/5 transition-colors"
              >
                <span>Avaliação {minRating > 0 && <span className="ml-2 text-yellow-500 text-[12px] bg-yellow-500/20 px-2.5 py-1 rounded-full">{minRating}</span>}</span>
                {expandedSection === 'rating' ? <ChevronUp size={18} className="text-text-dim" /> : <ChevronDown size={18} className="text-text-dim" />}
              </button>
              {expandedSection === 'rating' && (
                <div className="p-5 pt-0 flex flex-col gap-3">
                  <div className="flex gap-2 justify-between px-2 py-4 bg-surface-darker rounded-xl border border-white/5 shadow-inner">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = star <= minRating;
                      return (
                        <button
                          key={star}
                          onClick={() => {
                            if (minRating >= star) {
                              setMinRating(star - 1);
                            } else {
                              setMinRating(star);
                            }
                          }}
                          className={cn(
                            "p-2.5 rounded-2xl transition-all active:scale-90",
                            isActive ? "bg-yellow-500/10" : "hover:bg-white/5"
                          )}
                        >
                          <Star
                            size={28}
                            className={cn(
                              "transition-all",
                              isActive
                                ? "fill-yellow-500 text-yellow-500 drop-shadow-[0_0_12px_rgba(234,179,8,0.5)]"
                                : "fill-transparent text-text-dim/50"
                            )}
                          />
                        </button>
                      );
                    })}
                  </div>
                  {minRating > 0 && (
                    <p className="text-center text-sm font-bold text-yellow-500 animate-in fade-in">
                      {minRating} {minRating === 1 ? 'estrela' : 'estrelas'} ou mais
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Accordion: Data */}
            <div className="bg-surface-dark border border-white/5 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleAccordion('recent')}
                className="w-full flex items-center justify-between p-5 font-bold text-white hover:bg-white/5 transition-colors"
              >
                <span>Data {dateFilter !== 'all' && <span className="ml-2 text-primary-light text-[12px] bg-primary-base/20 px-2.5 py-1 rounded-full">1</span>}</span>
                {expandedSection === 'recent' ? <ChevronUp size={18} className="text-text-dim" /> : <ChevronDown size={18} className="text-text-dim" />}
              </button>
              {expandedSection === 'recent' && (
                <div className="p-5 pt-0 flex flex-col gap-2">
                  {[
                    { id: 'all', label: 'Qualquer data' },
                    { id: '24h', label: 'Últimas 24 horas' },
                    { id: '7d', label: 'Últimos 7 dias' },
                    { id: '30d', label: 'Últimos 30 dias' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setDateFilter(opt.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-xl border text-sm font-bold transition-all text-left",
                        dateFilter === opt.id
                          ? "bg-primary-base/10 text-primary-light border-primary-base/30 shadow-[0_0_10px_rgba(139,92,246,0.1)]"
                          : "bg-surface-darker text-text-dim border-white/5 hover:text-white"
                      )}
                    >
                      <span>{opt.label}</span>
                      {dateFilter === opt.id ? <Check size={18} /> : <div className="w-[18px] h-[18px] rounded-full border border-white/10" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent pt-12">
            <Button onClick={() => setIsFilterOpen(false)} className="w-full h-[56px] rounded-2xl text-[16px] font-black shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              Ver Resultados
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
