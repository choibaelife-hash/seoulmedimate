import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendHospitalBriefing } from '@/lib/resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { inquiry_id } = await req.json()

    const { data: inquiry } = await supabase
      .from('inquiries')
      .select('*, hospitals(*), interpreters(user_id, level, rating)')
      .eq('id', inquiry_id)
      .single()

    if (!inquiry) return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    if (!inquiry.hospitals) return NextResponse.json({ error: 'No hospital assigned' }, { status: 400 })

    await sendHospitalBriefing({
      hospitalEmail: inquiry.hospitals.email,
      hospitalName: inquiry.hospitals.name,
      patientLanguage: inquiry.language,
      inquirySummary: inquiry.translated_ko ?? inquiry.raw_text ?? '',
      interpreterLevel: inquiry.interpreters?.level,
      inquiryId: inquiry_id,
    })

    await supabase.from('inquiries').update({
      status: 'briefed',
      briefing_sent_at: new Date().toISOString(),
    }).eq('id', inquiry_id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[briefing]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
