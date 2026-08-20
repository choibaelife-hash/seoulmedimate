import { ImageResponse } from 'next/og'
import { locales } from '@/locales'
import {
  BRAND_NAVY, BRAND_BG, BRAND_MUTED, BRAND_NAME, BRAND_TAGLINE, BRAND_EMOJI,
} from '@/lib/brand'

// 카카오톡 / 페이스북 / 링크드인 / 슬랙 공유 카드에 쓰인다.
// 카카오톡 권장 비율이 1200x630 이라 그 규격을 따른다.
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = `${BRAND_NAME} — ${BRAND_TAGLINE}`

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          background: BRAND_BG, fontFamily: 'sans-serif',
        }}
      >
        {/* 패딩은 안쪽 컨테이너에만 준다. 루트에 주면 하단 바 폭이 패딩만큼 짧아진다. */}
        <div
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            justifyContent: 'center', padding: '0 88px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
            <div style={{ display: 'flex', fontSize: 128 }}>{BRAND_EMOJI}</div>
            <div style={{ fontSize: 76, color: BRAND_NAVY, letterSpacing: -1.5 }}>
              {BRAND_NAME}
            </div>
          </div>

          <div style={{ fontSize: 38, color: BRAND_MUTED, marginTop: 36, lineHeight: 1.35 }}>
            {BRAND_TAGLINE}
          </div>

          <div style={{ fontSize: 24, color: BRAND_NAVY, marginTop: 44, letterSpacing: 3, opacity: 0.55 }}>
            {locales.map((l) => l.toUpperCase()).join('   ·   ')}
          </div>
        </div>

        {/* 하단 강조 바 — 루트의 마지막 자식이라 전체 폭을 차지한다 */}
        <div style={{ display: 'flex', width: '100%', height: 16, background: BRAND_NAVY }} />
      </div>
    ),
    { ...size }
  )
}
