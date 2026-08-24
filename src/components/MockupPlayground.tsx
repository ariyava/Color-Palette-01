import { useState, useEffect } from "react";
import { SavedColor } from "../types";
import { Layout, Palette, Heart, RefreshCw, Sun, BookOpen, Monitor, Sparkles } from "lucide-react";

interface MockupPlaygroundProps {
  savedColors: SavedColor[];
}

export default function MockupPlayground({ savedColors }: MockupPlaygroundProps) {
  const [activeMockup, setActiveMockup] = useState<'poster' | 'website' | 'room' | 'dashboard'>('poster');
  
  // Mapping roles to saved color indices
  const [bgIdx, setBgIdx] = useState(0);
  const [primaryIdx, setPrimaryIdx] = useState(1);
  const [secondaryIdx, setSecondaryIdx] = useState(2);
  const [accentIdx, setAccentIdx] = useState(3);
  const [textIdx, setTextIdx] = useState(4);

  // Auto-map roles when saved colors change length
  useEffect(() => {
    if (savedColors.length > 0) {
      setBgIdx(0);
      setPrimaryIdx(Math.min(1, savedColors.length - 1));
      setSecondaryIdx(Math.min(2, savedColors.length - 1));
      setAccentIdx(Math.min(3, savedColors.length - 1));
      setTextIdx(Math.min(4, savedColors.length - 1));
    }
  }, [savedColors.length]);

  // Fallback defaults if not enough colors are saved
  const defaultColors = {
    bg: '#FAF9F6',      // soft off-white
    primary: '#1E293B', // Slate 800
    secondary: '#E2E8F0', // Slate 200
    accent: '#D97706',    // Amber 600
    text: '#0F172A',      // Slate 900
  };

  const getMappedColor = (role: 'bg' | 'primary' | 'secondary' | 'accent' | 'text') => {
    if (savedColors.length === 0) return defaultColors[role];
    
    switch (role) {
      case 'bg':
        return savedColors[bgIdx]?.hex || defaultColors.bg;
      case 'primary':
        return savedColors[primaryIdx]?.hex || defaultColors.primary;
      case 'secondary':
        return savedColors[secondaryIdx]?.hex || defaultColors.secondary;
      case 'accent':
        return savedColors[accentIdx]?.hex || defaultColors.accent;
      case 'text':
        return savedColors[textIdx]?.hex || defaultColors.text;
    }
  };

  const colorBg = getMappedColor('bg');
  const colorPrimary = getMappedColor('primary');
  const colorSecondary = getMappedColor('secondary');
  const colorAccent = getMappedColor('accent');
  const colorText = getMappedColor('text');

  // Quick swap layout helper
  const handleShuffleRoles = () => {
    if (savedColors.length < 2) return;
    const pool = Array.from({ length: savedColors.length }, (_, i) => i);
    const shuffled = pool.sort(() => Math.random() - 0.5);
    setBgIdx(shuffled[0] || 0);
    setPrimaryIdx(shuffled[1] || 0);
    setSecondaryIdx(shuffled[2] % savedColors.length);
    setAccentIdx(shuffled[3] % savedColors.length);
    setTextIdx(shuffled[4] % savedColors.length);
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-stone-800 font-sans font-semibold text-sm flex items-center gap-1.5 uppercase tracking-wider">
            <Layout className="w-4 h-4 text-indigo-600" />
            Mockup Playground
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Visualize your palette live on physical prints and mockups
          </p>
        </div>

        {savedColors.length > 1 && (
          <button
            onClick={handleShuffleRoles}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-stone-400 text-stone-700 transition-all shadow-sm active:scale-95"
            title="Randomly assign saved colors to layout roles"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Shuffle Roles</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left column: Role assignment matrix */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-stone-200/80 rounded-xl p-4">
            <h3 className="text-xs font-bold text-stone-700 font-sans mb-3 uppercase tracking-wider flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-stone-400" /> Layout Role Mapping
            </h3>
            
            {savedColors.length === 0 ? (
              <p className="text-[11px] text-stone-400 italic">
                Save some colors in your Palette Collection above to customize role assignments.
              </p>
            ) : (
              <div className="space-y-3">
                {/* Background Role */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-stone-600 font-sans w-20">Canvas Bg</span>
                  <select
                    value={bgIdx}
                    onChange={(e) => setBgIdx(parseInt(e.target.value))}
                    className="flex-1 px-2.5 py-1 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none"
                  >
                    {savedColors.map((c, i) => (
                      <option key={c.id} value={i}>
                        {c.name} ({c.hex})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Primary Role */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-stone-600 font-sans w-20">Primary</span>
                  <select
                    value={primaryIdx}
                    onChange={(e) => setPrimaryIdx(parseInt(e.target.value))}
                    className="flex-1 px-2.5 py-1 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none"
                  >
                    {savedColors.map((c, i) => (
                      <option key={c.id} value={i}>
                        {c.name} ({c.hex})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Secondary Role */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-stone-600 font-sans w-20">Secondary</span>
                  <select
                    value={secondaryIdx}
                    onChange={(e) => setSecondaryIdx(parseInt(e.target.value))}
                    className="flex-1 px-2.5 py-1 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none"
                  >
                    {savedColors.map((c, i) => (
                      <option key={c.id} value={i}>
                        {c.name} ({c.hex})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Accent Role */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-stone-600 font-sans w-20">Accent</span>
                  <select
                    value={accentIdx}
                    onChange={(e) => setAccentIdx(parseInt(e.target.value))}
                    className="flex-1 px-2.5 py-1 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none"
                  >
                    {savedColors.map((c, i) => (
                      <option key={c.id} value={i}>
                        {c.name} ({c.hex})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Text Role */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-stone-600 font-sans w-20">Neutral Text</span>
                  <select
                    value={textIdx}
                    onChange={(e) => setTextIdx(parseInt(e.target.value))}
                    className="flex-1 px-2.5 py-1 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none"
                  >
                    {savedColors.map((c, i) => (
                      <option key={c.id} value={i}>
                        {c.name} ({c.hex})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Quick color indicator row */}
          <div className="p-3 bg-white border border-stone-200/80 rounded-xl space-y-2">
            <h4 className="text-[10px] uppercase font-mono font-bold text-stone-400">Current Role Values</h4>
            <div className="grid grid-cols-5 gap-1 text-center">
              <div>
                <div className="h-6 w-full rounded border border-stone-200" style={{ backgroundColor: colorBg }} />
                <span className="text-[8px] font-mono text-stone-400">Bg</span>
              </div>
              <div>
                <div className="h-6 w-full rounded border border-stone-200" style={{ backgroundColor: colorPrimary }} />
                <span className="text-[8px] font-mono text-stone-400">Prim</span>
              </div>
              <div>
                <div className="h-6 w-full rounded border border-stone-200" style={{ backgroundColor: colorSecondary }} />
                <span className="text-[8px] font-mono text-stone-400">Sec</span>
              </div>
              <div>
                <div className="h-6 w-full rounded border border-stone-200" style={{ backgroundColor: colorAccent }} />
                <span className="text-[8px] font-mono text-stone-400">Acc</span>
              </div>
              <div>
                <div className="h-6 w-full rounded border border-stone-200" style={{ backgroundColor: colorText }} />
                <span className="text-[8px] font-mono text-stone-400">Text</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: The active mockup visual container */}
        <div className="lg:col-span-8 flex flex-col bg-stone-100 rounded-xl p-4 border border-stone-200">
          {/* Tabs for active mockup */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-stone-200 pb-3 mb-4 text-xs font-medium">
            <button
              onClick={() => setActiveMockup('poster')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                activeMockup === 'poster'
                  ? 'bg-stone-800 text-white font-semibold'
                  : 'text-stone-500 hover:text-stone-800 bg-white border border-stone-200 hover:border-stone-300'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Bauhaus Poster</span>
            </button>
            <button
              onClick={() => setActiveMockup('website')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                activeMockup === 'website'
                  ? 'bg-stone-800 text-white font-semibold'
                  : 'text-stone-500 hover:text-stone-800 bg-white border border-stone-200 hover:border-stone-300'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Minimal Hero</span>
            </button>
            <button
              onClick={() => setActiveMockup('room')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                activeMockup === 'room'
                  ? 'bg-stone-800 text-white font-semibold'
                  : 'text-stone-500 hover:text-stone-800 bg-white border border-stone-200 hover:border-stone-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Cozy Atelier Room</span>
            </button>
            <button
              onClick={() => setActiveMockup('dashboard')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                activeMockup === 'dashboard'
                  ? 'bg-stone-800 text-white font-semibold'
                  : 'text-stone-500 hover:text-stone-800 bg-white border border-stone-200 hover:border-stone-300'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Mobile UI</span>
            </button>
          </div>

          {/* Active Stage */}
          <div className="flex-1 flex justify-center items-center min-h-[340px]">
            
            {/* 1. BAUHAUS POSTER MOCKUP */}
            {activeMockup === 'poster' && (
              <div 
                className="w-[280px] h-[380px] bg-white rounded-xl shadow-lg border border-stone-200 p-5 flex flex-col justify-between select-none relative overflow-hidden"
                style={{ backgroundColor: colorBg }}
              >
                {/* Vintage overlay texture */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                
                {/* Header */}
                <div className="flex justify-between items-start z-10">
                  <h4 className="font-sans font-bold text-xs uppercase tracking-widest" style={{ color: colorText }}>
                    Atelier Series
                  </h4>
                  <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-stone-400" style={{ color: colorPrimary }}>
                    No. 42
                  </span>
                </div>

                {/* Main Abstract Design composition */}
                <div className="relative w-full h-[200px] my-auto flex items-center justify-center">
                  {/* Huge Arch */}
                  <div 
                    className="absolute bottom-4 w-28 h-40 rounded-t-full shadow-md transform -rotate-6 origin-bottom transition-all"
                    style={{ backgroundColor: colorPrimary }}
                  />
                  {/* Circle */}
                  <div 
                    className="absolute top-8 left-12 w-20 h-20 rounded-full shadow-md mix-blend-multiply opacity-90 transition-all"
                    style={{ backgroundColor: colorAccent }}
                  />
                  {/* Secondary diagonal slide */}
                  <div 
                    className="absolute bottom-6 right-8 w-24 h-12 rounded-lg transform rotate-12 opacity-80 mix-blend-screen transition-all"
                    style={{ backgroundColor: colorSecondary }}
                  />
                  {/* Geometric core rod */}
                  <div 
                    className="absolute bottom-0 w-2 h-44 rounded-full opacity-40"
                    style={{ backgroundColor: colorText }}
                  />
                </div>

                {/* Footer details */}
                <div className="border-t pt-3 flex justify-between items-end z-10" style={{ borderColor: `${colorText}20` }}>
                  <div>
                    <h5 className="font-sans font-bold text-sm tracking-tight" style={{ color: colorText }}>
                      KANDINSKY STUDY
                    </h5>
                    <p className="text-[9px] font-medium" style={{ color: `${colorText}70` }}>
                      SUBTRACTIVE BLENDS IN CHROMA
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[9px] font-bold block" style={{ color: colorAccent }}>
                      {colorAccent}
                    </span>
                    <span className="font-mono text-[7px] text-stone-400 block">
                      {colorBg}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. WEBPAGE HERO MOCKUP */}
            {activeMockup === 'website' && (
              <div 
                className="w-full max-w-[480px] aspect-[1.58] bg-stone-50 rounded-xl shadow-lg border border-stone-200 flex flex-col overflow-hidden text-stone-800 transition-colors"
                style={{ backgroundColor: colorBg }}
              >
                {/* Browser top-bar */}
                <div className="bg-stone-200/60 px-3 py-2 flex items-center gap-1.5 border-b border-stone-200">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <div className="bg-white/90 text-[8px] font-mono px-4 py-0.5 rounded-md flex-1 text-center max-w-[150px] truncate text-stone-400">
                    {colorBg}
                  </div>
                </div>

                {/* Hero Body */}
                <div className="p-6 flex-1 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="space-y-3 flex-1 text-left">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider" style={{ backgroundColor: colorSecondary, color: colorText }}>
                      Design Atelier
                    </span>
                    <h3 className="font-sans font-bold text-lg md:text-xl leading-tight tracking-tight" style={{ color: colorPrimary }}>
                      Shape atmosphere with custom pigments.
                    </h3>
                    <p className="text-[10px] leading-relaxed max-w-[200px]" style={{ color: `${colorText}80` }}>
                      Formulating the perfect hues for visual narratives, spaces, and digital canvases.
                    </p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-[9px] font-bold text-white rounded-lg shadow transition-transform hover:scale-105" style={{ backgroundColor: colorAccent }}>
                        Squeeze Paint
                      </button>
                      <button className="px-3 py-1.5 text-[9px] font-bold rounded-lg border transition-transform hover:scale-105" style={{ borderColor: `${colorPrimary}40`, color: colorPrimary }}>
                        Gallery
                      </button>
                    </div>
                  </div>

                  {/* Visual card */}
                  <div className="w-28 h-28 rounded-xl p-3 flex flex-col justify-between shadow-md transition-all" style={{ backgroundColor: colorSecondary }}>
                    <div className="flex justify-between items-center">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colorAccent }} />
                      <span className="text-[8px] font-mono" style={{ color: colorText }}>🎨 palette</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-16 rounded" style={{ backgroundColor: `${colorText}20` }} />
                      <div className="h-2.5 w-20 rounded" style={{ backgroundColor: colorPrimary }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. COZY ATELIER ROOM ILLUSTRATION */}
            {activeMockup === 'room' && (
              <div 
                className="w-[340px] h-[250px] bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden relative"
                style={{ backgroundColor: colorBg }} // wall color
              >
                {/* Wall painting */}
                <div className="absolute top-6 left-12 w-16 h-20 bg-stone-100 rounded border-2 border-stone-800 p-1 shadow-sm">
                  <div className="w-full h-full rounded bg-stone-50 overflow-hidden relative flex flex-col justify-end p-1">
                    {/* Tiny collage of palette shapes */}
                    <div className="absolute -top-1 -right-1 w-10 h-10 rounded-full" style={{ backgroundColor: colorSecondary }} />
                    <div className="absolute top-4 left-2 w-8 h-8 rounded-full" style={{ backgroundColor: colorAccent }} />
                    <div className="absolute bottom-2 right-1 w-12 h-6" style={{ backgroundColor: colorPrimary }} />
                    <span className="text-[5px] font-mono font-bold leading-none z-10 text-stone-900">CHROMA</span>
                  </div>
                </div>

                {/* Cozy Sofa */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[220px] h-24 z-10 select-none">
                  {/* Backrest cushion */}
                  <div className="absolute bottom-10 left-4 right-4 h-12 rounded-t-2xl shadow-sm" style={{ backgroundColor: colorPrimary }} />
                  {/* Seat cushion */}
                  <div className="absolute bottom-3 left-2 right-2 h-10 rounded-xl shadow-md border-b-2 border-black/10" style={{ backgroundColor: colorPrimary }} />
                  {/* Left Armrest */}
                  <div className="absolute bottom-3 left-0 w-6 h-14 rounded-l-xl rounded-t-lg shadow" style={{ backgroundColor: colorPrimary }} />
                  {/* Right Armrest */}
                  <div className="absolute bottom-3 right-0 w-6 h-14 rounded-r-xl rounded-t-lg shadow" style={{ backgroundColor: colorPrimary }} />
                  {/* Sofa legs */}
                  <div className="absolute bottom-0 left-6 w-1.5 h-4 bg-stone-800 rounded-b" />
                  <div className="absolute bottom-0 right-6 w-1.5 h-4 bg-stone-800 rounded-b" />
                  
                  {/* Decorative pillows */}
                  <div className="absolute bottom-9 left-10 w-8 h-8 rounded-lg transform -rotate-12 shadow-sm border border-black/5" style={{ backgroundColor: colorAccent }} />
                  <div className="absolute bottom-9 right-12 w-7 h-7 rounded-lg transform rotate-6 shadow-sm border border-black/5" style={{ backgroundColor: colorSecondary }} />
                </div>

                {/* Designer Lamp */}
                <div className="absolute bottom-4 right-6 w-12 h-44 z-20">
                  {/* Lamp Stand */}
                  <div className="absolute bottom-0 left-5 w-1 h-36 bg-stone-900" />
                  <div className="absolute bottom-0 left-2 w-7 h-1 bg-stone-900 rounded" />
                  {/* Lamp Shade */}
                  <div 
                    className="absolute top-4 left-2 w-7 h-6 rounded-t-md shadow-sm transform -rotate-12"
                    style={{ backgroundColor: colorAccent }}
                  />
                  {/* Lamp Glow */}
                  <div className="absolute top-10 left-0 w-11 h-14 bg-gradient-to-b from-yellow-300/30 to-transparent clip-path-glow pointer-events-none" />
                </div>

                {/* Wooden floorboard strip */}
                <div className="absolute bottom-0 inset-x-0 h-4 bg-amber-800/10 border-t border-stone-200" />
              </div>
            )}

            {/* 4. MOBILE DASHBOARD MOCKUP */}
            {activeMockup === 'dashboard' && (
              <div 
                className="w-[200px] h-[340px] bg-stone-950 rounded-[32px] border-4 border-stone-800 shadow-xl p-3 select-none flex flex-col justify-between overflow-hidden relative"
                style={{ backgroundColor: colorBg }}
              >
                {/* Phone notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-stone-800 rounded-b-xl z-20" />

                {/* Phone Header */}
                <div className="flex justify-between items-center mt-2.5 z-10 px-1">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colorSecondary }} />
                  <span className="text-[8px] font-sans font-bold" style={{ color: colorText }}>Atelier Pay</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {/* Credit card section */}
                <div className="my-auto space-y-3 px-1">
                  {/* Credit Card */}
                  <div 
                    className="w-full h-24 rounded-2xl p-3 flex flex-col justify-between shadow-lg relative overflow-hidden text-white"
                    style={{ backgroundColor: colorPrimary }}
                  >
                    {/* card swirl decoration */}
                    <div className="absolute -right-2 -top-2 w-16 h-16 rounded-full bg-white/5" />
                    
                    <div className="flex justify-between items-start">
                      <span className="text-[7px] font-mono tracking-widest opacity-85">PLATINUM BLEND</span>
                      <Sparkles className="w-3.5 h-3.5" style={{ color: colorAccent }} />
                    </div>
                    
                    <div>
                      <span className="text-[6px] block opacity-75">Card Balance</span>
                      <span className="text-sm font-semibold tracking-tight font-mono">
                        $24,680.42
                      </span>
                    </div>
                  </div>

                  {/* Stats list */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2.5 border border-stone-200/50 space-y-1.5" style={{ backgroundColor: `${colorSecondary}30` }}>
                    <div className="flex justify-between items-center text-[7px] font-semibold" style={{ color: colorText }}>
                      <span>Studio Analytics</span>
                      <span style={{ color: colorAccent }}>+12.4%</span>
                    </div>

                    {/* Miniature sparkline */}
                    <svg className="w-full h-8" viewBox="0 0 100 30">
                      <path 
                        d="M0,25 Q15,5 30,18 T60,8 T90,20 L100,22" 
                        fill="none" 
                        stroke={colorAccent} 
                        strokeWidth="2" 
                      />
                    </svg>
                  </div>
                </div>

                {/* Mobile Bottom navigation bar */}
                <div className="bg-white/90 rounded-2xl py-1.5 px-3 flex justify-between items-center shadow border border-stone-100 z-10 mt-auto" style={{ backgroundColor: colorSecondary }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorPrimary }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorAccent }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorText }} />
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
