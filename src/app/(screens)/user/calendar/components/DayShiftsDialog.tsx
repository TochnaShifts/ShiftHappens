"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/loveable/dialog";
import { Badge } from "@/app/components/loveable/badge";
import { Shift } from "@/app/shared/types";
import { ShiftStatus } from "@/app/shared/types/enums";
import { Clock, CheckCircle, PlayCircle, XCircle } from "lucide-react";
import { formatTimeRange, getGroupColor } from "./utils";

interface DayShiftsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shifts: (Shift & { groupName?: string })[];
  currentUserId: string;
}

export const DayShiftsDialog: React.FC<DayShiftsDialogProps> = ({ open, onOpenChange, shifts, currentUserId }) => {
  const uniqueGroupIds = Array.from(new Set(shifts.map((shift) => shift.groupId)));
  // Only show shifts assigned to the current user
  const assignedShifts = shifts.filter(shift => shift.users.includes(currentUserId));

  // Function to get status-based styling for shifts
  const getShiftStatusStyle = (shift: Shift) => {
    // Handle both old and new data structure
    let status: ShiftStatus;
    if (shift.status !== undefined) {
      status = shift.status;
    } else {
      // Old structure: determine status based on date
      const now = new Date();
      const startDate = new Date(shift.startDate);
      if (startDate < now) {
        status = ShiftStatus.Finished;
      } else {
        status = ShiftStatus.Active;
      }
    }

    switch (status) {
      case ShiftStatus.Active:
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-900',
          border: 'border-yellow-200',
          icon: PlayCircle,
          label: 'פעיל'
        };
      case ShiftStatus.Finished:
        return {
          bg: 'bg-green-50',
          text: 'text-green-900',
          border: 'border-green-200',
          icon: CheckCircle,
          label: 'הושלם'
        };
      case ShiftStatus.Cancelled:
        return {
          bg: 'bg-red-50',
          text: 'text-red-900',
          border: 'border-red-200',
          icon: XCircle,
          label: 'בוטל'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-900',
          border: 'border-gray-200',
          icon: Clock,
          label: 'לא ידוע'
        };
    }
  };
  // For dialog header date
  const firstShift = assignedShifts[0] || shifts[0];
  const date = firstShift ? new Date(firstShift.startDate) : null;
  const day = date ? date.getDate() : "";
  const month = date ? date.toLocaleString("he-IL", { month: "long" }) : "";
  const year = date ? date.getFullYear() : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto px-2 sm:px-6" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">{day}</span>
            </div>
            המשמרות שלך ליום {day} ב{month} {year}
          </DialogTitle>
        </DialogHeader>

        {assignedShifts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Clock className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">אין משמרות</h3>
            <p className="text-gray-600">אין לך משמרות מתוכננות ליום זה</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-center">
                <div>
                  <p className="text-sm text-gray-600">סה"כ משמרות</p>
                  <p className="text-2xl font-bold text-gray-900">{assignedShifts.length}</p>
                </div>
              </div>
            </div>

            {/* Shifts List */}
            <div className="space-y-4">
              {assignedShifts.map((shift) => {
                const start = new Date(shift.startDate);
                const end = new Date(shift.endDate);
                const statusStyle = getShiftStatusStyle(shift);
                const StatusIcon = statusStyle.icon;
                return (
                  <div
                    key={shift.id}
                    className={`p-4 rounded-lg border transition-all hover:shadow-md ${statusStyle.bg} ${statusStyle.border}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className={`font-semibold text-lg ${statusStyle.text}`}>{shift.displayName}</h4>
                          <Badge variant="default" className={getGroupColor(shift.groupId, uniqueGroupIds) + " text-gray-900"}>
                            {shift.groupName || shift.groupId}
                          </Badge>
                          <Badge variant="outline" className={`${statusStyle.border} ${statusStyle.text} flex items-center gap-1`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusStyle.label}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatTimeRange(start, end)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}; 