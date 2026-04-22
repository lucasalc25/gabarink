import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { quizService } from "@/services/quizService";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flame, Droplet, Trophy, ArrowRight, Sparkles, CheckCircle2, LayoutDashboard } from "lucide-react";
import type { AreaENEM, DailyMission, Subject } from "@/types";
import { motion } from "framer-motion";
import { AreaBadge, getTierByPoints, getRomanByPoints } from "@/components/shared/StatsBadges";

const Home = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<DailyMission[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    userService.dailyMissions().then(setMissions);
    quizService.listSubjects().then(setSubjects);
  }, []);

  if (!user) return null;

  // Use the new XP and Points structure
  const currentXp = user.total_xp || 0;
  const level = user.level || 1;
  const nextLevelXp = user.xpToNextLevel || (level * 1000);
  const xpPct = Math.round((currentXp / nextLevelXp) * 100);

  const areas: AreaENEM[] = ["MATEMATICA", "NATUREZA", "HUMANAS", "LINGUAGENS"];
  const arenaAverage = Math.min(1000, Math.round(areas.reduce((acc, curr) => acc + (user.stats[curr]?.points || 0), 0) / areas.length));
  
  // Highest league badge
  const highestArea = areas.reduce((prev, curr) => {
    const prevPoints = user.stats[prev]?.points || 0;
    const currPoints = user.stats[curr]?.points || 0;
    return currPoints > prevPoints ? curr : prev;
  });

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
        
        {/* Welcome Hero Card */}
        <div className="glass-card p-6 md:p-10 bg-gradient-card border-white/5 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl group-hover:bg-primary/30 transition-all duration-700" />
          
          <div className="relative flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-6">
              <div className="space-y-1">
                 <div className="flex items-center gap-2 text-primary-light font-black text-[10px] uppercase tracking-widest">
                    <LayoutDashboard className="h-3 w-3" />
                    Painel de Evolução
                 </div>
                 <div className="flex items-center gap-4">
                    <h1 className="font-display text-4xl md:text-5xl font-black">Olá, {user.username}!</h1>
                    <div className="hover:scale-110 transition-transform cursor-help">
                       <AreaBadge area={highestArea} points={user.stats[highestArea]?.points || 0} size={56} />
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-white">NÍVEL {level}</span>
                      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Global XP</span>
                   </div>
                   <span className="text-xs font-bold text-muted-foreground tabular-nums">
                      {currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()}
                   </span>
                </div>
                <div className="h-4 rounded-full bg-black/40 overflow-hidden p-1 border border-white/5">
                  <div className="liquid-bar h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${xpPct}%` }} />
                </div>
              </div>
            </div>

            <div className="flex md:flex-col gap-3 shrink-0">
               <Stat icon={Droplet} label="Gofas de Ink" value={`${user.inkDrops}/${user.maxInkDrops}`} color="text-primary-glow" />
               <Stat icon={Flame} label="Fogo (Streak)" value={`${user.streak} dias`} color="text-accent" />
               <Stat icon={Trophy} label="Arena Global" value={`${arenaAverage} pts`} color="text-warning" />
            </div>
          </div>
        </div>

        {/* Areas & Leagues Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {areas.map((area) => {
            const stats = user.stats[area];
            const tier = getTierByPoints(stats?.points || 0);
            const roman = getRomanByPoints(stats?.points || 0);
            return (
              <div key={area} className="glass-card p-5 border-white/5 hover:border-primary/20 transition-all hover:bg-white/5 group">
                <div className="flex items-center gap-4">
                   <AreaBadge area={area} points={stats?.points || 0} size={48} />
                   <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{area}</p>
                      <p className="text-lg font-black text-white group-hover:text-primary-light transition-colors">
                        {tier.name} {roman}
                      </p>
                      <p className="text-[10px] font-bold text-primary-light/60 uppercase">
                        {stats?.points || 0} Pontos Arena
                      </p>
                   </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Section */}
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-black">Trilha de Estudos</h2>
                <Button variant="ghost" size="sm" asChild className="text-primary-light hover:text-primary">
                   <Link to="/trail">Ver tudo <ArrowRight className="h-4 w-4 ml-2" /></Link>
                </Button>
             </div>
             
             <div className="space-y-3">
               <Link to="/quiz/3" className="flex items-center justify-between gap-6 p-6 rounded-2xl bg-secondary/20 hover:bg-secondary/40 border border-white/5 transition-all group">
                 <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-muted-foreground uppercase mb-1">Matemática · Álgebra</p>
                    <h3 className="text-xl font-bold mb-3 truncate">Equações de 2º Grau</h3>
                    <div className="flex items-center gap-4">
                       <Progress value={45} className="h-2 flex-1" />
                       <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">45% concluído</span>
                    </div>
                 </div>
                 <Button className="bg-gradient-primary text-primary-foreground h-12 w-12 rounded-2xl shadow-glow shrink-0">
                    <ArrowRight size={24} />
                 </Button>
               </Link>
             </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <h2 className="font-display text-2xl font-black">Missões</h2>
             <div className="space-y-3">
               {missions.map((m) => (
                 <div key={m.id} className="p-4 rounded-2xl glass border-white/5 relative overflow-hidden group">
                    <div className="flex items-start justify-between relative z-10 mb-3">
                       <div className="space-y-1">
                          <p className="font-bold text-sm flex items-center gap-2">
                             {m.completed ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Sparkles className="h-4 w-4 text-primary-light" />}
                             {m.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{m.description}</p>
                       </div>
                       <span className="text-[10px] font-black text-primary-light">+{m.rewardXp} XP</span>
                    </div>
                    <Progress value={(m.progress / m.goal) * 100} className="h-1.5" />
                    <div className="mt-2 flex justify-end">
                       <span className="text-[10px] font-black text-muted-foreground">{m.progress}/{m.goal}</span>
                    </div>
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
  <div className="glass rounded-xl p-3 px-4 flex items-center gap-3 border-white/5">
    <Icon className={`h-5 w-5 ${color}`} />
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">{label}</p>
      <p className="font-display font-black text-sm text-white leading-none">{value}</p>
    </div>
  </div>
);

export default Home;
