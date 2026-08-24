import { Palette, Sparkles, Paintbrush, HelpCircle } from "lucide-react";

interface HeaderProps {
  onShowHelp: () => void;
}

export default function Header({ onShowHelp }: HeaderProps) {
  return (
    <header className="border-b border-stone-200 bg-stone-50/85 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 rounded-xl shadow-md text-white overflow-hidden group">
            <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-300" />
            <Palette className="w-6 h-6 relative z-10 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-sans font-semibold text-lg tracking-tight text-stone-900">
                Atelier
              </h1>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-stone-200 text-stone-700 font-bold uppercase tracking-wider scale-90">
                Studio
              </span>
            </div>
            <p className="text-xs text-stone-500 font-sans tracking-wide">
              Subtractive Pigment mixing & AI-curated palette playground
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onShowHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium font-sans text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-all"
            title="How to mix paint"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Mixing Guide</span>
          </button>
          
          <div className="hidden md:flex items-center gap-2 border-l border-stone-200 pl-4">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-stone-500">Workspace Connected</span>
          </div>
        </div>
      </div>
    </header>
  );
}
