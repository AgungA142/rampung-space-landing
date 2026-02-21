"use client";

import { motion } from "framer-motion";
import type { BracoMood } from "./animations";
import { legVariants } from "./animations";

interface BracoLegsProps {
  mood: BracoMood;
  size?: number;
}

function BracoLegs({ mood, size = 120 }: BracoLegsProps) {
  const scale = size / 120;
  const variants = legVariants[mood];

  return (
    <motion.g variants={variants} animate="animate">
      {/* Left leg */}
      <motion.line
        x1={57 * scale}
        y1={78 * scale}
        x2={53 * scale}
        y2={92 * scale}
        stroke="#A8E66E"
        strokeWidth={3 * scale}
        strokeLinecap="round"
      />
      {/* Left shoe */}
      <motion.ellipse
        cx={51 * scale}
        cy={94 * scale}
        rx={5 * scale}
        ry={3 * scale}
        fill="#6B9B4E"
      />

      {/* Right leg */}
      <motion.line
        x1={71 * scale}
        y1={78 * scale}
        x2={75 * scale}
        y2={92 * scale}
        stroke="#A8E66E"
        strokeWidth={3 * scale}
        strokeLinecap="round"
      />
      {/* Right shoe */}
      <motion.ellipse
        cx={77 * scale}
        cy={94 * scale}
        rx={5 * scale}
        ry={3 * scale}
        fill="#6B9B4E"
      />
    </motion.g>
  );
}

export { BracoLegs };
