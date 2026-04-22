import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";
import { Sparkles, Trophy, Map, Droplet, Sun, Moon, Menu } from "lucide-react";
import ollie from "@/assets/ollie.png";
import { useTheme } from "@/context/ThemeContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const features = [
  { icon: Map, title: "Trilha de Estudos", desc: "Avance subindo unidades de cada matéria, no seu ritmo." },
  { icon: Trophy, title: "Arena Competitiva", desc: "Simulados cronometrados e ranking semanal por liga." },
  { icon: Droplet, title: "Sistema de Ink", desc: "5 gotas por dia. Use com sabedoria, ganhe consistência." },
  { icon: Sparkles, title: "Quizzes com IA", desc: "Gere questões a partir de um tópico ou texto." },
];

const Landing = () => {
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-screen">
      <header className="container-custom flex h-16 items-center justify-between max-w-full">
        <Logo />
        <div className="hidden md:flex items-center gap-2">
          <button onClick={toggle} className="glass rounded-full p-2 hover:bg-secondary transition-bounce" aria-label="Alternar tema">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Button variant="ghost" asChild><Link to="/login">Entrar</Link></Button>
          <Button asChild className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
            <Link to="/register">Começar grátis</Link>
          </Button>
        </div>
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className="glass rounded-full p-2 hover:bg-secondary transition-bounce" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-card border-glass-border">
              <DropdownMenuItem asChild><Link to="/login">Entrar</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/register" className="text-primary font-semibold">Começar grátis</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggle}>
                {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                Tema {theme === "dark" ? "claro" : "escuro"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <section className="container-custom py-12 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-bold text-primary mb-6">
            <Sparkles className="h-3.5 w-3.5" /> Novo: Geração de quizzes com IA
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-black leading-[0.95] mb-6">
            Estude pro <span className="gradient-text">vestibular</span> jogando.
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            Gabarink transforma sua preparação em uma jornada gamificada — trilhas, simulados, ranking e a inseparável companhia do Ollie.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow text-base h-12 px-8 rounded-full">
              <Link to="/register">Criar conta grátis</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full h-12 px-8">
              <Link to="/login">Já tenho conta</Link>
            </Button>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative">
          <div className="absolute inset-0 bg-gradient-hero blur-3xl opacity-30 rounded-full" />
          <img src={ollie} alt="Ollie, mascote da Gabarink" className="relative w-full max-w-md mx-auto animate-float" width={512} height={512} />
        </motion.div>
      </section>

      <section className="container-custom py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-6 hover:shadow-glow transition-bounce"
          >
            <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 shadow-soft">
              <f.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      <footer className="container-custom py-12 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Gabarink. Feito com tinta roxa para vestibulandos brasileiros.
      </footer>
    </div>
  );
};

export default Landing;
