import { createClient as createSupabaseClient } from '@/lib/supabase/server'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react'
import ConfirmBookingButton from './ConfirmButton'

export default async function HospitalBookingsPage() {
  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/en/auth/login')

  const { data: hospital } = await supabase.from('hospitals').select('id').eq('email', user.email).single()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, patients:users!patient_id(name, email), interpreters(level, rating)')
    .eq('hospital_id', hospital?.id)
    .order('visit_date', { ascending: true })

  const grouped = {
    upcoming: (bookings ?? []).filter((b: any) => ['pending', 'confirmed'].includes(b.status)),
    past:     (bookings ?? []).filter((b: any) => ['completed', 'cancelled', 'noshow'].includes(b.status)),
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bookings</h1>

      {/* Upcoming */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-gray-700 mb-3">Upcoming ({grouped.upcoming.length})</h2>
        {grouped.upcoming.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm">No upcoming bookings</div>
        ) : (
          <div className="space-y-3">
            {grouped.upcoming.map((bk: any) => (
              <div key={bk.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900 text-sm">{bk.patients?.name ?? 'Patient'}</span>
                    <span className="text-xs text-gray-500">{bk.patients?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{bk.visit_date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{bk.visit_time}</span>
                    {bk.accompany_requested && <span className="text-blue-600">+ Interpreter ({bk.interpreters?.level})</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    bk.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{bk.status}</span>
                  {bk.status === 'pending' && <ConfirmBookingButton bookingId={bk.id} />}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past */}
      {grouped.past.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3">Past Visits ({grouped.past.length})</h2>
          <div className="space-y-2">
            {grouped.past.map((bk: any) => (
              <div key={bk.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 opacity-75">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{bk.patients?.name ?? 'Patient'}</p>
                  <p className="text-xs text-gray-500">{bk.visit_date} · {bk.visit_time}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                  bk.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                  bk.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                }`}>{bk.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
