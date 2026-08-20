import Link from 'next/link'
import { ChevronLeft, CheckCircle, Clock, AlertCircle } from 'lucide-react'

const hospitalPayments = [
  {
    hospitalId: 'H001',
    hospitalName: '서울아산병원',
    plan: '프리미엄',
    monthlyFee: 890000,
    payments: [
      { month: '2025-06', amount: 890000, status: 'pending', dueAt: '2025-06-30' },
      { month: '2025-05', amount: 890000, status: 'paid', paidAt: '2025-05-28' },
      { month: '2025-04', amount: 890000, status: 'paid', paidAt: '2025-04-30' },
    ],
  },
  {
    hospitalId: 'H002',
    hospitalName: '삼성서울병원',
    plan: '스탠다드',
    monthlyFee: 590000,
    payments: [
      { month: '2025-06', amount: 590000, status: 'paid', paidAt: '2025-06-05' },
      { month: '2025-05', amount: 590000, status: 'paid', paidAt: '2025-05-07' },
      { month: '2025-04', amount: 590000, status: 'paid', paidAt: '2025-04-04' },
    ],
  },
  {
    hospitalId: 'H003',
    hospitalName: '세브란스병원',
    plan: '프리미엄',
    monthlyFee: 890000,
    payments: [
      { month: '2025-06', amount: 890000, status: 'overdue', dueAt: '2025-06-15' },
      { month: '2025-05', amount: 890000, status: 'paid', paidAt: '2025-05-14' },
      { month: '2025-04', amount: 890000, status: 'paid', paidAt: '2025-04-15' },
    ],
  },
]

const statusConfig: Record<string, { label: string; color: string; bg: string; Icon: typeof CheckCircle }> = {
  paid: { label: '납부완료', color: 'text-green-400', bg: 'bg-green-900 text-green-300', Icon: CheckCircle },
  pending: { label: '납부예정', color: 'text-amber-400', bg: 'bg-amber-900 text-amber-300', Icon: Clock },
  overdue: { label: '연체', color: 'text-red-400', bg: 'bg-red-900 text-red-300', Icon: AlertCircle },
}

const planColors: Record<string, string> = {
  프리미엄: 'bg-purple-900 text-purple-300',
  스탠다드: 'bg-blue-900 text-blue-300',
}

const allPayments = hospitalPayments.flatMap(h =>
  h.payments.map(p => ({ ...p, hospitalName: h.hospitalName, plan: h.plan }))
)
const totalPaid = allPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
const totalPending = allPayments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0)
const totalOverdue = allPayments.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount, 0)

export default function HospitalPayoutsPage() {
  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/hospitals"
          className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          병원 관리로 돌아가기
        </Link>
        <h1 className="text-2xl font-bold text-white">구독료 정산 내역</h1>
        <p className="text-gray-500 text-sm mt-0.5">파트너 병원 월별 구독료 납부 현황</p>
      </div>

      {/* 요약 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-500">납부 완료</span>
          </div>
          <div className="text-2xl font-bold text-green-400">
            ₩{totalPaid.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 mt-0.5">
            {allPayments.filter(p => p.status === 'paid').length}건
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-500">납부 예정</span>
          </div>
          <div className="text-2xl font-bold text-amber-400">
            ₩{totalPending.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 mt-0.5">
            {allPayments.filter(p => p.status === 'pending').length}건
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-500">연체</span>
          </div>
          <div className="text-2xl font-bold text-red-400">
            ₩{totalOverdue.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 mt-0.5">
            {allPayments.filter(p => p.status === 'overdue').length}건
          </div>
        </div>
      </div>

      {/* 병원별 납부 내역 */}
      <div className="space-y-6">
        {hospitalPayments.map((hospital) => (
          <div key={hospital.hospitalId} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-white">{hospital.hospitalName}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full ${planColors[hospital.plan]}`}>
                  {hospital.plan}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                ₩{hospital.monthlyFee.toLocaleString()} / 월
              </div>
            </div>

            <div className="divide-y divide-gray-800">
              {hospital.payments.map((payment) => {
                const cfg = statusConfig[payment.status]
                const Icon = cfg.Icon
                return (
                  <div key={payment.month} className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-4">
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                      <div>
                        <div className="text-sm font-medium text-white">{payment.month}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {payment.status === 'paid'
                            ? `납부일: ${(payment as any).paidAt}`
                            : `${payment.status === 'overdue' ? '연체 — 마감일' : '마감일'}: ${(payment as any).dueAt}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.bg}`}>
                        {cfg.label}
                      </span>
                      <span className="text-sm font-semibold text-white w-28 text-right">
                        ₩{payment.amount.toLocaleString()}
                      </span>
                      {payment.status === 'overdue' && (
                        <button className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                          연체 독촉
                        </button>
                      )}
                      {payment.status === 'pending' && (
                        <button className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                          납부 확인
                        </button>
                      )}
                      {payment.status === 'paid' && (
                        <div className="w-16" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-between px-5 py-3 bg-gray-800/50">
              <span className="text-xs text-gray-500">3개월 합계</span>
              <span className="text-sm font-bold text-white">
                ₩{hospital.payments.reduce((s, p) => s + p.amount, 0).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
