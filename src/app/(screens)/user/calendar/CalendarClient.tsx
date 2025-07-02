"use client";
import { getAllShiftsForUser } from "@/app/api/user/shifts/functions";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CalendarHeader } from "./components/CalendarHeader";
import { ListView } from "./components/ListView";
import { CalendarMonthView } from "./components/CalendarMonthView";
import { Group, Request, Shift, User } from "@/app/shared/types";
import { CalendarLegends } from "./components/CalendarLegends";
import { RequestType } from "@/app/shared/types/enums";

export default function CalendarClient({ user, userGroups, requests }: { user: User, userGroups:  Group[], requests: Request[] }) {
  // Get the groupIds where the user is NOT an admin
  const nonAdminGroupIds = user.groups.filter(g => !g.isAdmin).map(g => g.groupId);

  // Filter userGroups to only include those where the user is NOT an admin
  const groups = [
    { value: "all", label: "כל הקבוצות" },
    ...((userGroups || [])
      .filter(g => nonAdminGroupIds.includes(g.id))
      .map(g => ({
        value: g.id,
        label: g.displayName
      }))
    )
  ];

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const router = useRouter();

  useEffect(() => {
    const fetchShifts = async () => {
      const shifts = await getAllShiftsForUser(user.id);
      setShifts(shifts);
    };
    fetchShifts();
  }, [user.id]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50" dir="rtl">
      <CalendarHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        groups={groups}
      />
      <div className="container mx-auto px-4 py-8">
        {viewMode === "list" ? (
          <ListView shifts={shifts} selectedGroup={selectedGroup} currentUserId={user.id} />
        ) : (
          <CalendarMonthView
            currentDate={currentDate}
            shifts={shifts}
            selectedGroup={selectedGroup}
            currentUserId={user.id}
            navigateMonth={navigateMonth}
            requests={requests.filter(r => r.type === RequestType.Exclude)}
          />
        )}
        {/* Dynamic Legend */}
        <CalendarLegends shifts={shifts} />
      </div>
    </div>
  );
}

