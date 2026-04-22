import { NavLink } from "react-router-dom";
import { Home, Map, Swords, LayoutTemplate, ShoppingBag } from "lucide-react";

const items = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/trail", icon: Map, label: "Trilha" },
  { to: "/arena", icon: Swords, label: "Arena" },
  { to: "/templates", icon: LayoutTemplate, label: "Modelos" },
  { to: "/shop", icon: ShoppingBag, label: "Loja" },
];

export const MobileNav = () => (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-glass-border">
    <div className="grid grid-cols-5 h-16">
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-bounce ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon className={`h-5 w-5 ${isActive ? "scale-110" : ""} transition-transform`} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);
