import { useState, useRef, useEffect } from 'react'
import FadeIn from '../components/FadeIn'

// ── SEED DATA — edit this array to pre-populate activities ──────────────────
const SEED_ACTIVITIES = [
  {
    id: 1,
    title: 'KubeCon Europe 2025',
    type: 'Conference',
    date: 'Mar 2025',
    location: 'London, UK',
    takeaway: 'Deep-dived into eBPF-based observability. Cilium\'s approach to kernel-level networking is reshaping how teams think about service mesh without the sidecar overhead.',
    tags: ['Kubernetes', 'eBPF', 'Cloud Native'],
  },
  {
    id: 2,
    title: 'Kafka Summit Bangalore',
    type: 'Summit',
    date: 'Jan 2025',
    location: 'Bangalore, IN',
    takeaway: 'Explored Kafka\'s tiered storage architecture and how teams at scale are solving the retention vs. cost tradeoff. Key insight: partition strategy early saves enormous pain later.',
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

const TYPE_COLORS = {
  Conference: { bg: 'rgba(82,84,179,0.1)', text: '#5254b3', border: 'rgba(82,84,179,0.2)' },
  Summit:     { bg: 'rgba(124,58,237,0.1)', text: '#7c3aed', border: 'rgba(124,58,237,0.2)' },
  Workshop:   { bg: 'rgba(16,185,129,0.1)', text: '#059669', border: 'rgba(16,185,129,0.2)' },
  Meetup:     { bg: 'rgba(245,158,11,0.1)', text: '#d97706', border: 'rgba(245,158,11,0.2)' },
  Hackathon:  { bg: 'rgba(239,68,68,0.1)',  text: '#dc2626', border: 'rgba(239,68,68,0.2)' },
  Other:      { bg: 'rgba(107,114,128,0.1)', text: '#6b7280', border: 'rgba(107,114,128,0.2)' },
}

const STORAGE_KEY = 'pc_activities'
const ADMIN_HASH  = 'pc_admin_unlocked'

// Simple hash — not cryptographic, just enough to obscure from casual inspection
async function hashPin(pin) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pin + 'pc_salt_2026'))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

const CORRECT_HASH = import.meta.env.VITE_LOGIN_HASH;

async function checkPin(pin) {
  const h = await hashPin(pin)
  // For setup: log h and replace CORRECT_HASH above with it
  // console.log('Your hash:', h)
  return h === CORRECT_HASH
}

function loadActivities() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : SEED_ACTIVITIES
  } catch { return SEED_ACTIVITIES }
}

function saveActivities(items) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch {}
}

const EMPTY_FORM = { title: '', type: 'Conference', date: '', location: '', takeaway: '', tags: '' }

