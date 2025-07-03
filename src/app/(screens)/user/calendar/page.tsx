"use client"

import { useUser } from "@/app/contexts/UserContext";
import { useUserGroups } from "@/app/shared/hooks";
import { useGetUserRequests, useGetUserShifts } from "./hooks";
import { RequestType } from "@/app/shared/types/enums";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarHeader } from "./components/CalendarHeader";
import { ListView } from "./components/ListView";
import { CalendarMonthView } from "./components/CalendarMonthView";
import { CalendarLegends } from "./components/CalendarLegends";

export default function CalendarPage() {
  const { user } = useUser();
  const { data: userGroups, isLoading: userGroupsLoading } = useUserGroups(user)
  const { data: requests, isLoading: requestsLoading } = useGetUserRequests(user!.id)
  const { data: shifts, isLoading: shiftsLoading } = useGetUserShifts(user!.id)
   const [currentDate, setCurrentDate] = useState(new Date());
   const [selectedGroup, setSelectedGroup] = useState("all");
   const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
   const router = useRouter()

  if (userGroupsLoading || requestsLoading || shiftsLoading) {
    return <div>Loading...</div>
  }
  if (!user) {
    return <div>עליך להתחבר כדי לצפות בלוח השנה</div>
  }
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
           <ListView shifts={shifts || []} selectedGroup={selectedGroup} currentUserId={user.id} />
         ) : (
           <CalendarMonthView
             currentDate={currentDate}
             shifts={shifts || []}
             selectedGroup={selectedGroup}
             currentUserId={user.id}
             navigateMonth={navigateMonth}
             requests={requests?.filter(r => r.type === RequestType.Exclude) || []}
           />
         )}
         {/* Dynamic Legend */}
         <CalendarLegends shifts={shifts || []} />
       </div>
     </div>
   )
}