import { fetchNews } from './_lib/fetchNews.js'
import { captionHeadlines } from './_lib/caption.js'

export const config = { runtime: 'nodejs' }

function pickId(article, index) {
  return `${article.provider}-${index}-${(article.title || '').slice(0, 24)}`
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const categoryParam = req.query.category
    const categories =
      categoryParam && categoryParam !== 'all'
        ? [categoryParam]
        : ['world', 'business', 'tech', 'science', 'sports', 'entertainment']

    const limit = Math.min(Number(req.query.limit) || 14, 24)

    const { articles, sourcesUsed } = await fetchNews({ categories })

    if (articles.length === 0) {
      res.status(200).json({
        articles: [],
        sourcesUsed,
        generatedAt: new Date().toISOString(),
        warning:
          sourcesUsed.length === 0
            ? 'No news API keys are configured on the server.'
            : 'No headlines came back from the configured providers.'
      })
      return
    }

    const selected = articles.slice(0, limit)
    const captions = await captionHeadlines(selected)

    const results = selected.map((article, i) => ({
      id: pickId(article, i),
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source,
      category: article.category,
      publishedAt: article.publishedAt,
      caption: captions[i]?.caption,
      tone: captions[i]?.tone || 'deadpan'
    }))

    res.status(200).json({
      articles: results,
      sourcesUsed,
      generatedAt: new Date().toISOString()
    })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Something broke.' })
  }
}
