import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { quizService } from "@/services/quizService";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flame, Droplet, Trophy, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import type { DailyMission, Subject } from "@/types";
import { motion } from "framer-motion";

const Home = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<DailyMission[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    userService.dailyMissions().then(setMissions);
    quizService.listSubjects().then(setSubjects);
  }, []);

  if (!user) return null;
  const xpPct = Math.round((user.xp / user.xpToNextLevel) * 100);

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        {/* Hero card */}
        <div className="glass-card p-6 md:p-8 bg-gradient-card relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-hero opacity-30 blur-3xl" />
          <div className="relative grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground mb-1">Bem-vindo de volta,</p>
              <h1 className="font-display text-3xl md:text-4xl font-black mb-4">Olá, {user.username.split(" ")[0]} 👋</h1>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-primary">NÍVEL {user.level}</span>
                <span className="text-xs text-muted-foreground">{user.xp}/{user.xpToNextLevel} XP</span>
              </div>
              <div className="h-3 rounded-full bg-secondary overflow-hidden">
                <div className="liquid-bar h-full rounded-full transition-all" style={{ width: `${xpPct}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
              <Stat icon={Droplet} label="Ink" value={`${user.inkDrops}/${user.maxInkDrops}`} color="text-primary-glow" />
              <Stat icon={Flame} label="Streak" value={`${user.streak} dias`} color="text-accent" />
              <Stat icon={Trophy} label="Liga" value={user.league} color="text-warning" />
            </div>
          </div>
        </div>

        {/* Resume + Missions */}
        <div className="grid lg:grid-cols-3 gap-4 max-w-full">
          <div className="lg:col-span-2 glass-card p-4 md:p-6 max-w-full overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold">Continue de onde parou</h2>
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-3">
              <Link to="/quiz/q_e2" className="flex items-center justify-between gap-3 p-3 md:p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-bounce group max-w-full">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground truncate">Matemática · Equações</p>
                  <p className="font-semibold truncate">Equações quadráticas</p>
                  <Progress value={40} className="h-1.5 mt-2 w-full max-w-[12rem]" />
                </div>
                <Button size="sm" className="bg-gradient-primary text-primary-foreground rounded-full shrink-0">
                  Retomar <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              {subjects.slice(0, 2).map((s) => {
                const next = s.sections[0]?.units.find((u) => u.status === "in-progress");
                if (!next) return null;
                return (
                  <Link key={s.id} to="/trail" className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary transition-bounce">
                    <div>
                      <p className="text-xs text-muted-foreground">{s.name}</p>
                      <p className="font-semibold">{next.name}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="glass-card p-4 md:p-6 max-w-full overflow-hidden">
            <h2 className="font-display text-xl font-bold mb-4">Missões diárias</h2>
            <div className="space-y-3">
              {missions.map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-secondary/40">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm flex items-center gap-1.5">
                        {m.completed && <CheckCircle2 className="h-4 w-4 text-success" />}
                        {m.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{m.description}</p>
                    </div>
                    <span className="text-xs font-bold text-primary">+{m.rewardXp} XP</span>
                  </div>
                  <Progress value={(m.progress / m.goal) * 100} className="h-1.5 mt-2" />
                  <p className="text-[10px] text-muted-foreground mt-1">{m.progress}/{m.goal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

const Stat = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) => (
  <div className="glass rounded-2xl p-3 flex items-center gap-3">
    <Icon className={`h-6 w-6 ${color}`} />
    <div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-display font-bold">{value}</p>
    </div>
  </div>
);

export default Home;
