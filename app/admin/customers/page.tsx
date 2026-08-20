'use client'

import { useState } from 'react'
import {
  Search,
  Filter,
  Phone,
  Mail,
  Globe,
  MessageSquare,
  Mic,
  Calendar,
  ChevronRight,
  X,
  User,
  Clock,
} from 'lucide-react'

// 목업 데이터 — 실제 연동 시 Supabase에서 fetch
const MOCK_CUSTOMERS = [
  {
    id: 'u1',
    name: 'Sophie Müller',
    email: 'sophie.muller@gmail.com',
    country: '🇩🇪 Germany',
    language: 'de',
    phone: '+49 151 2345 6789',
    joinedAt: '2025-11-03',
    lastActive: '2026-08-18',
    totalInquiries: 3,
    totalVoiceSessions: 2,
    inquiries: [
      {
        id: 'iq1',
        type: 'voice',
        title: '서울아산병원 — 무릎 관절 치료 문의',
        createdAt: '2026-08-18 14:23',
        status: '완료',
        duration: '12분 34초',
        language: 'de → ko',
      },
      {
        id: 'iq2',
        type: 'voice',
        title: '삼성서울병원 — 건강검진 예약',
        createdAt: '2026-07-05 09:11',
        status: '완료',
        duration: '8분 12초',
        language: 'de → ko',
      },
      {
        id: 'iq3',
        type: 'text',
        title: '비자 서류 관련 일반 문의',
        createdAt: '2026-06-20 16:45',
        status: '완료',
        duration: null,
        language: 'de → ko',
      },
    ],
  },
  {
    id: 'u2',
    name: 'Marco Rossi',
    email: 'marco.rossi@outlook.com',
    country: '🇮🇹 Italy',
    language: 'it',
    phone: '+39 333 456 7890',
    joinedAt: '2025-12-14',
    lastActive: '2026-08-15',
    totalInquiries: 2,
    totalVoiceSessions: 1,
    inquiries: [
      {
        id: 'iq4',
        type: 'voice',
        title: '세브란스병원 — 피부과 상담',
        createdAt: '2026-08-15 11:30',
        status: '완료',
        duration: '9분 55초',
        language: 'it → ko',
      },
      {
        id: 'iq5',
        type: 'text',
        title: '숙박 및 교통 안내 문의',
        createdAt: '2026-07-28 13:00',
        status: '완료',
        duration: null,
        language: 'it → ko',
      },
    ],
  },
  {
    id: 'u3',
    name: 'Clara Dupont',
    email: 'clara.dupont@yahoo.fr',
    country: '🇫🇷 France',
    language: 'fr',
    phone: '+33 6 12 34 56 78',
    joinedAt: '2026-01-08',
    lastActive: '2026-08-19',
    totalInquiries: 4,
    totalVoiceSessions: 3,
    inquiries: [
      {
        id: 'iq6',
        type: 'voice',
        title: '서울아산병원 — 암 센터 2차 소견',
        createdAt: '2026-08-19 10:05',
        status: '진행중',
        duration: '진행중',
        language: 'fr → ko',
      },
      {
        id: 'iq7',
        type: 'voice',
        title: '삼성서울병원 — 심장 내과 진료',
        createdAt: '2026-07-11 15:20',
        status: '완료',
        duration: '22분 01초',
        language: 'fr → ko',
      },
      {
        id: 'iq8',
        type: 'voice',
        title: '세브란스병원 — 정형외과 상담',
        createdAt: '2026-06-03 09:44',
        status: '완료',
        duration: '15분 48초',
        language: 'fr → ko',
      },
      {
        id: 'iq9',
        type: 'text',
        title: '의료비 견적 문의',
        createdAt: '2026-05-21 12:00',
        status: '완료',
        duration: null,
        language: 'fr → ko',
      },
    ],
  },
  {
    id: 'u4',
    name: 'Aleksander Nowak',
    email: 'aleksander.nowak@wp.pl',
    country: '🇵🇱 Poland',
    language: 'pl',
    phone: '+48 600 123 456',
    joinedAt: '2026-02-22',
    lastActive: '2026-08-10',
    totalInquiries: 1,
    totalVoiceSessions: 1,
    inquiries: [
      {
        id: 'iq10',
        type: 'voice',
        title: '서울아산병원 — 척추 수술 문의',
        createdAt: '2026-08-10 17:15',
        status: '완료',
        duration: '18분 22초',
        language: 'pl → ko',
      },
    ],
  },
  {
    id: 'u5',
    name: 'Ana González',
    email: 'ana.gonzalez@gmail.com',
    country: '🇪🇸 Spain',
    language: 'es',
    phone: '+34 612 345 678',
    joinedAt: '2026-03-30',
    lastActive: '2026-08-17',
    totalInquiries: 2,
    totalVoiceSessions: 1,
    inquiries: [
      {
        id: 'iq11',
        type: 'voice',
        title: '삼성서울병원 — 안과 라식 상담',
        createdAt: '2026-08-17 13:50',
        status: '완료',
        duration: '7분 30초',
        language: 'es → ko',
      },
      {
        id: 'iq12',
        type: 'text',
        title: '통역사 서비스 이용 방법 문의',
        createdAt: '2026-04-02 10:00',
        status: '완료',
        duration: null,
        language: 'es → ko',
      },
    ],
  },
]

