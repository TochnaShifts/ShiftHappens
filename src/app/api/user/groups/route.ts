import { apiHandler } from "@/app/shared/utils/apiHandler"
import { NextRequest } from "next/server"
import { getGroupUserStats } from "./functions"

export const POST = apiHandler(async (req: NextRequest) => {
    const { action, data } = await req.json()
  
    switch (action) {
      case 'getGroupUserStats':
        return { data: await getGroupUserStats(data) }
      default:
        throw new Error('Unknown action')
    }
  })
  