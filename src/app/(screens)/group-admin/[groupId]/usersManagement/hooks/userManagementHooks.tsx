import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsersByGroupId, getAllUsers } from "@/app/shared/firebase/CRUD/users";
import { getUserGroupPointsByUserAndGroup } from "@/app/shared/firebase/CRUD/userGroupPoints";
import { getShiftAssignmentsByUserId } from "@/app/shared/firebase/CRUD/shiftAssignments";
import { getShiftsByGroupId } from "@/app/shared/firebase/CRUD/shifts";
import { getUserCategories } from "@/app/shared/firebase/CRUD/userCategories";
import { userManagementApi } from "@/app/shared/utils/apiClient";
import { User, UserCategory, UserGroupPoints, Shift, ShiftAssignment } from "@/app/shared/types";
import { ShiftStatus } from "@/app/shared/types/enums";

// Get all users in the system
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      try {
        const users = await getAllUsers();
        return users;
      } catch (error) {
        console.error('Error fetching all users:', error);
        return [];
      }
    },
  });
};

// Get group users with additional data
export const useGetGroupUsers = (groupId: string) => {
  return useQuery({
    queryKey: ['groupUsers', groupId],
    queryFn: async () => {
      try {
        const users = await getUsersByGroupId(groupId);
        return users;
      } catch (error) {
        console.error('Error fetching group users:', error);
        return [];
      }
    },
    enabled: !!groupId,
  });
};

// Get group users with points data for sorting
export const useGetGroupUsersWithPoints = (groupId: string) => {
  return useQuery({
    queryKey: ['groupUsersWithPoints', groupId],
    queryFn: async () => {
      try {
        const users = await getUsersByGroupId(groupId);
        
        // Get points for all users
        const usersWithPoints = await Promise.all(
          users.map(async (user) => {
            try {
              const points = await getUserGroupPointsByUserAndGroup(user.id, groupId);
              return {
                ...user,
                points: points?.count || 0
              };
            } catch (error) {
              console.error(`Error fetching points for user ${user.id}:`, error);
              return {
                ...user,
                points: 0
              };
            }
          })
        );
        
        return usersWithPoints;
      } catch (error) {
        console.error('Error fetching group users with points:', error);
        return [];
      }
    },
    enabled: !!groupId,
  });
};

// Get user points in group
export const useGetUserGroupPoints = (groupId: string, userId: string) => {
  return useQuery({
    queryKey: ['userGroupPoints', groupId, userId],
    queryFn: async () => {
      try {
        const points = await getUserGroupPointsByUserAndGroup(userId, groupId);
        return points;
      } catch (error) {
        console.error('Error fetching user group points:', error);
        return null;
      }
    },
    enabled: !!groupId && !!userId,
  });
};

// Get user categories
export const useGetUserCategories = () => {
  return useQuery({
    queryKey: ['userCategories'],
    queryFn: async () => {
      try {
        const categories = await getUserCategories();
        return categories;
      } catch (error) {
        console.error('Error fetching user categories:', error);
        return [];
      }
    },
  });
};

