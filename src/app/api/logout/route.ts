// app/api/logout/route.ts
import { NextResponse } from 'next/server'
import { clearSession } from '@/app/shared/utils/session.server'

export async function POST() {
  
  // Clear the session cookie (adjust cookie name to your actual session cookie)
  await clearSession()
  

  return NextResponse.json({ message: 'Logged out' })
}
