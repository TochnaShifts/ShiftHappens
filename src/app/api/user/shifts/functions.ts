import { apiPost } from '@/app/shared/utils/apiClient'
import { Shift } from '@/app/shared/types'
import { BaseApiResponse } from '@/app/shared/types/api'

export async function getUpcomingShiftsForUser(userId: string): Promise<(Shift & { groupName: string })[]> {
  const res = await apiPost<BaseApiResponse<(Shift & { groupName: string })[]>>('/api/user/shifts', 'getUpcoming', { userId: userId })
  if (res.error) throw new Error(res.error)
  return res.data ?? []
}

export async function getAllShiftsForUser(userId: string): Promise<(Shift & { groupName: string })[]> {
  const res = await apiPost<BaseApiResponse<(Shift & { groupName: string })[]>>('/api/user/shifts', 'getAllForUser', { userId })
  if (res.error) throw new Error(res.error)
  return res.data ?? []
}
