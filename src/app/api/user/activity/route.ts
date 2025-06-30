import { getRecentUserActivity } from '@/app/shared/firebase'
import { apiHandler } from '@/app/shared/utils/apiHandler'
import { NextRequest } from 'next/server'

export const POST = apiHandler(async (req: NextRequest) => {
    const { action, data } = await req.json()
    const { userId } = data
    if (!userId) throw new Error('Missing userId')
  
    switch (action) {
      case 'getRecentActivities':
        return { data: await getRecentUserActivity(userId) }
      default:
        throw new Error('Unknown action')
    }
  })
