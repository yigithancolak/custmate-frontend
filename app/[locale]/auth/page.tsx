'use client'

import { AuthForm } from '@/components/AuthForm/AuthForm'
import { useTranslations } from 'next-intl'

export default function LoginPage() {
  const t = useTranslations('AuthPage')
  return (
    <main className="flex flex-col items-center w-full h-full">
      <h3 className="text-3xl text-center py-6 px-3">{t('header')}</h3>
      <AuthForm />
    </main>
  )
}
