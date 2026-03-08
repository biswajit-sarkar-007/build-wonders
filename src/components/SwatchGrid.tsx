import type { ExtractedColor } from "@/lib/colorExtractor";
import SwatchCard from "./SwatchCard";

interface Props {
  colors: ExtractedColor[];
}

export default function SwatchGrid({ colors }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {colors.map((color, i) => (
        <SwatchCard key={color.role} color={color} index={i} />
      ))}
    </div>
  );
}
