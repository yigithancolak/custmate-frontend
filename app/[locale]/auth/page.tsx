'use client'

import { LoginForm } from '@/components/LoginForm/LoginForm'
import { useTranslations } from 'next-intl'

export default function LoginPage() {
  const t = useTranslations('LoginPage')
  return (
    <main className="flex flex-col items-center w-full h-full">
      <h3 className="text-2xl text-center py-6">{t('header')}</h3>
      <div className="flex w-10/12 md:w-6/12 ">
        <LoginForm />
      </div>
    </main>
  )
}
