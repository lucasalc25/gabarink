import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Filter, BookOpen, Music, Atom, History, Globe, Brain, Zap, ArrowRight, PenTool } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Template {
  id: string;
  titleKey: string;
  descKey: string;
  categoryKey: string;
  icon: any;
  questionsCount: number;
  difficultyKey: string;
  color: string;
}

const TEMPLATES: Template[] = [
  {
    id: 't1',
    titleKey: 't1_title',
    descKey: 't1_desc',
    categoryKey: 'catScience',
    icon: Atom,
    questionsCount: 15,
    difficultyKey: 'diffMedium',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 't2',
    titleKey: 't2_title',
    descKey: 't2_desc',
    categoryKey: 'catPopCulture',
    icon: Music,
    questionsCount: 20,
    difficultyKey: 'diffEasy',
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 't3',
    titleKey: 't3_title',
    descKey: 't3_desc',
    categoryKey: 'catHistory',
    icon: History,
    questionsCount: 25,
    difficultyKey: 'diffHard',
    color: 'from-amber-600 to-orange-700'
  },
  {
    id: 't4',
    titleKey: 't4_title',
    descKey: 't4_desc',
    categoryKey: 'catGeography',
    icon: Globe,
    questionsCount: 30,
    difficultyKey: 'diffMedium',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 't5',
    titleKey: 't5_title',
    descKey: 't5_desc',
    categoryKey: 'catGeneral',
    icon: Brain,
    questionsCount: 10,
    difficultyKey: 'diffEasy',
    color: 'from-purple-500 to-violet-600'
  },
  {
    id: 't6',
    titleKey: 't6_title',
    descKey: 't6_desc',
    categoryKey: 'catScience',
    icon: Zap,
    questionsCount: 12,
    difficultyKey: 'diffHard',
    color: 'from-cyan-500 to-blue-600'
  }
];

const CATEGORIES = ['catAll', 'catScience', 'catPopCulture', 'catHistory', 'catGeography', 'catGeneral'];

export default function Templates() {
  const navigate = useNavigate();
  const { isLogged } = useAuth();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('catAll');

  const filteredTemplates = TEMPLATES.filter(template => {
    const title = t(template.titleKey).toLowerCase();
    const desc = t(template.descKey).toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = title.includes(query) || desc.includes(query);
    const matchesCategory = activeCategory === 'catAll' || template.categoryKey === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (id: string) => {
    if (!isLogged) {
      if (confirm(t('loginRequired'))) {
        navigate('/login');
      }
      return;
    }
    navigate(`/create?template=${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12 max-w-6xl">
      {/* Header Section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text-white">
          {t('templatesTitle')}
        </h1>
        <p className="text-lg text-text-dim font-medium">
          {t('templatesSub')}
        </p>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" size={20} />
            <Input
              placeholder={t('searchTemplates')}
              className="pl-10 h-12 bg-surface-dark border-border focus:border-primary-base focus:ring-primary-base/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter size={18} className="text-text-dim mr-2" />
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all border transform active:scale-95",
                  activeCategory === cat
                    ? "bg-primary-base text-white border-transparent shadow-lg shadow-primary-base/20"
                    : "bg-surface-dark border-border text-text-dim hover:text-text-white"
                )}
              >
                {t(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <Card
              key={template.id}
              className="group overflow-hidden border-border bg-surface-dark hover:border-primary-base/20 transition-all hover:shadow-2xl hover:shadow-primary-base/10 rounded-[28px]"
            >
              <div className={cn("h-32 bg-gradient-to-br relative overflow-hidden", template.color)}>
                <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <template.icon size={56} className="text-white/80 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                  {t(template.categoryKey)}
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-text-white group-hover:text-primary-light transition-colors">
                    {t(template.titleKey)}
                  </h3>
                  <p className="text-sm text-text-dim line-clamp-2 leading-relaxed font-medium">
                    {t(template.descKey)}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold text-text-dim/60">
                  <div className="flex items-center gap-1.5 bg-surface-muted px-2.5 py-1.5 rounded-lg">
                    <BookOpen size={14} />
                    {template.questionsCount} {t('perguntas')}
                  </div>
                  <div className={cn(
                    "px-2.5 py-1.5 rounded-lg border",
                    template.difficultyKey === 'diffEasy' ? "border-green-500/20 text-green-500" :
                      template.difficultyKey === 'diffMedium' ? "border-yellow-500/20 text-yellow-500" :
                        "border-red-500/20 text-red-500"
                  )}>
                    {t(template.difficultyKey)}
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <Button
                    className="flex-1 rounded-2xl h-11 font-black gap-2 transition-all shadow-lg active:scale-95"
                    onClick={() => handleUseTemplate(template.id)}
                  >
                    {t('useTemplate')}
                    <ArrowRight size={18} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-2xl h-11 w-11 p-0 shrink-0 border-border bg-surface-muted hover:bg-surface-muted/80 text-text-white"
                    title={t('editable')}
                  >
                    <PenTool size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-20 bg-surface-dark border border-border rounded-[40px] space-y-4">
            <Search size={48} className="mx-auto text-text-white/10" />
            <div className="space-y-2">
              <p className="text-xl font-bold text-text-white">{t('noTemplatesFound')}</p>
              <p className="text-text-dim">{t('tryAdjustingFilters')}</p>
            </div>
            <Button variant="ghost" onClick={() => { setSearchQuery(''); setActiveCategory('catAll'); }}>
              {t('clearFilters')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
