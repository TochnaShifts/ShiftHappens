'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus } from 'lucide-react'
import { apiPost } from '@/app/shared/utils/apiClient'
import { userRegisterSchema, UserRegisterZod } from '@/app/shared/types/zodSchemas'
import { UsernameInput, FullNameInput, GenderSelect } from './components'
import { GroupMultiSelect, CategoryMultiSelect, PasswordInput } from '@/app/components/ori'
import { Button } from '@/app/components/loveable/button'
import { Alert, AlertDescription } from '@/app/components/loveable/alert';
import { LoadingSpinner } from '@/app/components'

interface RegisterFormProps {
  onRegistrationSuccess: () => void;
}

export default function RegisterForm({ onRegistrationSuccess }: RegisterFormProps) {
  const router = useRouter()
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<UserRegisterZod>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: { userCategories: [], selectedGroups: [] },
  })

  const onSubmit = async (data: UserRegisterZod) => {
    setError('')
    try {
      await apiPost('/auth/register/api', 'register', data)
      onRegistrationSuccess();
    } catch (err: any) {
      setError(err.message || 'שגיאה בהרשמה')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
      )}

      <UsernameInput register={register} error={errors.username} disabled={isSubmitting} />
      <FullNameInput register={register} error={errors.fullName} disabled={isSubmitting} />
      <GenderSelect
        setValue={(field, value) => setValue(field as any, value)}
        error={errors.gender}
        disabled={isSubmitting}
      />
      <PasswordInput label="סיסמה" name="password" register={register} error={errors.password} disabled={isSubmitting} />
      <PasswordInput label="אימות סיסמה" name="confirmPassword" register={register} error={errors.confirmPassword} disabled={isSubmitting} isPassowrdConfirm={true} />
      <GroupMultiSelect
        selected={watch('selectedGroups') || []}
        onChange={(val: string[]) => setValue('selectedGroups', val)}
        error={errors.selectedGroups}
      />
      <CategoryMultiSelect
        selected={watch('userCategories') || []}
        onChange={(val: string[]) => setValue('userCategories', val)}
      />

      <Button type="submit" className="w-full" dir="ltr" disabled={isSubmitting}>
        {isSubmitting ? (
          <div className="flex items-center space-x-2 space-x-reverse">
            <LoadingSpinner size="sm" />
            <span>נרשם...</span>
          </div>
        ) : (
          <>
            <UserPlus className="w-4 h-4 ml-2" /> הרשמה
          </>
        )}
      </Button>

      <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded">
        <p className="text-sm text-purple-700 text-center">💡 לאחר ההרשמה תוכל להתחבר עם הפרטים שהכנסת</p>
      </div>
    </form>
  )
}