'use client'

import { Label } from '@/app/components/loveable/label'
import { Select, SelectItem } from '@/app/components/loveable/select'
import { Gender } from '@/app/shared/types'
import { useForm } from 'react-hook-form'

interface Props {
  error?: { message?: string }
  disabled?: boolean
}

export const GenderSelect = ({ error, disabled }: Props) => {
  const { register } = useForm()
  return (
    <div className="space-y-2" dir="rtl">
      <Label htmlFor="gender">מגדר</Label>
      <Select {...register('gender')} disabled={disabled} defaultValue="">
        <SelectItem value="">בחר מגדר</SelectItem>
        <SelectItem value={Gender.Male}>זכר</SelectItem>
        <SelectItem value={Gender.Female}>נקבה</SelectItem>
      </Select>
      {error?.message && <p className="text-red-600 text-sm">{error.message}</p>}
    </div>
  )
}
