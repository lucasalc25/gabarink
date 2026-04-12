import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Zap, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuardPopup from '@/components/auth/AuthGuardPopup';

export default function Login() {
  const { isLogged, login } = useAuth();
  const navigate = useNavigate();

  if (isLogged) return <AuthGuardPopup />;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    let hasError = false;
    if (!email) {
      setEmailError('Por favor, insira seu e-mail.');
      hasError = true;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('E-mail inválido.');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Por favor, insira sua senha.');
      hasError = true;
    }

    if (hasError) return;

    try {
      setIsLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setGeneralError(err.message || 'Erro ao entrar. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 font-sans">
      <div className="absolute top-6 w-full max-w-[420px] px-4 flex justify-center z-50">
        {generalError && (
          <div className="flex w-full items-center gap-2 p-4 bg-error/10 border border-error/20 text-error rounded-2xl text-sm font-semibold shadow-xl backdrop-blur-md animate-in slide-in-from-top-4 duration-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{generalError}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center space-y-6 mb-10 z-10">
        <Link to="/" className="flex flex-col items-center group">
          <h2 className="mt-6 text-4xl font-medium text-text-white tracking-tight">Seja bem-vindo(a)</h2>
        </Link>
      </div>

      <Card className="w-full max-w-[420px] bg-surface-dark/40 backdrop-blur-2xl border-white/5 shadow-2xl rounded-[32px] overflow-hidden z-10">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary-base/50 to-transparent" />
        <CardContent className="p-10">
          <form onSubmit={handleLogin} className="flex flex-col space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-white/70 ml-1">E-mail</label>
              <Input
                type="email"
                placeholder="exemplo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={cn(
                  "w-full bg-white/5 border-white/5 text-text-white h-13 px-5 rounded-2xl"
                )}
              />
              {emailError && <p className="text-error text-xs mt-1.5 ml-1">{emailError}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text-white/70">Senha</label>
              <Input
                type="password"
                placeholder="No mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className={cn(
                  "w-full bg-white/5 border-white/5 text-text-white h-13 px-5 rounded-2xl"
                )}
              />
              {passwordError && <p className="text-error text-xs mt-1.5 ml-1">{passwordError}</p>}


            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-gradient-primary text-white font-black rounded-2xl text-base shadow-xl active:scale-95 transition-all"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <button type="button" className="text-xs font-bold text-primary-light">Esqueceu a senha?</button>

          <p className="mt-10 text-center text-sm font-bold text-text-dim">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-primary-light hover:text-text-white transition-all underline underline-offset-4">
              Crie uma conta
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
