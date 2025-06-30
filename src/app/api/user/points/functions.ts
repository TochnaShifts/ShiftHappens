import { apiPost } from '@/app/shared/utils/apiClient'
import { UserGroupPoints } from '@/app/shared/types'
import { BaseApiResponse } from '@/app/shared/types/api'

export async function getUserPointsByGroup(userId: string): Promise<{ groupId: string; groupName: string; count: number }[]> {
  const res = await apiPost<BaseApiResponse<{ groupId: string; groupName: string; count: number }[]>>('/api/user/points', 'getPoints', { userId: userId })
  if (res.error) throw new Error(res.error)
  return res.data ?? []
}
