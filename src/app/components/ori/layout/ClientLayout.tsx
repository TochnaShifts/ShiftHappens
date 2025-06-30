'use client'

import React, { useMemo } from 'react'
import { UserProvider } from '@/app/contexts/UserContext'
import Sidebar from '@/app/components/ori/layout/sidebar/Sidebar'
import { Group, User, UserCategory } from '@/app/shared/types'
import { ReactNode } from 'react'
import { loadUserContext } from '@/app/shared/loaders/loadUserContext'
import ClientShell from '@/app/components/ori/layout/ClientShell'

type Props = {
  children: React.ReactNode
}

export const ClientLayout = ({children}: Props) => {
  const memoChildren = useMemo(() => children, [children]);
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{memoChildren}</main>
    </div>
  )
}

