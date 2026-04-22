import { Link } from 'react-router-dom';
import { Star, Users, HelpCircle, User } from 'lucide-react';
import { Card } from '../ui/Card';
import type { Quiz } from '@/types';
import { cn } from '@/lib/utils';
export function QuizCard({ quiz }: { quiz: Quiz }) {
  return (
    <Link to={`/quiz/${quiz.id}`} className="block group transition-all duration-300 hover:translate-y-[-8px]">
      <Card className={cn(
        "h-full p-5 border border-border shadow-sm bg-surface-dark group-hover:border-primary-base group-hover:shadow-xl transition-all duration-300",
        "relative rounded-2xl"
      )}>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-orange-100 text-orange-600 text-[11px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider">
              {quiz.category}
            </span>
            <span className="bg-primary-base/10 text-primary-light text-[11px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider">
              {quiz.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star size={14} className="text-orange-400 fill-orange-400" />
            <span className="text-sm font-bold text-text-white/80">{quiz.rating}</span>
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-1 mb-4">
          <h3 className="text-xl font-bold text-text-white transition-colors duration-300 group-hover:text-primary-light line-clamp-1">
            {quiz.title}
          </h3>
          <p className="text-[13px] leading-relaxed text-text-dim line-clamp-2 h-10 font-medium opacity-80">
            {quiz.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="flex items-center gap-8 mb-4 text-text-dim/80">
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span className="text-xs font-bold whitespace-nowrap">
              {quiz.playCount > 1000 ? `${(quiz.playCount / 1000).toFixed(1)}k` : quiz.playCount} partidas
            </span>
          </div>
          <div className="flex items-center gap-2">
            <HelpCircle size={16} />
            <span className="text-xs font-bold whitespace-nowrap">
              {quiz.questionsCount} perguntas
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border w-full mb-4" />

        {/* Bottom Author */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary-base/20 flex items-center justify-center border border-primary-base/20">
            <User size={14} className="text-primary-light" />
          </div>
          <div className="text-xs">
            <span className="text-text-dim mr-1">por</span>
            <span className="text-text-white font-bold">{quiz.author?.name || 'CinemaFan'}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
