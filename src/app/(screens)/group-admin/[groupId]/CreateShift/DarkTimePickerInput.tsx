"use client"

import * as React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Clock } from "lucide-react";

interface DarkTimePickerInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
}

export function DarkTimePickerInput<T extends FieldValues>({
  name,
  control,
  placeholder = "בחר שעה",
  error,
  touched,
  disabled,
}: DarkTimePickerInputProps<T>) {
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

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

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
            className={`w-full border border-white/20 rounded px-3 py-2 text-right bg-white/10 text-white flex items-center justify-between ${error ? "border-red-500" : ""}`}
          >
            <Clock className="h-4 w-4 text-gray-300" />
            <span>{field.value || placeholder}</span>
          </button>
          {open && (
            <div
              ref={dialogRef}
              className="absolute z-50 bg-gray-900 border border-white/20 rounded-lg shadow-xl mt-2 right-0 p-2 transition-all duration-200 max-h-60 overflow-y-auto"
              style={{ minWidth: ref.current?.offsetWidth || 200 }}
            >
              {timeOptions.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => {
                    field.onChange(time);
                    setOpen(false);
                  }}
                  className="w-full text-right px-3 py-2 hover:bg-white/10 rounded text-sm text-white"
                >
                  {time}
                </button>
              ))}
            </div>
          )}
          {error && touched && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
      )}
    />
  );
} 