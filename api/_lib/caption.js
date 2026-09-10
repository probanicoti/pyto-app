// Groq (https://console.groq.com) has a free tier and an OpenAI-compatible
// chat completions endpoint, so no extra SDK is needed — plain fetch works.

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

export const TONES = ['deadpan', 'unhinged', 'wholesome', 'ominous', 'petty']

const SYSTEM_PROMPT = `You are a caption writer for a satirical news site. For each headline you \
receive, write one short, punchy meme-style caption reacting to it — the kind of line that would \
go under a reaction image. Be witty and a little irreverent, never cruel, never punch down at \
victims of tragedy, and never invent facts not implied by the headline. Max 16 words per caption. \
Pick a "tone" for each from exactly this list: ${TONES.join(', ')}.
Respond with ONLY a JSON array, one object per headline, in the same order you received them:
[{"caption": "...", "tone": "..."}]
No markdown, no commentary, no code fences.`

function extractJson(text) {
  const start = text.indexOf('[')
  const end = text.lastIndexOf(']')
  if (start === -1 || end === -1) throw new Error('No JSON array in model response')
  return JSON.parse(text.slice(start, end + 1))
}

async function callGroq(messages, { temperature = 0.9 } = {}) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY is not configured')

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature,
      max_tokens: 1024
    })
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Groq API error ${res.status}: ${body}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || ''
}

export async function captionHeadlines(articles) {
  if (articles.length === 0) return []

  const list = articles
    .map((a, i) => `${i + 1}. ${a.title}${a.description ? ` — ${a.description}` : ''}`)
    .join('\n')

  const content = await callGroq([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: list }
  ])

  let parsed
  try {
    parsed = extractJson(content)
  } catch {
    // Fall back to a flat tone if the model didn't return clean JSON,
    // so the feed still renders instead of erroring out.
    parsed = articles.map(() => ({ caption: null, tone: 'deadpan' }))
  }

  return articles.map((a, i) => ({
    caption: parsed[i]?.caption || null,
    tone: TONES.includes(parsed[i]?.tone) ? parsed[i].tone : 'deadpan'
  }))
}

export async function captionOne(article) {
  const content = await callGroq(
    [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `1. ${article.title}${article.description ? ` — ${article.description}` : ''}` }
    ],
    { temperature: 1.05 }
  )
  try {
    const [first] = extractJson(content)
    return {
      caption: first?.caption || 'Even the AI is speechless.',
      tone: TONES.includes(first?.tone) ? first.tone : 'deadpan'
    }
  } catch {
    return { caption: 'Even the AI is speechless.', tone: 'deadpan' }
  }
}
