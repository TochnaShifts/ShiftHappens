import { Request, RequestType, Shift } from "@/app/shared/types";

export const monthNames = [
    "ינואר",
    "פברואר",
    "מרץ",
    "אפריל",
    "מאי",
    "יוני",
    "יולי",
    "אוגוסט",
    "ספטמבר",
    "אוקטובר",
    "נובמבר",
    "דצמבר",
  ];

  export const dayNames = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"];



export const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  }

  export const getShiftsForDate = (day: number, shifts: Shift[], currentDate: Date, selectedGroup: string) => {
    if (!day) return [];
    return shifts.filter((shift) => {
      const date = new Date(shift.startDate);
      return (
        date.getFullYear() === currentDate.getFullYear() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getDate() === day &&
        (selectedGroup === "all" || shift.groupId === selectedGroup)
      );
    });
  }

  export const getExcludeRequestsForDate = (day: number, requests: Request[], currentDate: Date) => {
    if (!day) return [];
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return requests.filter(request => {
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      checkDate.setHours(12, 0, 0, 0);
      return checkDate >= startDate && checkDate <= endDate && request.type === RequestType.Exclude;
    });
  }

  
export const formatTimeRange = (start: Date, end: Date) => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(end.getHours())}:${pad(end.getMinutes())}-${pad(start.getHours())}:${pad(start.getMinutes())}`;
}

const colorPalette = [
    "bg-green-100 text-green-800",
    "bg-purple-100 text-purple-800",
    "bg-blue-100 text-blue-800",
    "bg-yellow-100 text-yellow-800",
    "bg-red-100 text-red-800",
  ];
  
  export function getGroupColor(groupId: string, groupIds: string[]) {
    const index = groupIds.indexOf(groupId);
    return colorPalette[index % colorPalette.length];
  } 