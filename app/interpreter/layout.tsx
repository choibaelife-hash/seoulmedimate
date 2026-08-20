'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, MessageSquare, Calendar,
  LogOut, Stethoscope,
} from 'lucide-react'

const navItems = [
  { href: '/interpreter',           label: '대시보드', icon: LayoutDashboard, exact: true },
  { href: '/interpreter/customers', label: '고객 관리', icon: Users },
  { href: '/interpreter/contracts', label: '계약 관리', icon: MessageSquare },
  { href: '/interpreter/bookings',  label: '예약 관리', icon: Calendar },
]

const PUBLIC_PATHS = ['/interpreter/login', '/interpreter/signup', '/interpreter/onboarding']

export default function InterpreterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p))

  useEffect(() => {
    if (isPublic) { setChecking(false); return }
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/interpreter/login'); return }
      setEmail(user.email ?? null)
      setChecking(false)
    })
  }, [isPublic, router])

  if (isPublic) return <>{children}</>
  if (checking) return (
    <div className="flex min-h-screen bg-gray-950 items-center justify-center">
      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/interpreter/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">SeoulMediMate</p>
              <p className="text-xs text-gray-500">통역사 포털</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-gray-800 space-y-2">
          {email && <p className="text-xs text-gray-600 truncate px-1">{email}</p>}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-900/30 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
