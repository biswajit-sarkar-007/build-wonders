export interface ExtractedColor {
  hex: string;
  rgb: [number, number, number];
  role: string;
  name: string;
  tailwindNearest: string;
}

export interface PaletteResult {
  palette: ExtractedColor[];
  mood: string;
  accessibility: { pair: [string, string]; contrastRatio: number; warning: string }[];
  tailwindConfig: string;
  cssVariables: string;
  snippets: string;
}

const TAILWIND_COLORS: Record<string, string> = {
  "slate-50": "#f8fafc", "slate-100": "#f1f5f9", "slate-200": "#e2e8f0", "slate-300": "#cbd5e1",
  "slate-400": "#94a3b8", "slate-500": "#64748b", "slate-600": "#475569", "slate-700": "#334155",
  "slate-800": "#1e293b", "slate-900": "#0f172a", "slate-950": "#020617",
  "gray-50": "#f9fafb", "gray-100": "#f3f4f6", "gray-200": "#e5e7eb", "gray-300": "#d1d5db",
  "gray-400": "#9ca3af", "gray-500": "#6b7280", "gray-600": "#4b5563", "gray-700": "#374151",
  "gray-800": "#1f2937", "gray-900": "#111827", "gray-950": "#030712",
  "red-50": "#fef2f2", "red-100": "#fee2e2", "red-200": "#fecaca", "red-300": "#fca5a5",
  "red-400": "#f87171", "red-500": "#ef4444", "red-600": "#dc2626", "red-700": "#b91c1c",
  "red-800": "#991b1b", "red-900": "#7f1d1d",
  "orange-50": "#fff7ed", "orange-100": "#ffedd5", "orange-200": "#fed7aa", "orange-300": "#fdba74",
  "orange-400": "#fb923c", "orange-500": "#f97316", "orange-600": "#ea580c", "orange-700": "#c2410c",
  "amber-50": "#fffbeb", "amber-100": "#fef3c7", "amber-200": "#fde68a", "amber-300": "#fcd34d",
  "amber-400": "#fbbf24", "amber-500": "#f59e0b", "amber-600": "#d97706", "amber-700": "#b45309",
  "yellow-50": "#fefce8", "yellow-100": "#fef9c3", "yellow-200": "#fef08a", "yellow-300": "#fde047",
  "yellow-400": "#facc15", "yellow-500": "#eab308",
  "green-50": "#f0fdf4", "green-100": "#dcfce7", "green-200": "#bbf7d0", "green-300": "#86efac",
  "green-400": "#4ade80", "green-500": "#22c55e", "green-600": "#16a34a", "green-700": "#15803d",
  "blue-50": "#eff6ff", "blue-100": "#dbeafe", "blue-200": "#bfdbfe", "blue-300": "#93c5fd",
  "blue-400": "#60a5fa", "blue-500": "#3b82f6", "blue-600": "#2563eb", "blue-700": "#1d4ed8",
  "blue-800": "#1e40af", "blue-900": "#1e3a8a",
  "indigo-50": "#eef2ff", "indigo-100": "#e0e7ff", "indigo-200": "#c7d2fe", "indigo-300": "#a5b4fc",
  "indigo-400": "#818cf8", "indigo-500": "#6366f1", "indigo-600": "#4f46e5",
  "sky-50": "#f0f9ff", "sky-100": "#e0f2fe", "sky-200": "#bae6fd", "sky-300": "#7dd3fc",
  "sky-400": "#38bdf8", "sky-500": "#0ea5e9", "sky-600": "#0284c7",
  "cyan-50": "#ecfeff", "cyan-100": "#cffafe", "cyan-200": "#a5f3fc", "cyan-300": "#67e8f9",
  "cyan-400": "#22d3ee", "cyan-500": "#06b6d4",
  "teal-50": "#f0fdfa", "teal-100": "#ccfbf1", "teal-200": "#99f6e4", "teal-300": "#5eead4",
  "teal-400": "#2dd4bf", "teal-500": "#14b8a6",
  "emerald-50": "#ecfdf5", "emerald-100": "#d1fae5", "emerald-200": "#a7f3d0", "emerald-300": "#6ee7b7",
  "emerald-400": "#34d399", "emerald-500": "#10b981",
  "violet-50": "#f5f3ff", "violet-100": "#ede9fe", "violet-200": "#ddd6fe", "violet-300": "#c4b5fd",
  "violet-400": "#a78bfa", "violet-500": "#8b5cf6",
  "purple-50": "#faf5ff", "purple-100": "#f3e8ff", "purple-200": "#e9d5ff",
  "purple-500": "#a855f7", "purple-600": "#9333ea",
  "pink-50": "#fdf2f8", "pink-100": "#fce7f3", "pink-200": "#fbcfe8",
  "pink-400": "#f472b6", "pink-500": "#ec4899",
  "rose-50": "#fff1f2", "rose-100": "#ffe4e6", "rose-200": "#fecdd3",
  "rose-400": "#fb7185", "rose-500": "#f43f5e",
};

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function colorDistance(c1: [number, number, number], c2: [number, number, number]): number {
  return Math.sqrt(
    Math.pow(c1[0] - c2[0], 2) + Math.pow(c1[1] - c2[1], 2) + Math.pow(c1[2] - c2[2], 2)
  );
}