type Customer = (typeof MOCK_CUSTOMERS)[number]

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Customer | null>(null)

  const filtered = MOCK_CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">고객 관리</h1>
        <p className="text-sm text-gray-500 mt-1">
          서비스를 이용 중인 외국인 환자 고객의 가입정보 및 문의 내역을 확인합니다.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">전체 고객</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{MOCK_CUSTOMERS.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">총 문의 건수</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {MOCK_CUSTOMERS.reduce((s, c) => s + c.totalInquiries, 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">음성 서비스 이용</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">
            {MOCK_CUSTOMERS.reduce((s, c) => s + c.totalVoiceSessions, 0)}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="이름, 이메일, 국가 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          필터
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">고객</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">국가 / 언어</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">가입일</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">마지막 활동</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">문의</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">음성 이용</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                      {c.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-600">{c.country}</td>
                <td className="px-5 py-4 text-gray-600">{c.joinedAt}</td>
                <td className="px-5 py-4 text-gray-600">{c.lastActive}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1 text-blue-700 font-semibold">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {c.totalInquiries}건
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1 text-purple-700 font-semibold">
                    <Mic className="w-3.5 h-3.5" />
                    {c.totalVoiceSessions}회
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => setSelected(c)}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    상세보기 <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  {selected.name[0]}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selected.name}</h2>
                  <p className="text-sm text-gray-400">{selected.country}</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6">
              {/* 가입 정보 */}
              <section>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  가입 정보
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">이메일</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      {selected.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">전화번호</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {selected.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">사용 언어</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-gray-400" />
                      {selected.language.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">가입일</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {selected.joinedAt}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">마지막 활동</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {selected.lastActive}
                    </p>
                  </div>
                </div>
              </section>

              {/* 서비스 이용 요약 */}
              <section>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  서비스 이용 요약
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-blue-700">{selected.totalInquiries}</p>
                    <p className="text-xs text-blue-500 mt-0.5">전체 문의</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-purple-700">{selected.totalVoiceSessions}</p>
                    <p className="text-xs text-purple-500 mt-0.5">음성 서비스 이용</p>
                  </div>
                </div>
              </section>

              {/* 문의 내역 */}
              <section>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  문의 / 음성서비스 이용 내역
                </h3>
                <div className="space-y-2">
                  {selected.inquiries.map((iq) => (
                    <div
                      key={iq.id}
                      className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-blue-200 transition-colors"
                    >
                      <div
                        className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          iq.type === 'voice'
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {iq.type === 'voice' ? (
                          <Mic className="w-3.5 h-3.5" />
                        ) : (
                          <MessageSquare className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{iq.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">{iq.createdAt}</span>
                          <span className="text-gray-200">·</span>
                          <span className="text-xs text-gray-400">{iq.language}</span>
                          {iq.duration && iq.duration !== '진행중' && (
                            <>
                              <span className="text-gray-200">·</span>
                              <span className="text-xs text-purple-500">{iq.duration}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                          iq.status === '완료'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {iq.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
