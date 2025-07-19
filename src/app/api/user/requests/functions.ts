import { apiPost } from "@/app/shared/utils/apiClient";
import { Request } from "@/app/shared/types";
import { BaseApiResponse } from "@/app/shared/types/api";

export async function getRequestsByUserId(userId: string): Promise<Request[]> {
  const res = await apiPost<BaseApiResponse<Request[]>>("/api/user/requests", "getRequestsByUserId", userId)
  return res.data ?? []
}

export async function createRequest(request: Request) {
  const res = await apiPost<BaseApiResponse<Request>>("/api/user/requests", "createRequest", request )
  return res.data ?? {}
}

export async function deleteRequest(requestId: string) {
  const res = await apiPost<BaseApiResponse<boolean>>("/api/user/requests", "deleteRequest", requestId)
  return res.data ?? false
}
