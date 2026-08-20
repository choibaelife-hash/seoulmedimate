import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent
      const inquiryId = pi.metadata?.inquiry_id
      const bookingId = pi.metadata?.booking_id

      if (inquiryId) {
        await supabase.from('inquiries').update({
          stripe_payment_id: pi.id,
          stripe_payment_status: 'succeeded',
          status: 'pending',
        }).eq('id', inquiryId)

        // Trigger AI processing
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/whisper`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inquiry_id: inquiryId }),
        })
      }

      if (bookingId) {
        await supabase.from('bookings').update({
          stripe_payment_intent_id: pi.id,
          status: 'confirmed',
        }).eq('id', bookingId)

        // Create payout record for interpreter
        const { data: booking } = await supabase
          .from('bookings')
          .select('interpreter_id, interpreter_fee, platform_fee, inquiry_id')
          .eq('id', bookingId)
          .single()

        if (booking?.interpreter_id) {
          await supabase.from('payouts').insert({
            interpreter_id: booking.interpreter_id,
            booking_id: bookingId,
            inquiry_id: booking.inquiry_id,
            type: 'field_accompany',
            amount: (booking.interpreter_fee ?? 0) - (booking.platform_fee ?? 0),
            status: 'pending',
          })
        }
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent
      const inquiryId = pi.metadata?.inquiry_id
      if (inquiryId) {
        await supabase.from('inquiries').update({ stripe_payment_status: 'failed' }).eq('id', inquiryId)
      }
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      const bookingId = charge.metadata?.booking_id
      if (bookingId) {
        await supabase.from('bookings').update({
          stripe_refund_id: (charge.refunds?.data[0])?.id,
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        }).eq('id', bookingId)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
