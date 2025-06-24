'use client'

import React from 'react'
import { UserProvider } from '@/app/contexts/UserContext'
import Sidebar from '@/app/components/ori/layout/sidebar/Sidebar'
import { Group, User, UserCategory } from '@/app/shared/types'

export default function ClientLayout({children,}: { 
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
    </div>
  )
}
