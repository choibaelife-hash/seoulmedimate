import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@medroute.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://medroute.com'

// ── 병원에 보내는 브리핑 이메일 ─────────────────────────────
export async function sendHospitalBriefing({
  hospitalEmail,
  hospitalName,
  patientLanguage,
  inquirySummary,
  interpreterLevel,
  inquiryId,
}: {
  hospitalEmail: string
  hospitalName: string
  patientLanguage: string
  inquirySummary: string
  interpreterLevel?: string
  inquiryId: string
}) {
  return resend.emails.send({
    from: FROM,
    to: hospitalEmail,
    subject: `[SeoulMediMate] New Patient Inquiry — ${patientLanguage.toUpperCase()} Speaking Patient`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 24px; border-radius: 12px; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 20px;">🏥 SeoulMediMate — Patient Briefing</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Dear ${hospitalName}</p>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
          <h2 style="font-size: 14px; color: #64748b; margin: 0 0 8px;">Patient's Inquiry (Korean Translation)</h2>
          <p style="color: #0f172a; font-size: 15px; line-height: 1.6; margin: 0;">${inquirySummary}</p>
        </div>

        <div style="display: flex; gap: 12px; margin-bottom: 20px;">
          <div style="background: #eff6ff; border-radius: 8px; padding: 12px; flex: 1;">
            <p style="font-size: 12px; color: #3b82f6; margin: 0 0 4px; font-weight: 600;">LANGUAGE</p>
            <p style="font-size: 15px; font-weight: 700; margin: 0; color: #1e40af; text-transform: uppercase;">${patientLanguage}</p>
          </div>
          ${interpreterLevel ? `
          <div style="background: #f0fdf4; border-radius: 8px; padding: 12px; flex: 1;">
            <p style="font-size: 12px; color: #16a34a; margin: 0 0 4px; font-weight: 600;">INTERPRETER</p>
            <p style="font-size: 15px; font-weight: 700; margin: 0; color: #15803d; text-transform: capitalize;">${interpreterLevel} level</p>
          </div>` : ''}
        </div>

        <a href="${APP_URL}/hospital/briefings/${inquiryId}"
          style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
          View Full Briefing →
        </a>

        <p style="font-size: 12px; color: #94a3b8; margin-top: 24px;">
          This briefing was sent by SeoulMediMate. The patient will be accompanied by a certified medical interpreter during their visit.
        </p>
      </div>
    `,
  })
}

// ── 환자에게 보내는 알림 이메일 ──────────────────────────────
export async function sendPatientNotification({
  to,
  name,
  inquiryId,
  bookingId,
  visitDate,
  visitTime,
  locale = 'en',
}: {
  to: string
  name: string
  inquiryId?: string
  bookingId?: string
  visitDate?: string
  visitTime?: string
  locale?: string
}) {
  const isBooking = !!bookingId

  return resend.emails.send({
    from: FROM,
    to,
    subject: isBooking
      ? `[SeoulMediMate] Your hospital visit is confirmed — ${visitDate}`
      : `[SeoulMediMate] Your interpreter has responded`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: #2563eb; padding: 20px 24px; border-radius: 12px; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 18px;">🏥 SeoulMediMate</h1>
        </div>

        <p style="color: #0f172a; font-size: 16px;">Hello ${name},</p>

        ${isBooking ? `
        <p style="color: #374151; font-size: 15px; line-height: 1.6;">
          Your hospital visit has been <strong>confirmed</strong>!
        </p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0; font-size: 14px; color: #15803d; font-weight: 600;">📅 Visit Details</p>
          <p style="margin: 8px 0 0; color: #166534;">${visitDate} at ${visitTime}</p>
        </div>
        <a href="${APP_URL}/${locale}/bookings/${bookingId}"
          style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 8px;">
          View Booking →
        </a>
        ` : `
        <p style="color: #374151; font-size: 15px; line-height: 1.6;">
          Your dedicated interpreter has <strong>responded to your inquiry</strong>. Please check your chat for the full reply.
        </p>
        <a href="${APP_URL}/${locale}/inquiry/${inquiryId}"
          style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 8px;">
          View Response →
        </a>
        `}

        <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
          SeoulMediMate — Korean Medical Care in Your Language
        </p>
      </div>
    `,
  })
}