// ── CARD ────────────────────────────────────────────────────────────────────
function ActivityCard({ item, isAdmin, onDelete }) {
  const colors = TYPE_COLORS[item.type] || TYPE_COLORS.Other
  return (
    <div
      className="flex-shrink-0 w-72 sm:w-80 flex flex-col rounded-2xl border p-5 transition-all duration-300"
      style={{
        background: 'var(--act-card-bg)',
        borderColor: 'var(--act-card-border)',
        boxShadow: 'var(--act-card-shadow)',
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span
          className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border"
          style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
        >
          {item.type}
        </span>
        {isAdmin && (
          <button
            onClick={() => onDelete(item.id)}
            className="text-[10px] font-mono text-red-400 hover:text-red-600 transition-colors border border-red-200 hover:border-red-400 px-2 py-0.5 rounded-full"
          >
            remove
          </button>
        )}
      </div>

      {/* Title */}
      <h3 className="font-display font-bold text-base leading-snug mb-1" style={{ color: 'var(--act-title)' }}>
        {item.title}
      </h3>

      {/* Meta */}
      <p className="font-mono text-[11px] mb-3" style={{ color: 'var(--act-meta)' }}>
        {item.date}{item.location ? ` · ${item.location}` : ''}
      </p>

      {/* Takeaway */}
      <p className="text-[13px] leading-relaxed flex-1 mb-4" style={{ color: 'var(--act-body)', fontWeight: 300 }}>
        {item.takeaway}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {(item.tags || []).map(t => (
          <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded-md" style={{ background: 'var(--act-tag-bg)', color: 'var(--act-tag-text)', border: '0.5px solid var(--act-tag-border)' }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleAdd = () => {
    if (!form.title.trim() || !form.takeaway.trim() || !form.date.trim()) {
      setError('Title, date and takeaway are required.')
      return
    }
    setError('')
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
    onAdd({ ...form, tags, id: Date.now() })
    setForm(EMPTY_FORM)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
  }

  return (
    <div
      className="mt-6 rounded-2xl border p-5"
      style={{ background: 'var(--act-admin-bg)', borderColor: 'var(--act-admin-border)' }}
    >
      <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: 'var(--act-meta)' }}>
        ✦ Admin — add activity
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--act-meta)' }}>Title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="KubeCon Europe 2026"
            className="act-input" maxLength={80} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--act-meta)' }}>Type</label>
          <select value={form.type} onChange={e => set('type', e.target.value)} className="act-input">
            {Object.keys(TYPE_COLORS).map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--act-meta)' }}>Date * (e.g. Mar 2026)</label>
          <input value={form.date} onChange={e => set('date', e.target.value)} placeholder="Mar 2026"
            className="act-input" maxLength={20} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--act-meta)' }}>Location</label>
          <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Bangalore, IN"
            className="act-input" maxLength={60} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mb-3">
        <label className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--act-meta)' }}>Key Takeaway *</label>
        <textarea value={form.takeaway} onChange={e => set('takeaway', e.target.value)} placeholder="What did you learn or take away?"
          className="act-input resize-none" rows={3} maxLength={500} />
      </div>

      <div className="flex flex-col gap-1.5 mb-4">
        <label className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--act-meta)' }}>Tags (comma separated)</label>
        <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Kubernetes, eBPF, Cloud Native"
          className="act-input" maxLength={120} />
      </div>

      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
      {success && <p className="text-xs text-green-500 mb-3 font-mono">✓ Activity added!</p>}

      <button onClick={handleAdd} className="btn-primary text-sm py-2 px-5">
        Add activity
      </button>
    </div>
  )
}

