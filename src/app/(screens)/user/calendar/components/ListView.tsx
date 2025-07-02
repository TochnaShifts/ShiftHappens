'use client';

import { Badge } from "@/app/components/loveable/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/loveable/card";
import { Button } from "@/app/components/loveable/button";
import { Clock, MapPin } from "lucide-react";
import { Shift } from "@/app/shared/types";
import { getGroupColor } from "./utils";

function formatTimeRange(start: Date, end: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(start.getHours())}:${pad(start.getMinutes())}-${pad(end.getHours())}:${pad(end.getMinutes())}`;
}

interface ListViewProps {
  shifts: (Shift & { groupName?: string })[];
  selectedGroup: string;
  currentUserId: string;
}

export const ListView: React.FC<ListViewProps> = ({ shifts, selectedGroup, currentUserId }) => {
  // Filter and group shifts by date
  const filteredShifts = selectedGroup === "all"
    ? shifts
    : shifts.filter(shift => shift.groupId === selectedGroup);

  // Get unique groupIds from all shifts for consistent coloring
  const uniqueGroupIds = Array.from(new Set(shifts.map((shift) => shift.groupId)));

  const shiftsByDate: { [date: string]: (Shift & { groupName?: string })[] } = {};
  filteredShifts.forEach(shift => {
    const date = new Date(shift.startDate);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    if (!shiftsByDate[dateStr]) shiftsByDate[dateStr] = [];
    shiftsByDate[dateStr].push(shift);
  });

  const sortedDates = Object.keys(shiftsByDate).sort();

  return (
    <div className="space-y-4">
      {sortedDates.length === 0 && (
        <div className="text-center text-gray-500 py-8">אין משמרות להצגה</div>
      )}
      {sortedDates.map(date => (
        <Card key={date} className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {new Date(date).toLocaleDateString('he-IL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {shiftsByDate[date].map(shift => {
                const start = new Date(shift.startDate);
                const end = new Date(shift.endDate);
                const isAssigned = shift.users.includes(currentUserId);
                return (
                  <div
                    key={shift.id}
                    className={`p-4 rounded-lg border transition-colors ${getGroupColor(shift.groupId, uniqueGroupIds)}`}
                  >
                    <div className="flex flex-row flex-wrap sm:flex-nowrap sm:items-center sm:justify-between gap-x-3 gap-y-2">
                      <div className="flex-1">
                        <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                          <h4 className="font-semibold text-gray-900">{shift.displayName}</h4>
                        </div>
                        <div className="flex flex-row flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTimeRange(start, end)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{shift.groupName || shift.groupId}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 mt-2 sm:mt-0">
                        {isAssigned && (
                          <div className="text-sm font-medium text-green-600 mb-1">
                            +{shift.points} נקודות
                          </div>
                        )}
                        {!isAssigned && (
                          <Button size="sm" variant="outline">
                            הירשם למשמרת
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 