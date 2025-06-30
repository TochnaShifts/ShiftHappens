import { getUpcomingShiftsForUser } from "@/app/api/user/shifts/functions";
import { getUserPointsByGroup } from "@/app/api/user/points/functions";
import { getRecentUserActivity } from "@/app/api/user/activity/functions";
import {getCompletedShiftsHoursThisMonth,getUserRanks,} from "@/app/api/user/userApi/functions";

import { Shift } from "@/app/shared/types";
import { RecentActivityItem } from "@/app/shared/firebase/CRUD/regularUser/dashboard";

export async function loadDashboardData(userId: string): Promise<{
  upcomingShifts: (Shift & { groupName: string })[];
  pointsData: { groupId: string; groupName: string; count: number }[];
  recentActivity: RecentActivityItem[];
  userRanks: {
    groupId: string;
    groupDisplayName: string;
    rank: number;
    totalUsers: number;
  }[];
  completedShiftsHoursThisMonth: {
    totalHours: number;
    completedShiftsCount: number;
  };
}> {
  const [
    upcomingShifts,
    pointsData,
    recentActivity,
    userRanks,
    completedShiftsHoursThisMonth,
  ] = await Promise.all([
    getUpcomingShiftsForUser(userId),
    getUserPointsByGroup(userId),
    getRecentUserActivity(userId),
    getUserRanks(userId), // 👈 new call to support QuickStatsCard
    getCompletedShiftsHoursThisMonth(userId),
  ]);

  return {
    upcomingShifts,
    pointsData,
    recentActivity,
    userRanks,
    completedShiftsHoursThisMonth,
  };
}
