"use client";

import { motion } from "motion/react";
import { Gift, Star, Heart } from "lucide-react";
import { JarComponent } from "../jar-component";
import Image from "next/image";

interface GiftScreenProps {
  currentFlavor: {
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
  };
  onNavigate: (screen: string) => void;
  whatsappGiftHref: string;
}

const testimonials = [
  { name: "Sarah L.", text: "Perfect gift for my mom! She loved the variety of flavors.", rating: 5, image: "/products/mango.png", color: "#FFB800" },
  { name: "Ahmad R.", text: "Premium packaging and amazing taste. Will order again!", rating: 5, image: "/products/teh-tarik.png", color: "#C2410C" },
  { name: "Michelle T.", text: "The pandan gula melaka is to die for! Best gift ever.", rating: 5, image: "/products/pandan.png", color: "#3A7D44" },
  { name: "David K.", text: "Impressed my clients with this. They couldn't stop raving!", rating: 5, image: "/products/pistachio.png", color: "#84CC16" },
  { name: "Nurul A.", text: "So thoughtful and delicious. Highly recommend!", rating: 5, image: "/products/jagung.png", color: "#F5D623" },
];

const giftOptions = [
  {
    name: "Starter Box",
    jars: 4,
    price: "RM 55",
    description: "Perfect for trying our signature flavors",
    popular: false
  },
  {
    name: "Premium Box",
    jars: 6,
    price: "RM 80",
    description: "Complete collection of all 6 flavors",
    popular: true
  },
  {
    name: "Custom Box",
    jars: "4-8",
    price: "From RM 55",
    description: "Choose your favorite flavors",
    popular: false
  }
];

