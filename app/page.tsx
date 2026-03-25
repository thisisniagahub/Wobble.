"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { buildWhatsAppHref } from '@/lib/site-config';
import { Navigation } from './components/navigation';
import { BackgroundBars } from './components/background-bars';
import { HomeScreen } from './components/screens/home-screen';
import { HowItWorksScreen } from './components/screens/how-it-works-screen';
import { GiftScreen } from './components/screens/gift-screen';
import { AllFlavorsScreen } from './components/screens/all-flavors-screen';
import { FaqScreen } from './components/screens/faq-screen';
import { TelegramScreen } from './components/screens/telegram-screen';

/** System Level Web Audio Context for Tactile Pro Max interactions */
const playPopSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Ignore audio errors if user hasn't interacted with document yet
  }
};

type Screen = 'home' | 'all-flavors' | 'how-it-works' | 'gift' | 'telegram' | 'faq';

const flavors = [
  {
    id: 'mango-coconut',
    category: 'the tropical king',
    name: 'Mango Coconut',
    shortName: 'Mango',
    headline: 'LIMITED EDITION: ONLY 5 JARS LEFT',
    subtitle: 'Luscious tropical mango layered with smooth, rich coconut cream. Topped with sweet mango chunks and crunchy toasted coconut for a paradise in a jar.',
    ghostText: 'MANGO',
    bgColor: '#FFB800',
    accentColor: '#C88A2E',
    imagePath: "/products/mango.png",
    price: 'RM 15',
    allergens: ['dairy'],
  },
  {
    id: 'jagung-susu',
    category: 'the nostalgic treat',
    name: 'Jagung Susu',
    shortName: 'Jagung',
    headline: 'SEASONAL SPECIAL: LIMITED TIME',
    subtitle: 'Sweet corn and milk melt into a soft, velvety dessert jar that feels playful, familiar, and quietly addictive. A taste of childhood memories.',
    ghostText: 'JAGUNG',
    bgColor: '#F5D623',
    accentColor: '#C4A81A',
    imagePath: "/products/jagung.png",
    price: 'RM 13',
    allergens: ['dairy'],
  },
  {
    id: 'pandan',
    category: 'the local hero',
    name: 'Pandan Gula Melaka',
    shortName: 'Pandan',
    headline: 'BESTSELLER: SELLING FAST',
    subtitle: 'Fragrant pandan meets deep gula melaka richness in a silky panna cotta jar made to leave a lasting impression. A true Malaysian classic.',
    ghostText: 'PANDAN',
    bgColor: '#3A7D44',
    accentColor: '#2C5F2D',
    imagePath: "/products/pandan.png",
    price: 'RM 14',
    allergens: ['dairy'],
  },
  {
    id: 'teh-tarik',
    category: 'the mamak favorite',
    name: 'Teh Tarik',
    shortName: 'Teh Tarik',
    headline: 'CROWD FAVORITE: BACK IN STOCK',
    subtitle: 'The comforting soul of teh tarik transformed into a smooth panna cotta finish with a familiar taste and a polished twist. Your daily pick-me-up.',
    ghostText: 'TEH TARIK',
    bgColor: '#C2410C',
    accentColor: '#7A5230',
    imagePath: "/products/teh-tarik.png",
    price: 'RM 13',
    allergens: ['dairy'],
  },
  {
    id: 'salted-caramel',
    category: 'the sweet indulgence',
    name: 'Salted Caramel',
    shortName: 'S. Caramel',
    headline: 'NEW ARRIVAL: TRY IT TODAY',
    subtitle: 'Rich caramel with a delicate salted edge, crafted for dessert moments that feel thoughtful, warm, and luxurious. The perfect balance of sweet and salty.',
    ghostText: 'CARAMEL',
    bgColor: '#8B5E3C',
    accentColor: '#5C3808',
    imagePath: "/products/saltedcaramel.png",
    price: 'RM 14',
    allergens: ['dairy'],
  },
  {
    id: 'pistachio-kunafa',
    category: 'the viral sensation',
    name: 'Pistachio Kunafa',
    shortName: 'Pistachio',
    headline: 'HIGH DEMAND: ORDER NOW',
    subtitle: 'Nutty pistachio and golden kunafa energy come together in a bold, luxurious jar built for the spotlight. The crunch you have been waiting for.',
    ghostText: 'PISTACHIO',
    bgColor: '#84CC16',
    accentColor: '#5A8A11',
    imagePath: "/products/pistachio.png",
    price: 'RM 16',
    allergens: ['dairy', 'nuts'],
  }
];

