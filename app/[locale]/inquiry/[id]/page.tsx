'use client'

import { useEffect, useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import { Phone, Send, ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { Inquiry, Message } from '@/types'

const statusColors: Record<string, string> = {
  pending:    'bg-gray-100 text-gray-700',
  processing: 'bg-yellow-100 text-yellow-700',
  assigned:   'bg-blue-100 text-blue-700',
  answered:   'bg-green-100 text-green-700',
  briefed:    'bg-purple-100 text-purple-700',
  completed:  'bg-gray-100 text-gray-500',
}

export default function InquiryChatPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string }
}) {
  const t = useTranslations('chat')
  const supabase = createSupabaseClient()
  const bottomRef = useRef<HTMLDivElement>(null)

  const [inquiry, setInquiry] = useState<Inquiry | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMsg, setNewMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)

      const { data: inq } = await supabase.from('inquiries').select('*').eq('id', id).single()
      setInquiry(inq)

      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('inquiry_id', id)
        .order('created_at', { ascending: true })
      setMessages(msgs ?? [])
    }
    init()

    // Realtime subscription
    const channel = supabase
      .channel(`inquiry-${id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `inquiry_id=eq.${id}`,
      }, payload => {
        setMessages(prev => [...prev, payload.new as Message])
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'inquiries',
        filter: `id=eq.${id}`,
      }, payload => {
        setInquiry(payload.new as Inquiry)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMsg.trim() || !userId) return
    setSending(true)
    await supabase.from('messages').insert({
      inquiry_id: id,
      sender_id: userId,
      sender_type: 'patient',
      type: 'text',
      content: newMsg.trim(),
      is_read: false,
    })
    setNewMsg('')
    setSending(false)
  }

  const requestCall = async () => {
    if (!userId) return
    await supabase.from('messages').insert({
      inquiry_id: id,
      sender_id: userId,
      sender_type: 'patient',
      type: 'call_requested',
      content: t('call_requested'),
      needs_call: true,
      is_read: false,
    })
    await supabase.from('inquiries').update({ status: 'processing' }).eq('id', id)
  }

  if (!inquiry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
        <Link href={`/${locale}/dashboard`} className="p-1.5 rounded-lg hover:bg-gray-100">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-gray-900 text-sm">Medical Inquiry</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[inquiry.status]}`}>
              {inquiry.status}
            </span>
          </div>
          <p className="text-xs text-gray-500">{new Date(inquiry.created_at).toLocaleDateString()}</p>
        </div>
        <button
          onClick={requestCall}
          className="flex items-center gap-1.5 text-xs px-3 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          {t('call_request')}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-8">
            {inquiry.status === 'pending' || inquiry.status === 'processing'
              ? <><Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />{t('ai_processing')}</>
              : t('interpreter_reviewing')
            }
          </div>
        )}

        {messages.map(msg => {
          const isPatient = msg.sender_type === 'patient'
          const isSystem = msg.sender_type === 'system' || msg.sender_type === 'ai'

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">{msg.content}</span>
              </div>
            )
          }

          return (
            <div key={msg.id} className={`flex ${isPatient ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                isPatient
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm shadow-sm'
              }`}>
                {!isPatient && (
                  <p className="text-xs font-medium text-blue-600 mb-1">
                    {msg.sender_type === 'interpreter' ? '🔤 Interpreter' : '🤖 AI'}
                  </p>
                )}
                {msg.type === 'call_requested' ? (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{msg.content}</span>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                )}
                {msg.translated_text && (
                  <div className="mt-2 pt-2 border-t border-white/20">
                    <p className="text-xs opacity-75">{t('translated')}:</p>
                    <p className="text-sm italic opacity-90">{msg.translated_text}</p>
                  </div>
                )}
                <p className={`text-xs mt-1.5 ${isPatient ? 'text-blue-200' : 'text-gray-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex gap-2 items-end">
          <textarea
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            placeholder={t('type_message')}
            rows={1}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={sending || !newMsg.trim()}
            className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
