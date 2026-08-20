'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Users, MessageSquare, Calendar,
  FileCheck, Building2, ChevronDown,
  ChevronRight, LogOut, Stethoscope, Languages,
} from 'lucide-react'

type NavChild = { href: string; label: string }
type NavItem =
  | { href: string; label: string; icon: React.ElementType; exact?: boolean; children?: undefined }
  | { label: string; icon: React.ElementType; activePrefix: string; children: NavChild[]; href?: undefined; exact?: undefined }

const navItems: NavItem[] = [
  { href: '/admin',           label: '대시보드', icon: LayoutDashboard, exact: true },
  { href: '/admin/customers', label: '고객 관리', icon: Users },
  { href: '/admin/inquiries', label: '계약 관리', icon: MessageSquare },
  { href: '/admin/bookings',  label: '예약 관리', icon: Calendar },
  {
    label: '통역사 관리', icon: Languages, activePrefix: '/admin/interpreters',
    children: [
      { href: '/admin/interpreters',         label: '통역사 목록' },
      { href: '/admin/interpreters/payouts', label: '통역사 정산' },
    ],
  },
  { href: '/admin/applications', label: '제휴 의뢰', icon: FileCheck },
  {
    label: '병원 관리', icon: Building2, activePrefix: '/admin/hospitals',
    children: [
      { href: '/admin/hospitals',         label: '병원 목록' },
      { href: '/admin/hospitals/payouts', label: '구독료 정산' },
    ],
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => ({
    '통역사 관리': pathname.startsWith('/admin/interpreters'),
    '병원 관리':   pathname.startsWith('/admin/hospitals'),
  }))

  const toggleMenu = (label: string) =>
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }))

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
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
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            if (item.children) {
              const isActive = pathname.startsWith(item.activePrefix)
              const isOpen = openMenus[item.label] ?? false
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                  {isOpen && (
                    <div className="ml-6 mt-0.5 space-y-0.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                            pathname === child.href
                              ? 'bg-gray-700 text-white font-medium'
                              : 'text-gray-500 hover:bg-gray-800 hover:text-white'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href!)
            return (
              <Link
                key={item.href}
                href={item.href!}
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

        <div className="p-3 border-t border-gray-800">
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
