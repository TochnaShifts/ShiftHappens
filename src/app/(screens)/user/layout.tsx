import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { loadUserContext } from '@/app/shared/loaders/loadUserContext'
import ClientShell from '@/app/components/ori/layout/ClientShell'
import { getSessionUser } from '@/app/shared/utils/session.server'
import { prefetchUserData } from '@/app/shared/prefeatch'

export default async function UserLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser()

  if (!user) redirect('/auth');
  if (user.isGlobalAdmin) redirect('/global-admin');

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
