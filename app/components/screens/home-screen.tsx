"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, MessageCircleHeart, ShieldCheck } from "lucide-react";
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

interface HomeScreenProps {
  currentFlavor: Flavor;
  allFlavors: Flavor[];
  currentIndex: number;
  direction: number;
  isTransitioning: boolean;
  onFlavorSelect: (index: number, direction?: number) => void;
  onNavigate: (screen: string) => void;
  whatsappOrderHref: string;
  whatsappFlavorHref: string;
}

const trustHighlights = [
  {
    icon: ShieldCheck,
    eyebrow: "small-batch trust",
    title: "Made fresh, packed cold, handled carefully.",
    body: "Every jar is prepared fresh and sent with cold-delivery handling so texture and wobble arrive the way they should.",
  },
  {
    icon: MapPin,
    eyebrow: "delivery clarity",
    title: "Kuala Lumpur & selected Selangor delivery.",
    body: "Pre-order on WhatsApp and Wobble confirms the next available area slot before payment so there are no checkout surprises.",
  },
  {
    icon: MessageCircleHeart,
    eyebrow: "direct ordering",
    title: "Fast replies, flavour swaps, gift help.",
    body: "Order directly on WhatsApp for flavour mix advice, gifting requests, and a smoother concierge-style experience.",
  },
];

type JarPosition = {
  x: string;
  y: string;
  z: number;
  rotate: number;
  scale: number;
  opacity: number;
  filter: string;
};

const JAR_POSITIONS: Record<"mobile" | "desktop", Record<string, JarPosition>> = {
  mobile: {
    "11": { x: "0%", y: "-52%", z: -220, rotate: -8, scale: 0.76, opacity: 0, filter: "blur(10px)" },
    "10": { x: "24%", y: "-18%", z: -280, rotate: -12, scale: 0.52, opacity: 0.12, filter: "blur(12px)" },
    "9": { x: "0%", y: "-4%", z: 120, rotate: 0, scale: 1.12, opacity: 1, filter: "blur(0px)" },
    "7": { x: "24%", y: "18%", z: -280, rotate: 12, scale: 0.52, opacity: 0.12, filter: "blur(12px)" },
    "5": { x: "0%", y: "52%", z: -220, rotate: 8, scale: 0.76, opacity: 0, filter: "blur(10px)" },
  },
  desktop: {
    "11": { x: "38%", y: "-80%", z: -550, rotate: -40, scale: 0.3, opacity: 0, filter: "blur(12px)" },
    "10": { x: "38%", y: "-42%", z: -350, rotate: -20, scale: 0.55, opacity: 0.4, filter: "blur(8px)" },
    "9": { x: "0%", y: "0%", z: 250, rotate: 0, scale: 1.3, opacity: 1, filter: "blur(0px)" },
    "7": { x: "38%", y: "42%", z: -350, rotate: 20, scale: 0.55, opacity: 0.4, filter: "blur(8px)" },
    "5": { x: "38%", y: "80%", z: -550, rotate: 40, scale: 0.3, opacity: 0, filter: "blur(12px)" },
  },
};

const getJarPosition = (layout: "mobile" | "desktop", pos: string): JarPosition | undefined =>
  JAR_POSITIONS[layout]?.[pos];