export function GiftScreen({
  currentFlavor,
  onNavigate,
  whatsappGiftHref,
}: GiftScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-start gap-20 px-6 py-24 overflow-y-auto custom-scrollbar"
      role="region"
      aria-label="Gift boxes"
    >
      {/* Hero Section - Elegant & Emotional */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center text-white max-w-4xl z-20"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/5 backdrop-blur-md border border-white/20 mb-8 shadow-2xl relative"
        >
          <Gift className="w-10 h-10 text-white" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-white/20 rounded-full blur-xl"
          />
        </motion.div>
        
        <h2 className="text-6xl md:text-8xl font-serif italic mb-8 tracking-tight">
          Made for <span className="font-sans font-black not-italic tracking-tighter uppercase">Sharing.</span>
        </h2>
        
        <p className="text-xl md:text-2xl text-white/70 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
          Encased in premium ivory cardstock, finished with a hand-tied silk ribbon. A gift that wobbles into the heart.
        </p>
        
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          <motion.a
            href={whatsappGiftHref}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden bg-white text-black px-12 py-6 rounded-full font-black uppercase tracking-[0.2em] text-xs inline-flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:shadow-[0_20px_70px_rgba(255,255,255,0.4)] transition-all duration-500 group"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent group-hover:animate-shimmer" />
            <span className="relative z-10 flex items-center gap-4">
              Curate Your Box
              <div className="w-8 h-px bg-black/20" />
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </motion.a>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("telegram")}
            className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur-xl"
          >
            login with telegram
          </motion.button>
        </div>
      </motion.div>

      {/* Luxury Box Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full z-10">
        {giftOptions.map((option, idx) => (
          <motion.div
            key={option.name}
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: idx * 0.1 }}
            className="relative group"
          >
            {/* Wax Seal for Popular Option */}
            {option.popular && (
              <motion.div 
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: -12, scale: 1 }}
                className="absolute -top-6 -right-6 w-20 h-20 z-30 pointer-events-none drop-shadow-xl"
              >
                <div className="w-full h-full bg-[#8B0000] rounded-full flex items-center justify-center border-4 border-[#A52A2A] relative">
                  <span className="text-[10px] font-black text-white text-center leading-tight uppercase tracking-tighter">Wobble<br/>Choice</span>
                  {/* Seal drip effects */}
                  <div className="absolute -bottom-2 left-1/2 w-4 h-4 bg-[#8B0000] rounded-full" />
                </div>
              </motion.div>
            )}
            
            <div className={`h-full p-10 rounded-[2.5rem] backdrop-blur-2xl border transition-all duration-500 ${
              option.popular 
                ? 'bg-white/[0.08] border-white/30 shadow-[0_30px_100px_rgba(0,0,0,0.5)]' 
                : 'bg-white/[0.03] border-white/10 hover:border-white/20'
            }`}>
              <div className="mb-10">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/40 mb-2">{option.name}</h3>
                <div className="text-5xl font-sans font-black text-white tracking-tighter">{option.price}</div>
              </div>
              
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <p className="text-white/80 font-bold">{option.jars} Signature Jars</p>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">{option.description}</p>
              </div>
              
              <button
                type="button"
                aria-label={`Select ${option.name} collection`}
                onClick={() => window.open(whatsappGiftHref, '_blank')}
                className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                  option.popular
                    ? 'bg-white text-black shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black'
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50'
                }`}
              >
                select collection
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Wall of Love (Testimonials) - Polaroid Style */}
      <div className="w-full max-w-7xl mt-20 z-10">
        <div className="flex flex-col items-center mb-16 gap-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 bg-[#FF6B9D]/10 text-[#FF6B9D] border border-[#FF6B9D]/30 px-4 py-2 rounded-full text-[10px] uppercase font-black tracking-[0.2em] shadow-[0_0_30px_rgba(255,107,157,0.2)]"
          >
             <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
               <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.27 6.36 6.34 6.34 0 0 0 6.27-6.36V11.53a8.27 8.27 0 0 0 4 1.25V9.33a4.77 4.77 0 0 1-1.95-.26z" />
             </svg>
             #1 VIRAL TIKTOK DESSERT
          </motion.div>
          <h3 className="text-xs font-black uppercase tracking-[0.5em] text-center text-white/30">
            The Wall of Love
          </h3>
        </div>
        
        <div className="overflow-hidden py-16 w-full max-w-[100vw]">
          <motion.div 
            className="flex gap-12 w-max"
            animate={{ x: [0, -1840] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {[...testimonials, ...testimonials, ...testimonials].map((testimonial, idx) => (
              <div
                key={idx}
                className={`flex-shrink-0 w-[320px] p-6 bg-white rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.3)] ${idx % 2 === 0 ? 'rotate-2' : '-rotate-2'} group hover:rotate-0 hover:scale-105 transition-all duration-500`}
              >
              {/* Polaroid Image Frame */}
              <div 
                className={`w-full aspect-square mb-6 flex items-center justify-center overflow-hidden relative rounded-sm ${
                  {
                    '#FFB800': 'bg-[#FFB800]/5',
                    '#C2410C': 'bg-[#C2410C]/5',
                    '#3A7D44': 'bg-[#3A7D44]/5',
                    '#84CC16': 'bg-[#84CC16]/5',
                    '#F5D623': 'bg-[#F5D623]/5'
                  }[testimonial.color] || 'bg-white/5'
                }`}
              >
                {/* Background soft glow based on flavor */}
                <div 
                  className={`absolute inset-0 opacity-10 blur-3xl pointer-events-none ${
                    {
                      '#FFB800': 'bg-[#FFB800]',
                      '#C2410C': 'bg-[#C2410C]',
                      '#3A7D44': 'bg-[#3A7D44]',
                      '#84CC16': 'bg-[#84CC16]',
                      '#F5D623': 'bg-[#F5D623]'
                    }[testimonial.color] || 'bg-white'
                  }`}
                />
                
                {/* Real Product Image */}
                <div className="relative w-[80%] h-[80%] transition-transform duration-700 group-hover:scale-110">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)]"
                    sizes="256px"
                  />
                </div>

                {/* Date stamp lookalike */}
                <div className="absolute bottom-2 right-2 text-[8px] font-mono text-black/20 font-bold uppercase">
                  BATCH_023 // 2026
                </div>
              </div>
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                ))}
              </div>
              
              <p className="text-black font-serif italic text-xl leading-snug mb-5 tracking-tight">
                &quot;{testimonial.text}&quot;
              </p>
              
              <div className="flex items-center justify-between border-t border-black/5 pt-4">
                <p className="text-black/50 text-[10px] font-black uppercase tracking-[0.2em]">— {testimonial.name}</p>
                <div className="flex gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
                  <div className="w-1.5 h-1.5 rounded-full bg-black/5" />
                </div>
              </div>
            </div>
          ))}
          </motion.div>
        </div>
      </div>

      {/* Kinetic Footer Branding */}
      <div className="py-20 w-screen overflow-hidden opacity-10 flex border-t border-white/5 bg-black/50 mt-10">
        <motion.div
           className="flex gap-8 whitespace-nowrap items-center"
           animate={{ x: [0, -2000] }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
           {[...Array(6)].map((_, i) => (
              <h4 key={i} className="text-[12rem] font-sans font-black tracking-tighter text-white select-none leading-none">
                 WOBBLE.
              </h4>
           ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
