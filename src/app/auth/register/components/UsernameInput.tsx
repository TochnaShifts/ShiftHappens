'use client'

import { Label } from '@/app/components/loveable/label'
import { Input } from '@/app/components/loveable/input'

interface Props {
  register: any
  error?: { message?: string }
  disabled?: boolean
}

export const UsernameInput = ({ register, error, disabled }: Props) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="username">שם משתמש</Label>
      <Input id="username" {...register('username')} disabled={disabled} placeholder='הכנס שם משתמש' />
      {error?.message && <p className="text-red-600 text-sm">{error.message}</p>}
    </div>
  )
}