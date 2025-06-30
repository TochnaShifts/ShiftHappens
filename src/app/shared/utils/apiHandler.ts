
import { NextRequest, NextResponse } from 'next/server'

type Handler<T = any> = (req: NextRequest) => Promise<T>

export function apiHandler<T>(handler: Handler<T>) {
  return async function (req: NextRequest) {
    try {
      const result = await handler(req)
      
      return NextResponse.json(result)
    } catch (err: any) {
      console.error('API Handler Error:', err)
      return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
    }
  }
}
