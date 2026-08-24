// Color conversions and Pigment Blending Utility

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

export interface ArtistPigment {
  id: string;
  name: string;
  hex: string;
  rgb: RGB;
  description: string;
  type: 'primary' | 'earth' | 'neutral' | 'secondary' | 'custom';
}

export const CLASSIC_PIGMENTS: ArtistPigment[] = [
  { id: 'cadmium-red', name: 'Cadmium Red', hex: '#E31B23', rgb: { r: 227, g: 27, b: 35 }, description: 'A vibrant, warm, opaque primary red.', type: 'primary' },
  { id: 'cadmium-yellow', name: 'Cadmium Yellow', hex: '#FFD300', rgb: { r: 255, g: 211, b: 0 }, description: 'A bright, rich, sunny primary yellow.', type: 'primary' },
  { id: 'ultramarine-blue', name: 'Ultramarine Blue', hex: '#120A8F', rgb: { r: 18, g: 10, b: 143 }, description: 'A deep, highly saturated reddish-blue.', type: 'primary' },
  { id: 'phthalo-green', name: 'Phthalo Green', hex: '#0B3F2E', rgb: { r: 11, g: 63, b: 46 }, description: 'An intense, cool, dark viridian green.', type: 'secondary' },
  { id: 'burnt-sienna', name: 'Burnt Sienna', hex: '#8A3324', rgb: { r: 138, g: 51, b: 36 }, description: 'A rich, earthy reddish-brown clay pigment.', type: 'earth' },
  { id: 'yellow-ochre', name: 'Yellow Ochre', hex: '#C68E17', rgb: { r: 198, g: 142, b: 23 }, description: 'A warm, muted, natural golden-earth yellow.', type: 'earth' },
  { id: 'titanium-white', name: 'Titanium White', hex: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 }, description: 'An extremely opaque, brilliant pure white for tinting.', type: 'neutral' },
  { id: 'ivory-black', name: 'Ivory Black', hex: '#1C1C1C', rgb: { r: 28, g: 28, b: 28 }, description: 'A warm, deep black with low tinting strength.', type: 'neutral' }
];

export const ACRYLIC_PAINTS: ArtistPigment[] = [
  { id: 'pyrrole-red', name: 'Pyrrole Red', hex: '#D21F3C', rgb: { r: 210, g: 31, b: 60 }, description: 'A modern, highly lightfast, vibrant semi-opaque red.', type: 'primary' },
  { id: 'hansa-yellow', name: 'Hansa Yellow Med', hex: '#FFEB00', rgb: { r: 255, g: 235, b: 0 }, description: 'A clean, high-clarity organic lemon yellow.', type: 'primary' },
  { id: 'phthalo-blue', name: 'Phthalo Blue (GS)', hex: '#0047AB', rgb: { r: 0, g: 71, b: 171 }, description: 'An extremely powerful, staining cool cyan-blue.', type: 'primary' },
  { id: 'quinacridone-magenta', name: 'Quinacridone Magenta', hex: '#BF0060', rgb: { r: 191, g: 0, b: 96 }, description: 'An intense, highly transparent deep rose-violet.', type: 'secondary' },
  { id: 'cobalt-teal', name: 'Cobalt Teal Light', hex: '#00A896', rgb: { r: 0, g: 168, b: 150 }, description: 'A luminous, bright turquoise with cool undertones.', type: 'secondary' },
  { id: 'carbon-black', name: 'Carbon Black', hex: '#101010', rgb: { r: 16, g: 16, b: 16 }, description: 'A dense, cool black with strong tinting power.', type: 'neutral' },
  { id: 'zinc-white', name: 'Zinc White (Mixing)', hex: '#FDFDFC', rgb: { r: 253, g: 253, b: 252 }, description: 'A transparent, low-opacity white ideal for clean glazing.', type: 'neutral' },
  { id: 'fluorescent-orange', name: 'Fluo Orange Glow', hex: '#FF6F00', rgb: { r: 255, g: 111, b: 0 }, description: 'A high-vibrancy fluorescent orange with extreme luminance.', type: 'secondary' }
];

