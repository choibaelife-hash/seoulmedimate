'use client'

import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import { Mic, Square, Play, RotateCcw, Send, MessageSquare, AlertCircle } from 'lucide-react'

const CONSULTATION_FEE = 29

export default function NewInquiryPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('inquiry')
  const router = useRouter()
  const searchParams = useSearchParams()
  const hospitalId = searchParams.get('hospital')
  const supabase = createSupabaseClient()

  const [tab, setTab] = useState<'voice' | 'text'>('voice')
  const [text, setText] = useState('')
  const [recording, setRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = e => chunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach(t => t.stop())
      }
      recorder.start()
      mediaRef.current = recorder
      setRecording(true)
    } catch {
      setError('Microphone access denied. Please allow microphone access.')
    }
  }

  const stopRecording = () => {
    mediaRef.current?.stop()
    setRecording(false)
  }

  const resetRecording = () => {
    setAudioBlob(null)
    setAudioUrl(null)
  }

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push(`/${locale}/auth/login`); return }

    if (tab === 'text' && !text.trim()) {
      setError('Please describe your medical concern.'); return
    }
    if (tab === 'voice' && !audioBlob) {
      setError('Please record a voice message.'); return
    }

    setLoading(true)
    setError('')

    try {
      let voiceUrl: string | undefined

      if (tab === 'voice' && audioBlob) {
        const fileName = `${user.id}/${Date.now()}.webm`
        const { data: upload, error: upErr } = await supabase.storage
          .from('voice-messages')
          .upload(fileName, audioBlob, { contentType: 'audio/webm' })
        if (upErr) throw upErr

        const { data: { publicUrl } } = supabase.storage
          .from('voice-messages')
          .getPublicUrl(fileName)
        voiceUrl = publicUrl
      }

      const { data: inquiry, error: inqErr } = await supabase
        .from('inquiries')
        .insert({
          patient_id: user.id,
          language: locale,
          input_type: tab,
          voice_url: voiceUrl,
          raw_text: tab === 'text' ? text : undefined,
          hospital_id: hospitalId || undefined,
          status: 'pending',
          consultation_fee: CONSULTATION_FEE,
        })
        .select()
        .single()

      if (inqErr) throw inqErr

      // Trigger AI processing
      await fetch('/api/whisper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiry_id: inquiry.id }),
      })

      router.push(`/${locale}/inquiry/${inquiry.id}`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle', { language: locale.toUpperCase() })}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Tab switcher */}
          <div className="flex border-b border-gray-200">
            {(['voice', 'text'] as const).map(type => (
              <button
                key={type}
                onClick={() => setTab(type)}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${
                  tab === type
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {type === 'voice' ? `🎙️ ${t('voice_tab')}` : `✍️ ${t('text_tab')}`}
              </button>
            ))}
          </div>

          <div className="p-6">
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {tab === 'voice' ? (
              <div className="flex flex-col items-center gap-6 py-6">
                {!audioUrl ? (
                  <>
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                      recording ? 'bg-red-100 animate-pulse' : 'bg-blue-50'
                    }`}>
                      <Mic className={`w-10 h-10 ${recording ? 'text-red-500' : 'text-blue-600'}`} />
                    </div>
                    <p className="text-gray-600 text-sm">
                      {recording ? t('voice_recording') : t('voice_prompt')}
                    </p>
                    <button
                      onClick={recording ? stopRecording : startRecording}
                      className={`px-8 py-3 rounded-xl font-medium transition-colors ${
                        recording
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {recording ? (
                        <span className="flex items-center gap-2"><Square className="w-4 h-4" />{t('voice_stop')}</span>
                      ) : (
                        <span className="flex items-center gap-2"><Mic className="w-4 h-4" />{t('voice_prompt')}</span>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <audio controls src={audioUrl} className="w-full max-w-sm" />
                    <div className="flex gap-3">
                      <button onClick={resetRecording} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                        <RotateCcw className="w-4 h-4" />{t('voice_re_record')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={t('text_placeholder')}
                rows={7}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              />
            )}

            {/* Fee notice */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4">
              <p className="text-sm text-blue-800 font-medium mb-1">
                {t('fee_notice', { fee: `€${CONSULTATION_FEE}` })}
              </p>
              <p className="text-xs text-blue-600">{t('fee_info')}</p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || (tab === 'voice' && !audioUrl) || (tab === 'text' && !text.trim())}
              className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              {loading ? t('processing') : t('submit', { fee: `€${CONSULTATION_FEE}` })}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
