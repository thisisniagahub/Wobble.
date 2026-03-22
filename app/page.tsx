"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, Gift, Sparkles, Truck } from 'lucide-react';
import Image from 'next/image';

type Screen = 'home' | 'how-it-works' | 'gift';

const flavors = [
  {
    id: 'pandan',
    category: 'the local hero',
    name: 'Pandan Gula Melaka',
    headline: 'BESTSELLER: SELLING FAST',
    subtitle: 'Fragrant pandan meets deep gula melaka richness in a silky panna cotta jar made to leave a lasting impression. A true Malaysian classic.',
    ghostText: 'PANDAN',
    bgColor: '#3A7D44',
    lidColor: '#1A4D22',
    contentColor: '#8FBC8F',
    accentColor: '#2C5F2D',
    imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'mango-coconut',
    category: 'the tropical king',
    name: 'Mango Coconut',
    headline: 'LIMITED EDITION: ONLY 5 JARS LEFT',
    subtitle: 'Luscious tropical mango layered with smooth, rich coconut cream. Topped with sweet mango chunks and crunchy toasted coconut for a paradise in a jar. A burst of island sunshine.',
    ghostText: 'MANGO',
    bgColor: '#FFB800',
    lidColor: '#B86A14',
    contentColor: '#FFD700',
    accentColor: '#C88A2E',
    imageUrl: 'https://images.unsplash.com/photo-1601314002592-b8734bca6604?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'salted-caramel',
    category: 'the sweet indulgence',
    name: 'Salted Caramel',
    headline: 'NEW ARRIVAL: TRY IT TODAY',
    subtitle: 'Rich caramel with a delicate salted edge, crafted for dessert moments that feel thoughtful, warm, and luxurious. The perfect balance of sweet and salty.',
    ghostText: 'CARAMEL',
    bgColor: '#D97706',
    lidColor: '#4A2A04',
    contentColor: '#D2B48C',
    accentColor: '#5C3808',
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'teh-tarik',
    category: 'the mamak favorite',
    name: 'Teh Tarik',
    headline: 'CROWD FAVORITE: BACK IN STOCK',
    subtitle: 'The comforting soul of teh tarik transformed into a smooth panna cotta finish with a familiar taste and a polished twist. Your daily pick-me-up.',
    ghostText: 'TEH TARIK',
    bgColor: '#C2410C',
    lidColor: '#6B4226',
    contentColor: '#DEB887',
    accentColor: '#7A5230',
    imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'jagung-susu',
    category: 'the nostalgic treat',
    name: 'Jagung Susu',
    headline: 'SEASONAL SPECIAL: LIMITED TIME',
    subtitle: 'Sweet corn and milk melt into a soft, velvety dessert jar that feels playful, familiar, and quietly addictive. A taste of childhood memories.',
    ghostText: 'JAGUNG',
    bgColor: '#EAB308',
    lidColor: '#C49A2B',
    contentColor: '#FFFACD',
    accentColor: '#B38F2E',
    imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'pistachio-kunafa',
    category: 'the viral sensation',
    name: 'Pistachio Kunafa',
    headline: 'HIGH DEMAND: ORDER NOW',
    subtitle: 'Nutty pistachio and golden kunafa energy come together in a bold, luxurious jar built for the spotlight. The crunch you have been waiting for.',
    ghostText: 'PISTACHIO',
    bgColor: '#65A30D',
    lidColor: '#5C6B42',
    contentColor: '#9ACD32',
    accentColor: '#6A7A52',
    imageUrl: 'https://picsum.photos/seed/pistachio/1000/1000',
  }
];