function findNearestTailwind(hex: string): string {
  const rgb = hexToRgb(hex);
  let nearest = "gray-500";
  let minDist = Infinity;
  for (const [name, twHex] of Object.entries(TAILWIND_COLORS)) {
    const dist = colorDistance(rgb, hexToRgb(twHex));
    if (dist < minDist) {
      minDist = dist;
      nearest = name;
    }
  }
  return nearest;
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const l1 = getLuminance(r1, g1, b1);
  const l2 = getLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s * 100, l * 100];
}

const COLOR_NAMES: Record<string, [number, number, number, number, number, number]> = {
  "Crimson Red": [340, 20, 50, 100, 30, 60],
  "Coral": [0, 30, 60, 90, 40, 70],
  "Sunset Orange": [15, 40, 70, 100, 40, 70],
  "Golden Sun": [35, 55, 80, 100, 50, 80],
  "Amber": [30, 50, 80, 100, 40, 65],
  "Lime Green": [75, 110, 50, 90, 35, 65],
  "Forest Green": [100, 160, 30, 70, 15, 45],
  "Emerald": [140, 170, 50, 90, 30, 60],
  "Teal": [170, 195, 40, 80, 30, 55],
  "Ocean Blue": [195, 220, 40, 80, 30, 60],
  "Deep Navy": [210, 240, 30, 70, 10, 35],
  "Sky Blue": [195, 220, 50, 90, 50, 80],
  "Royal Purple": [260, 290, 40, 80, 25, 55],
  "Lavender": [250, 280, 30, 70, 55, 80],
  "Hot Pink": [310, 340, 50, 90, 40, 65],
  "Rose": [340, 360, 40, 80, 40, 70],
  "Charcoal": [0, 360, 0, 15, 10, 25],
  "Slate": [200, 230, 5, 25, 25, 50],
  "Silver": [0, 360, 0, 15, 60, 80],
  "Snow White": [0, 360, 0, 10, 90, 100],
  "Warm Beige": [30, 50, 10, 40, 75, 95],
  "Cool Gray": [200, 230, 5, 20, 40, 65],
};

function getColorName(hex: string): string {
  const rgb = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(...rgb);
  let bestName = "Custom";
  let bestScore = Infinity;
  for (const [name, [hMin, hMax, sMin, sMax, lMin, lMax]] of Object.entries(COLOR_NAMES)) {
    let hDist = 0;
    if (hMin <= hMax) {
      if (h >= hMin && h <= hMax) hDist = 0;
      else hDist = Math.min(Math.abs(h - hMin), Math.abs(h - hMax));
    } else {
      if (h >= hMin || h <= hMax) hDist = 0;
      else hDist = Math.min(Math.abs(h - hMin), Math.abs(h - hMax));
    }
    const sDist = s < sMin ? sMin - s : s > sMax ? s - sMax : 0;
    const lDist = l < lMin ? lMin - l : l > lMax ? l - lMax : 0;
    const score = hDist * 2 + sDist + lDist;
    if (score < bestScore) {
      bestScore = score;
      bestName = name;
    }
  }
  return bestName;
}

