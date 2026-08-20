import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

// 환불 금액 계산 (호텔식 정책)
export function calculateRefundAmount(
  totalAmount: number,
  visitDateTime: Date,
  cancelledAt: Date = new Date()
): number {
  const hoursUntilVisit =
    (visitDateTime.getTime() - cancelledAt.getTime()) / (1000 * 60 * 60)

  if (hoursUntilVisit >= 72) return totalAmount        // 전액 환불
  if (hoursUntilVisit >= 48) return totalAmount * 0.5  // 50% 환불
  return 0                                              // 환불 없음
}

// 통역사 수수료 계산
export function calculateFees(totalAmount: number) {
  const platformFee    = Math.round(totalAmount * 0.30 * 100) / 100  // 30%
  const interpreterFee = Math.round(totalAmount * 0.70 * 100) / 100  // 70%
  return { platformFee, interpreterFee }
}
