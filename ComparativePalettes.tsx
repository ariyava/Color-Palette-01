import { RGB, rgbToHex } from "../utils/colorMixer";
import { findSimilarPalettes, MatchedResult, PaletteColor } from "../utils/paletteCategories";
import { Compass, Sparkles, Paintbrush, ArrowRight, Save, Plus } from "lucide-react";
import { motion } from "motion/react";

interface ComparativePalettesProps {
  activeRgb: RGB;
  activeHex: string;
  onSelectColor: (color: { hex: string; rgb: RGB; name: string; backstory: string; closestPigment: string; paletteConcept: string }) => void;
  onInjectIntoMixer: (pigment: { id: string; name: string; hex: string; rgb: RGB }) => void;
  onSaveColor: (color: { hex: string; rgb: RGB; name: string; backstory: string; closestPigment: string; paletteConcept: string }) => void;
}

export default function ComparativePalettes({
  activeRgb,
  activeHex,
  onSelectColor,
  onInjectIntoMixer,
  onSaveColor,
}: ComparativePalettesProps) {
  // Find similar palettes for the active color
  const matchedCategories = findSimilarPalettes(activeRgb);

  // Help format a match percentage from Euclidean distance
  const getMatchPercent = (distance: number) => {
    // Max distance is sqrt(255^2 * 3) ≈ 441.67
    const pct = 100 - (distance / 441.67) * 100;
    return Math.max(1, Math.min(99, Math.round(pct)));
  };

  return (
    <div id="comparative-matrix" className="bg-stone-50 border border-stone-200 rounded-2xl p-5 shadow-sm space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-200/60 pb-4">
        <div>
          <h2 className="text-stone-800 font-sans font-semibold text-sm flex items-center gap-1.5 uppercase tracking-wider">
            <Compass className="w-4 h-4 text-amber-600 animate-spin-slow" />
            Comparative Palette Matrix
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            See how your created color <span className="font-mono font-bold text-stone-700">{activeHex}</span> fits side-by-side into 4 distinct artistic aesthetics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md font-mono font-bold">
            Target: {activeHex}
          </div>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {matchedCategories.map((cat: MatchedResult) => {
          const { matchedColor, distance, subcategoryName, subcategoryDescription, coordinatingColors } = cat;
          const matchPct = getMatchPercent(distance);

          // Get border/tag color based on category
          const themeStyle = {
            "fine-art": { bg: "bg-amber-500/10", text: "text-amber-800 border-amber-200", dot: "bg-amber-500" },
            "historical-eras": { bg: "bg-purple-500/10", text: "text-purple-800 border-purple-200", dot: "bg-purple-500" },
            "modern-interior": { bg: "bg-emerald-500/10", text: "text-emerald-800 border-emerald-200", dot: "bg-emerald-500" },
            "digital-moods": { bg: "bg-blue-500/10", text: "text-blue-800 border-blue-200", dot: "bg-blue-500" },
          }[cat.categoryId as "fine-art" | "historical-eras" | "modern-interior" | "digital-moods"] || { bg: "bg-stone-100", text: "text-stone-800 border-stone-200", dot: "bg-stone-500" };

          return (
            <div
              key={cat.categoryId}
              className="flex flex-col bg-white border border-stone-200 rounded-xl p-4 hover:shadow-md hover:border-stone-300 transition-all group/card h-full"
            >
              {/* Category tag */}
              <div className="flex items-center justify-between gap-1.5 mb-2.5">
                <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${themeStyle.text} ${themeStyle.bg}`}>
                  {cat.categoryName.split(' ')[0]}
                </span>
                <span className="text-[9px] font-semibold text-stone-400 font-mono">
                  {matchPct}% match
                </span>
              </div>

              {/* Subcategory subtitle */}
              <div className="mb-3">
                <h4 className="text-xs font-bold text-stone-800 leading-tight">
                  {subcategoryName}
                </h4>
                <p className="text-[10px] text-stone-400 leading-snug mt-0.5">
                  {subcategoryDescription}
                </p>
              </div>

              {/* Matched Swatch Card */}
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="relative h-20 w-full rounded-lg shadow-inner overflow-hidden border border-stone-100 mb-2.5 flex flex-col justify-end p-2 group">
                    <div
                      className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundColor: matchedColor.hex }}
                    />
                    {/* Gloss highlight */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none" />
                    
                    {/* Hover Inspect overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2 text-white">
                      <button
                        onClick={() => onSelectColor({
                          hex: matchedColor.hex,
                          rgb: matchedColor.rgb,
                          name: matchedColor.name,
                          backstory: matchedColor.backstory,
                          closestPigment: cat.categoryName,
                          paletteConcept: subcategoryName
                        })}
                        className="py-1 px-2 bg-white/25 hover:bg-white/40 active:scale-95 rounded text-[10px] font-semibold tracking-wide backdrop-blur-sm transition-all"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => onInjectIntoMixer({
                          id: `match-${matchedColor.name.toLowerCase().replace(/\s+/g, '-')}`,
                          name: matchedColor.name,
                          hex: matchedColor.hex,
                          rgb: matchedColor.rgb
                        })}
                        className="p-1 bg-white/25 hover:bg-white/40 active:scale-95 rounded text-[10px] backdrop-blur-sm transition-all"
                        title="Pour into Paint Tray"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="relative z-10 bg-black/35 backdrop-blur-xs rounded px-1.5 py-0.5 max-w-full">
                      <p className="text-[10px] font-bold text-white truncate leading-none">
                        {matchedColor.name}
                      </p>
                      <p className="text-[8px] font-mono text-stone-200 mt-0.5 leading-none">
                        {matchedColor.hex}
                      </p>
                    </div>
                  </div>

                  <p className="text-[10px] text-stone-500 italic leading-snug line-clamp-3 mb-3">
                    "{matchedColor.backstory}"
                  </p>
                </div>

                {/* Coordinating Colors shelf */}
                <div className="border-t border-stone-100 pt-2.5 mt-auto">
                  <span className="text-[9px] font-mono text-stone-400 block uppercase tracking-wider mb-2">
                    Coordinating Palette Series
                  </span>
                  <div className="flex gap-2">
                    {coordinatingColors.slice(0, 4).map((color: PaletteColor, idx: number) => (
                      <div
                        key={color.name}
                        className="relative w-7 h-7 rounded-full shadow-sm border border-stone-200 cursor-pointer group/dot flex-shrink-0"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => onSelectColor({
                          hex: color.hex,
                          rgb: color.rgb,
                          name: color.name,
                          backstory: color.backstory,
                          closestPigment: cat.categoryName,
                          paletteConcept: subcategoryName
                        })}
                      >
                        {/* Hover tooltips */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/dot:block z-30 bg-stone-900 text-white rounded p-1.5 text-[8px] font-sans font-medium whitespace-nowrap shadow-md pointer-events-none">
                          <span className="block font-bold">{color.name}</span>
                          <span className="font-mono text-stone-400">{color.hex}</span>
                        </div>
                        {/* Smooth glass halo */}
                        <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover/dot:opacity-100 transition-opacity" />
                      </div>
                    ))}
                    
                    {/* Add to Palette Action */}
                    <button
                      onClick={() => {
                        // Quick-save the matched color
                        onSaveColor({
                          hex: matchedColor.hex,
                          rgb: matchedColor.rgb,
                          name: matchedColor.name,
                          backstory: matchedColor.backstory,
                          closestPigment: cat.categoryName,
                          paletteConcept: subcategoryName
                        });
                      }}
                      className="w-7 h-7 rounded-full bg-stone-100 border border-stone-200 hover:border-stone-400 active:scale-95 flex items-center justify-center text-stone-500 hover:text-stone-700 transition-all ml-auto"
                      title="Add match to Saved Swatches"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
