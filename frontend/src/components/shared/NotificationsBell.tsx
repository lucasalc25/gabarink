import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { userService } from "@/services/userService";
import type { Notification } from "@/types";

export const NotificationsBell = () => {
  const [items, setItems] = useState<Notification[]>([]);
  useEffect(() => {
    userService.notifications().then(setItems);
  }, []);
  const unread = items.filter((i) => !i.read).length;

  return (
    <Popover>
      <PopoverTrigger className="relative h-[34px] w-[34px] glass rounded-full flex items-center justify-center hover:bg-white/10 transition-bounce outline-none border-white/5 cursor-pointer">
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-accent text-accent-foreground text-[9px] font-black flex items-center justify-center shadow-glow">
            {unread}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 glass-card p-0 border-glass-border">
        <div className="px-4 py-3 border-b border-border">
          <h4 className="font-display font-bold">Notificações</h4>
        </div>
        <div className="max-h-80 overflow-auto">
          {items.map((n) => (
            <div key={n.id} className={`px-4 py-3 border-b border-border/50 last:border-0 ${!n.read ? "bg-primary/5" : ""}`}>
              <p className="font-semibold text-sm">{n.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
