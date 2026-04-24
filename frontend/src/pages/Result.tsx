import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Zap, Clock, RotateCcw, Home, List } from 'lucide-react';

export default function Result() {
  const [searchParams] = useSearchParams();
  const score = searchParams.get('score') || '0';

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl text-center space-y-8">
      <div className="space-y-4">
        <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(147,51,234,0.5)] mb-4 animate-bounce">
          <Trophy size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-white">Quiz Concluído!</h1>
        <p className="text-muted-foreground text-lg">Excelente trabalho. Confira seu desempenho abaixo.</p>
      </div>

      <Card className="border-primary/20 bg-surface-dark/40 glass">
        <CardContent className="p-8">
          <div className="text-6xl font-black bg-clip-text text-transparent bg-gradient-primary mb-2">
            {score}
          </div>
          <div className="text-muted-foreground font-black uppercase tracking-widest text-xs mb-8">
            Pontos Arena Ganhos
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
              <Target className="text-success mb-2" />
              <span className="font-bold text-xl">100%</span>
              <span className="text-[10px] text-muted-foreground font-black uppercase">Precisão</span>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
              <Clock className="text-blue-400 mb-2" />
              <span className="font-bold text-xl">5.2s</span>
              <span className="text-[10px] text-muted-foreground font-black uppercase">Tempo Médio</span>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
              <Zap className="text-warning mb-2" />
              <span className="font-bold text-xl">3</span>
              <span className="text-[10px] text-muted-foreground font-black uppercase">Streak</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="flex-1 rounded-2xl font-bold bg-white/5 hover:bg-white/10 border-white/10 text-white" onClick={() => window.history.back()}>
          <RotateCcw className="mr-2 h-5 w-5" /> Tentar Novamente
        </Button>
        <Link to="/ranking" className="flex-1">
          <Button size="lg" className="w-full rounded-2xl font-black bg-gradient-primary text-white shadow-glow">
            <List className="mr-2 h-5 w-5" /> Ver Ranking
          </Button>
        </Link>
        <Link to="/home" className="flex-1">
          <Button variant="ghost" size="lg" className="w-full rounded-2xl font-bold text-muted-foreground hover:text-white">
            <Home className="mr-2 h-5 w-5" /> Início
          </Button>
        </Link>
      </div>
    </div>
  );
}
