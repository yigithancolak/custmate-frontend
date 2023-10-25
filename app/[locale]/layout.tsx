import Header from '@/components/Header/Header'
import { Toaster } from '@/components/ui/toaster'
import { ApolloWrapper } from '@/providers/ApolloProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'
import '../globals.css'

type LocaleProps = {
  children: ReactNode
  params: { locale: string }
}

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Custmate',
  description: 'CRM Tool'
}
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'tr' }]
}

async function getMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: LocaleProps) {
  const messages = await getMessages(locale)

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <ApolloWrapper>
              <Header />
              <Toaster />
              {children}
            </ApolloWrapper>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
