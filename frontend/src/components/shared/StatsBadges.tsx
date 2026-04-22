import React, { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { AreaENEM } from "@/types";
import { 
  Zap, Globe, Languages
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Configurações de Ligas e Sub-Tiers ---

export const LIGAS = [
  { name: "Ferro", color: "#64748B", min: 0, max: 99 },
  { name: "Bronze", color: "#B45309", min: 100, max: 249 },
  { name: "Prata", color: "#94A3B8", min: 250, max: 399 },
  { name: "Ouro", color: "#FBBF24", min: 400, max: 599 },
  { name: "Platina", color: "#00E5FF", min: 600, max: 799 }, // Cyan for Platina
  { name: "Diamante", color: "#7C3AED", min: 800, max: 949 }, // Purple for Diamante
  { name: "Mestre", color: "#FF0040", min: 950, max: 1000 }
];

export const SUB_TIERS = ["I", "II", "III", "IV", "V", "VI", "VII"];

// Compatibility with old TIERS constant
export const TIERS = LIGAS.map((l, i) => ({ ...l, roman: SUB_TIERS[i] })); 

export const getTierByPoints = (points: number) => {
  const liga = LIGAS.find(l => points >= l.min && points <= l.max) || LIGAS[LIGAS.length - 1];
  return { ...liga, roman: getSubTierRoman(points) };
};

export const getSubTierRoman = (points: number) => {
  const liga = LIGAS.find(l => points >= l.min && points <= l.max) || LIGAS[LIGAS.length - 1];
  const range = liga.max - liga.min;
  if (range === 0) return SUB_TIERS[0];
  const relative = points - liga.min;
  const index = Math.min(6, Math.floor((relative / (range + 1)) * 7));
  return SUB_TIERS[index];
};

export const getRomanByPoints = getSubTierRoman; // Alias for compatibility

// --- Auxiliares de Geometria ---

const getPolygonPoints = (sides: number, size: number) => {
  const points = [];
  const radius = (size / 2) - 2;
  const center = size / 2;
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    points.push(`${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`);
  }
  return points.join(' ');
};

const getHeraldicPath = (size: number) => {
  const s = size;
  return `M${s*0.15},${s*0.1} L${s*0.85},${s*0.1} L${s*0.85},${s*0.6} C${s*0.85},${s*0.85} ${s*0.5},${s*0.95} ${s*0.5},${s*0.95} C${s*0.5},${s*0.95} ${s*0.15},${s*0.85} ${s*0.15},${s*0.6} L${s*0.15},${s*0.1} Z`;
};

const getRhombusPath = (size: number) => {
  const s = size;
  return `M${s*0.5},${s*0.05} L${s*0.9},${s*0.5} L${s*0.5},${s*0.95} L${s*0.1},${s*0.5} Z`;
};

// --- Componente de Brasão ---

interface BadgeProps {
  area: AreaENEM;
  points: number;
  size?: number;
  hideTier?: boolean;
  largeTier?: boolean;
  overrideRoman?: string; // For manual control in Ranking carousel
}

const BadgeInternal = ({ area, points, size = 48, hideTier = false, largeTier = false, overrideRoman }: BadgeProps) => {
  const tier = getTierByPoints(points);
  const roman = overrideRoman || tier.roman;
  const center = size / 2;
  
  const isHighTier = tier.name === "Diamante" || tier.name === "Mestre";
  const sides = Math.max(4, Math.min(10, Math.floor(points / 100) + 3));

  const getIcon = () => {
    const iconProps = { size: size * 0.4, color: "white", strokeWidth: 2.5 };
    switch (area) {
      case "NATUREZA": return <Zap {...iconProps} />;
      case "HUMANAS": return <Globe {...iconProps} />;
      case "LINGUAGENS": return <Languages {...iconProps} />;
      default: return null;
    }
  };

  const polyPoints = useMemo(() => getPolygonPoints(sides, size), [sides, size]);
  const heraldicPath = useMemo(() => getHeraldicPath(size), [size]);
  const rhombusPath = useMemo(() => getRhombusPath(size), [size]);

  const renderShape = () => {
    switch (area) {
      case "MATEMATICA":
        return <polygon points={polyPoints} fill={tier.color} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />;
      case "NATUREZA":
        return <circle cx={center} cy={center} r={size * 0.45} fill={tier.color} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />;
      case "HUMANAS":
        return <path d={heraldicPath} fill={tier.color} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />;
      case "LINGUAGENS":
        return <path d={rhombusPath} fill={tier.color} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />;
    }
  };

  return (
    <div className="relative flex items-center justify-center group cursor-help transition-all duration-300" title={`${area}: ${tier.name} ${roman} (${points} pts)`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-sm group-hover:scale-105 transition-transform">
        <defs>
          <linearGradient id={`grad-${area}-${tier.name}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
          </linearGradient>
        </defs>
        
        {renderShape()}

        <g opacity="0.4">
          {area === "MATEMATICA" && <polygon points={polyPoints} fill={`url(#grad-${area}-${tier.name})`} />}
          {area === "NATUREZA" && <circle cx={center} cy={center} r={size * 0.45} fill={`url(#grad-${area}-${tier.name})`} />}
          {area === "HUMANAS" && <path d={heraldicPath} fill={`url(#grad-${area}-${tier.name})`} />}
          {area === "LINGUAGENS" && <path d={rhombusPath} fill={`url(#grad-${area}-${tier.name})`} />}
        </g>

        {isHighTier && (
          <g opacity="0.15" stroke="white" strokeWidth="0.5" fill="none">
             {area === "NATUREZA" && (
               <>
                 <path d={`M${center},${size*0.05} L${center},${size*0.95}`} />
                 <path d={`M${size*0.05},${center} L${size*0.95},${center}`} />
                 <circle cx={center} cy={center} r={size*0.25} />
               </>
             )}
             {area === "HUMANAS" && (
               <>
                 <path d={`M${center},${size*0.1} L${center},${size*0.95}`} />
                 <path d={`M${size*0.15},${size*0.4} L${size*0.85},${size*0.4}`} />
               </>
             )}
             {area === "LINGUAGENS" && (
               <>
                 <path d={`M${size*0.5},${size*0.05} L${size*0.5},${size*0.95}`} />
                 <path d={`M${size*0.1},${size*0.5} L${size*0.9},${size*0.5}`} />
               </>
             )}
             {area === "MATEMATICA" && (
                Array.from({ length: sides }).map((_, i) => {
                  const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
                  const r = (size / 2) - 2;
                  return <line key={i} x1={center} y1={center} x2={center + r * Math.cos(angle)} y2={center + r * Math.sin(angle)} />;
                })
             )}
          </g>
        )}

        {area !== "MATEMATICA" && (
          <g transform={`translate(${size*0.3}, ${size*0.25})`}>
            {getIcon()}
          </g>
        )}
      </svg>
      
      {!hideTier && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className={cn(
            "select-none font-black text-white/50",
            largeTier ? "text-xl translate-y-0" : "text-[10px] translate-y-3"
          )}>
            {roman}
          </span>
        </span>
      )}
    </div>
  );
};

export const AreaBadge = React.memo(BadgeInternal);

// --- Componente de Badges Global (Header) ---

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
          <AreaBadge key={area} area={area} points={user.stats[area]?.points || 0} size={32} hideTier />
        ))}
      </div>
      <div className="h-8 w-px bg-white/10 hidden md:block" />
      <div className="hidden md:flex flex-col items-start leading-none">
        <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground mb-1">Status Arena</span>
        <span className="text-xs font-black text-white uppercase">
          STATUS: {topTier.name.toUpperCase()} {topTier.roman}
        </span>
      </div>
    </div>
  );
};