const JarComponent = ({ id = "main-jar", currentFlavor }: { id?: string, currentFlavor: typeof flavors[0] }) => (
  <motion.div
    layoutId={id}
    className="relative w-full max-w-[280px] aspect-[1/1.4] flex items-center justify-center z-30"
    transition={{ type: "spring", stiffness: 60, damping: 20, mass: 1 }}
  >
    <motion.div
      animate={{ y: [-10, 10, -10] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-full h-full drop-shadow-2xl"
    >
      <div className="absolute inset-x-8 top-0 bottom-8 flex flex-col items-center">
        {/* Lid */}
        <motion.div 
          layout
          className="w-3/4 h-12 rounded-t-xl border-b-4 border-black/20 shadow-inner z-30 relative overflow-hidden"
          style={{ backgroundColor: currentFlavor.lidColor }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
          <div className="absolute inset-x-0 top-0 h-full flex justify-around opacity-20">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-px h-full bg-black"></div>
            ))}
          </div>
        </motion.div>
        
        {/* Glass Body */}
        <div className="relative w-full flex-1 bg-white/10 backdrop-blur-md rounded-b-[40px] rounded-t-lg border-2 border-white/30 shadow-2xl overflow-hidden z-20 flex flex-col items-center justify-center">
          {/* Hotlinked Image Content */}
          <motion.div 
            layout
            className="absolute inset-x-0 bottom-0 top-12 opacity-90 overflow-hidden"
            style={{ backgroundColor: currentFlavor.contentColor }}
            transition={{ duration: 0.8 }}
          >
            <Image 
              src={currentFlavor.imageUrl}
              alt={currentFlavor.name}
              fill
              className="object-cover opacity-60 mix-blend-overlay"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </motion.div>
          
          {/* Glass Reflections */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/40 pointer-events-none z-10"></div>
          <div className="absolute left-4 top-4 bottom-12 w-4 bg-gradient-to-r from-white/40 to-transparent rounded-full blur-sm z-10"></div>
          <div className="absolute right-6 top-10 bottom-20 w-2 bg-gradient-to-l from-white/30 to-transparent rounded-full blur-sm z-10"></div>
          
          {/* Label */}
          <div className="relative z-20 w-[85%] bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 text-center transform -rotate-2">
            <div className="text-black font-black tracking-tighter text-xl mb-1">Wobble.</div>
            <div className="text-xs font-bold uppercase tracking-widest text-black/60 border-t border-black/10 pt-1">
              {currentFlavor.name}
            </div>
          </div>
        </div>
      </div>
      
      {/* Jar Shadow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-6 bg-black/40 blur-xl rounded-full z-0"></div>
    </motion.div>
  </motion.div>
);

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % flavors.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + flavors.length) % flavors.length);
  };

  const handleDotClick = (idx: number) => {
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  useEffect(() => {
    if (!isHovered && currentScreen === 'home') {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 4200);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isHovered, currentScreen]);

  const currentFlavor = flavors[currentIndex];

  // Animation variants
  const textVariants = {
    initial: { y: 50, opacity: 0, filter: "blur(8px)" },
    animate: { y: 0, opacity: 1, filter: "blur(0px)" },
    exit: { y: -30, opacity: 0, filter: "blur(4px)" }
  };

  const jarVariants = {
    initial: (dir: number) => ({ x: dir * 400, opacity: 0, rotate: dir * 20, scale: 0.8 }),
    animate: { x: 0, opacity: 1, rotate: 0, scale: 1 },
    exit: (dir: number) => ({ x: dir * -400, opacity: 0, rotate: dir * -20, scale: 0.8 })
  };

  const badgeVariants = {
    initial: { x: 50, opacity: 0 },
    animate: (custom: number) => ({
      x: 0,
      opacity: 1,
      transition: { delay: 0.4 + custom * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    }),
    exit: { x: 50, opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <main 
      className="relative w-full min-h-screen overflow-hidden font-sans selection:bg-white/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Smooth Background Color Morphing */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{ 
          backgroundColor: currentScreen === 'home' ? currentFlavor.bgColor : 
                           currentScreen === 'how-it-works' ? '#2A2A2A' : '#4A154B' 
        }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] as const }}
      />

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full h-20 px-6 md:px-12 flex justify-between items-center z-50 text-white bg-white/5 backdrop-blur-lg border-b border-white/10">
        <button 
          onClick={() => setCurrentScreen('home')}
          className="flex items-center text-2xl font-black tracking-tight hover:opacity-80 transition-opacity"
        >
          Wobble<span className="text-[#FF6B9D]">.</span>
        </button>
        
        <div className="hidden md:flex gap-8 text-sm font-bold tracking-wide uppercase items-center">
          <button 
            onClick={() => setCurrentScreen('home')}
            className={`transition-colors ${currentScreen === 'home' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
          >
            Flavours
          </button>
          <button 
            onClick={() => setCurrentScreen('how-it-works')}
            className={`transition-colors ${currentScreen === 'how-it-works' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
          >
            How it works
          </button>
          <button 
            onClick={() => setCurrentScreen('gift')}
            className={`transition-colors ${currentScreen === 'gift' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
          >
            Gift
          </button>
        </div>

        <div className="flex items-center">
          <button className="hidden md:flex items-center gap-2 bg-[#FF6B9D] hover:bg-[#ff528c] text-white px-6 py-2.5 rounded-full transition-colors font-bold text-sm shadow-lg shadow-pink-500/20 uppercase tracking-wide">
            order via whatsapp <ArrowRight className="w-4 h-4" />
          </button>
          <button className="md:hidden p-2">
            <div className="w-6 h-0.5 bg-white mb-1.5"></div>
            <div className="w-6 h-0.5 bg-white mb-1.5"></div>
            <div className="w-4 h-0.5 bg-white"></div>
          </button>
        </div>
      </nav>

      {/* Ghost Text (Only on Home) */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
        <AnimatePresence mode="wait">
          {currentScreen === 'home' && (
            <motion.h1 
              key={currentFlavor.id + '-ghost'}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.08, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="text-[25vw] font-black text-white whitespace-nowrap select-none"
              style={{ lineHeight: 0.8 }}
            >
              {currentFlavor.ghostText}
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-screen max-w-[1600px] mx-auto px-6 md:px-12 pt-24 pb-32">
        
        <AnimatePresence mode="wait">
          {currentScreen === 'home' && (
            <motion.div 
              key="screen-home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full relative z-10"
            >
              {/* Main Poster Content */}
              <div className="w-full h-full flex flex-col justify-between max-w-md mx-auto relative z-20 pt-8 pb-24 px-6">
                {/* Top Section */}
                <div className="w-full flex flex-col items-start z-20 mt-12">
                  <AnimatePresence mode="wait">
                    <motion.div key={currentFlavor.id + '-top'} className="flex flex-col items-start">
                      <motion.p 
                        variants={textVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-white/80 text-lg md:text-xl font-medium tracking-wide mb-1 lowercase"
                      >
                        {currentFlavor.category}
                      </motion.p>
                      <h1 
                        className="text-6xl sm:text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase text-left mb-4"
                      >
                        {currentFlavor.name.split(' ').map((word, i) => (
                          <motion.span 
                            key={i} 
                            className="block"
                            variants={textVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.8, delay: 0.1 + (i * 0.08), ease: [0.16, 1, 0.3, 1] }}
                          >
                            {word}
                          </motion.span>
                        ))}
                      </h1>
                      <motion.div 
                        variants={textVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-2 text-white font-bold tracking-wider text-xs sm:text-sm uppercase"
                      >
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        {currentFlavor.headline}
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Middle Section: The Jar */}
                <div className="relative w-full flex-1 min-h-[300px] my-4 flex items-center justify-center z-20">
                  <AnimatePresence custom={direction} mode="popLayout">
                    <motion.div
                      key={currentFlavor.id + '-jar'}
                      custom={direction}
                      variants={jarVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <JarComponent currentFlavor={currentFlavor} />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Bottom Section */}
                <div className="w-full flex flex-col items-start relative z-20">
                  <AnimatePresence mode="wait">
                    <motion.div key={currentFlavor.id + '-bottom'} className="w-full flex flex-col items-start">
                      <motion.p 
                        variants={textVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="text-white/90 text-base sm:text-lg font-medium leading-relaxed mb-6 text-left max-w-[90%]"
                      >
                        {currentFlavor.subtitle}
                      </motion.p>
                      <motion.button 
                        variants={textVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-white text-[#1A1A1A] px-8 py-3.5 font-bold uppercase tracking-wider text-sm border-2 border-[#1A1A1A] hover:bg-gray-100 transition-colors rounded-sm"
                      >
                        ADD TO BOX
                      </motion.button>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Background Number */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentFlavor.id + '-number'}
                  initial={{ opacity: 0, x: 40, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -40, filter: "blur(10px)" }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-12 right-0 text-[160px] sm:text-[200px] font-black text-white/20 leading-none pointer-events-none z-0 select-none translate-x-4 translate-y-8"
                >
                  {String(currentIndex + 1).padStart(2, '0')}
                </motion.div>
              </AnimatePresence>

              {/* Trust Badges - Absolute Right */}
              <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col gap-4 z-30">
                {[
                  { title: '330ml / hex jar', desc: 'Premium glass packaging', detail: 'Our signature hexagonal glass jars are 100% recyclable and designed to keep your dessert perfectly chilled.' },
                  { title: '72h / freshness', desc: 'Guaranteed quality', detail: 'Made fresh daily without preservatives. Best consumed within 72 hours for the ultimate wobble experience.' },
                  { title: 'Johor / local', desc: 'Handcrafted daily', detail: 'Proudly handmade in Johor Bahru using locally sourced ingredients wherever possible.' }
                ].map((badge, idx) => (
                  <div key={idx} className="group relative">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl text-white shadow-xl hover:bg-white/10 transition-colors cursor-help w-64"
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-white/80" />
                        <h4 className="text-xs font-bold tracking-wider uppercase">{badge.title}</h4>
                      </div>
                      <p className="text-[10px] text-white/60 pl-7 font-medium uppercase tracking-wider">{badge.desc}</p>
                    </motion.div>
                    
                    {/* Tooltip */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 w-64 p-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-x-4 group-hover:translate-x-0 z-50 shadow-2xl pointer-events-none">
                      <p className="text-sm leading-relaxed text-white/90">{badge.detail}</p>
                      {/* Tooltip Arrow */}
                      <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-black/90 border-t border-r border-white/10 rotate-45"></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentScreen === 'how-it-works' && (
            <motion.div 
              key="screen-how"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24"
            >
              <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center relative z-10">
                <div className="relative">
                  <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] opacity-40 pointer-events-none bg-white"
                  />
                  <JarComponent currentFlavor={currentFlavor} />
                </div>
              </div>
              
              <div className="w-full md:w-1/2 flex flex-col justify-center z-20 text-white max-w-lg">
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                  className="text-5xl md:text-6xl font-black mb-8 tracking-tight"
                >
                  The Wobble Way.
                </motion.h2>
                
                <div className="space-y-8">
                  {[
                    { icon: Sparkles, title: "1. Handcrafted Daily", desc: "Every jar is made fresh in small batches using premium ingredients." },
                    { icon: CheckCircle2, title: "2. Set to Perfection", desc: "We let it set for exactly 12 hours to achieve that signature wobble." },
                    { icon: Truck, title: "3. Delivered Cold", desc: "Shipped in insulated packaging to ensure it arrives perfectly chilled." }
                  ].map((step, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 + (idx * 0.1) }}
                      className="flex gap-6 items-start"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                        <step.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                        <p className="text-white/70 font-serif italic">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentScreen === 'gift' && (
            <motion.div 
              key="screen-gift"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full flex flex-col items-center justify-center gap-12"
            >
              <div className="text-center text-white max-w-2xl z-20">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20 mb-6"
                >
                  <Gift className="w-8 h-8" />
                </motion.div>
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                  className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
                >
                  Send a Little Joy.
                </motion.h2>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                  className="text-xl text-white/80 font-serif italic mb-10"
                >
                  Curate a box of 4 or 6 signature jars. Complete with a handwritten note and premium ribbon packaging.
                </motion.p>
                
                <motion.button 
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                  className="bg-white text-black px-10 py-5 rounded-full font-bold uppercase tracking-wider text-sm inline-flex items-center justify-center gap-3 hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-2xl"
                >
                  Build a Gift Box <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="relative w-full flex justify-center items-center h-[40vh] z-10">
                <motion.div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-50 pointer-events-none bg-[#FF6B9D]"
                />
                <div className="flex items-center justify-center gap-[-40px]">
                  <motion.div initial={{ x: 100, opacity: 0, rotate: -15 }} animate={{ x: 40, opacity: 0.8, rotate: -15 }} transition={{ delay: 0.6 }} className="z-0 scale-75 blur-[2px]">
                    <JarComponent id="gift-jar-1" currentFlavor={currentFlavor} />
                  </motion.div>
                  <div className="z-20 relative">
                    <JarComponent id="main-jar" currentFlavor={currentFlavor} />
                  </div>
                  <motion.div initial={{ x: -100, opacity: 0, rotate: 15 }} animate={{ x: -40, opacity: 0.8, rotate: 15 }} transition={{ delay: 0.7 }} className="z-0 scale-75 blur-[2px]">
                    <JarComponent id="gift-jar-2" currentFlavor={currentFlavor} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Controls (Only on Home) */}
      <AnimatePresence>
        {currentScreen === 'home' && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-8 left-0 w-full px-6 z-50 flex justify-center items-center"
          >
            <div className="flex items-center gap-6 bg-black/20 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-2xl">
              <button 
                onClick={handlePrev}
                className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
                aria-label="Previous flavor"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="flex gap-3 items-center">
                {flavors.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDotClick(idx)}
                    className={`transition-all duration-500 rounded-full ${
                      idx === currentIndex 
                        ? 'w-8 h-2.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                        : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button 
                onClick={handleNext}
                className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
                aria-label="Next flavor"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