export function HomeScreen({
  currentFlavor,
  allFlavors,
  currentIndex,
  direction,
  isTransitioning,
  onFlavorSelect,
  onNavigate,
  whatsappOrderHref,
  whatsappFlavorHref,
}: HomeScreenProps) {
  const prevIndex = useMemo(
    () => (currentIndex - 1 + allFlavors.length) % allFlavors.length,
    [currentIndex, allFlavors.length],
  );
  const nextIndex = useMemo(
    () => (currentIndex + 1) % allFlavors.length,
    [currentIndex, allFlavors.length],
  );

  const [isMobile, setIsMobile] = useState(false);
  const mobileSummary = useMemo(() => {
    const [firstSentence] = currentFlavor.subtitle.split(". ");
    if (!firstSentence) return currentFlavor.subtitle;
    return firstSentence.endsWith(".") ? firstSentence : `${firstSentence}.`;
  }, [currentFlavor.subtitle]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (isTransitioning) return;
    if (e.deltaY > 0) {
      onFlavorSelect((currentIndex + 1) % allFlavors.length, 1);
    } else if (e.deltaY < 0) {
      onFlavorSelect((currentIndex - 1 + allFlavors.length) % allFlavors.length, -1);
    }
  }, [isTransitioning, currentIndex, allFlavors.length, onFlavorSelect]);

  const handlePanEnd = useCallback((_e: any, info: { offset: { y: number } }) => {
    if (isTransitioning) return;
    const threshold = 50;
    if (info.offset.y < -threshold) {
      onFlavorSelect((currentIndex + 1) % allFlavors.length, 1);
    } else if (info.offset.y > threshold) {
      onFlavorSelect((currentIndex - 1 + allFlavors.length) % allFlavors.length, -1);
    }
  }, [isTransitioning, currentIndex, allFlavors.length, onFlavorSelect]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onWheel={handleWheel}
      onPanEnd={handlePanEnd}
      className="w-full h-screen relative flex items-center justify-center overflow-hidden transition-colors duration-1000 touch-none"
      style={{
        background: `radial-gradient(circle at center, ${currentFlavor.bgColor}, ${currentFlavor.accentColor}dd, var(--color-background))`,
      }}
      role="region"
      aria-label="Flavor Carousel"
    >
      <div className="absolute inset-x-0 top-[calc(var(--safe-area-inset-top)+7.75rem)] bottom-[calc(var(--bottom-nav-clearance)+13.5rem)] flex items-center justify-center z-10 perspective-[2000px] pointer-events-none md:inset-0 md:top-0 md:bottom-0 md:h-full md:w-full md:justify-end md:pr-[10%]">
        <AnimatePresence initial={false} custom={direction}>
          {allFlavors.map((flavor, idx) => {
            let pos: "10" | "9" | "7" | "hidden" = "hidden";
            if (idx === currentIndex) pos = "9";
            else if (idx === prevIndex) pos = "10";
            else if (idx === nextIndex) pos = "7";

            if (pos === "hidden") return null;
            if (isMobile && pos !== "9") return null;

            const isPistachio = flavor.id === "pistachio-kunafa";
            const normalizationFactor = isPistachio ? 0.85 : 1;
            const layout = isMobile ? "mobile" : "desktop";

            const basePos = getJarPosition(layout, pos);
            const normalizedPos = basePos
              ? { ...basePos, scale: basePos.scale * normalizationFactor }
              : {};

            return (
              <motion.div
                key={flavor.id}
                custom={direction}
                variants={{
                  initial: (dir: number) => {
                    const enterPos = dir > 0 ? "5" : "11";
                    const base = getJarPosition(layout, enterPos);
                    return base ? { ...base, scale: base.scale * normalizationFactor } : {};
                  },
                  animate: normalizedPos,
                  exit: (dir: number) => {
                    const exitPos = dir > 0 ? "11" : "5";
                    const base = getJarPosition(layout, exitPos);
                    return base ? { ...base, scale: base.scale * normalizationFactor } : {};
                  },
                }}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
                className="absolute flex h-[min(92vw,21rem)] w-[min(82vw,19rem)] items-center justify-center will-change-transform transform-gpu md:h-[950px] md:w-[800px]"
                style={{
                  filter: `drop-shadow(0 40px 80px ${flavor.bgColor}60)`,
                }}
              >
                {pos === "9" && (
                  <div className="absolute inset-x-[10%] top-[18%] bottom-[12%] rounded-[2.2rem] border border-white/10 bg-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-[2px] md:hidden" />
                )}
                <JarComponent currentFlavor={flavor} className="w-full h-full" priority={pos === "9"} />
                {pos === "9" && (
                  <div
                    className={`absolute inset-0 rounded-full -z-10 opacity-20 blur-[90px] md:opacity-30 md:blur-[150px] ${
                      {
                        "mango-coconut": "bg-[#FFB800]",
                        pandan: "bg-[#3A7D44]",
                        "teh-tarik": "bg-[#C2410C]",
                        "salted-caramel": "bg-[#D97706]",
                        "pistachio-kunafa": "bg-[#65A30D]",
                        "jagung-susu": "bg-[#EAB308]",
                      }[flavor.id] || "bg-white"
                    }`}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-4 top-[calc(var(--safe-area-inset-top)+5.2rem)] z-30 md:hidden pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFlavor.id + "-mobile-header"}
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="flex flex-wrap items-center gap-2 text-[8px] font-black uppercase tracking-[0.22em] text-white/70"
          >
            <span className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-1.5">
              {currentFlavor.category}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/20 px-3 py-1.5 text-white/85">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
              Cold delivery
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-4 bottom-[calc(var(--bottom-nav-clearance)+0.75rem)] z-30 md:hidden pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFlavor.id + "-mobile-sheet"}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
            className="pointer-events-auto rounded-[1.9rem] border border-white/12 bg-black/38 p-4 text-left text-white shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-3xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.24em] text-white/55">
                  {currentFlavor.headline}
                </p>
                <h1 className="mt-2 text-[clamp(1.95rem,8vw,2.7rem)] font-black leading-[0.9] tracking-[-0.06em] uppercase text-white">
                  {currentFlavor.name}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-white/78">{mobileSummary}</p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-[8px] font-black uppercase tracking-[0.24em] text-white/55">from</p>
                <p className="mt-1 text-[2rem] font-black tracking-[-0.06em] text-white">{currentFlavor.price}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/65">
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">
                KL &amp; Selangor slots
              </span>
              {currentFlavor.allergens.map((allergen) => (
                <span
                  key={allergen}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-white/70"
                >
                  {allergen}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-2.5">
              <motion.a
                href={whatsappFlavorHref}
                target="_blank"
                rel="noreferrer"
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-5 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-black shadow-[0_18px_40px_rgba(255,255,255,0.18)]"
                aria-label={`Order ${currentFlavor.name} on WhatsApp`}
              >
                order {currentFlavor.shortName.toLowerCase()} on WhatsApp
              </motion.a>

              <div className="grid grid-cols-2 gap-2.5">
                <motion.a
                  href={whatsappOrderHref}
                  target="_blank"
                  rel="noreferrer"
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center rounded-full border border-white/14 bg-black/20 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white"
                >
                  general order
                </motion.a>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate("all-flavors")}
                  className="inline-flex items-center justify-center rounded-full bg-[#FF6B9D] px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-[0_18px_40px_rgba(255,107,157,0.26)]"
                >
                  all flavours
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute top-[8%] bottom-[calc(var(--bottom-nav-clearance)+0.75rem)] left-0 hidden w-full items-start md:top-0 md:bottom-0 md:flex md:items-center z-30 pointer-events-none">
        <div className="px-8 md:px-24 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFlavor.id + "-text"}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center md:items-start text-center md:text-left"
            >
              <div className="mb-4 md:mb-8 flex flex-col md:flex-row items-center gap-3 md:gap-4">
                <span className="text-[10px] md:text-sm font-black tracking-[0.4em] uppercase text-white/50 border-b-2 md:border-b-0 md:border-l-2 border-white/30 pb-2 md:pb-0 md:pl-4">
                  {currentFlavor.category}
                </span>
                <span className="inline-block px-4 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase border border-white/20 bg-white/5 text-white/80">
                  {currentFlavor.headline}
                </span>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/15 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-white/85 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
                  Fresh today • cold delivery
                </div>
              </div>

              <h1 className="text-[16vw] md:text-[14vw] font-black text-white leading-[0.8] tracking-tighter uppercase mix-blend-normal md:mix-blend-exclusion [text-shadow:0_10px_40px_rgba(0,0,0,0.5)]">
                {currentFlavor.name.split(" ").map((word, i) => (
                  <span
                    key={i}
                    className="block md:hover:translate-x-6 transition-transform duration-500 cursor-default pointer-events-auto"
                  >
                    {word}
                  </span>
                ))}
              </h1>

              <div className="mt-6 md:mt-12 md:ml-32 flex flex-col items-center md:items-start gap-6 md:gap-8">
                <div className="flex items-center gap-4 md:gap-6">
                  <span className="text-5xl md:text-7xl font-black text-white tabular-nums tracking-tighter">{currentFlavor.price}</span>
                  <div className="flex gap-1">
                    {currentFlavor.allergens.map((a) => (
                      <span key={a} className="px-2 py-0.5 rounded-sm text-[8px] font-black uppercase bg-white text-black shadow-lg">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-start gap-4 md:gap-5 max-w-3xl">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex items-center gap-2.5 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full z-10 pointer-events-auto shadow-2xl"
                  >
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B9D] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B9D]"></span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/90">
                      Only 12 boxes left today
                    </span>
                  </motion.div>

                  <p className="text-sm md:text-base leading-relaxed text-white/78 pointer-events-auto max-w-lg">
                    {currentFlavor.subtitle}
                  </p>

                  <div className="grid w-full max-w-2xl gap-3 pointer-events-auto md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                    <div className="rounded-[2rem] border border-white/10 bg-black/15 p-5 text-left backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
                      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/55">
                        next delivery drop
                      </p>
                      <p className="mt-3 text-lg font-black leading-tight text-white md:text-xl">
                        KL &amp; selected Selangor slots are confirmed on WhatsApp before payment.
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-white/70">
                        Best for pre-orders, gifts, and same-week cravings. Share your area and preferred date to get the next available slot fast.
                      </p>
                    </div>

                    <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 text-left backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
                      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/55">
                        flavour pick ready
                      </p>
                      <p className="mt-3 text-lg font-black leading-tight text-white md:text-xl">
                        Ordering {currentFlavor.name}?
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-white/70">
                        Open WhatsApp with this flavour already selected so the conversation starts with a clear intent.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 md:gap-4 pointer-events-auto">
                    <motion.a
                      href={whatsappFlavorHref}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="relative overflow-hidden bg-white text-black px-8 py-4 md:px-10 md:py-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px] inline-flex items-center gap-3 shadow-[0_20px_50px_rgba(255,255,255,0.22)] hover:shadow-[0_20px_70px_rgba(255,255,255,0.3)] group"
                      aria-label={`Order ${currentFlavor.name} on WhatsApp`}
                    >
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent group-hover:animate-shimmer" />
                      <span className="relative z-10">order {currentFlavor.shortName.toLowerCase()} on whatsapp</span>
                      <div className="relative z-10 h-px w-7 bg-black/30" />
                    </motion.a>

                    <motion.a
                      href={whatsappOrderHref}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="relative overflow-hidden border border-white/20 bg-black/20 text-white px-8 py-4 md:px-10 md:py-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px] inline-flex items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.18)] hover:bg-black/30 group"
                    >
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />
                      <span className="relative z-10">general order enquiry</span>
                      <div className="relative z-10 h-px w-7 bg-white/30" />
                    </motion.a>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onNavigate("all-flavors")}
                      className="relative overflow-hidden bg-[#FF6B9D] text-white px-8 py-4 md:px-10 md:py-4 rounded-full md:rounded-none font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-4 transition-all duration-300 shadow-[0_20px_50px_rgba(255,107,157,0.3)] hover:shadow-[0_20px_60px_rgba(255,107,157,0.5)] group"
                    >
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer" />
                      <span className="relative z-10 flex items-center gap-4 group-hover:text-white">
                        view all flavours
                        <div className="w-8 h-px bg-current group-hover:bg-white" />
                      </span>
                    </motion.button>
                  </div>

                  <div className="grid w-full max-w-4xl gap-3 pointer-events-auto md:grid-cols-3">
                    {trustHighlights.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.title}
                          className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-4 text-left backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.14)]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white">
                              <Icon className="h-4 w-4" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/55">
                              {item.eyebrow}
                            </p>
                          </div>
                          <p className="mt-4 text-sm font-black leading-snug text-white md:text-[15px]">
                            {item.title}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-white/68">
                            {item.body}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/65 pointer-events-auto">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Handmade daily</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">KL &amp; Selangor cold delivery</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Pre-order slots confirmed on chat</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
