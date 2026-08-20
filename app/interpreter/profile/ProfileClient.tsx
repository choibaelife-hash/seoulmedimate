'use client'

import { useState } from 'react'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Save, Star, Globe, ToggleLeft, ToggleRight } from 'lucide-react'

const LOCALES = ['en', 'de', 'fr', 'es', 'it', 'pl', 'pt']

export default function InterpreterProfileClient({ profile, interpreter, userId }: any) {
  const supabase = createSupabaseClient()
  const router = useRouter()

  const [bio, setBio] = useState(interpreter?.bio ?? '')
  const [available, setAvailable] = useState(interpreter?.available ?? false)
  const [hourlyRate, setHourlyRate] = useState(interpreter?.hourly_rate ?? 80)
  const [languages, setLanguages] = useState<string[]>(interpreter?.languages ?? [])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const toggleLang = (l: string) =>
    setLanguages(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('interpreters').update({ bio, available, hourly_rate: hourlyRate, languages }).eq('user_id', userId)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        {/* Stats */}
        {interpreter && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">{interpreter.rating?.toFixed(1)}</span>
              </div>
              <div className="text-xs text-gray-500">Rating</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 mb-1">{interpreter.completed_count}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 capitalize mb-1">{interpreter.level}</div>
              <div className="text-xs text-gray-500">Level</div>
            </div>
          </div>
        )}

        {/* Availability */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Availability</label>
          <button
            onClick={() => setAvailable(!available)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors w-full ${
              available ? 'bg-green-50 border-green-300 text-green-800' : 'bg-gray-50 border-gray-300 text-gray-700'
            }`}
          >
            {available ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
            <span className="text-sm font-medium">{available ? 'Available for inquiries' : 'Unavailable'}</span>
          </button>
        </div>

        {/* Languages */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Globe className="w-4 h-4" /> Languages
          </label>
          <div className="flex flex-wrap gap-2">
            {LOCALES.map(l => (
              <button
                key={l}
                onClick={() => toggleLang(l)}
                className={`px-3 py-1.5 text-sm rounded-full border font-medium transition-colors ${
                  languages.includes(l)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-700 hover:border-blue-400'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Hourly rate */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Hourly Rate (€)</label>
          <input
            type="number"
            value={hourlyRate}
            min={50}
            max={200}
            onChange={e => setHourlyRate(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={4}
            placeholder="Tell patients about your medical interpretation experience..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saved ? '✅ Saved!' : saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  )
}