// Median cut color quantization
function quantizeColors(pixels: Uint8ClampedArray, count: number): [number, number, number][] {
  const colorBuckets: [number, number, number][] = [];
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] < 128) continue; // skip transparent
    colorBuckets.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
  }

  if (colorBuckets.length === 0) return [];

  function medianCut(colors: [number, number, number][], depth: number): [number, number, number][] {
    if (depth === 0 || colors.length <= 1) {
      const avg: [number, number, number] = [0, 0, 0];
      colors.forEach(c => { avg[0] += c[0]; avg[1] += c[1]; avg[2] += c[2]; });
      return [[Math.round(avg[0] / colors.length), Math.round(avg[1] / colors.length), Math.round(avg[2] / colors.length)]];
    }

    let maxRange = 0, maxChannel = 0;
    for (let ch = 0; ch < 3; ch++) {
      const vals = colors.map(c => c[ch]);
      const range = Math.max(...vals) - Math.min(...vals);
      if (range > maxRange) { maxRange = range; maxChannel = ch; }
    }

    colors.sort((a, b) => a[maxChannel] - b[maxChannel]);
    const mid = Math.floor(colors.length / 2);
    return [
      ...medianCut(colors.slice(0, mid), depth - 1),
      ...medianCut(colors.slice(mid), depth - 1),
    ];
  }

  // Get more colors than needed, then pick most distinct
  const quantized = medianCut(colorBuckets, Math.ceil(Math.log2(count * 3)));
  
  // Remove very similar colors
  const distinct: [number, number, number][] = [quantized[0]];
  for (const color of quantized) {
    if (distinct.every(d => colorDistance(d, color) > 30)) {
      distinct.push(color);
    }
  }

  // Sort by luminance
  distinct.sort((a, b) => getLuminance(...b) - getLuminance(...a));
  return distinct.slice(0, count);
}

function assignRoles(colors: [number, number, number][]): ExtractedColor[] {
  if (colors.length < 6) {
    // Pad with variations
    while (colors.length < 6) {
      const base = colors[colors.length % colors.length];
      colors.push([
        Math.min(255, base[0] + 40),
        Math.min(255, base[1] + 40),
        Math.min(255, base[2] + 40),
      ]);
    }
  }

  // Sort by properties to assign roles intelligently
  const sorted = colors.map((c, i) => ({
    rgb: c,
    hex: rgbToHex(...c),
    lum: getLuminance(...c),
    sat: rgbToHsl(...c)[1],
    idx: i,
  }));

  sorted.sort((a, b) => a.lum - b.lum);

  const darkest = sorted[0];
  const lightest = sorted[sorted.length - 1];
  const remaining = sorted.slice(1, -1);
  remaining.sort((a, b) => b.sat - a.sat);

  const roles = [
    { ...remaining[0], role: "primary" },
    { ...(remaining[1] || remaining[0]), role: "secondary" },
    { ...(remaining[2] || remaining[0]), role: "accent" },
    { ...(remaining[3] || remaining[1] || remaining[0]), role: "highlight" },
    { ...lightest, role: "background" },
    { ...darkest, role: "text" },
  ];

  return roles.map(r => ({
    hex: r.hex.toUpperCase(),
    rgb: r.rgb,
    role: r.role,
    name: getColorName(r.hex),
    tailwindNearest: findNearestTailwind(r.hex),
  }));
}

