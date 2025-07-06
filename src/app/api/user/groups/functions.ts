import { BaseApiResponse } from "@/app/shared/types/api";
import { apiPost } from "@/app/shared/utils/apiClient";

export async function getGroupUserStats(data: { groupId: string, userId: string }) {
    const res = await apiPost<BaseApiResponse<{userId:string; name:string; points:number; status:string; monthlyShifts:number;}>>
    ('/api/user/groups', 'getGroupUserStats', data);
    if (res.error) throw new Error(res.error);
    return res.data;
  }