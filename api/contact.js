// api/contact.js — Vercel Serverless Function
// All secrets stay server-side. Frontend only sends form data.

const RESEND_API_URL = 'https://api.resend.com/emails'

// Simple in-memory rate limiter (resets per serverless instance)
// For production, swap this with Upstash Redis rate limiting
const ipHits = new Map()
const RATE_LIMIT = 3         // max requests
const RATE_WINDOW_MS = 60_000 // per 1 minute

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

// Strip HTML tags and dangerous characters from user input
function sanitise(str, maxLen = 500) {
  if (typeof str !== 'string') return ''
  return str
    .slice(0, maxLen)
    .replace(/<[^>]*>/g, '')           // strip HTML tags
    .replace(/[<>"'`]/g, c => ({       // encode remaining dangerous chars
      '<': '&lt;', '>': '&gt;',
      '"': '&quot;', "'": '&#x27;', '`': '&#x60;',
    }[c]))
    .trim()
}

function isValidEmail(email) {
  return /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(email)
}

export default async function handler(req, res) {
  // ── CORS: only allow your own domain ──────────────────────────────────────
  const origin = req.headers.origin || ''
  const allowedOrigins = [
    'https://priyankachakravarthy.com',
    'https://www.priyankachakravarthy.com',
    ...(process.env.NODE_ENV === 'development' ? ['http://localhost:5173'] : []),
  ]
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')

  // Handle preflight
  if (req.method === 'OPTIONS') return res.status(204).end()

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  // ── Rate limiting ──────────────────────────────────────────────────────────
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown'

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' })
  }

  // ── Parse & validate body ──────────────────────────────────────────────────
  const { name, email, subject, message } = req.body ?? {}

  const cleanName    = sanitise(name, 80)
  const cleanEmail   = sanitise(email, 120)
  const cleanSubject = sanitise(subject, 120)
  const cleanMessage = sanitise(message, 2000)

  if (!cleanName)                      return res.status(400).json({ error: 'Name is required.' })
  if (!cleanEmail || !isValidEmail(cleanEmail)) return res.status(400).json({ error: 'A valid email is required.' })
  if (!cleanMessage || cleanMessage.length < 10) return res.status(400).json({ error: 'Message must be at least 10 characters.' })

  // ── Check env vars exist ───────────────────────────────────────────────────
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL || !process.env.CONTACT_FROM_EMAIL) {
    console.error('Missing required environment variables.')
    return res.status(500).json({ error: 'Server configuration error.' })
  }

  // ── Send email via Resend ──────────────────────────────────────────────────
  const emailPayload = {
    from: `Portfolio Contact <${process.env.CONTACT_FROM_EMAIL}>`,
    to: [process.env.CONTACT_TO_EMAIL],
    reply_to: cleanEmail,
    subject: cleanSubject
      ? `[Portfolio] ${cleanSubject}`
      : `[Portfolio] New message from ${cleanName}`,
    html: `
      <div style="font-family: 'DM Sans', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border: 1px solid #e0e1f1; border-radius: 16px;">
        <div style="margin-bottom: 24px;">
          <div style="display: inline-block; background: linear-gradient(135deg, #3f4099, #7c3aed); border-radius: 10px; padding: 8px 14px;">
            <span style="color: white; font-size: 13px; font-weight: 700; letter-spacing: 0.05em;">PC · Portfolio</span>
          </div>
        </div>
        <h2 style="font-size: 18px; font-weight: 700; color: #0f1040; margin: 0 0 4px;">New message received</h2>
        <p style="font-size: 13px; color: #9a9bd3; margin: 0 0 24px;">via priyankachakravarthy.com</p>
        <hr style="border: none; border-top: 1px solid #e0e1f1; margin: 0 0 20px;" />
        <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #9a9bd3; width: 72px; vertical-align: top;">From</td>
            <td style="padding: 8px 0; color: #1e1f5c; font-weight: 500;">${cleanName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #9a9bd3; vertical-align: top;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${cleanEmail}" style="color: #5254b3;">${cleanEmail}</a></td>
          </tr>
          ${cleanSubject ? `<tr><td style="padding: 8px 0; color: #9a9bd3; vertical-align: top;">Subject</td><td style="padding: 8px 0; color: #1e1f5c;">${cleanSubject}</td></tr>` : ''}
        </table>
        <hr style="border: none; border-top: 1px solid #e0e1f1; margin: 0 0 20px;" />
        <p style="font-size: 14px; color: #2e2f7a; line-height: 1.8; white-space: pre-wrap;">${cleanMessage}</p>
        <hr style="border: none; border-top: 1px solid #e0e1f1; margin: 24px 0 16px;" />
        <p style="font-size: 11px; color: #c2c3e4;">Sent from your portfolio contact form &middot; IP: ${ip.slice(0, 12)}...</p>
      </div>
    `,
  }

  try {
    const resendRes = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    })

    if (!resendRes.ok) {
      const errBody = await resendRes.json().catch(() => ({}))
      console.error('Resend error:', errBody)
      return res.status(502).json({ error: 'Failed to send email. Please try again.' })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Unexpected error:', err)
    return res.status(500).json({ error: 'An unexpected error occurred.' })
  }
}
