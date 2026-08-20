import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🏩</div>
        <h1 className="text-7xl font-bold text-brand-200 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Page not found</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/en"
            className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors font-medium"
          >
            Go Home
          </Link>
          <Link
            href="/en/hospitals"
            className="inline-flex items-center justify-center gap-2 border border-brand-200 text-brand-700 px-6 py-3 rounded-xl hover:bg-brand-50 transition-colors font-medium"
          >
            Find Hospitals
          </Link>
        </div>
      </div>
    </div>
  )
}
