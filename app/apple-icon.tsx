import { ImageResponse } from 'next/og'
import { BRAND_EMOJI, BRAND_BG } from '@/lib/brand'

// iOS 가 모서리를 직접 깎고 투명 영역은 검게 합성하므로, 라운드 없이 배경을 채운다.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: BRAND_BG, fontSize: 132,
        }}
      >
        {BRAND_EMOJI}
      </div>
    ),
    { ...size }
  )
}
