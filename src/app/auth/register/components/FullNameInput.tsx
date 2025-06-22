'use client'

import { Label } from '@/app/components/loveable/label'
import { Input } from '@/app/components/loveable/input'

interface Props {
  register: any
  error?: { message?: string }
  disabled?: boolean
}

export const FullNameInput = ({ register, error, disabled }: Props) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="fullName">שם מלא</Label>
      <Input id="fullName" {...register('fullName')} disabled={disabled} placeholder='הכנס שם מלא' />
      {error?.message && <p className="text-red-600 text-sm">{error.message}</p>}
    </div>
  )
}
