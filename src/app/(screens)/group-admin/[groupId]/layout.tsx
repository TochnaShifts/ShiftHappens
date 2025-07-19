import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import ClientShell from '@/app/components/ori/layout/ClientShell'
import { getSessionUser } from '@/app/shared/utils/session.server'
import { prefetchUserData } from '@/app/shared/prefeatch'

export default async function GroupAdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser()

  if (!user) redirect('/auth');
  if (user.isGlobalAdmin) redirect('/global-admin');

  // Check if user is admin of any group
  const isGroupAdmin = user.groups.some(group => group.isAdmin)
  if (!isGroupAdmin) {
    redirect('/user/dashboard');
  }

  // Prefetch all user data
  const dehydratedState = await prefetchUserData(user)

  return (
    <ClientShell
      user={user}
      dehydratedState={dehydratedState}
    >
      {children}
    </ClientShell>
  )
}
