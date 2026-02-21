"use client";

import { motion } from "framer-motion";
import type { BracoMood } from "./animations";
import { eyeVariants } from "./animations";

interface BracoEyesProps {
  mood: BracoMood;
  size?: number;
}

function BracoEyes({ mood, size = 120 }: BracoEyesProps) {
  const scale = size / 120;
  const variants = eyeVariants[mood];

  return (
    <motion.g variants={variants} animate="animate">
      {/* Left eye */}
      <motion.circle
        cx={48 * scale}
        cy={38 * scale}
        r={4 * scale}
        fill="#A8E66E"
        style={{ filter: "drop-shadow(0 0 4px rgba(168, 230, 110, 0.8))" }}
      />
      {/* Right eye */}
      <motion.circle
        cx={62 * scale}
        cy={38 * scale}
        r={4 * scale}
        fill="#A8E66E"
        style={{ filter: "drop-shadow(0 0 4px rgba(168, 230, 110, 0.8))" }}
      />
      {/* Eye shine */}
      <circle cx={46 * scale} cy={36 * scale} r={1.5 * scale} fill="#fff" opacity={0.7} />
      <circle cx={60 * scale} cy={36 * scale} r={1.5 * scale} fill="#fff" opacity={0.7} />
    </motion.g>
  );
}

export { BracoEyes };
