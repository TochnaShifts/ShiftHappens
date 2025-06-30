'use client'

import React, { createContext, useContext, useState } from 'react'
import { Group, User, UserCategory } from '@/app/shared/types'
import { redirect } from 'next/navigation'

type UserContextType = {
  user: User | null
  userGroups: Group[]
  groupsAdmin: Group[]
  userCategories: UserCategory[]
  setUser: (user: User | null) => void
  setUserGroups: (groups: Group[]) => void
  setGroupsAdmin: (groups: Group[]) => void
  setUserCategories: (categories: UserCategory[]) => void
  signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({
  children,
  initialUser,
  initialUserGroups = [],
  initialGroupsAdmin = [],
  initialUserCategories = [],
}: {
  children: React.ReactNode
  initialUser: User | null
  initialUserGroups?: Group[]
  initialGroupsAdmin?: Group[]
  initialUserCategories?: UserCategory[]
}) => {
  const [user, setUser] = useState<User | null>(initialUser)
  const [userGroups, setUserGroups] = useState<Group[]>(initialUserGroups)
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
        userGroups,
        groupsAdmin,
        userCategories,
        setUser,
        setUserGroups,
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
