import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/app/shared/utils/queryKeys";
import { getUpcomingShiftsForUser } from "@/app/api/user/shifts/functions";
import { getUserPointsByGroup } from "@/app/api/user/points/functions";
import { getCompletedShiftsHoursThisMonth, getUserRanks } from "@/app/api/user/userApi/functions";
import { getRecentUserActivity } from "@/app/api/user/activity/functions";

export const useGetUpcomingShiftsForUser = (userId: string) => {
    return useQuery({
        queryKey: ['upcomingShifts', userId],
        queryFn: () => getUpcomingShiftsForUser(userId),
    })
};

export const useGetUserPointsByGroup = (userId: string) => {
    return useQuery({
        queryKey: ['userPointsByGroup', userId],
        queryFn: () => getUserPointsByGroup(userId),
    })
};

export const useGetRecentUserActivity = (userId: string) => {
    return useQuery({
        queryKey: ['recentUserActivity', userId],
        queryFn: () => getRecentUserActivity(userId),
    })
};

export const useGetUserRanks = (userId: string) => {
    return useQuery({
        queryKey: ['userRanks', userId],
        queryFn: () => getUserRanks(userId),
    })  
};

export const useGetCompletedShiftsHoursThisMonth = (userId: string) => {
    return useQuery({
        queryKey: ['completedShiftsHoursThisMonth', userId],
        queryFn: () => getCompletedShiftsHoursThisMonth(userId),
    })
};
