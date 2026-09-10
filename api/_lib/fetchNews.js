// Pulls top headlines from whichever free news APIs have keys configured,
// then merges and de-duplicates them into one list. Every provider is
// optional — the app degrades gracefully if only one key is set.

const CATEGORY_MAP = {
  world: 'world',
  business: 'business',
  tech: 'technology',
  science: 'science',
  sports: 'sports',
  entertainment: 'entertainment'
}

function normalizeTitle(title = '') {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Rough similarity check so "Fed raises rates" and "Fed raises rates again"
// from two different providers collapse into one card instead of two.
function isDuplicate(a, b) {
  const na = normalizeTitle(a)
  const nb = normalizeTitle(b)
  if (!na || !nb) return false
  if (na === nb) return true
  const shorter = na.length < nb.length ? na : nb
  const longer = na.length < nb.length ? nb : na
  return longer.includes(shorter) && shorter.length > 20
}

async function fromGNews(category, apiKey) {
  if (!apiKey) return []
  const topic = CATEGORY_MAP[category] || 'general'
  const url = `https://gnews.io/api/v4/top-headlines?category=${topic}&lang=en&max=10&apikey=${apiKey}`
  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()
  return (data.articles || []).map((a) => ({
    title: a.title,
    description: a.description,
    url: a.url,
    source: a.source?.name || 'GNews',
    category,
    publishedAt: a.publishedAt,
    provider: 'gnews'
  }))
}

async function fromNewsData(category, apiKey) {
  if (!apiKey) return []
  const topic = CATEGORY_MAP[category] || 'top'
  const url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&language=en&category=${topic}`
  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()
  return (data.results || []).slice(0, 10).map((a) => ({
    title: a.title,
    description: a.description,
    url: a.link,
    source: a.source_name || a.source_id || 'NewsData',
    category,
    publishedAt: a.pubDate,
    provider: 'newsdata'
  }))
}

async function fromNewsApiOrg(category, apiKey) {
  if (!apiKey) return []
  const topic = CATEGORY_MAP[category] || 'general'
  const url = `https://newsapi.org/v2/top-headlines?category=${topic === 'world' ? 'general' : topic}&language=en&pageSize=10&apiKey=${apiKey}`
  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()
  return (data.articles || []).map((a) => ({
    title: a.title,
    description: a.description,
    url: a.url,
    source: a.source?.name || 'NewsAPI',
    category,
    publishedAt: a.publishedAt,
    provider: 'newsapi'
  }))
}

export async function fetchNews({ categories = ['world', 'business', 'tech', 'science', 'sports', 'entertainment'] }) {
  const keys = {
    gnews: process.env.GNEWS_API_KEY,
    newsdata: process.env.NEWSDATA_API_KEY,
    newsapi: process.env.NEWSAPI_ORG_KEY
  }

  const sourcesUsed = Object.entries(keys)
    .filter(([, v]) => Boolean(v))
    .map(([k]) => k)

  const jobs = categories.flatMap((category) => [
    fromGNews(category, keys.gnews),
    fromNewsData(category, keys.newsdata),
    fromNewsApiOrg(category, keys.newsapi)
  ])

  const settled = await Promise.allSettled(jobs)
  const raw = settled.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))

  const merged = []
  for (const article of raw) {
    if (!article.title || article.title === '[Removed]') continue
    const dupe = merged.find((m) => isDuplicate(m.title, article.title))
    if (!dupe) merged.push(article)
  }

  merged.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))

  return { articles: merged, sourcesUsed }
}
