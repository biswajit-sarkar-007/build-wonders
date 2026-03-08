import { AlertTriangle } from "lucide-react";

interface Warning {
  pair: [string, string];
  contrastRatio: number;
  warning: string;
}

interface Props {
  warnings: Warning[];
}

export default function AccessibilityWarnings({ warnings }: Props) {
  if (warnings.length === 0) return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
      <span className="text-green-400 text-sm">✓ All color pairs pass WCAG AA contrast requirements</span>
    </div>
  );

  return (
    <div className="space-y-2">
      {warnings.map((w, i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-foreground">
              <span className="font-mono font-semibold">{w.pair[0]}</span>
              {" on "}
              <span className="font-mono font-semibold">{w.pair[1]}</span>
              {" — "}
              <span className="text-amber-400">{w.contrastRatio}:1</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{w.warning}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
