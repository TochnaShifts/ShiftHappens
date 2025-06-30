import { apiPost } from '@/app/shared/utils/apiClient'
import { BaseApiResponse } from '@/app/shared/types/api'

type RecentActivityItem = {
    type: 'shift_assigned' | 'request_submitted' | 'points_updated' | string
    message: string
    time: string
  }

export async function getRecentUserActivity(userId: string): Promise<RecentActivityItem[]> {
  const res = await apiPost<BaseApiResponse<RecentActivityItem[]>>('/api/user/activity', 'getRecentActivities', { userId: userId })
  if (res.error) throw new Error(res.error)
  return res.data ?? []
}
