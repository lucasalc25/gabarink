import { Droplet, Flame } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const StatsBadges = () => {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="flex items-center gap-1.5 sm:gap-3">
      <div className="flex items-center gap-1 sm:gap-1.5 glass rounded-full px-2 py-1 sm:px-3 sm:py-1.5">
        <Droplet className="h-4 w-4 text-primary-glow fill-primary-glow" />
        <span className="font-display font-bold text-xs sm:text-sm">{user.inkDrops}/{user.maxInkDrops}</span>
      </div>
      <div className="flex items-center gap-1 sm:gap-1.5 glass rounded-full px-2 py-1 sm:px-3 sm:py-1.5">
        <Flame className="h-4 w-4 text-accent fill-accent" />
        <span className="font-display font-bold text-xs sm:text-sm">{user.streak}</span>
      </div>
    </div>
  );
};
