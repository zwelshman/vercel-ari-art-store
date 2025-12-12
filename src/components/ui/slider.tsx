"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
  disabled?: boolean;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  className,
  disabled = false,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between">
          {label && (
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              {value}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 dark:bg-gray-700 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: `linear-gradient(to right, rgb(147 51 234) 0%, rgb(147 51 234) ${percentage}%, rgb(229 231 235) ${percentage}%, rgb(229 231 235) 100%)`,
          }}
        />
      </div>
    </div>
  );
}
