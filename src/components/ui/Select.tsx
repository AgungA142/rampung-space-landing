"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helper, options, placeholder, className = "", id, ...props }, ref) => {
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
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={`
              w-full appearance-none bg-navy-light border rounded-xl px-4 py-3 pr-10 text-white
              focus:outline-none focus:ring-2 focus:ring-pistachio/50 focus:border-pistachio/50
              transition-all duration-200 cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? "border-red-500/50 focus:ring-red-500/50" : "border-white/10"}
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-grey pointer-events-none"
            size={18}
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
        {helper && !error && (
          <p className="mt-1.5 text-sm text-slate-grey">{helper}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select, type SelectProps, type SelectOption };
