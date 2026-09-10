export const TONE_STYLES = {
  deadpan: { color: '#ECE7DD', label: 'deadpan', dim: '#9A9689' },
  unhinged: { color: '#E8654F', label: 'unhinged', dim: '#6B372E' },
  wholesome: { color: '#4FA69C', label: 'wholesome', dim: '#2E5350' },
  ominous: { color: '#8B85D6', label: 'ominous', dim: '#454072' },
  petty: { color: '#E8A33D', label: 'petty', dim: '#6B5326' }
}

export function toneStyle(tone) {
  return TONE_STYLES[tone] || TONE_STYLES.deadpan
}

export const TONE_IDS = Object.keys(TONE_STYLES)

export const CATEGORIES = [
  { id: 'all', label: 'Everything' },
  { id: 'world', label: 'World' },
  { id: 'business', label: 'Business' },
  { id: 'tech', label: 'Tech' },
  { id: 'science', label: 'Science' },
  { id: 'sports', label: 'Sports' },
  { id: 'entertainment', label: 'Entertainment' }
]
