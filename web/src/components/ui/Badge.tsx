import { type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
      {
        "bg-primary/20 text-primary": variant === "default",
        "bg-green-500/20 text-green-400": variant === "success",
        "bg-amber-500/20 text-amber-400": variant === "warning",
        "bg-destructive/20 text-destructive": variant === "destructive",
        "border border-border text-muted-foreground": variant === "outline",
      },
      className
    )} {...props} />
  );
}
