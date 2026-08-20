import { createClient as createSupabaseClient } from '@/lib/supabase/server'

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Globe, Calendar, FileText, Phone } from 'lucide-react'

export default async function HospitalBriefingPage({ params: { id } }: { params: { id: string } }) {
  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/en/auth/login')

  const { data: inquiry } = await supabase
    .from('inquiries')
    .select('*, hospitals(email), interpreters(user_id, level, rating, twilio_number)')
    .eq('id', id)
    .single()

  if (!inquiry || inquiry.hospitals?.email !== user.email) notFound()

  return (
    <div>
      <Link href="/hospital/briefings" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to briefings
      </Link>

      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5" />
              <h1 className="font-bold text-lg">Patient Briefing</h1>
            </div>
            <div className="flex items-center gap-3 text-purple-100 text-sm">
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" />{inquiry.language?.toUpperCase()}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(inquiry.briefing_sent_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Patient's original question */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Patient's Inquiry (Korean)</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-sm text-gray-800 leading-relaxed">
                  {inquiry.translated_ko || inquiry.raw_text || 'No content'}
                </p>
              </div>
            </div>

            {/* Interpreter details */}
            {inquiry.interpreters && (
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-2">Assigned Interpreter</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900 capitalize">
                      {inquiry.interpreters.level} Interpreter
                    </p>
                    <p className="text-xs text-blue-700 mt-0.5">
                      ⭐ {inquiry.interpreters.rating?.toFixed(1)} rating
                    </p>
                  </div>
                  {inquiry.interpreters.twilio_number && (
                    <a
                      href={`tel:${inquiry.interpreters.twilio_number}`}
                      className="flex items-center gap-1.5 text-xs bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Action */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-500 mb-3">Ready to accept this patient?</p>
              <Link
                href={`/hospital/bookings?inquiry=${id}`}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm font-medium"
              >
                View Booking Request
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
