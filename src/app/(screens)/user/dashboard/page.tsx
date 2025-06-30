import { loadUserContext } from '@/app/shared/loaders/loadUserContext'
import { loadDashboardData } from './loadDashboardData'
import {
  DashboardHeader,
  QuickStatsCards,
  UpcomingShiftsCard,
  PointsOverviewCard,
  RecentActivityCard
} from './components'

export default async function DashboardPage() {
  const { user } = await loadUserContext()
  const { upcomingShifts, pointsData, recentActivity, userRanks, completedShiftsHoursThisMonth } = await loadDashboardData(user!.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50" dir="rtl">
      <DashboardHeader user={user!} />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <QuickStatsCards upcomingShifts={upcomingShifts} pointsData={pointsData} recentActivity={recentActivity} userRanks={userRanks} completedShiftsHoursThisMonth={completedShiftsHoursThisMonth} />

        <div className="grid lg:grid-cols-2 gap-6">
          <UpcomingShiftsCard shifts={upcomingShifts} />
          <PointsOverviewCard pointsData={pointsData} />
        </div>

        <RecentActivityCard activity={recentActivity} />
      </div>
    </div>
  )
}
