// components/CategoryMultiSelect.tsx
"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/app/components/loveable/checkbox";
import { Label } from "@/app/components/loveable/label";
import { Tag } from "lucide-react";
import { Badge } from "../loveable/badge";

interface Category {
  id: string;
  displayName: string;
}

interface Props {
  selected: string[];
  onChange: (updated: string[]) => void;
  error?: { message?: string };
}

export const CategoryMultiSelect = ({ selected, onChange, error }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/user-categories");
        const data = await res.json();
        setCategories(data || []);
      } catch (e) {
        console.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const toggleCategory = (id: string) => {
    const updated = selected.includes(id)
      ? selected.filter((v) => v !== id)
      : [...selected, id];
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-purple-600" />
        <Label className="text-gray-700 font-medium">
          קטגוריות משתמש (אופציונלי)
        </Label>
      </div>
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md bg-gray-50 min-h-[60px]">
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={selected.includes(category.id) ? "default" : "outline"}
            className={`cursor-pointer transition-all hover:scale-105 ${
              selected.includes(category.id)
                ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                : "bg-white hover:bg-purple-50 text-gray-700 border-gray-300 hover:border-purple-300"
            }`}
            onClick={() => toggleCategory(category.id)}
          >
            {category.displayName}
          </Badge>
        ))}
      </div>
      {error && <p className="text-red-600 text-sm">{error.message}</p>}
    </div>
  );
};
