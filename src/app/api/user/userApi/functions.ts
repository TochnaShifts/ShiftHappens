import { apiPost } from '@/app/shared/utils/apiClient'
import { BaseApiResponse } from '@/app/shared/types/api'
import { RankGroupData } from '@/app/shared/firebase/CRUD/regularUser/dashboard'

export async function getUserRanks(userId: string): Promise<RankGroupData[]> {
  const res = await apiPost<BaseApiResponse<RankGroupData[]>>('/api/user/userApi', 'getUserRanks', { userId: userId })
  if (res.error) throw new Error(res.error)
  return res.data ?? []
}

export async function getCompletedShiftsHoursThisMonth(userId: string): Promise<{ totalHours: number; completedShiftsCount: number }> {
  const res = await apiPost<BaseApiResponse<{ totalHours: number; completedShiftsCount: number }>>('/api/user/userApi', 'getCompletedShiftsHoursThisMonth', { userId: userId })
  if (res.error) throw new Error(res.error)
  return res.data ?? { totalHours: 0, completedShiftsCount: 0 }
}

