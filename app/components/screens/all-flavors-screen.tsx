"use client";

import { memo } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { buildWhatsAppHref } from "@/lib/site-config";
import { JarComponent } from "../jar-component";

interface Flavor {
  id: string;
  category: string;
  name: string;
  shortName: string;
  headline: string;
  subtitle: string;
  ghostText: string;
  bgColor: string;
  accentColor: string;
  imagePath: string;
  price: string;
  allergens: string[];
}

const FLAVOR_THEMES: Record<string, { background: string; glow: string }> = {
  "mango-coconut": { background: "bg-gradient-to-b from-[#FFB800] to-[#C88A2E]", glow: "bg-[#FFB800]" },
  "pandan": { background: "bg-gradient-to-b from-[#3A7D44] to-[#24522B]", glow: "bg-[#3A7D44]" },
  "teh-tarik": { background: "bg-gradient-to-b from-[#C2410C] to-[#8A2D07]", glow: "bg-[#C2410C]" },
  "salted-caramel": { background: "bg-gradient-to-b from-[#D97706] to-[#924E00]", glow: "bg-[#D97706]" },
  "pistachio-kunafa": { background: "bg-gradient-to-b from-[#65A30D] to-[#3F6406]", glow: "bg-[#65A30D]" },
  "jagung-susu": { background: "bg-gradient-to-b from-[#EAB308] to-[#9E7802]", glow: "bg-[#EAB308]" },
};

const defaultTheme = { background: "bg-white", glow: "bg-white" };

interface FlavorCardProps {
  flavor: Flavor;
  index: number;
}

const FlavorCard = memo(({ flavor, index }: FlavorCardProps) => {
  const whatsappFlavorHref = buildWhatsAppHref(
    `Hi Wobble, saya nak order ${flavor.name} panna cotta. Boleh share availability?`,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ delay: index * 0.05, duration: 0.6 }}
      className="relative flex-none w-full md:flex-1 h-full snap-center overflow-hidden group border-r border-white/5 last:border-0 transition-all duration-700 md:hover:flex-[3]"
    >
      {/* Premium Background */}
      <div
        className={`absolute inset-0 transition-transform duration-1000 group-hover:scale-105 ${
          FLAVOR_THEMES[flavor.id]?.background ?? defaultTheme.background
        }`}
      />

      {/* Content Layer */}
      <div className="relative h-full flex flex-col items-center justify-between py-16 md:py-24 z-20 px-6">
        
        {/* Top: Category Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="px-4 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-md"
        >
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/60">
            {flavor.category}
          </span>
        </motion.div>

        {/* Center: THE JAR (Monumental) */}
        <div className="relative w-full flex-1 flex items-center justify-center">
          <div className="w-[300px] h-[400px] md:w-full md:h-full relative transition-all duration-700 group-hover:scale-110 group-hover:-rotate-3">
            <JarComponent 
              currentFlavor={flavor} 
              className="w-full h-full drop-shadow-[0_50px_100px_rgba(0,0,0,0.5)]" 
              enableHover={false} 
              priority={index < 2} 
            />
            {/* Ambient Glow */}
            <div className={`absolute inset-0 blur-[100px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700 ${
              FLAVOR_THEMES[flavor.id]?.glow ?? defaultTheme.glow
            }`} />
          </div>
        </div>

        {/* Bottom: Label */}
        <div className="text-center w-full transition-transform duration-500 group-hover:-translate-y-4">
          <h3 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter uppercase leading-none">
            {flavor.name}
          </h3>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[2px] w-8 bg-white/20" />
            <span className="text-xl md:text-3xl font-black text-white/40 tracking-tighter tabular-nums">
              {flavor.price}
            </span>
            <div className="h-[2px] w-8 bg-white/20" />
          </div>
          <p className="mx-auto mb-5 max-w-sm text-sm leading-relaxed text-white/72 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500">
            {flavor.subtitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5 text-[9px] font-black uppercase tracking-[0.18em] text-white/80 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500">
            <span className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5">Fresh batch</span>
            <span className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5">Cold delivery</span>
          </div>
          <a
            href={whatsappFlavorHref}
            target="_blank"
            rel="noreferrer"
            aria-label={`Order ${flavor.name} on WhatsApp`}
            className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-black shadow-xl transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0"
          >
            order this flavour <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Glass Overlay on Hover */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none" />
    </motion.div>
  );
});

FlavorCard.displayName = "FlavorCard";

export function AllFlavorsScreen({ flavors }: { flavors: Flavor[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-screen bg-[var(--color-background)] flex flex-col md:flex-row relative overflow-hidden"
    >
      {/* Clean Header - Fixed on Desktop, Relative on Mobile */}
      <div className="absolute top-10 md:top-20 left-0 w-full text-center z-40 pointer-events-none px-6">
        <h2 className="text-5xl md:text-[10vw] font-black text-white/10 leading-none tracking-tighter uppercase">
          THE COLLECTION.
        </h2>
      </div>

      {/* Gallery Container - Full Screen Swiper */}
      <div className="flex-1 flex overflow-x-auto md:overflow-hidden snap-x snap-mandatory no-scrollbar h-full">
        {flavors.map((flavor, idx) => (
          <FlavorCard key={flavor.id} flavor={flavor} index={idx} />
        ))}
      </div>
    </motion.div>
  );
}
