// app/register/api/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getUserByUsername, createUser } from '@/app/shared/firebase/CRUD/users'
import { hashPassword } from '@/app/shared/utils/hash'
import { User } from '@/app/shared/types'
import { v4 as uuid } from 'uuid'

export async function POST(req: NextRequest) {
  const { action, data } = await req.json()

  switch (action) {
    case 'register': {
      const existing = await getUserByUsername(data.username)
      if (existing) return NextResponse.json({ error: 'שם המשתמש כבר תפוס' }, { status: 409 })

      const hashedPassword = await hashPassword(data.password)
      const newUser: User = {
        id: uuid(),
        username: data.username,
        password: hashedPassword,
        name: data.fullName,
        gender: data.gender,
        isActive: true,
        isGlobalAdmin: false,
        userCategories: data.userCategories || [],
        groups: (data.selectedGroups || []).map((groupId: string) => ({ groupId, isAdmin: false }))
      }

      await createUser(newUser)
      return NextResponse.json({ success: true })
    }
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }
}

