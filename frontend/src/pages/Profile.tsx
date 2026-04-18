import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userService } from "@/services/userService";
import type { Achievement } from "@/types";
import { Droplet, Flame, Trophy, Target, Sparkles, Beaker, PenTool, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = { Droplet, Flame, Trophy, Target, Sparkles, Beaker, PenTool };

const Profile = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  useEffect(() => { userService.achievements().then(setAchievements); }, []);
  if (!user) return null;
  const xpPct = (user.xp / user.xpToNextLevel) * 100;

  return (
    <AppLayout>
      <div className="glass-card p-6 md:p-8 mb-6 bg-gradient-card relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-hero opacity-30 blur-3xl" />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="h-28 w-28 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-display font-black text-4xl shadow-glow ring-4 ring-warning/40">
            {user.username.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs font-bold text-accent">{user.equipped.title}</p>
            <h1 className="font-display text-3xl font-black">{user.username}</h1>
            <p className="text-sm text-muted-foreground mb-3">Nível {user.level} · Liga {user.league} · 5º no ranking</p>
            <div className="h-3 rounded-full bg-secondary overflow-hidden max-w-md">
              <div className="h-full liquid-bar" style={{ width: `${xpPct}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{user.xp}/{user.xpToNextLevel} XP</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <Stat label="Quizzes" value="142" />
          <Stat label="Acerto" value="87%" />
          <Stat label="Total Ink" value={user.totalInk.toString()} />
        </div>
      </div>

      <Tabs defaultValue="achievements">
        <TabsList className="glass">
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          <TabsTrigger value="avatars">Avatares</TabsTrigger>
          <TabsTrigger value="frames">Molduras</TabsTrigger>
          <TabsTrigger value="titles">Títulos</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {achievements.map((a) => {
              const Icon = iconMap[a.icon] ?? Sparkles;
              return (
                <div key={a.id} className={cn("glass-card p-4 text-center transition-bounce", a.unlocked ? "hover:shadow-glow" : "opacity-60")}>
                  <div className={cn("h-16 w-16 mx-auto rounded-2xl flex items-center justify-center mb-3", a.unlocked ? "bg-gradient-primary shadow-glow" : "bg-secondary")}>
                    {a.unlocked ? <Icon className="h-8 w-8 text-primary-foreground" /> : <Lock className="h-7 w-7 text-muted-foreground" />}
                  </div>
                  <p className="font-display font-bold text-sm">{a.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
                  {a.goal && !a.unlocked && (
                    <p className="text-xs text-primary font-semibold mt-2">{a.progress}/{a.goal}</p>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>
        {["avatars","frames","titles"].map((t) => (
          <TabsContent key={t} value={t} className="mt-6">
            <div className="glass-card p-12 text-center text-muted-foreground">
              Personalize seu perfil — itens cosméticos em breve ✨
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </AppLayout>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="glass rounded-2xl p-4 text-center">
    <p className="font-display text-2xl font-black gradient-text">{value}</p>
    <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
  </div>
);

export default Profile;
