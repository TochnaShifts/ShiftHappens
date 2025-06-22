'use client'

import { Label } from '@/app/components/loveable/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/app/components/loveable/select'
import { FieldError, UseFormSetValue } from 'react-hook-form'

interface Props {
  label: string
  name: string  
  setValue: UseFormSetValue<any>
  options: { label: string; value: string }[]
  placeholder?: string
  error?: FieldError
  disabled?: boolean
}

export const SelectInput = ({ label, name, setValue, options, placeholder, error, disabled }: Props) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Select onValueChange={(val) => setValue(name, val)} disabled={disabled}>
        <SelectTrigger id={name} className="h-12">
          <SelectValue placeholder={placeholder || 'בחר'} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-600 text-sm">{error.message}</p>}
    </div>
  )
}
