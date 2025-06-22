// app/api/user-categories/route.ts
import { NextResponse } from 'next/server'
import { getAllUserCategories } from '@/app/shared/firebase/CRUD/userCategories'

export async function GET() {
  try {
    const categories = await getAllUserCategories()
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 })
  }
}
