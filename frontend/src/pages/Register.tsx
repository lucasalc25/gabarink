import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Zap, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuardPopup from '@/components/auth/AuthGuardPopup';

export default function Register() {
  const { isLogged, register } = useAuth();
  const navigate = useNavigate();

  if (isLogged) return <AuthGuardPopup />;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = 'Nome é obrigatório.';
    if (!email) {
      newErrors.email = 'E-mail é obrigatório.';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'E-mail inválido.';
    }
    if (!password) {
      newErrors.password = 'Senha é obrigatória.';
    } else if (password.length < 8) {
      newErrors.password = 'A senha deve ter pelo menos 8 caracteres.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await register({ name, email, password });
      navigate('/');
    } catch (err: any) {
      setErrors({ general: err.message || 'Erro ao criar conta. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-canvas font-sans overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-base/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-dark/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="absolute top-6 w-full max-w-[420px] px-4 flex justify-center z-50">
        {errors.general && (
          <div className="flex w-full items-center gap-2 p-4 bg-error/10 border border-error/20 text-error rounded-2xl text-sm font-semibold shadow-xl backdrop-blur-md animate-in slide-in-from-top-4 duration-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{errors.general}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center space-y-4 mb-6 pt-10 z-10">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-primary shadow-[0_0_20px_rgba(168,85,247,0.4)]">
          <Zap className="w-7 h-7 text-white fill-white/20" />
        </div>
        <div className="text-center space-y-1.5 px-4">
          <h1 className="text-[26px] font-bold text-text-white tracking-tight">Criar uma conta</h1>
          <p className="text-[15px] text-text-dim opacity-80">Junte-se à comunidade Quizzy hoje</p>
        </div>
      </div>

      <Card className="w-full max-w-[420px] bg-surface-dark border-white/5 shadow-2xl rounded-[20px] z-10">
        <CardContent className="p-8">
          <form onSubmit={handleRegister} className="flex flex-col gap-2">
            <div className="space-y-1.5">
              <label className="text-[14px] font-medium text-gray-200 ml-1">Nome Completo</label>
              <Input
                placeholder="Ex: João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="w-full bg-white/5 border-white/5 text-text-white h-11 px-4 rounded-xl"
              />
              {errors.name && <span className="text-error text-xs ml-1 font-bold">{errors.name}</span>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-medium text-text-white/70 ml-1">E-mail</label>
              <Input
                type="email"
                placeholder="exemplo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full bg-white/5 border-white/5 text-text-white h-11 px-4 rounded-xl"
              />
              {errors.email && <span className="text-error text-xs ml-1 font-bold">{errors.email}</span>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-medium text-text-white/70 ml-1">Senha</label>
              <Input
                type="password"
                placeholder="Mín. 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-white/5 border-white/5 text-text-white h-11 px-4 rounded-xl"
              />
              {errors.password && <span className="text-error text-xs ml-1 font-bold">{errors.password}</span>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-medium text-text-white/70 ml-1">Confirmar Senha</label>
              <Input
                type="password"
                placeholder="Repita sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-white/5 border-white/5 text-text-white h-11 px-4 rounded-xl"
              />
              {errors.confirmPassword && <span className="text-error text-xs ml-1 font-bold">{errors.confirmPassword}</span>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-4 bg-gradient-primary shadow-lg shadow-primary-base/20 active:scale-95 transition-all text-white font-bold rounded-xl"
            >
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="my-8 text-[14px] text-text-dim font-bold">
        Já tem uma conta?{' '}
        <Link to="/login" className="text-primary-light hover:text-text-white transition-all underline underline-offset-4">
          Entrar
        </Link>
      </p>
    </div>
  );
}
