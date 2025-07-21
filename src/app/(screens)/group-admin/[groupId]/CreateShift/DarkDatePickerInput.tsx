import * as React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { he } from "date-fns/locale";

interface DarkDatePickerInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
}

export function DarkDatePickerInput<T extends FieldValues>({
  name,
  control,
  placeholder = "בחר תאריך",
  error,
  touched,
  disabled,
}: DarkDatePickerInputProps<T>) {
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
          <button
            type="button"
            ref={ref}
            onClick={() => setOpen((v) => !v)}
            disabled={disabled}
            className={`w-full border border-white/20 rounded px-3 py-2 text-right bg-white/10 text-white placeholder:text-gray-400 ${error ? "border-red-500" : ""}`}
          >
            {field.value ? new Date(field.value).toLocaleDateString("he-IL") : placeholder}
          </button>
          {open && (
            <div
              ref={dialogRef}
              className="absolute z-50 bg-gray-900 border border-white/20 rounded-lg shadow-xl mt-2 right-0 p-4 transition-all duration-200 min-w-[280px] flex flex-col items-center"
              style={{ minWidth: ref.current?.offsetWidth || 280 }}
            >
              <div className="text-white [&_.rdp]:text-white [&_.rdp-button]:text-white [&_.rdp-nav_button]:text-white [&_.rdp-caption_label]:text-white [&_.rdp-head_cell]:text-gray-300 [&_.rdp-day]:text-white [&_.rdp-day_selected]:bg-blue-600 [&_.rdp-day_selected]:text-white [&_.rdp-day_today]:bg-blue-600/20 [&_.rdp-day_outside]:text-gray-500 [&_.rdp-day_disabled]:text-gray-500">
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
            </div>
          )}
          {error && touched && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
      )}
    />
  );
} 