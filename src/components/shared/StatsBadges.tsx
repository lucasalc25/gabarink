import React, { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { AreaENEM } from "@/types";
import { 
  Atom, Heart, Activity, Zap, Layers,
  Flame, Home, Building, Crown, ShieldAlert, Map, Globe,
  Hand, Mic, FileText, Music, Megaphone, Languages,
  LucideIcon
} from "lucide-react";

// --- Configurações de Ligas ---

export const LEAGUES_CONFIG: Record<AreaENEM, Record<number, string>> = {
  MATEMATICA: {
    400: "Quadrática", 500: "Pentagonal", 600: "Hexagonal", 
    700: "Heptagonal", 800: "Octogonal", 900: "Eneagonal", 1000: "Decagonal"
  },
  NATUREZA: {
    400: "Atômica", 500: "Molecular", 600: "Celular", 
    700: "Tecidual", 800: "Orgânica", 900: "Sistêmica", 1000: "Organísmica"
  },
  HUMANAS: {
    400: "Tribal", 500: "Aldeã", 600: "Citadina", 
    700: "Soberana", 800: "Imperial", 900: "Continental", 1000: "Global"
  },
  LINGUAGENS: {
    400: "Gestual", 500: "Oral", 600: "Textual", 
    700: "Lírica", 800: "Eloquente", 900: "Literária", 1000: "Universal"
  }
};

// --- Configurações de Materiais ---

const getMaterialGradients = (score: number) => {
  if (score >= 1000) return { from: "#F43F5E", to: "#9F1239", text: "#FFF", glow: "rgba(244, 63, 94, 0.5)" }; // Rubi
  if (score >= 900) return { from: "#38BDF8", to: "#0284C7", text: "#FFF", glow: "rgba(56, 189, 248, 0.5)" }; // Diamante
  if (score >= 800) return { from: "#F8FAFC", to: "#94A3B8", text: "#1E293B", glow: "rgba(248, 250, 252, 0.3)" }; // Platina
  if (score >= 700) return { from: "#FBBF24", to: "#B45309", text: "#FFF", glow: "rgba(251, 191, 36, 0.4)" }; // Ouro
  if (score >= 600) return { from: "#94A3B8", to: "#475569", text: "#FFF", glow: "rgba(148, 163, 184, 0.3)" }; // Prata
  if (score >= 500) return { from: "#B45309", to: "#451A03", text: "#FFF", glow: "rgba(180, 83, 9, 0.3)" }; // Bronze
  return { from: "#64748B", to: "#1E293B", text: "#CBD5E1", glow: "transparent" }; // Ferro
};

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

const getShieldPath = (size: number) => {
  const s = size;
  return `M${s*0.15},${s*0.1} L${s*0.85},${s*0.1} L${s*0.85},${s*0.5} C${s*0.85},${s*0.8} ${s*0.5},${s*0.95} ${s*0.5},${s*0.95} C${s*0.5},${s*0.95} ${s*0.15},${s*0.8} ${s*0.15},${s*0.5} L${s*0.15},${s*0.1} Z`;
};

// --- Ícones Manuais ---

const ManualIcon = ({ type, size, color }: { type: string; size: number; color: string }) => {
  if (type === "atom") return (
    <g stroke={color} strokeWidth="1.5" fill="none">
       <circle cx={size*0.5} cy={size*0.5} r={size*0.08} fill={color} />
       <ellipse cx={size*0.5} cy={size*0.5} rx={size*0.22} ry={size*0.08} transform={`rotate(45 ${size*0.5} ${size*0.5})`} />
       <ellipse cx={size*0.5} cy={size*0.5} rx={size*0.22} ry={size*0.08} transform={`rotate(-45 ${size*0.5} ${size*0.5})`} />
    </g>
  );
  if (type === "molecule") return (
    <g stroke={color} strokeWidth="1.5" fill="none">
      <circle cx={size*0.5} cy={size*0.4} r={size*0.12} />
      <circle cx={size*0.35} cy={size*0.65} r={size*0.08} />
      <circle cx={size*0.65} cy={size*0.65} r={size*0.08} />
      <line x1={size*0.42} y1={size*0.48} x2={size*0.38} y2={size*0.58} />
      <line x1={size*0.58} y1={size*0.48} x2={size*0.62} y2={size*0.58} />
    </g>
  );
  if (type === "cell") return (
     <g stroke={color} strokeWidth="1.5" fill="none">
       <circle cx={size*0.5} cy={size*0.5} r={size*0.22} />
       <circle cx={size*0.5} cy={size*0.5} r={size*0.07} fill={color} />
     </g>
  );
  if (type === "house") return (
    <g stroke={color} strokeWidth="1.5" fill="none">
      <path d={`M${size*0.3},${size*0.7} L${size*0.3},${size*0.45} L${size*0.5},${size*0.3} L${size*0.7},${size*0.45} L${size*0.7},${size*0.7} Z`} />
      <rect x={size*0.45} y={size*0.55} width={size*0.1} height={size*0.15} />
    </g>
  );
  if (type === "fire") return (
    <g stroke={color} strokeWidth="1.5" fill="none">
       <path d={`M${size*0.35},${size*0.7} L${size*0.65},${size*0.7} M${size*0.4},${size*0.75} L${size*0.6},${size*0.65} M${size*0.6},${size*0.75} L${size*0.4},${size*0.65}`} />
       <path d={`M${size*0.5},${size*0.25} C${size*0.4},${size*0.45} ${size*0.4},${size*0.6} ${size*0.5},${size*0.7} C${size*0.6},${size*0.6} ${size*0.6},${size*0.45} ${size*0.5},${size*0.25}`} />
    </g>
  );
  if (type === "pen") return (
    <g stroke={color} strokeWidth="1.5" fill="none" opacity="0.8">
      <path d={`M${size*0.7},${size*0.3} L${size*0.4},${size*0.6} L${size*0.3},${size*0.7} L${size*0.4},${size*0.65} L${size*0.7},${size*0.3} Z`} />
      <path d={`M${size*0.4},${size*0.6} L${size*0.3},${size*0.7}`} />
    </g>
  );
  return null;
};

// --- Componente Badge Individual ---

const BadgeInternal = ({ area, score, size = 32 }: { area: AreaENEM; score: number; size?: number }) => {
  const levelFloor = Math.max(400, Math.min(1000, Math.floor(score / 100) * 100));
  const leagueName = LEAGUES_CONFIG[area][levelFloor];
  const material = getMaterialGradients(score);
  const center = size / 2;

  // Renderização diferenciada por área
  const isMath = area === "MATEMATICA";
  const sides = Math.max(4, Math.min(10, Math.floor(score / 100)));
  
  // Seleção de ícone
  const getIcon = () => {
    if (isMath) return null;
    const iconProps = { size: size * 0.45, color: material.text, strokeWidth: 2.5 };
    
    switch (area) {
      case "NATUREZA":
        if (levelFloor === 400) return <ManualIcon type="atom" size={size} color={material.text} />;
        if (levelFloor === 500) return <ManualIcon type="molecule" size={size} color={material.text} />;
        if (levelFloor === 600) return <ManualIcon type="cell" size={size} color={material.text} />;
        if (levelFloor === 700) return <Layers {...iconProps} />;
        if (levelFloor === 800) return <Heart {...iconProps} />;
        if (levelFloor === 900) return <Activity {...iconProps} />;
        return <Zap {...iconProps} />;
      case "HUMANAS":
        if (levelFloor === 400) return <ManualIcon type="fire" size={size} color={material.text} />;
        if (levelFloor === 500) return <ManualIcon type="house" size={size} color={material.text} />;
        if (levelFloor === 600) return <Building {...iconProps} />;
        if (levelFloor === 700) return <Crown {...iconProps} />;
        if (levelFloor === 800) return <ShieldAlert {...iconProps} />;
        if (levelFloor === 900) return <Map {...iconProps} />;
        return <Globe {...iconProps} />;
      case "LINGUAGENS":
        if (levelFloor === 400) return <Hand {...iconProps} />;
        if (levelFloor === 500) return <Mic {...iconProps} />;
        if (levelFloor === 600) return <FileText {...iconProps} />;
        if (levelFloor === 700) return <Music {...iconProps} />;
        if (levelFloor === 800) return <Megaphone {...iconProps} />;
        if (levelFloor === 900) return <ManualIcon type="pen" size={size} color={material.text} />;
        return <Languages {...iconProps} />;
      default: return null;
    }
  };

  const polyPoints = useMemo(() => getPolygonPoints(sides, size), [sides, size]);
  const shieldPath = useMemo(() => getShieldPath(size), [size]);

  return (
    <div className="relative group cursor-help transition-all duration-300" title={`${leagueName}: ${score} pts`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-sm group-hover:scale-110 transition-transform">
        <defs>
          <linearGradient id={`grad-${area}-${levelFloor}-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={material.from} />
            <stop offset="100%" stopColor={material.to} />
          </linearGradient>
        </defs>

        {/* Brilho de fundo para tops (Flat 2.0 glow) */}
        {score >= 900 && (
          <circle cx={center} cy={center} r={center * 0.9} fill={material.glow} filter="blur(4px)" />
        )}

        {/* Forma Base */}
        <path 
           d={isMath ? "" : shieldPath}
           points={isMath ? polyPoints : ""}
           as={isMath ? "polygon" : "path"}
           // @ts-ignore
           {...(isMath ? { points: polyPoints } : { d: shieldPath })}
           fill={`url(#grad-${area}-${levelFloor}-${size})`}
           stroke="rgba(0,0,0,0.15)"
           strokeWidth="1"
        />

        {/* Lapidação Interna (Facetas) - 900 e 1000 */}
        {score >= 900 && (
          <g opacity="0.2" stroke="white" strokeWidth="0.5">
            {isMath ? (
               Array.from({ length: sides }).map((_, i) => {
                const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
                const r = (size / 2) - 2;
                return <line key={i} x1={center} y1={center} x2={center + r * Math.cos(angle)} y2={center + r * Math.sin(angle)} />;
              })
            ) : (
                <>
                  <path d={`M${center},${size*0.1} L${center},${size*0.95}`} />
                  <path d={`M${size*0.15},${size*0.4} L${size*0.85},${size*0.4}`} />
                  <path d={`M${size*0.15},${size*0.4} L${center},${size*0.95} L${size*0.85},${size*0.4}`} />
                </>
            )}
          </g>
        )}

        {/* Efeito de Brilho Interno (Inner Glow) */}
        <path 
           {...(isMath ? { points: polyPoints } : { d: shieldPath })}
           fill="none"
           stroke="white"
           strokeWidth="1.5"
           opacity="0.1"
           transform="scale(0.85)"
           style={{ transformOrigin: 'center' }}
        />

        {/* Conteúdo Central */}
        {!isMath && (
           <g transform={`translate(${size*0.27}, ${size*0.22})`}>
              {getIcon()}
           </g>
        )}
      </svg>
      
      {/* Número Opcional para as outras 3 áreas */}
      {!isMath && (
        <span className="absolute -bottom-1 -right-1 bg-surface-dark/90 text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full border border-white/10 text-white shadow-soft">
           {Math.floor(score / 100)}
        </span>
      )}
    </div>
  );
};

export const AreaBadge = React.memo(BadgeInternal);

// --- Componente de Badges Global ---

export const StatsBadges = () => {
  const { user } = useAuth();
  if (!user || !user.stats) return null;

  const areas: AreaENEM[] = ["MATEMATICA", "NATUREZA", "HUMANAS", "LINGUAGENS"];

  return (
    <div className="flex items-center gap-2 sm:gap-4 glass rounded-2xl px-3 py-1.5 border-white/5 bg-surface-dark/40">
      <div className="flex items-center gap-2">
        {areas.map((area) => (
          <AreaBadge key={area} area={area} score={user.stats[area]?.score || 400} />
        ))}
      </div>
      <div className="h-6 w-px bg-white/10 hidden sm:block" />
      <div className="hidden sm:flex items-center gap-3">
        <div className="text-right">
          <p className="text-[10px] uppercase font-black tracking-tighter text-muted-foreground leading-none">Status Geral</p>
          <p className="text-xs font-black text-primary-glow uppercase truncate max-w-[80px]">
            {LEAGUES_CONFIG.MATEMATICA[Math.floor((user.stats.MATEMATICA?.score || 400) / 100) * 100]}
          </p>
        </div>
      </div>
    </div>
  );
};
