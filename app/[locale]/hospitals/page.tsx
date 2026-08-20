'use client'

import { useState, Suspense, lazy } from 'react'
import Link from 'next/link'
import { Search, MapPin, CheckCircle, Star, Building2, Filter, Map, List } from 'lucide-react'
import { MOCK_HOSPITALS, SPECIALTIES, type MockHospital } from '@/lib/mock-hospitals'

const HospitalMap = lazy(() => import('@/components/HospitalMap'))

const SPECIALTY_LABELS: Record<string, string> = {
  '전체': 'All',
  '피부과': 'Dermatology',
  '성형외과': 'Plastic Surgery',
  '치과': 'Dentistry',
  '정형외과': 'Orthopedics',
  '내과': 'Internal Medicine',
}

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'rating',       label: 'Highest Rated' },
  { value: 'reviews',      label: 'Most Reviewed' },
  { value: 'price_low',    label: 'Price: Low → High' },
  { value: 'price_high',   label: 'Price: High → Low' },
]

const PRICE_ORDER = ['€', '€€', '€€€', '€€€€']

export default function HospitalsPage({ params: { locale } }: { params: { locale: string } }) {
  return <HospitalList locale={locale} />
}

function HospitalList({ locale }: { locale: string }) {
  const [activeSpecialty, setActiveSpecialty] = useState('전체')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('recommended')
  const [view, setView] = useState<'list' | 'map'>('list')

  const filtered = MOCK_HOSPITALS.filter(h => {
    const matchSpecialty = activeSpecialty === '전체' || h.specialty === activeSpecialty
    const matchQuery = !query ||
      h.name.toLowerCase().includes(query.toLowerCase()) ||
      h.district.toLowerCase().includes(query.toLowerCase()) ||
      h.specialties.some(s => s.toLowerCase().includes(query.toLowerCase()))
    return matchSpecialty && matchQuery
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'rating')      return b.rating - a.rating
    if (sort === 'reviews')     return b.review_count - a.review_count
    if (sort === 'price_low')   return PRICE_ORDER.indexOf(a.price_range) - PRICE_ORDER.indexOf(b.price_range)
    if (sort === 'price_high')  return PRICE_ORDER.indexOf(b.price_range) - PRICE_ORDER.indexOf(a.price_range)
    if (b.is_premium !== a.is_premium) return b.is_premium ? 1 : -1
    if (b.is_verified !== a.is_verified) return b.is_verified ? 1 : -1
    return b.rating - a.rating
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Find a Hospital</h1>
            {/* List / Map toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setView('list')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === 'list'
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4" /> 목록
              </button>
              <button
                onClick={() => setView('map')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === 'map'
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Map className="w-4 h-4" /> 지도로 보기
              </button>
            </div>
          </div>

          {/* Search + Sort */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search hospitals, specialties, districts..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-300 text-sm"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="pl-9 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-300 text-sm bg-white appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Specialty Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SPECIALTIES.map(spec => (
              <button
                key={spec}
                onClick={() => setActiveSpecialty(spec)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeSpecialty === spec
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-brand-50 hover:text-brand-700'
                }`}
              >
                {SPECIALTY_LABELS[spec]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-gray-500 mb-6">
          <span className="font-medium text-gray-700">{sorted.length}</span> hospital{sorted.length !== 1 ? 's' : ''} found
          {activeSpecialty !== '전체' && ` in ${SPECIALTY_LABELS[activeSpecialty]}`}
        </p>

        {view === 'map' ? (
          <Suspense fallback={
            <div className="h-[600px] rounded-2xl bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Map className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>Loading map...</p>
              </div>
            </div>
          }>
            <HospitalMap hospitals={sorted} locale={locale} />
          </Suspense>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Building2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No hospitals found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map(hospital => (
              <HospitalCard key={hospital.id} hospital={hospital} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function HospitalCard({ hospital, locale }: { hospital: MockHospital; locale: string }) {
  return (
    <div className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
      hospital.is_premium ? 'border-brand-200 ring-1 ring-brand-100' : 'border-gray-200'
    }`}>
      {hospital.is_premium && (
        <div className="bg-brand-600 text-white text-xs font-medium px-4 py-1.5 text-center tracking-wide">
          ⭐ FEATURED
        </div>
      )}

      <div className="h-36 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-10 h-10 text-brand-300 mx-auto mb-1" />
          <span className="text-xs text-brand-500 font-medium">{hospital.specialty}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-gray-900 text-base leading-tight flex-1">{hospital.name}</h3>
          {hospital.is_verified && (
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 ml-2 mt-0.5" />
          )}
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{hospital.rating}</span>
            <span className="text-xs text-gray-400">({hospital.review_count})</span>
          </div>
          <span className="text-gray-300">·</span>
          <span className="text-xs text-gray-500 font-medium">{hospital.price_range}</span>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{hospital.district}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {hospital.specialties.slice(0, 3).map(s => (
            <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{s}</span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 mb-4">
          {hospital.languages.slice(0, 3).map(lang => (
            <span key={lang} className="text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100">{lang}</span>
          ))}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/${locale}/hospitals/${hospital.slug}`}
            className="flex-1 text-center py-2 text-sm border border-brand-200 rounded-lg hover:bg-brand-50 transition-colors text-brand-700 font-medium"
          >
            View Details
          </Link>
          <Link
            href={`/${locale}/hospitals/${hospital.slug}#booking`}
            className="flex-1 text-center py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  )
}
