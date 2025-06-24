import React, { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import ClientLayout from '@/app/components/ori/layout/ClientLayout'
import { Group, User, UserCategory } from '@/app/shared/types'
import { UserProvider } from '@/app/contexts/UserContext'

export default function ClientLayoutWrapper({
  user,
  children,
}: {
  user: User
  children: ReactNode
}) {
  if (!user) redirect('/auth')
  if (user?.isGlobalAdmin) redirect('/global-admin')

  return (
      <ClientLayout>{children}</ClientLayout>
  )
}
