import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI securely
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Robust procedural fallback color generator
  function getLocalFallbackColor(hex: string, r: number, g: number, b: number) {
    const rf = r / 255;
    const gf = g / 255;
    const bf = b / 255;
    const max = Math.max(rf, gf, bf);
    const min = Math.min(rf, gf, bf);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rf:
          h = (gf - bf) / d + (gf < bf ? 6 : 0);
          break;
        case gf:
          h = (bf - rf) / d + 2;
          break;
        case bf:
          h = (rf - gf) / d + 4;
          break;
      }
      h = h / 6;
    }

    const hue = Math.round(h * 360);
    const sat = Math.round(s * 100);
    const light = Math.round(l * 100);

    let name = "";
    let backstory = "";
    let closestPigment = "";
    let paletteConcept = "";

    // 1. Grayscale / low saturation
    if (sat < 12) {
      if (light > 88) {
        name = "Alabaster Whisper";
        backstory = "A soft, luminous shade like early morning frost on fresh linen.";
        closestPigment = "Titanium White";
        paletteConcept = "Pure Negative Space";
      } else if (light < 18) {
        name = "Noir Carbonate";
        backstory = "The velvet weight of compressed charcoal, deep and absolute as the edge of sleep.";
        closestPigment = "Ivory Black";
        paletteConcept = "Strong Layout Anchor";
      } else {
        name = "Silt Stone Gray";
        backstory = "A calm, balanced slate grey recalling pebbles polished by ancient mountain streams.";
        closestPigment = "Raw Umber & White";
        paletteConcept = "Grounded Studio Neutral";
      }
    } else {
      // 2. Hue categories
      if (hue >= 345 || hue < 15) {
        if (light < 35) {
          name = "Garnet Hearth";
          backstory = "A smoldering deep crimson that captures the quiet embers of a woodfire at midnight.";
          closestPigment = "Alizarin Crimson";
          paletteConcept = "Rich Moody Shadow";
        } else if (light > 75) {
          name = "Blush Porcelain";
          backstory = "A warm, delicate rose petal pink resembling a gentle wash of glaze over clay.";
          closestPigment = "Cadmium Red Pale & White";
          paletteConcept = "Delicate Warm Tint";
        } else {
          name = "Cadmium Amber";
          backstory = "A glowing, vibrant red-orange spark full of dry earth energy and volcanic clay.";
          closestPigment = "Cadmium Red Medium";
          paletteConcept = "Active Subject Focal";
        }
      } else if (hue >= 15 && hue < 45) {
        if (light < 35) {
          name = "Burnt Chestnut";
          backstory = "A wholesome, deeply toasted brown carrying notes of roasted acorns and wet soil.";
          closestPigment = "Burnt Umber";
          paletteConcept = "Earthy Base Core";
        } else if (light > 70) {
          name = "Apricot Glaze";
          backstory = "A delicious pastel gold that mimics sunlit summer peaches in a quiet orchard.";
          closestPigment = "Yellow Ochre & White";
          paletteConcept = "Luminous Pale Gold";
        } else {
          name = "Amber Horizon";
          backstory = "A glowing, sunset gold reminiscent of resinous pine needles and warm desert wind.";
          closestPigment = "Raw Sienna";
          paletteConcept = "Spirited Accent Glow";
        }
      } else if (hue >= 45 && hue < 75) {
        if (light < 40) {
          name = "Olive Brass";
          backstory = "A sophisticated greenish-bronze that mirrors old metal frames in dim studios.";
          closestPigment = "Raw Umber & Yellow";
          paletteConcept = "Vintage Midtone Shade";
        } else if (light > 75) {
          name = "Chiffon Cream";
          backstory = "A pale, dreamy yellow like morning light catching the weave of coarse sailcloth.";
          closestPigment = "Cadmium Yellow Pale & White";
          paletteConcept = "Warm Airy Base";
        } else {
          name = "Sunlit Ochre";
          backstory = "A bright, golden yellow that evokes sprawling sunflower fields under a high noon sun.";
          closestPigment = "Cadmium Yellow Medium";
          paletteConcept = "Joyous Highlight";
        }
      } else if (hue >= 75 && hue < 165) {
        if (light < 35) {
          name = "Nocturnal Glade";
          backstory = "A dense, rich forest emerald holding the quiet shadows of ancient pine forests.";
          closestPigment = "Viridian Green & Ivory Black";
          paletteConcept = "Enigmatic Backdrop";
        } else if (light > 70) {
          name = "Sprout Celadon";
          backstory = "A light, breezy mint green that celebrates the first tender shoots of spring foliage.";
          closestPigment = "Cobalt Green & White";
          paletteConcept = "Fresh Crisp Accent";
        } else {
          name = "Verdant Meadow";
          backstory = "A lively, spirited green with organic undertones, full of chlorophyll and moss.";
          closestPigment = "Viridian Green";
          paletteConcept = "Organic Centerpiece";
        }
      } else if (hue >= 165 && hue < 255) {
        if (light < 35) {
          name = "Abyssal Sea";
          backstory = "The deepest, oceanic indigo that mirrors the crushing silent depths of a cold fjord.";
          closestPigment = "Ultramarine Blue & Black";
          paletteConcept = "Noble Structured Base";
        } else if (light > 70) {
          name = "Ether Mist";
          backstory = "An ethereal, feather-light blue carrying the crisp, high-altitude air of alpine slopes.";
          closestPigment = "Cerulean Blue & White";
          paletteConcept = "Breathing Space";
        } else {
          name = "Atelier Cobalt";
          backstory = "A classic, high-purity artistic blue that sings with absolute clarity and calm depth.";
          closestPigment = "Cobalt Blue";
          paletteConcept = "Vibrant Primary Focus";
        }
      } else if (hue >= 255 && hue < 305) {
        if (light < 35) {
          name = "Imperial Plum";
          backstory = "A dark, complex purple with wine undertones, evoking crushed velvet and old manuscripts.";
          closestPigment = "Cobalt Violet & Black";
          paletteConcept = "Royal Deep Shadow";
        } else if (light > 70) {
          name = "Heather Whisper";
          backstory = "A soft, lavender grey that conjures misty highlands and sweet wild thyme.";
          closestPigment = "Cobalt Violet & White";
          paletteConcept = "Poetic Soft Midtone";
        } else {
          name = "Amethyst Bloom";
          backstory = "A rich, spirited purple with electric undertones, radiant and full of creative spark.";
          closestPigment = "Cobalt Violet";
          paletteConcept = "Mystical Accent Spot";
        }
      } else {
        if (light < 35) {
          name = "Mulberry Wine";
          backstory = "A heavy, stained crimson-purple that brings to mind ripe wild berries and dark oak.";
          closestPigment = "Alizarin Crimson & Black";
          paletteConcept = "Sophisticated Base";
        } else if (light > 70) {
          name = "Peony Frost";
          backstory = "A soft, pastel pink-magenta like cherry blossom petals floating on quiet waters.";
          closestPigment = "Quinacridone Magenta & White";
          paletteConcept = "Delicate Warm Glow";
        } else {
          name = "Crimson Pulse";
          backstory = "A high-vibrancy orchid pink-magenta that radiates passionate creative energy.";
          closestPigment = "Quinacridone Magenta";
          paletteConcept = "High-Contrast Spark";
        }
      }
    }

    return { name, backstory, closestPigment, paletteConcept };
  }

  // Robust procedural fallback mood palettes
  function getLocalFallbackMoodPalette(mood: string) {
    const normalized = mood.toLowerCase();
    
    // 1. Cozy / Warm / Autumn
    if (normalized.includes("cozy") || normalized.includes("warm") || normalized.includes("autumn") || normalized.includes("fall") || normalized.includes("wood") || normalized.includes("earth") || normalized.includes("home") || normalized.includes("cabin") || normalized.includes("coffee")) {
      return {
        paletteName: "Amber Hearthfire",
        description: "A comfortable, grounded palette inspired by burning cedarwood, toasted acorns, and natural hand-loomed wool.",
        colors: [
          { hex: "#2E1C0C", name: "Roasted Chestnut", reason: "Deep chocolate brown that establishes a grounded, warm base." },
          { hex: "#9E4A28", name: "Terracotta Hearth", reason: "Rich kiln-baked clay orange that radiates steady radiant warmth." },
          { hex: "#D68E2D", name: "Mellow Ochre", reason: "A dusty gold tone reflecting low evening candlelight." },
          { hex: "#EAD6B3", name: "Unbleached Linen", reason: "A clean, comforting cream that provides soft, breathable contrast." },
          { hex: "#5C6B53", name: "Sage Spruce", reason: "A gentle evergreen midtone that adds balanced organic complexity." }
        ]
      };
    }

    // 2. Calm / Serene / Ocean / Sleep / Relax
    if (normalized.includes("calm") || normalized.includes("relax") || normalized.includes("serene") || normalized.includes("peace") || normalized.includes("sleep") || normalized.includes("ocean") || normalized.includes("sea") || normalized.includes("blue") || normalized.includes("quiet") || normalized.includes("spa")) {
      return {
        paletteName: "Mist of the Fjords",
        description: "An incredibly tranquil and atmospheric blue-grey selection reminiscent of cold mountain lakes and clean coastal air.",
        colors: [
          { hex: "#1C2D37", name: "Abyssal Slate", reason: "A deep, anchoring navy representing silent bottomless waters." },
          { hex: "#425C6A", name: "Glacial Deep", reason: "A cool, midtone blue that absorbs ambient glare and calms focus." },
          { hex: "#7EA0B3", name: "Ether Cerulean", reason: "A light, breezy blue that simulates high atmospheric haze." },
          { hex: "#BDD1DC", name: "Pebble Spray", reason: "A very pale misty water tone that gives high-key visual breathing room." },
          { hex: "#DCE5E7", name: "Alabaster Frost", reason: "An icy, soft white that highlights fine canvas margins and borders." }
        ]
      };
    }

    // 3. Vibrant / Bright / Neon / Energy / Pop / Bold
    if (normalized.includes("vibrant") || normalized.includes("bright") || normalized.includes("neon") || normalized.includes("energy") || normalized.includes("pop") || normalized.includes("bold") || normalized.includes("cyber") || normalized.includes("electro") || normalized.includes("retro wave")) {
      return {
        paletteName: "Chroma Syndicate",
        description: "A high-vibrancy, modern-retro statement palette that combines intense color fields with dramatic contrast.",
        colors: [
          { hex: "#0F172A", name: "Slate Abyss", reason: "A dark charcoal background that allows colors to pop aggressively." },
          { hex: "#E11D48", name: "Cadmium Pulse", reason: "A brilliant, high-excitation rose red representing dynamic flow." },
          { hex: "#EA580C", name: "Sizzling Amber", reason: "An intense, glowing neon orange that demands immediate focal attention." },
          { hex: "#CA8A04", name: "Acid Limelite", reason: "A piercing golden yellow with high reflective values." },
          { hex: "#2563EB", name: "Cobalt Ray", reason: "A super-saturated, pure blue beam that locks the composition together." }
        ]
      };
    }

    // 4. Retro / Vintage / Bauhaus / Midcentury
    if (normalized.includes("retro") || normalized.includes("vintage") || normalized.includes("classic") || normalized.includes("bauhaus") || normalized.includes("midcentury") || normalized.includes("nostalgia") || normalized.includes("old")) {
      return {
        paletteName: "Weimar Bauhaus 1925",
        description: "A timeless, academic tribute to early geometric modernism and subtractive primary color theory.",
        colors: [
          { hex: "#1B2A4A", name: "Academic Indigo", reason: "A dark, mathematical blue carrying structured historical weight." },
          { hex: "#C83E2D", name: "Cinnabar Carmine", reason: "An intense, solid brick red reflecting raw structural posters." },
          { hex: "#D69F2C", name: "Chrome Ochre", reason: "A rich, saturated mustard yellow that balances the red and blue." },
          { hex: "#ECE4D3", name: "Aged Parchment", reason: "A beautifully yellowed off-white background with historical grain." },
          { hex: "#2C3539", name: "Graphite Carbon", reason: "A rich dark gray representing industrial iron and typewriter print." }
        ]
      };
    }

    // 5. Default Creative Atelier / Spring / General
    return {
      paletteName: "Atelier Signature Blend",
      description: "Our studio's carefully balanced signature collection of pigments, combining deep anchors, rich organic midtones, and delicate highlights.",
      colors: [
        { hex: "#1A2E40", name: "Prussian Shadow", reason: "A deeply elegant dark blue that provides clean shadows and structure." },
        { hex: "#8C4A32", name: "Venetian Terra", reason: "An organic red-earth pigment that bridges high and low values." },
        { hex: "#D9A036", name: "Yellow Ochre", reason: "The quintessential raw artist gold that warms any layout." },
        { hex: "#FAF9F6", name: "Alabaster Gesso", reason: "The pristine white base coat of all masterworks." },
        { hex: "#5C7A6B", name: "Viridian Glaze", reason: "A deep, transparent forest green that completes the classic palette." }
      ]
    };
  }

  // API Routes
  app.post("/api/name-color", async (req, res) => {
    const { hex, r, g, b } = req.body;
    if (!hex) {
      return res.status(400).json({ error: "HEX color is required." });
    }

    const rNum = typeof r === "number" ? r : 128;
    const gNum = typeof g === "number" ? g : 128;
    const bNum = typeof b === "number" ? b : 128;

    if (!ai) {
      return res.json(getLocalFallbackColor(hex, rNum, gNum, bNum));
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analyze the color HEX ${hex} (RGB: ${rNum}, ${gNum}, ${bNum}). Give it an evocative, artistic name (like an artist paint color, e.g. "Distant Horizon", "Muted Moss", "Sunlit Apricot"). Provide a poetic 1-sentence backstory about what the color evokes. Also provide the closest classical artist pigment name (e.g. Ultramarine Blue, Yellow Ochre, Burnt Sienna, Titanium White, Viridian Green, Ivory Black) and a 2-3 word design palette concept.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Poetic, artistic name for the color" },
              backstory: { type: Type.STRING, description: "A poetic one-sentence description or backstory of what this specific color evokes." },
              closestPigment: { type: Type.STRING, description: "The closest classical oil/acrylic paint pigment name (e.g., Alizarin Crimson, Cobalt Blue, etc.)" },
              paletteConcept: { type: Type.STRING, description: "A 2-3 word concept of how to use this color in design." },
            },
            required: ["name", "backstory", "closestPigment", "paletteConcept"],
          },
        },
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (error: any) {
      console.warn(`[Studio Engine] Fallback color name generated for ${hex}`);
      res.json(getLocalFallbackColor(hex, rNum, gNum, bNum));
    }
  });

  app.post("/api/mood-palette", async (req, res) => {
    const { mood } = req.body;
    if (!mood) {
      return res.status(400).json({ error: "Mood description is required." });
    }

    if (!ai) {
      return res.json(getLocalFallbackMoodPalette(mood));
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Create a cohesive artist's color palette of 5 distinct colors based on this prompt/mood: "${mood}". For each color, provide a valid 6-character HEX code (including the # symbol), an evocative artistic color name, and a 1-sentence description explaining why it belongs in this mood palette. Give the overall palette a poetic title and a summary description.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              paletteName: { type: Type.STRING, description: "Poetic title for the palette" },
              description: { type: Type.STRING, description: "A beautiful description summarizing the mood and colors of this palette." },
              colors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    hex: { type: Type.STRING, description: "6-character HEX color code with #" },
                    name: { type: Type.STRING, description: "Evocative color name" },
                    reason: { type: Type.STRING, description: "Why this color fits the mood" },
                  },
                  required: ["hex", "name", "reason"],
                },
              },
            },
            required: ["paletteName", "description", "colors"],
          },
        },
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (error: any) {
      console.warn(`[Studio Engine] Fallback palette loaded for mood: "${mood}"`);
      res.json(getLocalFallbackMoodPalette(mood));
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
