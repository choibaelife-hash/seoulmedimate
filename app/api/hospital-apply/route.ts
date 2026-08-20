import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { error } = await supabase
      .from('hospital_applications')
      .insert({
        hospital_name: body.hospital_name,
        address: body.address,
        website_url: body.website_url || null,
        naver_map_url: body.naver_map_url || null,
        contact_name: body.contact_name,
        contact_position: body.contact_position || null,
        contact_phone: body.contact_phone,
        contact_email: body.contact_email,
        languages: body.languages,
        specialties: body.specialties?.join(', ') || null,
        has_foreign_patient_experience: body.has_foreign_patient_experience,
        description: body.description || null,
        status: 'pending',
      })

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
