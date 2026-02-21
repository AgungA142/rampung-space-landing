"use client";

import { motion } from "framer-motion";

interface BracoParticlesProps {
  size?: number;
}

const particles = [
  { text: "01", x: 0, y: 20, delay: 0 },
  { text: "fn()", x: 95, y: 15, delay: 0.5 },
  { text: "//", x: 10, y: 70, delay: 1 },
  { text: ";", x: 100, y: 65, delay: 1.5 },
  { text: "</>", x: 5, y: 45, delay: 2 },
  { text: "{}", x: 98, y: 42, delay: 2.5 },
];

function BracoParticles({ size = 120 }: BracoParticlesProps) {
  const scale = size / 120;

  return (
    <g>
      {particles.map((p, i) => (
        <motion.text
          key={i}
          x={p.x * scale}
          y={p.y * scale}
          fontSize={8 * scale}
          fontFamily="var(--font-space-mono), monospace"
          fill="#A8E66E"
          opacity={0.4}
          initial={{ opacity: 0, y: p.y * scale }}
          animate={{
            opacity: [0, 0.4, 0],
            y: [p.y * scale, (p.y - 20) * scale, p.y * scale],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          {p.text}
        </motion.text>
      ))}
    </g>
  );
}

export { BracoParticles };
