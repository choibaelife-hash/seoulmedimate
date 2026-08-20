'use client'

import { useState } from 'react'
import {
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  X,
  User,
  Building2,
  Languages,
  CreditCard,
  MapPin,
} from 'lucide-react'

const BOOKINGS = [
  {
    id: 'bk1',
    customer: 'Aleksander Nowak',
    customerCountry: '🇵🇱',
    hospital: '서울아산병원',
    department: '척추외과',
    interpreter: '최현아',
    date: '2026-08-25',
    time: '10:00',
    status: '확정',
    amount: '₩ 2,400,000',
    note: 'L4-L5 디스크 수술 전 진료. 수술 동의서 번역 필요.',
  },
  {
    id: 'bk2',
    customer: 'Clara Dupont',
    customerCountry: '🇫🇷',
    hospital: '삼성서울병원',
    department: '심장내과',
    interpreter: '이서연',
    date: '2026-08-22',
    time: '14:30',
    status: '확정',
    amount: '₩ 3,100,000',
    note: '심장 판막 수술 2차 진료. 불어 통역 필요.',
  },
  {
    id: 'bk3',
    customer: 'Sophie Müller',
    customerCountry: '🇩🇪',
    hospital: '서울아산병원',
    department: '정형외과',
    interpreter: '김민준',
    date: '2026-09-02',
    time: '09:30',
    status: '대기중',
    amount: '₩ 1,800,000',
    note: '무릎 관절 수술 상담 예약. 독어 통역 배정 완료.',
  },
  {
    id: 'bk4',
    customer: 'Marco Rossi',
    customerCountry: '🇮🇹',
    hospital: '세브란스병원',
    department: '피부과',
    interpreter: '박지훈',
    date: '2026-08-20',
    time: '11:00',
    status: '완료',
    amount: '₩ 450,000',
    note: '피부 레이저 시술 완료. 사후 관리 안내 통역 포함.',
  },
  {
    id: 'bk5',
    customer: 'Ana González',
    customerCountry: '🇪🇸',
    hospital: '삼성서울병원',
    department: '안과',
    interpreter: '-',
    date: '2026-09-05',
    time: '13:00',
    status: '대기중',
    amount: '₩ 2,200,000',
    note: '라식 수술 전 시력 검사. 통역사 배정 대기 중.',
  },
  {
    id: 'bk6',
    customer: 'Clara Dupont',
    customerCountry: '🇫🇷',
    hospital: '세브란스병원',
    department: '정형외과',
    interpreter: '이서연',
    date: '2026-07-10',
    time: '15:00',
    status: '취소',
    amount: '-',
    note: '고객 사유로 취소. 환불 처리 완료.',
  },
]

const STATUS_CONFIG = {
  확정: { color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
  완료: { color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  대기중: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  취소: { color: 'bg-red-100 text-red-500', icon: XCircle },
}

type StatusFilter = '전체' | '확정' | '완료' | '대기중' | '취소'

export default function AdminBookingsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('전체')
  const [selected, setSelected] = useState<(typeof BOOKINGS)[0] | null>(null)

  const filtered = BOOKINGS.filter((b) => {
    const matchSearch =
      b.customer.toLowerCase().includes(search.toLowerCase()) ||
      b.hospital.includes(search) ||
      b.department.includes(search)
    const matchStatus = statusFilter === '전체' || b.status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = {
    전체: BOOKINGS.length,
    확정: BOOKINGS.filter((b) => b.status === '확정').length,
    대기중: BOOKINGS.filter((b) => b.status === '대기중').length,
    완료: BOOKINGS.filter((b) => b.status === '완료').length,
    취소: BOOKINGS.filter((b) => b.status === '취소').length,
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">예약 관리</h1>
        <p className="text-sm text-gray-500 mt-1">
          고객 병원 예약 전체 내역을 관리합니다.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {(['전체', '확정', '대기중', '완료', '취소'] as const).map((s) => {
          const cfg = s !== '전체' ? STATUS_CONFIG[s] : null
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`bg-white rounded-xl border p-4 text-left transition-all hover:border-blue-300 ${
                statusFilter === s ? 'border-blue-400 ring-1 ring-blue-300' : 'border-gray-200'
              }`}
            >
              <p className="text-xs text-gray-400 font-medium">{s}</p>
              <p className={`text-2xl font-bold mt-1 ${cfg ? cfg.color.split(' ')[1] : 'text-gray-900'}`}>
                {counts[s]}
              </p>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="고객명, 병원, 진료과 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">고객</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">병원 / 진료과</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">통역사</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">예약 일시</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">금액</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">상태</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((b) => {
              const cfg = STATUS_CONFIG[b.status as keyof typeof STATUS_CONFIG]
              return (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span>{b.customerCountry}</span>
                      <span className="font-medium text-gray-900">{b.customer}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800">{b.hospital}</p>
                    <p className="text-xs text-gray-400">{b.department}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{b.interpreter}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800">{b.date}</p>
                    <p className="text-xs text-gray-400">{b.time}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-700 font-medium">{b.amount}</td>
                  <td className="px-5 py-4">
                    {cfg && (
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
                        <cfg.icon className="w-3 h-3" />
                        {b.status}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelected(b)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400 text-sm">검색 결과가 없습니다.</div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">예약 상세</h2>
                <p className="text-xs text-gray-400 mt-0.5">{selected.id.toUpperCase()}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><User className="w-3 h-3" /> 고객</p>
                  <p className="font-medium text-gray-800">{selected.customerCountry} {selected.customer}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Building2 className="w-3 h-3" /> 병원</p>
                  <p className="font-medium text-gray-800">{selected.hospital}</p>
                  <p className="text-xs text-gray-400">{selected.department}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Languages className="w-3 h-3" /> 통역사</p>
                  <p className="font-medium text-gray-800">{selected.interpreter}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> 일시</p>
                  <p className="font-medium text-gray-800">{selected.date}</p>
                  <p className="text-xs text-gray-400">{selected.time}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><CreditCard className="w-3 h-3" /> 금액</p>
                  <p className="font-semibold text-gray-900">{selected.amount}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">상태</p>
                  {(() => {
                    const cfg = STATUS_CONFIG[selected.status as keyof typeof STATUS_CONFIG]
                    return cfg ? (
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
                        <cfg.icon className="w-3 h-3" />
                        {selected.status}
                      </span>
                    ) : null
                  })()}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">메모</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed">{selected.note}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
