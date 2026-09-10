/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#12141C',
        card: '#1A1D28',
        card2: '#20232F',
        paper: '#ECE7DD',
        muted: '#868A99',
        line: '#2B2F3D',
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
