import { NavLink, Link } from "react-router-dom";
import { Logo } from "./Logo";
import { StatsBadges } from "./StatsBadges";
import { NotificationsBell } from "./NotificationsBell";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { to: "/home", label: "Home" },
  { to: "/trail", label: "Trilha" },
  { to: "/arena", label: "Arena" },
  { to: "/templates", label: "Templates" },
];

export const Header = () => {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass border-b border-glass-border">
        <div className="container-custom flex h-16 items-center justify-between gap-2 md:gap-4">
          <Logo />

          {user && (
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-sm font-semibold transition-bounce ${isActive ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <StatsBadges />
                <NotificationsBell />
                <UserMenu />
              </>
            ) : (
              <>
                {/* Desktop CTAs */}
                <div className="hidden md:flex items-center gap-2">
                  <button onClick={toggle} className="glass rounded-full p-2 hover:bg-secondary transition-bounce" aria-label="Alternar tema">
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </button>
                  <Button variant="ghost" asChild><Link to="/login">Entrar</Link></Button>
                  <Button asChild className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
                    <Link to="/register">Começar grátis</Link>
                  </Button>
                </div>
                {/* Mobile burger */}
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="glass rounded-full p-2 hover:bg-secondary transition-bounce" aria-label="Menu">
                      <Menu className="h-5 w-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 glass-card border-glass-border">
                      <DropdownMenuItem asChild><Link to="/login">Entrar</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/register" className="text-primary font-semibold">Começar grátis</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={toggle}>
                        {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                        Tema {theme === "dark" ? "claro" : "escuro"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
