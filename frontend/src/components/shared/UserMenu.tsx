import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, Sun, Moon, Home, Map, Swords, LayoutTemplate, ShoppingBag } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const navItems = [
  { to: "/home", label: "Início", icon: Home },
  { to: "/trail", label: "Trilha", icon: Map },
  { to: "/arena", label: "Arena", icon: Swords },
  { to: "/templates", label: "Modelos", icon: LayoutTemplate },
  { to: "/shop", label: "Loja", icon: ShoppingBag },
];

export const UserMenu = () => {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  if (!user) return null;
  const initial = user.username.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-[34px] w-[34px] rounded-full bg-gradient-primary text-primary-foreground font-display font-black text-sm flex items-center justify-center shadow-soft hover:shadow-glow hover:scale-110 hover:brightness-110 transition-bounce outline-none border border-white/10 cursor-pointer overflow-hidden">
        {initial}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass-card border-glass-border bg-surface-dark/95 backdrop-blur-xl">
        <DropdownMenuLabel className="font-display font-bold">{user.username}</DropdownMenuLabel>
        
        {/* Mobile Navigation Links */}
        <div className="lg:hidden">
          <DropdownMenuSeparator className="bg-white/5" />
          {navItems.map((n) => (
            <DropdownMenuItem key={n.to} asChild className="px-3 py-2.5 cursor-pointer font-medium">
              <Link to={n.to} className="flex items-center w-full">
                <n.icon className="h-4 w-4 mr-2" /> {n.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuItem asChild className="px-3 py-2.5 cursor-pointer font-medium hover:bg-white/5 focus:bg-white/5"><Link to="/settings" className="flex items-center w-full"><Settings className="h-4 w-4 mr-2" /> Configurações</Link></DropdownMenuItem>
        <DropdownMenuItem onClick={toggle} className="px-3 py-2.5 cursor-pointer font-medium hover:bg-white/5 focus:bg-white/5">
          {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
          Tema {theme === "dark" ? "claro" : "escuro"}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuItem onClick={async () => { await logout(); nav("/"); }} className="px-3 py-2.5 text-destructive cursor-pointer font-bold hover:bg-destructive/10 focus:bg-destructive/10">
          <LogOut className="h-4 w-4 mr-2" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
