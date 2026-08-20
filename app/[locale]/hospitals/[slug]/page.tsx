'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MapPin, Phone, CheckCircle, Star, Globe, ChevronLeft,
  Calendar, Users, Stethoscope, ArrowRight, Building2,
  Clock, MessageCircle, PhoneCall, UserCheck
} from 'lucide-react'
import { MOCK_HOSPITALS } from '@/lib/mock-hospitals'

export default function HospitalDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string }
}) {
  const hospital = MOCK_HOSPITALS.find(h => h.slug === slug)
  if (!hospital) notFound()
  return <HospitalDetail hospital={hospital} locale={locale} />
}

function FloatingBookingCard({ hospital, locale }: { hospital: any; locale: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const targetX = useRef(0)
  const targetY = useRef(0)
  const currentX = useRef(0)
  const currentY = useRef(0)
  const rafRef = useRef<number>(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [floatY, setFloatY] = useState(0)
  const floatTime = useRef(0)

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [people, setPeople] = useState(1)
  const [procedure, setProcedure] = useState('')
  const [accompany, setAccompany] = useState<'consultation' | 'required' | 'phone'>('consultation')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      targetX.current = (e.clientX / vw - 0.5) * 2
      targetY.current = (e.clientY / vh - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      currentX.current += (targetX.current - currentX.current) * 0.06
      currentY.current += (targetY.current - currentY.current) * 0.06
      setTilt({ x: currentX.current, y: currentY.current })
      floatTime.current += 0.02
      setFloatY(Math.sin(floatTime.current) * 8)
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const accompanyOptions = [
    {
      value: 'consultation' as const,
      icon: MessageCircle,
      label: 'Consultation Only',
      desc: 'Advice & planning, no in-person visit',
      activeClass: 'border-brand-400 bg-brand-50 text-brand-700',
    },
    {
      value: 'required' as const,
      icon: UserCheck,
      label: 'Interpreter Required',
      desc: 'Interpreter accompanies you to the clinic',
      activeClass: 'border-purple-400 bg-purple-50 text-purple-700',
    },
    {
      value: 'phone' as const,
      icon: PhoneCall,
      label: 'Phone Consultation',
      desc: 'Speak directly with a medical interpreter',
      activeClass: 'border-emerald-400 bg-emerald-50 text-emerald-700',
    },
  ]

  return (
    <div
      ref={cardRef}
      style={{
        transform: `
          perspective(1200px)
          rotateY(${tilt.x * 4}deg)
          rotateX(${-tilt.y * 4}deg)
          translateY(${floatY}px)
        `,
        transition: 'transform 0.1s ease-out',
        willChange: 'transform',
      }}
    >
      {/* 카드 본체 - glow 제거, brand 테두리만 */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-brand-200 overflow-hidden" id="booking">
        {/* 상단 배너 */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-700 px-6 py-5 text-white">
          <p className="text-xs font-medium text-brand-100 mb-1 tracking-wide uppercase">
            Before you book
          </p>
          <h3 className="font-bold text-base leading-snug">
            Consult with a professional interpreter<br />
            in your language first
          </h3>
          <Link
            href={`/${locale}/inquiry/new?hospital=${hospital.id}`}
            className="mt-3 inline-flex items-center gap-1.5 text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Get free advice <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <form onSubmit={handleBooking} className="p-6 space-y-5">
          <h2 className="font-bold text-gray-900 text-lg">Book a Visit</h2>

          {/* Accompany options */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Users className="w-4 h-4 text-brand-500" />
              What do you need?
            </label>
            <div className="space-y-2">
              {accompanyOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAccompany(opt.value)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    accompany === opt.value
                      ? opt.activeClass
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <opt.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${accompany === opt.value ? '' : 'text-gray-400'}`} />
                  <div>
                    <p className="text-sm font-semibold leading-tight">{opt.label}</p>
                    <p className={`text-xs mt-0.5 ${accompany === opt.value ? 'opacity-80' : 'text-gray-400'}`}>{opt.desc}</p>
                  </div>
                  {accompany === opt.value && (
                    <CheckCircle className="w-4 h-4 ml-auto flex-shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {accompany !== 'phone' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-500" /> Date
                </label>
                <input
                  type="date"
                  required
                  min={today}
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-500" /> Time
                </label>
                <select
                  required
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
                >
                  <option value="">Select...</option>
                  {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {accompany !== 'phone' && (
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-2">
                <Users className="w-3.5 h-3.5 text-brand-500" /> Number of People
              </label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setPeople(p => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-brand-50 font-medium">−</button>
                <span className="text-base font-semibold text-gray-900 w-6 text-center">{people}</span>
                <button type="button" onClick={() => setPeople(p => Math.min(10, p + 1))}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-brand-50 font-medium">+</button>
                <span className="text-xs text-gray-400 ml-1">incl. companions</span>
              </div>
            </div>
          )}

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-brand-500" /> Desired Treatment
            </label>
            <select
              required
              value={procedure}
              onChange={e => setProcedure(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
            >
              <option value="">Select a treatment...</option>
              {hospital.specialties.map((s: string) => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="consultation">General Consultation</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any concerns or special requests..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
            />
          </div>

          {submitted ? (
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 text-center">
              <CheckCircle className="w-8 h-8 text-brand-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-brand-800">Request sent!</p>
              <p className="text-xs text-brand-500 mt-1">We'll confirm within 24 hours</p>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
            >
              {accompany === 'phone' ? 'Request Phone Call' : 'Request Booking'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <p className="text-xs text-gray-400 text-center">Free to request · No payment required now</p>
        </form>
      </div>
    </div>
  )
}

function HospitalDetail({ hospital, locale }: { hospital: any; locale: string }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-brand-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/${locale}/hospitals`}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Hospitals
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <div className="h-52 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
                <div className="text-center">
                  <Building2 className="w-16 h-16 text-brand-300 mx-auto mb-2" />
                  <span className="text-sm text-brand-500 font-medium">{hospital.specialty}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {hospital.is_premium && (
                        <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">⭐ Featured</span>
                      )}
                      {hospital.is_verified && (
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">{hospital.name}</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{hospital.name_ko}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-gray-900">{hospital.rating}</span>
                    </div>
                    <p className="text-xs text-gray-400">{hospital.review_count} reviews</p>
                    <p className="text-sm font-medium text-gray-500 mt-1">{hospital.price_range}</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm">{hospital.description}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="font-semibold text-gray-900 mb-4">Contact & Location</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700">{hospital.address}</p>
                    <p className="text-xs text-gray-400">{hospital.district}, Seoul</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{hospital.phone}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                  <div className="flex flex-wrap gap-1.5">
                    {hospital.languages.map((lang: string) => (
                      <span key={lang} className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full border border-brand-100">{lang}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="font-semibold text-gray-900 mb-4">Specialties & Treatments</h2>
              <div className="flex flex-wrap gap-2">
                {hospital.specialties.map((s: string) => (
                  <span key={s} className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-lg font-medium">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <FloatingBookingCard hospital={hospital} locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
