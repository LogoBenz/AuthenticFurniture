import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const NextUITabs = TabsPrimitive.Root

const NextUITabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    variant?: "solid" | "underlined" | "bordered" | "light"
    radius?: "none" | "sm" | "md" | "lg" | "full"
  }
>(({ className, variant = "solid", radius = "lg", ...props }, ref) => {
  const variantClasses = {
    solid: "bg-slate-100 dark:bg-slate-800 p-1",
    underlined: "border-b border-slate-200 dark:border-slate-700",
    bordered: "border-2 border-slate-200 dark:border-slate-700 p-1",
    light: "bg-transparent",
  }

  const radiusClasses = {
    none: "rounded-none",
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
    full: "rounded-full",
  }

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center text-slate-500 dark:text-slate-400",
        variantClasses[variant],
        variant !== "underlined" && radiusClasses[radius],
        className
      )}
      {...props}
    />
  )
})
NextUITabsList.displayName = TabsPrimitive.List.displayName

const NextUITabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: "solid" | "underlined" | "bordered" | "light"
  }
>(({ className, variant = "solid", ...props }, ref) => {
  const variantClasses = {
    solid: "data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm rounded-lg",
    underlined: "border-b-2 border-transparent data-[state=active]:border-primary rounded-none",
    bordered: "data-[state=active]:border-2 data-[state=active]:border-primary rounded-lg",
    light: "data-[state=active]:bg-primary/10 rounded-lg",
  }

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:data-[state=active]:text-slate-50",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
})
NextUITabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const NextUITabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
      className
    )}
    {...props}
  />
))
NextUITabsContent.displayName = TabsPrimitive.Content.displayName

export { NextUITabs, NextUITabsList, NextUITabsTrigger, NextUITabsContent }
