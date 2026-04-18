import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { quizService } from "@/services/quizService";
import { Sparkles, Wand2, LayoutTemplate, PenTool } from "lucide-react";
import { toast } from "sonner";

const CreateQuiz = () => {
  const nav = useNavigate();
  const [manual, setManual] = useState({ title: "", description: "" });
  const [aiTopic, setAiTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const onManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manual.title) return toast.error("Informe um título");
    setLoading(true);
    const q = await quizService.createQuiz(manual);
    toast.success("Quiz criado!");
    setLoading(false);
    nav(`/quiz/${q.id}`);
  };

  const onAI = async () => {
    if (!aiTopic) return toast.error("Informe um tópico ou texto");
    setLoading(true);
    await quizService.generateWithAI(aiTopic);
    toast.success("Quiz gerado pela IA!");
    setLoading(false);
    nav("/my-quizzes");
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-black">Criar Quiz</h1>
        <p className="text-muted-foreground">Escolha como quer começar.</p>
      </div>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="glass">
          <TabsTrigger value="manual"><PenTool className="h-4 w-4 mr-1.5" /> Manual</TabsTrigger>
          <TabsTrigger value="template"><LayoutTemplate className="h-4 w-4 mr-1.5" /> Template</TabsTrigger>
          <TabsTrigger value="ai"><Sparkles className="h-4 w-4 mr-1.5" /> IA</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="mt-6">
          <form onSubmit={onManual} className="glass-card p-6 max-w-xl space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" value={manual.title} onChange={(e) => setManual({ ...manual, title: e.target.value })} placeholder="Ex.: Revisão de Geometria" />
            </div>
            <div>
              <Label htmlFor="desc">Descrição</Label>
              <Textarea id="desc" value={manual.description} onChange={(e) => setManual({ ...manual, description: e.target.value })} placeholder="Para que serve esse quiz?" />
            </div>
            <Button type="submit" disabled={loading} className="rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
              {loading ? "Criando..." : "Criar e adicionar questões"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="template" className="mt-6">
          <div className="glass-card p-8 text-center">
            <LayoutTemplate className="h-12 w-12 mx-auto mb-3 text-primary" />
            <p className="font-display font-bold mb-2">Galeria de templates</p>
            <p className="text-sm text-muted-foreground mb-4">Acesse a página de Templates para escolher uma estrutura pronta.</p>
            <Button asChild variant="outline" className="rounded-full"><a href="/templates">Ver templates</a></Button>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <div className="glass-card p-6 max-w-xl space-y-4 bg-gradient-card relative overflow-hidden">
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-hero opacity-25 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Wand2 className="h-5 w-5 text-primary" />
                <h3 className="font-display font-bold">Geração por IA</h3>
              </div>
              <Label htmlFor="topic">Tópico ou texto base</Label>
              <Textarea id="topic" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="Ex.: Leis de Newton para o ENEM, com foco em aplicações práticas..." className="min-h-32" />
              <Button onClick={onAI} disabled={loading} className="rounded-full bg-gradient-primary text-primary-foreground shadow-glow mt-4">
                {loading ? "Gerando..." : "Gerar 10 questões"}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};
export default CreateQuiz;
