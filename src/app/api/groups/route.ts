import { NextResponse } from 'next/server'
import { getAllGroups } from '@/app/shared/firebase/CRUD/groups'

export async function GET() {
  try {
    const groups = await getAllGroups()
    return NextResponse.json(groups)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load groups' }, { status: 500 })
  }
}
