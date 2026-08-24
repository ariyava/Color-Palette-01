import { RGB, hexToRgb } from "./colorMixer";

export interface PaletteColor {
  name: string;
  hex: string;
  rgb: RGB;
  backstory: string;
}

export interface PaletteSubCategory {
  name: string;
  description: string;
  colors: PaletteColor[];
}

export interface PaletteCategory {
  id: string;
  name: string;
  description: string;
  subcategories: PaletteSubCategory[];
}

// Rich database of pre-designed professional palettes
export const ATELIER_PALETTES: PaletteCategory[] = [
  {
    id: "fine-art",
    name: "Classical Fine Art Tubes",
    description: "Traditional oil and watercolor pigment matches reflecting historic raw studio materials.",
    subcategories: [
      {
        name: "Historical Mineral Pigments",
        description: "Precious natural pigments ground by master artists.",
        colors: [
          { name: "Genuine Lapis Lazuli", hex: "#1D2C6A", rgb: { r: 29, g: 44, b: 106 }, backstory: "The deep, celestial blue of medieval illuminated manuscripts, sourced from Afghan quarries." },
          { name: "Malachite Green", hex: "#1E7B54", rgb: { r: 30, g: 123, b: 84 }, backstory: "A vibrant copper-based mineral green favored by the pharaohs and Renaissance painters." },
          { name: "Cinnabar Vermilion", hex: "#E34234", rgb: { r: 227, g: 66, b: 52 }, backstory: "A toxic, intensely brilliant red of ancient Chinese scrolls and Roman villas." },
          { name: "Raw Umber Earth", hex: "#735B43", rgb: { r: 115, g: 91, b: 67 }, backstory: "An ancient manganese-rich clay from Umbria, providing transparent, smoky brown shadows." },
          { name: "Naples Yellow", hex: "#F7E1A1", rgb: { r: 247, g: 225, b: 161 }, backstory: "A warm, lead-antimonate yellow matching the sunlit stucco of classical Mediterranean ruins." }
        ]
      },
      {
        name: "Standard Fine Art Series",
        description: "The core stable tube paints of modern oil and acrylic studios.",
        colors: [
          { name: "Cadmium Red Light", hex: "#F31E20", rgb: { r: 243, g: 30, b: 32 }, backstory: "An intensely warm, high-opacity scarlet red that sings in sunlight." },
          { name: "Cobalt Teal Premium", hex: "#00B2A9", rgb: { r: 0, g: 178, b: 169 }, backstory: "An incredibly glowing, high-vibrancy turquoise with exceptional brilliance." },
          { name: "Phthalo Green (Blue Shade)", hex: "#004B37", rgb: { r: 0, g: 75, b: 55 }, backstory: "A staining, icy-cool dark green with remarkable glazing power." },
          { name: "Yellow Ochre Classic", hex: "#C89E3A", rgb: { r: 200, g: 158, b: 58 }, backstory: "The quintessential golden earth pigment used in human cave drawings." },
          { name: "Alizarin Crimson Deep", hex: "#9E002B", rgb: { r: 158, g: 0, b: 43 }, backstory: "A cool, transparent deep maroon red, perfect for glazing rose tones." }
        ]
      }
    ]
  },
  {
    id: "historical-eras",
    name: "Historical Artistic Eras",
    description: "Period-correct palettes extracted from historical master paintings and design movements.",
    subcategories: [
      {
        name: "High Renaissance (Chiaroscuro)",
        description: "Moody, shadow-heavy pigments of Da Vinci and Rembrandt.",
        colors: [
          { name: "Sfumato Charcoal", hex: "#2B241C", rgb: { r: 43, g: 36, b: 28 }, backstory: "A soft, smoky brownish-black used to blend boundaries into velvet shadow." },
          { name: "Medici Burnished Gold", hex: "#CFA055", rgb: { r: 207, g: 160, b: 85 }, backstory: "A warm, tarnished bronze-gold capturing the glow of Renaissance courtrooms." },
          { name: "Titian Venetian Red", hex: "#A33822", rgb: { r: 163, g: 56, b: 34 }, backstory: "The glowing, sensual terracotta orange-red synonymous with Titian's drapery." },
          { name: "Veronese Glazed Sage", hex: "#558062", rgb: { r: 85, g: 128, b: 98 }, backstory: "A noble, dusty green that mirrors the weathered silk in Renaissance tapestries." },
          { name: "Flemish Parchment", hex: "#ECE1C9", rgb: { r: 236, g: 225, b: 201 }, backstory: "A creamy, slightly warm tone of hand-primed linen boards." }
        ]
      },
      {
        name: "French Impressionism (Plein Air)",
        description: "Bright, unmixed atmospheric colors capturing fleeting sunlight.",
        colors: [
          { name: "Giverny Willow Green", hex: "#81A675", rgb: { r: 129, g: 166, b: 117 }, backstory: "The dappled, sunlit green of Monet's lily pond weeping leaves." },
          { name: "Monet Lavender Haze", hex: "#A89EC9", rgb: { r: 168, g: 158, b: 201 }, backstory: "A misty, violet-blue reflecting the humid shadow of the Rouen Cathedral." },
          { name: "Renoir Sunlit Apricot", hex: "#F3BE9C", rgb: { r: 243, g: 190, b: 156 }, backstory: "A warm, glowing pastel peach capturing the warmth of outdoor skin tones." },
          { name: "Waterlily Soft Amber", hex: "#E8CD78", rgb: { r: 232, g: 205, b: 120 }, backstory: "A golden reflection of yellow blossoms resting on quiet swamp waters." },
          { name: "Plein Air Cerulean", hex: "#5C99C6", rgb: { r: 92, g: 153, b: 198 }, backstory: "A breezy, high-altitude blue representing open Parisian skies." }
        ]
      },
      {
        name: "Weimar Bauhaus (Modernism 1925)",
        description: "Functionalist, industrial primaries and cold geometric structure.",
        colors: [
          { name: "Stark Academic Indigo", hex: "#1C2B4C", rgb: { r: 28, g: 43, b: 76 }, backstory: "A calculated, serious navy carrying structural and graphical weight." },
          { name: "Bauhaus Primary Red", hex: "#CE352B", rgb: { r: 206, g: 53, b: 43 }, backstory: "An intense, flat poster red designed for high-contrast geometric typography." },
          { name: "Chrome Ochre Yellow", hex: "#E2AA22", rgb: { r: 226, g: 170, b: 34 }, backstory: "An industrial mustard yellow reflecting metal tubes and raw wood frames." },
          { name: "Industrial Concrete Gray", hex: "#8A8D8F", rgb: { r: 138, g: 141, b: 143 }, backstory: "The pure, unadorned gray of polished plaster and tubular steel chairs." },
          { name: "Drafting Parchment White", hex: "#F4EFE6", rgb: { r: 244, g: 239, b: 230 }, backstory: "A slightly yellowed off-white matching natural drafting paper." }
        ]
      },
      {
        name: "Ukiyo-e (Edo Period Japan)",
        description: "The delicate, earthy woodblock print shades of Hokusai and Hiroshige.",
        colors: [
          { name: "Prussian Indigo (Aonibi)", hex: "#233D50", rgb: { r: 35, g: 61, b: 80 }, backstory: "The deep, iconic sea-blue used to ink the crest of Hokusai's Great Wave." },
          { name: "Benisand Earth Red", hex: "#B85B48", rgb: { r: 184, g: 91, b: 72 }, backstory: "A natural, powdered iron-oxide red representing temple pillars and volcanic soil." },
          { name: "Edo Green Tea (Uguisucha)", hex: "#6C7A5C", rgb: { r: 108, g: 122, b: 92 }, backstory: "A serene, herbaceous green representing moss gardens and powdered matcha." },
          { name: "Persimmon Glow (Kakishibu)", hex: "#D67B45", rgb: { r: 214, g: 123, b: 69 }, backstory: "A warm, tannin-soaked orange matching ripened persimmon and organic wood dyes." },
          { name: "Misu Wasabi White", hex: "#E8E6D8", rgb: { r: 232, g: 230, b: 216 }, backstory: "A soft, fibrous off-white replicating traditional mulberry-bark paper." }
        ]
      }
    ]
  },
  {
    id: "modern-interior",
    name: "Modern Interior Styles",
    description: "Design-centric color families curated for contemporary spaces and architectural finishes.",
    subcategories: [
      {
        name: "Nordic Minimalist (Japandi)",
        description: "Calm, clean, breathable neutrals and soft herbal accents.",
        colors: [
          { name: "Copenhagen Fjord Sage", hex: "#7F8E81", rgb: { r: 127, g: 142, b: 129 }, backstory: "A desaturated herbal green reflecting forest mosses on a misty morning." },
          { name: "Swedish Winter Sky", hex: "#BAC8CD", rgb: { r: 186, g: 200, b: 205 }, backstory: "An airy, pale grey-blue representing high cloudless Scandinavian noon." },
          { name: "Pale Blonde Birch", hex: "#E3D7C5", rgb: { r: 227, g: 215, b: 197 }, backstory: "The warm, tactile tone of untreated light oak and birchwood furniture." },
          { name: "Stockholm Silt Gray", hex: "#525759", rgb: { r: 82, g: 87, b: 89 }, backstory: "A calm, mineral slate gray that grounds high-contrast kitchen cabinets." },
          { name: "Feathered White Clay", hex: "#FAF8F5", rgb: { r: 250, g: 248, b: 245 }, backstory: "An ultra-soft, warm off-white representing clay plaster wall surfaces." }
        ]
      },
      {
        name: "Warm Bohemian Earth",
        description: "Textured, organic, spice-laden shades full of cozy warmth.",
        colors: [
          { name: "Moroccan Terracotta", hex: "#C16B4D", rgb: { r: 193, g: 107, b: 77 }, backstory: "A rich, baked clay pigment carrying the spirit of dry desert sun." },
          { name: "Toasted Turmeric Gold", hex: "#E2A442", rgb: { r: 226, g: 164, b: 66 }, backstory: "A vibrant, aromatic gold of raw organic spices and woven raffia." },
          { name: "Olive Grove Shadow", hex: "#5C664C", rgb: { r: 92, g: 102, b: 76 }, backstory: "A deep, leafy olive green reflecting Mediterranean fruit orchards." },
          { name: "Washed Sandstone", hex: "#DFCDBC", rgb: { r: 223, g: 205, b: 188 }, backstory: "A soft, textural beige recalling weathered canyons and linen drapes." },
          { name: "Smoked Espresso", hex: "#3F3229", rgb: { r: 63, g: 50, b: 41 }, backstory: "A heavy, dark brown recalling hand-carved mahogany and roasted beans." }
        ]
      },
      {
        name: "Mid-Century Atomic",
        description: "Vibrant, optimistic shades of the 1950s and 60s designs.",
        colors: [
          { name: "Eames Mustard Seat", hex: "#D89B1F", rgb: { r: 216, g: 155, b: 31 }, backstory: "The retro yellow of iconic fiberglass shell chairs and screen prints." },
          { name: "California Teal Pool", hex: "#1D7B85", rgb: { r: 29, g: 123, b: 133 }, backstory: "A deep, saturated cyan-teal reminiscent of palm-shaded backyard pools." },
          { name: "Danish Teak Stain", hex: "#8F4832", rgb: { r: 143, g: 72, b: 50 }, backstory: "A warm reddish-brown matching polished teak credenzas and solid walnut." },
          { name: "Atomic Flamingo Pink", hex: "#E97A70", rgb: { r: 233, g: 122, b: 112 }, backstory: "An optimistic, coral-pink highlight of retro diners and suburban lawns." },
          { name: "Charcoal Twill", hex: "#2F3538", rgb: { r: 47, g: 53, b: 56 }, backstory: "A graphite-black textured weave that serves as the ultimate modern anchor." }
        ]
      }
    ]
  },
  {
    id: "digital-moods",
    name: "Digital & Atmospheric Moods",
    description: "High-contrast virtual gradients, neon sparks, and cinematic ambient environments.",
    subcategories: [
      {
        name: "Neo-Cyberpunk Electro",
        description: "High-excitation phosphors bleeding on wet nocturnal pavement.",
        colors: [
          { name: "Sizzling Laser Fuchsia", hex: "#FF007F", rgb: { r: 255, g: 0, b: 127 }, backstory: "A piercing magenta neon that cuts through digital night fog." },
          { name: "Phosphor Acid Lime", hex: "#A6FF00", rgb: { r: 166, g: 255, b: 0 }, backstory: "An electric green-yellow with blinding luminous properties." },
          { name: "Synthetic Cobalt Beam", hex: "#00F5D4", rgb: { r: 0, g: 245, b: 212 }, backstory: "A liquid cyan-teal laser beam that energizes high-tech canvases." },
          { name: "Nocturnal Void Slate", hex: "#0E1118", rgb: { r: 14, g: 17, b: 24 }, backstory: "An ultra-dark deep navy, pure vacuum backdrop of cybernetic displays." },
          { name: "Ultraviolet Grid", hex: "#6F00FF", rgb: { r: 111, g: 0, b: 255 }, backstory: "A deep violet glow reminiscent of retro-futuristic server bays." }
        ]
      },
      {
        name: "Pastel Dreamland",
        description: "Delicate, sweet, confectionery hues full of high-key lightness.",
        colors: [
          { name: "Marshmallow Peach", hex: "#FFD6A5", rgb: { r: 255, g: 214, b: 165 }, backstory: "A soft, creamy pastel yellow-orange, warm as a fluffy dessert." },
          { name: "Sweet Peony Blush", hex: "#FFC6FF", rgb: { r: 255, g: 198, b: 255 }, backstory: "A gentle pink-violet resembling frosted cherry blossoms." },
          { name: "Crisp Mint Gelato", hex: "#CAFFBF", rgb: { r: 202, g: 255, b: 191 }, backstory: "A cooling, pale green cream that refreshes the gaze." },
          { name: "Ethereal Alpine Sky", hex: "#BDB2FF", rgb: { r: 189, g: 178, b: 255 }, backstory: "A dreamy, desaturated lilac blue representing fluffy sky vistas." },
          { name: "Sweet Cloud Fluff", hex: "#FDFFB6", rgb: { r: 253, g: 255, b: 182 }, backstory: "A buttery, high-brightness pastel yellow that illuminates canvases." }
        ]
      },
      {
        name: "Pacific Hiking Trail",
        description: "Organic, wild mosses, wet pebbles, and woodbark textures of deep old forests.",
        colors: [
          { name: "Lichen Spruce", hex: "#6B7C5E", rgb: { r: 107, g: 124, b: 94 }, backstory: "A desaturated green tea color that matches Pacific Northwest forest branches." },
          { name: "Deep Fir Forest", hex: "#2D3E33", rgb: { r: 45, g: 62, b: 51 }, backstory: "The ancient, shadowy pine canopy that blocks out the bright sun." },
          { name: "Silt River Gravel", hex: "#7E8584", rgb: { r: 126, g: 133, b: 132 }, backstory: "A calm, balanced slate grey of stones polished by cold mountain creeks." },
          { name: "Shagbark Pinecone", hex: "#837060", rgb: { r: 131, g: 112, b: 96 }, backstory: "A warm, natural woody brown that adds rich organic texture." },
          { name: "Sourdough Crumb", hex: "#ECE4D3", rgb: { r: 236, g: 228, b: 211 }, backstory: "An organic oatmeal cream representing mountain paths and dry tall grasses." }
        ]
      }
    ]
  }
];

