import React, { useState, useEffect } from "react";
import { RGB, rgbToHex, hexToRgb, rgbToHsl, HSL } from "../utils/colorMixer";
import { Sliders, RefreshCw, Sparkles } from "lucide-react";

interface DigitalMixerProps {
  currentRgb: RGB;
  onUpdateColor: (rgb: RGB) => void;
  onPourDigitalColorIntoCup: (pigment: { name: string; hex: string; rgb: RGB }) => void;
}

export default function DigitalMixer({
  currentRgb,
  onUpdateColor,
  onPourDigitalColorIntoCup,
}: DigitalMixerProps) {
  const [rgb, setRgb] = useState<RGB>(currentRgb);
  const [hsl, setHsl] = useState<HSL>(rgbToHsl(currentRgb));
  const [hex, setHex] = useState<string>(rgbToHex(currentRgb));
  const [activeTab, setActiveTab] = useState<'hsl' | 'rgb'>('hsl');

  // Sync internal state when external currentRgb changes
  useEffect(() => {
    setRgb(currentRgb);
    setHsl(rgbToHsl(currentRgb));
    setHex(rgbToHex(currentRgb));
  }, [currentRgb]);

  const handleRgbChange = (channel: keyof RGB, value: number) => {
    const newRgb = { ...rgb, [channel]: value };
    setRgb(newRgb);
    setHex(rgbToHex(newRgb));
    setHsl(rgbToHsl(newRgb));
    onUpdateColor(newRgb);
  };

  const handleHslChange = (channel: keyof HSL, value: number) => {
    const newHsl = { ...hsl, [channel]: value };
    setHsl(newHsl);
    
    // Convert HSL back to RGB
    const h = newHsl.h / 360;
    const s = newHsl.s / 100;
    const l = newHsl.l / 100;

    let r = l;
    let g = l;
    let b = l;

    if (s !== 0) {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      const hue2rgb = (t: number) => {
        let val = t;
        if (val < 0) val += 1;
        if (val > 1) val -= 1;
        if (val < 1/6) return p + (q - p) * 6 * val;
        if (val < 1/2) return q;
        if (val < 2/3) return p + (q - p) * (2/3 - val) * 6;
        return p;
      };

      r = hue2rgb(h + 1/3);
      g = hue2rgb(h);
      b = hue2rgb(h - 1/3);
    }

    const newRgb = {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };

    setRgb(newRgb);
    setHex(rgbToHex(newRgb));
    onUpdateColor(newRgb);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHex(value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      const newRgb = hexToRgb(value);
      setRgb(newRgb);
      setHsl(rgbToHsl(newRgb));
      onUpdateColor(newRgb);
    }
  };

  const presetPastels = [
    { name: 'Peach', hex: '#FFD1B3' },
    { name: 'Sage', hex: '#B5C9C3' },
    { name: 'Lavender', hex: '#E2D1F9' },
    { name: 'Sky', hex: '#B5E2FA' },
    { name: 'Clay', hex: '#D5A6BD' },
    { name: 'Ochre', hex: '#E6C280' },
  ];

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 shadow-sm h-full flex flex-col justify-between">
      <div>
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-stone-800 font-sans font-semibold text-sm flex items-center gap-1.5 uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-indigo-500" />
              Digital Fine-Tuner
            </h2>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              Select precise values or tweak current mixed swatch
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-stone-200 mb-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('hsl')}
            className={`pb-2 px-3 border-b-2 transition-all ${
              activeTab === 'hsl'
                ? 'border-stone-800 text-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-600'
            }`}
          >
            HSL Model
          </button>
          <button
            onClick={() => setActiveTab('rgb')}
            className={`pb-2 px-3 border-b-2 transition-all ${
              activeTab === 'rgb'
                ? 'border-stone-800 text-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-600'
            }`}
          >
            RGB Model
          </button>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {activeTab === 'hsl' ? (
            <div className="space-y-3.5">
              {/* Hue */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-sans">
                  <span className="text-stone-600 font-medium">Hue</span>
                  <span className="text-stone-500 font-mono font-bold">{hsl.h}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hsl.h}
                  onChange={(e) => handleHslChange('h', parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer border border-stone-200"
                  style={{
                    background: "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)"
                  }}
                />
              </div>

              {/* Saturation */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-sans">
                  <span className="text-stone-600 font-medium">Saturation</span>
                  <span className="text-stone-500 font-mono font-bold">{hsl.s}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hsl.s}
                  onChange={(e) => handleHslChange('s', parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer border border-stone-200"
                  style={{
                    background: `linear-gradient(to right, #808080 0%, ${rgbToHex({ r: rgb.r, g: rgb.g, b: rgb.b })} 100%)`
                  }}
                />
              </div>

              {/* Lightness */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-sans">
                  <span className="text-stone-600 font-medium">Lightness</span>
                  <span className="text-stone-500 font-mono font-bold">{hsl.l}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hsl.l}
                  onChange={(e) => handleHslChange('l', parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer border border-stone-200"
                  style={{
                    background: "linear-gradient(to right, #000000 0%, #808080 50%, #ffffff 100%)"
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {/* Red */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-sans">
                  <span className="text-stone-600 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Red
                  </span>
                  <span className="text-stone-500 font-mono font-bold">{rgb.r}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgb.r}
                  onChange={(e) => handleRgbChange('r', parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer border border-stone-200"
                  style={{
                    background: `linear-gradient(to right, #000000 0%, #ff0000 100%)`
                  }}
                />
              </div>

              {/* Green */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-sans">
                  <span className="text-stone-600 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Green
                  </span>
                  <span className="text-stone-500 font-mono font-bold">{rgb.g}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgb.g}
                  onChange={(e) => handleRgbChange('g', parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer border border-stone-200"
                  style={{
                    background: `linear-gradient(to right, #000000 0%, #00ff00 100%)`
                  }}
                />
              </div>

              {/* Blue */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-sans">
                  <span className="text-stone-600 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Blue
                  </span>
                  <span className="text-stone-500 font-mono font-bold">{rgb.b}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgb.b}
                  onChange={(e) => handleRgbChange('b', parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer border border-stone-200"
                  style={{
                    background: `linear-gradient(to right, #000000 0%, #0000ff 100%)`
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* HEX Input Box & Presets */}
        <div className="mt-4 flex gap-3">
          <div className="flex-1">
            <label className="block text-[10px] uppercase font-mono font-bold text-stone-400 mb-1">
              HEX Code
            </label>
            <input
              type="text"
              value={hex}
              onChange={handleHexChange}
              maxLength={7}
              placeholder="#FFFFFF"
              className="w-full px-3 py-1.5 font-mono text-xs rounded-xl border border-stone-200 text-stone-800 bg-white shadow-inner focus:outline-none focus:border-stone-400 text-center uppercase"
            />
          </div>

          <div className="flex-1 flex flex-col justify-end">
            <button
              onClick={() => onPourDigitalColorIntoCup({ name: 'Fine-Tuned Ink', hex, rgb })}
              className="w-full py-1.5 px-2 bg-stone-800 hover:bg-stone-900 active:scale-95 text-white text-[11px] font-semibold font-sans rounded-xl flex items-center justify-center gap-1 transition-all shadow-sm"
              title="Pour this color into the pigment mixer as custom paint"
            >
              <RefreshCw className="w-3 h-3" />
              Pour Into Cup
            </button>
          </div>
        </div>
      </div>

      {/* Quick Color Presets */}
      <div className="mt-4 pt-3 border-t border-stone-100">
        <h4 className="text-[10px] uppercase font-mono font-bold text-stone-400 mb-1.5 tracking-wider">
          Digital Swatch Inspiration
        </h4>
        <div className="grid grid-cols-6 gap-1.5">
          {presetPastels.map((preset) => (
            <button
              key={preset.hex}
              onClick={() => {
                const rgbVal = hexToRgb(preset.hex);
                setRgb(rgbVal);
                setHex(preset.hex);
                setHsl(rgbToHsl(rgbVal));
                onUpdateColor(rgbVal);
              }}
              className="w-full aspect-square rounded-lg border border-stone-200 relative group shadow-sm transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: preset.hex }}
              title={`${preset.name} (${preset.hex})`}
            >
              <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/10 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
