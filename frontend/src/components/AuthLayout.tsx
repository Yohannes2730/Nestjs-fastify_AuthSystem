import { ReactNode } from "react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const AuthLayout = ({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) => (
  <div className="min-h-screen bg-background">
    <header className="container mx-auto flex items-center justify-between py-6">
      <Logo />
      <ThemeToggle />
    </header>
    <main className="container mx-auto flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-scale-in">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        </div>
        <div className="rounded-2xl border bg-card p-8 shadow-elegant">{children}</div>
      </div>
    </main>
  </div>
);

export default AuthLayout;
