"use client";

import { forwardRef, type TextareaHTMLAttributes, useState } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
  showCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helper, showCount = false, maxLength, className = "", id, onChange, ...props }, ref) => {
    const [count, setCount] = useState(0);
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
        <textarea
          ref={ref}
          id={inputId}
          maxLength={maxLength}
          className={`
            w-full bg-navy-light border rounded-xl px-4 py-3 text-white
            placeholder:text-slate-grey/50 resize-y min-h-[100px]
            focus:outline-none focus:ring-2 focus:ring-pistachio/50 focus:border-pistachio/50
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red-500/50 focus:ring-red-500/50" : "border-white/10"}
            ${className}
          `}
          onChange={(e) => {
            setCount(e.target.value.length);
            onChange?.(e);
          }}
          {...props}
        />
        <div className="flex justify-between mt-1.5">
          {error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : helper ? (
            <p className="text-sm text-slate-grey">{helper}</p>
          ) : (
            <span />
          )}
          {showCount && maxLength && (
            <span className="text-sm text-slate-grey">
              {count}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea, type TextareaProps };
