import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, Lock, KeyRound, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto flex items-center justify-between py-6">
        <Logo />
        <nav className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center md:py-32">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-accent/50 px-4 py-1.5 text-sm text-accent-foreground animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" />
            Modern auth, built for developers
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-bold tracking-tight md:text-7xl animate-fade-in-up">
            Secure <span className="gradient-text">Authentication</span> System
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl animate-fade-in-up">
            Production-ready auth with email OTP verification, JWT sessions, and a beautiful UI.
            Get started in seconds.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up">
            <Link to="/register">
              <Button size="lg" className="gap-2 shadow-elegant">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Login
              </Button>
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-24">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: KeyRound, title: "JWT Auth", desc: "Stateless, secure tokens with auto-refresh and protected routes built in." },
              { icon: Shield, title: "OTP Verification", desc: "Email-based 6-digit codes with resend cooldown and expiry handling." },
              { icon: Zap, title: "Fast API", desc: "Optimistic updates, axios interceptors, and zero unnecessary re-renders." },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group relative rounded-2xl border bg-card p-6 transition-smooth hover:shadow-elegant hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-hero shadow-elegant">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <Lock className="mx-auto mb-2 h-4 w-4" />
          © {new Date().getFullYear()} SecureAuth. Built with React, TypeScript & Tailwind.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
