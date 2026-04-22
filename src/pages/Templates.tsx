import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { quizService } from "@/services/quizService";
import type { QuizTemplate } from "@/types";
import { Button } from "@/components/ui/button";
import { LayoutTemplate, Users } from "lucide-react";

const Templates = () => {
  const [items, setItems] = useState<QuizTemplate[]>([]);
  useEffect(() => { quizService.listTemplates().then(setItems); }, []);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-black">Templates</h1>
        <p className="text-muted-foreground">Comece um quiz a partir de uma estrutura pronta.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((t) => (
          <div key={t.id} className="glass-card p-6 hover:shadow-glow transition-bounce flex flex-col">
            <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4">
              <LayoutTemplate className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg">{t.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t.description}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
              <span>{t.questionCount} questões · {t.subject}</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {t.uses.toLocaleString("pt-BR")}</span>
            </div>
            <Button asChild className="rounded-full mt-auto bg-gradient-primary text-primary-foreground">
              <Link to="/create">Usar template</Link>
            </Button>
          </div>
        ))}
      </div>
    </AppLayout>
  );
};
export default Templates;
