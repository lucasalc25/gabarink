import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { quizService } from "@/services/quizService";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Play } from "lucide-react";
import type { Quiz } from "@/types";
import { toast } from "sonner";

const MyQuizzes = () => {
  const [items, setItems] = useState<Quiz[]>([]);
  useEffect(() => { quizService.listMyQuizzes().then(setItems); }, []);

  const onDelete = async (id: string) => {
    await quizService.deleteQuiz(id);
    setItems((prev) => prev.filter((q) => q.id !== id));
    toast.success("Quiz excluído");
  };

  return (
    <AppLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-black">Meus Quizzes</h1>
          <p className="text-muted-foreground">Gerencie os quizzes que você criou.</p>
        </div>
        <Button asChild className="rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
          <Link to="/create"><Plus className="h-4 w-4 mr-1" /> Criar quiz</Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((q) => (
            <div key={q.id} className="glass-card p-5 flex flex-col">
              <h3 className="font-display font-bold text-lg mb-1">{q.title}</h3>
              <p className="text-xs text-muted-foreground mb-4">Criado em {q.createdAt}</p>
              <div className="flex gap-2 mt-auto">
                <Button size="sm" asChild className="flex-1 rounded-full bg-gradient-primary text-primary-foreground">
                  <Link to={`/quiz/${q.id}`}><Play className="h-3.5 w-3.5 mr-1" /> Jogar</Link>
                </Button>
                <Button size="sm" variant="outline" className="rounded-full"><Edit className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="outline" className="rounded-full text-destructive" onClick={() => onDelete(q.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

const EmptyState = () => (
  <div className="glass-card p-12 text-center">
    <p className="font-display text-xl font-bold mb-2">Nenhum quiz ainda</p>
    <p className="text-muted-foreground mb-6">Crie seu primeiro quiz manualmente, a partir de um template ou com IA.</p>
    <Button asChild className="rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
      <Link to="/create">Criar quiz</Link>
    </Button>
  </div>
);

export default MyQuizzes;
