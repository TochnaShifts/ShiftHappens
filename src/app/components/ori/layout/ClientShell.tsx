'use client'

import React from 'react'
import { UserProvider } from '@/app/contexts/UserContext'
import { Group, User, UserCategory } from '@/app/shared/types'
import ClientLayoutWrapper from '@/app/components/ori/layout/ClientLayoutWrapper'

type Props = {
  user: User
  groupsAdmin: Group[]
  userCategories: UserCategory[]
  children: React.ReactNode
}

export default function ClientShell({
  user,
  groupsAdmin,
  userCategories,
  children,
}: Props) {
  return (
    <UserProvider
      initialUser={user}
      initialGroupsAdmin={groupsAdmin}
      initialUserCategories={userCategories}
    >
      <ClientLayoutWrapper user={user}>{children}</ClientLayoutWrapper>
    </UserProvider>
  )
}
