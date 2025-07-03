import { dehydrate, QueryClient } from "@tanstack/react-query";
import { Group, User, UserCategory } from "./types";
import { queryKeys } from "./utils/queryKeys";
import { getGroupsByIds } from "./firebase/CRUD/groups";
import { getUserCategoriesByIds } from "./firebase/CRUD/userCategories";
import { getRequestsByUserId } from "../api/user/requests/functions";
import { fetchAdminGroups, fetchUserCategories, fetchUserGroups } from "./queries/userQueries";

export const prefetchUserData = async (user: User) => {
  const queryClient = new QueryClient();

  // Only prefetch if user has data to fetch
  const prefetchPromises = [];

  // Prefetch user groups if user has groups
  if (user.groups.length > 0) {
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: queryKeys.userGroups,
        queryFn: () => fetchUserGroups(user),
      })
    );
  }

  // Prefetch admin groups if user has admin groups
  if (user.groups.some((g) => g.isAdmin)) {
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: queryKeys.groupsAdmin,
        queryFn: () => fetchAdminGroups(user),
      })
    );
  }

  // Prefetch user categories if user has categories
  if (user.userCategories.length > 0) {
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: queryKeys.userCategories,
        queryFn: () => fetchUserCategories(user),
      })
    );
  }

  //Prefetch requests if user has requests
  prefetchPromises.push(
    queryClient.prefetchQuery({
      queryKey: queryKeys.requests,
      queryFn: () => getRequestsByUserId(user.id),
    })
  );

  // Execute all prefetch operations in parallel
  await Promise.all(prefetchPromises);

  return dehydrate(queryClient);
};
