import { apiHandler } from "@/app/shared/utils/apiHandler";
import { NextRequest } from "next/server";
import { CreateNewRequest, getRequestsByUserId, deleteRequest } from "@/app/shared/firebase/CRUD/requests";

export const POST = apiHandler(async (req: NextRequest) => {
    const { action, data } = await req.json()

    switch (action) {
      case 'getRequestsByUserId': {
        return { data: await getRequestsByUserId(data)};
      }
      case 'createRequest':
        return { data: await CreateNewRequest(data) };
      case 'deleteRequest':
        return { data: await deleteRequest(data) };
      default:
        throw new Error('Unknown action')
    }
  })
  
