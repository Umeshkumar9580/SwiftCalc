import { Calculator } from '@/components/calculator/Calculator';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#121212] bg-[radial-gradient(circle_at_center,_rgba(255,149,0,0.05)_0%,_rgba(18,18,18,1)_100%)]">
      <div className="w-full max-w-4xl flex flex-col items-center justify-center gap-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Swift<span className="text-primary">Calc</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
            High Precision & Intelligence
          </p>
        </header>

        <Calculator />

        <footer className="text-center">
          <p className="text-xs text-muted-foreground/50 font-display">
            V 2.0.1 | POWERED BY GENAI & NEXT.JS
          </p>
        </footer>
      </div>
    </main>
  );
}
