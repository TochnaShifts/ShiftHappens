import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { User } from '@/app/shared/types'
import { cache } from 'react'

export const setSessionCookie = async (user: User) => {
  const cookieStore = await cookies()
  cookieStore.set('session', JSON.stringify(user), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

export const getSessionUser = async (): Promise<User | null> => {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  return session ? JSON.parse(session) : null
}

export const clearSession = async () => {
  const cookieStore = await cookies()
  cookieStore.set('session', '', { maxAge: 0 })
}

export const verifyAuth = cache((req: NextRequest): User | null => {
  const session = req.cookies.get('session')?.value
  if (!session) return null

  try {
    return JSON.parse(session) as User
  } catch {
    return null
  }
})