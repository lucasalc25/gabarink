import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { quizService } from "@/services/quizService";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flame, Droplet, Trophy, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import type { AreaENEM, DailyMission, Subject } from "@/types";
import { motion } from "framer-motion";
import { AreaBadge, LEAGUES_CONFIG } from "@/components/shared/StatsBadges";

const Home = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<DailyMission[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    userService.dailyMissions().then(setMissions);
    quizService.listSubjects().then(setSubjects);
  }, []);

  if (!user) return null;

  const totalXp = Object.values(user.stats).reduce((acc, s) => acc + (s?.score || 0), 0);
  const derivedLevel = Math.floor(totalXp / 100);
  const nextLevelXp = (derivedLevel + 1) * 100;
  const xpPct = Math.round(((totalXp % 100) / 100) * 100);

  const bestArea = (Object.keys(user.stats) as AreaENEM[]).reduce((a, b) => 
    (user.stats[a]?.score || 0) > (user.stats[b]?.score || 0) ? a : b
  );

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        {/* Hero card */}
        <div className="glass-card p-6 md:p-8 bg-gradient-card relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-hero opacity-30 blur-3xl" />
          <div className="relative grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground mb-1">Bem-vindo de volta,</p>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="font-display text-3xl md:text-4xl font-black">Olá, {user.username.split(" ")[0]} 👋</h1>
                <div className="hover:scale-110 transition-transform cursor-help" title={`Especialista em ${bestArea}`}>
                  <AreaBadge area={bestArea} score={user.stats[bestArea].score} size={40} />
                </div>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-black text-primary-light bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">NÍVEL {derivedLevel}</span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{totalXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP TOTAL</span>
              </div>
              <div className="h-3 rounded-full bg-secondary overflow-hidden shadow-inner border border-white/5">
                <div className="liquid-bar h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${xpPct}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
              <Stat icon={Droplet} label="Ink" value={`${user.inkDrops}/${user.maxInkDrops}`} color="text-primary-glow" />
              <Stat icon={Flame} label="Streak" value={`${user.streak} dias`} color="text-accent" />
            </div>
          </div>
        </div>

        {/* Area Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(["MATEMATICA", "NATUREZA", "HUMANAS", "LINGUAGENS"] as AreaENEM[]).map((area) => (
            <div key={area} className="glass-card p-4 flex flex-col items-center text-center">
              <AreaBadge area={area} score={user.stats[area]?.score || 400} size={48} />
              <p className="text-[10px] font-black text-muted-foreground uppercase mt-3 mb-1">{area}</p>
              <p className="text-sm font-black text-primary-light leading-none mb-1">
                {LEAGUES_CONFIG[area][Math.floor((user.stats[area]?.score || 400) / 100) * 100]}
              </p>
              <p className="text-[10px] font-bold text-accent uppercase opacity-60">
                {user.stats[area]?.score || 400} XP
              </p>
            </div>
          ))}
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
