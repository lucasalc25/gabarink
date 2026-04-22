import { useAuth } from "@/context/AuthContext";
import { Flame, Droplet, Coins } from "lucide-react";

export const HeaderStats = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="flex items-center gap-1.5 glass rounded-full px-2 py-1.5 border-white/5 bg-surface-dark/40">
      {/* Streak */}
      <div className="flex items-center gap-1 px-1.5 border-r border-white/10 pr-2">
        <Flame className="h-4 w-4 text-accent fill-accent/10" />
        <span className="text-xs font-black tabular-nums">{user.streak}</span>
      </div>

      {/* Ink */}
      <div className="flex items-center gap-1 px-1.5 border-r border-white/10 pr-2">
        <Droplet className="h-4 w-4 text-primary-glow fill-primary-glow/10" />
        <span className="text-xs font-black tabular-nums">{user.inkDrops}/{user.maxInkDrops}</span>
      </div>

      {/* Coins */}
      <div className="flex items-center gap-1 px-1.5">
        <Coins className="h-4 w-4 text-warning fill-warning/10" />
        <span className="text-xs font-black tabular-nums">{user.coins || 0}</span>
      </div>
    </div>
  );
};
