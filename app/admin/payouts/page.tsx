import { CreditCard, CheckCircle, Clock, TrendingUp } from 'lucide-react'

const hospitals = [
  { id: 'H001', name: 'Hôpital Saint-Louis', country: '프랑스', flag: '🇫🇷' },
  { id: 'H002', name: 'Ospedale San Raffaele', country: '이탈리아', flag: '🇮🇹' },
  { id: 'H003', name: 'Clínica Universitaria Navarra', country: '스페인', flag: '🇪🇸' },
]

const interpreters = [
  { id: 'INT-001', name: 'Marie Dubois', language: '🇫🇷 프랑스어' },
  { id: 'INT-002', name: 'Marco Bianchi', language: '🇮🇹 이탈리아어' },
  { id: 'INT-003', name: 'Elena García', language: '🇪🇸 스페인어' },
]

const payouts = [
  { id: 'PAY-0031', interpreter: 'INT-001', interpreterId: 'Marie Dubois', inquiryId: 'INQ-2401', hospital: 'H001', amount: 180, status: 'pending', createdAt: '2025-06-01', dueAt: '2025-06-15' },
  { id: 'PAY-0030', interpreter: 'INT-001', interpreterId: 'Marie Dubois', inquiryId: 'INQ-2389', hospital: 'H001', amount: 220, status: 'pending', createdAt: '2025-05-22', dueAt: '2025-06-05' },
  { id: 'PAY-0029', interpreter: 'INT-003', interpreterId: 'Elena García', inquiryId: 'INQ-2398', hospital: 'H003', amount: 185, status: 'pending', createdAt: '2025-06-05', dueAt: '2025-06-19' },
  { id: 'PAY-0028', interpreter: 'INT-002', interpreterId: 'Marco Bianchi', inquiryId: 'INQ-2395', hospital: 'H002', amount: 200, status: 'pending', createdAt: '2025-06-03', dueAt: '2025-06-17' },
  { id: 'PAY-0027', interpreter: 'INT-003', interpreterId: 'Elena García', inquiryId: 'INQ-2385', hospital: 'H003', amount: 165, status: 'pending', createdAt: '2025-05-25', dueAt: '2025-06-08' },
  { id: 'PAY-0026', interpreter: 'INT-001', interpreterId: 'Marie Dubois', inquiryId: 'INQ-2371', hospital: 'H001', amount: 160, status: 'paid', paidAt: '2025-05-25', createdAt: '2025-05-10', dueAt: '2025-05-24' },
  { id: 'PAY-0025', interpreter: 'INT-002', interpreterId: 'Marco Bianchi', inquiryId: 'INQ-2382', hospital: 'H002', amount: 175, status: 'paid', paidAt: '2025-06-02', createdAt: '2025-05-19', dueAt: '2025-06-02' },
  { id: 'PAY-0024', interpreter: 'INT-003', interpreterId: 'Elena García', inquiryId: 'INQ-2374', hospital: 'H003', amount: 210, status: 'paid', paidAt: '2025-05-28', createdAt: '2025-05-14', dueAt: '2025-05-28' },
  { id: 'PAY-0023', interpreter: 'INT-002', interpreterId: 'Marco Bianchi', inquiryId: 'INQ-2349', hospital: 'H002', amount: 230, status: 'paid', paidAt: '2025-05-05', createdAt: '2025-04-21', dueAt: '2025-05-05' },
  { id: 'PAY-0022', interpreter: 'INT-001', interpreterId: 'Marie Dubois', inquiryId: 'INQ-2358', hospital: 'H001', amount: 195, status: 'paid', paidAt: '2025-05-12', createdAt: '2025-04-28', dueAt: '2025-05-12' },
  { id: 'PAY-0021', interpreter: 'INT-003', interpreterId: 'Elena García', inquiryId: 'INQ-2360', hospital: 'H003', amount: 190, status: 'paid', paidAt: '2025-05-16', createdAt: '2025-05-02', dueAt: '2025-05-16' },
  { id: 'PAY-0020', interpreter: 'INT-003', interpreterId: 'Elena García', inquiryId: 'INQ-2344', hospital: 'H003', amount: 175, status: 'paid', paidAt: '2025-05-02', createdAt: '2025-04-18', dueAt: '2025-05-02' },
]

const pendingPayouts = payouts.filter(p => p.status === 'pending')
const paidPayouts = payouts.filter(p => p.status === 'paid')
const pendingTotal = pendingPayouts.reduce((s, p) => s + p.amount, 0)
const paidTotal = paidPayouts.reduce((s, p) => s + p.amount, 0)

