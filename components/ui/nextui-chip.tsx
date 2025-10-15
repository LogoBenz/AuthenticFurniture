import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex items-center gap-1 font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        solid: "bg-primary text-primary-foreground",
        bordered: "border-2 border-primary bg-transparent text-primary",
        light: "bg-primary/10 text-primary",
        flat: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white",
        faded: "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white",
        shadow: "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
        dot: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white",
      },
      size: {
        sm: "h-6 px-2 text-xs",
        md: "h-7 px-3 text-sm",
        lg: "h-8 px-4 text-base",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
        full: "rounded-full",
      },
      color: {
        default: "",
        primary: "bg-blue-500 text-white",
        secondary: "bg-purple-500 text-white",
        success: "bg-green-500 text-white",
        warning: "bg-yellow-500 text-white",
        danger: "bg-red-500 text-white",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
      radius: "full",
      color: "default",
    },
  }
)

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  startContent?: React.ReactNode
  endContent?: React.ReactNode
  onClose?: () => void
}

const NextUIChip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, variant, size, radius, color, startContent, endContent, onClose, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(chipVariants({ variant, size, radius, color, className }))}
        {...props}
      >
        {startContent}
        <span>{children}</span>
        {endContent}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 p-0.5 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    )
  }
)
NextUIChip.displayName = "NextUIChip"

export { NextUIChip, chipVariants }
