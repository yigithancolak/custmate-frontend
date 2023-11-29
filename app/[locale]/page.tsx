'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const t = useTranslations('IndexPage')
  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col items-center gap-3 p-24">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-5 animate-fade-in-top">
        {t('title')}
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 animate-appear">
        {t('desc')}
      </p>
      <p className="text-lg underline text-blue-500 dark:text-blue-300 mt-5 hover:animate-scale">
        <Link href="/auth">{t('haveAccount')}</Link>
      </p>
    </main>
  )
}
