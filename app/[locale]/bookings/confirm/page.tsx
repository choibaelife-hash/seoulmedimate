'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import { Calendar, Clock, User, CheckCircle } from 'lucide-react'

const TIME_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']

export default function ConfirmBookingPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('booking')
  const router = useRouter()
  const searchParams = useSearchParams()
  const inquiryId = searchParams.get('inquiry')
  const supabase = createSupabaseClient()

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState(2)
  const [accompany, setAccompany] = useState(true)
  const [loading, setLoading] = useState(false)
  const [inquiry, setInquiry] = useState<any>(null)

  useEffect(() => {
    if (inquiryId) {
      supabase.from('inquiries').select('*, hospitals(*)').eq('id', inquiryId).single()
        .then(({ data }) => setInquiry(data))
    }
  }, [inquiryId])

  const interpreterFee = accompany ? duration * 80 : 0
  const platformFee = Math.round(interpreterFee * 0.15)
  const total = interpreterFee + platformFee

  const handleConfirm = async () => {
    if (!date || !time || !inquiryId) return
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push(`/${locale}/auth/login`); return }

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        inquiry_id: inquiryId,
        patient_id: user.id,
        hospital_id: inquiry?.hospital_id,
        interpreter_id: inquiry?.interpreter_id,
        visit_date: date,
        visit_time: time,
        duration_hours: duration,
        accompany_requested: accompany,
        accompany_payer: 'patient',
        interpreter_fee: accompany ? interpreterFee : 0,
        platform_fee: accompany ? platformFee : 0,
        total_amount: accompany ? total : 0,
        cancellation_policy: '72h',
        refund_amount: 0,
        noshow_compensation: 0,
        status: 'pending',
      })
      .select()
      .single()

    if (!error) {
      router.push(`/${locale}/bookings/${booking.id}`)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        {inquiry?.hospitals && (
          <p className="text-gray-600 mb-8">at {inquiry.hospitals.name}</p>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          {/* Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" /> {t('select_date')}
            </label>
            <input
              type="date"
              value={date}
              min={new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]}
              onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Time */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4" /> {t('select_time')}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={`py-2 text-sm rounded-lg border transition-colors ${
                    time === slot
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:border-blue-400'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">{t('duration')}</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(h => (
                <button
                  key={h}
                  onClick={() => setDuration(h)}
                  className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                    duration === h
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:border-blue-400'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

          {/* Accompany */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <User className="w-4 h-4" /> {t('accompany_title')}
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setAccompany(true)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-colors text-sm ${
                  accompany ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {t('accompany_yes', { fee: `€${duration * 80}/h` })}
              </button>
              <button
                onClick={() => setAccompany(false)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-colors text-sm ${
                  !accompany ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {t('accompany_no')}
              </button>
            </div>
          </div>

          {/* Total */}
          {accompany && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Interpreter ({duration}h × €80)</span>
                <span>€{interpreterFee}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Platform fee (15%)</span>
                <span>€{platformFee}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                <span>{t('total')}</span>
                <span>€{total}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={loading || !date || !time}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : t('confirm_booking')}
          </button>
        </div>
      </div>
    </div>
  )
}
