"use client";

import { useParams } from "next/navigation";
import { useUser } from "@/app/contexts/UserContext";
import { useUserGroups, useUserAdminGroups } from "@/app/shared/hooks";
import { LoadingSpinner } from "@/app/components";
import {
  WelcomeHeader,
  KpiCards,
  QuickActions,
  RecentActivity,
} from "./components";
import {
  useGetUpcomingShiftsForGroup,
  useGetRequestsForGroup,
  useGetGroupMembersCount,
  useGetRecentGroupActivity,
} from "./hooks/groupAdminHooks";

export default function GroupAdminDashboard() {
  const params = useParams();
  const groupId = params.groupId as string;
  const { user } = useUser();
  const { data: userGroups, isLoading: userGroupsLoading } =useUserGroups(user);
  const { data: groupsAdmin, isLoading: groupsAdminLoading } =useUserAdminGroups(user);

  // Check if user is admin of this group
  const isGroupAdmin =user?.groups?.some((group) => group.groupId === groupId && group.isAdmin) ||false;
  const isGlobalAdmin = user?.isGlobalAdmin || false;

  // Get group data
  const currentGroup = userGroups?.find((group) => group.id === groupId);

  // Fetch dashboard data
  const { data: upcomingShifts, isLoading: upcomingShiftsLoading } =useGetUpcomingShiftsForGroup(groupId);
  const { data: requests, isLoading: requestsLoading } =useGetRequestsForGroup(groupId);
  const { data: membersCount, isLoading: membersCountLoading } =useGetGroupMembersCount(groupId);
  const { data: recentActivity, isLoading: recentActivityLoading } =useGetRecentGroupActivity(groupId);

  // Check if user has permission to access this group
  if (!isGroupAdmin && !isGlobalAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 text-center" dir="rtl">
        <h2 className="text-xl font-semibold text-white mb-2">אין לך הרשאה</h2>
        <p className="text-gray-400">אין לך הרשאה לגשת לניהול קבוצה זו</p>
      </div>
    );
  }

  // Show loading if basic data is loading
  if (userGroupsLoading || groupsAdminLoading || membersCountLoading || upcomingShiftsLoading || requestsLoading || recentActivityLoading) {
    return <LoadingSpinner size="lg" fullPage />;
  }

  // Show error if group not found
  if (!currentGroup) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 text-center" dir="rtl">
        <h2 className="text-xl font-semibold text-white mb-2">
          קבוצה לא נמצאה
        </h2>
        <p className="text-gray-400">
          הקבוצה שביקשת לא קיימת או שאין לך הרשאה לנהל אותה
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900" dir="rtl">
      <div className="p-6 space-y-6">
        <WelcomeHeader group={currentGroup} />
        <KpiCards
          upcomingShiftsCount={upcomingShifts?.length || 0}
          requestsCount={requests?.length || 0}
          membersCount={membersCount || 0}
        />
        <QuickActions group={currentGroup} />
        <RecentActivity activities={recentActivity || []} />
      </div>
    </div>
  );
}
