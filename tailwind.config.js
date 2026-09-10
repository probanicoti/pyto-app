/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // These read from CSS variables set in index.css, and flip between
        // the dark and light palettes based on the [data-theme] attribute
        // on <html> — so `bg-ink` / `text-paper` etc. stay the same class
        // names in both themes, just pointing at different values.
        ink: 'rgb(var(--color-bg) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        paper: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
        gold: '#E8A33D',
        teal: '#4FA69C',
        coral: '#E8654F',
        violet: '#8B85D6'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      },
      maxWidth: {
        prose: '640px'
      }
    }
  },
  plugins: []
}
