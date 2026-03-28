// === TYPES ===

export type EffectCategory = "stompbox" | "modulation" | "delay" | "reverb";

export interface Effect {
  name: string;
  category: EffectCategory;
}

export interface AmpModel {
  name: string;
  description?: string;
}

export interface Preset {
  id: string;
  name: string;
  ampModel: string;
  effects: {
    stompbox: string | null;
    modulation: string | null;
    delay: string | null;
    reverb: string | null;
  };
  songName?: string;
  artistName?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

// === AMP MODELS ===

export const AMP_MODELS: AmpModel[] = [
  { name: "'57 CHAMP", description: "Warm vintage Fender clean" },
  { name: "'57 DELUXE", description: "Classic tweed breakup" },
  { name: "'57 TWIN", description: "Big clean tweed tone" },
  { name: "'59 BASSMAN", description: "The original rock amp" },
  { name: "'65 DELUXE", description: "Blackface sparkle & grit" },
  { name: "'65 TWIN", description: "Pristine blackface clean" },
  { name: "'65 PRINCETON", description: "Recording studio staple" },
  { name: "'60S BRITISH", description: "Vox-style chime & jangle" },
  { name: "'70S BRITISH", description: "Classic hard rock crunch" },
  { name: "'80S BRITISH", description: "Hot-rodded Marshall gain" },
  { name: "'90S AMERICAN", description: "Modern high-gain Fender" },
  { name: "BRITISH COLOUR", description: "Orange-style thick midrange" },
  { name: "BRITISH WATTS", description: "Hi-Watt inspired clean power" },
  { name: "BB15 LOW GAIN", description: "Low-gain vintage warmth" },
  { name: "BB15 MID GAIN", description: "Medium crunch, bluesy" },
  { name: "BB15 HIGH GAIN", description: "Full throttle drive" },
  { name: "SUPER-SONIC", description: "Fender's modern gain machine" },
  { name: "FBE-100", description: "Fender Bandmaster-inspired" },
  { name: "'60S THRIFT", description: "Silvertone-style lo-fi charm" },
  { name: "EXCELSIOR", description: "Vintage pawn-shop vibe" },
  { name: "STUDIO PREAMP", description: "Clean DI studio tone" },
  { name: "METAL 2000", description: "Modern scooped metal" },
  { name: "UBER", description: "Ultra high-gain destruction" },
  { name: "TUBE PREAMP", description: "Transparent tube warmth" },
  { name: "ACOUSTIC SIM", description: "Acoustic guitar emulation" },
];

// === EFFECTS ===

export const EFFECTS: Effect[] = [
  // Stompbox
  { name: "OVERDRIVE", category: "stompbox" },
  { name: "GREENBOX", category: "stompbox" },
  { name: "MYTHIC DRIVE", category: "stompbox" },
  { name: "BLACKBOX", category: "stompbox" },
  { name: "FUZZ", category: "stompbox" },
  { name: "BIG FUZZ", category: "stompbox" },
  { name: "OCTOBOT", category: "stompbox" },
  { name: "COMPRESSOR", category: "stompbox" },
  { name: "SUSTAIN", category: "stompbox" },
  { name: "5-BAND EQ", category: "stompbox" },
  { name: "ENVELOPE FILTER", category: "stompbox" },
  // Modulation
  { name: "SINE CHORUS", category: "modulation" },
  { name: "TRIANGLE FLANGER", category: "modulation" },
  { name: "PHASER", category: "modulation" },
  { name: "VIBRATONE", category: "modulation" },
  { name: "SINE TREMOLO", category: "modulation" },
  { name: "HARMONIC TREMOLO", category: "modulation" },
  // Delay
  { name: "MONO DELAY", category: "delay" },
  { name: "TAPE DELAY", category: "delay" },
  { name: "2290 DELAY", category: "delay" },
  { name: "REVERSE DELAY", category: "delay" },
  // Reverb
  { name: "LARGE HALL", category: "reverb" },
  { name: "SMALL ROOM", category: "reverb" },
  { name: "SPRING REVERB", category: "reverb" },
  { name: "MOD. LARGE HALL", category: "reverb" },
];

export function getEffectsByCategory(category: EffectCategory): Effect[] {
  return EFFECTS.filter((e) => e.category === category);
}

export const CATEGORY_LABELS: Record<EffectCategory, string> = {
  stompbox: "Stompbox",
  modulation: "Modulation",
  delay: "Delay",
  reverb: "Reverb",
};

export const CATEGORY_COLORS: Record<EffectCategory, string> = {
  stompbox: "#f97316",   // orange
  modulation: "#a855f7", // purple
  delay: "#3b82f6",      // blue
  reverb: "#10b981",     // emerald
};
