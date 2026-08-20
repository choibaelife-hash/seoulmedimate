const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.medroute.com',
      },
      {
        protocol: 'https',
        hostname: '*.sanity.io',
      },
    ],
  },
}

module.exports = withNextIntl(nextConfig)