export interface MatchedResult {
  categoryId: string;
  categoryName: string;
  categoryDescription: string;
  matchedColor: PaletteColor;
  subcategoryName: string;
  subcategoryDescription: string;
  coordinatingColors: PaletteColor[];
  distance: number;
}

// Function to find the single closest color in each of the 4 main categories
export function findSimilarPalettes(targetRgb: RGB): MatchedResult[] {
  const results: MatchedResult[] = [];

  for (const category of ATELIER_PALETTES) {
    let bestDistance = Infinity;
    let bestColor: PaletteColor | null = null;
    let bestSub: PaletteSubCategory | null = null;

    // Search all subcategories
    for (const sub of category.subcategories) {
      for (const col of sub.colors) {
        const dr = targetRgb.r - col.rgb.r;
        const dg = targetRgb.g - col.rgb.g;
        const db = targetRgb.b - col.rgb.b;
        // Euclidean distance
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);

        if (dist < bestDistance) {
          bestDistance = dist;
          bestColor = col;
          bestSub = sub;
        }
      }
    }

    if (bestColor && bestSub) {
      // Find other coordinating colors from that subcategory (excluding the matched one)
      const otherColors = bestSub.colors.filter((c) => c.name !== bestColor!.name);

      results.push({
        categoryId: category.id,
        categoryName: category.name,
        categoryDescription: category.description,
        matchedColor: bestColor,
        subcategoryName: bestSub.name,
        subcategoryDescription: bestSub.description,
        coordinatingColors: otherColors,
        distance: Math.round(bestDistance)
      });
    }
  }

  return results;
}
