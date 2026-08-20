import { createClient as createSupabaseClient } from '@/lib/supabase/server'

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, MapPin, User, AlertTriangle } from 'lucide-react'

export default async function BookingDetailPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string }
}) {
  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/auth/login`)

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, hospitals(name, address, phone), interpreters(user_id, level, rating)')
    .eq('id', id)
    .single()

  if (!booking || booking.patient_id !== user.id) notFound()

  const statusColor = {
    pending:   'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
    noshow:    'bg-orange-100 text-orange-700',
  }[booking.status] ?? 'bg-gray-100 text-gray-700'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Link href={`/${locale}/dashboard`} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">Booking Details</h1>
              <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColor}`}>
                {booking.status}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Hospital */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Hospital</p>
                <p className="font-medium text-gray-900">{booking.hospitals?.name}</p>
                {booking.hospitals?.address && (
                  <p className="text-sm text-gray-600">{booking.hospitals.address}</p>
                )}
              </div>
            </div>

            {/* Date & time */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Visit Date & Time</p>
                <p className="font-medium text-gray-900">{booking.visit_date}</p>
                <p className="text-sm text-gray-600">{booking.visit_time} · {booking.duration_hours} hour(s)</p>
              </div>
            </div>

            {/* Interpreter */}
            {booking.accompany_requested && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Interpreter</p>
                  {booking.interpreters ? (
                    <p className="font-medium text-gray-900 capitalize">
                      {booking.interpreters.level} · ⭐ {booking.interpreters.rating?.toFixed(1)}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">Being assigned</p>
                  )}
                </div>
              </div>
            )}

            {/* Cost breakdown */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Cost Breakdown</h3>
              {booking.interpreter_fee && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Interpreter fee</span>
                  <span>€{booking.interpreter_fee}</span>
                </div>
              )}
              {booking.platform_fee && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Platform fee</span>
                  <span>€{booking.platform_fee}</span>
                </div>
              )}
              {booking.total_amount && (
                <div className="flex justify-between text-sm font-semibold border-t border-gray-200 pt-2 mt-2">
                  <span>Total</span>
                  <span>€{booking.total_amount}</span>
                </div>
              )}
            </div>

            {/* Cancellation policy */}
            <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Cancellation Policy</p>
                <p>Free cancellation up to 72h before. 50% refund within 48h. No refund within 24h.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
