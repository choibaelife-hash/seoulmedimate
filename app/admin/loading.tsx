'use client'

import { usePathname } from 'next/navigation'

// /admin 및 하위 경로의 서버 렌더링이 끝날 때까지 즉시 표시되는 스켈레톤.
// 대시보드가 Supabase 쿼리를 기다리는 동안 흰 화면 대신 레이아웃 골격을 보여준다.
export default function AdminLoading() {
  const pathname = usePathname()

  // 로그인 화면은 밝은 배경이라 다크 대시보드 골격이 깜빡이면 어색하다.
  if (pathname === '/admin/login') return null

  return (
    <div className="p-8 animate-pulse">
      <div className="mb-8">
        <div className="h-7 w-32 bg-gray-800 rounded" />
        <div className="h-4 w-64 bg-gray-800/60 rounded mt-2.5" />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <div className="w-10 h-10 rounded-xl bg-gray-800 mb-3" />
            <div className="h-8 w-16 bg-gray-800 rounded" />
            <div className="h-3.5 w-20 bg-gray-800/60 rounded mt-2" />
          </div>
        ))}
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="h-4 w-24 bg-gray-800 rounded" />
        </div>
        <div className="divide-y divide-gray-800">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 w-2/3 bg-gray-800 rounded" />
                <div className="h-3 w-28 bg-gray-800/60 rounded mt-2" />
              </div>
              <div className="h-6 w-16 bg-gray-800 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
