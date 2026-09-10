import { NOISE_BG } from '../lib/noise.js'

export default function Grain({ opacity = 0.05, className = '', position = 'absolute' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none ${position} inset-0 mix-blend-overlay ${className}`}
      style={{ backgroundImage: NOISE_BG, opacity }}
    />
  )
}
