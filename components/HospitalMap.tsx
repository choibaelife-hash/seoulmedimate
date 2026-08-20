'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'
import type { MockHospital } from '@/lib/mock-hospitals'

// 서울 구별 좌표 (approximate)
const DISTRICT_COORDS: Record<string, [number, number]> = {
  '강남구':  [37.5172, 127.0473],
  '강서구':  [37.5509, 126.8489],
  '강북구':  [37.6396, 127.0253],
  '강동구':  [37.5301, 127.1238],
  '마포구':  [37.5535, 126.9380],
  '서초구':  [37.4836, 127.0324],
  '송파구':  [37.5145, 127.1059],
  '종로구':  [37.5735, 126.9790],
  '중구':    [37.5641, 126.9979],
  '용산구':  [37.5326, 126.9906],
  '성북구':  [37.5894, 127.0164],
  '노원구':  [37.6542, 127.0568],
  '동대문구':[37.5744, 127.0393],
  '성동구':  [37.5634, 127.0369],
  '광진구':  [37.5384, 127.0822],
  '영등포구':[37.5264, 126.8962],
  '서대문구':[37.5791, 126.9368],
  '도봉구':  [37.6688, 127.0471],
  '동작구':  [37.5124, 126.9393],
  '관악구':  [37.4784, 126.9516],
  '은평구':  [37.6027, 126.9291],
  '양천구':  [37.5270, 126.8566],
  '구로구':  [37.4955, 126.8876],
  '금천구':  [37.4601, 126.9002],
  '중랑구':  [37.6063, 127.0927],
}

declare global {
  interface Window {
    L: any
    _mapInitialized: boolean
  }
}

interface HospitalMapProps {
  hospitals: MockHospital[]
  locale: string
}

export default function HospitalMap({ hospitals, locale }: HospitalMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  const initMap = () => {
    if (!mapRef.current || !window.L || mapInstanceRef.current) return

    const L = window.L

    // 커스텀 마커 아이콘
    const icon = L.divIcon({
      html: `<div style="
        width: 32px; height: 32px;
        background: #8f2474;
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(143,36,116,0.4);
      "></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -34],
      className: '',
    })

    const featuredIcon = L.divIcon({
      html: `<div style="
        width: 36px; height: 36px;
        background: #f3bee9;
        border: 3px solid #8f2474;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 3px 12px rgba(143,36,116,0.5);
      "></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -38],
      className: '',
    })

    const map = L.map(mapRef.current, {
      center: [37.5665, 126.9780],
      zoom: 12,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map)

    // 구별 오프셋으로 겹침 방지
    const districtCount: Record<string, number> = {}

    hospitals.forEach((hospital, i) => {
      const base = DISTRICT_COORDS[hospital.district] ?? [37.5665, 126.9780]
      const count = districtCount[hospital.district] ?? 0
      districtCount[hospital.district] = count + 1

      const angle = (count * 137.5) * (Math.PI / 180) // golden angle spread
      const radius = count === 0 ? 0 : 0.005 + (Math.floor(count / 6) * 0.003)
      const lat = base[0] + radius * Math.sin(angle)
      const lng = base[1] + radius * Math.cos(angle)

      const marker = L.marker([lat, lng], {
        icon: hospital.is_premium ? featuredIcon : icon
      }).addTo(map)

      marker.bindPopup(`
        <div style="min-width:180px; font-family: -apple-system, sans-serif;">
          <div style="font-weight:700; font-size:14px; color:#1f2937; margin-bottom:4px;">
            ${hospital.is_premium ? '⭐ ' : ''}${hospital.name}
          </div>
          <div style="font-size:12px; color:#6b7280; margin-bottom:6px;">${hospital.name_ko}</div>
          <div style="display:flex; gap:8px; font-size:12px; color:#374151; margin-bottom:8px;">
            <span>⭐ ${hospital.rating}</span>
            <span>·</span>
            <span>${hospital.specialty}</span>
            <span>·</span>
            <span>${hospital.price_range}</span>
          </div>
          <a href="/${locale}/hospitals/${hospital.slug}"
            style="display:block; text-align:center; background:#8f2474; color:white; padding:6px 12px; border-radius:8px; text-decoration:none; font-size:12px; font-weight:600;">
            View Details →
          </a>
        </div>
      `, { maxWidth: 220 })
    })

    mapInstanceRef.current = map
  }

  // Leaflet CSS 직접 삽입
  useEffect(() => {
    if (document.getElementById('leaflet-css')) return
    const link = document.createElement('link')
    link.id = 'leaflet-css'
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)
  }, [])

  // 이미 로드된 경우 바로 초기화
  useEffect(() => {
    if (window.L) initMap()
  }, [hospitals])

  // 컴포넌트 언마운트시 맵 제거
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <>
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        onLoad={initMap}
        strategy="afterInteractive"
      />
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: '600px' }}>
        <div ref={mapRef} className="w-full h-full" />
        <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-md border border-gray-100 px-4 py-2.5 text-xs text-gray-600 z-[1000]">
          <span className="font-semibold text-brand-700">{hospitals.length}</span> hospitals shown
        </div>
      </div>
    </>
  )
}
