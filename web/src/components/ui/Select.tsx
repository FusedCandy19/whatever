import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, label, id, children, ...props }, ref) => (
  <div className="space-y-1">
    {label && <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>}
    <select
      ref={ref}
      id={id}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  </div>
));
Select.displayName = "Select";
export { Select };
