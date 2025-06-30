'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { apiPost } from '@/app/shared/utils/apiClient'
import {Button} from '@/app/components/loveable/button'
import {Alert,AlertDescription} from '@/app/components/loveable/alert'
import { LogIn } from 'lucide-react'
import { User } from '@/app/shared/types'
import { userLoginSchema, UserLoginZod } from '@/app/shared/types/zodSchemas'
import {UsernameInput } from '../register/components'
import { PasswordInput } from '../../components/ori/form'

type FormValues = UserLoginZod

export default function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const {register,handleSubmit,formState: { errors, isSubmitting }} = useForm<FormValues>({
    resolver: zodResolver(userLoginSchema)
  })

  const onSubmit = async (data: FormValues) => {
    setError('')
    try {
      const user = await apiPost<User>('/auth/login/api', 'login', data)

      if (user.isGlobalAdmin) {
        router.push('/global-admin')
      } else {
        router.push('/user/dashboard')
      }

    } catch (err: any) {
      setError(err.message || 'שגיאה בהתחברות')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
      )}

      <div className="space-y-2">
        <UsernameInput register={register} error={errors.username} disabled={isSubmitting} />
      </div>

      <div className="space-y-2">
        <PasswordInput register={register} error={errors.password} disabled={isSubmitting} label="סיסמה" name="password" />
      </div>

      <Button type="submit" className="w-full" dir="ltr" disabled={isSubmitting}>
        {isSubmitting ? 'מתחבר...' : <><LogIn className="w-4 h-4 ml-2" /> כניסה</>}
      </Button>
    </form>
  )
}