"use client";

import { motion } from "motion/react";
import Image from "next/image";

interface JarComponentProps {
  currentFlavor: {
    id: string;
    category: string;
    name: string;
    headline: string;
    subtitle: string;
    ghostText: string;
    bgColor: string;
    accentColor: string;
    imagePath: string;
  };
  className?: string;
  enableHover?: boolean;
  priority?: boolean;
}

export function JarComponent({
  currentFlavor,
  className = "",
  enableHover = true,
  priority = false
}: JarComponentProps) {
  return (
    <div
      className={`relative flex items-center justify-center z-30 will-change-transform transform-gpu ${className}`}
    >
      {/* Product Image - Contextual Sizing */}
      {/* Product Image - Contextual Sizing with Floating Wobble Animation */}
      <motion.div 
        className="relative w-full h-full flex items-center justify-center"
        animate={{
          y: enableHover ? [0, -8, 0] : [0, -4, 0],
          rotateZ: enableHover ? [0, 1.5, -0.75, 0] : [0, 0.75, -0.35, 0]
        }}
        transition={{
          duration: 4.5, // Fixed duration to resolve pure function lint
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Image
          src={currentFlavor.imagePath}
          alt={currentFlavor.name}
          width={800} 
          height={1000}
          className="relative z-10 drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] object-contain"
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
        />
      </motion.div>
    </div>
  );
}