const allowedScreens: Screen[] = [
  'home',
  'all-flavors',
  'how-it-works',
  'gift',
  'telegram',
  'faq',
];

const whatsappOrderHref = buildWhatsAppHref('Hi Wobble, saya nak order panna cotta.');
const whatsappGiftHref = buildWhatsAppHref('Hi Wobble, saya nak tempah gift box panna cotta.');
const whatsappSupportHref = buildWhatsAppHref('Hi Wobble, saya ada beberapa soalan sebelum order.');

// Ghost text component for home screen
const GhostText = ({ 
  currentScreen, 
  currentFlavor 
}: { 
  currentScreen: Screen, 
  currentFlavor: typeof flavors[0] 
}) => (
  <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
    <AnimatePresence mode="wait">
      {currentScreen === 'home' && (
        <motion.h1
          key={currentFlavor.id + '-ghost'}
          initial={{ opacity: 0, scale: 0.9, filter: "blur(30px)" }}
          animate={{ opacity: 0.08, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(30px)" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="text-[25vw] font-black text-white whitespace-nowrap select-none"
          style={{ lineHeight: 0.8 }}
          aria-hidden="true"
        >
          {currentFlavor.ghostText}
        </motion.h1>
      )}
    </AnimatePresence>
  </div>
);

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex items-center justify-center flex-col"
      exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
       <motion.h1 
         initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
         animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
         transition={{ duration: 1, ease: "easeOut" }}
         className="text-white text-6xl md:text-8xl font-black tracking-tighter"
       >
         Wobble<span className="text-[#FF6B9D]">.</span>
       </motion.h1>
       <motion.div 
         className="h-[2px] bg-white mt-8"
         initial={{ width: 0 }}
         animate={{ width: 150 }}
         transition={{ duration: 1.5, ease: "easeInOut" }}
       />
    </motion.div>
  );
};

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    if (typeof window === 'undefined') {
      return 'home';
    }

    const requestedScreen = new URLSearchParams(window.location.search).get('screen');

    return requestedScreen && allowedScreens.includes(requestedScreen as Screen)
      ? (requestedScreen as Screen)
      : 'home';
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleFlavorChange = useCallback((newIndex: number, forcedDirection?: number) => {
    if (isTransitioning || newIndex === currentIndex) return;
    
    // Haptic Feedback for Mobile (Tactile Experience)
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate(10); 
    }
    
    playPopSound(); // Auditory Tactile Feedback

    setIsTransitioning(true);
    // Determine direction: 1 for clockwise (Next), -1 for counter-clockwise (Prev)
    const transitionDirection = forcedDirection !== undefined 
      ? forcedDirection 
      : (newIndex > currentIndex ? 1 : -1);

    setDirection(transitionDirection);
    setCurrentIndex(newIndex);
    // Lock transitions for duration of cinematic animation
    setTimeout(() => setIsTransitioning(false), 1400);
  }, [currentIndex, isTransitioning]);

  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % flavors.length;
    handleFlavorChange(nextIndex, 1);
  }, [currentIndex, handleFlavorChange]);

  const handlePrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + flavors.length) % flavors.length;
    handleFlavorChange(prevIndex, -1);
  }, [currentIndex, handleFlavorChange]);

  const navigateToScreen = useCallback((screen: string) => {
    const nextScreen = allowedScreens.includes(screen as Screen)
      ? (screen as Screen)
      : 'home';

    setCurrentScreen(nextScreen);

    if (typeof window !== 'undefined') {
      const nextUrl = new URL(window.location.href);

      if (nextScreen === 'home') {
        nextUrl.searchParams.delete('screen');
      } else {
        nextUrl.searchParams.set('screen', nextScreen);
      }

      if (nextScreen !== 'telegram') {
        nextUrl.searchParams.delete('telegram');
      }

      window.history.replaceState(null, '', nextUrl);
    }

    playPopSound();
  }, []);

  // 1. Dynamic Document Title (Client-Side SEO & UX)
  useEffect(() => {
    const currentFlavor = flavors[currentIndex];
    const baseTitle = "Wobble.";
    if (currentScreen === 'home') {
      document.title = `${currentFlavor.name} | ${baseTitle}`;
    } else {
      const screenTitle = currentScreen.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      document.title = `${screenTitle} | ${baseTitle}`;
    }
  }, [currentIndex, currentScreen]);

  // 2. Intelligent Image Prefetching (Performance)
  useEffect(() => {
    const prefetchImages = () => {
      const nextIndex = (currentIndex + 1) % flavors.length;
      const prevIndex = (currentIndex - 1 + flavors.length) % flavors.length;
      
      [flavors[nextIndex], flavors[prevIndex]].forEach(flavor => {
        const img = new Image();
        img.src = flavor.imagePath;
      });
    };
    
    prefetchImages();
  }, [currentIndex]);

  // Auto-rotate flavors on home screen
  useEffect(() => {
    if (!isHovered && currentScreen === 'home' && !isTransitioning) {
      timerRef.current = setInterval(handleNext, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, currentScreen, isTransitioning, handleNext]);

  const currentFlavor = flavors[currentIndex];

  return (
    <>
      <AnimatePresence>
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <main
        className="relative w-full min-h-screen overflow-hidden font-sans selection:bg-white/30 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      {/* Background */}
      <AnimatePresence mode="wait">
        <BackgroundBars 
          key={currentFlavor.id} 
          color={
            currentScreen === 'home' ? currentFlavor.bgColor :
            currentScreen === 'telegram' ? '#111827' :
            currentScreen === 'how-it-works' ? '#1A1A1A' : '#3D153D'
          } 
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10 z-[1] pointer-events-none" aria-hidden="true" />

      {/* Navigation */}
      <Navigation 
        currentScreen={currentScreen}
        onNavigate={navigateToScreen}
        whatsappOrderHref={whatsappOrderHref}
      />

      {/* Ghost Text */}
      <GhostText currentScreen={currentScreen} currentFlavor={currentFlavor} />

      {/* Main Content */}
      <div className="relative w-full h-screen">
        <AnimatePresence mode="wait" custom={direction}>
          {currentScreen === 'home' && (
            <HomeScreen
              key="home"
              currentFlavor={currentFlavor}
              allFlavors={flavors}
              currentIndex={currentIndex}
              direction={direction}
              isTransitioning={isTransitioning}
              onFlavorSelect={handleFlavorChange}
              onNavigate={navigateToScreen}
            />
          )}

          {currentScreen === 'all-flavors' && (
            <AllFlavorsScreen
              key="all-flavors"
              flavors={flavors}
            />
          )}

          {currentScreen === 'how-it-works' && (
            <HowItWorksScreen
              key="how-works"
              currentFlavor={currentFlavor}
            />
          )}

          {currentScreen === 'gift' && (
            <GiftScreen
              key="gift"
              currentFlavor={currentFlavor}
              onNavigate={navigateToScreen}
              whatsappGiftHref={whatsappGiftHref}
            />
          )}

          {currentScreen === 'telegram' && (
            <TelegramScreen
              key="telegram"
              onNavigate={navigateToScreen}
              whatsappOrderHref={whatsappOrderHref}
            />
          )}

          {currentScreen === 'faq' && (
            <FaqScreen
              key="faq"
              currentFlavor={currentFlavor}
              whatsappSupportHref={whatsappSupportHref}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
    </>
  );
}
