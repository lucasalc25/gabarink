import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuthGuardPopup() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-canvas/60 backdrop-blur-md animate-in fade-in duration-300 pointer-events-none" />
      <div className="relative w-full max-w-md bg-surface-dark border border-white/10 rounded-[32px] shadow-2xl p-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 rounded-full bg-primary-base/10 flex items-center justify-center mb-8 ring-4 ring-primary-base/5">
          <AlertCircle size={40} className="text-primary-light" />
        </div>
        
        <h2 className="text-2xl font-black text-white mb-4 tracking-tight leading-tight">
          Você já está logado!
        </h2>
        <p className="text-text-dim font-medium mb-10 text-lg">
          Deseja sair para acessar outra conta?
        </p>

        <div className="w-full flex flex-col gap-3">
          <Button 
            variant="destructive" 
            size="lg" 
            className="w-full font-bold h-14 rounded-2xl shadow-lg shadow-red-500/10 active:scale-95 transition-all text-base"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <LogOut size={20} className="mr-2" /> Sair e continuar
          </Button>
          
          <Button 
            variant="ghost" 
            size="lg" 
            className="w-full font-bold h-14 rounded-2xl text-text-dim hover:text-white hover:bg-white/5 active:scale-95 transition-all text-base"
            onClick={() => navigate('/')}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
