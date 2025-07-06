import { apiPost } from '@/app/shared/utils/apiClient'
import { BaseApiResponse } from '@/app/shared/types/api'
import { RankGroupData } from '@/app/shared/firebase/CRUD/regularUser/dashboard'
import { Group } from '@/app/shared/types/models'

export async function getUserRanks(userId: string): Promise<RankGroupData[]> {
  const res = await apiPost<BaseApiResponse<RankGroupData[]>>('/api/user/userApi', 'getUserRanks', userId )
  if (res.error) throw new Error(res.error)
  return res.data ?? []
}

export async function getCompletedShiftsHoursThisMonth(userId: string): Promise<{ totalHours: number; completedShiftsCount: number }> {
  const res = await apiPost<BaseApiResponse<{ totalHours: number; completedShiftsCount: number }>>('/api/user/userApi', 'getCompletedShiftsHoursThisMonth', userId )
  if (res.error) throw new Error(res.error)
  return res.data ?? { totalHours: 0, completedShiftsCount: 0 }
}

export async function getGroupMembersPoints(groupIds: string[]) {
  const res = await apiPost<BaseApiResponse<{ groupId: string; groupName: string; members: { userId: string; name: string; points: number; status: boolean; monthlyShifts: number }[] }[]>>('/api/user/userApi', 'groupMembersPoints', groupIds );
  if (res.error) throw new Error(res.error);
  return res.data;
};

export async function getGroupUserStats(userId:string, groupIds: string[]) {
  const res = await apiPost<BaseApiResponse<{ groupId: string; groupName: string; rank: number; members: number; weeklyShifts: number; monthlyShifts: number }[]>>('/api/user/userApi', 'groupUserStats', { userId, groupIds });
  if (res.error) throw new Error(res.error);
  return res.data;
}



