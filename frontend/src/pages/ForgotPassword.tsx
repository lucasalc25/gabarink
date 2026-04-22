import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Informe seu email");
    await authService.forgotPassword(email);
    setSent(true);
    toast.success("Verifique seu email");
  };

  return (
    <AuthLayout title="Recuperar senha" subtitle="Te enviamos um link para redefinir.">
      {sent ? (
        <div className="glass-card p-6 text-center">
          <p className="font-semibold mb-2">Link enviado!</p>
          <p className="text-sm text-muted-foreground mb-4">Confira sua caixa de entrada em <strong>{email}</strong>.</p>
          <Button asChild className="rounded-full"><Link to="/login">Voltar ao login</Link></Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
          </div>
          <Button type="submit" className="w-full h-11 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow rounded-full">
            Enviar link
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/login" className="text-primary font-semibold hover:underline">Voltar ao login</Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
};
export default ForgotPassword;
