'use client'

import { useState } from 'react'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Save, Globe } from 'lucide-react'

const SPECIALTIES = ['Orthopedics', 'Cardiology', 'Dermatology', 'Oncology', 'Plastic Surgery', 'Dental', 'Ophthalmology', 'Neurology', 'Gynecology', 'Internal Medicine']
const LOCALES = ['en', 'de', 'fr', 'es', 'it', 'pl', 'pt']

export default function HospitalProfileClient({ hospital }: any) {
  const supabase = createSupabaseClient()
  const router = useRouter()

  const [name, setName] = useState(hospital?.name ?? '')
  const [address, setAddress] = useState(hospital?.address ?? '')
  const [district, setDistrict] = useState(hospital?.district ?? '')
  const [phone, setPhone] = useState(hospital?.phone ?? '')
  const [website, setWebsite] = useState(hospital?.website ?? '')
  const [specialties, setSpecialties] = useState<string[]>(hospital?.specialties ?? [])
  const [languages, setLanguages] = useState<string[]>(hospital?.languages_supported ?? [])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const toggleSpecialty = (s: string) =>
    setSpecialties(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const toggleLang = (l: string) =>
    setLanguages(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])

  const handleSave = async () => {
    if (!hospital?.id) return
    setSaving(true)
    await supabase.from('hospitals').update({
      name, address, district, phone, website, specialties, languages_supported: languages,
    }).eq('id', hospital.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Hospital Profile</h1>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        {/* Basic info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Hospital Name', value: name, set: setName, placeholder: 'Seoul Medical Center' },
            { label: 'District', value: district, set: setDistrict, placeholder: 'Gangnam-gu' },
            { label: 'Phone', value: phone, set: setPhone, placeholder: '+82 2 1234 5678' },
            { label: 'Website', value: website, set: setWebsite, placeholder: 'https://hospital.com' },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
              <input
                type="text"
                value={value}
                onChange={e => set(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          ))}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="123 Medical Street, Seoul"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Specialties */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Specialties</label>
          <div className="flex flex-wrap gap-2">
            {SPECIALTIES.map(s => (
              <button
                key={s}
                onClick={() => toggleSpecialty(s)}
                className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-colors ${
                  specialties.includes(s)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-700 hover:border-blue-400'
                }`}
              >{s}</button>
            ))}
          </div>
        </div>

        {/* Interpreter languages */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Globe className="w-4 h-4" /> Interpreter Languages Available
          </label>
          <div className="flex flex-wrap gap-2">
            {LOCALES.map(l => (
              <button
                key={l}
                onClick={() => toggleLang(l)}
                className={`px-3 py-1.5 text-sm rounded-full border font-medium transition-colors ${
                  languages.includes(l)
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-gray-300 text-gray-700 hover:border-green-400'
                }`}
              >{l.toUpperCase()}</button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs mb-1">Verified</p>
            <p className={`font-medium ${hospital?.is_verified ? 'text-green-700' : 'text-gray-500'}`}>
              {hospital?.is_verified ? '✅ Verified' : '⏳ Pending'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Plan</p>
            <p className="font-medium text-gray-900">
              {hospital?.is_premium ? '⭐ Premium' : 'Standard'}
            </p>
          </div>
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
