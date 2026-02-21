"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "ref"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-pistachio text-midnight hover:bg-pistachio-light shadow-glow hover:shadow-glow-lg",
  secondary:
    "bg-navy-light text-white hover:bg-navy border border-slate-grey/20",
  outline:
    "border-2 border-pistachio text-pistachio hover:bg-pistachio/10",
  ghost:
    "text-slate-grey hover:text-white hover:bg-white/5",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-6 py-3 text-base gap-2",
  lg: "px-8 py-4 text-lg gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconRight,
      fullWidth = false,
      children,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const motionProps: HTMLMotionProps<"button"> = {
      whileHover: disabled || loading ? undefined : { scale: 1.02 },
      whileTap: disabled || loading ? undefined : { scale: 0.98 },
      transition: { type: "spring", stiffness: 400, damping: 17 },
    };

    return (
      <motion.button
        ref={ref}
        className={`
          inline-flex items-center justify-center font-semibold rounded-xl
          transition-colors duration-200 cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        disabled={disabled || loading}
        {...motionProps}
        {...(props as HTMLMotionProps<"button">)}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={size === "sm" ? 16 : 20} />
        ) : icon ? (
          icon
        ) : null}
        {children}
        {iconRight && !loading ? iconRight : null}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
