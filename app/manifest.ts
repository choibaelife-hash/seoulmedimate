import type { MetadataRoute } from 'next'
import { BRAND_NAVY, BRAND_BG, BRAND_NAME, BRAND_TAGLINE } from '@/lib/brand'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND_NAME,
    short_name: BRAND_NAME,
    description: BRAND_TAGLINE,
    start_url: '/',
    display: 'standalone',
    background_color: BRAND_BG,
    theme_color: BRAND_NAVY,
    icons: [
      { src: '/icon', sizes: '256x256', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  }
}
