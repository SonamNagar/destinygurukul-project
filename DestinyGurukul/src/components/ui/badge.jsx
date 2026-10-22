import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-indigo-100 text-primary",
        secondary:
          "border-transparent bg-background text-foreground",
        destructive:
          "border-transparent bg-red-100 text-red-700",
        success:
          "border-transparent bg-emerald-100 text-emerald-800",
        warning:
          "border-transparent bg-amber-100 text-amber-800",
        outline: "text-gray-700 border border-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge };
export default Badge;

