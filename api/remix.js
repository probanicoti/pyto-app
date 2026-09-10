import { captionOne } from './_lib/caption.js'

export const config = { runtime: 'nodejs' }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { title, description } = req.body || {}
    if (!title) {
      res.status(400).json({ error: 'title is required' })
      return
    }
    const result = await captionOne({ title, description })
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message || 'Something broke.' })
  }
}
