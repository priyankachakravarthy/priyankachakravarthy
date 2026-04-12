// api/activities.js — Vercel Serverless Function
// GET    /api/activities  — public, returns all activities
// POST   /api/activities  — PIN-protected, adds an activity
// DELETE /api/activities  — PIN-protected, removes an activity by id
// Storage: Upstash Redis (free tier at upstash.com)

import { Redis } from '@upstash/redis'

const REDIS_KEY = 'pc_activities'
const RATE_WINDOW_MS = 60_000
const RATE_LIMIT = 10
const ipHits = new Map()

const SEED = [
  {
    id: 1,
    title: 'KubeCon Europe 2025',
    type: 'Conference',
    date: 'Mar 2025',
    location: 'London, UK',
    takeaway: "Deep-dived into eBPF-based observability. Cilium's approach to kernel-level networking is reshaping how teams think about service mesh without the sidecar overhead.",
    tags: ['Kubernetes', 'eBPF', 'Cloud Native'],
  },
  {
    id: 2,
    title: 'Kafka Summit Bangalore',
    type: 'Summit',
    date: 'Jan 2025',
    location: 'Bangalore, IN',
    takeaway: "Explored Kafka's tiered storage and how teams at scale solve the retention vs cost tradeoff. Key insight: partition strategy early saves enormous pain later.",
    tags: ['Kafka', 'Event Streaming', 'Architecture'],
  },
  {
    id: 3,
    title: 'Microsoft Build 2024',
    type: 'Conference',
    date: 'Nov 2024',
    location: 'Online',
    takeaway: 'Azure Container Apps has matured significantly. The new Dapr integrations simplify distributed app patterns that used to require significant boilerplate.',
    tags: ['Azure', 'Dapr', 'Microservices'],
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────
function isRateLimited(ip) {
  const now = Date.now()
  const entry = ipHits.get(ip)
  if (!entry || now - entry.firstHit > RATE_WINDOW_MS) {
    ipHits.set(ip, { count: 1, firstHit: now })
    return false
  }
  if (entry.count >= RATE_LIMIT) return true
  entry.count++
  return false
}

async function verifyPin(pin) {
  if (!pin || typeof pin !== 'string') return false
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(pin + 'pc_salt_2026')
  )
  const hash = Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  return hash === process.env.ACTIVITIES_PIN_HASH
}

function sanitise(str, max = 500) {
  if (typeof str !== 'string') return ''
  return str.slice(0, max).replace(/<[^>]*>/g, '').trim()
}

// ── Handler ───────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  const origin = req.headers.origin || ''
  const allowed = [
    'https://priyankachakravarthy.com',
    'https://www.priyankachakravarthy.com',
    ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:5173'] : []),
  ]
  if (allowed.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') return res.status(204).end()

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown'

  // Initialise Upstash Redis client from env vars
  let redis
  try {
    redis = new Redis({
      url:   process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  } catch (err) {
    console.error('Redis init error:', err)
    // Fall back gracefully — return seed data on GET, error on writes
    if (req.method === 'GET') return res.status(200).json({ activities: SEED })
    return res.status(500).json({ error: 'Storage unavailable.' })
  }

  // ── GET — public ──────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const stored = await redis.get(REDIS_KEY)
      const activities = stored ?? SEED
      res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30')
      return res.status(200).json({ activities })
    } catch (err) {
      console.error('Redis GET error:', err)
      return res.status(200).json({ activities: SEED })
    }
  }

  // ── POST & DELETE — PIN-protected ─────────────────────────────────────────
  if (req.method === 'POST' || req.method === 'DELETE') {
    if (isRateLimited(ip)) {
      return res.status(429).json({ error: 'Too many requests. Wait a minute.' })
    }

    const { pin, ...payload } = req.body ?? {}

    const pinOk = await verifyPin(pin)
    if (!pinOk) {
      return res.status(401).json({ error: 'Unauthorised.' })
    }

    try {
      const stored = await redis.get(REDIS_KEY)
      let activities = stored ?? SEED

      if (req.method === 'POST') {
        const { title, type, date, location, takeaway, tags } = payload
        if (!sanitise(title) || !sanitise(date) || !sanitise(takeaway)) {
          return res.status(400).json({ error: 'Title, date and takeaway are required.' })
        }
        const newItem = {
          id:       Date.now(),
          title:    sanitise(title, 80),
          type:     sanitise(type, 30),
          date:     sanitise(date, 20),
          location: sanitise(location, 60),
          takeaway: sanitise(takeaway, 500),
          tags: Array.isArray(tags)
            ? tags.map(t => sanitise(t, 30)).filter(Boolean).slice(0, 6)
            : [],
        }
        activities = [newItem, ...activities]
        await redis.set(REDIS_KEY, activities)
        return res.status(200).json({ success: true, activities })
      }

      if (req.method === 'DELETE') {
        const { id } = payload
        if (!id) return res.status(400).json({ error: 'id is required.' })
        activities = activities.filter(a => a.id !== id)
        await redis.set(REDIS_KEY, activities)
        return res.status(200).json({ success: true, activities })
      }
    } catch (err) {
      console.error('Redis write error:', err)
      return res.status(500).json({ error: 'Storage error. Try again.' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed.' })
}