import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendPatientNotification } from '@/lib/resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Supabase Database Webhooks — triggered on table changes
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const { type, table, record, old_record } = payload

    // When inquiry status changes to 'answered' — notify patient by email
    if (table === 'inquiries' && type === 'UPDATE') {
      if (record.status === 'answered' && old_record?.status !== 'answered') {
        const { data: patient } = await supabase
          .from('users')
          .select('email, name')
          .eq('id', record.patient_id)
          .single()

        if (patient?.email) {
          await sendPatientNotification({
            to: patient.email,
            name: patient.name ?? 'Patient',
            inquiryId: record.id,
            locale: record.language ?? 'en',
          })
        }
      }
    }

    // When booking is confirmed — notify patient
    if (table === 'bookings' && type === 'UPDATE') {
      if (record.status === 'confirmed' && old_record?.status !== 'confirmed') {
        const { data: patient } = await supabase
          .from('users')
          .select('email, name')
          .eq('id', record.patient_id)
          .single()

        if (patient?.email) {
          await sendPatientNotification({
            to: patient.email,
            name: patient.name ?? 'Patient',
            bookingId: record.id,
            visitDate: record.visit_date,
            visitTime: record.visit_time,
            locale: 'en',
          })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('[supabase-webhook]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
