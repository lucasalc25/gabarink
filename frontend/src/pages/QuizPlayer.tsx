import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { quizService } from "@/services/quizService";
import { enemService } from "@/services/enemService";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, Trophy, Timer as TimerIcon, AlertTriangle, RotateCcw, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Quiz, Question } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const QuizPlayer = () => {
  const { id } = useParams();
  const location = useLocation();
  const nav = useNavigate();

  const isArena = location.pathname.includes("/arena/");
  const isDaily = location.pathname.includes("/dailychallenge");

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [alreadyDoneToday, setAlreadyDoneToday] = useState(false);

  // Arena specific states
  const [timeLeft, setTimeLeft] = useState(isDaily ? 180 : 600); // 3m or 10m
  const [scoreChange, setScoreChange] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (isDaily && localStorage.getItem(`daily_challenge_done_${today}`)) {
      setAlreadyDoneToday(true);
      setLoading(false);
      return;
    }

    const loadContent = async () => {
      setLoading(true);
      try {
        if (isDaily) {
          const q = await enemService.getWeeklyChallenge(); // Reusing the hard question logic
          if (q) {
            setQuiz({
              id: "daily",
              title: "Desafio Diário",
              description: "A questão mais difícil do dia.",
              category: "Arena",
              questions: [q],
              area: "MATEMATICA",
              author: { id: "system", name: "Gabarink AI" },
              rating: 5,
              playCount: 0,
              questionsCount: 1,
              difficulty: "hard",
              tags: ["Daily"],
              createdAt: new Date().toISOString()
            } as Quiz);
          }
        } else if (isArena && id) {
          const questions = await enemService.getSimulationQuestions(10);
          if (questions.length > 0) {
            setQuiz({
              id: id,
              title: "Simulado ENEM",
              description: "Simulação cronometrada com questões reais.",
              category: "Arena",
              questions: questions,
              area: "MATEMATICA",
              author: { id: "system", name: "ENEM" },
              rating: 5,
              playCount: 0,
              questionsCount: 10,
              difficulty: "medium",
              tags: ["ENEM", "Simulado"],
              createdAt: new Date().toISOString()
            } as Quiz);
          }
        } else if (id) {
          const data = await quizService.getQuiz(id);
          if (data) setQuiz(data);
          else setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [id, isArena, isDaily]);

  // Timer logic for Arena
  useEffect(() => {
    if (!isArena || done || loading || error || alreadyDoneToday) return;

    if (timeLeft <= 0) {
      handleFinish();
      return;
    }

    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isArena, done, loading, error, alreadyDoneToday]);

  const handleFinish = () => {
    if (!quiz) return;

    const correct = Object.entries(answers).filter(([qid, oid]) => quiz.questions.find((q) => q.id === qid)?.correctOptionId === oid).length;
    const total = quiz.questions.length;
    const allCorrect = correct === total;

    if (isArena) {
      const points = allCorrect ? (isDaily ? 50 : 25) : (isDaily ? -20 : -15);
      setScoreChange(points);
      if (points > 0) toast.success(`Excelente! +${points} pontos de Arena!`);
      else toast.error(`Que pena! ${points} pontos de Arena.`);

      if (isDaily) {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(`daily_challenge_done_${today}`, 'true');
      }
    }

    setDone(true);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (loading) return <AppLayout><div className="flex items-center justify-center min-h-[60vh] text-muted-foreground animate-pulse font-black uppercase tracking-widest">Carregando conteúdo...</div></AppLayout>;

  if (alreadyDoneToday) {
    return (
      <AppLayout>
        <div className="max-w-xl mx-auto glass-card p-12 text-center space-y-6 mt-10">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
            <Trophy className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-black italic">DESAFIO CONCLUÍDO!</h1>
          <p className="text-muted-foreground">Você já realizou o desafio de hoje. Volte amanhã para uma nova questão!</p>
          <Button onClick={() => nav("/arena")} className="bg-primary rounded-xl px-8 font-bold">Voltar para Arena</Button>
        </div>
      </AppLayout>
    );
  }

  if (error || !quiz) {
    return (
      <AppLayout>
        <div className="max-w-xl mx-auto glass-card p-12 text-center space-y-6 mt-10">
          <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <X className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-black">Conteúdo não encontrado</h1>
          <Button onClick={() => nav("/arena")} className="bg-primary rounded-xl px-8 font-bold">Voltar</Button>
        </div>
      </AppLayout>
    );
  }

  const q = quiz.questions[idx];
  const total = quiz.questions.length;
  const progress = ((idx + (revealed || isArena ? (selected ? 1 : 0) : 0)) / total) * 100;

  const choose = (optId: string) => {
    if (revealed && !isArena) return;
    setSelected(optId);
    setAnswers({ ...answers, [q.id]: optId });
    if (!isArena) setRevealed(true);

    // Auto-scroll to bottom to show Next button
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 150);
  };

  const next = () => {
    window.scrollTo(0, 0);
    if (idx + 1 >= total) {
      handleFinish();
    } else {
      setIdx(idx + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  if (done) {
    const correct = Object.entries(answers).filter(([qid, oid]) => quiz.questions.find((q) => q.id === qid)?.correctOptionId === oid).length;
    const pct = Math.round((correct / total) * 100);
    return (
      <AppLayout>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto glass-card p-8 text-center bg-gradient-card relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-hero opacity-30 blur-3xl" />
          <Trophy className="h-16 w-16 mx-auto text-warning mb-4" />
          <h1 className="font-display text-4xl font-black">{isArena ? (scoreChange >= 0 ? "VITÓRIA!" : "DERROTA") : "Concluído!"}</h1>
          <p className="text-muted-foreground mb-1">Você acertou {correct} de {total} questões</p>

          <div className="text-7xl font-display font-black gradient-text mt-3 mb-5">{pct}%</div>

          {isArena && (
            <div className={cn("text-2xl font-black mb-6", scoreChange >= 0 ? "text-success" : "text-destructive")}>
              {scoreChange >= 0 ? "+" : ""}{scoreChange} Pontos Arena
            </div>
          )}

          <div className="space-y-4">
            {!isArena && (
              <div className="flex justify-center">
                <Button
                  onClick={() => { setIdx(0); setAnswers({}); setSelected(null); setRevealed(false); setDone(false); }}
                  className="rounded-2xl h-14 px-12 bg-gradient-primary text-primary-foreground font-black text-lg shadow-glow border-none hover:scale-105 transition-bounce flex items-center gap-2"
                >
                  <motion.div whileTap={{ rotate: -180 }} transition={{ duration: 0.5 }}>
                    <RotateCcw className="h-5 w-5" />
                  </motion.div>
                  Tentar Novamente
                </Button>
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => nav("/ranking")}
                variant="outline"
                className="rounded-2xl h-12 px-6 font-bold border-white/10 hover:bg-white/5 flex items-center gap-2"
              >
                <Trophy className="h-5 w-5" /> Ranking
              </Button>
              <Button
                onClick={() => nav("/home")}
                variant="outline"
                className="rounded-2xl h-12 px-6 font-bold border-white/10 hover:bg-white/5 flex items-center gap-2"
              >
                <Home className="h-5 w-5" /> Início
              </Button>
            </div>
          </div>
        </motion.div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-2 pt-0 pb-6">
        {/* Header with Progress and Timer */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex flex-col justify-center">
              <h1 className="font-display text-xl md:text-2xl font-black italic uppercase tracking-tight leading-none">{quiz.title}</h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Questão {idx + 1} de {total}</p>
            </div>

            {isArena && (
              <div className="px-3 py-1.5 md:px-4 md:py-2 glass rounded-xl border-white/10 flex items-center gap-2 scale-90 md:scale-100 origin-right shrink-0">
                <TimerIcon size={16} className={cn("text-warning shrink-0", timeLeft < 60 && "animate-pulse text-destructive")} />
                <span className="font-display font-black text-lg md:text-xl tabular-nums">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div className="h-full bg-gradient-primary shadow-glow" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Question Card */}
            <div className="glass-card p-4 md:p-8 bg-surface-dark/40 border-white/5 shadow-glow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-primary opacity-50" />

              {/* Question Image (from Arena logic) */}
              {q.imageUrl && (
                <div className="mb-4 rounded-xl overflow-hidden border border-white/10 bg-black/20">
                  <img src={q.imageUrl} alt="Contexto" className="w-full h-auto max-h-[300px] object-contain" />
                </div>
              )}

              <div className="space-y-4">
                {/* Statement might have context + command */}
                <p className="text-muted-foreground leading-relaxed italic text-xs md:text-sm text-justify">
                  {q.statement.includes('\n\n') ? q.statement.split('\n\n')[0] : ''}
                </p>
                <p className="font-display font-black text-base italic leading-tight text-white text-justify">
                  {q.statement.includes('\n\n') ? q.statement.split('\n\n').slice(1).join('\n\n') : q.statement}
                </p>
              </div>
            </div>

            {/* Options Grid */}
            <div className="grid gap-2.5">
              {q.options.map((o) => {
                const isSel = selected === o.id;
                const isCorrect = revealed && o.id === q.correctOptionId;
                const isWrong = revealed && isSel && o.id !== q.correctOptionId;

                return (
                  <button
                    key={o.id}
                    onClick={() => choose(o.id)}
                    disabled={revealed && !isArena}
                    className={cn(
                      "w-full text-left p-3 md:p-4 rounded-xl border-2 transition-all flex items-center gap-3 group",
                      "border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10",
                      isSel && !revealed && "border-primary bg-primary/10 shadow-glow",
                      isCorrect && "border-success bg-success/10",
                      isWrong && "border-destructive bg-destructive/10"
                    )}
                  >
                    <div className={cn(
                      "h-7 w-7 rounded-lg border-2 flex items-center justify-center font-black shrink-0 transition-colors text-xs",
                      isSel && !revealed ? "bg-white text-primary border-white" : "border-white/20 bg-white/5 text-muted-foreground group-hover:text-white"
                    )}>
                      {o.id.toUpperCase()}
                    </div>
                    <span className={cn("flex-1 font-bold text-sm", isSel && !revealed ? "text-white" : "text-muted-foreground group-hover:text-white")}>
                      {o.text}
                    </span>
                    {isCorrect && <Check className="h-4 w-4 text-success" />}
                    {isWrong && <X className="h-4 w-4 text-destructive" />}
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {!isArena && (
                <p className="text-[10px] text-muted-foreground italic flex items-center gap-2">
                  <AlertTriangle size={12} className="text-warning" />
                  As trilhas não custam pontos. Aproveite para aprender!
                </p>
              )}

              <div className="flex items-center gap-4 ml-auto">
                <Button
                  onClick={next}
                  disabled={!selected}
                  className="rounded-xl h-12 px-8 bg-gradient-primary text-primary-foreground font-black text-base shadow-glow border-none hover:scale-105 transition-bounce"
                >
                  {idx + 1 >= total ? "Finalizar" : "Próxima Questão"} <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default QuizPlayer;
