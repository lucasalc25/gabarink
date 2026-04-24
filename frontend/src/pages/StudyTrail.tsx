import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { quizService } from "@/services/quizService";
import type { Subject, Unit } from "@/types";
import { Calculator, BookOpen, Atom, Lock, Check, Play } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = { Calculator, BookOpen, Atom };

const StudyTrail = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    quizService.listSubjects().then((s) => {
      setSubjects(s);
      setActiveId(s[0]?.id ?? "");
    });
  }, []);

  const active = subjects.find((s) => s.id === activeId);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-black">Trilha de Estudos</h1>
        <p className="text-muted-foreground">Avance unidade por unidade. Cada quiz custa 1 Gota de Tinta.</p>
      </div>

      {/* Subject tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-8 -mx-2 px-2">
        {subjects.map((s) => {
          const Icon = iconMap[s.icon] ?? BookOpen;
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold whitespace-nowrap transition-bounce",
                isActive ? "bg-gradient-primary text-primary-foreground shadow-glow" : "glass hover:bg-secondary"
              )}
            >
              <Icon className="h-4 w-4" />
              {s.name}
            </button>
          );
        })}
      </div>

      {/* Trail map */}
      {active?.sections.map((sec) => (
        <div key={sec.id} className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-6 text-center">{sec.name}</h2>
          <div className="relative max-w-md mx-auto">
            {sec.units.map((u, i) => (
              <TrailNode key={u.id} unit={u} index={i} total={sec.units.length} />
            ))}
          </div>
        </div>
      ))}
    </AppLayout>
  );
};

const TrailNode = ({ unit, index }: { unit: Unit; index: number; total: number }) => {
  const offset = index % 4;
  const offsets = ["ml-0", "ml-16", "ml-24", "ml-16"];
  const isLocked = unit.status === "locked";
  const isDone = unit.status === "completed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={cn("relative flex items-center gap-4 py-4", offsets[offset])}
    >
      <Link
        to={isLocked ? "#" : `/trail/quiz/${unit.id}`}
        className={cn(
          "h-20 w-20 rounded-full flex items-center justify-center font-display font-black text-xl shadow-soft transition-bounce flex-shrink-0",
          isDone && "bg-gradient-success text-success-foreground shadow-glow",
          unit.status === "in-progress" && "bg-gradient-primary text-primary-foreground shadow-glow hover:scale-110",
          isLocked && "bg-secondary text-muted-foreground cursor-not-allowed"
        )}
      >
        {isDone ? <Check className="h-8 w-8" /> : isLocked ? <Lock className="h-7 w-7" /> : <Play className="h-7 w-7 fill-current" />}
      </Link>
      <div className="glass-card p-3 flex-1">
        <p className="font-display font-bold">{unit.name}</p>
        <p className="text-xs text-muted-foreground">{unit.description}</p>
        {!isLocked && (
          <div className="h-1.5 bg-secondary rounded-full mt-2 overflow-hidden">
            <div className="h-full liquid-bar" style={{ width: `${unit.progress}%` }} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StudyTrail;
