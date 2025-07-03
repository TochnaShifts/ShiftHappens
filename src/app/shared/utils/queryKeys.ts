import { useQueryClient } from "@tanstack/react-query"

export const queryKeys = {
    user: ['user'] as const,
    userGroups: ['groups'] as const,
    groupsAdmin: ['groups-admin'] as const,
    userCategories: ['categories'] as const,
    requests: ['requests'] as const,
  } as const

  // Invalidation utilities
export const useInvalidateUserData = () => {
  const queryClient = useQueryClient()
  
  return {
    invalidateUserGroups: (userId: string) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userGroups })
    },
    invalidateGroupsAdmin: (userId: string) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groupsAdmin })
    },
    invalidateUserCategories: (userId: string) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userCategories })
    },
    invalidateAllUserData: (userId: string) => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  }
}
