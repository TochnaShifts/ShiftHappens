import { useQuery } from "@tanstack/react-query";
import { getShiftsByGroupId } from "@/app/shared/firebase/CRUD/shifts";
import { getRequestsByGroupId } from "@/app/shared/firebase/CRUD/requests";
import { getUsersByGroupId } from "@/app/shared/firebase/CRUD/users";
import { ShiftStatus } from "@/app/shared/types/enums";

// Get upcoming shifts for a specific group
export const useGetUpcomingShiftsForGroup = (groupId: string) => {
    return useQuery({
        queryKey: ['upcomingShiftsForGroup', groupId],
        queryFn: async () => {
            try {
                const shifts = await getShiftsByGroupId(groupId);
                return shifts.filter(shift => 
                    new Date(shift.startDate) > new Date() && shift.status === ShiftStatus.Active
                );
            } catch (error) {
                console.error('Error fetching upcoming shifts:', error);
                return [];
            }
        },
        enabled: !!groupId,
    });
};

// Get all requests for a specific group
export const useGetRequestsForGroup = (groupId: string) => {
    return useQuery({
        queryKey: ['requestsForGroup', groupId],
        queryFn: async () => {
            try {
                return await getRequestsByGroupId(groupId);
            } catch (error) {
                console.error('Error fetching requests:', error);
                return [];
            }
        },
        enabled: !!groupId,
    });
};

// Get group members count
export const useGetGroupMembersCount = (groupId: string) => {
    return useQuery({
        queryKey: ['groupMembersCount', groupId],
        queryFn: async () => {
            try {
                const users = await getUsersByGroupId(groupId);
                return users.length;
            } catch (error) {
                console.error('Error fetching group members:', error);
                return 0;
            }
        },
        enabled: !!groupId,
    });
};

// Get recent activity for a group
export const useGetRecentGroupActivity = (groupId: string) => {
    return useQuery({
        queryKey: ['recentGroupActivity', groupId],
        queryFn: async () => {
            try {
                const [shifts, requests] = await Promise.all([
                    getShiftsByGroupId(groupId),
                    getRequestsByGroupId(groupId)
                ]);

                const activities = [
                    ...shifts.map(shift => ({
                        id: shift.id,
                        type: 'shift_created',
                        title: shift.displayName 
                            ? `נוצרה משמרת חדשה - ${shift.displayName}`
                            : 'נוצרה משמרת חדשה',
                        date: shift.createdAt,
                        color: 'green'
                    })),
                    ...requests.map(request => {
                        // Convert request type to Hebrew description
                        const getRequestTypeText = (type: number) => {
                            switch (type) {
                                case 1: return 'הוגשה בקשת הסתייגות';
                                case 2: return 'הוגשה בקשת העדפה';
                                default: return 'הוגשה בקשה חדשה';
                            }
                        };

                        return {
                            id: request.id,
                            type: 'request_created',
                            title: getRequestTypeText(request.type),
                            date: request.createdAt,
                            color: 'yellow'
                        };
                    })
                ];

                return activities
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 8);
            } catch (error) {
                console.error('Error fetching recent activity:', error);
                return [];
            }
        },
        enabled: !!groupId,
    });
}; 