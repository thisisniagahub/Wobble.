"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

interface FAQScreenProps {
  currentFlavor: {
    bgColor: string;
    accentColor: string;
  };
  whatsappSupportHref: string;
}

const faqs = [
  {
    question: "How long does Wobble Panna Cotta last?",
    answer: "Our panna cotta is made fresh daily without any artificial preservatives. We recommend consuming it within 3-4 days from delivery for the best 'wobble' experience and optimal freshness. Always keep it refrigerated at 4°C."
  },
  {
    question: "Are your ingredients Halal-certified?",
    answer: "Yes, 100%. All our ingredients—from the premium dairy base to our artisanal toppings like Kunafa and Gula Melaka—are strictly sourced from Halal-certified suppliers. Our entire kitchen facility is pork-free and alcohol-free."
  },
  {
    question: "Do you deliver outside of Kuala Lumpur?",
    answer: "Currently, our cold-chain delivery service covers Kuala Lumpur and selected areas in Selangor (Klang Valley) to ensure the strict temperature control needed. We are working hard to expand our signature delivery to more states soon!"
  },
  {
    question: "Can I customize a box for corporate gifts or weddings?",
    answer: "Absolutely! We specialize in bespoke gifting experiences. We offer custom sleeves, personalized greeting cards, and special flavor requests for orders above 50 boxes. Please contact our WhatsApp concierge for a specialized quotation."
  },
  {
    question: "What makes your 'Pistachio Kunafa' special?",
    answer: "Our viral Pistachio Kunafa uses 100% pure roasted pistachio paste imported from Italy, layered with our signature creamy base, and crowned with hand-crisped buttery kunafa pastry. It's the perfect harmony of rich, nutty, and crunchy textures."
  }
];

export function FaqScreen({
  currentFlavor,
  whatsappSupportHref,
}: FAQScreenProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-start px-6 py-24 md:py-32 overflow-y-auto custom-scrollbar relative z-10"
      role="region"
      aria-label="Frequently Asked Questions"
    >
      {/* Immersive Background Glow */}
      <motion.div 
        className="fixed inset-0 opacity-10 blur-[150px] pointer-events-none -z-10"
        animate={{ backgroundColor: currentFlavor.bgColor }}
        transition={{ duration: 1 }}
      />

      <div className="w-full max-w-3xl flex flex-col items-center relative z-20">
        
        {/* Header Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 backdrop-blur-md border border-white/20 mb-8"
          >
            <MessageCircleQuestion className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-sans font-black text-white mb-6 uppercase tracking-tighter">
            We Got <span className="text-white/30">Answers.</span>
          </h2>
          <p className="text-lg text-white/50 font-medium">Everything you need to know about the perfect wobble.</p>
        </motion.div>

        {/* Accordion List */}
        <div className="w-full flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={`w-full overflow-hidden rounded-3xl border transition-all duration-500 cursor-pointer backdrop-blur-xl ${
                  isOpen 
                    ? 'bg-white/10 border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.3)]' 
                    : 'bg-white/[0.02] border-white/10 hover:bg-white/5 hover:border-white/20'
                }`}
              >
                {/* Question Row */}
                <div className="flex items-center justify-between p-6 md:p-8">
                  <h3 className={`text-lg md:text-xl font-bold tracking-tight transition-colors duration-300 ${isOpen ? 'text-white' : 'text-white/80'}`}>
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-300 ${
                      isOpen ? 'bg-white text-black border-white' : 'bg-transparent text-white/50 border-white/20'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </div>

                {/* Answer Reveal */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    >
                      <div className="px-6 md:px-8 pb-8 pt-0 text-white/60 leading-relaxed font-medium">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
        
        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-white/40 uppercase tracking-[0.2em] font-bold">
            Still have questions? <a href={whatsappSupportHref} target="_blank" rel="noopener noreferrer" className="text-white hover:underline underline-offset-4">Chat with us on WhatsApp</a>.
          </p>
        </motion.div>

      </div>
    </motion.div>
  );
}
