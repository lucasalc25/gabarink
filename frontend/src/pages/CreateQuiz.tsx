import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Image as ImageIcon, 
  HelpCircle, 
  Settings2, 
  ArrowRight,
  Save,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const CreateQuiz = () => {
  const [step, setStep] = useState(1);
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    area: "MATEMATICA",
    difficulty: "medium",
    questions: [
      { text: "", options: ["", "", "", ""], correctIndex: 0 }
    ]
  });

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, { text: "", options: ["", "", "", ""], correctIndex: 0 }]
    });
  };

  return (
    <AppLayout>
      <div className="max-w-[800px] mx-auto space-y-8 pb-20">
        
        {/* Progress Stepper */}
        <div className="flex items-center justify-between glass p-4 rounded-2xl border-white/5">
           <StepItem num={1} label="Informações" active={step === 1} done={step > 1} />
           <div className="h-px flex-1 bg-white/10 mx-4" />
           <StepItem num={2} label="Questões" active={step === 2} done={step > 2} />
           <div className="h-px flex-1 bg-white/10 mx-4" />
           <StepItem num={3} label="Publicar" active={step === 3} done={step > 3} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-black">Configurações do <span className="text-primary-light">Quiz</span></h1>
                <p className="text-muted-foreground">Defina os detalhes básicos para que os outros saibam sobre o que é seu quiz.</p>
              </div>

              <div className="glass-card p-8 border-white/5 space-y-6">
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Título do Quiz</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Domine a Termodinâmica"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                      />
                   </div>
                   
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Descrição</label>
                      <textarea 
                        placeholder="Explique o que este quiz aborda..."
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Área do Conhecimento</label>
                         <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors">
                            <option value="MATEMATICA">Matemática</option>
                            <option value="NATUREZA">Ciências da Natureza</option>
                            <option value="HUMANAS">Ciências Humanas</option>
                            <option value="LINGUAGENS">Linguagens</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Dificuldade</label>
                         <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors">
                            <option value="easy">Fácil</option>
                            <option value="medium">Médio</option>
                            <option value="hard">Difícil</option>
                         </select>
                      </div>
                   </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                   <Button onClick={() => setStep(2)} className="bg-gradient-primary rounded-xl px-8 font-bold">
                     Próximo Passo <ArrowRight className="ml-2 h-4 w-4" />
                   </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-3xl font-black">Criar <span className="text-primary-light">Questões</span></h1>
                  <p className="text-muted-foreground">Adicione as perguntas e opções para seu quiz.</p>
                </div>
                <Button onClick={addQuestion} variant="outline" className="rounded-xl border-white/10">
                   <Plus className="mr-2 h-4 w-4" /> Adicionar Questão
                </Button>
              </div>

              <div className="space-y-4">
                {quizData.questions.map((q, idx) => (
                  <div key={idx} className="glass-card p-6 border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                       <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/20 text-primary-light font-black">
                         {idx + 1}
                       </span>
                       <input 
                         type="text" 
                         placeholder="Digite o enunciado da questão..."
                         className="flex-1 bg-transparent border-b border-white/10 py-1 focus:border-primary outline-none transition-all"
                       />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-11">
                      {[0, 1, 2, 3].map(optIdx => (
                        <div key={optIdx} className="flex items-center gap-2">
                           <div className="h-4 w-4 rounded-full border-2 border-white/20 shrink-0" />
                           <input 
                             type="text" 
                             placeholder={`Opção ${optIdx + 1}`}
                             className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50"
                           />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-between">
                 <Button onClick={() => setStep(1)} variant="ghost" className="rounded-xl px-8 font-bold text-muted-foreground">
                   Voltar
                 </Button>
                 <Button onClick={() => setStep(3)} className="bg-gradient-primary rounded-xl px-8 font-bold">
                   Finalizar Quiz <Save className="ml-2 h-4 w-4" />
                 </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 border-white/5 text-center space-y-6"
            >
               <div className="h-20 w-20 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                  <Save className="h-10 w-10 text-success" />
               </div>
               <div className="space-y-2">
                  <h2 className="text-3xl font-black">Tudo pronto!</h2>
                  <p className="text-muted-foreground">Seu quiz foi criado com sucesso e renderá <span className="text-warning font-bold">+100 Gabaritins</span> ao ser publicado.</p>
               </div>
               <div className="pt-6">
                  <Button className="bg-gradient-primary rounded-xl px-12 h-14 text-lg font-black shadow-glow">
                    Publicar Quiz
                  </Button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

const StepItem = ({ num, label, active, done }: { num: number; label: string; active: boolean; done: boolean }) => (
  <div className={cn(
    "flex items-center gap-3 transition-all",
    active ? "text-primary-light" : done ? "text-success" : "text-muted-foreground/40"
  )}>
     <div className={cn(
       "h-8 w-8 rounded-lg flex items-center justify-center font-black text-sm border-2",
       active ? "border-primary-light bg-primary/10" : done ? "border-success bg-success/10" : "border-white/5 bg-white/5"
     )}>
       {num}
     </div>
     <span className="text-xs font-black uppercase tracking-widest hidden md:inline">{label}</span>
  </div>
);

export default CreateQuiz;