// Get user shift history
export const useGetUserShiftHistory = (userId: string, groupId: string) => {
  return useQuery({
    queryKey: ['userShiftHistory', userId, groupId],
    queryFn: async () => {
      try {
        const assignments = await getShiftAssignmentsByUserId(userId);
        const groupShifts = await getShiftsByGroupId(groupId);
        
        // Filter assignments for this group and get shift details
        const userShifts = assignments.filter(assignment => 
          groupShifts.some(shift => shift.id === assignment.shiftId)
        );

        return userShifts.map(assignment => {
          const shift = groupShifts.find(s => s.id === assignment.shiftId);
          return {
            id: assignment.id,
            date: shift?.startDate || new Date(),
            type: shift?.displayName || 'משמרת',
            duration: shift ? (shift.endDate.getTime() - shift.startDate.getTime()) / (1000 * 60 * 60) : 0,
            points: shift?.pointsPerHour || 0,
          };
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      } catch (error) {
        console.error('Error fetching user shift history:', error);
        return [];
      }
    },
    enabled: !!userId && !!groupId,
  });
};

// Get user upcoming shifts
export const useGetUserUpcomingShifts = (userId: string, groupId: string) => {
  return useQuery({
    queryKey: ['userUpcomingShifts', userId, groupId],
    queryFn: async () => {
      try {
        const assignments = await getShiftAssignmentsByUserId(userId);
        const groupShifts = await getShiftsByGroupId(groupId);
        
        // Filter for upcoming shifts in this group
        const now = new Date();
        const upcomingShifts = assignments
          .filter(assignment => {
            const shift = groupShifts.find(s => s.id === assignment.shiftId);
            return shift && shift.startDate > now && shift.status === ShiftStatus.Active;
          })
          .map(assignment => {
            const shift = groupShifts.find(s => s.id === assignment.shiftId);
            return {
              id: assignment.id,
              date: shift?.startDate || new Date(),
              type: shift?.displayName || 'משמרת',
              startTime: shift?.startDate.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) || '',
              endTime: shift?.endDate.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) || '',
            };
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return upcomingShifts;
      } catch (error) {
        console.error('Error fetching user upcoming shifts:', error);
        return [];
      }
    },
    enabled: !!userId && !!groupId,
  });
};

// Get user shifts this month
export const useGetUserShiftsThisMonth = (userId: string, groupId: string) => {
  return useQuery({
    queryKey: ['userShiftsThisMonth', userId, groupId],
    queryFn: async () => {
      try {
        const assignments = await getShiftAssignmentsByUserId(userId);
        const groupShifts = await getShiftsByGroupId(groupId);
        
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        const thisMonthShifts = assignments.filter(assignment => {
          const shift = groupShifts.find(s => s.id === assignment.shiftId);
          return shift && shift.startDate >= startOfMonth && shift.startDate <= endOfMonth;
        });

        return thisMonthShifts.length;
      } catch (error) {
        console.error('Error fetching user shifts this month:', error);
        return 0;
      }
    },
    enabled: !!userId && !!groupId,
  });
};

// Get user total shifts
export const useGetUserTotalShifts = (userId: string, groupId: string) => {
  return useQuery({
    queryKey: ['userTotalShifts', userId, groupId],
    queryFn: async () => {
      try {
        const assignments = await getShiftAssignmentsByUserId(userId);
        const groupShifts = await getShiftsByGroupId(groupId);
        
        const totalShifts = assignments.filter(assignment => 
          groupShifts.some(shift => shift.id === assignment.shiftId)
        );

        return totalShifts.length;
      } catch (error) {
        console.error('Error fetching user total shifts:', error);
        return 0;
      }
    },
    enabled: !!userId && !!groupId,
  });
};

// Mutation hooks for user management
export const useUpdateUserRole = (groupId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, action }: { userId: string; action: 'makeAdmin' | 'removeAdmin' | 'removeFromGroup' }) =>
      userManagementApi.updateUserRole(groupId, userId, action),
    onSuccess: (data, variables) => {
      // Invalidate and refetch group users
      queryClient.invalidateQueries({ queryKey: ['groupUsers', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groupUsersWithPoints', groupId] });
      
      // Invalidate user-specific queries
      queryClient.invalidateQueries({ queryKey: ['userGroupPoints', groupId, variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['userShiftHistory', variables.userId, groupId] });
      queryClient.invalidateQueries({ queryKey: ['userUpcomingShifts', variables.userId, groupId] });
      queryClient.invalidateQueries({ queryKey: ['userShiftsThisMonth', variables.userId, groupId] });
      queryClient.invalidateQueries({ queryKey: ['userTotalShifts', variables.userId, groupId] });
      
      // If removing from group, also invalidate all users
      if (variables.action === 'removeFromGroup') {
        queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      }
    },
  });
};

export const useUpdateUserCategories = (groupId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, userCategories }: { userId: string; userCategories: string[] }) =>
      userManagementApi.updateUserCategories(groupId, userId, userCategories),
    onSuccess: (data, variables) => {
      // Invalidate and refetch group users
      queryClient.invalidateQueries({ queryKey: ['groupUsers', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groupUsersWithPoints', groupId] });
      
      // Invalidate user-specific queries
      queryClient.invalidateQueries({ queryKey: ['userGroupPoints', groupId, variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['userShiftHistory', variables.userId, groupId] });
      queryClient.invalidateQueries({ queryKey: ['userUpcomingShifts', variables.userId, groupId] });
      queryClient.invalidateQueries({ queryKey: ['userShiftsThisMonth', variables.userId, groupId] });
      queryClient.invalidateQueries({ queryKey: ['userTotalShifts', variables.userId, groupId] });
    },
  });
};

// Add users to group mutation
export const useAddUsersToGroup = (groupId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userIds }: { userIds: string[] }) =>
      userManagementApi.addUsersToGroup(groupId, userIds),
    onSuccess: () => {
      // Invalidate and refetch group users
      queryClient.invalidateQueries({ queryKey: ['groupUsers', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groupUsersWithPoints', groupId] });
      
      // Invalidate all users to refresh available users list
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}; 