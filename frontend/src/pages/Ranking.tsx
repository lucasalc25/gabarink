import { useEffect, useState, useMemo, useRef } from "react";
import { AppLayout } from "@/components/AppLayout";
import { rankingService } from "@/services/rankingService";
import type { RankingEntry, AreaENEM, User } from "@/types";
import { 
  Trophy, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  Swords,
  Timer,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  LIGAS, 
  getTierByPoints, 
  LeagueIcon,
  AreaBadge
} from "@/components/shared/StatsBadges";
import { useAuth } from "@/context/AuthContext";

type RankingArea = 'GERAL' | AreaENEM;

const AREA_LABELS: Record<RankingArea, string> = {
  GERAL: "Geral",
  MATEMATICA: "Matemática",
  NATUREZA: "Natureza",
  HUMANAS: "Humanas",
  LINGUAGENS: "Linguagens"
};

const Ranking = () => {
  const { user: currentUser } = useAuth();
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [selectedArea, setSelectedArea] = useState<RankingArea>('GERAL');
  
  const initialPoints = useMemo(() => {
    if (!currentUser) return 0;
    const stats = currentUser.stats;
    const areas: AreaENEM[] = ["MATEMATICA", "NATUREZA", "HUMANAS", "LINGUAGENS"];
    const total = areas.reduce((acc, curr) => acc + (stats[curr]?.points || 0), 0);
    return Math.min(1000, Math.round(total / areas.length));
  }, [currentUser]);

  const initialTier = useMemo(() => getTierByPoints(initialPoints), [initialPoints]);
  
  const [activeTierIndex, setActiveTierIndex] = useState(() => {
    const idx = LIGAS.findIndex(t => t.name === initialTier.name);
    return idx !== -1 ? idx : 1; 
  });

  const [timeLeft, setTimeLeft] = useState("");
  const carouselRef = useRef<HTMLDivElement>(null);
  const tierRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const diff = lastDay.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${days}d ${hours}h ${mins}m`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    rankingService.global().then(setEntries);
  }, []);

  const getPoints = (user: User, area: RankingArea) => {
    if (area === 'GERAL') {
      const stats = user.stats;
      const areas: AreaENEM[] = ["MATEMATICA", "NATUREZA", "HUMANAS", "LINGUAGENS"];
      const total = areas.reduce((acc, curr) => acc + (stats[curr]?.points || 0), 0);
      return Math.min(1000, Math.round(total / areas.length));
    }
    return Math.min(1000, user.stats[area as AreaENEM]?.points || 0);
  };

  const currentTier = useMemo(() => {
     const pts = currentUser ? getPoints(currentUser, selectedArea) : 0;
     return getTierByPoints(pts);
  }, [currentUser, selectedArea]);

  useEffect(() => {
    const activeElem = tierRefs.current[activeTierIndex];
    if (activeElem && carouselRef.current) {
      activeElem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeTierIndex]);

  // NEW: Calculate entries with league-specific ranking
  const leagueEntries = useMemo(() => {
    const selectedLeagueName = LIGAS[activeTierIndex].name;
    
    return [...entries]
      .map(e => ({ 
        ...e, 
        currentPoints: getPoints(e.user, selectedArea),
        reachedAt: (e as any).reachedAt || new Date(2024, 0, 1).getTime() 
      }))
      .filter(e => getTierByPoints(e.currentPoints).name === selectedLeagueName)
      .sort((a, b) => {
        // Universal tie-breaker: points first, then time (earlier is better)
        if (b.currentPoints !== a.currentPoints) {
          return b.currentPoints - a.currentPoints;
        }
        return a.reachedAt - b.reachedAt;
      })
      .map((e, i, arr) => {
        const total = arr.length;
        return { 
          ...e, 
          position: i + 1,
          isPromotionZone: i < 4 && selectedLeagueName !== "Gabaritador",
          isRelegationZone: i >= total - 4 && selectedLeagueName !== "Sem Liga" && total > 8
        };
      });
  }, [entries, selectedArea, activeTierIndex]);

  const displayList = useMemo(() => {
    if (currentUser) {
      const userIdx = leagueEntries.findIndex(e => e.user.id === currentUser.id);
      if (userIdx !== -1 && leagueEntries.length > 15) {
        const start = Math.max(0, userIdx - 5);
        return leagueEntries.slice(start, start + 15);
      }
    }
    return leagueEntries.slice(0, 20);
  }, [leagueEntries, currentUser]);

  return (
    <AppLayout>
      <div className="max-w-[1100px] mx-auto w-full space-y-6 md:space-y-10 pb-32 px-4 md:px-0">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-primary-light font-black text-[10px] md:text-xs uppercase tracking-widest mb-1 ml-2">
              <Swords size={14} className="md:size-4" />
              Arena Competitiva
            </div>
            <h1 className="font-display text-3xl md:text-6xl font-black italic uppercase leading-none">
              Ranking <span className="gradient-text pr-4">Elite</span>
            </h1>
          </div>
          <div className="glass px-4 py-2 md:p-3 rounded-xl md:rounded-2xl flex items-center gap-4 md:gap-6 border-white/5 bg-surface-dark/40">
             <div className="text-center md:text-right">
                <p className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase leading-none mb-1">Próxima Atualização</p>
                <div className="flex items-center justify-center md:justify-end gap-1.5 md:gap-2 text-warning font-black tabular-nums text-xs md:text-sm">
                   <Timer size={12} className="md:size-3.5" />
                   {timeLeft}
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-[320px] shrink-0 space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Filtrar por Área</label>
              <div className="flex lg:grid lg:grid-cols-2 gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
                {Object.entries(AREA_LABELS).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setSelectedArea(val as RankingArea)}
                    className={cn(
                      "px-4 py-2.5 md:py-3 rounded-xl font-bold text-[10px] md:text-xs transition-all border shrink-0 lg:shrink-1",
                      selectedArea === val 
                        ? "bg-primary text-white border-primary shadow-glow" 
                        : "glass border-white/5 text-muted-foreground hover:bg-white/5"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-5 md:p-6 border-primary/20 bg-primary/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Trophy className="size-32 md:size-48" />
               </div>
               <p className="text-[9px] md:text-[10px] font-black uppercase text-primary-light mb-1">Sua Liga Atual</p>
               <h3 className="text-lg md:text-2xl font-black mb-4 md:mb-5">{currentTier.name}</h3>
               <div className="flex items-center gap-4 md:gap-5">
                  <div className="h-12 w-12 md:h-16 md:w-16 flex items-center justify-center bg-white/5 rounded-xl md:rounded-2xl border border-white/5 shrink-0">
                     <AreaBadge 
                        area={selectedArea === 'GERAL' ? 'MATEMATICA' : selectedArea as AreaENEM} 
                        points={currentUser ? getPoints(currentUser, selectedArea) : 0} 
                        size={48} 
                        hideTier
                     />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl md:text-3xl font-black leading-none italic truncate">{currentUser ? getPoints(currentUser, selectedArea) : 0}</p>
                    <p className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase mt-1">Pontos Arena</p>
                  </div>
               </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-6 md:space-y-8">
            
            {/* Carousel */}
            <section className="space-y-4 md:space-y-6">
              <div className="relative">
                <div 
                  ref={carouselRef}
                  className="flex gap-3 md:gap-4 overflow-x-auto py-6 md:py-8 no-scrollbar snap-x snap-mandatory px-[calc(50%-70px)] md:px-[calc(50%-100px)]"
                >
                  {LIGAS.filter(l => l.name !== "Sem Liga").map((tier) => {
                    const idx = LIGAS.findIndex(l => l.name === tier.name);
                    const isActive = idx === activeTierIndex;
                    return (
                      <button
                        key={tier.name}
                        ref={el => { tierRefs.current[idx] = el; }}
                        onClick={() => setActiveTierIndex(idx)}
                        className={cn(
                          "flex-shrink-0 w-32 md:w-44 aspect-[3/4] rounded-2xl md:rounded-3xl flex flex-col items-center justify-center gap-3 md:gap-4 transition-all duration-500 snap-center outline-none border-2",
                          isActive 
                            ? "bg-surface-dark border-primary shadow-[0_0_20px_rgba(var(--primary),0.2)] scale-110 opacity-100 z-10" 
                            : "bg-surface-dark/40 border-white/5 opacity-40 scale-90"
                        )}
                      >
                        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                          <LeagueIcon name={tier.name} size={isActive ? 56 : 40} color={tier.color} />
                        </div>
                        <div className="text-center px-2">
                          <p className={cn("font-display font-black text-[11px] md:text-xl italic uppercase tracking-tighter leading-none", isActive ? "text-white" : "text-muted-foreground")}>
                            {tier.name}
                          </p>
                          <p className="text-[8px] md:text-[10px] font-black uppercase opacity-60 mt-1.5">{tier.min === 1000 ? "1000 PTS" : `${tier.min}+ PTS`}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                <button 
                  onClick={() => setActiveTierIndex(prev => Math.max(1, prev - 1))}
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-2 glass rounded-full hidden lg:flex hover:bg-white/10 z-20"
                >
                  <ChevronLeft />
                </button>
                <button 
                  onClick={() => setActiveTierIndex(prev => Math.min(LIGAS.length - 1, prev + 1))}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 glass rounded-full hidden lg:flex hover:bg-white/10 z-20"
                >
                  <ChevronRight />
                </button>
              </div>
            </section>

            {/* Ranking Table */}
            <div className="space-y-0">
              <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-white/5 bg-surface-dark/60 rounded-t-2xl md:rounded-t-3xl">
                 <h3 className="text-[9px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">
                   Liga: {LIGAS[activeTierIndex].name} ({leagueEntries.length} jogadores)
                 </h3>
                 <div className="flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] font-black text-muted-foreground">
                    <RefreshCw size={12} className="animate-spin-slow" />
                    <span className="hidden xs:inline">RANKING DA LIGA</span>
                 </div>
              </div>

              <div className="glass-card overflow-hidden rounded-b-2xl md:rounded-b-3xl border-white/5">
                <div className="divide-y divide-white/5">
                   {displayList.length > 0 ? displayList.map((e) => (
                     <div 
                       key={e.user.id} 
                       className={cn(
                         "grid grid-cols-12 px-4 md:px-6 py-4 md:py-5 items-center transition-all relative",
                         e.user.id === currentUser?.id ? "bg-primary/10" : "hover:bg-white/5",
                         e.isPromotionZone && "border-l-2 border-success/40 bg-success/5",
                         e.isRelegationZone && "border-l-2 border-destructive/40 bg-destructive/5"
                       )}
                     >
                       <div className="col-span-1 flex flex-col items-center gap-1">
                          <span className="font-display font-black text-sm md:text-xl text-muted-foreground/30 italic leading-none">
                            {e.position}º
                          </span>
                          {e.isPromotionZone && <ChevronUp size={12} className="text-success animate-bounce" />}
                          {e.isRelegationZone && <ChevronDown size={12} className="text-destructive animate-bounce" />}
                       </div>

                       <div className="col-span-8 flex items-center gap-3 md:gap-4 ml-2">
                          <div className="h-9 w-9 md:h-11 md:w-11 rounded-full bg-gradient-primary overflow-hidden ring-2 ring-white/10 shrink-0">
                             {e.user.avatarUrl ? <img src={e.user.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-white bg-primary/20 text-[10px]">{e.user.username[0]}</div>}
                          </div>
                          <div className="min-w-0">
                             <p className="font-bold text-[11px] md:text-sm flex items-center gap-1.5 md:gap-2 truncate">
                               {e.user.username}
                               {e.user.id === currentUser?.id && <span className="bg-primary text-[6px] md:text-[8px] px-1 md:px-1.5 py-0.5 rounded-full uppercase font-black shrink-0">Você</span>}
                             </p>
                             <div className="flex items-center gap-2 mt-0.5 md:mt-1">
                                <span className={cn(
                                  "text-[7px] md:text-[9px] font-black uppercase px-1.5 py-0.5 rounded flex items-center gap-1",
                                  e.isPromotionZone ? "bg-success/20 text-success" : e.isRelegationZone ? "bg-destructive/20 text-destructive" : "bg-white/5 text-muted-foreground"
                                )}>
                                  {e.isPromotionZone ? "Zona de Promoção" : e.isRelegationZone ? "Zona de Rebaixamento" : "Estável"}
                                </span>
                             </div>
                          </div>
                       </div>

                       <div className="col-span-3 md:col-span-3 text-right">
                          <p className="text-base md:text-2xl font-black leading-none italic">{e.currentPoints}</p>
                          <p className="text-[7px] md:text-[9px] font-black text-primary-light uppercase mt-0.5 md:mt-1">Pontos Arena</p>
                       </div>
                     </div>
                   )) : (
                     <div className="p-10 text-center text-muted-foreground text-xs md:text-sm italic">
                       Nenhum jogador nesta liga ainda.
                     </div>
                   )}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-4 px-2">
                 <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase text-muted-foreground">
                    <div className="w-3 h-3 bg-success/20 border-l-2 border-success/40" />
                    Top 4: Sobe de Liga
                 </div>
                 <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase text-muted-foreground">
                    <div className="w-3 h-3 bg-destructive/20 border-l-2 border-destructive/40" />
                    Z-4: Desce de Liga
                 </div>
              </div>
            </div>
          </main>

        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </AppLayout>
  );
};

export default Ranking;
