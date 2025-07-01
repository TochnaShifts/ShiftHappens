import { apiPost } from "@/app/shared/utils/apiClient";
import { Request } from "@/app/shared/types";
import { BaseApiResponse } from "@/app/shared/types/api";

export async function getRequestsByUserId(userId: string): Promise<Request[]> {
  const res = await apiPost<BaseApiResponse<Request[]>>("/api/user/requests", "getRequestsByUserId", { userId })
  if (res.error) throw new Error(res.error)
  return res.data ?? []
}
