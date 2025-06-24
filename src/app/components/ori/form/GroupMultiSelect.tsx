"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/app/components/loveable/checkbox";
import { Label } from "@/app/components/loveable/label";
import { Users } from "lucide-react";
import { Badge } from "../../loveable/badge";

interface Group {
  id: string;
  displayName: string;
}

interface Props {
  selected: string[];
  onChange: (updated: string[]) => void;
  error?: { message?: string };
}

export const GroupMultiSelect = ({ selected, onChange, error }: Props) => {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch("/api/groups");
        const data = await res.json();
        setGroups(data || []);
      } catch (e) {
        console.error("Failed to load groups");
      }
    };
    fetchGroups();
  }, []);

  const toggleGroup = (id: string) => {
    const updated = selected.includes(id)
      ? selected.filter((v) => v !== id)
      : [...selected, id];
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-purple-600" />
        <Label className="text-gray-700 font-medium">
          קבוצות <span className="text-red-500">*</span>
        </Label>
      </div>
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md bg-gray-50 min-h-[60px]">
        {groups.map((group) => (
          <Badge
            key={group.id}
            variant={selected.includes(group.id) ? "default" : "outline"}
            className={`cursor-pointer transition-all hover:scale-105 ${
              selected.includes(group.id)
                ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                : "bg-white hover:bg-blue-50 text-gray-700 border-gray-300 hover:border-blue-300"
            }`}
            onClick={() => toggleGroup(group.id)}
          >
            {group.displayName}
          </Badge>
        ))}
      </div>
      <p className="text-sm text-gray-500 min-h-[17px]">
        {selected.length === 0 ? "יש לבחור לפחות קבוצה אחת" : "\u00A0"}
      </p>
    </div>
  );
};
