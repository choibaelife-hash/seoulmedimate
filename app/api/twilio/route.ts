import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { makeCallToPatient } from '@/lib/twilio'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { inquiry_id, patient_phone } = await req.json()

    const { data: inquiry } = await supabase
      .from('inquiries')
      .select('*, interpreters(twilio_number)')
      .eq('id', inquiry_id)
      .single()

    if (!inquiry?.interpreters?.twilio_number) {
      return NextResponse.json({ error: 'No interpreter phone number' }, { status: 400 })
    }

    const call = await makeCallToPatient(
      inquiry.interpreters.twilio_number,
      patient_phone
    )

    return NextResponse.json({ success: true, call_sid: call.sid })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
