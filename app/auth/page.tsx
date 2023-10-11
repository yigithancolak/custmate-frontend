'use client'

import { LoginForm } from '@/components/LoginForm/LoginForm'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  return (
    <main className="flex flex-col items-center w-full h-full">
      <h3 className="text-2xl text-center py-6">LOGIN</h3>
      <div className="flex w-10/12 md:w-6/12 ">
        <LoginForm />
      </div>
    </main>
  )
}
