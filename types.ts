import { RGB } from "./utils/colorMixer";

export interface SavedColor {
  id: string;
  hex: string;
  rgb: RGB;
  name: string;
  backstory: string;
  closestPigment: string;
  paletteConcept: string;
  isFavorite?: boolean;
}

export interface MixingConstituent {
  id: string; // can be pigment id or 'custom-X'
  name: string;
  hex: string;
  rgb: RGB;
  parts: number;
}

export interface PlaybackMockup {
  id: 'poster' | 'website' | 'room' | 'dashboard';
  name: string;
}

export interface RoleMapping {
  background: number; // index in palette (0-4)
  primary: number;
  secondary: number;
  accent: number;
  text: number;
}
