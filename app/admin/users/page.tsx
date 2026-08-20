import { Users, Star, MessageSquare, Calendar } from 'lucide-react'

const interpreters = [
  {
    id: 'INT-001',
    name: 'Marie Dubois',
    language: '프랑스어',
    flag: '🇫🇷',
    email: 'marie.dubois@mediRoute.com',
    phone: '+33 6 12 34 56 78',
    status: '활성',
    rating: 4.9,
    joinedAt: '2024-03-15',
    inquiries: [
      { id: 'INQ-2401', patient: 'Kim Minji', date: '2025-06-01', hospital: 'Hôpital Saint-Louis', status: '완료', amount: 180 },
      { id: 'INQ-2389', patient: 'Lee Junho', date: '2025-05-22', hospital: 'Clinique de Paris', status: '완료', amount: 220 },
      { id: 'INQ-2371', patient: 'Park Sooyeon', date: '2025-05-10', hospital: 'Hôpital Saint-Louis', status: '완료', amount: 160 },
      { id: 'INQ-2358', patient: 'Choi Yuna', date: '2025-04-28', hospital: 'Centre Hospitalier Lyon', status: '완료', amount: 195 },
      { id: 'INQ-2341', patient: 'Jung Hyun', date: '2025-04-15', hospital: 'Hôpital Saint-Louis', status: '완료', amount: 210 },
    ],
    totalEarnings: 3840,
    pendingPayout: 575,
  },
  {
    id: 'INT-002',
    name: 'Marco Bianchi',
    language: '이탈리아어',
    flag: '🇮🇹',
    email: 'marco.bianchi@mediRoute.com',
    phone: '+39 02 1234 5678',
    status: '활성',
    rating: 4.7,
    joinedAt: '2024-05-08',
    inquiries: [
      { id: 'INQ-2395', patient: 'Yoon Seojun', date: '2025-06-03', hospital: 'Ospedale San Raffaele', status: '완료', amount: 200 },
      { id: 'INQ-2382', patient: 'Shin Dayeon', date: '2025-05-19', hospital: 'Policlinico di Milano', status: '완료', amount: 175 },
      { id: 'INQ-2366', patient: 'Han Jiwon', date: '2025-05-05', hospital: 'Ospedale San Raffaele', status: '진행중', amount: 190 },
      { id: 'INQ-2349', patient: 'Oh Minseok', date: '2025-04-21', hospital: 'Istituto Europeo Oncologia', status: '완료', amount: 230 },
    ],
    totalEarnings: 2960,
    pendingPayout: 365,
  },
  {
    id: 'INT-003',
    name: 'Elena García',
    language: '스페인어',
    flag: '🇪🇸',
    email: 'elena.garcia@mediRoute.com',
    phone: '+34 91 234 5678',
    status: '활성',
    rating: 4.8,
    joinedAt: '2024-04-20',
    inquiries: [
      { id: 'INQ-2398', patient: 'Kwon Taehoon', date: '2025-06-05', hospital: 'Clínica Universitaria Navarra', status: '진행중', amount: 185 },
      { id: 'INQ-2385', patient: 'Im Sujin', date: '2025-05-25', hospital: 'Hospital La Paz Madrid', status: '완료', amount: 165 },
      { id: 'INQ-2374', patient: 'Song Jihye', date: '2025-05-14', hospital: 'Clínica Universitaria Navarra', status: '완료', amount: 210 },
      { id: 'INQ-2360', patient: 'Bae Youngmin', date: '2025-05-02', hospital: 'Hospital Germans Trias', status: '완료', amount: 190 },
      { id: 'INQ-2344', patient: 'Jang Mirae', date: '2025-04-18', hospital: 'Hospital La Paz Madrid', status: '완료', amount: 175 },
      { id: 'INQ-2330', patient: 'Nam Gyuho', date: '2025-04-05', hospital: 'Clínica Universitaria Navarra', status: '완료', amount: 220 },
    ],
    totalEarnings: 4210,
    pendingPayout: 550,
  },
]

const statusColors: Record<string, string> = {
  완료: 'bg-green-900 text-green-300',
  진행중: 'bg-blue-900 text-blue-300',
  대기: 'bg-gray-700 text-gray-300',
}

export default function AdminUsersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">사용자 관리</h1>
        <p className="text-gray-500 text-sm mt-0.5">등록된 통역사 목록 및 상담 내역</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="text-2xl font-bold text-white">3</div>
          <div className="text-xs text-gray-500 mt-0.5">활성 통역사</div>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="text-2xl font-bold text-white">15</div>
          <div className="text-xs text-gray-500 mt-0.5">총 처리 문의</div>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="text-2xl font-bold text-amber-400">€1,490</div>
          <div className="text-xs text-gray-500 mt-0.5">미지급 정산</div>
        </div>
      </div>

      {/* 통역사 목록 */}
      <div className="space-y-6">
        {interpreters.map((interpreter) => (
          <div key={interpreter.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            {/* 통역사 헤더 */}
            <div className="p-5 border-b border-gray-800">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-2xl">
                    {interpreter.flag}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-white">{interpreter.name}</h2>
                      <span className="text-xs bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-full">{interpreter.status}</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-0.5">{interpreter.language} 통역사 · {interpreter.id}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{interpreter.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold text-white">{interpreter.rating}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">가입일: {interpreter.joinedAt}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs text-gray-500">처리 문의</span>
                  </div>
                  <div className="text-xl font-bold text-white">{interpreter.inquiries.length}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs text-gray-500">총 수익</span>
                  </div>
                  <div className="text-xl font-bold text-white">€{interpreter.totalEarnings.toLocaleString()}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Users className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs text-gray-500">미지급</span>
                  </div>
                  <div className="text-xl font-bold text-amber-400">€{interpreter.pendingPayout}</div>
                </div>
              </div>
            </div>

            {/* 상담 내역 테이블 */}
            <div className="p-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">상담 내역</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-600 border-b border-gray-800">
                      <th className="text-left pb-2 font-medium">문의 ID</th>
                      <th className="text-left pb-2 font-medium">환자명</th>
                      <th className="text-left pb-2 font-medium">병원</th>
                      <th className="text-left pb-2 font-medium">날짜</th>
                      <th className="text-left pb-2 font-medium">상태</th>
                      <th className="text-right pb-2 font-medium">금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interpreter.inquiries.map((inq) => (
                      <tr key={inq.id} className="border-b border-gray-800 last:border-0">
                        <td className="py-2.5 font-mono text-xs text-gray-500">{inq.id}</td>
                        <td className="py-2.5 text-white">{inq.patient}</td>
                        <td className="py-2.5 text-gray-400 text-xs">{inq.hospital}</td>
                        <td className="py-2.5 text-gray-500 text-xs">{inq.date}</td>
                        <td className="py-2.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[inq.status]}`}>
                            {inq.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-semibold text-emerald-400">€{inq.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
