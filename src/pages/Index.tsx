import { useState } from "react";
import { Palette, Sparkles, Code2, Zap, ArrowRight, RotateCcw } from "lucide-react";
import ImageUploadZone from "@/components/ImageUploadZone";
import SwatchGrid from "@/components/SwatchGrid";
import MoodBadge from "@/components/MoodBadge";
import AccessibilityWarnings from "@/components/AccessibilityWarnings";
import PaletteOutputTabs from "@/components/PaletteOutputTabs";
import { extractColorsFromImage, type PaletteResult } from "@/lib/colorExtractor";
import { useToast } from "@/hooks/use-toast";

type AppState = "idle" | "processing" | "result";

const Index = () => {
  const [state, setState] = useState<AppState>("idle");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [result, setResult] = useState<PaletteResult | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleExtract = async () => {
    if (!selectedImage) return;
    setState("processing");
    setProgress(0);

    const timer1 = setTimeout(() => setProgress(30), 300);
    const timer2 = setTimeout(() => setProgress(60), 700);
    const timer3 = setTimeout(() => setProgress(85), 1200);

    try {
      const palette = await extractColorsFromImage(selectedImage);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setProgress(100);
      setTimeout(() => {
        setResult(palette);
        setState("result");
      }, 300);
    } catch {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      toast({ title: "Extraction failed", description: "Could not extract colors from image.", variant: "destructive" });
      setState("idle");
    }
  };

  const handleReset = () => {
    setState("idle");
    setSelectedImage(null);
    setResult(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-accent">
              <Palette className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-lg font-bold font-display text-foreground">Palette AI</span>
          </div>
          {state === "result" && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              New Image
            </button>
          )}
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Hero / Upload State */}
        {state === "idle" && (
          <div className="space-y-12 animate-slide-up">
            <div className="text-center space-y-4 max-w-2xl mx-auto pt-8">
              <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-foreground">
                Image → <span className="text-gradient">Tailwind Palette</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Upload any image. Get a complete, production-ready Tailwind CSS color system in seconds.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <ImageUploadZone
                onImageSelect={setSelectedImage}
                selectedImage={selectedImage}
                onClear={() => setSelectedImage(null)}
              />

              {selectedImage && (
                <button
                  onClick={handleExtract}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
                    gradient-accent text-accent-foreground font-semibold text-base
                    hover:opacity-90 transition-opacity shadow-glow"
                >
                  <Sparkles className="w-5 h-5" />
                  Extract Palette
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* How it works */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-4">
              {[
                { icon: Zap, title: "Upload", desc: "Drop any image — brand photo, UI screenshot, or poster" },
                { icon: Sparkles, title: "Extract", desc: "Smart color quantization identifies dominant colors" },
                { icon: Code2, title: "Get Config", desc: "Copy Tailwind config, CSS vars, or JSX snippets" },
              ].map((step, i) => (
                <div key={i} className="text-center p-6 rounded-xl bg-card border border-border">
                  <div className="inline-flex p-3 rounded-xl bg-muted mb-3">
                    <step.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{step.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processing State */}
        {state === "processing" && (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 animate-slide-up">
            <div className="p-4 rounded-2xl gradient-accent animate-pulse-glow">
              <Palette className="w-8 h-8 text-accent-foreground" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Extracting colors...</h2>
              <p className="text-sm text-muted-foreground">
                {progress < 30 ? "Reading image data" : progress < 70 ? "Quantizing colors" : "Assigning roles"}
              </p>
            </div>
            <div className="w-64 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full gradient-accent rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Result State */}
        {state === "result" && result && (
          <div className="space-y-8 animate-slide-up">
            <SwatchGrid colors={result.palette} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <MoodBadge mood={result.mood} />
              <AccessibilityWarnings warnings={result.accessibility} />
            </div>
            <PaletteOutputTabs result={result} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-6">
        <p className="text-center text-xs text-muted-foreground">
          Palette AI — Image to Tailwind CSS palette generator
        </p>
      </footer>
    </div>
  );
};

export default Index;
