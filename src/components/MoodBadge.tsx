import { Sparkles } from "lucide-react";

interface Props {
  mood: string;
}

export default function MoodBadge({ mood }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 border border-border">
      <div className="p-2 rounded-lg gradient-accent">
        <Sparkles className="w-4 h-4 text-accent-foreground" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">AI Mood Analysis</p>
        <p className="text-sm text-foreground mt-0.5">{mood}</p>
      </div>
    </div>
  );
}
