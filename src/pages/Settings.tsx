import { AppLayout } from "@/components/AppLayout";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Bell, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { theme, toggle } = useTheme();
  const { logout } = useAuth();
  const nav = useNavigate();
  return (
    <AppLayout>
      <h1 className="font-display text-3xl md:text-4xl font-black mb-6">Configurações</h1>
      <div className="space-y-3 max-w-2xl">
        <Row icon={theme === "dark" ? Sun : Moon} title="Aparência" desc={`Tema atual: ${theme === "dark" ? "Escuro" : "Claro"}`} action={
          <Button onClick={toggle} variant="outline" className="rounded-full">Alternar</Button>
        } />
        <Row icon={Bell} title="Notificações" desc="Gerencie alertas de conquistas e ranking" action={<Button variant="outline" className="rounded-full">Configurar</Button>} />
        <Row icon={Shield} title="Privacidade" desc="Visibilidade do perfil e ranking" action={<Button variant="outline" className="rounded-full">Configurar</Button>} />
        <Row icon={LogOut} title="Encerrar sessão" desc="Sair da sua conta neste dispositivo" action={
          <Button variant="outline" className="rounded-full text-destructive" onClick={async () => { await logout(); nav("/"); }}>Sair</Button>
        } />
      </div>
    </AppLayout>
  );
};

const Row = ({ icon: Icon, title, desc, action }: any) => (
  <div className="glass-card p-5 flex items-center gap-4">
    <div className="h-11 w-11 rounded-2xl bg-secondary flex items-center justify-center"><Icon className="h-5 w-5 text-primary" /></div>
    <div className="flex-1">
      <p className="font-display font-bold">{title}</p>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
    {action}
  </div>
);

export default Settings;
