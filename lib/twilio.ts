import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function makeCallToPatient(fromNumber: string, toNumber: string) {
  return client.calls.create({
    from: fromNumber,
    to: toNumber,
    twiml: '<Response><Say>Your SeoulMediMate interpreter is connecting. Please hold.</Say><Dial></Dial></Response>',
  })
}

export async function sendSMS(to: string, body: string) {
  return client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER!,
    to,
    body,
  })
}
