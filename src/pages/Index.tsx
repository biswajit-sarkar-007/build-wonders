import { useState } from "react";
import { motion } from "framer-motion";
import {
  Palette, Sparkles, Code2, Zap, ArrowRight, RotateCcw,
  Upload, Eye, Download, ChevronDown, Image, Layers, Pipette,
  FileCode, CheckCircle2, Shield, Gauge, Plus, Minus, Menu, X
} from "lucide-react";
import ImageUploadZone from "@/components/ImageUploadZone";
import SwatchGrid from "@/components/SwatchGrid";
import AccessibilityWarnings from "@/components/AccessibilityWarnings";
import PaletteOutputTabs from "@/components/PaletteOutputTabs";
import AnimatedSection from "@/components/AnimatedSection";
import SampleImages from "@/components/SampleImages";
import { extractColorsFromImage, type PaletteResult } from "@/lib/colorExtractor";
import { useToast } from "@/hooks/use-toast";


type AppState = "idle" | "processing" | "result";

const NAV_LINKS = ["Features", "How It Works", "FAQ"];

const FEATURES = [
  {
    icon: Pipette,
    title: "Smart Color Extraction",
    desc: "Advanced median-cut quantization algorithm identifies dominant colors from any image with precision.",
  },
  {
    icon: Layers,
    title: "Role Assignment",
    desc: "Automatically assigns functional roles — primary, secondary, accent, background — based on luminance & saturation.",
  },
  {
    icon: FileCode,
    title: "Production-Ready Output",
    desc: "Export as Tailwind config, CSS variables, JSON, or ready-to-paste HTML/JSX snippets.",
  },
  {
    icon: Shield,
    title: "Accessibility Checks",
    desc: "WCAG contrast ratio analysis ensures your palette meets accessibility standards out of the box.",
  },
  {
    icon: Gauge,
    title: "Instant Processing",
    desc: "Client-side processing means zero server latency — your palette is ready in under a second.",
  },
  {
    icon: Eye,
    title: "Live Preview",
    desc: "See your extracted colors visualized as interactive swatches with hex, RGB, and nearest Tailwind values.",
  },
];

const STEPS = [
  { num: "01", icon: Upload, title: "Upload", desc: "Drop any image — brand photo, UI screenshot, or poster." },
  { num: "02", icon: Sparkles, title: "Extract", desc: "Smart quantization identifies dominant colors & assigns roles." },
  { num: "03", icon: Eye, title: "Preview", desc: "Interactive swatches with accessibility warnings." },

  { num: "04", icon: Download, title: "Export", desc: "Copy Tailwind config, CSS vars, or download the full palette." },
];

const FAQS = [
  {
    q: "What image formats are supported?",
    a: "Palette AI supports JPEG, PNG, WebP, GIF, and BMP formats. For best results, use high-quality images with distinct colors.",
  },
  {
    q: "How many colors are extracted?",
    a: "By default, we extract 6 dominant colors and assign them functional roles (primary, secondary, accent, highlight, background, text).",
  },
  {
    q: "Is my image uploaded to a server?",
    a: "No. All processing happens entirely in your browser using Canvas API. Your images never leave your device.",
  },
  {
    q: "Can I use the output in production?",
    a: "Absolutely. The generated Tailwind config and CSS variables are production-ready and can be pasted directly into your project.",
  },
  {
    q: "Does it check for accessibility?",
    a: "Yes. We run WCAG contrast ratio checks on color pairs and flag any combinations that don't meet AA or AAA standards.",
  },
];

