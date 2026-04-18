import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Trophy, Timer, TrendingUp, Swords } from "lucide-react";
import { motion } from "framer-motion";

const leagues = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];

const Arena = () => {
  const { user } = useAuth();
  if (!user) return null;
  const leagueIdx = leagues.indexOf(user.league);

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-black">Arena</h1>
        <p className="text-muted-foreground">Onde os melhores se enfrentam toda semana.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-6 lg:col-span-2 bg-gradient-card relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-hero opacity-25 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Sua liga atual</p>
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="h-10 w-10 text-warning" />
              <h2 className="font-display text-4xl font-black">{user.league}</h2>
            </div>
            <div className="flex items-center gap-2 mb-3">
              {leagues.map((l, i) => (
                <div key={l} className={`flex-1 h-2 rounded-full ${i <= leagueIdx ? "bg-gradient-primary" : "bg-secondary"}`} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              {leagues.map((l) => <span key={l}>{l}</span>)}
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Sua posição</p>
          <p className="font-display text-5xl font-black gradient-text">#5</p>
          <p className="text-sm text-muted-foreground mt-1">{user.rankingPoints} pontos</p>
          <Button asChild className="w-full mt-4 rounded-full" variant="outline">
            <Link to="/ranking">Ver ranking</Link>
          </Button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        <ArenaCard
          icon={Timer}
          title="Simulado Cronometrado"
          desc="Sem feedback durante a prova. Resultado só no fim."
          cta="Começar simulado"
          to="/quiz/q_e2?mode=competitive"
        />
        <ArenaCard
          icon={Swords}
          title="Duelo 1v1"
          desc="Em breve — desafie outro estudante em tempo real."
          cta="Em breve"
          disabled
        />
        <ArenaCard
          icon={TrendingUp}
          title="Ranking Semanal"
          desc="Top 10 sobem de liga toda segunda-feira."
          cta="Ver ranking"
          to="/ranking"
        />
        <ArenaCard
          icon={Trophy}
          title="Hall da Fama"
          desc="Os maiores nomes da temporada atual."
          cta="Em breve"
          disabled
        />
      </div>
    </AppLayout>
  );
};

const ArenaCard = ({ icon: Icon, title, desc, cta, to, disabled }: any) => (
  <div className="glass-card p-6 hover:shadow-glow transition-bounce">
    <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-primary-foreground" />
    </div>
    <h3 className="font-display font-bold text-lg mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground mb-4">{desc}</p>
    {disabled ? (
      <Button disabled variant="outline" className="rounded-full">{cta}</Button>
    ) : (
      <Button asChild className="rounded-full bg-gradient-primary text-primary-foreground"><Link to={to}>{cta}</Link></Button>
    )}
  </div>
);

export default Arena;
