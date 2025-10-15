import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        solid: "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40",
        bordered: "border-2 border-primary bg-transparent text-primary hover:bg-primary/10",
        light: "bg-primary/10 text-primary hover:bg-primary/20",
        flat: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700",
        ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white",
        shadow: "bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-10 px-6",
        lg: "h-12 px-8 text-base",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
      radius: "lg",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  startContent?: React.ReactNode
  endContent?: React.ReactNode
}

const NextUIButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, radius, isLoading, startContent, endContent, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, radius, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <>
            {startContent}
            {children}
            {endContent}
          </>
        )}
      </button>
    )
  }
)
NextUIButton.displayName = "NextUIButton"

export { NextUIButton, buttonVariants }
