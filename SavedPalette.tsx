import React, { useState } from "react";
import { SavedColor } from "../types";
import { Trash2, Copy, Download, ExternalLink, Sparkles, Layout, Palette, Code, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SavedPaletteProps {
  savedColors: SavedColor[];
  onSelectColor: (color: SavedColor) => void;
  onDeleteColor: (id: string) => void;
  onClearPalette: () => void;
}

export default function SavedPalette({
  savedColors,
  onSelectColor,
  onDeleteColor,
  onClearPalette,
}: SavedPaletteProps) {
  const [exportMode, setExportMode] = useState<'none' | 'css' | 'tailwind' | 'svg'>('none');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopySingleHex = (hex: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent loaded selector trigger
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
  };

  // Export formats generators
  const getCssVariables = () => {
    return `:root {\n` + 
      savedColors.map((c, i) => `  --color-palette-${i + 1}: ${c.hex}; /* ${c.name} */`).join('\n') +
      `\n}`;
  };

  const getTailwindJson = () => {
    const config: Record<string, string> = {};
    savedColors.forEach((c, i) => {
      const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      config[slug] = c.hex;
    });
    return JSON.stringify({ theme: { extend: { colors: config } } }, null, 2);
  };

  const getSvgCode = () => {
    const width = 500;
    const height = 120;
    const blockWidth = width / Math.max(1, savedColors.length);

    let blocks = '';
    let text = '';

    savedColors.forEach((c, i) => {
      blocks += `  <rect x="${i * blockWidth}" y="0" width="${blockWidth}" height="80" fill="${c.hex}" />\n`;
      text += `  <text x="${i * blockWidth + 10}" y="100" font-family="sans-serif" font-size="10" fill="#333333" font-weight="bold">${c.name}</text>\n` +
              `  <text x="${i * blockWidth + 10}" y="112" font-family="monospace" font-size="9" fill="#666666">${c.hex}</text>\n`;
    });

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">\n` +
      `  <!-- Background plate -->\n` +
      `  <rect width="${width}" height="${height}" fill="#f5f5f4" rx="12" />\n` +
      blocks +
      text +
      `</svg>`;
  };

  const handleCopyExportText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied('export');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-stone-800 font-sans font-semibold text-sm flex items-center gap-1.5 uppercase tracking-wider">
            <Palette className="w-4 h-4 text-emerald-600" />
            Your Palette Collection
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Saved swatches ({savedColors.length}/12 slots)
          </p>
        </div>

        {savedColors.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExportMode(exportMode === 'none' ? 'css' : 'none')}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-stone-400 text-stone-700 transition-all shadow-sm"
            >
              <Code className="w-3.5 h-3.5 text-stone-500" />
              <span>Export Code</span>
            </button>
            <button
              onClick={onClearPalette}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>

      {/* Export Accordion Panel */}
      <AnimatePresence>
        {exportMode !== 'none' && savedColors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 bg-white border border-stone-200 rounded-xl overflow-hidden shadow-inner"
          >
            <div className="flex border-b border-stone-100 bg-stone-50 p-2 text-xs font-medium">
              {(['css', 'tailwind', 'svg'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setExportMode(mode)}
                  className={`px-3 py-1 rounded-md transition-all uppercase font-mono text-[10px] tracking-wider font-bold ${
                    exportMode === mode
                      ? 'bg-stone-800 text-white'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {mode === 'css' ? 'CSS Variables' : mode === 'tailwind' ? 'Tailwind Config' : 'SVG Vector'}
                </button>
              ))}
            </div>
            
            <div className="p-3.5 relative">
              <pre className="text-[10px] font-mono text-stone-600 overflow-x-auto max-h-[120px] bg-stone-50 p-2.5 rounded-lg border border-stone-200/50">
                {exportMode === 'css' && getCssVariables()}
                {exportMode === 'tailwind' && getTailwindJson()}
                {exportMode === 'svg' && getSvgCode()}
              </pre>

              <button
                onClick={() =>
                  handleCopyExportText(
                    exportMode === 'css'
                      ? getCssVariables()
                      : exportMode === 'tailwind'
                      ? getTailwindJson()
                      : getSvgCode()
                  )
                }
                className="absolute top-6 right-6 p-1.5 rounded-md bg-white border border-stone-200 hover:border-stone-400 text-stone-600 shadow-sm transition-all hover:scale-105 active:scale-95"
                title="Copy full code"
              >
                {copied === 'export' ? (
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 px-1">
                    <Check className="w-3 h-3" /> Copied!
                  </span>
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Palette Swatches List */}
      {savedColors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 border border-dashed border-stone-300 rounded-xl bg-white">
          <Palette className="w-8 h-8 text-stone-300 mb-2" />
          <p className="text-xs text-stone-500 font-medium font-sans">No saved colors in your studio collection yet</p>
          <p className="text-[10px] text-stone-400 mt-0.5">Use the mixers above to create and save colors!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3.5">
          <AnimatePresence initial={false}>
            {savedColors.map((sc, idx) => (
              <motion.div
                key={sc.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.18, delay: idx * 0.02 }}
                onClick={() => onSelectColor(sc)}
                className="group relative bg-white border border-stone-200 rounded-xl overflow-hidden hover:border-stone-400 hover:shadow-md cursor-pointer transition-all flex flex-col h-[130px]"
              >
                {/* Visual Swatch */}
                <div
                  className="h-[60%] w-full relative flex items-start justify-end p-1.5"
                  style={{ backgroundColor: sc.hex }}
                >
                  {/* Copy button overlay */}
                  <button
                    onClick={(e) => handleCopySingleHex(sc.hex, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md bg-white/90 backdrop-blur-sm text-stone-700 hover:scale-110 active:scale-95 shadow-sm transition-all duration-200"
                    title="Copy hex code"
                  >
                    {copied === sc.hex ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                {/* Swatch labels */}
                <div className="p-2 flex-1 flex flex-col justify-between min-w-0 bg-white">
                  <p className="text-[11px] font-bold text-stone-800 font-sans truncate leading-tight">
                    {sc.name}
                  </p>
                  
                  <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-stone-400">
                    <span>{sc.hex}</span>
                    
                    {/* Delete item */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteColor(sc.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-500 transition-opacity p-0.5"
                      title="Throw away swatch"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
