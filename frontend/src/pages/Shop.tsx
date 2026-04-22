import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Zap, BookOpen, Coffee, MousePointer2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const SHOP_ITEMS = [
  {
    id: "item_1",
    name: "Lupa de Contexto",
    description: "Destaca termos técnicos e conceitos complexos nos textos da Trilha.",
    price: 150,
    icon: MousePointer2,
    color: "text-primary-light",
    category: "Estudo"
  },
  {
    id: "item_2",
    name: "Modo Foco Profundo",
    description: "Remove distrações visuais e escurece a interface para leitura imersiva.",
    price: 300,
    icon: Zap,
    color: "text-warning",
    category: "Interface"
  },
  {
    id: "item_3",
    name: "Mapa Mental Visual",
    description: "Desbloqueia um resumo em diagrama ao final de cada unidade teórica.",
    price: 500,
    icon: Sparkles,
    color: "text-accent",
    category: "Estudo"
  },
  {
    id: "item_4",
    name: "Refil de Ink (Gofa)",
    description: "Restaura instantaneamente todas as suas gotas de tinta para continuar os quizzes.",
    price: 100,
    icon: Coffee,
    color: "text-primary-glow",
    category: "Consumível"
  },
  {
    id: "item_5",
    name: "Caderno de Anotações",
    description: "Habilita um painel lateral para salvar insights importantes durante a Trilha.",
    price: 250,
    icon: BookOpen,
    color: "text-success",
    category: "Utilidade"
  }
];

const Shop = () => {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto space-y-10 pb-20">
        
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary-light font-black text-xs uppercase tracking-widest">
            <ShoppingBag className="h-4 w-4" />
            Loja Gabarink
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-black">
                Turbine seu <span className="text-primary-light">Aprendizado</span>
              </h1>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Troque seus Gabaritins por itens que ajudam você a absorver melhor o conteúdo e focar no que importa.
              </p>
            </div>
            
            <div className="glass px-6 py-4 rounded-2xl border-white/5 bg-surface-dark/40 flex items-center gap-4 shrink-0">
               <div className="text-right">
                  <p className="text-[10px] font-black text-muted-foreground uppercase">Seu Saldo</p>
                  <p className="text-2xl font-black text-warning tabular-nums">{user?.coins || 0}</p>
               </div>
               <div className="h-10 w-px bg-white/10" />
               <div className="p-2 rounded-xl bg-warning/10">
                  <ShoppingBag className="h-6 w-6 text-warning" />
               </div>
            </div>
          </div>
        </div>

        {/* Categories / Tabs (Optional) */}
        
        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SHOP_ITEMS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 border-white/5 hover:border-primary/30 transition-all group flex flex-col justify-between h-full"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`p-4 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors ${item.color}`}>
                    <item.icon size={32} />
                  </div>
                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-white/5 text-muted-foreground uppercase tracking-widest">
                    {item.category}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-black">{item.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-warning">{item.price}</span>
                  <span className="text-[10px] font-black text-muted-foreground uppercase">Moedas</span>
                </div>
                <Button 
                  disabled={!user || user.coins < item.price}
                  className={cn(
                    "rounded-xl font-bold px-6",
                    user && user.coins >= item.price 
                      ? "bg-gradient-primary text-white shadow-glow hover:opacity-90" 
                      : "bg-white/5 text-muted-foreground cursor-not-allowed"
                  )}
                >
                  Comprar
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="glass p-8 rounded-3xl border-white/5 bg-primary/5 flex flex-col md:flex-row items-center gap-8 justify-between">
           <div className="space-y-2 text-center md:text-left">
              <h4 className="text-xl font-bold">Como ganhar mais Moedas?</h4>
              <p className="text-sm text-muted-foreground">Complete missões diárias, vença na Arena e contribua criando quizzes para a comunidade.</p>
           </div>
           <div className="flex gap-4">
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-muted-foreground uppercase">
                Missions: +50
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-muted-foreground uppercase">
                Arena: +20
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-muted-foreground uppercase">
                Create: +100
              </div>
           </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Shop;
