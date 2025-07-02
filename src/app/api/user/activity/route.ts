import { getRecentUserActivity } from '@/app/shared/firebase'
import { apiHandler } from '@/app/shared/utils/apiHandler'
import { NextRequest } from 'next/server'

export const POST = apiHandler(async (req: NextRequest) => {
    const { action, data } = await req.json()

    switch (action) {
      case 'getRecentActivities':
        return { data: await getRecentUserActivity(data) }
      default:
        throw new Error('Unknown action')
    }
  })
