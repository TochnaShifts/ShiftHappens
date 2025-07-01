import { NextRequest } from 'next/server'
import { apiHandler } from '@/app/shared/utils/apiHandler'
import { getUserUpcomingShifts, getAllShiftsForUser } from '@/app/shared/firebase/CRUD/shifts'

export const POST = apiHandler(async (req: NextRequest) => {
  const { action, data } = await req.json()
  const userId = data?.userId
  if (!userId) throw new Error('Missing userId')

  switch (action) {
    case 'getUpcoming':
      return { data: await getUserUpcomingShifts(userId) }
    case 'getAllForUser':
      return { data: await getAllShiftsForUser(userId) }
    default:
      throw new Error('Unknown action')
  }
})
