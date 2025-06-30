import { NextRequest } from 'next/server'
import { apiHandler } from '@/app/shared/utils/apiHandler'
import { getUserPointsByGroup } from '@/app/shared/firebase/CRUD/userGroupPoints'

export const POST = apiHandler(async (req: NextRequest) => {
  const { action, data } = await req.json()
  const userId = data?.userId
  if (!userId) throw new Error('Missing userId')

  switch (action) {
    case 'getPoints':
      return { data: await getUserPointsByGroup(userId) }
    default:
      throw new Error('Unknown action')
  }
})
