import React from "react";
import { useAuth } from "@/context/AuthContext";
import { AreaENEM } from "@/types";
import { 
  Zap, Globe, Languages, Shield, Star, Diamond, Crown, Leaf, Wheat, Gem, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Configurações das Novas Ligas (Sem Tiers) ---

export const LIGAS = [
  { name: "Sem Liga", color: "#475569", min: 0, max: 99, material: "Stone" },
  { name: "Explorador", color: "#64748B", min: 100, max: 249, material: "Ferro" },
  { name: "Praticante", color: "#B45309", min: 250, max: 399, material: "Bronze" },
  { name: "Analista", color: "#94A3B8", min: 400, max: 549, material: "Prata" },
  { name: "Estrategista", color: "#FBBF24", min: 550, max: 699, material: "Ouro" },
  { name: "Veterano", color: "#00E5FF", min: 700, max: 849, material: "Platina" },
  { name: "Especialista", color: "#06B6D4", min: 850, max: 999, material: "Diamante" },
  { name: "Gabaritador", color: "#EF4444", min: 1000, max: 1000, material: "Rubi" }
];

export const getTierByPoints = (points: number) => {
  const cappedPoints = Math.min(1000, points);
  return LIGAS.find(l => cappedPoints >= l.min && cappedPoints <= l.max) || LIGAS[0];
};

// --- League Badge Component (Reformulated) ---

export const LeagueIcon = ({ name, size = 48, color }: { name: string; size?: number; color: string }) => {
  const iconProps = { size: size * 0.5, style: { color }, strokeWidth: 1.5 };
  
  switch (name) {
    case "Explorador": // Ferro: Escudo liso, fosco, traços finos
      return (
        <div className="relative flex items-center justify-center w-full h-full opacity-80">
           <div className="absolute w-[80%] h-[80%] border-2 rounded-lg" style={{ borderColor: color }} />
           <Shield {...iconProps} strokeWidth={1} />
        </div>
      );
    case "Praticante": // Bronze: Borda chanfrada simples
      return (
        <div className="relative flex items-center justify-center w-full h-full">
           <div className="absolute w-[80%] h-[80%] border-4 rounded-lg shadow-[inset_0_0_10px_rgba(0,0,0,0.3)]" style={{ borderColor: color }} />
           <Shield {...iconProps} className="fill-current opacity-20" />
        </div>
      );
    case "Analista": // Prata: Moldura dupla, ícone preenchido
      return (
        <div className="relative flex items-center justify-center w-full h-full">
           <div className="absolute w-[85%] h-[85%] border-2 rounded-lg" style={{ borderColor: color }} />
           <div className="absolute w-[70%] h-[70%] border-2 rounded-md opacity-50" style={{ borderColor: color }} />
           <Shield {...iconProps} className="fill-current" />
        </div>
      );
    case "Estrategista": // Ouro: Detalhes angulares
      return (
        <div className="relative flex items-center justify-center w-full h-full">
           <div className="absolute w-[80%] h-[80%] border-2 rotate-45 opacity-40" style={{ borderColor: color }} />
           <div className="absolute w-[80%] h-[80%] border-4 rounded-sm" style={{ borderColor: color }} />
           <Shield {...iconProps} className="fill-current" />
        </div>
      );
    case "Veterano": // Platina: Asas geométricas, brilho metálico
      return (
        <div className="relative flex items-center justify-center w-full h-full">
           <div className="absolute w-[30%] h-[60%] -left-1 skew-y-12 bg-current opacity-20" style={{ backgroundColor: color }} />
           <div className="absolute w-[30%] h-[60%] -right-1 skew-y-12 bg-current opacity-20" style={{ backgroundColor: color }} />
           <div className="absolute w-[75%] h-[75%] border-2 rounded-full border-dashed animate-spin-slow opacity-30" style={{ borderColor: color }} />
           <Star {...iconProps} className="fill-current drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
        </div>
      );
    case "Especialista": // Diamante: Facetado, Azul Ciano
      return (
        <div className="relative flex items-center justify-center w-full h-full">
           <div className="absolute w-[85%] h-[85%] border-2 rounded-lg opacity-40 animate-pulse" style={{ borderColor: color }} />
           <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent rounded-full blur-xl" />
           <Diamond {...iconProps} className="fill-current scale-125 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]" />
        </div>
      );
    case "Gabaritador": // Rubi: Coroa geométrica, gema central vermelha
      return (
        <div className="relative flex items-center justify-center w-full h-full">
           <div className="absolute -top-2">
              <Crown size={size * 0.4} style={{ color }} className="fill-current drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
           </div>
           <div className="absolute w-[80%] h-[80%] border-4 rounded-xl rotate-45 animate-pulse" style={{ borderColor: color }} />
           <Gem {...iconProps} className="fill-current text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
        </div>
      );
    default:
      return <div className="w-8 h-8 rounded-full border-2 border-dashed opacity-20" style={{ borderColor: color }} />;
  }
};

// --- Componente de Badges Global (Header) ---

interface BadgeProps {
  area: AreaENEM;
  points: number;
  size?: number;
  hideTier?: boolean;
}

export const AreaBadge = React.memo(({ area, points, size = 48, hideTier = false }: BadgeProps) => {
  const tier = getTierByPoints(points);
  const iconProps = { size: size * 0.45, color: "white", strokeWidth: 2.5 };

  const getIcon = () => {
    switch (area) {
      case "NATUREZA": return <Zap {...iconProps} />;
      case "HUMANAS": return <Globe {...iconProps} />;
      case "LINGUAGENS": return <Languages {...iconProps} />;
      case "MATEMATICA": return <div className="font-display font-black text-white italic" style={{ fontSize: size * 0.4 }}>∑</div>;
    }
  };

  return (
    <div className="relative flex items-center justify-center" title={`${area}: ${tier.name} (${points} pts)`}>
      <div 
        className="rounded-xl flex items-center justify-center shadow-soft overflow-hidden border border-white/10"
        style={{ width: size, height: size, backgroundColor: tier.color }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        {getIcon()}
      </div>
    </div>
  );
});

export const StatsBadges = () => {
  const { user } = useAuth();
  if (!user || !user.stats) return null;

  const areas: AreaENEM[] = ["MATEMATICA", "NATUREZA", "HUMANAS", "LINGUAGENS"];
  const totalPoints = areas.reduce((acc, curr) => acc + (user.stats[curr]?.points || 0), 0);
  const averagePoints = Math.round(totalPoints / areas.length);
  const topTier = getTierByPoints(averagePoints);

  return (
    <div className="flex items-center gap-3 sm:gap-6 glass rounded-2xl px-4 py-2 border-white/5 bg-surface-dark/40">
      <div className="flex items-center gap-2">
        {areas.map((area) => (
          <AreaBadge key={area} area={area} points={user.stats[area]?.points || 0} size={30} hideTier />
        ))}
      </div>
      <div className="h-8 w-px bg-white/10 hidden md:block" />
      <div className="hidden md:flex flex-col items-start leading-none">
        <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground mb-1">Status Arena</span>
        <span className="text-xs font-black text-white uppercase flex items-center gap-2">
          <LeagueIcon name={topTier.name} size={16} color={topTier.color} />
          {topTier.name.toUpperCase()}
        </span>
      </div>
    </div>
  );
};
