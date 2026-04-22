import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userService } from "@/services/userService";
import type { Achievement, AreaENEM } from "@/types";
import { Droplet, Flame, Trophy, Target, Sparkles, Beaker, PenTool, Lock, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AreaBadge, getTierByPoints, getRomanByPoints } from "@/components/shared/StatsBadges";

const iconMap: Record<string, any> = { Droplet, Flame, Trophy, Target, Sparkles, Beaker, PenTool };

const Profile = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  
  useEffect(() => { 
    userService.achievements().then(setAchievements); 
  }, []);

  if (!user) return null;

  const xpPct = (user.total_xp / user.xpToNextLevel) * 100;
  const areas: AreaENEM[] = ["MATEMATICA", "NATUREZA", "HUMANAS", "LINGUAGENS"];

  return (
    <AppLayout>
      <div className="glass-card p-6 md:p-10 mb-8 bg-gradient-card relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl opacity-50" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="h-32 w-32 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-display font-black text-5xl shadow-glow ring-4 ring-white/10">
              {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover" /> : user.username.charAt(0)}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
               <p className="text-xs font-black text-primary-light uppercase tracking-widest">{user.equipped.title || "ESTUDANTE"}</p>
               <h1 className="font-display text-4xl font-black">{user.username}</h1>
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {areas.map((area) => {
                const points = user.stats[area]?.points || 0;
                const tier = getTierByPoints(points);
                const roman = getRomanByPoints(points);
                return (
                  <div key={area} className="flex items-center gap-2 glass px-3 py-1.5 rounded-full border-white/5 hover:bg-white/10 transition-all cursor-help" title={`${area}: ${tier.name} ${roman}`}>
                    <AreaBadge area={area} points={points} size={24} />
                    <span className="text-[10px] font-black uppercase text-white/80">{tier.name} {roman}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 max-w-md mx-auto md:mx-0">
               <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-muted-foreground uppercase tracking-tighter">Nível Global {user.level}</span>
                  <span className="text-[10px] font-bold text-muted-foreground">{user.total_xp} / {user.xpToNextLevel} XP</span>
               </div>
               <div className="h-2 rounded-full bg-black/40 overflow-hidden border border-white/5 p-0.5">
                 <div className="h-full liquid-bar rounded-full" style={{ width: `${xpPct}%` }} />
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          <Stat label="Quizzes Concluídos" value="142" />
          <Stat label="Precisão Geral" value="87%" />
          <Stat label="Total de Ink" value={user.totalInk.toLocaleString()} />
          <Stat label="Pontos Arena" value={user.arena_points.toLocaleString()} />
        </div>
      </div>

      <Tabs defaultValue="achievements">
        <TabsList className="glass p-1 h-12">
          <TabsTrigger value="achievements" className="flex-1">Conquistas</TabsTrigger>
          <TabsTrigger value="avatars" className="flex-1">Avatares</TabsTrigger>
          <TabsTrigger value="frames" className="flex-1">Molduras</TabsTrigger>
          <TabsTrigger value="titles" className="flex-1">Títulos</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="mt-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {achievements.map((a) => {
              const Icon = iconMap[a.icon] ?? Sparkles;
              return (
                <div key={a.id} className={cn("glass-card p-6 text-center transition-bounce border-white/5", a.unlocked ? "hover:border-primary/40 hover:shadow-glow" : "opacity-40 grayscale")}>
                  <div className={cn("h-16 w-16 mx-auto rounded-2xl flex items-center justify-center mb-4", a.unlocked ? "bg-gradient-primary shadow-glow" : "bg-secondary")}>
                    {a.unlocked ? <Icon className="h-8 w-8 text-primary-foreground" /> : <Lock className="h-7 w-7 text-muted-foreground" />}
                  </div>
                  <p className="font-display font-black text-sm text-white">{a.name}</p>
                  <p className="text-[10px] font-medium text-muted-foreground mt-2 leading-relaxed">{a.description}</p>
                  {a.goal && !a.unlocked && (
                    <div className="mt-4">
                       <Progress value={(a.progress! / a.goal) * 100} className="h-1" />
                       <p className="text-[9px] font-black text-primary-light mt-1 uppercase">{a.progress}/{a.goal}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>
        {["avatars","frames","titles"].map((t) => (
          <TabsContent key={t} value={t} className="mt-8">
            <div className="glass-card p-20 text-center flex flex-col items-center gap-4">
              <UserCircle size={48} className="text-muted-foreground opacity-20" />
              <p className="text-sm font-medium text-muted-foreground">Personalize seu perfil — itens cosméticos em breve ✨</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </AppLayout>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="glass rounded-2xl p-4 text-center border-white/5 group hover:border-primary/20 transition-all">
    <p className="font-display text-2xl font-black text-white group-hover:text-primary-light transition-colors">{value}</p>
    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-1">{label}</p>
  </div>
);

export default Profile;
