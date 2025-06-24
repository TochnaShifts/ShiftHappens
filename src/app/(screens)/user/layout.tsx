import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { loadUserContext } from '@/app/shared/loaders/loadUserContext'
import ClientShell from '@/app/components/ori/layout/ClientShell'

export default async function UserLayout({ children }: { children: ReactNode }) {
  const { user, groupsAdmin, userCategories } = await loadUserContext()

  if (!user) redirect('/auth')
  if (user.isGlobalAdmin) redirect('/global-admin')

  return (
    <ClientShell user={user} groupsAdmin={groupsAdmin} userCategories={userCategories}>
      {children}
    </ClientShell>
  )
}
