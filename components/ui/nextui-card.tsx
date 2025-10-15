import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "relative overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        bordered: "border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900",
        shadow: "bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl",
        flat: "bg-slate-100 dark:bg-slate-800",
        blur: "bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
        xl: "rounded-2xl",
      },
      isHoverable: {
        true: "cursor-pointer hover:scale-[1.02] hover:shadow-2xl",
        false: "",
      },
      isPressable: {
        true: "cursor-pointer active:scale-[0.98]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "shadow",
      radius: "lg",
      isHoverable: false,
      isPressable: false,
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  disableAnimation?: boolean
}

const NextUICard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, radius, isHoverable, isPressable, disableAnimation, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, radius, isHoverable, isPressable }),
          disableAnimation && "transition-none",
          className
        )}
        {...props}
      />
    )
  }
)
NextUICard.displayName = "NextUICard"

const NextUICardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
NextUICardHeader.displayName = "NextUICardHeader"

const NextUICardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
NextUICardBody.displayName = "NextUICardBody"

const NextUICardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
NextUICardFooter.displayName = "NextUICardFooter"

export { NextUICard, NextUICardHeader, NextUICardBody, NextUICardFooter }
