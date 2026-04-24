import { NavLink, Link } from "react-router-dom";
import { Logo } from "../Logo";
import { HeaderStats } from "./HeaderStats";
import { NotificationsBell } from "../shared/NotificationsBell";
import { UserMenu } from "../shared/UserMenu";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  Sun,
  Moon,
  Menu,
  Home,
  Map,
  Swords,
  LayoutTemplate,
  ShoppingBag
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { to: "/home", label: "Início", icon: Home },
  { to: "/trail", label: "Trilha", icon: Map },
  { to: "/arena", label: "Arena", icon: Swords },
  { to: "/templates", label: "Modelos", icon: LayoutTemplate },
  { to: "/shop", label: "Loja", icon: ShoppingBag },
];

export const Header = () => {
  const { isLogged, user } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass border-b border-white/5 bg-surface-dark/80 backdrop-blur-xl">
        <div className="container-custom flex h-16 items-center justify-between gap-4">
          <Logo />

          {isLogged && (
            <nav className="hidden lg:flex items-center gap-0.5">
              {navItems.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${isActive ? "bg-primary text-white shadow-glow" : "text-muted-foreground hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </NavLink>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-1.5">
            {isLogged ? (
              <>
                <div className="hidden md:block">
                  <HeaderStats />
                </div>

                <div className="flex items-center gap-2">
                  <NotificationsBell />

                  <button
                    onClick={toggle}
                    className="h-[34px] w-[34px] glass rounded-full flex items-center justify-center hover:bg-white/10 transition-bounce focus:outline-none border-white/5 cursor-pointer"
                    aria-label="Alternar tema"
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4 text-warning" /> : <Moon className="h-4 w-4 text-primary-light" />}
                  </button>

                  <UserMenu />
                </div>
              </>
            ) : (
              <>
                {/* Desktop CTAs */}
                <div className="hidden md:flex items-center gap-2">
                  <button onClick={toggle} className="h-[34px] w-[34px] glass rounded-full flex items-center justify-center hover:bg-white/10 transition-bounce focus:outline-none border-white/5 cursor-pointer" aria-label="Alternar tema">
                    {theme === "dark" ? <Sun className="h-4 w-4 text-warning" /> : <Moon className="h-4 w-4 text-primary-light" />}
                  </button>
                  <Button variant="ghost" asChild className="font-bold hover:text-primary transition-colors cursor-pointer"><Link to="/login">Entrar</Link></Button>
                  <Button asChild className="bg-gradient-primary text-white hover:opacity-90 shadow-glow rounded-full px-8 font-bold transition-bounce cursor-pointer">
                    <Link to="/register">Começar grátis</Link>
                  </Button>
                </div>
                {/* Mobile burger */}
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-[34px] w-[34px] glass rounded-full flex items-center justify-center hover:bg-white/10 transition-bounce outline-none border-white/5 cursor-pointer" aria-label="Menu">
                      <Menu className="h-5 w-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 glass-card border-white/10 bg-surface-dark/95 backdrop-blur-xl">
                      <DropdownMenuItem asChild className="px-3 py-2.5 cursor-pointer font-bold"><Link to="/login">Entrar</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild className="px-3 py-2.5 cursor-pointer">
                        <Link to="/register" className="text-primary font-bold">Começar grátis</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/5" />
                      <DropdownMenuItem onClick={toggle} className="px-3 py-2.5 cursor-pointer font-bold">
                        {theme === "dark" ? <Sun className="h-4 w-4 mr-2 text-warning" /> : <Moon className="h-4 w-4 mr-2 text-primary-light" />}
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

export default Header;
