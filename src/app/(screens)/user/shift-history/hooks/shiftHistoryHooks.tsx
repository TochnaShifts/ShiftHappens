import { useQuery } from "@tanstack/react-query"
import { getAllShiftsForUser } from "@/app/api/user/shifts/functions"
import { getCompletedShiftsHoursThisMonth } from "@/app/api/user/userApi/functions"

export const useGetUserShifts = (userId: string) => {
  return useQuery({
    queryKey: ['shifts'],
    queryFn: () => getAllShiftsForUser(userId),
  })
}

export const useGetCompletedShiftsStats = (userId: string) => {
  return useQuery({
    queryKey: ['completedShiftsStats', userId],
    queryFn: () => getCompletedShiftsHoursThisMonth(userId),
  })
} 