import { NextRequest } from 'next/server'
import { apiHandler } from '@/app/shared/utils/apiHandler'
import { getUserPointsByGroup } from '@/app/shared/firebase/CRUD/userGroupPoints'

export const POST = apiHandler(async (req: NextRequest) => {
  const { action, data } = await req.json()

  switch (action) {
    case 'getPoints':
      return { data: await getUserPointsByGroup(data) }
    default:
      throw new Error('Unknown action')
  }
})
