import { useEffect, useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { rankingService } from "@/services/rankingService";
import type { RankingEntry, AreaENEM, User } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Crown, Medal, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AreaBadge, LEAGUES_CONFIG } from "@/components/shared/StatsBadges";

type RankingArea = 'GERAL' | AreaENEM;

const AREA_LABELS: Record<RankingArea, string> = {
  GERAL: "Geral (Total)",
  MATEMATICA: "Matemática",
  NATUREZA: "Ciências da Natureza",
  HUMANAS: "Ciências Humanas",
  LINGUAGENS: "Linguagens"
};

const Ranking = () => {
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [selectedArea, setSelectedArea] = useState<RankingArea>('GERAL');
  
  useEffect(() => { 
    rankingService.global().then(setEntries); 
  }, []);

  const getScore = (entry: RankingEntry, area: RankingArea) => {
    if (area === 'GERAL') {
      return Object.values(entry.user.stats).reduce((acc, s) => acc + s.score, 0);
    }
    return entry.user.stats[area as AreaENEM]?.score || 0;
  };

  const sortedEntries = useMemo(() => {
    return [...entries]
      .map(e => ({ ...e, currentScore: getScore(e, selectedArea) }))
      .sort((a, b) => b.currentScore - a.currentScore)
      .map((e, i) => ({ ...e, position: i + 1 }));
  }, [entries, selectedArea]);

  const top3 = sortedEntries.slice(0, 3);
  const rest = sortedEntries.slice(3);

  return (
    <AppLayout>
      <div className="max-w-[720px] mx-auto w-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="font-display text-4xl font-black gradient-text">Ranking</h1>
            <p className="text-muted-foreground">O caminho para a aprovação é feito de consistência.</p>
          </div>
          
          <div className="flex flex-col gap-2 w-full md:w-64">
             <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Filtrar por Área</label>
             <Select value={selectedArea} onValueChange={(v) => setSelectedArea(v as RankingArea)}>
                <SelectTrigger className="glass border-white/5 focus:ring-primary-light h-11 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary-light" />
                    <SelectValue placeholder="Selecione a área" />
                  </div>
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                   {Object.entries(AREA_LABELS).map(([val, label]) => (
                     <SelectItem key={val} value={val} className="focus:bg-primary/20">{label}</SelectItem>
                   ))}
                </SelectContent>
             </Select>
          </div>
        </div>

        <Tabs defaultValue="global" className="w-full">
          <TabsList className="glass mb-8 p-1 h-12">
            <TabsTrigger value="global" className="flex-1 rounded-lg">Histórico</TabsTrigger>
            <TabsTrigger value="weekly" className="flex-1 rounded-lg">Semanal</TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="mt-0">
            <Podium top3={top3} area={selectedArea} />
            <RankList entries={rest} area={selectedArea} />
          </TabsContent>
          <TabsContent value="weekly" className="mt-0">
            <Podium top3={top3} area={selectedArea} />
            <RankList entries={rest} area={selectedArea} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

const podiumStyle = (pos: number) => {
  if (pos === 1) return { height: "h-44 md:h-52", grad: "from-warning to-accent", ring: "ring-warning/60", icon: "text-warning", label: "1º" };
  if (pos === 2) return { height: "h-36 md:h-40", grad: "from-muted-foreground/50 to-secondary", ring: "ring-muted-foreground/30", icon: "text-muted-foreground", label: "2º" };
  return { height: "h-28 md:h-32", grad: "from-accent/40 to-primary/40", ring: "ring-accent/20", icon: "text-accent", label: "3º" };
};

const getRelevantBadgeData = (user: User, area: RankingArea) => {
  if (area !== 'GERAL') {
    return { area: area as AreaENEM, score: user.stats[area as AreaENEM]?.score || 400 };
  }
  const bestArea = (Object.keys(user.stats) as AreaENEM[]).reduce((a, b) => 
    (user.stats[a]?.score || 0) > (user.stats[b]?.score || 0) ? a : b
  );
  return { area: bestArea, score: user.stats[bestArea]?.score || 400 };
};

const Podium = ({ top3, area }: { top3: any[]; area: RankingArea }) => {
  if (top3.length === 0) return null;
  const order = [top3[1], top3[0], top3[2]].filter(Boolean);
  
  return (
    <div className="relative pt-16 pb-8 px-4 md:px-8 mb-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-radial from-primary/10 to-transparent -z-10" />
      <div className="relative z-10 grid grid-cols-3 gap-2 md:gap-8 items-end max-w-2xl mx-auto">
        {order.map((e) => {
          const s = podiumStyle(e.position);
          const badge = getRelevantBadgeData(e.user, area);
          return (
            <motion.div
              key={e.user.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: e.position * 0.15, type: "spring", stiffness: 100 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-4 group">
                <div className="absolute -top-5 -right-5 z-20 hover:scale-110 transition-transform">
                    <AreaBadge area={badge.area} score={badge.score} size={e.position === 1 ? 48 : 40} />
                </div>
                {e.position === 1 && <Crown className={cn("absolute -top-12 left-1/2 -translate-x-1/2 h-12 w-12 animate-bounce-slow", s.icon)} />}
                <div className={cn(
                  "h-18 w-18 md:h-28 md:w-28 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-display font-black text-3xl md:text-5xl shadow-glow ring-4 overflow-hidden relative",
                  s.ring
                )}>
                   {e.user.avatarUrl ? (
                     <img src={e.user.avatarUrl} alt={e.user.username} className="w-full h-full object-cover" />
                   ) : (
                     e.user.username.charAt(0)
                   )}
                </div>
              </div>
              <p className="font-display font-bold text-sm md:text-xl text-center truncate max-w-full px-1 mb-1">{e.user.username.split(" ")[0]}</p>
              <p className="text-[10px] md:text-sm font-black text-primary-light mb-6 uppercase tracking-tighter">
                {e.currentScore.toLocaleString()} XP
              </p>
              <div className={cn("w-full rounded-t-[2.5rem] bg-gradient-to-b shadow-elevated flex items-center justify-center border-x border-t border-white/5", s.height, s.grad)}>
                <span className="font-display font-black text-3xl md:text-6xl text-primary-foreground drop-shadow-lg opacity-80">{s.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const RankList = ({ entries, area }: { entries: any[]; area: RankingArea }) => (
  <div className="glass-card overflow-hidden border-white/10">
    <div className="grid grid-cols-12 px-4 md:px-8 py-5 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-white/5 bg-white/5">
      <div className="col-span-2">Pos</div>
      <div className="col-span-6">Estudante</div>
      <div className="col-span-1 text-center">%</div>
      <div className="col-span-3 text-right">XP</div>
    </div>
    <div className="divide-y divide-white/5">
      {entries.map((e) => {
        const badge = getRelevantBadgeData(e.user, area);
        return (
          <motion.div
            key={e.user.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "grid grid-cols-12 px-4 md:px-8 py-5 items-center transition-all group",
              e.isCurrentUser ? "bg-primary/20 ring-inset ring-1 ring-primary/40" : "hover:bg-white/5"
            )}
          >
            <div className="col-span-2 flex items-center gap-2 md:gap-4">
              <span className="font-display font-black text-lg md:text-2xl text-muted-foreground/30 group-hover:text-primary-light transition-colors">
                {e.position}º
              </span>
              {e.position < 6 && <Medal className={cn("h-5 w-5", e.position <= 3 ? "text-warning" : "text-muted-foreground/20")} />}
            </div>
            
            <div className="col-span-6 flex items-center gap-4 md:gap-6 min-w-0">
              <div className="relative">
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-display font-bold text-xl shrink-0 overflow-hidden ring-2 ring-white/10 group-hover:ring-primary-light/50 transition-all">
                  {e.user.avatarUrl ? (
                    <img src={e.user.avatarUrl} alt={e.user.username} className="w-full h-full object-cover" />
                  ) : (
                    e.user.username.charAt(0)
                  )}
                </div>
                <div className="absolute -bottom-1 -right-2 z-10 scale-90 group-hover:scale-110 transition-transform">
                  <AreaBadge area={badge.area} score={badge.score} size={28} />
                </div>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm md:text-lg truncate group-hover:text-primary-light transition-colors">{e.user.username}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-black truncate opacity-60 flex items-center gap-2">
                   <span>{badge.area}</span>
                   <span className="h-1 w-1 rounded-full bg-primary-light" />
                   <span className="text-primary-light">
                      {LEAGUES_CONFIG[badge.area][Math.floor(badge.score / 100) * 100] || "..."}
                   </span>
                </p>
              </div>
            </div>
            
            <div className="col-span-1 text-center">
                <span className="text-xs md:text-sm font-bold text-muted-foreground">{e.accuracy}%</span>
            </div>
            
            <div className="col-span-3 text-right">
              <span className="font-display font-black text-lg md:text-2xl text-primary-light group-hover:text-white transition-colors">
                {e.currentScore.toLocaleString()}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);

const styles = `
  @keyframes bounce-slow {
    0%, 100% { transform: translate(-50%, 0); }
    50% { transform: translate(-50%, -15px); }
  }
  .animate-bounce-slow {
    animation: bounce-slow 3s ease-in-out infinite;
  }
`;

export default function RankingWrapper() {
  return (
    <>
      <style>{styles}</style>
      <Ranking />
    </>
  );
}
