"use client";

import { ToggleGroup, ToggleGroupItem } from "@/app/components/loveable/toggle-group";
import { Select, SelectItem } from "@/app/components/loveable/select";
import { Button } from "@/app/components/loveable/button";
import { Calendar as CalendarIcon, Filter, Plus, Calendar as CalendarViewIcon, List } from "lucide-react";
import { useRouter } from "next/navigation";

interface CalendarHeaderProps {
  viewMode: "calendar" | "list";
  setViewMode: (mode: "calendar" | "list") => void;
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
  groups: { value: string; label: string }[];
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  viewMode,
  setViewMode,
  selectedGroup,
  setSelectedGroup,
  groups,
}) => {
  const router = useRouter();
  const handleNewRequest = () => router.push('/user/requests');

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">לוח שנה</h1>
              <p className="text-sm text-gray-600">צפה ונהל את המשמרות שלך</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 sm:space-x-reverse gap-2">
            <ToggleGroup 
              type="single" 
              value={viewMode} 
              onValueChange={(value) => value && setViewMode(value as "calendar" | "list")}
              className="border border-gray-200 rounded-lg w-full sm:w-auto"
            >
              <ToggleGroupItem value="calendar" aria-label="תצוגת לוח שנה" size="sm" className="flex-1 sm:flex-initial px-3 py-2">
                <CalendarViewIcon className="w-4 h-4 ml-2" />
                לוח שנה
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="תצוגת רשימה" size="sm" className="flex-1">
                <List className="w-4 h-4 ml-2" />
                רשימה
              </ToggleGroupItem>
            </ToggleGroup>
            <Select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)} dir="rtl" placeholder="בחר קבוצה">
              {groups.map((group) => (
                <SelectItem key={group.value} value={group.value}>{group.label}</SelectItem>
              ))}
            </Select>
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700" onClick={handleNewRequest} dir="ltr">
              <Plus className="w-4 h-4 ml-2" />
              בקשת חופש
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}; 