const Index = () => {
  const [state, setState] = useState<AppState>("idle");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [result, setResult] = useState<PaletteResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background relative isolate">
      {/* ───── NAVBAR ───── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
      >
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg gradient-accent">
              <Palette className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="text-base font-bold font-display text-foreground tracking-tight">
              Palette AI<sup className="text-accent text-[10px] ml-0.5">●</sup>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link.toLowerCase().replace(/\s+/g, "-"))}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-display"
              >
                {link}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {state === "result" && (
              <button
                onClick={handleReset}
                className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
            <button
              onClick={() => scrollTo("tool")}
              className="hidden md:inline-flex px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-card transition-colors"
            >
              Get Started
            </button>
            <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
            <div className="container max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <button
                  key={link}
                  onClick={() => scrollTo(link.toLowerCase().replace(/\s+/g, "-"))}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left py-2"
                >
                  {link}
                </button>
              ))}
              <button
                onClick={() => scrollTo("tool")}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-card transition-colors mt-2"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </motion.header>

      {/* ───── HERO ───── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden touch-pan-y">
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-highlight/15 blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[300px] rounded-full bg-accent/10 blur-[100px]" />
        </div>

        <div className="container max-w-4xl mx-auto px-4 text-center relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/50 text-xs text-muted-foreground font-mono"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            100% client-side · No uploads to server
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight text-foreground leading-[1.1]"
          >
            The smart way to extract
            <br />
            <span className="text-gradient">color palettes</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            Upload any image. Get a complete, production-ready Tailwind CSS color
            system with accessibility checks — all processed in your browser.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <button
              onClick={() => scrollTo("tool")}
              className="px-6 py-3.5 rounded-xl gradient-accent text-accent-foreground font-semibold text-sm
                hover:opacity-90 transition-opacity shadow-glow flex items-center gap-2"
            >
              Get started for free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo("how-it-works")}
              className="px-6 py-3.5 rounded-xl border border-border text-foreground font-medium text-sm
                hover:bg-card transition-colors flex items-center gap-2"
            >
              How it works
              <ChevronDown className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </section>

      {/* ───── FEATURES ───── */}
      <section id="features" className="py-20 sm:py-28 relative">
        <div className="container max-w-6xl mx-auto px-4 space-y-16">
          <AnimatedSection>
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <p className="text-xs font-mono text-accent tracking-widest uppercase">Features</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                Everything you need to build a palette
              </h2>
              <p className="text-muted-foreground text-sm">
                From smart extraction to production-ready code output — one tool, zero friction.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all duration-300 space-y-4 h-full"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:gradient-accent transition-all duration-300">
                    <f.icon className="w-5 h-5 text-accent group-hover:text-accent-foreground transition-colors duration-300" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground font-display">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section id="how-it-works" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 gradient-surface opacity-50 pointer-events-none" />
        <div className="container max-w-5xl mx-auto px-4 space-y-16 relative z-10">
          <AnimatedSection>
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <p className="text-xs font-mono text-accent tracking-widest uppercase">How It Works</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                Four steps to your palette
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <AnimatedSection key={i} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="relative p-6 rounded-2xl bg-card border border-border space-y-4 h-full"
                >
                  <span className="text-3xl font-bold font-display text-accent/20">{s.num}</span>
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground font-display">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  {i < STEPS.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 text-border">
                      <ArrowRight className="w-4 h-4 text-muted-foreground/40" />
                    </div>
                  )}
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ───── TOOL ───── */}
      <section id="tool" className="py-20 sm:py-28">
        <div className="container max-w-6xl mx-auto px-4 space-y-10">
          <AnimatedSection>
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <p className="text-xs font-mono text-accent tracking-widest uppercase">Try It Now</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                Extract your palette
              </h2>
            </div>
          </AnimatedSection>

          {state === "idle" && (
            <AnimatedSection>
              <div className="max-w-2xl mx-auto space-y-6">
                <ImageUploadZone
                  onImageSelect={setSelectedImage}
                  selectedImage={selectedImage}
                  onClear={() => setSelectedImage(null)}
                />
                {!selectedImage && <SampleImages onSelect={setSelectedImage} />}
                {selectedImage && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleExtract}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
                      gradient-accent text-accent-foreground font-semibold text-base
                      hover:opacity-90 transition-opacity shadow-glow"
                  >
                    <Sparkles className="w-5 h-5" />
                    Extract Palette
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </AnimatedSection>
          )}

          {state === "processing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 space-y-6"
            >
              <div className="p-4 rounded-2xl gradient-accent animate-pulse">
                <Palette className="w-8 h-8 text-accent-foreground" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Extracting colors...</h3>
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
            </motion.div>
          )}

          {state === "result" && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <SwatchGrid colors={result.palette} />
              <AccessibilityWarnings warnings={result.accessibility} />
              <PaletteOutputTabs result={result} />

              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try another image
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>




      {/* ───── FAQ ───── */}
      <section id="faq" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 gradient-surface opacity-50 pointer-events-none" />
        <div className="container max-w-3xl mx-auto px-4 space-y-12 relative z-10">
          <AnimatedSection>
            <div className="text-center space-y-4">
              <p className="text-xs font-mono text-accent tracking-widest uppercase">FAQ</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                Frequently asked questions
              </h2>
            </div>
          </AnimatedSection>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <AnimatedSection key={i} delay={i * 0.06}>
                <div className="rounded-xl border border-border bg-card overflow-hidden transition-colors">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                  >
                    <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                    <div className="shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                      {openFaq === i ? (
                        <Minus className="w-3.5 h-3.5 text-accent" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={openFaq === i ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5">
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <AnimatedSection>
        <footer className="border-t border-border py-12">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg gradient-accent">
                  <Palette className="w-4 h-4 text-accent-foreground" />
                </div>
                <span className="text-sm font-bold font-display text-foreground">Palette AI</span>
              </div>

              <div className="flex items-center gap-6">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link}
                    onClick={() => scrollTo(link.toLowerCase().replace(/\s+/g, "-"))}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </button>
                ))}
              </div>

              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Palette AI. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </AnimatedSection>
    </div>
  );
};

export default Index;
