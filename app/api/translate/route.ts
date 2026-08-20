import { NextRequest, NextResponse } from 'next/server'
import { translateText } from '@/lib/deepl'

export async function POST(req: NextRequest) {
  try {
    const { text, from, to } = await req.json()
    if (!text || !to) return NextResponse.json({ error: 'text and to required' }, { status: 400 })

    const translated = await translateText(text, from?.toUpperCase(), to.toUpperCase())
    return NextResponse.json({ translated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
