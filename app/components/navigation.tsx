"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import Image from "next/image";

interface NavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  whatsappOrderHref: string;
}

export function Navigation({ 
  currentScreen, 
  onNavigate, 
  whatsappOrderHref 
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = useCallback((screen: string) => {
    onNavigate(screen);
    setIsMobileMenuOpen(false);
  }, [onNavigate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, screen: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavigate(screen);
    }
  }, [handleNavigate]);

  const navItems = [
    { id: 'home', label: 'Flavours' },
    { id: 'all-flavors', label: 'All Flavours' },
    { id: 'how-it-works', label: 'How it works' },
    { id: 'gift', label: 'Gift' },
    { id: 'telegram', label: 'Telegram' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <>
      {/* Editorial Floating Navigation Pill */}
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
        className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 w-[92%] md:w-auto px-6 md:px-8 py-4 flex justify-between items-center z-50 text-white bg-black/60 backdrop-blur-3xl border border-white/10 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        style={{ 
          marginBottom: 'var(--safe-area-inset-bottom, 0px)',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <button
          onClick={() => handleNavigate('home')}
          className="flex items-center text-xl md:text-2xl font-black tracking-tight hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] rounded-lg px-2 py-1"
          aria-label="Wobble home"
        >
          Wobble<span className="text-[#FF6B9D]">.</span>
        </button>

        <div className="hidden md:flex gap-10 text-[10px] font-black tracking-[0.2em] uppercase items-center ml-12" role="menubar">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigate(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              role="menuitem"
              className={`relative transition-colors focus:outline-none px-2 py-1 group ${
                currentScreen === item.id ? 'text-white' : 'text-white/40 hover:text-white/90'
              }`}
              aria-current={currentScreen === item.id ? 'page' : undefined}
            >
              {item.label}
              {currentScreen === item.id && (
                <motion.div 
                  layoutId="nav-indicator"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FF6B9D] rounded-full" 
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 ml-0 md:ml-12">
          <a
            href={whatsappOrderHref}
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-3 bg-white text-black pl-5 pr-6 py-2.5 rounded-full transition-all duration-300 font-black text-[9px] hover:scale-105 shadow-xl uppercase tracking-[0.2em] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black relative group"
            aria-label="Order via WhatsApp (opens in new tab)"
          >
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B9D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6B9D]"></span>
            </div>
            order now <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </a>

          <button
            type="button"
            className="md:hidden p-2 focus:outline-none focus:ring-2 focus:ring-white rounded-full bg-white/10"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen ? "true" : "false"}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-24 left-4 right-4 z-40 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="rounded-[2rem] border border-white/10 bg-black/60 p-6 text-white shadow-2xl backdrop-blur-3xl">
              <div className="flex flex-col gap-2 text-[10px] font-black tracking-[0.3em] uppercase" role="menu">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    onKeyDown={(e) => handleKeyDown(e, item.id)}
                    role="menuitem"
                    className={`rounded-2xl px-6 py-5 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
                      currentScreen === item.id ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <a
                  href={whatsappOrderHref}
                  target="_blank"
                  rel="noreferrer"
                  role="menuitem"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-4 inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-5 text-center text-black shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-transform active:scale-95"
                  aria-label="Order via WhatsApp (opens in new tab)"
                >
                  order now <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
