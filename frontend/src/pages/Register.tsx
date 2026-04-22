import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Register = () => {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) return toast.error("Preencha todos os campos");
    if (form.password.length < 6) return toast.error("Senha deve ter ao menos 6 caracteres");
    setLoading(true);
    try {
      await register(form);
      toast.success("Conta criada! Bem-vindo à Gabarink");
      nav("/home");
    } catch {
      toast.error("Falha ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Criar conta" subtitle="Sua jornada começa aqui.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Nome</Label>
          <Input id="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Como devemos te chamar?" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="seu@email.com" />
        </div>
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mínimo 6 caracteres" />
        </div>
        <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow rounded-full">
          {loading ? "Criando..." : "Criar conta"}
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Já tem conta? <Link to="/login" className="text-primary font-semibold hover:underline">Entrar</Link>
        </p>
      </form>
    </AuthLayout>
  );
};
export default Register;
