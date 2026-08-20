import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { createClient as createSupabaseClient } from '@/lib/supabase/server'

import Navbar from '@/components/nav/Navbar'
import { locales, type Locale } from '@/locales'


export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale as Locale)) notFound()

  const messages = await getMessages()
  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar locale={locale} user={user} />
      <main>{children}</main>
    </NextIntlClientProvider>
  )
}
