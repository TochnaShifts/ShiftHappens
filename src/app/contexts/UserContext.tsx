'use client'

import React, { createContext, useContext, useState } from 'react'
import { Group, User, UserCategory } from '@/app/shared/types'
import { redirect } from 'next/navigation'

type UserContextType = {
  user: User | null
  groupsAdmin: Group[]
  userCategories: UserCategory[]
  setUser: (user: User | null) => void
  setGroupsAdmin: (groups: Group[]) => void
  setUserCategories: (categories: UserCategory[]) => void
  signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({
  children,
  initialUser,
  initialGroupsAdmin = [],
  initialUserCategories = [],
}: {
  children: React.ReactNode
  initialUser: User | null
  initialGroupsAdmin?: Group[]
  initialUserCategories?: UserCategory[]
}) => {
  const [user, setUser] = useState<User | null>(initialUser)
  const [groupsAdmin, setGroupsAdmin] = useState<Group[]>(initialGroupsAdmin)
  const [userCategories, setUserCategories] = useState<UserCategory[]>(initialUserCategories)

  const signOut = async () => {
    await fetch('/api/logout', { method: 'POST' })
    redirect('/auth')
  }

  return (
    <UserContext.Provider
      value={{
        user,
        groupsAdmin,
        userCategories,
        setUser,
        setGroupsAdmin,
        setUserCategories,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used inside UserProvider')
  return ctx
}
