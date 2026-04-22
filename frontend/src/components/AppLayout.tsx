import { ReactNode } from "react";
import { Header } from "./layout/Header";
import { MobileNav } from "./MobileNav";
import { useAuth } from "@/context/AuthContext";

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container-custom py-6 pb-24 md:pb-12">{children}</main>
      {user && <MobileNav />}
    </div>
  );
};
