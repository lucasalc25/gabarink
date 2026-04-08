import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Sparkles, PenTool, LayoutTemplate, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function CreateQuiz() {
  const navigate = useNavigate();
  const { isLogged } = useAuth();

  useEffect(() => {
    if (!isLogged) {
      navigate('/login');
    }
  }, [isLogged, navigate]);

  const [method, setMethod] = useState<'MANUAL' | 'TEMPLATE' | 'AI'>('MANUAL');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // AI Form
  const [aiTopic, setAiTopic] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState('Medium');
  const [aiQuestions, setAiQuestions] = useState(10);
  
  // Manual Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const quiz = await api.generateAIQuiz(aiTopic, aiDifficulty, aiQuestions);
      // Auto-fill manual form with generated data to allow editing
      setTitle(quiz.title);
      setDescription(`AI generated quiz about ${aiTopic}`);
      setMethod('MANUAL');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-text-white">Create a Quiz</h1>
        <p className="text-text-dim">Choose how you want to create your new quiz</p>
      </div>

      {/* Method Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { id: 'MANUAL', icon: PenTool, title: 'From Scratch', desc: 'Write questions manually' },
          { id: 'TEMPLATE', icon: LayoutTemplate, title: 'Use Template', desc: 'Start with a preset' },
          { id: 'AI', icon: Sparkles, title: 'AI Generation', desc: 'Gemini creates it for you', gradient: true }
        ].map(m => (
          <button
            key={m.id}
            onClick={() => {
              if (m.id === 'TEMPLATE') navigate('/templates');
              else setMethod(m.id as any);
            }}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all ${
              method === m.id
                ? m.gradient ? 'border-primary-base bg-primary-base/10 shadow-[0_0_20px_rgba(147,51,234,0.2)]' : 'border-border bg-surface-muted'
                : 'border-border bg-surface-dark hover:bg-surface-muted'
            }`}
          >
            <m.icon size={32} className={`mb-4 ${m.gradient ? 'text-primary-light' : 'text-text-dim'}`} />
            <span className="font-bold text-lg">{m.title}</span>
            <span className="text-sm text-text-dim mt-2">{m.desc}</span>
          </button>
        ))}
      </div>

      {method === 'AI' && (
        <Card className="border-primary-base/30 shadow-[0_0_30px_rgba(147,51,234,0.1)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-base/10 to-transparent pointer-events-none" />
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-primary-light h-6 w-6" />
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-primary">AI Generator</h2>
            </div>
            
            <form onSubmit={handleGenerateAI} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-dim mb-2">What is the quiz about?</label>
                <Input 
                  placeholder="e.g. History of Rome, Quantum Physics..." 
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  disabled={isGenerating}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-dim mb-2">Difficulty</label>
                  <select 
                    className="flex w-full rounded-xl border border-border bg-surface-dark px-4 py-3 text-sm text-text-white focus:ring-2 focus:ring-primary-base outline-none"
                    value={aiDifficulty}
                    onChange={e => setAiDifficulty(e.target.value)}
                    disabled={isGenerating}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dim mb-2">Questions Count</label>
                  <select 
                    className="flex w-full rounded-xl border border-border bg-surface-dark px-4 py-3 text-sm text-text-white focus:ring-2 focus:ring-primary-base outline-none"
                    value={aiQuestions}
                    onChange={e => setAiQuestions(Number(e.target.value))}
                    disabled={isGenerating}
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                  </select>
                </div>
              </div>
              
              <Button type="submit" size="lg" className="w-full mt-4" isLoading={isGenerating}>
                {isGenerating ? 'Generating Quiz...' : 'Generate with Gemini'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {method === 'MANUAL' && (
        <Card>
          <CardContent className="p-8 space-y-6">
            <h2 className="text-xl font-bold">Quiz Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dim mb-2">Title</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="My Awesome Quiz" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dim mb-2">Description</label>
                <textarea 
                  className="flex min-h-[100px] w-full rounded-xl border border-border bg-surface-dark px-4 py-3 text-sm text-text-white focus:ring-2 focus:ring-primary-base outline-none resize-y"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What is this quiz about?"
                />
              </div>
            </div>
            
            <div className="pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Questions List</h3>
                <Button variant="secondary" size="sm" type="button">
                  <Plus size={16} className="mr-1" /> Add Question
                </Button>
              </div>
              <div className="bg-surface-darker rounded-xl p-8 border border-dashed border-white/20 text-center">
                <p className="text-text-dim">No questions added yet.</p>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-border mt-8">
              <Button variant="ghost">Cancel</Button>
              <Button>Save Draft</Button>
              <Button className="bg-success text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:opacity-90">Publish Quiz</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
