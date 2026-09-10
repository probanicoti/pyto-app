import { NOISE_BG } from '../lib/noise.js'

export default function Grain({ opacity = 0.05, className = '', position = 'absolute', blend = 'overlay' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none ${position} inset-0 ${className}`}
      style={{ backgroundImage: NOISE_BG, opacity, mixBlendMode: blend }}
    />
  )
}
