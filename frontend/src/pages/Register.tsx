import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  ChevronLeft, 
  Search, 
  Users, 
  Globe, 
  MessageSquare, 
  BarChart3, 
  Target, 
  Award,
  Bell, 
  Rocket, 
  Compass,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { quizService } from '@/services/quizService';

type OnboardingData = {
  source: string;
  proficiency: Record<string, number>;
  dailyGoal: string;
  notifications: boolean;
  startingPath: 'zero' | 'finding';
};

const AREA_SUBJECTS: Record<string, string[]> = {
  linguagens: ['Gramática', 'Literatura', 'Língua Estrangeira', 'Artes'],
  humanas: ['História', 'Geografia', 'Filosofia', 'Sociologia'],
  natureza: ['Biologia', 'Química', 'Física'],
  matematica: ['Álgebra', 'Geometria', 'Estatística', 'Trigonometria'],
};

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const intent = searchParams.get('intent') || 'linguagens';
  
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    source: '',
    proficiency: {},
    dailyGoal: '',
    notifications: false,
    startingPath: 'zero'
  });

  const subjects = AREA_SUBJECTS[intent] || AREA_SUBJECTS.linguagens;

  const handleNext = () => {
    if (step < 5) {
      setStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      navigate('/');
    }
  };

  const handleFinish = async () => {
    try {
      // Pick a random quiz based on category or just random
      const quizzes = await quizService.getQuizzes({ category: intent === 'linguagens' ? 'Português' : undefined });
      const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
      if (randomQuiz) {
        navigate(`/quiz/${randomQuiz.id}/play`);
      } else {
        navigate('/');
      }
    } catch (error) {
      navigate('/');
    }
  };

  const updateProficiency = (subject: string, level: number) => {
    setData(prev => ({
      ...prev,
      proficiency: { ...prev.proficiency, [subject]: level }
    }));
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center relative overflow-hidden px-4 py-12">
      {/* Back Button */}
      <button 
        onClick={handleBack}
        className="absolute top-4 left-4 lg:left-12 flex items-center gap-2 text-text-dim hover:text-text-white transition-colors group z-50"
      >
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
          <ChevronLeft size={20} />
        </div>
        <span className="text-sm font-bold uppercase tracking-wider">Voltar</span>
      </button>

      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center gap-12 z-10">
        
        {/* Step 1: Discovery Source */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-text-white leading-tight">
                Como você soube do <span className="text-primary-light">Gabarink</span>?
              </h2>
              <p className="text-text-dim text-lg">Queremos saber como nossa comunidade está crescendo.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'social', label: 'Redes Sociais', icon: Globe },
                { id: 'friends', label: 'Amigos ou Família', icon: Users },
                { id: 'search', label: 'Google ou Pesquisa', icon: Search },
                { id: 'other', label: 'Outros Canais', icon: MessageSquare },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setData(prev => ({ ...prev, source: option.id }))}
                  className={cn(
                    "flex items-center gap-4 p-6 rounded-3xl border-2 transition-all duration-300 text-left",
                    data.source === option.id 
                      ? "border-primary-base bg-primary-base/20 shadow-[0_0_30px_rgba(119,52,230,0.2)]" 
                      : "border-white/5 bg-surface-dark/40 hover:border-white/10"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                    data.source === option.id ? "bg-primary-base text-white" : "bg-white/5 text-text-dim"
                  )}>
                    <option.icon size={24} />
                  </div>
                  <span className={cn("text-lg font-bold", data.source === option.id ? "text-text-white" : "text-text-dim")}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Proficiency */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-text-white leading-tight">
                Quanto você sabe das matérias de <span className="text-primary-light capitalize">{intent}</span>?
              </h2>
              <p className="text-text-dim text-lg">Isso nos ajuda a nivelar seus primeiros desafios.</p>
            </div>

            <Card className="bg-surface-dark/40 border-white/5 backdrop-blur-xl rounded-[32px] overflow-hidden shadow-2xl">
              <CardContent className="p-8 space-y-10">
                {subjects.map((subject) => (
                  <div key={subject} className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-lg font-bold text-text-white">{subject}</span>
                      <span className="text-primary-light font-black">
                        {data.proficiency[subject] === 1 ? 'Iniciante' : 
                         data.proficiency[subject] === 2 ? 'Intermediário' : 
                         data.proficiency[subject] === 3 ? 'Avançado' : 'Selecione'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((level) => (
                        <button
                          key={level}
                          onClick={() => updateProficiency(subject, level)}
                          className={cn(
                            "flex-1 h-3 rounded-full transition-all duration-500",
                            (data.proficiency[subject] || 0) >= level 
                              ? "bg-primary-base shadow-[0_0_15px_rgba(119,52,230,0.5)]" 
                              : "bg-white/10 hover:bg-white/20"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Daily Goal */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-text-white leading-tight">
                Qual vai ser sua <span className="text-primary-light">meta diária</span>?
              </h2>
              <p className="text-text-dim text-lg">Defina um compromisso realista com sua aprovação.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'casual', label: 'Casual', desc: '5 minutos por dia', icon: Target },
                { id: 'regular', label: 'Regular', desc: '15 minutos por dia', icon: BarChart3 },
                { id: 'serious', label: 'Sério', desc: '30 minutos por dia', icon: Award },
                { id: 'intense', label: 'Intenso', desc: '60 minutos por dia', icon: Rocket },
              ].map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setData(prev => ({ ...prev, dailyGoal: goal.id }))}
                  className={cn(
                    "flex items-center justify-between p-6 rounded-3xl border-2 transition-all duration-300 text-left",
                    data.dailyGoal === goal.id 
                      ? "border-primary-base bg-primary-base/20 shadow-[0_0_30px_rgba(119,52,230,0.2)]" 
                      : "border-white/5 bg-surface-dark/40 hover:border-white/10"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                      data.dailyGoal === goal.id ? "bg-primary-base text-white" : "bg-white/5 text-text-dim"
                    )}>
                      <goal.icon size={24} />
                    </div>
                    <div>
                      <p className={cn("text-lg font-bold", data.dailyGoal === goal.id ? "text-text-white" : "text-text-dim")}>
                        {goal.label}
                      </p>
                      <p className="text-sm text-text-dim opacity-70">{goal.desc}</p>
                    </div>
                  </div>
                  {data.dailyGoal === goal.id && <CheckCircle2 className="text-primary-light" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Notifications */}
        {step === 4 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-text-white leading-tight">
                Posso te lembrar de <span className="text-primary-light">praticar</span>?
              </h2>
              <p className="text-text-dim text-lg">Criar um hábito é 80% do caminho para o sucesso.</p>
            </div>

            {/* Notification Mockup Animation */}
            <div className="relative h-48 flex items-center justify-center">
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent h-20 z-20" />
              <div className="w-full max-w-sm bg-surface-dark/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl animate-bounce-slow flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-base rounded-xl flex items-center justify-center">
                  <Bell className="text-white" size={24} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-primary-light uppercase tracking-widest">Gabarink</span>
                    <span className="text-[10px] text-text-dim uppercase">Agora</span>
                  </div>
                  <p className="text-sm font-bold text-text-white">Hora do seu desafio diário! 🐙</p>
                  <p className="text-xs text-text-dim">Mantenha sua ofensiva viva hoje.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={async () => {
                  try {
                    const result = await Notification.requestPermission();
                    setData(prev => ({ ...prev, notifications: result === 'granted' }));
                  } catch (e) {}
                  handleNext();
                }}
                className="w-full h-16 bg-primary-base hover:bg-primary-dark text-white text-xl font-black rounded-3xl transition-all"
              >
                Ativar Notificações
              </Button>
              <button 
                onClick={handleNext}
                className="w-full text-text-dim hover:text-text-white text-sm font-bold uppercase tracking-widest transition-colors py-2"
              >
                Agora não
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Starting Path */}
        {step === 5 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-text-white leading-tight">
                Qual o melhor lugar para <span className="text-primary-light">começar</span>?
              </h2>
              <p className="text-text-dim text-lg">Escolha como quer dar o seu primeiro passo.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { 
                  id: 'zero', 
                  title: 'Começar do zero', 
                  desc: 'Vou trilhar o caminho desde o início.',
                  icon: Compass,
                  color: 'from-blue-500/20 to-blue-600/20',
                  iconColor: 'bg-blue-500'
                },
                { 
                  id: 'finding', 
                  title: 'Achar meu nível', 
                  desc: 'Quero um desafio baseado no que já sei.',
                  icon: Rocket,
                  color: 'from-primary-base/20 to-primary-dark/20',
                  iconColor: 'bg-primary-base'
                },
              ].map((path) => (
                <button
                  key={path.id}
                  onClick={() => setData(prev => ({ ...prev, startingPath: path.id as any }))}
                  className={cn(
                    "flex flex-col p-8 rounded-[40px] border-2 transition-all duration-500 text-left gap-6 group",
                    data.startingPath === path.id 
                      ? "border-primary-base bg-primary-base/10 shadow-[0_0_50px_rgba(119,52,230,0.3)]" 
                      : "border-white/5 bg-surface-dark/40 hover:border-white/10"
                  )}
                >
                  <div className={cn(
                    "w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-lg",
                    data.startingPath === path.id ? path.iconColor + " text-white" : "bg-white/5 text-text-dim group-hover:bg-white/10"
                  )}>
                    <path.icon size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className={cn("text-2xl font-black", data.startingPath === path.id ? "text-text-white" : "text-text-dim group-hover:text-text-white")}>
                      {path.title}
                    </h3>
                    <p className="text-sm text-text-dim leading-relaxed">{path.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Button (Conditional for Step 4) */}
        {step !== 4 && (
          <div className="flex justify-center pb-12">
            <Button 
              onClick={handleNext}
              disabled={
                (step === 1 && !data.source) ||
                (step === 2 && Object.keys(data.proficiency).length < subjects.length) ||
                (step === 3 && !data.dailyGoal) ||
                (step === 5 && !data.startingPath)
              }
              className="w-full max-w-sm h-16 bg-gradient-primary text-white text-xl font-black rounded-3xl shadow-2xl shadow-primary-base/20 hover:scale-105 active:scale-95 transition-all animate-in fade-in duration-700"
            >
              {step === 5 ? 'Começar Jornada' : 'Continuar'}
            </Button>
          </div>
        )}

      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {[1, 2, 3, 4, 5].map((s) => (
          <div 
            key={s} 
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              s === step ? "w-8 bg-primary-base" : s < step ? "w-4 bg-primary-dark" : "w-2 bg-white/10"
            )} 
          />
        ))}
      </div>
    </div>
  );
}
