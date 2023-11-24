'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function Home() {
  const t = useTranslations('IndexPage')
  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-24">
      <h1 className="font-bold">{t('title')}</h1>
      <p>{t('desc')}</p>
      <p
        className="underline cursor-pointer text-sm"
        onClick={() => {
          router.push('/auth')
        }}
      >
        {t('haveAccount')}
      </p>
    </main>
  )
}
