import type { Variants } from "framer-motion";

export type BracoMood = "idle" | "wave" | "thinking" | "celebrate" | "walk";

export const bodyVariants: Record<BracoMood, Variants> = {
  idle: {
    animate: {
      y: [0, -4, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  },
  wave: {
    animate: {
      rotate: [0, -5, 5, -5, 0],
      transition: { duration: 1.5, repeat: 2 },
    },
  },
  thinking: {
    animate: {
      y: [0, -2, 0],
      transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
    },
  },
  celebrate: {
    animate: {
      y: [0, -20, 0],
      scale: [1, 1.1, 1],
      transition: { duration: 0.6, repeat: 3, ease: "easeOut" },
    },
  },
  walk: {
    animate: {
      x: [0, 10, 0, -10, 0],
      transition: { duration: 2, repeat: Infinity, ease: "linear" },
    },
  },
};

export const eyeVariants: Record<BracoMood, Variants> = {
  idle: {
    animate: {
      scaleY: [1, 1, 0.1, 1, 1],
      transition: { duration: 3.5, repeat: Infinity, times: [0, 0.9, 0.95, 1, 1] },
    },
  },
  wave: {
    animate: {
      scaleY: 1,
    },
  },
  thinking: {
    animate: {
      rotate: [0, 360],
      transition: { duration: 1.5, repeat: Infinity, ease: "linear" },
    },
  },
  celebrate: {
    animate: {
      scaleY: [1, 0.3, 1],
      scaleX: [1, 1.2, 1],
      transition: { duration: 0.3, repeat: 5 },
    },
  },
  walk: {
    animate: {
      scaleY: [1, 1, 0.1, 1],
      transition: { duration: 3, repeat: Infinity },
    },
  },
};

export const legVariants: Record<BracoMood, Variants> = {
  idle: {
    animate: {
      y: [0, 2, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  },
  wave: {
    animate: {
      y: 0,
    },
  },
  thinking: {
    animate: {
      y: [0, 1, 0],
      transition: { duration: 1, repeat: Infinity },
    },
  },
  celebrate: {
    animate: {
      y: [0, -8, 0],
      rotate: [0, -10, 10, 0],
      transition: { duration: 0.4, repeat: 3 },
    },
  },
  walk: {
    animate: {
      rotate: [-15, 15],
      transition: { duration: 0.4, repeat: Infinity, repeatType: "reverse" as const },
    },
  },
};

export const particleVariants: Variants = {
  initial: { opacity: 0, y: 0 },
  animate: {
    opacity: [0, 1, 0],
    y: -30,
    x: [0, 10, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeOut" },
  },
};
