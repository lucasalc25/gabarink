import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, User as UserIcon, Sparkles, Sun, Moon, Home, Map, Swords, LayoutTemplate } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export const UserMenu = () => {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  if (!user) return null;
  const initial = user.username.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground font-display font-extrabold flex items-center justify-center shadow-soft hover:shadow-glow transition-bounce">
        {initial}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass-card border-glass-border">
        <DropdownMenuLabel className="font-display">{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Tablet nav (visible md, hidden lg+) */}
        <div className="lg:hidden">
          <DropdownMenuItem asChild><Link to="/home"><Home className="h-4 w-4 mr-2" /> Home</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link to="/trail"><Map className="h-4 w-4 mr-2" /> Trilha</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link to="/arena"><Swords className="h-4 w-4 mr-2" /> Arena</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link to="/templates"><LayoutTemplate className="h-4 w-4 mr-2" /> Templates</Link></DropdownMenuItem>
          <DropdownMenuSeparator />
        </div>
        <DropdownMenuItem asChild><Link to="/profile"><UserIcon className="h-4 w-4 mr-2" /> Perfil</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/my-quizzes"><Sparkles className="h-4 w-4 mr-2" /> Meus Quizzes</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/settings"><Settings className="h-4 w-4 mr-2" /> Configurações</Link></DropdownMenuItem>
        <DropdownMenuItem onClick={toggle}>
          {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
          Tema {theme === "dark" ? "claro" : "escuro"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => { await logout(); nav("/"); }} className="text-destructive">
          <LogOut className="h-4 w-4 mr-2" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
