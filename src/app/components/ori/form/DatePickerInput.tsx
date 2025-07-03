import * as React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { he } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export function DatePickerInput<T extends FieldValues>({
  name,
  control,
  placeholder = "בחר תאריך",
  label,
  error,
  disabled,
}: DatePickerInputProps<T>) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLButtonElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node) &&
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="w-full relative">
          {label && (
            <label className="block mb-1 font-medium" htmlFor={name}>
              {label}
            </label>
          )}
          <button
            type="button"
            ref={ref}
            onClick={() => setOpen((v) => !v)}
            disabled={disabled}
            className={`w-full border rounded px-3 py-2 text-right bg-white ${error ? "border-red-500" : ""}`}
          >
            {field.value ? new Date(field.value).toLocaleDateString("he-IL") : placeholder}
          </button>
          {open && (
            <div
              ref={dialogRef}
              className="absolute z-50 bg-white border rounded-lg shadow-xl mt-2 right-0 p-4 transition-all duration-200 min-w-[280px] flex flex-col items-center"
              style={{ minWidth: ref.current?.offsetWidth || 280 }}
            >
              <DayPicker
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  field.onChange(date ? date.toISOString() : "");
                  setOpen(false);
                }}
                locale={he}
                dir="rtl"
              />
            </div>
          )}
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      )}
    />
  );
} 