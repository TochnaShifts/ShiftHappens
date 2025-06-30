import { ReactNode } from 'react'
import ClientShell from '@/app/components/ori/layout/ClientShell'
import { redirect } from 'next/navigation'
import { loadUserContext } from '@/app/shared/loaders/loadUserContext'

export default async function GroupAdminLayout({ children }: { children: ReactNode }) {
  const { user, userGroups, groupsAdmin, userCategories } = await loadUserContext();

  return (
    <ClientShell
      user={user}
      userGroups={userGroups}
      groupsAdmin={groupsAdmin}
      userCategories={userCategories}
    >
      {children}
    </ClientShell>
  )
}
