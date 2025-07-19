import { apiHandler } from "@/app/shared/utils/apiHandler";
import { NextRequest } from "next/server";
import { getSessionUser } from '@/app/shared/utils/session.server';
import { updateUser, getUserById } from '@/app/shared/firebase/CRUD/users';

export const POST = apiHandler(async (req: NextRequest) => {
  const { action, data } = await req.json();

  // Get groupId from the URL path
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const groupId = pathParts[pathParts.indexOf('group-admin') + 1];

  const user = await getSessionUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  // Check if user is admin of this group or global admin
  const isGroupAdmin = user.groups?.some(g => g.groupId === groupId && g.isAdmin);
  const isGlobalAdmin = user.isGlobalAdmin;
  
  if (!isGroupAdmin && !isGlobalAdmin) {
    throw new Error('Forbidden');
  }

  switch (action) {
    case 'updateUserRole': {
      const { userId, roleAction } = data;
      if (!userId || !roleAction) {
        throw new Error('Missing required fields');
      }

      const targetUser = await getUserById(userId);
      if (!targetUser) {
        throw new Error('User not found');
      }

      let updatedGroups = targetUser.groups || [];

      switch (roleAction) {
        case 'makeAdmin':
          const existingGroupIndex = updatedGroups.findIndex(g => g.groupId === groupId);
          if (existingGroupIndex >= 0) {
            updatedGroups[existingGroupIndex].isAdmin = true;
          } else {
            updatedGroups.push({ groupId, isAdmin: true });
          }
          break;

        case 'removeAdmin':
          updatedGroups = updatedGroups.map(g => 
            g.groupId === groupId ? { ...g, isAdmin: false } : g
          );
          break;

        case 'removeFromGroup':
          updatedGroups = updatedGroups.filter(g => g.groupId !== groupId);
          break;

        default:
          throw new Error('Invalid role action');
      }

      await updateUser(userId, { groups: updatedGroups });
      return { success: true };
    }

    case 'updateUserCategories': {
      const { userId, userCategories } = data;
      if (!userId || !userCategories) {
        throw new Error('Missing required fields');
      }

      await updateUser(userId, { userCategories });
      return { success: true };
    }

    case 'addUsersToGroup': {
      const { userIds } = data;
      if (!userIds || !Array.isArray(userIds)) {
        throw new Error('Missing or invalid userIds');
      }

      // Add each user to the group
      for (const userId of userIds) {
        const targetUser = await getUserById(userId);
        if (targetUser) {
          const updatedGroups = targetUser.groups || [];
          const existingGroupIndex = updatedGroups.findIndex(g => g.groupId === groupId);
          
          if (existingGroupIndex < 0) {
            // User is not in this group, add them
            updatedGroups.push({ groupId, isAdmin: false });
            await updateUser(userId, { groups: updatedGroups });
          }
        }
      }

      return { success: true };
    }

    default:
      throw new Error('Unknown action');
  }
}); 