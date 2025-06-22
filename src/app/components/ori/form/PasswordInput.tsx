'use client'

import { useState } from 'react'
import { Input } from '@/app/components/loveable/input'
import { Label } from '@/app/components/loveable/label'
import { Button } from '@/app/components/loveable/button'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { FieldError, UseFormRegister } from 'react-hook-form'

interface Props {
  label: string
  name: string
  register: UseFormRegister<any>
  disabled?: boolean
  error?: FieldError,
  isPassowrdConfirm?: boolean
}

export const PasswordInput = ({ label, name, register, disabled, error, isPassowrdConfirm }: Props) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        <Input
          id={name}
          type={visible ? 'text' : 'password'}
          {...register(name)}
          disabled={disabled}
          className="pl-10"
          placeholder={isPassowrdConfirm ? 'הכנס סיסמה שנית לאימות' : 'הכנס סיסמה'}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute left-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={() => setVisible(!visible)}
        >
          {visible ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
        </Button>
      </div>
      {error && <p className="text-red-600 text-sm">{error.message}</p>}
    </div>
  )
}