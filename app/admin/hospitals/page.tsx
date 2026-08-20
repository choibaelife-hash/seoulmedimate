import Link from 'next/link'
import { Building2, Users, Calendar, CreditCard, ChevronRight } from 'lucide-react'

const hospitals = [
  {
    id: 'H001',
    name: '서울아산병원',
    nameEn: 'Asan Medical Center',
    region: '서울 송파구',
    contactName: '이진우 국제진료팀장',
    contactEmail: 'intl@amc.seoul.kr',
    contactPhone: '02-3010-5001',
    plan: '프리미엄',
    monthlyFee: 890000,
    joinedAt: '2024-02-01',
    status: '활성',
    totalInquiries: 38,
    totalBookings: 27,
    pendingPayment: true,
  },
  {
    id: 'H002',
    name: '삼성서울병원',
    nameEn: 'Samsung Medical Center',
    region: '서울 강남구',
    contactName: '박수현 국제진료센터장',
    contactEmail: 'global@smc.samsung.com',
    contactPhone: '02-3410-2114',
    plan: '스탠다드',
    monthlyFee: 590000,
    joinedAt: '2024-04-15',
    status: '활성',
    totalInquiries: 24,
    totalBookings: 16,
    pendingPayment: false,
  },
  {
    id: 'H003',
    name: '세브란스병원',
    nameEn: 'Severance Hospital',
    region: '서울 서대문구',
    contactName: '김태영 국제진료부장',
    contactEmail: 'international@yuhs.ac',
    contactPhone: '02-2228-5800',
    plan: '프리미엄',
    monthlyFee: 890000,
    joinedAt: '2024-03-10',
    status: '활성',
    totalInquiries: 31,
    totalBookings: 22,
    pendingPayment: false,
  },
]

const planColors: Record<string, string> = {
  프리미엄: 'bg-purple-900 text-purple-300',
  스탠다드: 'bg-blue-900 text-blue-300',
}

const totalMonthly = hospitals.reduce((s, h) => s + h.monthlyFee, 0)

export default function AdminHospitalsPage() {
  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">병원 관리</h1>
          <p className="text-gray-500 text-sm mt-0.5">파트너 병원 현황</p>
        </div>
        <Link
          href="/admin/hospitals/payouts"
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-xl transition-colors"
        >
          <CreditCard className="w-4 h-4" />
          구독료 정산 내역
        </Link>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="text-2xl font-bold text-white">{hospitals.length}</div>
          <div className="text-xs text-gray-500 mt-0.5">파트너 병원</div>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="text-2xl font-bold text-emerald-400">
            ₩{totalMonthly.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">월 구독 수익</div>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="text-2xl font-bold text-white">
            {hospitals.reduce((s, h) => s + h.totalInquiries, 0)}건
          </div>
          <div className="text-xs text-gray-500 mt-0.5">총 문의</div>
        </div>
      </div>

      {/* 병원 목록 */}
      <div className="space-y-4">
        {hospitals.map((hospital) => (
          <div key={hospital.id} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-white">{hospital.name}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${planColors[hospital.plan]}`}>
                      {hospital.plan}
                    </span>
                    {hospital.pendingPayment && (
                      <span className="text-xs bg-amber-900 text-amber-300 px-2 py-0.5 rounded-full">
                        납부대기
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 mt-0.5">{hospital.nameEn} · {hospital.region}</div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {hospital.contactName} · {hospital.contactEmail}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">
                  ₩{hospital.monthlyFee.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">/ 월</div>
                <div className="text-xs text-gray-600 mt-1">가입: {hospital.joinedAt}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">총 문의</div>
                  <div className="text-sm font-bold text-white">{hospital.totalInquiries}건</div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">예약 성사</div>
                  <div className="text-sm font-bold text-white">{hospital.totalBookings}건</div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">전환율</div>
                  <div className="text-sm font-bold text-white">
                    {Math.round((hospital.totalBookings / hospital.totalInquiries) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
