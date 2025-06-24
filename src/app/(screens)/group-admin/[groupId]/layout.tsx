import { ReactNode } from 'react'
import ClientShell from '@/app/components/ori/layout/ClientShell'
import { redirect } from 'next/navigation'
import { loadUserContext } from '@/app/shared/loaders/loadUserContext'

export default async function GroupAdminLayout({ children }: { children: ReactNode }) {
  const { user, groupsAdmin, userCategories } = await loadUserContext()

  if (!user) redirect('/auth')
  if (user.isGlobalAdmin) redirect('/global-admin')

  return (
    <ClientShell user={user} groupsAdmin={groupsAdmin} userCategories={userCategories}>
      {children}
    </ClientShell>
  )
}
