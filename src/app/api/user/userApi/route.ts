import { NextRequest } from 'next/server'
import { apiHandler } from '@/app/shared/utils/apiHandler'
import { getCompletedShiftsHoursThisMonth, getUserRankInEachGroup } from '@/app/shared/firebase/CRUD/regularUser/dashboard'

export const POST = apiHandler(async (req: NextRequest) => {
  const { action, data } = await req.json()
  const userId = data?.userId
  if (!userId) throw new Error('Missing userId')

  switch (action) {
    case 'getUserRanks':
      return {data: await getUserRankInEachGroup(userId),}
    case 'getCompletedShiftsHoursThisMonth':
      return { data: await getCompletedShiftsHoursThisMonth(userId) }
    default:
      throw new Error('Unknown action')
  }
})
