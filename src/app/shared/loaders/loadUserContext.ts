import { getSessionUser } from '@/app/shared/utils/session.server'
import { getGroupsByIds } from '@/app/shared/firebase/CRUD/groups'
import { getUserCategoriesByIds } from '@/app/shared/firebase/CRUD/userCategories'
import { Group, User, UserCategory, UserGroupRole, Request } from '@/app/shared/types'
import { Timestamp } from 'firebase/firestore'
import { getRequestsByUserId } from '@/app/api/user/requests/functions'

export async function loadUserContext(): Promise<{
  user: User | null
  userGroups: Group[]
  groupsAdmin: Group[]
  userCategories: UserCategory[],
  requests: Request[]
}> {
  const user = await getSessionUser()

  if (!user) return { user: null, userGroups: [], groupsAdmin: [], userCategories: [], requests: [] }

  user.createdAt = user.createdAt instanceof Timestamp ? user.createdAt.toDate() : user.createdAt

  const requests = await getRequestsByUserId(user.id)

  const userGroups = user.groups?.length
    ? (await getGroupsByIds(user.groups.map(g => g.groupId))).filter((g): g is Group => g !== null)
    : []

  const groupsAdmin = (await getGroupsByIds(user.groups.filter(g => g.isAdmin).map(g => g.groupId))).filter((g): g is Group => g !== null)

  const userCategories = user.userCategories?.length
    ? (await getUserCategoriesByIds(user.userCategories)).filter((c): c is UserCategory => c !== null)
    : []

  return { user, userGroups, groupsAdmin, userCategories, requests }
}
