'use client'

import {
  DashboardHeader,
  QuickStatsCards,
  UpcomingShiftsCard,
  PointsOverviewCard,
  RecentActivityCard
} from './components'
import { useUser } from '@/app/contexts/UserContext'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/app/shared/utils/queryKeys'
import { useUserAdminGroups, useUserCategories, useUserGroups } from '@/app/shared/hooks'
import { useGetUpcomingShiftsForUser, useGetUserPointsByGroup, useGetRecentUserActivity, useGetUserRanks, useGetCompletedShiftsHoursThisMonth } from './hooks/dashboardHooks'
import LoadingSpinner from '@/app/components/ori/LoadingSpinner'

export default function DashboardPage() {
  const { user } = useUser()
// These will use the prefetched data initially, then refetch when needed
const { data: upcomingShifts, isLoading: upcomingShiftsLoading } = useGetUpcomingShiftsForUser(user!.id)
const { data: pointsData, isLoading: pointsDataLoading } = useGetUserPointsByGroup(user!.id)
const { data: recentActivity, isLoading: recentActivityLoading } = useGetRecentUserActivity(user!.id)
const { data: userRanks, isLoading: userRanksLoading } = useGetUserRanks(user!.id)
const { data: completedShiftsHoursThisMonth, isLoading: completedShiftsHoursThisMonthLoading } = useGetCompletedShiftsHoursThisMonth(user!.id)
  
if (upcomingShiftsLoading || pointsDataLoading || recentActivityLoading || userRanksLoading || completedShiftsHoursThisMonthLoading) {
  return <LoadingSpinner />
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50" dir="rtl">
      <DashboardHeader user={user!} />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <QuickStatsCards upcomingShifts={upcomingShifts || []} pointsData={pointsData || []} recentActivity={recentActivity || []} userRanks={userRanks || []} completedShiftsHoursThisMonth={completedShiftsHoursThisMonth || { totalHours: 0, completedShiftsCount: 0 }} />

        <div className="grid lg:grid-cols-2 gap-6">
          <UpcomingShiftsCard shifts={upcomingShifts || []} />
          <PointsOverviewCard pointsData={pointsData || []} />
        </div>

        <RecentActivityCard activity={recentActivity || []} />
      </div>
    </div>
  )
}