function getMood(colors: ExtractedColor[]): string {
  const primary = colors.find(c => c.role === "primary");
  if (!primary) return "Balanced and versatile";
  const [h, s] = rgbToHsl(...primary.rgb);
  
  if (s < 20) return "Minimal and sophisticated — suits luxury or editorial brands";
  if (h >= 0 && h < 30) return "Bold and passionate — suits food, fashion, or entertainment brands";
  if (h >= 30 && h < 60) return "Warm and energetic — suits creative or lifestyle brands";
  if (h >= 60 && h < 150) return "Fresh and natural — suits health, eco, or wellness brands";
  if (h >= 150 && h < 210) return "Calm and trustworthy — suits fintech, SaaS, or corporate brands";
  if (h >= 210 && h < 270) return "Professional and confident — suits tech or enterprise brands";
  if (h >= 270 && h < 330) return "Creative and luxurious — suits beauty or premium brands";
  return "Dynamic and eye-catching — versatile across industries";
}

function checkAccessibility(colors: ExtractedColor[]) {
  const warnings: { pair: [string, string]; contrastRatio: number; warning: string }[] = [];
  const pairs: [string, string][] = [
    ["text", "background"],
    ["primary", "background"],
    ["secondary", "background"],
    ["accent", "background"],
    ["highlight", "background"],
  ];
  for (const [role1, role2] of pairs) {
    const c1 = colors.find(c => c.role === role1);
    const c2 = colors.find(c => c.role === role2);
    if (c1 && c2) {
      const ratio = getContrastRatio(c1.hex, c2.hex);
      if (ratio < 4.5) {
        warnings.push({
          pair: [role1, role2],
          contrastRatio: Math.round(ratio * 10) / 10,
          warning: `Fails WCAG AA for body text (${ratio.toFixed(1)}:1, needs 4.5:1)`,
        });
      }
    }
  }
  return warnings;
}

function generateTailwindConfig(colors: ExtractedColor[]): string {
  const colorEntries = colors.map(c => `        '${c.role}': '${c.hex}',`).join('\n');
  return `// Generated by Palette AI
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
${colorEntries}
      },
    },
  },
  plugins: [],
};`;
}

function generateCssVariables(colors: ExtractedColor[]): string {
  const vars = colors.map(c => {
    const [h, s, l] = rgbToHsl(...c.rgb);
    return `  --color-${c.role}: ${c.hex};\n  --color-${c.role}-hsl: ${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%;`;
  }).join('\n');
  return `/* Generated by Palette AI */\n:root {\n${vars}\n}`;
}

function generateSnippets(colors: ExtractedColor[]): string {
  const primary = colors.find(c => c.role === "primary")?.hex || "#000";
  const accent = colors.find(c => c.role === "accent")?.hex || "#000";
  const bg = colors.find(c => c.role === "background")?.hex || "#fff";
  const text = colors.find(c => c.role === "text")?.hex || "#000";

  return `<!-- Generated by Palette AI -->

<!-- Primary Button -->
<button class="bg-primary text-background px-6 py-3 rounded-lg font-semibold
  hover:opacity-90 transition-opacity">
  Get Started
</button>

<!-- Accent Badge -->
<span class="bg-accent text-text px-3 py-1 rounded-full text-sm font-medium">
  New
</span>

<!-- Card with Secondary Border -->
<div class="border-2 border-secondary rounded-xl p-6 bg-background">
  <h3 class="text-text font-bold text-lg">Card Title</h3>
  <p class="text-text/70 mt-2">Card content goes here.</p>
</div>

<!-- Hero Section -->
<section class="bg-primary text-background py-20 px-8">
  <h1 class="text-4xl font-bold">Hero Headline</h1>
  <p class="text-background/80 mt-4 text-lg">Supporting tagline text.</p>
  <button class="mt-8 bg-accent text-text px-8 py-3 rounded-lg font-semibold">
    Call to Action
  </button>
</section>`;
}

export async function extractColorsFromImage(imageFile: File): Promise<PaletteResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(imageFile);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxSize = 200;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      const rawColors = quantizeColors(imageData.data, 8);
      const palette = assignRoles(rawColors);
      const mood = getMood(palette);
      const accessibility = checkAccessibility(palette);

      URL.revokeObjectURL(url);
      resolve({
        palette,
        mood,
        accessibility,
        tailwindConfig: generateTailwindConfig(palette),
        cssVariables: generateCssVariables(palette),
        snippets: generateSnippets(palette),
      });
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')); };
    img.src = url;
  });
}
