'use client'

import { Calendar, Bell, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/components/loveable/button'
import { User } from '@/app/shared/types/models'

type Props = {
  user: User
}

export const DashboardHeader = ({ user }: Props) => {
  const router = useRouter()

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">לוח בקרה</h1>
              <p className="text-sm text-gray-600">ברוך הבא, {user.name}!</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert('אין התראות חדשות')}
            >
              <Bell className="w-4 h-4 ml-2" />
              התראות
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              onClick={() => router.push('/user/requests')}
            >
              <Plus className="w-4 h-4 ml-2" />
              בקשת חופש
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
