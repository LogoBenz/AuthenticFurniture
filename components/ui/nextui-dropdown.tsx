import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const NextUIDropdown = DropdownMenuPrimitive.Root

const NextUIDropdownTrigger = DropdownMenuPrimitive.Trigger

const NextUIDropdownGroup = DropdownMenuPrimitive.Group

const NextUIDropdownPortal = DropdownMenuPrimitive.Portal

const NextUIDropdownSub = DropdownMenuPrimitive.Sub

const NextUIDropdownRadioGroup = DropdownMenuPrimitive.RadioGroup

const NextUIDropdownSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-lg px-3 py-2 text-sm outline-none focus:bg-slate-100 dark:focus:bg-slate-800 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800 transition-colors",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
NextUIDropdownSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

const NextUIDropdownSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 text-slate-950 dark:text-slate-50 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
NextUIDropdownSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

const NextUIDropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[12rem] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1 text-slate-950 dark:text-slate-50 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
NextUIDropdownContent.displayName = DropdownMenuPrimitive.Content.displayName

const NextUIDropdownItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors focus:bg-slate-100 dark:focus:bg-slate-800 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
))
NextUIDropdownItem.displayName = DropdownMenuPrimitive.Item.displayName

const NextUIDropdownSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-slate-200 dark:bg-slate-700", className)}
    {...props}
  />
))
NextUIDropdownSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

export {
  NextUIDropdown,
  NextUIDropdownTrigger,
  NextUIDropdownContent,
  NextUIDropdownItem,
  NextUIDropdownSeparator,
  NextUIDropdownGroup,
  NextUIDropdownPortal,
  NextUIDropdownSub,
  NextUIDropdownSubContent,
  NextUIDropdownSubTrigger,
  NextUIDropdownRadioGroup,
}