// ── MAIN SECTION ─────────────────────────────────────────────────────────────
export default function Activities() {
  const [items, setItems] = useState(loadActivities)
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(ADMIN_HASH) === '1')
  const [showPin, setShowPin] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [checking, setChecking] = useState(false)
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (el) { el.addEventListener('scroll', checkScroll, { passive: true }); checkScroll() }
    return () => el?.removeEventListener('scroll', checkScroll)
  }, [items])

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  const handleUnlock = async () => {
    setChecking(true)
    setPinError('')
    const ok = await checkPin(pin)
    setChecking(false)
    if (ok) {
      setIsAdmin(true)
      sessionStorage.setItem(ADMIN_HASH, '1')
      setShowPin(false)
      setPin('')
    } else {
      setPinError('Incorrect PIN. Try again.')
    }
  }

  const handleAdd = (item) => {
    const next = [item, ...items]
    setItems(next)
    saveActivities(next)
  }

  const handleDelete = (id) => {
    const next = items.filter(i => i.id !== id)
    setItems(next)
    saveActivities(next)
  }

  const handleLock = () => {
    setIsAdmin(false)
    sessionStorage.removeItem(ADMIN_HASH)
  }

  return (
    <>
      {/* Scoped CSS for this section */}
      <style>{`
        :root {
          --act-card-bg: rgba(255,255,255,0.7);
          --act-card-border: rgba(194,195,228,0.55);
          --act-card-shadow: 0 2px 16px rgba(80,84,179,0.06);
          --act-title: #0f1040;
          --act-meta: #9a9bd3;
          --act-body: #3f4099;
          --act-tag-bg: rgba(255,255,255,0.9);
          --act-tag-text: #5254b3;
          --act-tag-border: rgba(194,195,228,0.6);
          --act-admin-bg: rgba(240,242,255,0.6);
          --act-admin-border: rgba(194,195,228,0.5);
          --act-input-bg: rgba(255,255,255,0.8);
          --act-input-border: rgba(194,195,228,0.7);
          --act-input-text: #0f1040;
        }
        [data-theme="dark"] {
          --act-card-bg: rgba(255,255,255,0.04);
          --act-card-border: rgba(255,255,255,0.08);
          --act-card-shadow: 0 2px 16px rgba(0,0,0,0.3);
          --act-title: #eeeeff;
          --act-meta: #5254b3;
          --act-body: #9a9bd3;
          --act-tag-bg: rgba(255,255,255,0.05);
          --act-tag-text: #7273c0;
          --act-tag-border: rgba(255,255,255,0.08);
          --act-admin-bg: rgba(255,255,255,0.03);
          --act-admin-border: rgba(255,255,255,0.07);
          --act-input-bg: rgba(255,255,255,0.05);
          --act-input-border: rgba(255,255,255,0.1);
          --act-input-text: #eeeeff;
        }
        .act-input {
          padding: 8px 12px;
          border-radius: 10px;
          border: 0.5px solid var(--act-input-border);
          background: var(--act-input-bg);
          color: var(--act-input-text);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          outline: none;
          width: 100%;
          transition: border-color 0.2s;
        }
        .act-input:focus { border-color: #5254b3; }
        .act-input::placeholder { color: #9a9bd3; }
        .scroll-track::-webkit-scrollbar { display: none; }
        .scroll-track { scrollbar-width: none; }
      `}</style>

      <section id="activities" style={{ padding: '72px 0' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1.75rem' }}>
          <FadeIn>
            <div className="flex items-center justify-between gap-4 mb-8">
              <p className="section-tag" style={{ margin: 0, flex: 1 }}>In the field</p>

              {/* Admin controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {isAdmin ? (
                  <button onClick={handleLock}
                    className="font-mono text-[10px] px-2.5 py-1 rounded-full border transition-colors"
                    style={{ color: 'var(--act-meta)', borderColor: 'var(--act-card-border)' }}>
                    lock ✕
                  </button>
                ) : (
                  <button onClick={() => setShowPin(p => !p)}
                    className="font-mono text-[10px] px-2.5 py-1 rounded-full border transition-colors"
                    style={{ color: 'var(--act-meta)', borderColor: 'var(--act-card-border)' }}>
                    {showPin ? 'cancel' : '+ add'}
                  </button>
                )}

                {/* Scroll arrows */}
                <button onClick={() => scroll(-1)} disabled={!canScrollLeft}
                  className="w-7 h-7 rounded-full border flex items-center justify-center transition-all"
                  style={{
                    background: 'var(--act-card-bg)', borderColor: 'var(--act-card-border)',
                    opacity: canScrollLeft ? 1 : 0.3,
                  }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M7.5 2.5L4.5 6l3 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button onClick={() => scroll(1)} disabled={!canScrollRight}
                  className="w-7 h-7 rounded-full border flex items-center justify-center transition-all"
                  style={{
                    background: 'var(--act-card-bg)', borderColor: 'var(--act-card-border)',
                    opacity: canScrollRight ? 1 : 0.3,
                  }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M4.5 2.5l3 3.5-3 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </FadeIn>

          {/* PIN entry */}
          {showPin && !isAdmin && (
            <FadeIn>
              <div className="mb-5 flex items-center gap-3">
                <input
                  type="password"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleUnlock()}
                  placeholder="Enter admin PIN"
                  maxLength={20}
                  className="act-input"
                  style={{ maxWidth: '200px' }}
                  autoFocus
                />
                <button onClick={handleUnlock} disabled={checking} className="btn-primary py-2 px-4 text-sm">
                  {checking ? '...' : 'Unlock'}
                </button>
                {pinError && <p className="text-xs text-red-400 font-mono">{pinError}</p>}
              </div>
            </FadeIn>
          )}

          {/* Horizontal scroll track */}
          <FadeIn delay={100}>
            <div
              ref={scrollRef}
              className="scroll-track flex gap-4 overflow-x-auto pb-4"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {items.length === 0 ? (
                <p className="font-mono text-sm py-8" style={{ color: 'var(--act-meta)' }}>
                  No activities yet. Unlock admin to add some!
                </p>
              ) : (
                items.map(item => (
                  <div key={item.id} style={{ scrollSnapAlign: 'start' }}>
                    <ActivityCard item={item} isAdmin={isAdmin} onDelete={handleDelete} />
                  </div>
                ))
              )}
            </div>
          </FadeIn>

          {/* Admin add form */}
          {isAdmin && <AdminPanel onAdd={handleAdd} />}
        </div>
      </section>
    </>
  )
}
