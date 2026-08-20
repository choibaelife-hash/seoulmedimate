import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { transcribeAudio } from '@/lib/whisper'
import { translateToKorean } from '@/lib/deepl'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { inquiry_id } = await req.json()
    if (!inquiry_id) return NextResponse.json({ error: 'inquiry_id required' }, { status: 400 })

    // Mark as processing
    await supabase.from('inquiries').update({ status: 'processing' }).eq('id', inquiry_id)

    const { data: inquiry } = await supabase.from('inquiries').select('*').eq('id', inquiry_id).single()
    if (!inquiry) return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })

    let transcribed = inquiry.raw_text ?? ''

    // Transcribe voice if needed
    if (inquiry.input_type === 'voice' && inquiry.voice_url) {
      const audioRes = await fetch(inquiry.voice_url)
      const audioBuffer = Buffer.from(await audioRes.arrayBuffer())
      transcribed = await transcribeAudio(audioBuffer, inquiry.language)
    }

    // Translate to Korean
    const translated_ko = await translateToKorean(transcribed, inquiry.language)

    // Save transcription + translation
    await supabase.from('inquiries').update({
      transcribed_text: transcribed,
      translated_ko,
      status: 'assigned',
    }).eq('id', inquiry_id)

    // Save as first message in chat
    await supabase.from('messages').insert({
      inquiry_id,
      sender_type: 'ai',
      type: 'voice_translated',
      content: transcribed,
      translated_text: translated_ko,
      original_lang: inquiry.language,
      is_read: false,
    })

    // Auto-assign available interpreter for this language
    const { data: interpreter } = await supabase
      .from('interpreters')
      .select('id')
      .contains('languages', [inquiry.language])
      .eq('available', true)
      .order('rating', { ascending: false })
      .limit(1)
      .single()

    if (interpreter) {
      await supabase.from('inquiries').update({ interpreter_id: interpreter.id }).eq('id', inquiry_id)
    }

    return NextResponse.json({ success: true, transcribed, translated_ko })
  } catch (error: any) {
    console.error('[whisper]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
