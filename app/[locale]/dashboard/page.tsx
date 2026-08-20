import { createClient as createSupabaseClient } from '@/lib/supabase/server'

import { redirect } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { MessageSquare, Calendar, ArrowRight, Clock } from 'lucide-react'

const statusBadge: Record<string, { label: string; color: string }> = {
  pending:    { label: 'Pending',          color: 'bg-gray-100 text-gray-700' },
  processing: { label: 'Processing',       color: 'bg-yellow-100 text-yellow-700' },
  assigned:   { label: 'Assigned',         color: 'bg-blue-100 text-blue-700' },
  answered:   { label: 'Answered',         color: 'bg-green-100 text-green-700' },
  briefed:    { label: 'Hospital Notified',color: 'bg-purple-100 text-purple-700' },
  completed:  { label: 'Completed',        color: 'bg-gray-200 text-gray-600' },
}

export default async function DashboardPage({ params: { locale } }: { params: { locale: string } }) {
  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/auth/login`)

  const [{ data: inquiries }, { data: bookings }] = await Promise.all([
    supabase.from('inquiries').select('*').eq('patient_id', user.id).order('created_at', { ascending: false }),
    supabase.from('bookings').select('*, hospitals(name)').eq('patient_id', user.id).order('created_at', { ascending: false }),
  ])

  return <DashboardContent locale={locale} user={user} inquiries={inquiries ?? []} bookings={bookings ?? []} />
}

function DashboardContent({ locale, user, inquiries, bookings }: any) {
  const t = useTranslations('dashboard')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          </div>
          <Link
            href={`/${locale}/inquiry/new`}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            + New Inquiry
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Inquiries', value: inquiries.length, color: 'text-blue-600' },
            { label: 'Active', value: inquiries.filter((i: any) => !['completed'].includes(i.status)).length, color: 'text-yellow-600' },
            { label: 'Bookings', value: bookings.length, color: 'text-green-600' },
            { label: 'Completed', value: inquiries.filter((i: any) => i.status === 'completed').length, color: 'text-gray-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Inquiries */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            {t('my_inquiries')}
          </h2>
          {inquiries.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">{t('no_inquiries')}</p>
              <Link href={`/${locale}/inquiry/new`} className="mt-4 inline-flex items-center gap-1 text-blue-600 text-sm hover:underline">
                Start here <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq: any) => {
                const badge = statusBadge[inq.status] ?? { label: inq.status, color: 'bg-gray-100 text-gray-700' }
                return (
                  <div key={inq.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.color}`}>{badge.label}</span>
                        <span className="text-xs text-gray-400 uppercase">{inq.input_type}</span>
                      </div>
                      <p className="text-sm text-gray-700 truncate">{inq.raw_text || inq.transcribed_text || 'Voice inquiry'}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {new Date(inq.created_at).toLocaleDateString()}
                        <span className="ml-2 font-medium text-gray-600">€{inq.consultation_fee}</span>
                      </div>
                    </div>
                    <Link
                      href={`/${locale}/inquiry/${inq.id}`}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium flex-shrink-0"
                    >
                      {t('view_chat')} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Bookings */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            {t('my_bookings')}
          </h2>
          {bookings.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">{t('no_bookings')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((bk: any) => (
                <div key={bk.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">{bk.hospitals?.name ?? 'Hospital'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {bk.visit_date} at {bk.visit_time} · {bk.duration_hours}h
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    bk.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    bk.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                    bk.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>{bk.status}</span>
                  <Link href={`/${locale}/bookings/${bk.id}`} className="text-blue-600 hover:text-blue-700">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
