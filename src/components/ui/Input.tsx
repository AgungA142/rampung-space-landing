"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  error?: string;
  helper?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, prefix, suffix, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-grey mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3 text-slate-grey pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full bg-navy-light border rounded-xl px-4 py-3 text-white
              placeholder:text-slate-grey/50
              focus:outline-none focus:ring-2 focus:ring-pistachio/50 focus:border-pistachio/50
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${prefix ? "pl-10" : ""}
              ${suffix ? "pr-10" : ""}
              ${error ? "border-red-500/50 focus:ring-red-500/50" : "border-white/10"}
              ${className}
            `}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 text-slate-grey pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
        {helper && !error && (
          <p className="mt-1.5 text-sm text-slate-grey">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, type InputProps };
