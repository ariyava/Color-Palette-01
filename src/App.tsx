import { useState, useEffect } from "react";
import Header from "./components/Header";
import PigmentMixer from "./components/PigmentMixer";
import DigitalMixer from "./components/DigitalMixer";
import ColorInspector from "./components/ColorInspector";
import ComparativePalettes from "./components/ComparativePalettes";
import SavedPalette from "./components/SavedPalette";
import AIMuse from "./components/AIMuse";
import MockupPlayground from "./components/MockupPlayground";

import { SavedColor, MixingConstituent } from "./types";
import { RGB, blendPigments, rgbToHex, hexToRgb } from "./utils/colorMixer";
import { X, HelpCircle, Flame, Sparkles, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [constituents, setConstituents] = useState<MixingConstituent[]>([]);
  const [digitalRgb, setDigitalRgb] = useState<RGB>({ r: 217, g: 119, b: 6 }); // initial warm amber
  const [savedColors, setSavedColors] = useState<SavedColor[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  // Load saved colors from localStorage on boot
  useEffect(() => {
    try {
      const stored = localStorage.getItem("atelier_saved_colors");
      if (stored) {
        setSavedColors(JSON.parse(stored));
      } else {
        // Initialize with 4 beautiful, diverse starter swatches so the Mockups are immediately styled!
        const starters: SavedColor[] = [
          {
            id: "starter-1",
            hex: "#FAF9F6",
            rgb: { r: 250, g: 249, b: 246 },
            name: "Alabaster Whisper",
            backstory: "A soft, luminous shade like early morning frost on linen.",
            closestPigment: "Titanium White",
            paletteConcept: "Airy Canvas Background",
          },
          {
            id: "starter-2",
            hex: "#2E4A62",
            rgb: { r: 46, g: 74, b: 98 },
            name: "Slate Horizon",
            backstory: "The deep, moody indigo of distant waters under a rainy sky.",
            closestPigment: "Ultramarine Blue",
            paletteConcept: "Noble Core Primary",
          },
          {
            id: "starter-3",
            hex: "#C68E17",
            rgb: { r: 198, g: 142, b: 23 },
            name: "Golden Ochre",
            backstory: "A rich, grounded golden-earth tone reminiscent of Tuscany clay.",
            closestPigment: "Yellow Ochre",
            paletteConcept: "Warm Accent Frame",
          },
          {
            id: "starter-4",
            hex: "#D95D39",
            rgb: { r: 217, g: 93, b: 57 },
            name: "Cadmium Ember",
            backstory: "A glowing, vibrant orange spark, intense and full of spirit.",
            closestPigment: "Cadmium Red",
            paletteConcept: "Sizzling Accent Spot",
          },
        ];
        setSavedColors(starters);
        localStorage.setItem("atelier_saved_colors", JSON.stringify(starters));
      }
    } catch (e) {
      console.error("Local storage error:", e);
    }
  }, []);

  // Save changes to localStorage
  const saveToStorage = (updated: SavedColor[]) => {
    setSavedColors(updated);
    try {
      localStorage.setItem("atelier_saved_colors", JSON.stringify(updated));
    } catch (e) {
      console.error("Storage write error:", e);
    }
  };

  // Blending calculations
  const blendedColor = blendPigments(constituents);
  const isPigmentMode = constituents.length > 0;
  
  // Active selected color for the inspector swatches
  const activeRgb = isPigmentMode ? blendedColor.rgb : digitalRgb;
  const activeHex = isPigmentMode ? blendedColor.hex : rgbToHex(digitalRgb);

  // Pigment Mixing cup actions
  const handleAddConstituent = (pigment: { id: string; name: string; hex: string; rgb: RGB }) => {
    setConstituents((prev) => {
      const existing = prev.find((item) => item.id === pigment.id);
      if (existing) {
        // Increment parts
        return prev.map((item) =>
          item.id === pigment.id ? { ...item, parts: Math.min(10, item.parts + 1) } : item
        );
      } else {
        // Add new drops
        return [...prev, { ...pigment, parts: 1 }];
      }
    });
  };

  const handleUpdateParts = (id: string, parts: number) => {
    setConstituents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, parts } : item))
    );
  };

  const handleRemoveConstituent = (id: string) => {
    setConstituents((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearMixer = () => {
    setConstituents([]);
  };

  // Saved Swatches Actions
  const handleSaveColor = (color: {
    hex: string;
    rgb: RGB;
    name: string;
    backstory: string;
    closestPigment: string;
    paletteConcept: string;
  }) => {
    if (savedColors.length >= 12) {
      alert("Atelier limits saved palettes to 12 colors. Please delete an older color swatch first!");
      return;
    }
    
    const newSwatch: SavedColor = {
      ...color,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    const updated = [...savedColors, newSwatch];
    saveToStorage(updated);
  };

  const handleSelectColor = (color: SavedColor) => {
    // Empty the pigment mixing cup first so that the inspector loads this loaded swatch directly!
    setConstituents([]);
    setDigitalRgb(color.rgb);
  };

  const handleDeleteColor = (id: string) => {
    const updated = savedColors.filter((c) => c.id !== id);
    saveToStorage(updated);
  };

  const handleClearPalette = () => {
    if (confirm("Are you sure you want to empty your saved palette?")) {
      saveToStorage([]);
    }
  };

  // Import AI Palette bulk actions
  const handleImportAiPalette = (colors: {
    hex: string;
    name: string;
    backstory: string;
    closestPigment: string;
    paletteConcept: string;
  }[]) => {
    // Cap at 12 total items
    const availableSlots = Math.max(0, 12 - savedColors.length);
    if (availableSlots === 0) {
      alert("Atelier limits saved palettes to 12 colors. Please delete older colors to make room!");
      return;
    }

    const toImport = colors.slice(0, availableSlots).map((c) => ({
      ...c,
      rgb: hexToRgb(c.hex),
      id: Math.random().toString(36).substr(2, 9),
    }));

    const updated = [...savedColors, ...toImport];
    saveToStorage(updated);

    if (colors.length > availableSlots) {
      alert(`Imported ${availableSlots} colors! (Capped at 12 total slots)`);
    }
  };

  // Pour digital fine-tuner color into the mixer
  const handlePourDigitalColorIntoCup = (pigment: { name: string; hex: string; rgb: RGB }) => {
    const customId = `digital-${Date.now()}`;
    handleAddConstituent({
      id: customId,
      name: pigment.name,
      hex: pigment.hex,
      rgb: pigment.rgb,
    });
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col text-stone-800">
      <Header onShowHelp={() => setShowHelp(true)} />

      {/* Main Studio Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Top Section: Mixer Boards and Card Swatches Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1 & 2: Active Mixers (Pigment Studio & Digital fine tuner) */}
          <div className="lg:col-span-2 space-y-6">
            <PigmentMixer
              constituents={constituents}
              onUpdateParts={handleUpdateParts}
              onRemoveConstituent={handleRemoveConstituent}
              onAddConstituent={handleAddConstituent}
              onClearMixer={handleClearMixer}
              blendedHex={activeHex}
              savedColors={savedColors}
            />

            <DigitalMixer
              currentRgb={digitalRgb}
              onUpdateColor={setDigitalRgb}
              onPourDigitalColorIntoCup={handlePourDigitalColorIntoCup}
            />
          </div>

          {/* Column 3: Custom Swatch Inspector */}
          <div className="lg:col-span-1">
            <ColorInspector
              hex={activeHex}
              rgb={activeRgb}
              onSaveColor={handleSaveColor}
              savedColors={savedColors}
            />
          </div>

        </div>

        {/* Mid-section split boards */}
        <div className="grid grid-cols-1 gap-6">
          {/* Comparative Palette Matrix */}
          <ComparativePalettes
            activeRgb={activeRgb}
            activeHex={activeHex}
            onSelectColor={handleSelectColor}
            onInjectIntoMixer={handleAddConstituent}
            onSaveColor={handleSaveColor}
          />

          {/* Saved Swatches Showcase */}
          <SavedPalette
            savedColors={savedColors}
            onSelectColor={handleSelectColor}
            onDeleteColor={handleDeleteColor}
            onClearPalette={handleClearPalette}
          />

          {/* AI Color Muse Theme generator */}
          <AIMuse
            onImportPalette={handleImportAiPalette}
            savedColorsCount={savedColors.length}
          />

          {/* Mockup visualization frame */}
          <MockupPlayground savedColors={savedColors} />
        </div>
      </main>

      {/* Decorative footer details */}
      <footer className="border-t border-stone-200 py-6 text-center text-xs font-mono text-stone-400 mt-12 bg-stone-50">
        <p>© 2026 Atelier Color Studio • Handcrafted Subtractive Blend Core</p>
      </footer>

      {/* Satisfying Artistic Mixing Guide Modal Popup */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xl w-full max-w-lg overflow-hidden relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowHelp(false)}
                className="absolute top-4 right-4 p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title */}
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                <h3 className="font-sans font-bold text-stone-900 text-base uppercase tracking-wider">
                  The Artist's Mixing Guide
                </h3>
              </div>

              {/* Content body */}
              <div className="space-y-4 text-xs text-stone-600 font-sans leading-relaxed">
                <div>
                  <h4 className="font-semibold text-stone-800 uppercase tracking-wide text-[11px] mb-1">
                    🎨 Subtractive Pigment Blending (Real Paint)
                  </h4>
                  <p>
                    Unlike computer monitors that use additive **RGB** light (where Red + Green = Yellow), physical painting pigments mix **subtractively** because paint absorbs light wavelengths. 
                  </p>
                  <p className="mt-1.5">
                    Our Atelier algorithm maps digital hues to physical constituents to mimic natural oils:
                  </p>
                  <ul className="list-disc pl-4 mt-1 space-y-1">
                    <li>**Red + Yellow** blends into organic, earthy Orange.</li>
                    <li>**Blue + Yellow** mixes into clean, natural Emerald and Moss Greens.</li>
                    <li>**Titanium White** does not just brighten; it dilutes color coverage, making pastels and tints.</li>
                    <li>**Ivory Black** provides gradual shading, giving deep warm undertones.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-stone-800 uppercase tracking-wide text-[11px] mb-1">
                    🖌️ Pouring and Recyling Custom Blends
                  </h4>
                  <p>
                    You can mix your own custom colors and click **"Save to Palette Collection"**. Once saved, you can click on any saved swatch to instantly select it, or click **"Pour Into Cup"** in the digital fine-tuner to use your newly mixed color as a starting paint!
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-stone-800 uppercase tracking-wide text-[11px] mb-1">
                    ✨ AI Curator & Visual Playground
                  </h4>
                  <p>
                    Every time you mix a color, our Gemini AI analyzes its characteristics, giving it an evocative name and backstory. You can then project your saved colors directly onto geometric poster mockups, vector room renders, and user interfaces!
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setShowHelp(false)}
                className="w-full mt-6 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl text-xs transition-colors"
              >
                Let's Paint
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
