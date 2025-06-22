
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';

interface GroupMembership {
  group_id: string;
  group_name: string;
  group_type: string;
  is_admin: boolean;
}

interface GroupAuthState {
  groupMemberships: GroupMembership[];
  adminGroups: GroupMembership[];
  isGlobalAdmin: boolean;
  loading: boolean;
}

export const useGroupAuth = () => {
  const { user } = useAuth();
  const [state, setState] = useState<GroupAuthState>({
    groupMemberships: [],
    adminGroups: [],
    isGlobalAdmin: false,
    loading: true
  });

  useEffect(() => {
    if (!user) {
      setState({
        groupMemberships: [],
        adminGroups: [],
        isGlobalAdmin: false,
        loading: false
      });
      return;
    }

    fetchUserGroupData();
  }, [user]);

  const fetchUserGroupData = async () => {
    if (!user) return;

    try {
      console.log('Fetching group data for user:', user.id);
      
      // Mock group data mapping
      const groupData = {
        '11111111-1111-1111-1111-111111111111': { name: 'System Administrators', type: 'admin' },
        '22222222-2222-2222-2222-222222222222': { name: 'Security Team', type: 'security' },
        '33333333-3333-3333-3333-333333333333': { name: 'Maintenance', type: 'maintenance' }
      };

      // Convert user groups to the expected format
      const groupMemberships = user.groups.map(userGroup => ({
        group_id: userGroup.groupId,
        group_name: groupData[userGroup.groupId as keyof typeof groupData]?.name || 'Unknown Group',
        group_type: groupData[userGroup.groupId as keyof typeof groupData]?.type || 'regular',
        is_admin: userGroup.isAdmin
      }));

      console.log('Processed group memberships:', groupMemberships);

      const adminGroups = groupMemberships.filter(group => group.is_admin);
      console.log('Admin groups:', adminGroups);
      
      const isGlobalAdmin = user.isGlobalAdmin;
      console.log('Is global admin:', isGlobalAdmin);

      setState({
        groupMemberships,
        adminGroups,
        isGlobalAdmin,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching group data:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const isGroupAdmin = (groupId: string) => {
    return state.adminGroups.some(group => group.group_id === groupId);
  };

  const getGroupName = (groupId: string) => {
    const group = state.groupMemberships.find(group => group.group_id === groupId);
    return group?.group_name;
  };

  const refreshGroupData = () => {
    fetchUserGroupData();
  };

  return {
    ...state,
    isGroupAdmin,
    getGroupName,
    refreshGroupData
  };
};
