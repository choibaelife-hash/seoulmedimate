import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase
      .from('interpreter_applications')
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phoneCode ? `${body.phoneCode} ${body.phone}` : body.phone,
        residence_country: body.country ?? body.residence_country,
        languages: body.languages,
        availability: body.schedule ?? body.availability ?? null,
        korean_level: body.korean_level ?? null,
        language_details: body.language_details ?? null,
        self_introduction: body.self_introduction ?? null,
        status: 'pending',
      })

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
