"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/loveable/card";
import { Button } from "@/app/components/loveable/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayShiftsDialog } from "./DayShiftsDialog";
import { Request, RequestType, Shift } from "@/app/shared/types";
import { getGroupColor } from "./groupColorUtils";
import { dayNames, formatTimeRange, getDaysInMonth, getExcludeRequestsForDate, getShiftsForDate, monthNames } from "./utils";


interface CalendarMonthViewProps {
  currentDate: Date;
  shifts: (Shift & { groupName?: string })[];
  requests: Request[];
  selectedGroup: string;
  currentUserId: string;
  navigateMonth: (direction: "prev" | "next") => void;
}

export const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({currentDate,shifts,requests,selectedGroup,currentUserId,navigateMonth,}) => {

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogShifts, setDialogShifts] = useState<(Shift & { groupName?: string })[]>([]);

  
  function isDateExcluded(day: number) {
    return getExcludeRequestsForDate(day, requests, currentDate).length > 0;
  }

  const handleDayClick = (day: number) => {
    const dayShifts = getShiftsForDate(day, shifts, currentDate, selectedGroup);
    if (dayShifts.length > 0) {
      setDialogShifts(dayShifts);
      setDialogOpen(true);
    }
  };

  const uniqueGroupIds = Array.from(
    new Set(shifts.map((shift) => shift.groupId))
  );

  return (
    <>
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-xl sm:text-2xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>

            <div className="flex items-center space-x-2 space-x-reverse self-end sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("prev")}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("next")}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="w-full overflow-x-auto sm:overflow-x-visible">
            <div className="grid grid-cols-7 gap-1 mb-4 min-w-[560px] sm:min-w-0">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 rounded"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 min-w-[560px] sm:min-w-0">
              {getDaysInMonth(currentDate).map((day, index) => {
                const dayShifts = getShiftsForDate(day as number, shifts, currentDate, selectedGroup);
                const isToday =
                  day &&
                  new Date().getDate() === day &&
                  new Date().getMonth() === currentDate.getMonth() &&
                  new Date().getFullYear() === currentDate.getFullYear();

                const excludeRequests = getExcludeRequestsForDate(day!, requests, currentDate);
                const isExcluded = isDateExcluded(day!);

                return (
                  <div
                    key={index}
                    className={`relative min-h-[90px] min-w-[80px] sm:min-w-0 p-1 sm:p-2 border rounded-lg transition-colors ${
                      day
                        ? isExcluded
                          ? 'bg-red-50 border-red-200 hover:bg-red-100'
                          : 'bg-white hover:bg-gray-50 border-gray-200 cursor-pointer'
                        : 'bg-gray-50 border-gray-100'
                    } ${isToday && !isExcluded ? 'ring-2 ring-blue-500' : ''} ${isToday && isExcluded ? 'ring-2 ring-red-500' : ''}`}
                    onClick={() => day && !isExcluded && handleDayClick(day as number)}
                    style={{ cursor: day ? (isExcluded ? 'not-allowed' : 'pointer') : 'default' }}
                  >
                    {day && (
                      <>
                        <div className={`text-xs sm:text-sm font-medium mb-1 ${
                          isToday ? (isExcluded ? 'text-red-600' : 'text-blue-600') : (isExcluded ? 'text-red-700' : 'text-gray-900')
                        }`}>
                          {day}
                        </div>
                        {/* Exclude requests display */}
                        {isExcluded && (
                          <div className="space-y-1">
                            {excludeRequests.map((request: Request) => (
                              <div
                                key={request.id}
                                className="text-xs p-1 rounded bg-red-100 text-red-800 border border-red-300"
                              >
                                <div className="font-medium"> הסתייגות</div>
                                <div className="text-xs opacity-90 mt-1">{request.description}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Regular shifts display (only when not excluded) */}
                        {!isExcluded && (
                          <div className="space-y-1">
                            {dayShifts.slice(0, 2).map((shift: Shift  ) => {
                              const start = new Date(shift.startDate);
                              const end = new Date(shift.endDate);
                              return (
                                <div
                                  key={shift.id}
                                  className={`text-xs sm:text-xs p-1 rounded whitespace-normal break-words ${getGroupColor(
                                    shift.groupId,
                                    uniqueGroupIds
                                  )}`}
                                >
                                  <div className="font-medium whitespace-normal break-words sm:truncate">
                                    {shift.displayName}
                                  </div>
                                  <div className="text-[10px] sm:text-xs opacity-75 whitespace-normal break-words sm:truncate">
                                    {formatTimeRange(start, end)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
      <DayShiftsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        shifts={dialogShifts}
        currentUserId={currentUserId}
      />
    </>
  );
};
