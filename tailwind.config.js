/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0b192c',
          navyLight: '#1e3e62',
          blue: '#1d4ed8',
          blueDark: '#1e40af',
          slate: '#0f172a',
          card: '#ffffff',
          surface: '#f8fafc',
          border: '#e2e8f0',
          darkBorder: '#334155',
        },
        status: {
          open: '#16a34a',
          openLight: '#dcfce7',
          openBorder: '#86efac',
          restricted: '#d97706',
          restrictedLight: '#fef3c7',
          restrictedBorder: '#fde68a',
          blocked: '#dc2626',
          blockedLight: '#fee2e2',
          blockedBorder: '#fca5a5',
          highrisk: '#ea580c',
          highriskLight: '#ffedd5',
          highriskBorder: '#fdba74',
          unknown: '#64748b',
          unknownLight: '#f1f5f9',
          unknownBorder: '#cbd5e1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'gov': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
        'gov-md': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.08)',
        'gov-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
