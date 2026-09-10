# Doomscroll, but funnier

News headlines, pulled live from three free news APIs, rewritten as meme-style
one-liners by a free LLM. No database — everything lives in memory for the
length of a page load.

## How it's built

- **Frontend:** React + Vite, Tailwind for styling. Single-page feed, no routing.
- **Backend:** Vercel serverless functions in `/api`, so your API keys never
  reach the browser.
  - `GET /api/feed?category=world` — fetches headlines from whichever of
    GNews, NewsData.io and NewsAPI.org have keys configured, merges and
    de-duplicates them, then sends the batch to Groq's free LLM API in one
    call to get a caption + "tone" per headline.
  - `POST /api/remix` — regenerates a single caption (the "Try another angle"
    button on each card).
- **No database:** headlines and captions are fetched fresh on each page load
  / refresh and kept only in React state.

## 1. Get free API keys

You only need **one** news key to get something on screen; add more for a
richer, more deduplicated feed. All of these have a free tier with no credit
card required:

| Service | Free tier | Get a key |
|---|---|---|
| GNews | 100 requests/day | https://gnews.io/register |
| NewsData.io | 200 requests/day | https://newsdata.io/register |
| NewsAPI.org | 100 requests/day (dev use) | https://newsapi.org/register |
| Groq (captions) | generous free tier, fast | https://console.groq.com/keys |

## 2. Local setup

```bash
npm install
cp .env.example .env.local
# paste your keys into .env.local
```

The `/api` functions need Vercel's dev server to run (plain `vite` alone
won't execute them):

```bash
npm install -g vercel   # one-time
vercel dev
```

This serves the Vite app **and** the `/api/*` functions together, reading
`.env.local` automatically.

## 3. Deploy to Vercel

```bash
vercel
```

Then, in the Vercel dashboard, go to **Project → Settings → Environment
Variables** and add the same four keys from `.env.example`. Redeploy after
adding them (`vercel --prod`).

Vercel auto-detects the Vite framework and the `/api` folder — no extra
config needed beyond the env vars.

## Notes

- If a news provider's key is missing, that provider is silently skipped —
  the app works fine with just one.
- Captions are generated server-side per request, so nothing is cached or
  stored; refreshing the feed re-generates everything.
- `llama-3.3-70b-versatile` is the default Groq model in `api/_lib/caption.js`
  — swap it for any other Groq-hosted model if you prefer.
