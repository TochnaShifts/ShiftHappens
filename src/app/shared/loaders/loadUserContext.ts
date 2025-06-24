import { getSessionUser } from '@/app/shared/utils/session.server'
import { getGroupsByIds } from '@/app/shared/firebase/CRUD/groups'
import { getUserCategoriesByIds } from '@/app/shared/firebase/CRUD/userCategories'
import { Group, User, UserCategory } from '@/app/shared/types'

export async function loadUserContext(): Promise<{
  user: User | null
  groupsAdmin: Group[]
  userCategories: UserCategory[]
}> {
  const user = await getSessionUser()

  if (!user) return { user: null, groupsAdmin: [], userCategories: [] }


  const groupsAdmin = user.groups?.length
    ? (await getGroupsByIds(user.groups.map(g => g.groupId))).filter((g): g is Group => g !== null)
    : []

  const userCategories = user.userCategories?.length
    ? (await getUserCategoriesByIds(user.userCategories)).filter((c): c is UserCategory => c !== null)
    : []

  return { user, groupsAdmin, userCategories }
}
