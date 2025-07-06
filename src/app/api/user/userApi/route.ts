import { NextRequest } from 'next/server'
import { apiHandler } from '@/app/shared/utils/apiHandler'
import { getCompletedShiftsHoursThisMonth, getUserRankInEachGroup } from '@/app/shared/firebase/CRUD/regularUser/dashboard'
import { getGroupUserStats, getGroupsMembersPoints } from '@/app/shared/firebase/CRUD/regularUser/points'

export const POST = apiHandler(async (req: NextRequest) => {
  const { action, data } = await req.json()

  switch (action) {
    case 'getUserRanks':
      return {data: await getUserRankInEachGroup(data),}
    case 'getCompletedShiftsHoursThisMonth':
      return { data: await getCompletedShiftsHoursThisMonth(data) }
    case 'groupMembersPoints':
      return { data: await getGroupsMembersPoints(data) }
    case 'groupUserStats':
      return { data: await getGroupUserStats(data) }
    default:
      throw new Error('Unknown action')
  }
})

