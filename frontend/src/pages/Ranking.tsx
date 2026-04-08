import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import type { User } from '@/types';
import { Trophy, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

type RankEntry = { rank: number; user: User; score: number };

export default function Ranking() {
  const { t } = useLanguage();
  const [ranking, setRanking] = useState<RankEntry[]>([]);
  const [period, setPeriod] = useState<'weekly' | 'all-time'>('weekly');

  useEffect(() => {
    api.getRanking().then(setRanking);
  }, [period]);

  const top3 = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  // Reorder for podium: 2nd, 1st, 3rd visually
  const podium = [
    top3.find(r => r.rank === 2),
    top3.find(r => r.rank === 1),
    top3.find(r => r.rank === 3),
  ].filter(Boolean) as RankEntry[];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold flex items-center justify-center gap-3">
          <Trophy className="text-yellow-500 h-10 w-10" /> {t('rankingTitle')}
        </h1>
        <p className="text-text-dim">{t('rankingSub')}</p>

        <div className="inline-flex bg-surface-dark border border-white/10 rounded-xl p-1 mt-4">
          <button
            onClick={() => setPeriod('weekly')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-medium transition-all transform active:scale-95",
              period === 'weekly' ? "bg-primary-base text-white shadow-lg shadow-primary-base/20" : "text-text-dim hover:text-text-white"
            )}
          >
            {t('weekly')}
          </button>
          <button
            onClick={() => setPeriod('all-time')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-medium transition-all transform active:scale-95",
              period === 'all-time' ? "bg-primary-base text-white shadow-lg shadow-primary-base/20" : "text-text-dim hover:text-text-white"
            )}
          >
            {t('allTime')}
          </button>
        </div>
      </div>

      {ranking.length > 0 && (
        <div className="flex justify-center items-end gap-2 sm:gap-6 pt-10 pb-0">
          {podium.map((entry) => {
            const isFirst = entry.rank === 1;
            return (
              <div key={entry.user.id} className={cn(
                "flex flex-col items-center relative",
                isFirst ? "w-1/3 mb-4 sm:mb-0" : "w-1/4 sm:w-[28%]"
              )}>
                {isFirst && <Crown className="absolute -top-12 sm:-top-14 h-10 w-10 sm:h-12 sm:w-12 text-yellow-500 animate-bounce" />}

                <div className={cn(
                  "relative rounded-full border-4 overflow-hidden mb-4 z-10 bg-surface-dark transition-transform hover:scale-105",
                  entry.rank === 1 ? "h-24 w-24 sm:h-32 sm:w-32 border-yellow-500" :
                    entry.rank === 2 ? "h-20 w-20 sm:h-24 sm:w-24 border-zinc-400" :
                      "h-20 w-20 sm:h-24 sm:w-24 border-amber-600"
                )}>
                  <img src={entry.user.avatarUrl} alt={entry.user.name} className="h-full w-full object-cover" />
                </div>

                <div className={cn(
                  "w-full rounded-t-2xl flex flex-col items-center pt-8 sm:pt-6 pb-6 bg-gradient-surface border border-white/5 border-b-0 relative",
                  isFirst ? "h-44 sm:h-52 shadow-[0_-10px_30px_rgba(234,179,8,0.2)]" :
                    entry.rank === 2 ? "h-[148px] sm:h-44 opacity-95" :
                      "h-[138px] sm:h-42 opacity-90"
                )}>
                  <span className="font-bold text-[15px] sm:text-lg text-center truncate px-2 w-full leading-tight">{entry.user.name}</span>
                  <span className="text-[12px] sm:text-sm font-medium text-primary-light mt-0.5 mb-auto">{entry.score.toLocaleString()} pts</span>

                  {/* Indicator at the base */}
                  <div className={cn(
                    "mt-4 h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center text-base sm:text-lg font-black shadow-lg border-2",
                    entry.rank === 1 ? "bg-yellow-500 text-surface-dark border-yellow-400" :
                      entry.rank === 2 ? "bg-zinc-400 text-surface-dark border-zinc-300" :
                        "bg-amber-600 text-surface-dark border-amber-500"
                  )}>
                    {entry.rank}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Standardized Ranking List */}
      <div className="space-y-3 pt-2">
        {rest.map((entry) => (
          <div key={entry.user.id} className="flex items-center gap-3 p-3.5 bg-surface-dark border border-white/5 rounded-2xl transition-all hover:bg-white/[0.02]">
            {/* Rank - Far Left (shrunk) */}
            <div className="w-8 flex justify-center">
              <span className="text-lg font-black text-text-white/40">{entry.rank}º</span>
            </div>

            {/* Avatar */}
            <img
              src={entry.user.avatarUrl}
              className="h-11 w-11 rounded-xl object-cover border border-white/10"
              alt="avatar"
            />

            {/* Central Info Block - Expanded to the right */}
            <div className="flex-1 min-w-0 pr-1">
              <p className="font-bold text-text-white text-[16px] truncate leading-tight">{entry.user.name}</p>
              <div className="flex items-center gap-2 text-[11px] font-medium text-text-dim">
                <span className="shrink-0">{entry.user.level} Quizzes</span>
                <span className="w-0.5 h-0.5 rounded-full bg-white/10" />
                <span className="truncate">{(entry.score / (entry.user.level || 1)).toFixed(0)} pts/avg</span>
              </div>
            </div>

            {/* Score - Far Right (Untouched position) */}
            <div className="text-right flex flex-col items-end min-w-[70px]">
              <span className="font-black text-lg text-text-white leading-none">{entry.score.toLocaleString()}</span>
              <span className="text-[9px] font-black uppercase text-primary-light tracking-widest mt-1">PTS</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
