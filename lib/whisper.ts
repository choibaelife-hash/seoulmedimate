import OpenAI from 'openai'
import { Readable } from 'stream'

// 모듈 로드 시점이 아니라 호출 시점에 생성 — 빌드 타임에 키가 없어도 throw 하지 않음
let openai: OpenAI | null = null
function getOpenAI() {
  if (!openai) openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  return openai
}

const langMap: Record<string, string> = {
  en: 'english', de: 'german', fr: 'french', es: 'spanish',
  it: 'italian', pl: 'polish', pt: 'portuguese',
}

export async function transcribeAudio(audioBuffer: Buffer, locale: string): Promise<string> {
  const language = langMap[locale] ?? 'english'

  // Convert buffer to File-like object for OpenAI SDK
  const blob = new Blob([new Uint8Array(audioBuffer)], { type: 'audio/webm' })
  const file = new File([blob], 'audio.webm', { type: 'audio/webm' })

  const transcription = await getOpenAI().audio.transcriptions.create({
    file,
    model: 'whisper-1',
    language: locale,
  })

  return transcription.text
}
