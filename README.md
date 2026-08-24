
## Artist Color Palette Mixer

An interactive color mixing studio for experimenting with pigment-style blends,
digital color adjustments, palette comparison, saved swatches, and visual mockups.
The app includes server-side Gemini integration for AI-assisted color naming and
mood-based palette generation, with local fallback responses when no API key is
configured.

## Features

- Pigment-style color mixing with paint-inspired controls
- Digital RGB/HSL fine tuning and color inspection
- Saved palette collection with reusable swatches
- Comparative palette references and category suggestions
- Mockup playground for previewing saved colors in visual layouts
- Optional Gemini-powered color naming and mood palette generation

## Tech Stack

- React 19
- TypeScript
- Vite
- Express
- Tailwind CSS
- Google GenAI SDK

## Run Locally

**Prerequisites:** Node.js 20 or newer.

1. Install dependencies:
   `npm install`

2. Create a local environment file:
   `cp .env.example .env.local`

3. Optional: set `GEMINI_API_KEY` in `.env.local` to enable Gemini-generated
   color names and mood palettes. Without this key, the app uses built-in local
   fallback data.

4. Start the development server:
   `npm run dev`

5. Open:
   `http://localhost:3000`

## Available Scripts

- `npm run dev` starts the local Express/Vite development server.
- `npm run lint` runs TypeScript type checking.
- `npm run build` builds the production client and server bundle.
- `npm start` runs the built production server.

## Environment Variables

See `.env.example` for safe placeholder values.
