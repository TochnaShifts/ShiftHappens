// app/login/api/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getUserByUsername } from '@/app/shared/firebase/CRUD/users'
import { isPasswordValid } from '@/app/shared/utils/hash'
import { setSessionCookie } from '@/app/shared/utils/session'

export async function POST(req: NextRequest) {
  const { action, data } = await req.json()
  console.log(data)
  switch (action) {
    case 'login':
      return tryLogin(data.username, data.password)
    default:
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 })
  }

}

const tryLogin = async (username: string, password: string) => {
  const user = await getUserByUsername(username)
  if (!user || !(await isPasswordValid(password, user.password))) {
    return NextResponse.json({ message: 'שם משתמש או סיסמה שגויים' }, { status: 401 })
  }

  await setSessionCookie(user)
  return NextResponse.json(user)
}

