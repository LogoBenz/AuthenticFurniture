import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const avatarVariants = cva(
  "relative inline-flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold",
  {
    variants: {
      size: {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
        full: "rounded-full",
      },
      bordered: {
        true: "ring-2 ring-white dark:ring-slate-900 ring-offset-2",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      radius: "full",
      bordered: false,
    },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  name?: string
  showFallback?: boolean
  status?: "online" | "offline" | "away" | "busy"
}

const NextUIAvatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, radius, bordered, src, alt, name, showFallback = true, status, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false)

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    const statusColors = {
      online: "bg-green-500",
      offline: "bg-slate-400",
      away: "bg-yellow-500",
      busy: "bg-red-500",
    }

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, radius, bordered, className }))}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || name}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : showFallback && name ? (
          <span>{getInitials(name)}</span>
        ) : (
          <svg
            className="h-1/2 w-1/2 text-slate-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        )}
        
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900",
              statusColors[status]
            )}
          />
        )}
      </div>
    )
  }
)
NextUIAvatar.displayName = "NextUIAvatar"

export { NextUIAvatar, avatarVariants }
