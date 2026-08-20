import OpenAI from 'openai'
import { Readable } from 'stream'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const langMap: Record<string, string> = {
  en: 'english', de: 'german', fr: 'french', es: 'spanish',
  it: 'italian', pl: 'polish', pt: 'portuguese',
}

export async function transcribeAudio(audioBuffer: Buffer, locale: string): Promise<string> {
  const language = langMap[locale] ?? 'english'

  // Convert buffer to File-like object for OpenAI SDK
  const blob = new Blob([audioBuffer], { type: 'audio/webm' })
  const file = new File([blob], 'audio.webm', { type: 'audio/webm' })

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    language: locale,
  })

  return transcription.text
}
