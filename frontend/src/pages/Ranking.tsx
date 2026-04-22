import { useEffect, useState, useMemo, useRef } from "react";
import { AppLayout } from "@/components/AppLayout";
import { rankingService } from "@/services/rankingService";
import type { RankingEntry, AreaENEM, User } from "@/types";
import { 
  Trophy, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  User as UserIcon,
  Swords,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AreaBadge, 
  LIGAS as TIERS, 
  SUB_TIERS,
  getTierByPoints, 
  getSubTierRoman 
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
  const [activeTierIndex, setActiveTierIndex] = useState(3); // Default to Ouro (index 3)
  const [selectedSubTierIndex, setSelectedSubTierIndex] = useState(0); // Default to Tier I
  const [timeLeft, setTimeLeft] = useState("");
  const carouselRef = useRef<HTMLDivElement>(null);
  const tierRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [isHoveringCarousel, setIsHoveringCarousel] = useState(false);

  // 1. Timer Logic
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

  // 2. Points Logic
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

  // 3. Reset Sub-Tier Logic
  useEffect(() => {
    const selectedLeagueName = TIERS[activeTierIndex].name;
    if (currentUser && currentTier.name === selectedLeagueName) {
      const roman = getSubTierRoman(getPoints(currentUser, selectedArea));
      const subIdx = SUB_TIERS.indexOf(roman);
      setSelectedSubTierIndex(subIdx !== -1 ? subIdx : 0);
    } else {
      setSelectedSubTierIndex(0);
    }
  }, [activeTierIndex, selectedArea, currentTier.name, currentTier.roman, currentUser]);

  // 4. Automatic scrolling for carousel
  useEffect(() => {
    const activeElem = tierRefs.current[activeTierIndex];
    if (activeElem && carouselRef.current) {
      const container = carouselRef.current;
      const scrollLeft = container.scrollLeft;
      const scrollRight = scrollLeft + container.offsetWidth;
      const elemLeft = activeElem.offsetLeft;
      const elemRight = elemLeft + activeElem.offsetWidth;

      if (elemLeft < scrollLeft || elemRight > scrollRight) {
        activeElem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeTierIndex]);

  const sortedEntries = useMemo(() => {
    return [...entries]
      .map(e => ({ ...e, currentPoints: getPoints(e.user, selectedArea) }))
      .sort((a, b) => b.currentPoints - a.currentPoints)
      .map((e, i) => ({ ...e, position: i + 1 }));
  }, [entries, selectedArea]);

  const filteredList = useMemo(() => {
    const selectedLeagueName = TIERS[activeTierIndex].name;
    const selectedSubTierRoman = SUB_TIERS[selectedSubTierIndex];
    
    const playersInLeagueAndSubTier = sortedEntries.filter(e => {
      const t = getTierByPoints(e.currentPoints);
      return t.name === selectedLeagueName && t.roman === selectedSubTierRoman;
    });

    const userLeagueName = currentTier.name;
    const userSubTierRoman = currentTier.roman;
    
    if (selectedLeagueName === userLeagueName && selectedSubTierRoman === userSubTierRoman && currentUser) {
      const userIdx = playersInLeagueAndSubTier.findIndex(e => e.user.id === currentUser.id);
      if (userIdx !== -1) {
        const start = Math.max(0, userIdx - 5);
        const end = Math.min(playersInLeagueAndSubTier.length, start + 10);
        return playersInLeagueAndSubTier.slice(start, end);
      }
    }
    return playersInLeagueAndSubTier.slice(0, 10);
  }, [sortedEntries, activeTierIndex, selectedSubTierIndex, currentUser, selectedArea, currentTier]);

  const handleArrowNav = (direction: 'left' | 'right') => {
    if (direction === 'left' && activeTierIndex > 0) {
      setActiveTierIndex(prev => prev - 1);
    } else if (direction === 'right' && activeTierIndex < TIERS.length - 1) {
      setActiveTierIndex(prev => prev + 1);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-[1000px] mx-auto w-full space-y-6 md:space-y-10 pb-24 px-4 md:px-0">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1 w-full md:w-auto">
            <div className="flex items-center gap-2 text-primary-light font-black text-[10px] md:text-xs uppercase tracking-widest">
              <Swords className="h-3 w-3 md:h-4 md:w-4" />
              Arena Competitiva
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-black">
              Ranking <span className="text-primary-light">Elite</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-3 glass p-1.5 md:p-2 rounded-2xl border-white/5 w-full md:w-auto justify-between md:justify-start">
            <div className="flex flex-col items-start md:items-end px-3">
              <span className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase">Temporada 2026</span>
              <span className="text-xs font-bold text-white">ETAPA 1</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex flex-col items-start md:items-end px-3">
              <span className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase leading-none mb-1">Próxima atualização em:</span>
              <div className="flex items-center gap-1.5 text-warning">
                <Timer className="h-3 w-3 md:h-3.5 md:w-3.5" />
                <span className="text-[11px] md:text-xs font-black tabular-nums">{timeLeft}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 md:gap-10">
          
          {/* Sidebar - Filtros de Área e Liga Atual */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Filtrar por Área</label>
              <div className="flex lg:grid lg:grid-cols-2 gap-2 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0 scrollbar-hide no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
                {Object.entries(AREA_LABELS).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setSelectedArea(val as RankingArea)}
                    className={cn(
                      "px-4 py-3 rounded-xl font-bold text-[11px] md:text-xs transition-all border shrink-0 lg:shrink-1",
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

            <div className="glass-card p-6 border-primary/20 bg-primary/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Trophy size={64} className="md:size-80" />
               </div>
               <p className="text-[10px] font-black uppercase text-primary-light mb-1">Sua Liga Atual</p>
               <h3 className="text-xl md:text-2xl font-black mb-5">{currentTier.name} {currentTier.roman}</h3>
               <div className="flex items-center gap-5">
                  <div className="h-14 w-14 md:h-16 md:w-16 flex items-center justify-center bg-white/5 rounded-2xl border border-white/5">
                     <AreaBadge 
                        area={selectedArea === 'GERAL' ? 'MATEMATICA' : selectedArea as AreaENEM} 
                        points={currentUser ? getPoints(currentUser, selectedArea) : 0} 
                        size={56} 
                        hideTier
                     />
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-black leading-none">{currentUser ? getPoints(currentUser, selectedArea) : 0}</p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase mt-1">Pontos da Arena</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Main Content - Carrossel e Ranking */}
          <div className="lg:col-span-8 space-y-8">
             <div 
               className="glass rounded-3xl p-5 md:p-6 border-white/5 relative space-y-8 group/carousel overflow-hidden"
               onMouseEnter={() => setIsHoveringCarousel(true)}
               onMouseLeave={() => setIsHoveringCarousel(false)}
             >
                <div className="flex items-center justify-between px-1">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Progresso de Ligas</h4>
                </div>
                
                <div className="relative">
                  {/* Side Arrows - Visible only on Desktop Hover */}
                  <AnimatePresence>
                    {isHoveringCarousel && (
                      <>
                        <motion.button 
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className={cn(
                            "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 p-2.5 glass rounded-full hidden lg:flex items-center justify-center hover:bg-white/10 transition-colors shadow-glow border-white/10",
                            activeTierIndex === 0 && "opacity-0 pointer-events-none"
                          )}
                          onClick={() => handleArrowNav('left')}
                        >
                          <ChevronLeft size={24}/>
                        </motion.button>
                        <motion.button 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className={cn(
                            "absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 p-2.5 glass rounded-full hidden lg:flex items-center justify-center hover:bg-white/10 transition-colors shadow-glow border-white/10",
                            activeTierIndex === TIERS.length - 1 && "opacity-0 pointer-events-none"
                          )}
                          onClick={() => handleArrowNav('right')}
                        >
                          <ChevronRight size={24}/>
                        </motion.button>
                      </>
                    )}
                  </AnimatePresence>

                  <div 
                    ref={carouselRef}
                    className="flex gap-4 overflow-x-auto py-4 pb-10 scroll-smooth snap-x snap-mandatory scrollbar-hide no-scrollbar relative z-10 -mx-5 px-5"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                     {TIERS.map((tier, idx) => (
                       <button 
                          key={tier.name}
                          ref={el => tierRefs.current[idx] = el}
                          onClick={() => setActiveTierIndex(idx)}
                          className={cn(
                            "flex-shrink-0 w-28 md:w-32 aspect-[3/4] rounded-2xl flex flex-col items-center justify-center gap-3 transition-all snap-center border-2 outline-none",
                            idx === activeTierIndex 
                              ? "bg-white/10 border-primary/40 scale-105 shadow-glow" 
                              : "glass border-transparent opacity-40 grayscale hover:opacity-60 hover:grayscale-0"
                          )}
                       >
                          <AreaBadge 
                             area="MATEMATICA" 
                             points={tier.min} 
                             size={40} 
                             hideTier
                          />
                          <div className="text-center">
                            <p className="text-[9px] md:text-[10px] font-black uppercase truncate px-2">{tier.name}</p>
                            <p className="text-base md:text-lg font-black">{idx === activeTierIndex ? SUB_TIERS[selectedSubTierIndex] : " "}</p>
                          </div>
                       </button>
                     ))}
                  </div>
                </div>

                {/* Sub-Tier Selector (I-VII) */}
                <div className="pt-6 border-t border-white/5">
                   <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-4 text-center">Selecionar Nível (Tier)</p>
                   <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar justify-between -mx-2 px-2">
                      {SUB_TIERS.map((roman, idx) => (
                        <button
                          key={roman}
                          onClick={() => setSelectedSubTierIndex(idx)}
                          className={cn(
                            "flex-1 min-w-[42px] py-2.5 rounded-xl font-black text-xs transition-all border",
                            selectedSubTierIndex === idx
                              ? "bg-primary text-white border-primary shadow-glow"
                              : "glass border-white/5 text-muted-foreground hover:bg-white/5"
                          )}
                        >
                          {roman}
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="glass-card border-white/5 overflow-hidden rounded-3xl">
                <div className="flex items-center justify-between px-5 md:px-7 py-5 border-b border-white/5 bg-white/5">
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Ranking: {TIERS[activeTierIndex].name} {SUB_TIERS[selectedSubTierIndex]}
                      </span>
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground">
                      <RefreshCw size={14} className="animate-spin-slow" />
                      <span className="hidden sm:inline">ATUALIZA EM 24H</span>
                      <span className="sm:hidden">24H</span>
                   </div>
                </div>

                <div className="divide-y divide-white/5">
                   {filteredList.length > 0 ? (
                     filteredList.map((e) => (
                       <motion.div
                         key={e.user.id}
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         className={cn(
                           "grid grid-cols-12 px-5 md:px-7 py-5 items-center transition-all",
                           e.user.id === currentUser?.id ? "bg-primary/20 border-y border-primary/30" : "hover:bg-white/5"
                         )}
                       >
                         <div className="col-span-1 font-display font-black text-base md:text-xl text-muted-foreground/40">
                           #{e.position}
                         </div>
                         
                         <div className="col-span-7 md:col-span-8 flex items-center gap-3 md:gap-4">
                            <div className="h-9 w-9 md:h-11 md:w-11 rounded-full bg-gradient-primary overflow-hidden ring-2 ring-white/10 shrink-0">
                              {e.user.avatarUrl ? <img src={e.user.avatarUrl} className="w-full h-full object-cover" /> : <UserIcon className="m-2 md:m-2.5"/>}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-xs md:text-sm flex items-center gap-2 truncate">
                                {e.user.username}
                                {e.user.id === currentUser?.id && <span className="bg-primary text-[7px] md:text-[8px] px-1.5 py-0.5 rounded-full uppercase font-black shrink-0">Você</span>}
                              </p>
                              <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase truncate">
                                {getTierByPoints(e.currentPoints).name} {getTierByPoints(e.currentPoints).roman}
                              </p>
                            </div>
                         </div>

                         <div className="hidden md:block md:col-span-1 text-center">
                            <p className="text-[9px] font-black text-muted-foreground uppercase">V/D</p>
                            <p className="text-xs font-bold">12/3</p>
                         </div>

                         <div className="col-span-4 md:col-span-2 text-right">
                            <p className="text-base md:text-lg font-black text-white leading-none">{e.currentPoints}</p>
                            <p className="text-[8px] md:text-[9px] font-black text-primary-light uppercase mt-1">PONTOS</p>
                         </div>
                       </motion.div>
                     ))
                   ) : (
                     <div className="p-16 text-center space-y-3">
                        <Trophy size={56} className="mx-auto text-muted-foreground opacity-20" />
                        <p className="text-sm font-medium text-muted-foreground">Nenhum jogador neste nível ainda.</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </AppLayout>
  );
};

export default Ranking;
