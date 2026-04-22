import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Preencha email e senha");
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Bem-vindo de volta!");
      nav("/home");
    } catch {
      toast.error("Falha ao entrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Entrar na Gabarink" subtitle="Continue de onde parou.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
        </div>
        <div>
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Senha</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">Esqueci a senha</Link>
          </div>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow rounded-full">
          {loading ? "Entrando..." : "Entrar"}
        </Button>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs"><span className="px-3 bg-background text-muted-foreground">ou continue com</span></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="outline" className="rounded-full">Google</Button>
          <Button type="button" variant="outline" className="rounded-full">Apple</Button>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Não tem conta? <Link to="/register" className="text-primary font-semibold hover:underline">Cadastre-se</Link>
        </p>
      </form>
    </AuthLayout>
  );
};
export default Login;
