"use client";

import { type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

type CardVariant = "default" | "elevated" | "outline" | "interactive";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-navy border border-white/5",
  elevated: "bg-navy shadow-card border border-white/5",
  outline: "bg-transparent border-2 border-slate-grey/30",
  interactive:
    "bg-navy border border-white/5 cursor-pointer hover:border-pistachio/30 hover:shadow-card-hover",
};

const paddingClasses: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

function Card({
  variant = "default",
  padding = "md",
  children,
  className = "",
  onClick,
}: CardProps) {
  const motionProps: HTMLMotionProps<"div"> =
    variant === "interactive"
      ? {
          whileHover: { y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } },
        }
      : {};

  return (
    <motion.div
      className={`rounded-2xl transition-all duration-300 ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

export { Card, type CardProps, type CardVariant, type CardPadding };
