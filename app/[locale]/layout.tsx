import Header from '@/components/Header/Header'
import { Toaster } from '@/components/ui/toaster'
import { ApolloWrapper } from '@/providers/ApolloProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
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

export default async function LocaleLayout({
  children,
  params: { locale }
}: LocaleProps) {
  let messages
  try {
    messages = (await import(`../../messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <AuthProvider>
          <ApolloWrapper>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NextIntlClientProvider locale={locale} messages={messages}>
                <Header />
                <Toaster />
                {children}
              </NextIntlClientProvider>
            </ThemeProvider>
          </ApolloWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
