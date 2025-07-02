import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/app/components/utils/utils"

// Native Select with custom UI and placeholder support
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
}
const Select = React.forwardRef<
  HTMLSelectElement,
  SelectProps
>(({ className, children, placeholder, ...props }, ref) => (
  <div className={cn("relative w-full", className)} >
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none [&>span]:line-clamp-1",
        className
      )}
      {...props}
    >
      {placeholder && (
        <option value="" disabled hidden>{placeholder}</option>
      )}
      {children}
    </select>
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
      <ChevronDown className="h-4 w-4 opacity-50" />
    </span>
  </div>
))
Select.displayName = "Select"

const SelectItem = React.forwardRef<
  HTMLOptionElement,
  React.OptionHTMLAttributes<HTMLOptionElement>
>(({ className, children, ...props }, ref) => (
  <option ref={ref} className={className} {...props}>
    {children}
  </option>
))
SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectItem,
}
