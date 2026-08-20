'use client'

import { useState } from 'react'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

export default function ConfirmBookingButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false)
  const supabase = createSupabaseClient()
  const router = useRouter()

  const confirm = async () => {
    setLoading(true)
    await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', bookingId)
    router.refresh()
  }

  return (
    <button
      onClick={confirm}
      disabled={loading}
      className="flex items-center gap-1.5 text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-50"
    >
      <CheckCircle className="w-3.5 h-3.5" />
      {loading ? '...' : 'Confirm'}
    </button>
  )
}
