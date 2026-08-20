import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const title = 'SeoulMediMate — Korean Medical Care in Your Language'
const description =
  'Expert medical interpretation and hospital guidance for international patients in Korea.'

export const metadata: Metadata = {
  // OG 이미지가 절대 URL 로 나가려면 반드시 필요하다. 없으면 카카오톡이 이미지를 못 읽는다.
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://seoulmedimate.vercel.app'),
  title,
  description,
  // 아이콘/OG 이미지는 app/icon.tsx, app/apple-icon.tsx, app/opengraph-image.tsx 에서 자동 생성된다.
  openGraph: {
    type: 'website',
    siteName: 'SeoulMediMate',
    url: '/',
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
