import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Senior Designer, Stripe",
    avatar: "SC",
    quote:
      "Palette AI replaced our entire manual color extraction workflow. What used to take 30 minutes now takes seconds — and the Tailwind output is production-ready.",
    stars: 5,
  },
  {
    name: "Marcus Rivera",
    role: "Frontend Lead, Vercel",
    avatar: "MR",
    quote:
      "The accessibility checks alone make this invaluable. We caught three contrast issues before they hit production. Absolute game-changer.",
    stars: 5,
  },
  {
    name: "Aisha Patel",
    role: "Creative Director, Linear",
    avatar: "AP",
    quote:
      "I use this daily for client projects. Upload a brand photo, get a complete design system in seconds. The mood analysis is surprisingly accurate.",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 sm:py-28 relative">
      <div className="container max-w-6xl mx-auto px-4 space-y-16">
        <AnimatedSection>
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <p className="text-xs font-mono text-accent tracking-widest uppercase">
              Testimonials
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
              Loved by designers & developers
            </h2>
            <p className="text-muted-foreground text-sm">
              See what professionals are saying about Palette AI.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <AnimatedSection key={i} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -4 }}
                className="relative p-6 rounded-2xl bg-card border border-border hover:border-accent/20 
                  transition-colors duration-300 space-y-5 h-full flex flex-col"
              >
                <Quote className="w-8 h-8 text-accent/20 absolute top-5 right-5" />

                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-accent text-accent"
                    />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center">
                    <span className="text-xs font-bold text-accent-foreground">
                      {t.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
