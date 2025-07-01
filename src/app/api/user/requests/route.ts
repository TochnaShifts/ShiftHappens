import { apiHandler } from "@/app/shared/utils/apiHandler";
import { NextRequest } from "next/server";
import { getRequestsByUserId } from "@/app/shared/firebase/CRUD/requests";

export const POST = apiHandler(async (req: NextRequest) => {
    const { action, data } = await req.json()
    const userId = data?.userId
    if (!userId) throw new Error('Missing userId')
  
    switch (action) {
      case 'getRequestsByUserId':
        return { data: await getRequestsByUserId(userId) }
      default:
        throw new Error('Unknown action')
    }
  })
  
