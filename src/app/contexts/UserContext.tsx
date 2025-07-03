'use client'

import React, { createContext, useContext, useState } from 'react'
import { Group, User, UserCategory } from '@/app/shared/types'
import { redirect } from 'next/navigation'
import { queryKeys, useInvalidateUserData } from '../shared/utils/queryKeys'
import { useQueryClient } from '@tanstack/react-query'

type UserContextType = {
  user: User | null
  setUser: (user: User | null) => void
  signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: User | null
}) => {
  const [user, setUser] = useState<User | null>(initialUser)
  const { invalidateAllUserData } = useInvalidateUserData()

  const signOut = async () => {
    await fetch('/api/logout', { method: 'POST' })

    if (user) {
      invalidateAllUserData(user.id)
    }
    redirect('/auth')
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
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
