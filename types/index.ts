// ── 공통 타입 ────────────────────────────────────────────────

export type Locale = 'en' | 'de' | 'fr' | 'es' | 'it' | 'pl' | 'pt'

export type UserRole = 'patient' | 'interpreter' | 'hospital_admin'

// ── 문의 타입 ────────────────────────────────────────────────

export type InquiryStatus =
  | 'pending'
  | 'processing'
  | 'assigned'
  | 'answered'
  | 'briefed'
  | 'completed'

export type InputType = 'voice' | 'text'

export interface Inquiry {
  id: string
  patient_id: string
  language: Locale
  input_type: InputType
  voice_url?: string
  raw_text?: string
  transcribed_text?: string
  translated_ko?: string
  interpreter_id?: string
  hospital_id?: string
  status: InquiryStatus
  consultation_fee: number
  platform_fee?: number
  stripe_payment_id?: string
  stripe_payment_status?: string
  briefing_sent_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

// ── 채팅 메시지 타입 ─────────────────────────────────────────

export type MessageSenderType = 'patient' | 'interpreter' | 'ai' | 'system'

export type MessageType =
  | 'text'
  | 'voice_raw'
  | 'voice_transcribed'
  | 'voice_translated'
  | 'interpreter_reply'
  | 'call_requested'
  | 'system'

export interface Message {
  id: string
  inquiry_id: string
  sender_id?: string
  sender_type: MessageSenderType
  type: MessageType
  content?: string
  audio_url?: string
  original_lang?: string
  translated_text?: string
  needs_call?: boolean
  is_read: boolean
  created_at: string
}

// ── 예약 타입 ────────────────────────────────────────────────

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'noshow'
export type AccompanyPayer = 'patient' | 'hospital' | 'both'

export interface Booking {
  id: string
  inquiry_id: string
  patient_id: string
  hospital_id: string
  interpreter_id?: string
  visit_date: string
  visit_time: string
  duration_hours: number
  accompany_requested: boolean
  accompany_payer?: AccompanyPayer
  interpreter_fee?: number
  platform_fee?: number
  total_amount?: number
  cancellation_policy: '72h' | '48h' | '24h' | 'noshow'
  cancelled_at?: string
  refund_amount: number
  noshow_at?: string
  noshow_compensation: number
  stripe_payment_intent_id?: string
  stripe_refund_id?: string
  status: BookingStatus
  interpreter_checkin_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

// ── 통역사 타입 ──────────────────────────────────────────────

export type InterpreterLevel = 'bronze' | 'silver' | 'gold'

export interface Interpreter {
  id: string
  user_id: string
  languages: Locale[]
  level: InterpreterLevel
  rating: number
  rating_count: number
  completed_count: number
  available: boolean
  hourly_rate: number
  twilio_number?: string
  deposit_amount: number
  deposit_paid: boolean
  bio?: string
  certifications: string[]
  created_at: string
  updated_at: string
}

// ── 병원 타입 ────────────────────────────────────────────────

export interface Hospital {
  id: string
  name: string
  slug: string
  specialties: string[]
  languages_supported: Locale[]
  address?: string
  district?: string
  email: string
  phone?: string
  website?: string
  sanity_id?: string
  is_premium: boolean
  is_verified: boolean
  monthly_fee: number
  registered_at: string
  updated_at: string
}

// ── 정산 타입 ────────────────────────────────────────────────

export type PayoutType = 'online_consultation' | 'field_accompany'
export type PayoutStatus = 'pending' | 'paid'

export interface Payout {
  id: string
  interpreter_id: string
  booking_id?: string
  inquiry_id?: string
  type: PayoutType
  amount: number
  status: PayoutStatus
  paid_at?: string
  created_at: string
}
