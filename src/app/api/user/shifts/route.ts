import { NextRequest } from 'next/server'
import { apiHandler } from '@/app/shared/utils/apiHandler'
import { getUserUpcomingShifts, getAllShiftsForUser } from '@/app/shared/firebase/CRUD/shifts'

export const POST = apiHandler(async (req: NextRequest) => {
  const { action, data } = await req.json()

  switch (action) {
    case 'getUpcoming':
      return { data: await getUserUpcomingShifts(data) }
    case 'getAllForUser':
      return { data: await getAllShiftsForUser(data) }
    default:
      throw new Error('Unknown action')
  }
})
