"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/loveable/card";
import { Button } from "@/app/components/loveable/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { DayShiftsDialog } from "./DayShiftsDialog";
import { DeleteRequestDialog } from "./DeleteRequestDialog";
import { Request, RequestType, Shift } from "@/app/shared/types";
import { dayNames, formatTimeRange, getDaysInMonth, getExcludeRequestsForDate, getPreferRequestsForDate, getRequestsForDate, getGroupColor, getShiftsForDate, monthNames } from "./utils";
import { useDeleteRequest } from "../hooks";


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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<Request | null>(null);
  const deleteRequestMutation = useDeleteRequest();

  function isDatePrefered(day: number) {
    return getPreferRequestsForDate(day, requests, currentDate).length > 0;
  }

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

  const handleDeleteRequest = (request: Request, event: React.MouseEvent) => {
    event.stopPropagation();
    setRequestToDelete(request);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteRequest = () => {
    if (requestToDelete) {
      deleteRequestMutation.mutate(requestToDelete.id);
      setDeleteDialogOpen(false);
      setRequestToDelete(null);
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
                const allRequests = getRequestsForDate(day!, requests, currentDate);
                const userRequests = allRequests.filter(request => request.userId === currentUserId);
                const isExcluded = isDateExcluded(day!);
                const isPrefered = isDatePrefered(day!);

                return (
                  <div
                    key={index}
                    className={`relative min-h-[90px] min-w-[80px] sm:min-w-0 p-1 sm:p-2 border rounded-lg transition-colors group ${
                      day
                        ? isExcluded
                          ? 'bg-red-50 border-red-200 hover:bg-red-100'
                          : isPrefered
                          ? 'bg-green-50 border-green-200 hover:bg-green-100'
                          : 'bg-white hover:bg-gray-50 border-gray-200 cursor-pointer'
                        : 'bg-gray-50 border-gray-100'
                    } ${isToday && !isExcluded && !isPrefered ? 'ring-2 ring-blue-500' : ''} ${isToday && isExcluded ? 'ring-2 ring-red-500' : ''} ${isToday && isPrefered ? 'ring-2 ring-green-500' : ''}`}
                    onClick={() => day && !isExcluded && handleDayClick(day as number)}
                    style={{ cursor: day ? (isExcluded ? 'not-allowed' : 'pointer') : 'default' }}
                  >
                    {day && (
                      <>
                        {/* Delete button for user's requests */}
                        {userRequests.length > 0 && (
                          <button
                            onClick={(e) => handleDeleteRequest(userRequests[0], e)}
                            className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                            title="מחק בקשה"
                          >
                            <X className="w-3 h-3 text-red-600 hover:text-red-800" />
                          </button>
                        )}
                        
                        <div className={`text-xs sm:text-sm font-medium mb-1 ${
                          isToday ? (isExcluded ? 'text-red-600' : isPrefered ? 'text-green-600' : 'text-blue-600') : (isExcluded ? 'text-red-700' : isPrefered ? 'text-green -700' : 'text-gray-900')
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
                        {/* Prefer requests display */}
                        {allRequests.filter(r => r.type === RequestType.Prefer).length > 0 && (
                          <div className="space-y-1">
                            {allRequests
                              .filter(request => request.type === RequestType.Prefer)
                              .map((request: Request) => (
                                <div
                                  key={request.id}
                                  className="text-xs p-1 rounded bg-green-100 text-green-800 border border-green-300"
                                >
                                  <div className="font-medium">העדפה</div>
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
                                  className="text-xs sm:text-xs p-1 rounded whitespace-normal break-words bg-blue-100 text-blue-900 border border-blue-300"
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
      <DeleteRequestDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        request={requestToDelete}
        onConfirm={confirmDeleteRequest}
        isLoading={deleteRequestMutation.isPending}
      />
    </>
  );
};
