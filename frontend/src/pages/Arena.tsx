import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Trophy, Timer, TrendingUp, Swords, Shield, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { getTierByPoints, LIGAS } from "@/components/shared/StatsBadges";
import { AreaENEM } from "@/types";
import { cn } from "@/lib/utils";

const Arena = () => {
  const { user } = useAuth();
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const areas: AreaENEM[] = ["MATEMATICA", "NATUREZA", "HUMANAS", "LINGUAGENS"];
  const totalPoints = areas.reduce((acc, curr) => acc + (user.stats[curr]?.points || 0), 0);
  const averagePoints = Math.round(totalPoints / areas.length);

  const currentTier = getTierByPoints(averagePoints);
  const leagueIdx = LIGAS.findIndex(l => l.name === currentTier.name);

  return (
    <AppLayout>
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-black italic">ARENA</h1>
            <p className="text-muted-foreground">Onde os melhores se enfrentam em busca do Gabarito Real.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="glass-card lg:col-span-2 bg-gradient-card border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,hsl(var(--primary)/0.15),transparent_70%)]" />
              <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="relative shrink-0">
                  <div className="h-24 w-24 md:h-32 md:w-32 rounded-3xl bg-surface-dark/60 border border-white/10 flex items-center justify-center rotate-3 group-hover:rotate-6 transition-transform duration-500 shadow-glow">
                    <Shield className="h-12 w-12 md:h-16 md:w-16 text-warning" style={{ color: currentTier.color }} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-gradient-primary h-8 w-8 md:h-10 md:w-10 rounded-xl flex items-center justify-center shadow-glow border border-white/10">
                    <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                </div>

                <div className="flex-1 space-y-6 text-center md:text-left">
                  <div>
                    <p className="text-[10px] font-black text-primary-light uppercase tracking-widest mb-1">Status Competitivo</p>
                    <h2 className="font-display text-3xl md:text-5xl font-black mb-1">{currentTier.name.toUpperCase()}</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Sua classificação atual baseada na média de todas as áreas.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {LIGAS.map((l, i) => (
                        <div key={l.name} className={cn("h-2 flex-1 rounded-full border border-white/5 transition-all duration-1000", i <= leagueIdx ? "bg-gradient-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]" : "bg-white/5")} />
                      ))}
                    </div>
                    <div className="flex justify-between text-[8px] font-black text-muted-foreground uppercase tracking-tighter overflow-x-auto no-scrollbar gap-2">
                      {LIGAS.map((l, i) => (
                        <span key={l.name} className={cn("shrink-0", i === leagueIdx && "text-primary-light scale-110")}>{l.name}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 md:p-8 flex flex-col justify-between border-white/5 bg-surface-dark/40">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sua posição na Liga</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-5xl md:text-7xl font-black text-white italic">12</span>
                  <span className="font-display text-2xl md:text-4xl font-black text-primary-light italic">º</span>
                </div>
                <p className="text-xs md:text-sm font-bold text-muted-foreground mt-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  {averagePoints} pontos arena
                </p>
              </div>
              <Button asChild className="w-full mt-6 rounded-xl bg-gradient-primary text-primary-foreground h-12 md:h-14 font-black text-base md:text-lg shadow-glow border-none hover:scale-[1.02] transition-bounce">
                <Link to="/ranking" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 md:h-5 md:w-5" />
                  Ranking Global
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <ArenaCard
              icon={Timer}
              title="Simulado Cronometrado"
              desc="Responda 10 questões reais do ENEM sob pressão. Erros ou falta de tempo subtraem pontos da Arena."
              cta="Começar Simulado"
              onClick={() => nav("/arena/quiz/simulado-enem-2022")}
            />
            <ArenaCard
              icon={TrendingUp}
              title="Desafio Diário"
              desc="Encare a questão mais difícil do banco do ENEM hoje. Sucesso garante bônus massivo, erro custa pontos."
              cta="Aceitar Desafio"
              onClick={() => nav("/arena/dailychallenge")}
            />
            <ArenaCard
              icon={Swords}
              title="Duelo 1v1"
              desc="Desafie um oponente aleatório para um duelo de 5 questões. Quem for mais rápido ganha."
              cta="Em breve"
              disabled
            />
            <ArenaCard
              icon={Trophy}
              title="Hall da Fama"
              desc="Veja as lendas do Gabarink e as conquistas mais raras de cada temporada."
              cta="Ver Hall"
              disabled
            />
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

const ArenaCard = ({ icon: Icon, title, desc, cta, onClick, disabled, loading }: any) => (
  <div className="glass-card p-6 md:p-8 hover:shadow-glow transition-bounce group border-white/5 bg-surface-dark/20 relative overflow-hidden flex flex-col">
    <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-all" />

    <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 shadow-glow border border-white/10 group-hover:scale-110 transition-transform">
      {loading ? <Loader2 className="h-6 w-6 md:h-7 md:w-7 text-primary-foreground animate-spin" /> : <Icon className="h-6 w-6 md:h-7 md:w-7 text-primary-foreground" />}
    </div>
    <h3 className="font-display font-black text-xl md:text-2xl mb-2 italic uppercase">{title}</h3>
    <p className="text-xs md:text-sm text-muted-foreground mb-8 leading-relaxed flex-1">{desc}</p>

    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "rounded-xl w-full h-12 font-black border transition-all duration-300",
        disabled ? "opacity-50 cursor-not-allowed bg-white/5 border-white/5" : "bg-white/5 hover:bg-gradient-primary text-white hover:text-primary-foreground border-white/10 hover:border-none"
      )}
    >
      {cta}
    </Button>
  </div>
);

export default Arena;
