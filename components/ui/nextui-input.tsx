import * as React from "react"
import { cn } from "@/lib/utils"

export interface NextUIInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  variant?: "flat" | "bordered" | "faded" | "underlined"
  radius?: "none" | "sm" | "md" | "lg" | "full"
  startContent?: React.ReactNode
  endContent?: React.ReactNode
  isInvalid?: boolean
  errorMessage?: string
}

const NextUIInput = React.forwardRef<HTMLInputElement, NextUIInputProps>(
  ({ 
    className, 
    type, 
    label, 
    variant = "flat",
    radius = "lg",
    startContent,
    endContent,
    isInvalid,
    errorMessage,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)

    const variantClasses = {
      flat: "bg-slate-100 dark:bg-slate-800 border-2 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700",
      bordered: "bg-transparent border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500",
      faded: "bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
      underlined: "bg-transparent border-b-2 border-slate-300 dark:border-slate-600 rounded-none hover:border-slate-400 dark:hover:border-slate-500",
    }

    const radiusClasses = {
      none: "rounded-none",
      sm: "rounded-md",
      md: "rounded-lg",
      lg: "rounded-xl",
      full: "rounded-full",
    }

    return (
      <div className="w-full">
        <div className={cn(
          "relative w-full transition-all duration-200",
          variantClasses[variant],
          radiusClasses[radius],
          isFocused && "ring-2 ring-primary ring-offset-2",
          isInvalid && "border-red-500 ring-red-500"
        )}>
          {label && (
            <label
              className={cn(
                "absolute left-3 transition-all duration-200 pointer-events-none text-slate-500 dark:text-slate-400",
                (isFocused || hasValue) 
                  ? "top-2 text-xs font-medium text-primary" 
                  : "top-1/2 -translate-y-1/2 text-sm"
              )}
            >
              {label}
            </label>
          )}
          <div className="flex items-center gap-2 px-3">
            {startContent && (
              <div className="flex-shrink-0 text-slate-400">
                {startContent}
              </div>
            )}
            <input
              type={type}
              className={cn(
                "flex h-12 w-full bg-transparent py-2 text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50",
                label && "pt-6 pb-2",
                className
              )}
              ref={ref}
              onFocus={() => setIsFocused(true)}
              onBlur={(e) => {
                setIsFocused(false)
                setHasValue(e.target.value !== '')
              }}
              onChange={(e) => setHasValue(e.target.value !== '')}
              {...props}
            />
            {endContent && (
              <div className="flex-shrink-0 text-slate-400">
                {endContent}
              </div>
            )}
          </div>
        </div>
        {isInvalid && errorMessage && (
          <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
        )}
      </div>
    )
  }
)
NextUIInput.displayName = "NextUIInput"

export { NextUIInput }
