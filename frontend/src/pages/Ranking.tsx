import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { rankingService } from "@/services/rankingService";
import type { RankingEntry } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Ranking = () => {
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  useEffect(() => { rankingService.global().then(setEntries); }, []);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <AppLayout>
      <div className="max-w-[720px] mx-auto w-full">
        <div className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-black">Ranking</h1>
          <p className="text-muted-foreground">Os mais consistentes vão ao topo.</p>
        </div>

        <Tabs defaultValue="global" className="w-full">
          <TabsList className="glass mb-6">
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="weekly">Semanal</TabsTrigger>
          </TabsList>

          <TabsContent value="global">
            <Podium top3={top3} />
            <RankList entries={rest} />
          </TabsContent>
          <TabsContent value="weekly">
            <Podium top3={top3} />
            <RankList entries={rest} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

const podiumStyle = (pos: number) => {
  if (pos === 1) return { height: "h-40 md:h-48", grad: "from-warning to-accent", ring: "ring-warning/60", icon: "text-warning", label: "1º" };
  if (pos === 2) return { height: "h-32 md:h-36", grad: "from-muted-foreground to-secondary", ring: "ring-muted-foreground/40", icon: "text-muted-foreground", label: "2º" };
  return { height: "h-24 md:h-28", grad: "from-accent to-primary", ring: "ring-accent/40", icon: "text-accent", label: "3º" };
};

const Podium = ({ top3 }: { top3: RankingEntry[] }) => {
  if (top3.length < 3) return null;
  const order = [top3[1], top3[0], top3[2]]; // 2, 1, 3
  return (
    <div className="p-4 md:p-8 mb-6">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-40 w-72 rounded-full z-0" />
      <div className="relative z-10 grid grid-cols-3 gap-3 md:gap-6 items-end">
        {order.map((e) => {
          const s = podiumStyle(e.position);
          return (
            <motion.div
              key={e.user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: e.position * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-2">
                {e.position === 1 && <Crown className={cn("absolute -top-6 left-1/2 -translate-x-1/2 h-6 w-6", s.icon)} />}
                <div className={cn("h-14 w-14 md:h-20 md:w-20 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-display font-black text-xl md:text-3xl shadow-glow ring-4", s.ring)}>
                  {e.user.username.charAt(0)}
                </div>
              </div>
              <p className="font-display font-bold text-xs md:text-sm text-center truncate max-w-full px-1">{e.user.username.split(" ")[0]}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground mb-2">{e.points.toLocaleString("pt-BR")} pts</p>
              <div className={cn("w-full rounded-t-2xl bg-gradient-to-b shadow-elevated flex items-center justify-center", s.height, s.grad)}>
                <span className="font-display font-black text-2xl md:text-4xl text-primary-foreground drop-shadow">{s.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const RankList = ({ entries }: { entries: RankingEntry[] }) => (
  <div className="glass-card overflow-hidden">
    <div className="grid grid-cols-12 px-3 md:px-4 py-3 text-[10px] md:text-xs font-bold uppercase tracking-wide text-muted-foreground border-b border-border">
      <div className="col-span-2">Pos</div>
      <div className="col-span-5">Estudante</div>
      <div className="col-span-2 text-center hidden sm:block">Liga</div>
      <div className="col-span-1 text-right">%</div>
      <div className="col-span-2 text-right">Pontos</div>
    </div>
    {entries.map((e) => (
      <div
        key={e.user.id}
        className={cn(
          "grid grid-cols-12 px-3 md:px-4 py-3 items-center border-b border-border/40 last:border-0 transition-colors text-sm",
          e.isCurrentUser && "bg-primary/10 ring-1 ring-primary/30"
        )}
      >
        <div className="col-span-2 flex items-center gap-1 md:gap-2">
          {e.position === 2 && <Medal className="h-4 w-4 text-muted-foreground" />}
          {e.position === 3 && <Medal className="h-4 w-4 text-accent" />}
          <span className="font-display font-bold">{e.position}º</span>
        </div>
        <div className="col-span-5 sm:col-span-5 col-span-7 flex items-center gap-2 md:gap-3 min-w-0">
          <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-display font-bold text-sm shrink-0">
            {e.user.username.charAt(0)}
          </div>
          <span className="font-semibold truncate">{e.user.username}</span>
        </div>
        <div className="col-span-2 text-center text-xs font-semibold text-muted-foreground hidden sm:block">{e.user.league}</div>
        <div className="col-span-1 text-right text-xs md:text-sm">{e.accuracy}%</div>
        <div className="col-span-2 text-right font-display font-bold text-xs md:text-sm">{e.points.toLocaleString("pt-BR")}</div>
      </div>
    ))}
  </div>
);

export default Ranking;
