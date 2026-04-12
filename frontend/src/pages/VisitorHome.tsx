import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';
import { BookOpen, Users, Zap, Calculator, Award, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';
import ollieMascot from '@/assets/ollie.png';

export default function VisitorHome() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const areas = [
    { id: 'linguagens', label: t('areaLinguagens'), icon: BookOpen, color: 'from-blue-500/20 to-blue-600/20', textColor: 'text-blue-400' },
    { id: 'humanas', label: t('areaHumanas'), icon: Users, color: 'from-orange-500/20 to-orange-600/20', textColor: 'text-orange-400' },
    { id: 'natureza', label: t('areaNatureza'), icon: Zap, color: 'from-green-500/20 to-green-600/20', textColor: 'text-green-400' },
    { id: 'matematica', label: t('areaMatematica'), icon: Calculator, color: 'from-pink-500/20 to-pink-600/20', textColor: 'text-pink-400' },
  ];

  const handleAreaClick = (areaId: string) => {
    navigate(`/register?intent=${areaId}`);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center py-8 md:py-20 overflow-hidden relative z-0">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-24 items-center">

          {/* Top (Mobile) / Right (Desktop): Visuals */}
          <div className="relative order-1 lg:order-2 w-full max-w-[320px] lg:max-w-none mx-auto animate-in fade-in slide-in-from-bottom-8 lg:slide-in-from-right-8 duration-1000">
            {/* Main Mascot */}
            <div className="relative z-10 flex justify-center">
              <div className="relative scale-75 lg:scale-100 transition-transform">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-primary-base/20 blur-[80px] lg:blur-[100px] rounded-full" />
                <img
                  src={ollieMascot}
                  alt="Ollie Mascot"
                  className="w-full max-w-[420px] lg:max-w-[480px] h-auto relative z-10 drop-shadow-[0_15px_40px_rgba(119,52,230,0.3)] animate-float"
                  loading="eager"
                />
              </div>
            </div>

            {/* Floating Elements - Hidden on very small mobile for clarity if needed, but here we adjust */}
            <div className="absolute -top-4 -right-4 lg:top-0 lg:right-0 animate-bounce-slow delay-100 z-20 scale-75 lg:scale-100 origin-top-right">
              <div className="bg-surface-dark/90 backdrop-blur-md border border-white/10 p-3 lg:p-4 rounded-2xl shadow-2xl flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-500">
                  <Award size={20} className="lg:w-6 lg:h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-dim uppercase tracking-wider">{t('xpBubble')}</p>
                  <p className="text-xs lg:text-base font-black text-text-white">Badge Mestre</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 lg:bottom-12 lg:left-0 lg:-left-12 animate-bounce-slow delay-500 z-20 scale-75 lg:scale-100 origin-bottom-left">
              <div className="bg-surface-dark/90 backdrop-blur-md border border-white/10 p-3 lg:p-4 rounded-2xl shadow-2xl space-y-2 w-36 lg:w-48">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-text-white uppercase tracking-wider flex items-center gap-1.5">
                    <PenTool size={10} className="text-primary-light" />
                    {t('inkBar')}
                  </span>
                  <span className="text-[10px] font-bold text-primary-light">85%</span>
                </div>
                <div className="h-1.5 lg:h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-primary rounded-full" />
                </div>
              </div>
            </div>

            {/* Background Orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 opacity-30">
              <div className="absolute top-0 left-0 w-48 lg:w-64 h-48 lg:h-64 bg-primary-base blur-[100px] lg:blur-[120px] rounded-full animate-pulse-slow" />
              <div className="absolute bottom-0 right-0 w-64 lg:w-80 h-64 lg:h-80 bg-primary-light blur-[120px] lg:blur-[150px] rounded-full animate-pulse-slow delay-700" />
            </div>
          </div>

          {/* Middle/Bottom (Mobile) / Left (Desktop): Content */}
          <div className="space-y-8 lg:space-y-12 order-2 lg:order-1 text-center lg:text-left animate-in fade-in slide-in-from-top-8 lg:slide-in-from-left-8 duration-700 relative z-10">
            <div className="space-y-3 lg:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-7xl font-black tracking-tight leading-[1.15]">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-light via-primary-base to-primary-dark">
                  {t('visitorHeroTitle')}
                </span>
              </h1>
              <p className="text-base lg:text-xl text-text-dim max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
                Prepare-se para o ENEM de forma gamificada. Escolha sua área e comece a jornada rumo à aprovação.
              </p>
            </div>

            {/* Area Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 gap-3 lg:gap-4 max-w-[500px] mx-auto lg:mx-0">
              {areas.map((area) => (
                <button
                  key={area.id}
                  onClick={() => handleAreaClick(area.id)}
                  className={cn(
                    "group relative overflow-hidden p-4 lg:p-6 rounded-[20px] lg:rounded-[24px] border border-white/5 transition-all duration-300 hover:scale-[1.03] hover:border-primary-base/30 text-left bg-surface-dark/50 backdrop-blur-sm",
                    "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-0 before:transition-opacity hover:before:opacity-100",
                    area.color
                  )}
                >
                  <div className="relative z-10 flex items-center gap-3 lg:gap-4">
                    <div className={cn("p-2 lg:p-3 rounded-lg lg:rounded-xl bg-white/5 group-hover:scale-110 transition-transform duration-300", area.textColor)}>
                      <area.icon size={20} className="lg:w-6 lg:h-6" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm lg:text-lg font-bold text-text-white group-hover:text-primary-light transition-colors">
                      {area.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>



      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
