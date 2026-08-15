/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Dark 2026 refined palette ─────────────────────────────────────
        'brand-bg': '#0A0A0A', // never #000
        'brand-surface': '#1A1A1A',
        'brand-elevated': '#252525',
        'brand-border': ({ opacityValue }) =>
          `rgba(255, 255, 255, ${opacityValue ?? 0.12})`, // hairline 1px
        'brand-text': '#E6E6E6', // off-white
        'brand-text-secondary': ({ opacityValue }) =>
          `rgba(230, 230, 230, ${opacityValue ?? 0.70})`,
        'brand-accent': '#8AB4F8',
        'brand-accent-hover': '#AECBFA',
        // ── Legacy aliases (kept so existing components don't break) ───────
        'brand-surface-2': '#252525', // aligned with brand-elevated
        'brand-accent-secondary': '#8B5CF6',
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 32px rgba(138,180,248,0.35)',
      },
      borderRadius: {
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
