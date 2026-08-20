import { ImageResponse } from 'next/og'
import { BRAND_EMOJI } from '@/lib/brand'

export const size = { width: 256, height: 256 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: 210,
        }}
      >
        {BRAND_EMOJI}
      </div>
    ),
    { ...size }
  )
}
