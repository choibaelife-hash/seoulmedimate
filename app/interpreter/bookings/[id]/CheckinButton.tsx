'use client'

import { useState } from 'react'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { MapPin } from 'lucide-react'

export default function CheckinButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false)
  const supabase = createSupabaseClient()
  const router = useRouter()

  const handleCheckin = async () => {
    setLoading(true)
    await supabase
      .from('bookings')
      .update({ interpreter_checkin_at: new Date().toISOString() })
      .eq('id', bookingId)
    router.refresh()
  }

  return (
    <button
      onClick={handleCheckin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
    >
      <MapPin className="w-5 h-5" />
      {loading ? 'Checking in...' : 'Check In at Hospital'}
    </button>
  )
}