const interpreterMap: Record<string, string> = {}
interpreters.forEach(i => { interpreterMap[i.id] = i.name })

const hospitalMap: Record<string, { name: string; flag: string }> = {}
hospitals.forEach(h => { hospitalMap[h.id] = { name: h.name, flag: h.flag } })

export default function AdminPayoutsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">정산 관리</h1>
        <p className="text-gray-500 text-sm mt-0.5">통역사 수수료 정산 내역</p>
      </div>

      {/* 요약 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-500">미지급 건수</span>
          </div>
          <div className="text-2xl font-bold text-amber-400">{pendingPayouts.length}건</div>
          <div className="text-sm text-gray-500 mt-0.5">€{pendingTotal} 대기중</div>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-500">지급 완료</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{paidPayouts.length}건</div>
          <div className="text-sm text-gray-500 mt-0.5">€{paidTotal} 지급됨</div>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-500">총 정산액</span>
          </div>
          <div className="text-2xl font-bold text-white">€{(pendingTotal + paidTotal).toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-0.5">누적</div>
        </div>
      </div>

      {/* 미지급 정산 */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 mb-6">
        <div className="flex items-center gap-2 p-5 border-b border-gray-800">
          <Clock className="w-4 h-4 text-amber-400" />
          <h2 className="font-semibold text-white text-sm">미지급 정산</h2>
          <span className="ml-auto text-xs bg-amber-900 text-amber-300 px-2 py-0.5 rounded-full">{pendingPayouts.length}건 대기</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-600 border-b border-gray-800">
                <th className="text-left p-4 font-medium">정산 ID</th>
                <th className="text-left p-4 font-medium">통역사</th>
                <th className="text-left p-4 font-medium">문의 ID</th>
                <th className="text-left p-4 font-medium">병원</th>
                <th className="text-left p-4 font-medium">발생일</th>
                <th className="text-left p-4 font-medium">지급예정</th>
                <th className="text-right p-4 font-medium">금액</th>
                <th className="text-center p-4 font-medium">처리</th>
              </tr>
            </thead>
            <tbody>
              {pendingPayouts.map((p) => (
                <tr key={p.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50">
                  <td className="p-4 font-mono text-xs text-gray-500">{p.id}</td>
                  <td className="p-4 text-white">{p.interpreterId}</td>
                  <td className="p-4 font-mono text-xs text-gray-500">{p.inquiryId}</td>
                  <td className="p-4 text-gray-400 text-xs">
                    <span>{hospitalMap[p.hospital]?.flag} {hospitalMap[p.hospital]?.name}</span>
                  </td>
                  <td className="p-4 text-gray-500 text-xs">{p.createdAt}</td>
                  <td className="p-4 text-amber-400 text-xs">{p.dueAt}</td>
                  <td className="p-4 text-right font-semibold text-emerald-400">€{p.amount}</td>
                  <td className="p-4 text-center">
                    <button className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg transition-colors">
                      지급처리
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 지급 완료 내역 */}
      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="flex items-center gap-2 p-5 border-b border-gray-800">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <h2 className="font-semibold text-white text-sm">지급 완료 내역</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-600 border-b border-gray-800">
                <th className="text-left p-4 font-medium">정산 ID</th>
                <th className="text-left p-4 font-medium">통역사</th>
                <th className="text-left p-4 font-medium">문의 ID</th>
                <th className="text-left p-4 font-medium">병원</th>
                <th className="text-left p-4 font-medium">지급일</th>
                <th className="text-right p-4 font-medium">금액</th>
                <th className="text-center p-4 font-medium">상태</th>
              </tr>
            </thead>
            <tbody>
              {paidPayouts.map((p) => (
                <tr key={p.id} className="border-b border-gray-800 last:border-0">
                  <td className="p-4 font-mono text-xs text-gray-500">{p.id}</td>
                  <td className="p-4 text-gray-300">{p.interpreterId}</td>
                  <td className="p-4 font-mono text-xs text-gray-500">{p.inquiryId}</td>
                  <td className="p-4 text-gray-500 text-xs">
                    <span>{hospitalMap[p.hospital]?.flag} {hospitalMap[p.hospital]?.name}</span>
                  </td>
                  <td className="p-4 text-gray-500 text-xs">{(p as any).paidAt}</td>
                  <td className="p-4 text-right font-semibold text-gray-400">€{p.amount}</td>
                  <td className="p-4 text-center">
                    <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full">지급완료</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
