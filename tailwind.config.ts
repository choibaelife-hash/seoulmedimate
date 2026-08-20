import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf5fc',
          100: '#f3bee9',   // 메인 브랜드 컬러
          200: '#e99dd8',
          300: '#da72c3',
          400: '#c84dac',
          500: '#b03491',
          600: '#8f2474',
          700: '#6e1858',
          800: '#4e0f3e',
          900: '#2f0826',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
}

export default config
