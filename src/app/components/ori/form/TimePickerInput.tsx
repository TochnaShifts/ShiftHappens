"use client"

import * as React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Clock } from "lucide-react";

interface TimePickerInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export function TimePickerInput<T extends FieldValues>({
  name,
  control,
  placeholder = "בחר שעה",
  label,
  error,
  disabled,
}: TimePickerInputProps<T>) {
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
            className={`w-full border rounded px-3 py-2 text-right bg-white flex items-center justify-between ${error ? "border-red-500" : "border-gray-300"}`}
          >
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{field.value || placeholder}</span>
          </button>
          {open && (
            <div
              ref={dialogRef}
              className="absolute z-50 bg-white border rounded-lg shadow-xl mt-2 right-0 p-2 transition-all duration-200 max-h-60 overflow-y-auto"
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
                  className="w-full text-right px-3 py-2 hover:bg-gray-100 rounded text-sm"
                >
                  {time}
                </button>
              ))}
            </div>
          )}
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      )}
    />
  );
} 