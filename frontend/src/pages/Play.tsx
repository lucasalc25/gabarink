import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Timer, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

// Mock gameplay data
const MOCK_QUESTIONS = [
  { id: 'q1', text: 'What function is used to optimize expensive calculations in React?', options: ['useState', 'useMemo', 'useEffect', 'useReducer'], correct: 1, timeLimit: 15 },
  { id: 'q2', text: 'Which hook should be used for maintaining a mutable reference that does not trigger re-renders?', options: ['useRef', 'useState', 'useContext', 'useMemo'], correct: 0, timeLimit: 15 },
  { id: 'q3', text: 'What is the correct way to pass a function to a child component to prevent unnecessary re-renders?', options: ['Pass it directly', 'Wrap in useEffect', 'Wrap in useCallback', 'It is not possible'], correct: 2, timeLimit: 15 },
];

export default function Play() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MOCK_QUESTIONS[0].timeLimit);

  const question = MOCK_QUESTIONS[currentIdx];

  useEffect(() => {
    if (isAnswered) return;
    if (timeLeft <= 0) {
      handleAnswer(-1); // Timeout
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isAnswered]);

  const handleAnswer = (optIndex: number) => {
    if (isAnswered) return;
    setSelectedOpt(optIndex);
    setIsAnswered(true);

    if (optIndex === question.correct) {
      setScore(s => s + 100 + timeLeft * 10);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#a855f7']
      });
    }
  };

  const handleNext = () => {
    if (currentIdx < MOCK_QUESTIONS.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
      setTimeLeft(MOCK_QUESTIONS[currentIdx + 1].timeLimit);
    } else {
      navigate(`/quiz/${id}/result?score=${score}`);
    }
  };

  const progress = ((currentIdx) / MOCK_QUESTIONS.length) * 100;

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl min-h-[calc(100vh-4rem)] flex flex-col pt-12">

      {/* Header Info */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-surface-dark border border-border rounded-full text-text-dim hover:text-text-white transition-colors">
          <X size={20} />
        </button>
        <div className="flex gap-4">
          <div className="bg-surface-dark border border-border px-4 py-2 rounded-xl flex items-center gap-2 font-mono text-xl font-bold">
            <Timer className={timeLeft <= 5 ? "text-error animate-pulse" : "text-primary-light"} />
            <span className={timeLeft <= 5 ? "text-error" : ""}>00:{timeLeft.toString().padStart(2, '0')}</span>
          </div>
          <div className="bg-surface-dark border border-border px-4 py-2 rounded-xl flex items-center justify-center font-bold text-xl min-w-[100px]">
            {score}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full bg-surface-muted h-2 rounded-full mb-8 overflow-hidden">
        <div
          className="bg-gradient-primary h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <Card className="flex-1 flex flex-col mb-8 border-primary-base/20 shadow-[0_0_50px_rgba(147,51,234,0.05)] relative overflow-visible">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-surface-dark border border-border px-4 py-1 rounded-full text-sm font-bold text-text-dim">
          Question {currentIdx + 1} of {MOCK_QUESTIONS.length}
        </div>
        <CardContent className="p-8 flex-1 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-center leading-relaxed">
            {question.text}
          </h2>
        </CardContent>
      </Card>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {question.options.map((opt, idx) => {
          let stateClass = "bg-surface-dark border-border hover:border-primary-base/50 hover:bg-surface-muted";

          if (isAnswered) {
            if (idx === question.correct) {
              stateClass = "bg-success/20 border-success text-success";
            } else if (idx === selectedOpt) {
              stateClass = "bg-error/20 border-error text-error";
            } else {
              stateClass = "bg-surface-darker border-border opacity-50";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={isAnswered}
              className={cn(
                "p-6 text-lg font-medium rounded-2xl border-2 transition-all flex items-center gap-4 text-left",
                stateClass
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0 border-2",
                isAnswered && idx === question.correct ? "border-success bg-success/20" :
                  isAnswered && idx === selectedOpt ? "border-error bg-error/20" :
                    "border-border bg-surface-muted"
              )}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Next Action */}
      <div className="h-16 flex justify-end">
        {isAnswered && (
          <Button size="lg" onClick={handleNext} className="px-12 text-lg shadow-[0_0_20px_rgba(147,51,234,0.3)] animate-in slide-in-from-bottom-4">
            {currentIdx < MOCK_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}
          </Button>
        )}
      </div>

    </div>
  );
}
