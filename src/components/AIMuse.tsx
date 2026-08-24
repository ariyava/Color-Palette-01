import React, { useState } from "react";
import { Sparkles, Loader2, ArrowRight, Save, Compass, Check, HelpCircle } from "lucide-react";
import { SavedColor } from "../types";
import { hexToRgb } from "../utils/colorMixer";

interface AIMuseProps {
  onImportPalette: (colors: { hex: string; name: string; backstory: string; closestPigment: string; paletteConcept: string }[]) => void;
  savedColorsCount: number;
}

interface GeneratedColor {
  hex: string;
  name: string;
  reason: string;
}

interface GeneratedPalette {
  paletteName: string;
  description: string;
  colors: GeneratedColor[];
}

export default function AIMuse({ onImportPalette, savedColorsCount }: AIMuseProps) {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [palette, setPalette] = useState<GeneratedPalette | null>(null);
  const [imported, setImported] = useState(false);

  const samplePrompts = [
    "Rainy afternoon in Kyoto",
    "Cyberpunk street neon",
    "Cozy coastal cabin",
    "Vintage 1970s vinyl lounge",
    "Desert sand at sunset",
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;

    setLoading(true);
    setError(null);
    setPalette(null);
    setImported(false);

    try {
      const response = await fetch("/api/mood-palette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood }),
      });

      if (!response.ok) {
        throw new Error("Failed to consult the AI Muse. Please ensure GEMINI_API_KEY is configured in Settings.");
      }

      const data = await response.json();
      if (data.colors && data.colors.length > 0) {
        setPalette(data);
      } else {
        throw new Error("Invalid response received from AI model.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected issue occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleImportAll = () => {
    if (!palette) return;
    
    // Format into SavedColor template (excluding ID which will be assigned by parent state manager)
    const formatted = palette.colors.map(c => ({
      hex: c.hex,
      name: c.name,
      backstory: c.reason,
      closestPigment: "AI Presets",
      paletteConcept: "AI Muse Theme",
    }));

    onImportPalette(formatted);
    setImported(true);
    setTimeout(() => setImported(false), 2500);
  };

  const handleImportSingle = (color: GeneratedColor) => {
    onImportPalette([{
      hex: color.hex,
      name: color.name,
      backstory: color.reason,
      closestPigment: "AI Single Preset",
      paletteConcept: "AI Muse Single",
    }]);
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-1">
        <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
        <h2 className="text-stone-800 font-sans font-semibold text-sm uppercase tracking-wider">
          The AI Paint Muse
        </h2>
      </div>
      <p className="text-xs text-stone-500 font-sans mb-4">
        Describe a mood or atmosphere to paint a custom color scheme
      </p>

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="space-y-3.5">
        <div className="flex gap-2">
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="e.g., Midnight forest after snowfall, Cyberpunk street alleys..."
            className="flex-1 px-4 py-2 text-xs rounded-xl border border-stone-200 bg-white shadow-inner text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !mood.trim()}
            className="px-4 py-2 bg-gradient-to-tr from-amber-500 to-rose-600 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:scale-100 text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-sm transition-all flex-shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Mixing...</span>
              </>
            ) : (
              <>
                <span>Generate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Suggestion tags */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
          <span className="text-stone-400 font-medium flex items-center gap-1 mr-1">
            <Compass className="w-3 h-3" /> Prompts:
          </span>
          {samplePrompts.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setMood(p)}
              disabled={loading}
              className="px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>
      </form>

      {/* Error state */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Generated Output */}
      {palette && (
        <div className="mt-5 border-t border-stone-200 pt-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-sans font-bold text-stone-800 text-sm flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500" />
                {palette.paletteName}
              </h3>
              <p className="text-[11px] text-stone-500 font-sans mt-0.5 leading-relaxed">
                {palette.description}
              </p>
            </div>

            <button
              onClick={handleImportAll}
              disabled={imported || savedColorsCount >= 12}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm flex-shrink-0 ${
                imported
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : savedColorsCount >= 12
                  ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed"
                  : "bg-white border-stone-200 hover:border-stone-400 text-stone-800 active:scale-95"
              }`}
            >
              {imported ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Imported successfully!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-stone-500" />
                  <span>Import 5 Colors</span>
                </>
              )}
            </button>
          </div>

          {/* Color swatches showcase */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {palette.colors.map((c, idx) => (
              <div
                key={idx}
                className="bg-white border border-stone-200 rounded-xl p-2.5 flex flex-col justify-between hover:shadow-md transition-shadow group h-full"
              >
                <div>
                  <div
                    className="h-14 w-full rounded-lg shadow-inner border border-stone-100 flex items-start justify-end p-1"
                    style={{ backgroundColor: c.hex }}
                  >
                    <button
                      onClick={() => handleImportSingle(c)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded bg-white/95 text-stone-600 hover:text-stone-900 shadow-sm transition-all"
                      title="Import this single color"
                    >
                      <Save className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <h4 className="text-[11px] font-bold text-stone-800 font-sans mt-2 truncate">
                    {c.name}
                  </h4>
                  <p className="text-[9px] font-mono text-stone-400 uppercase mt-0.5">
                    {c.hex}
                  </p>
                </div>
                
                <p className="text-[10px] text-stone-500 leading-snug font-sans mt-1.5 border-t border-stone-50 pt-1.5 italic">
                  {c.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
