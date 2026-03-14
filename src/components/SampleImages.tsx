import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";

const SAMPLES = [
  {
    label: "Sunset",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80",
  },
  {
    label: "Forest",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
  },
  {
    label: "Ocean",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
  },
  {
    label: "City Night",
    url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&q=80",
  },
];

interface Props {
  onSelect: (file: File) => void;
}

export default function SampleImages({ onSelect }: Props) {
  const handleClick = async (url: string, label: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], `${label.toLowerCase().replace(/\s+/g, "-")}.jpg`, {
        type: "image/jpeg",
      });
      onSelect(file);
    } catch {
      // silently fail
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground text-center font-mono tracking-wide">
        Or try a sample image
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SAMPLES.map((s, i) => (
          <motion.button
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            onClick={() => handleClick(s.url, s.label)}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border
              hover:border-accent/40 transition-all duration-300 cursor-pointer"
          >
            <img
              src={s.url}
              alt={s.label}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
              <ImageIcon className="w-3 h-3 text-accent" />
              <span className="text-xs font-medium text-foreground">{s.label}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
