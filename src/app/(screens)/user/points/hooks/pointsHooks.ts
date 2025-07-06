import { useQuery } from '@tanstack/react-query';
import { getGroupMembersPoints, getGroupUserStats } from '@/app/api/user/userApi/functions';
import { Group } from '@/app/shared/types/models';

export function useGroupMembersPoints(userId: string, groupIds: string[]) {
  return useQuery({
    queryKey: ['groupMembersPoints', userId],
    queryFn: () => getGroupMembersPoints(groupIds),
    enabled: !!userId && !!groupIds,
  });
}

export function useGroupsUserStats( userId:string, groupIds: string[]) {
  return useQuery({
    queryKey: ['groupUserStats', userId],
    queryFn: () => getGroupUserStats(userId,groupIds),
    enabled: !!userId && !!groupIds,
  });
} 