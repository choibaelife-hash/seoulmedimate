import { createClient as createSupabaseClient } from '@/lib/supabase/server'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Calendar, ArrowRight, Clock } from 'lucide-react'

export default async function HospitalHomePage() {
  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/en/auth/login')

  const { data: hospital } = await supabase
    .from('hospitals')
    .select('*')
    .eq('email', user.email)
    .single()

  const [{ data: briefings }, { data: bookings }] = await Promise.all([
    supabase.from('inquiries').select('id, status, language, briefing_sent_at, created_at')
      .eq('hospital_id', hospital?.id)
      .not('briefing_sent_at', 'is', null)
      .order('briefing_sent_at', { ascending: false })
      .limit(5),
    supabase.from('bookings').select('id, status, visit_date, visit_time, patients:users!patient_id(name)')
      .eq('hospital_id', hospital?.id)
      .order('visit_date', { ascending: true })
      .limit(5),
  ])

  const upcoming = (bookings ?? []).filter((b: any) => ['pending', 'confirmed'].includes(b.status))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{hospital?.name ?? 'Hospital Dashboard'}</h1>
        <p className="text-gray-500 text-sm mt-0.5">{user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'New Briefings', value: (briefings ?? []).filter((b: any) => b.status !== 'completed').length, color: 'text-purple-600' },
          { label: 'Upcoming Visits', value: upcoming.length, color: 'text-blue-600' },
          { label: 'Total Bookings', value: (bookings ?? []).length, color: 'text-green-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent briefings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" /> Recent Briefings
            </h2>
            <Link href="/hospital/briefings" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          {(briefings ?? []).length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No briefings yet</p>
          ) : (
            <div className="space-y-3">
              {(briefings ?? []).map((b: any) => (
                <Link key={b.id} href={`/hospital/briefings/${b.id}`}
                  className="flex items-center justify-between py-2 hover:bg-gray-50 -mx-2 px-2 rounded-lg">
                  <div>
                    <span className="text-xs font-medium uppercase text-purple-600">{b.language}</span>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {new Date(b.briefing_sent_at).toLocaleDateString()}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming bookings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" /> Upcoming Visits
            </h2>
            <Link href="/hospital/bookings" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No upcoming visits</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((bk: any) => (
                <div key={bk.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{bk.patients?.name ?? 'Patient'}</p>
                    <p className="text-xs text-gray-500">{bk.visit_date} · {bk.visit_time}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    bk.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{bk.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
