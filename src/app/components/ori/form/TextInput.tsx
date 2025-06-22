'use client'

import { Input } from '@/app/components/loveable/input'
import { Label } from '@/app/components/loveable/label'
import { FieldError, UseFormRegister } from 'react-hook-form'

interface Props {
  label: string
  name: string
  register: UseFormRegister<any>
  disabled?: boolean
  error?: FieldError
  type?: 'text' | 'password'
}

export const TextInput = ({ label, name, register, disabled, error, type = 'text' }: Props) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        {...register(name)}
        disabled={disabled}
      />
      {error && <p className="text-red-600 text-sm">{error.message}</p>}
    </div>
  )
}
