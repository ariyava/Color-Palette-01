import { useState, useEffect } from "react";
import { RGB, rgbToHsl, rgbToCmyk, getClosestClassicPigment } from "../utils/colorMixer";
import { Sparkles, Save, Info, Check, AlertCircle, Copy, Loader2 } from "lucide-react";
import { SavedColor } from "../types";

interface ColorInspectorProps {
  hex: string;
  rgb: RGB;
  onSaveColor: (color: {
    hex: string;
    rgb: RGB;
    name: string;
    backstory: string;
    closestPigment: string;
    paletteConcept: string;
  }) => void;
  savedColors: SavedColor[];
}

export default function ColorInspector({
  hex,
  rgb,
  onSaveColor,
  savedColors,
}: ColorInspectorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiData, setAiData] = useState<{
    hex: string;
    name: string;
    backstory: string;
    closestPigment: string;
    paletteConcept: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Check if this color is already saved (by comparing hex)
  const isAlreadySaved = savedColors.some(
    (c) => c.hex.toLowerCase() === hex.toLowerCase()
  );

  // Fallback local naming generator (guarantees zero-failure artistic details)
  const getFallbackDetails = (hexVal: string, rgbVal: RGB) => {
    const hsl = rgbToHsl(rgbVal);
    const closest = getClosestClassicPigment(rgbVal);
    let name = "Custom Blend";
    let backstory = "An elegant, bespoke pigment crafted in the atelier.";
    let concept = "Accent Highlight";

    if (hsl.l < 12) {
      name = "Obsidian Depth";
      backstory = "The intense, velvety shadow of midnight obsidian.";
      concept = "Base Foundation";
    } else if (hsl.l > 88) {
      name = "Alabaster Whisper";
      backstory = "A soft, luminous shade like early morning frost on linen.";
      concept = "Airy Highlights";
    } else if (hsl.s < 12) {
      name = "Dovetail Grey";
      backstory = "A peaceful, silent grey evoking rain-soaked shingle rooftops.";
      concept = "Neutral Shadow";
    } else {
      // Determine by Hue
      if (hsl.h >= 0 && hsl.h < 22) {
        name = hsl.s > 60 ? "Cadmium Ember" : "Burnt Terracotta";
        backstory = "Evoking baked desert tiles cooled by late evening breeze.";
        concept = "Warm Focal Point";
      } else if (hsl.h >= 22 && hsl.h < 48) {
        name = hsl.s > 60 ? "Sunlit Apricot" : "Ochre Clay";
        backstory = "The amber-gilded clay walls of old Tuscan farmhouses.";
        concept = "Warm Accents";
      } else if (hsl.h >= 48 && hsl.h < 75) {
        name = hsl.s > 60 ? "Saffron Glaze" : "Muted Wheat";
        backstory = "Fields of golden barley bending gently under a high summer sky.";
        concept = "Golden Glow";
      } else if (hsl.h >= 75 && hsl.h < 155) {
        name = hsl.s > 50 ? "Meadow Viridian" : "Sage Canopy";
        backstory = "Dappled light filtering through ancient cedar glades.";
        concept = "Organic Midtone";
      } else if (hsl.h >= 155 && hsl.h < 205) {
        name = hsl.s > 50 ? "Cobalt Teal" : "Misty Fjord";
        backstory = "The quiet glacial waters of northern bays under morning fog.";
        concept = "Cool Tranquility";
      } else if (hsl.h >= 205 && hsl.h < 255) {
        name = hsl.s > 60 ? "Ultramarine Peak" : "Slate Horizon";
        backstory = "The majestic, endless blue of deep ocean ridges.";
        concept = "Noble Core Color";
      } else if (hsl.h >= 255 && hsl.h < 290) {
        name = "Wild Lavender";
        backstory = "Rustic blossoms blooming in limestone mountain crags.";
        concept = "Poetic Harmony";
      } else if (hsl.h >= 290 && hsl.h < 340) {
        name = hsl.s > 50 ? "Imperial Orchid" : "Dusk Mulberry";
        backstory = "The rich, dramatic purple of ripe forest fruits.";
        concept = "Rich Statement";
      } else {
        name = "Scarlet Solstice";
        backstory = "A fiery crimson red reminiscent of winter berries in snow.";
        concept = "Vibrant Anchor";
      }
    }

    return {
      name,
      backstory,
      closestPigment: closest,
      paletteConcept: concept,
    };
  };

  // Sync state or load pre-saved details when hex changes without auto-requesting API
  useEffect(() => {
    const matchingSaved = savedColors.find(
      (c) => c.hex.toLowerCase() === hex.toLowerCase()
    );
    if (matchingSaved) {
      setAiData({
        hex: matchingSaved.hex,
        name: matchingSaved.name,
        backstory: matchingSaved.backstory,
        closestPigment: matchingSaved.closestPigment,
        paletteConcept: matchingSaved.paletteConcept,
      });
    } else {
      setAiData(null);
    }
    setLoading(false);
    setError(null);
  }, [hex, savedColors]);

  const handleConsultAI = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/name-color", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hex, r: rgb.r, g: rgb.g, b: rgb.b }),
      });

      if (!response.ok) {
        throw new Error("API issue");
      }

      const data = await response.json();
      if (data.name) {
        setAiData({ ...data, hex });
      } else {
        const fallback = getFallbackDetails(hex, rgb);
        setAiData({ ...fallback, hex });
      }
    } catch (err) {
      console.warn("Using local fallback name generator.");
      const fallback = getFallbackDetails(hex, rgb);
      setAiData({ ...fallback, hex });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyHex = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hsl = rgbToHsl(rgb);
  const cmyk = rgbToCmyk(rgb);

  // Pre-fetch fallback data to show instantly during loading
  const instantFallback = getFallbackDetails(hex, rgb);
  const activeName = aiData ? aiData.name : instantFallback.name;
  const activeBackstory = aiData ? aiData.backstory : instantFallback.backstory;
  const activeClosest = aiData ? aiData.closestPigment : instantFallback.closestPigment;
  const activeConcept = aiData ? aiData.paletteConcept : instantFallback.paletteConcept;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-md flex flex-col h-full">
      {/* Top Banner (Swivel Swatch Card) */}
      <div className="relative p-6 bg-stone-50 flex flex-col items-center justify-center border-b border-stone-200/60 flex-1 min-h-[220px]">
        {/* Swatch card board style */}
        <div className="bg-white p-3 rounded-xl shadow-lg border border-stone-100 w-full max-w-[210px] transform rotate-1 hover:rotate-0 transition-transform duration-300">
          {/* Swatch color fill */}
          <div
            className="w-full h-36 rounded-lg relative overflow-hidden shadow-inner border border-stone-100 flex items-end p-2"
            style={{ backgroundColor: hex }}
          >
            {/* Gloss shine card overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
          </div>
          
          {/* Swatch label */}
          <div className="mt-3.5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Atelier No.</span>
              <span className="text-[10px] font-mono font-bold text-stone-500">
                {rgb.r}-{rgb.g}-{rgb.b}
              </span>
            </div>
            
            <h3 className="font-sans font-bold text-stone-800 text-sm truncate uppercase tracking-tight">
              {activeName}
            </h3>
            
            <div className="flex items-center justify-between text-[11px] font-mono font-medium text-stone-600 border-t border-stone-100 pt-1.5">
              <span>{hex}</span>
              <button
                onClick={handleCopyHex}
                className="text-stone-400 hover:text-stone-700 active:scale-90 transition-all"
                title="Copy HEX"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Curator details and backstory */}
      <div className="p-5 flex-shrink-0 space-y-4">
        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3.5 relative overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-3 text-center">
              <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
              <p className="text-[11px] text-amber-800/80 font-medium mt-1">
                Consulting AI Studio Art Curator...
              </p>
            </div>
          ) : aiData ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider">
                <span className="text-amber-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span>AI Curator Analysis</span>
                </span>
                <span className="text-[8px] text-emerald-700 bg-emerald-100/60 border border-emerald-200 px-1 py-0.5 rounded-md font-sans">
                  ✨ AI Curated
                </span>
              </div>
              <p className="text-xs font-sans italic text-stone-700 leading-relaxed">
                "{activeBackstory}"
              </p>
              <div className="grid grid-cols-2 gap-2 border-t border-amber-200/60 pt-2 mt-2 text-[10px] text-stone-500">
                <div>
                  <span className="font-mono uppercase text-[9px] block text-stone-400">Closest Pigment</span>
                  <span className="font-semibold text-stone-700">{activeClosest}</span>
                </div>
                <div>
                  <span className="font-mono uppercase text-[9px] block text-stone-400">Design Concept</span>
                  <span className="font-semibold text-stone-700">{activeConcept}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider">
                <span className="text-amber-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Curator Analysis</span>
                </span>
                <span className="text-[8px] text-stone-500 bg-stone-100 border border-stone-200 px-1 py-0.5 rounded-md font-sans">
                  Studio Draft
                </span>
              </div>
              <p className="text-xs font-sans italic text-stone-500 leading-relaxed">
                "{activeBackstory}"
              </p>
              <div className="grid grid-cols-2 gap-2 border-t border-amber-200/40 pt-2 mt-1 text-[10px] text-stone-500">
                <div>
                  <span className="font-mono uppercase text-[9px] block text-stone-400">Closest Pigment</span>
                  <span className="font-semibold text-stone-700">{activeClosest}</span>
                </div>
                <div>
                  <span className="font-mono uppercase text-[9px] block text-stone-400">Design Concept</span>
                  <span className="font-semibold text-stone-700">{activeConcept}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-dashed border-amber-200/60 mt-2">
                <button
                  onClick={handleConsultAI}
                  className="w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-semibold rounded-lg text-[10px] flex items-center justify-center gap-1 transition-all shadow-sm"
                >
                  <Sparkles className="w-3 h-3 text-amber-200" />
                  <span>Ask AI Curator for Bespoke Name</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Technical metrics breakdown */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold flex items-center gap-1">
            <Info className="w-3 h-3 text-stone-400" /> Technical Breakdown
          </h4>
          <div className="grid grid-cols-4 gap-2 text-center">
            {/* RGB */}
            <div className="bg-stone-50 border border-stone-200/60 p-1.5 rounded-lg">
              <span className="text-[8px] font-mono font-bold text-stone-400 uppercase block">RGB</span>
              <span className="text-[10px] font-mono text-stone-700 font-semibold block mt-0.5">
                {rgb.r},{rgb.g},{rgb.b}
              </span>
            </div>
            {/* HEX */}
            <div className="bg-stone-50 border border-stone-200/60 p-1.5 rounded-lg">
              <span className="text-[8px] font-mono font-bold text-stone-400 uppercase block">HEX</span>
              <span className="text-[10px] font-mono text-stone-700 font-semibold block mt-0.5">
                {hex}
              </span>
            </div>
            {/* HSL */}
            <div className="bg-stone-50 border border-stone-200/60 p-1.5 rounded-lg">
              <span className="text-[8px] font-mono font-bold text-stone-400 uppercase block">HSL</span>
              <span className="text-[10px] font-mono text-stone-700 font-semibold block mt-0.5">
                {hsl.h}°,{hsl.s}%,{hsl.l}%
              </span>
            </div>
            {/* CMYK */}
            <div className="bg-stone-50 border border-stone-200/60 p-1.5 rounded-lg">
              <span className="text-[8px] font-mono font-bold text-stone-400 uppercase block">CMYK</span>
              <span className="text-[10px] font-mono text-stone-700 font-semibold block mt-0.5">
                {cmyk.c},{cmyk.m},{cmyk.y},{cmyk.k}
              </span>
            </div>
          </div>
        </div>

        {/* Save Palette Action */}
        <button
          onClick={() =>
            onSaveColor({
              hex,
              rgb,
              name: activeName,
              backstory: activeBackstory,
              closestPigment: activeClosest,
              paletteConcept: activeConcept,
            })
          }
          disabled={isAlreadySaved}
          className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold font-sans transition-all border shadow-sm ${
            isAlreadySaved
              ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed"
              : "bg-amber-600 hover:bg-amber-700 text-white border-amber-700 active:scale-95"
          }`}
        >
          {isAlreadySaved ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved in Active Palette</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Add to Palette Collection</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