export function hexToRgb(hex: string): RGB {
  const cleanHex = hex.replace(/^#/, '');
  const bigint = parseInt(cleanHex, 16);
  if (isNaN(bigint)) {
    return { r: 0, g: 0, b: 0 };
  }
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

export function rgbToHex(rgb: RGB): string {
  const clamp = (val: number) => Math.min(255, Math.max(0, Math.round(val)));
  return '#' + [clamp(rgb.r), clamp(rgb.g), clamp(rgb.b)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function rgbToCmyk(rgb: RGB): CMYK {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const k = 1 - Math.max(r, g, b);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
}

/**
 * Mixes multiple pigment constituent colors together using a subtractive mixing model.
 * In a real artist's palette, colors mix subtractively (paint absorbs light).
 * Red + Yellow = Orange, Blue + Yellow = Green, White dilutes, Black darkens.
 * We can achieve this by averaging the CMYK values of the constituent colors, 
 * weighted by their relative parts. White acts as a dilution of Cyan, Magenta, Yellow,
 * and Black acts as an additive to Key (K).
 */
export function blendPigments(constituents: { rgb: RGB; parts: number }[]): { hex: string; rgb: RGB } {
  if (constituents.length === 0) {
    return { hex: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 } };
  }

  const totalParts = constituents.reduce((sum, item) => sum + item.parts, 0);
  if (totalParts === 0) {
    return { hex: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 } };
  }

  let totalC = 0;
  let totalM = 0;
  let totalY = 0;
  let totalK = 0;
  let totalWhiteParts = 0;

  for (const item of constituents) {
    // Check if it is Titanium White (or extremely close to pure white)
    const isWhite = item.rgb.r > 250 && item.rgb.g > 250 && item.rgb.b > 250;
    
    if (isWhite) {
      totalWhiteParts += item.parts;
    } else {
      const cmyk = rgbToCmyk(item.rgb);
      totalC += (cmyk.c / 100) * item.parts;
      totalM += (cmyk.m / 100) * item.parts;
      totalY += (cmyk.y / 100) * item.parts;
      totalK += (cmyk.k / 100) * item.parts;
    }
  }

  // Non-white constituents sum
  const coloredParts = totalParts - totalWhiteParts;

  let finalC = 0;
  let finalM = 0;
  let finalY = 0;
  let finalK = 0;

  if (coloredParts > 0) {
    // Calculate the base colored blend CMYK
    finalC = totalC / coloredParts;
    finalM = totalM / coloredParts;
    finalY = totalY / coloredParts;
    finalK = totalK / coloredParts;

    // Apply Titanium White Dilution: white dilutes C, M, Y, and K
    // The ratio of white parts in the total mix reduces CMY coverage.
    const whiteRatio = totalWhiteParts / totalParts;
    const dilutionFactor = 1 - whiteRatio;

    finalC *= dilutionFactor;
    finalM *= dilutionFactor;
    finalY *= dilutionFactor;
    // Black is also diluted, but black has strong tinting strength, so we dilute it less aggressively
    finalK *= (1 - whiteRatio * 0.7); 
  } else {
    // All parts are white
    return { hex: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 } };
  }

  // Convert CMYK back to RGB
  // c, m, y, k are values between 0 and 1
  const r = 255 * (1 - finalC) * (1 - finalK);
  const g = 255 * (1 - finalM) * (1 - finalK);
  const b = 255 * (1 - finalY) * (1 - finalK);

  const rgb = {
    r: Math.min(255, Math.max(0, Math.round(r))),
    g: Math.min(255, Math.max(0, Math.round(g))),
    b: Math.min(255, Math.max(0, Math.round(b)))
  };

  return {
    hex: rgbToHex(rgb),
    rgb
  };
}

/**
 * Finds the closest classic paint pigment by Euclidean distance in RGB space.
 */
export function getClosestClassicPigment(rgb: RGB): string {
  let minDistance = Infinity;
  let closestName = 'Custom Blend';

  for (const pigment of CLASSIC_PIGMENTS) {
    if (pigment.id === 'titanium-white' || pigment.id === 'ivory-black') continue;
    const dr = rgb.r - pigment.rgb.r;
    const dg = rgb.g - pigment.rgb.g;
    const db = rgb.b - pigment.rgb.b;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);

    if (dist < minDistance) {
      minDistance = dist;
      closestName = pigment.name;
    }
  }

  return closestName;
}
