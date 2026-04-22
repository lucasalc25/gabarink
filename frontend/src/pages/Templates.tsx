import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { quizService } from "@/services/quizService";
import type { Quiz } from "@/types";
import { Button } from "@/components/ui/button";
import { LayoutTemplate, Users } from "lucide-react";

const Templates = () => {
  const [items, setItems] = useState<Quiz[]>([]);
  
  useEffect(() => { 
    quizService.listTemplates().then(setItems); 
  }, []);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-black">Modelos de Quiz</h1>
        <p className="text-muted-foreground">Comece um quiz a partir de uma estrutura pronta e economize tempo.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((t) => (
          <div key={t.id} className="glass-card p-6 hover:shadow-glow transition-bounce flex flex-col group relative overflow-hidden">
             <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-all" />
             
            <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
              <LayoutTemplate className="h-6 w-6 text-primary-foreground" />
            </div>
            
            <h3 className="font-display font-bold text-xl mb-1">{t.title}</h3>
            <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{t.description}</p>
            
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-6 bg-white/5 p-3 rounded-xl">
              <span>{t.questionsCount} questões · {t.area}</span>
              <span className="flex items-center gap-1.5 text-primary-light">
                <Users className="h-3.5 w-3.5" /> 
                {(t.playCount || 0).toLocaleString("pt-BR")}
              </span>
            </div>
            
            <Button asChild className="rounded-full mt-auto bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow font-bold h-11">
              <Link to={`/quiz/${t.id}`}>Jogar agora</Link>
            </Button>
          </div>
        ))}
      </div>
    </AppLayout>
  );
};

export default Templates;
