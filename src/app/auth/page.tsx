'use client'

import { useState } from 'react'
import LoginForm from './login/page'
import RegisterForm from './register/page'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/app/components/loveable/card'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url(/office.jpg)" }}
      dir="rtl"
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <img
                src="/logo.svg"
                alt="TochnaShifts"
                className="w-15 h-15 object-cover rounded-lg"
              />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Shift Happens
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isLogin ? 'התחבר כדי לנהל את המשמרות שלך' : 'הרשם למערכת ניהול המשמרות'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex bg-gray-200 rounded-lg p-1 mb-6">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  isLogin ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                כניסה
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  !isLogin ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                הרשמה
              </button>
            </div>

            {isLogin ? <LoginForm /> : <RegisterForm onRegistrationSuccess={() => setIsLogin(true)} />}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
