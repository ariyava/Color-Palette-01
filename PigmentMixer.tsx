import { useState } from "react";
import { MixingConstituent, SavedColor } from "../types";
import { CLASSIC_PIGMENTS, ACRYLIC_PAINTS, RGB } from "../utils/colorMixer";
import { Plus, Minus, Trash2, RotateCcw, Paintbrush, Flame } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PigmentMixerProps {
  constituents: MixingConstituent[];
  onUpdateParts: (id: string, parts: number) => void;
  onRemoveConstituent: (id: string) => void;
  onAddConstituent: (pigment: { id: string; name: string; hex: string; rgb: RGB }) => void;
  onClearMixer: () => void;
  blendedHex: string;
  savedColors: SavedColor[];
}

export default function PigmentMixer({
  constituents,
  onUpdateParts,
  onRemoveConstituent,
  onAddConstituent,
  onClearMixer,
  blendedHex,
  savedColors,
}: PigmentMixerProps) {
  const [medium, setMedium] = useState<'oil' | 'acrylic'>('oil');
  const activePaints = medium === 'oil' ? CLASSIC_PIGMENTS : ACRYLIC_PAINTS;
  
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 shadow-sm h-full flex flex-col">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-stone-800 font-sans font-semibold text-sm flex items-center gap-1.5 uppercase tracking-wider">
            <Paintbrush className="w-4 h-4 text-amber-600" />
            Paint Mixing Tray
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Add pigments and adjust parts to mix subtractively
          </p>
        </div>
        {constituents.length > 0 && (
          <button
            onClick={onClearMixer}
            className="flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-red-600 px-2 py-1 rounded hover:bg-stone-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Cup</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1 min-h-[350px]">
        {/* Left Side: Pigment Squeeze Options */}
        <div className="space-y-4">
          <div>
            <div className="flex bg-stone-200/50 p-1 rounded-xl mb-3 border border-stone-200/30">
              <button
                type="button"
                onClick={() => setMedium('oil')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-semibold tracking-wider uppercase transition-all ${
                  medium === 'oil' ? 'bg-white text-amber-800 shadow-xs border border-stone-200/60' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Classic Oils
              </button>
              <button
                type="button"
                onClick={() => setMedium('acrylic')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-semibold tracking-wider uppercase transition-all ${
                  medium === 'acrylic' ? 'bg-white text-emerald-800 shadow-xs border border-stone-200/60' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Acrylic Paints
              </button>
            </div>

            <h3 className="text-xs font-semibold text-stone-600 font-sans mb-2 uppercase tracking-wide">
              {medium === 'oil' ? "Primary Oil Pigments" : "Heavy Body Acrylic Paints"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
              {activePaints.map((pig) => (
                <button
                  key={pig.id}
                  onClick={() => onAddConstituent({ id: pig.id, name: pig.name, hex: pig.hex, rgb: pig.rgb })}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white border border-stone-200 hover:border-stone-400 hover:shadow-sm active:scale-95 transition-all text-left group"
                >
                  <div
                    className="w-8 h-8 rounded-full shadow-inner border border-stone-100 flex-shrink-0 relative"
                    style={{ backgroundColor: pig.hex }}
                  >
                    <div className="absolute inset-0 rounded-full bg-white/10 group-hover:bg-transparent transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-stone-800 truncate leading-tight">
                      {pig.name}
                    </p>
                    <p className="text-[10px] text-stone-400 font-sans capitalize truncate">
                      {pig.type}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Squeezed Custom Colors if any exist */}
          {savedColors.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-stone-600 font-sans mb-2 uppercase tracking-wide">
                Your Mixed Shelf (Squeeze in)
              </h3>
              <div className="flex flex-wrap gap-2 max-h-[110px] overflow-y-auto pr-1">
                {savedColors.slice(0, 8).map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => onAddConstituent({ id: `custom-${sc.id}`, name: sc.name, hex: sc.hex, rgb: sc.rgb })}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-stone-400 text-left text-xs text-stone-700 active:scale-95 transition-all"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-stone-100 flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: sc.hex }}
                    />
                    <span className="font-medium truncate max-w-[80px]">{sc.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: The Blending Cup and Constituents List */}
        <div className="flex flex-col bg-stone-100/50 rounded-xl p-4 border border-stone-200/60">
          {constituents.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center flex-1 py-8">
              {/* Cup placeholder */}
              <div className="relative w-28 h-28 border-2 border-dashed border-stone-300 rounded-full flex items-center justify-center text-stone-400 mb-3 bg-stone-50">
                <Paintbrush className="w-8 h-8 opacity-40 animate-pulse" />
              </div>
              <p className="text-xs font-medium text-stone-600">Your mixing cup is empty</p>
              <p className="text-[11px] text-stone-400 max-w-[180px] mt-1">
                Click on the pigments on the left to squeeze paint drops into the cup.
              </p>
            </div>
          ) : (
            <div className="flex flex-col h-full gap-4">
              {/* Constituents List */}
              <div className="flex-1 overflow-y-auto max-h-[160px] space-y-2 pr-1">
                <AnimatePresence initial={false}>
                  {constituents.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center justify-between bg-white p-2 rounded-xl border border-stone-200 shadow-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span
                          className="w-5 h-5 rounded-full border border-stone-100 shadow-sm flex-shrink-0"
                          style={{ backgroundColor: item.hex }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-stone-800 truncate leading-none">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-stone-400 font-mono mt-0.5 leading-none">
                            {item.parts} {item.parts === 1 ? 'part' : 'parts'} ({Math.round((item.parts / constituents.reduce((s, i) => s + i.parts, 0)) * 100)}%)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onUpdateParts(item.id, Math.max(1, item.parts - 1))}
                          disabled={item.parts <= 1}
                          className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 disabled:opacity-40 flex items-center justify-center text-stone-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-stone-700 font-mono">
                          {item.parts}
                        </span>
                        <button
                          onClick={() => onUpdateParts(item.id, Math.min(10, item.parts + 1))}
                          disabled={item.parts >= 10}
                          className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 disabled:opacity-40 flex items-center justify-center text-stone-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onRemoveConstituent(item.id)}
                          className="w-6 h-6 ml-1.5 rounded-md text-stone-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                          title="Squeeze out"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Blended Swatch Swirl (satisfying liquid visuals) */}
              <div className="flex items-center gap-3 border-t border-stone-200 pt-3 mt-auto">
                <div className="relative w-16 h-16 rounded-full shadow-md flex-shrink-0 overflow-hidden border border-stone-200 group bg-stone-300">
                  {/* Outer ring */}
                  <div className="absolute inset-1 rounded-full border border-black/10 z-10" />
                  
                  {/* Swirl liquid layers */}
                  <div
                    className="absolute inset-0 transition-colors duration-300"
                    style={{ backgroundColor: blendedHex }}
                  />
                  
                  {/* Organic swirls overlays */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/10 pointer-events-none mix-blend-overlay" />
                  
                  {/* Mini physical swirl spirals */}
                  <svg className="absolute inset-0 w-full h-full text-white/10 opacity-60 animate-spin-slow pointer-events-none" viewBox="0 0 100 100">
                    <path fill="currentColor" d="M50 5C25.1 5 5 25.1 5 50s20.1 45 45 45 45-20.1 45-45S74.9 5 50 5zm0 80c-19.3 0-35-15.7-35-35s15.7-35 35-35 35 15.7 35 35-15.7 35-35 35z" />
                    <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 10" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <p className="text-[10px] text-stone-400 font-mono font-bold uppercase tracking-wider">
                    Resulting Swatch
                  </p>
                  <p className="text-sm font-mono font-semibold text-stone-800 leading-tight">
                    {blendedHex}
                  </p>
                  <p className="text-[11px] text-stone-500 font-sans mt-0.5 leading-none">
                    {constituents.length} pigment{constituents.length > 1 && 's'} in cup
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
