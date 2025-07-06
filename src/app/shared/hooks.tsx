import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "./utils/queryKeys"
import { fetchUserGroups, fetchAdminGroups, fetchUserCategories } from "./queries/userQueries"
import { User } from "./types"

export const useUserGroups = (user: User | null) => {
    return useQuery({
      queryKey: queryKeys.userGroups,
      queryFn: () => fetchUserGroups(user!),
      enabled: !!user && user.groups.length > 0,
    })
  }
  
  export const useUserAdminGroups = (user: User | null) => {
    return useQuery({
      queryKey: queryKeys.groupsAdmin,
      queryFn: () => fetchAdminGroups(user!),
      enabled: !!user,
      initialData: [],
    })
  }
  
  export const useUserCategories = (user: User | null) => {
    return useQuery({
      queryKey: queryKeys.userCategories,
      queryFn: () => fetchUserCategories(user!),
      enabled: !!user && user.userCategories.length > 0,
    })
  }
  