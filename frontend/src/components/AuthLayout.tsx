import { ReactNode } from "react";
import { Logo } from "./Logo";
import ollie from "@/assets/ollie.png";

export const AuthLayout = ({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) => (
  <div className="min-h-screen grid lg:grid-cols-2">
    <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-hero text-primary-foreground relative overflow-hidden">
      <Logo variant="white" className="relative z-10 [&>span]:text-primary-foreground" />
      <div className="relative z-10 max-w-md">
        <h2 className="font-display text-5xl font-black leading-tight mb-4">Sua jornada até a aprovação começa com uma gota de tinta.</h2>
        <p className="text-primary-foreground/80 text-lg">Trilhas casuais, simulados competitivos e quizzes feitos por você. O Gabarink está com você.</p>
      </div>
    </div>
    <div className="flex flex-col p-6 sm:p-12">
      <div className="lg:hidden mb-8"><Logo /></div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl font-black mb-2">{title}</h1>
          <p className="text-muted-foreground mb-8">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  </div>
);
