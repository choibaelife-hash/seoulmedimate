import Link from 'next/link'
import { createClient as createSupabaseClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { FileText, Calendar, Building2, LayoutDashboard } from 'lucide-react'

export default async function HospitalLayout({ children }: { children: React.ReactNode }) {
  // 공개 경로(로그인/회원가입/온보딩)는 인증 없이 통과
  const pathname = headers().get('x-pathname') ?? ''
  const isPublic = ['/hospital/login', '/hospital/signup', '/hospital/onboarding']
    .some(p => pathname.startsWith(p))

  if (isPublic) return <>{children}</>

  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/hospital/login')

  const navItems = [
    { href: '/hospital', label: '대시보드', icon: LayoutDashboard },
    { href: '/hospital/briefings', label: '브리핑 수신함', icon: FileText },
    { href: '/hospital/bookings', label: '예약 현황', icon: Calendar },
    { href: '/hospital/profile', label: '병원 정보', icon: Building2 },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Link href="/" className="font-bold text-lg text-blue-600">🏥 SeoulMediMate</Link>
          <p className="text-xs text-gray-500 mt-1">병원 어드민</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Icon className="w-4 h-4 text-gray-500" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
      </aside>
      <div className="flex-1 overflow-auto">
        <main className="max-w-5xl mx-auto p-6">{children}</main>
      </div>
    </div>
  )
}
