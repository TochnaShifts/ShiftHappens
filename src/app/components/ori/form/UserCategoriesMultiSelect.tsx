"use client";

import { useEffect, useState } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Label } from "@/app/components/loveable/label";
import { Badge } from "@/app/components/loveable/badge";
import { UserCategory } from "@/app/shared/types/models";
import { getAllUserCategories } from "@/app/shared/firebase/CRUD/userCategories";
import { Check, X } from "lucide-react";

interface UserCategoriesMultiSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  error?: string;
  variant?: 'required' | 'forbidden';
}

export function UserCategoriesMultiSelect<T extends FieldValues>({
  name,
  control,
  label,
  error,
  variant = 'required'
}: UserCategoriesMultiSelectProps<T>) {
  const [categories, setCategories] = useState<UserCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await getAllUserCategories();
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Failed to load user categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getVariantStyles = (isSelected: boolean) => {
    if (variant === 'forbidden') {
      return isSelected
        ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
        : "bg-white hover:bg-red-50 text-gray-700 border-gray-300 hover:border-red-300";
    }
    return isSelected
      ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
      : "bg-white hover:bg-blue-50 text-gray-700 border-gray-300 hover:border-blue-300";
  };

  const getVariantIcon = () => {
    return variant === 'forbidden' ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {getVariantIcon()}
            <Label className="text-gray-700 font-medium">
              {label}
            </Label>
          </div>
          <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md bg-gray-50 min-h-[60px]">
            {isLoading ? (
              <div className="text-gray-500 text-sm">טוען קטגוריות...</div>
            ) : categories.length === 0 ? (
              <div className="text-gray-500 text-sm">אין קטגוריות זמינות</div>
            ) : (
              categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={field.value?.includes(category.id) ? "default" : "outline"}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    getVariantStyles(field.value?.includes(category.id) || false)
                  }`}
                  onClick={() => {
                    const currentValue = (field.value as string[]) || [];
                    const updated = currentValue.includes(category.id)
                      ? currentValue.filter((id: string) => id !== category.id)
                      : [...currentValue, category.id];
                    field.onChange(updated);
                  }}
                >
                  {category.displayName}
                </Badge>
              ))
            )}
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      )}
    />
  );
} 