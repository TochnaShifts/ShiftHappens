'use client'

import { Label } from '@/app/components/loveable/label'
import { Select, SelectItem } from '@/app/components/loveable/select'
import { FieldError, UseFormSetValue } from 'react-hook-form'
import { useForm } from 'react-hook-form'

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
  const { register } = useForm()

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Select {...register(name)} disabled={disabled} defaultValue="">
        <SelectItem value="">בחר אפשרות</SelectItem>
        {options.map(opt => (
          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
        ))}
      </Select>
      {error && <p className="text-red-600 text-sm">{error.message}</p>}
    </div>
  )
}
