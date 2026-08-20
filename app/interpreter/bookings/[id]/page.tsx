import { createClient as createSupabaseClient } from '@/lib/supabase/server'

import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, MapPin, User, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import CheckinButton from './CheckinButton'

export default async function InterpreterBookingDetailPage({ params: { id } }: { params: { id: string } }) {
  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/en/auth/login')

  const { data: interpreter } = await supabase.from('interpreters').select('id').eq('user_id', user.id).single()
  if (!interpreter) notFound()

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, hospitals(name, address, phone), patients:users!patient_id(name, email)')
    .eq('id', id)
    .eq('interpreter_id', interpreter.id)
    .single()

  if (!booking) notFound()

  return (
    <div>
      <Link href="/interpreter/bookings" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to bookings
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Booking</h1>
          <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${
            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
            booking.status === 'completed' ? 'bg-gray-100 text-gray-600' :
            'bg-yellow-100 text-yellow-700'
          }`}>{booking.status}</span>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Hospital</p>
              <p className="font-medium text-gray-900">{booking.hospitals?.name}</p>
              <p className="text-sm text-gray-600">{booking.hospitals?.address}</p>
              <p className="text-sm text-gray-600">{booking.hospitals?.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Visit</p>
              <p className="font-medium text-gray-900">{booking.visit_date} at {booking.visit_time}</p>
              <p className="text-sm text-gray-600">{booking.duration_hours} hour(s)</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Patient</p>
              <p className="font-medium text-gray-900">{booking.patients?.name || 'Patient'}</p>
              <p className="text-sm text-gray-600">{booking.patients?.email}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Interpreter fee</span>
              <span className="font-medium text-gray-900">€{booking.interpreter_fee ?? 0}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Platform fee deducted</span>
              <span className="text-red-600">-€{booking.platform_fee ?? 0}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-1">
              <span>Your payout</span>
              <span className="text-green-700">€{(booking.interpreter_fee ?? 0) - (booking.platform_fee ?? 0)}</span>
            </div>
          </div>

          {booking.status === 'confirmed' && !booking.interpreter_checkin_at && (
            <CheckinButton bookingId={booking.id} />
          )}
          {booking.interpreter_checkin_at && (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl p-4">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                Checked in at {new Date(booking.interpreter_checkin_at).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
