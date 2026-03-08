import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { ExtractedColor } from "@/lib/colorExtractor";

interface Props {
  color: ExtractedColor;
  index: number;
}

export default function SwatchCard({ color, index }: Props) {
  const [copied, setCopied] = useState(false);

  const copyHex = async () => {
    await navigator.clipboard.writeText(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="group rounded-xl overflow-hidden border border-border shadow-card hover:shadow-swatch 
        transition-all duration-300 hover:-translate-y-1 bg-card animate-slide-up cursor-pointer"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
      onClick={copyHex}
    >
      <div className="h-24 sm:h-28 relative" style={{ backgroundColor: color.hex }}>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 
          transition-opacity bg-black/20 backdrop-blur-[2px]">
          {copied ? (
            <Check className="w-5 h-5 text-white drop-shadow-lg" />
          ) : (
            <Copy className="w-5 h-5 text-white drop-shadow-lg" />
          )}
        </div>
      </div>
      <div className="p-3 space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{color.role}</p>
        <p className="font-mono text-sm font-semibold text-foreground">{color.hex}</p>
        <p className="text-xs text-muted-foreground">{color.name}</p>
        <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
          ≈ {color.tailwindNearest}
        </span>
      </div>
    </div>
  );
}
