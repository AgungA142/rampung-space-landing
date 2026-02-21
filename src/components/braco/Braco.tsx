"use client";

import { motion } from "framer-motion";
import type { BracoMood } from "./animations";
import { BracoBody } from "./BracoBody";
import { BracoEyes } from "./BracoEyes";
import { BracoLegs } from "./BracoLegs";
import { BracoParticles } from "./BracoParticles";

interface BracoProps {
  mood?: BracoMood;
  size?: number;
  showParticles?: boolean;
  className?: string;
}

function Braco({
  mood = "idle",
  size = 120,
  showParticles = true,
  className = "",
}: BracoProps) {
  return (
    <motion.div
      className={`inline-block ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Glow background */}
        <defs>
          <radialGradient id="bracoGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A8E66E" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#A8E66E" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.4}
          fill="url(#bracoGlow)"
        />

        {showParticles && <BracoParticles size={size} />}
        <BracoBody mood={mood} size={size} />
        <BracoEyes mood={mood} size={size} />
        <BracoLegs mood={mood} size={size} />
      </svg>
    </motion.div>
  );
}

export { Braco, type BracoProps };
export type { BracoMood } from "./animations";
