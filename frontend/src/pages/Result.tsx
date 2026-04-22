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
        <h1 className="text-4xl font-extrabold text-text-white">Quiz Completed!</h1>
        <p className="text-text-dim text-lg">You did great. Here's how you performed.</p>
      </div>

      <Card className="border-primary-base/20 bg-surface-darker">
        <CardContent className="p-8">
          <div className="text-6xl font-black bg-clip-text text-transparent bg-gradient-primary mb-2">
            {score}
          </div>
          <div className="text-text-dim font-medium uppercase tracking-widest text-sm mb-8">
            Total Points
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface-dark p-4 rounded-2xl border border-white/5 flex flex-col items-center">
              <Target className="text-success mb-2" />
              <span className="font-bold text-xl">100%</span>
              <span className="text-xs text-text-dim uppercase">Accuracy</span>
            </div>
            <div className="bg-surface-dark p-4 rounded-2xl border border-white/5 flex flex-col items-center">
              <Clock className="text-blue-400 mb-2" />
              <span className="font-bold text-xl">5.2s</span>
              <span className="text-xs text-text-dim uppercase">Avg. Time</span>
            </div>
            <div className="bg-surface-dark p-4 rounded-2xl border border-white/5 flex flex-col items-center">
              <Zap className="text-yellow-500 mb-2" />
              <span className="font-bold text-xl">3</span>
              <span className="text-xs text-text-dim uppercase">Streak</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="flex-1" onClick={() => window.history.back()}>
          <RotateCcw className="mr-2 h-5 w-5" /> Retry Quiz
        </Button>
        <Link to="/ranking" className="flex-1">
          <Button variant="secondary" size="lg" className="w-full">
            <List className="mr-2 h-5 w-5" /> View Ranking
          </Button>
        </Link>
        <Link to="/" className="flex-1">
          <Button variant="secondary" size="lg" className="w-full text-text-dim hover:text-text-white border-transparent">
            <Home className="mr-2 h-5 w-5" /> Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
