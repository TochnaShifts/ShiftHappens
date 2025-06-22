'use client'

import { Label } from '@/app/components/loveable/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/app/components/loveable/select'
import { Gender } from '@/app/shared/types'

interface Props {
  setValue: (field: string, value: any) => void
  error?: { message?: string }
  disabled?: boolean
}

export const GenderSelect = ({ setValue, error, disabled }: Props) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="gender">מגדר</Label>
      <Select onValueChange={(val) => setValue('gender', Number(val) as Gender)} disabled={disabled}>
        <SelectTrigger id="gender" className="h-12">
          <SelectValue placeholder="בחר מגדר" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={String(Gender.Male)}>זכר</SelectItem>
          <SelectItem value={String(Gender.Female)}>נקבה</SelectItem>
        </SelectContent>
      </Select>
      {error?.message && <p className="text-red-600 text-sm">{error.message}</p>}
    </div>
  )
}
