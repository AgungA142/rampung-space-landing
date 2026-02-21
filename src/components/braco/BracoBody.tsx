"use client";

import { motion } from "framer-motion";
import type { BracoMood } from "./animations";
import { bodyVariants } from "./animations";

interface BracoBodyProps {
  mood: BracoMood;
  size?: number;
}

function BracoBody({ mood, size = 120 }: BracoBodyProps) {
  const scale = size / 120;
  const variants = bodyVariants[mood];

  return (
    <motion.g variants={variants} animate="animate">
      {/* Left curly brace */}
      <motion.text
        x={15 * scale}
        y={70 * scale}
        fontSize={72 * scale}
        fontFamily="var(--font-space-mono), monospace"
        fontWeight="bold"
        fill="#A8E66E"
        style={{ filter: "drop-shadow(0 0 8px rgba(168, 230, 110, 0.5))" }}
      >
        {"{"}
      </motion.text>

      {/* Right curly brace */}
      <motion.text
        x={70 * scale}
        y={70 * scale}
        fontSize={72 * scale}
        fontFamily="var(--font-space-mono), monospace"
        fontWeight="bold"
        fill="#A8E66E"
        style={{ filter: "drop-shadow(0 0 8px rgba(168, 230, 110, 0.5))" }}
      >
        {"}"}
      </motion.text>

      {/* Mouth - simple smile */}
      <motion.path
        d={`M ${54 * scale} ${55 * scale} Q ${64 * scale} ${62 * scale} ${74 * scale} ${55 * scale}`}
        stroke="#A8E66E"
        strokeWidth={2.5 * scale}
        fill="none"
        strokeLinecap="round"
      />
    </motion.g>
  );
}

export { BracoBody };
