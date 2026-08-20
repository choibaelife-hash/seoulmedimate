'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import { Send, Phone, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Message } from '@/types'

export default function InterpreterInquiryClient({
  inquiry, messages: initialMessages, interpreterId, userId,
}: {
  inquiry: any
  messages: Message[]
  interpreterId: string
  userId: string
}) {
  const supabase = createSupabaseClient()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const channel = supabase
      .channel(`inquiry-interp-${inquiry.id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `inquiry_id=eq.${inquiry.id}`,
      }, payload => {
        setMessages(prev => [...prev, payload.new as Message])
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [inquiry.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendReply = async () => {
    if (!reply.trim()) return
    setSending(true)
    await supabase.from('messages').insert({
      inquiry_id: inquiry.id,
      sender_id: userId,
      sender_type: 'interpreter',
      type: 'interpreter_reply',
      content: reply.trim(),
      is_read: false,
    })
    await supabase.from('inquiries').update({ status: 'answered' }).eq('id', inquiry.id)
    setReply('')
    setSending(false)
  }

  const sendBriefing = async () => {
    await fetch('/api/briefing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inquiry_id: inquiry.id }),
    })
    await supabase.from('inquiries').update({ status: 'briefed', briefing_sent_at: new Date().toISOString() }).eq('id', inquiry.id)
  }

  const senderColor = {
    patient: 'bg-gray-100 text-gray-800',
    interpreter: 'bg-blue-600 text-white',
    ai: 'bg-purple-50 text-purple-900 border border-purple-200',
    system: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-4 flex-shrink-0">
        <Link href="/interpreter" className="p-1.5 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="font-semibold text-gray-900">
            Inquiry · <span className="uppercase text-blue-600 text-sm">{inquiry.language}</span>
          </h1>
          <p className="text-xs text-gray-500">Patient: {inquiry.patients?.name || 'Anonymous'}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={sendBriefing}
            className="flex items-center gap-1.5 text-xs px-3 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Send Briefing
          </button>
        </div>
      </div>

      {/* Patient's original message */}
      {(inquiry.translated_ko || inquiry.raw_text) && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex-shrink-0">
          <p className="text-xs font-medium text-amber-700 mb-1">Patient's inquiry (Korean translation)</p>
          <p className="text-sm text-gray-800">{inquiry.translated_ko || inquiry.raw_text}</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.map(msg => {
          const isInterpreter = msg.sender_type === 'interpreter'
          const isSystem = msg.sender_type === 'system' || msg.sender_type === 'ai'
          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">{msg.content}</span>
              </div>
            )
          }
          return (
            <div key={msg.id} className={`flex ${isInterpreter ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                isInterpreter ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}>
                {!isInterpreter && <p className="text-xs font-medium text-gray-500 mb-1">Patient</p>}
                <p>{msg.content}</p>
                <p className={`text-xs mt-1 ${isInterpreter ? 'text-blue-200' : 'text-gray-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Reply input */}
      <div className="flex gap-2 items-end flex-shrink-0 pt-4 border-t border-gray-200">
        <textarea
          value={reply}
          onChange={e => setReply(e.target.value)}
          placeholder="Write your reply in the patient's language..."
          rows={2}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply() } }}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendReply}
          disabled={sending || !reply.trim()}
          className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
