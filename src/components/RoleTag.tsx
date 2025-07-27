import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/types/user"

const roleTagVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full font-medium transition-colors border",
  {
    variants: {
      variant: {
        default: "px-2.5 py-1 text-xs sm:text-sm",
        compact: "px-2 py-0.5 text-[10px] sm:text-xs",
      },
      role: {
        development: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
        "non-development": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
      },
    },
    defaultVariants: {
      variant: "default",
      role: "development",
    },
  }
)

export interface RoleTagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof roleTagVariants> {
  roles: UserRole[]
  variant?: 'default' | 'compact'
}

function RoleTag({ 
  roles, 
  variant = "default", 
  className, 
  ...props 
}: RoleTagProps) {
  if (!roles || roles.length === 0) {
    return null
  }

  // Remove duplicates while preserving order
  const uniqueRoles = Array.from(new Set(roles))

  return (
    <div className={cn("flex gap-1 flex-wrap", className)} {...props}>
      {uniqueRoles.map((role) => {
        const roleKey = role.toLowerCase().replace(' ', '-') as 'development' | 'non-development'
        return (
          <span
            key={role}
            className={roleTagVariants({ variant, role: roleKey })}
            aria-label={`Relevant for ${role} role`}
            role="img"
          >
            {role}
          </span>
        )
      })}
    </div>
  )
}

export { RoleTag, roleTagVariants }