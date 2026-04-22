import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { quizService } from "@/services/quizService";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Quiz } from "@/types";
import { cn } from "@/lib/utils";

const QuizPlayer = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const nav = useNavigate();
  const competitive = params.get("mode") === "competitive";

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  useEffect(() => { if (id) quizService.getQuiz(id).then(setQuiz); }, [id]);

  if (!quiz) return <AppLayout><div className="text-muted-foreground">Carregando quiz...</div></AppLayout>;
  const q = quiz.questions[idx];
  const total = quiz.questions.length;
  const progress = ((idx + (revealed ? 1 : 0)) / total) * 100;

  const choose = (optId: string) => {
    if (revealed) return;
    setSelected(optId);
    setAnswers({ ...answers, [q.id]: optId });
    if (!competitive) setRevealed(true);
  };

  const next = () => {
    if (idx + 1 >= total) {
      setDone(true);
    } else {
      setIdx(idx + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const submitCompetitive = () => {
    if (selected) next();
  };

  if (done) {
    const correct = Object.entries(answers).filter(([qid, oid]) => quiz.questions.find((q) => q.id === qid)?.correctOptionId === oid).length;
    const pct = Math.round((correct / total) * 100);
    return (
      <AppLayout>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto glass-card p-8 text-center bg-gradient-card relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-hero opacity-30 blur-3xl" />
          <Trophy className="h-16 w-16 mx-auto text-warning mb-4" />
          <h1 className="font-display text-4xl font-black mb-2">Quiz concluído!</h1>
          <p className="text-muted-foreground mb-6">Você acertou {correct} de {total}</p>
          <div className="text-7xl font-display font-black gradient-text mb-2">{pct}%</div>
          <p className="text-sm text-muted-foreground mb-6">Sua nova posição: <span className="font-display font-bold text-primary">5º no ranking</span></p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={() => nav("/home")} variant="outline" className="rounded-full">Voltar</Button>
            <Button onClick={() => { setIdx(0); setAnswers({}); setSelected(null); setRevealed(false); setDone(false); }} variant="outline" className="rounded-full">
              Refazer
            </Button>
            <Button onClick={() => nav("/ranking")} className="rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
              <Trophy className="h-4 w-4 mr-1" /> Ver Ranking Global
            </Button>
          </div>
        </motion.div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        {/* Liquid progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span className="font-semibold">Questão {idx + 1} de {total}</span>
            <span>{competitive ? "Modo Competitivo" : "Modo Casual"}</span>
          </div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden">
            <motion.div className="h-full liquid-bar" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-6 md:p-8"
          >
            <h2 className="font-display text-xl md:text-2xl font-bold mb-6">{q.statement}</h2>
            <div className="space-y-3">
              {q.options.map((o) => {
                const isSel = selected === o.id;
                const isCorrect = revealed && o.id === q.correctOptionId;
                const isWrong = revealed && isSel && o.id !== q.correctOptionId;
                return (
                  <button
                    key={o.id}
                    onClick={() => choose(o.id)}
                    disabled={revealed}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border-2 transition-bounce flex items-center gap-3",
                      "border-border bg-secondary/40 hover:border-primary hover:bg-secondary",
                      isSel && !revealed && "border-primary bg-primary/10",
                      isCorrect && "border-success bg-success/10",
                      isWrong && "border-destructive bg-destructive/10"
                    )}
                  >
                    <span className="h-7 w-7 rounded-full border-2 border-current flex items-center justify-center font-display font-bold text-sm">
                      {o.id.toUpperCase()}
                    </span>
                    <span className="flex-1 font-medium">{o.text}</span>
                    {isCorrect && <Check className="h-5 w-5 text-success" />}
                    {isWrong && <X className="h-5 w-5 text-destructive" />}
                  </button>
                );
              })}
            </div>

            {revealed && q.explanation && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/30">
                <p className="text-sm"><strong className="text-primary">Explicação:</strong> {q.explanation}</p>
              </motion.div>
            )}

            <div className="flex justify-end mt-6">
              {competitive ? (
                <Button onClick={submitCompetitive} disabled={!selected} className="rounded-full bg-gradient-primary text-primary-foreground">
                  {idx + 1 >= total ? "Finalizar" : "Próxima"} <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                revealed && (
                  <Button onClick={next} className="rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
                    {idx + 1 >= total ? "Ver resultado" : "Próxima"} <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                )
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};
export default QuizPlayer;
