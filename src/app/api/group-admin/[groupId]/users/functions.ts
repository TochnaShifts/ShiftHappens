import { apiPost } from "@/app/shared/utils/apiClient";
import { User } from "@/app/shared/types";
import { BaseApiResponse } from "@/app/shared/types/api";

export async function updateUserRole(groupId: string, userId: string, roleAction: 'makeAdmin' | 'removeAdmin' | 'removeFromGroup') {
  const res = await apiPost<BaseApiResponse<boolean>>("/api/group-admin/" + groupId + "/users", "updateUserRole", { userId, roleAction })
  return res.data ?? false
}

export async function updateUserCategories(groupId: string, userId: string, userCategories: string[]) {
  const res = await apiPost<BaseApiResponse<boolean>>("/api/group-admin/" + groupId + "/users", "updateUserCategories", { userId, userCategories })
  return res.data ?? false
}

export async function addUsersToGroup(groupId: string, userIds: string[]) {
  const res = await apiPost<BaseApiResponse<boolean>>("/api/group-admin/" + groupId + "/users", "addUsersToGroup", { userIds })
  return res.data ?? false
} 