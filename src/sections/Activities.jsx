import { useState, useRef, useEffect, useCallback } from 'react'
import FadeIn from '../components/FadeIn'

const TYPE_COLORS = {
  Conference: { bg: 'rgba(139,94,60,0.1)',  text: '#8b5e3c', border: 'rgba(139,94,60,0.25)' },
  Summit:     { bg: 'rgba(180,124,82,0.1)', text: '#b87c52', border: 'rgba(180,124,82,0.25)' },
  Workshop:   { bg: 'rgba(92,138,92,0.1)',  text: '#5c8a5c', border: 'rgba(92,138,92,0.25)' },
  Meetup:     { bg: 'rgba(82,110,138,0.1)', text: '#526e8a', border: 'rgba(82,110,138,0.25)' },
  Hackathon:  { bg: 'rgba(160,80,80,0.1)',  text: '#a05050', border: 'rgba(160,80,80,0.25)' },
  Other:      { bg: 'rgba(107,100,90,0.1)', text: '#6b645a', border: 'rgba(107,100,90,0.25)' },
}

const EMPTY_FORM = { title: '', type: 'Conference', date: '', location: '', takeaway: '', tags: '' }

function ActivityCard({ item, isAdmin, onDelete }) {
  const c = TYPE_COLORS[item.type] || TYPE_COLORS.Other
  return (
    <div style={{ flexShrink:0, width:'276px', display:'flex', flexDirection:'column', borderRadius:'14px', padding:'20px', border:'0.5px solid var(--border)', background:'var(--surface)', boxShadow:'var(--card-shadow)', transition:'all .25s', scrollSnapAlign:'start' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'6px' }}>
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', padding:'2px 8px', borderRadius:'999px', border:'0.5px solid', background:c.bg, color:c.text, borderColor:c.border }}>{item.type}</span>
        {isAdmin && <button onClick={() => onDelete(item.id)} style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', color:'#a05050', border:'0.5px solid rgba(160,80,80,0.3)', borderRadius:'999px', padding:'2px 7px', background:'none', cursor:'pointer' }}>remove</button>}
      </div>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'17px', fontWeight:500, color:'var(--t1)', margin:'8px 0 3px', lineHeight:1.25 }}>{item.title}</p>
      <p style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', color:'var(--t5)', marginBottom:'10px' }}>{item.date}{item.location ? ` · ${item.location}` : ''}</p>
      <p style={{ fontSize:'12.5px', color:'var(--t3)', lineHeight:1.72, fontWeight:300, flex:1, marginBottom:'12px' }}>{item.takeaway}</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
        {(item.tags||[]).map(t => <span key={t} style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', padding:'2px 7px', borderRadius:'4px', background:'var(--tag-bg)', border:'0.5px solid var(--tag-border)', color:'var(--tag-text)' }}>{t}</span>)}
      </div>
    </div>
  )
}

function AdminPanel({ onAdd, loading }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [err, setErr]   = useState('')
  const [ok, setOk]     = useState(false)
  const set = (k,v) => setForm(f=>({...f,[k]:v}))
  const inputStyle = { padding:'8px 11px', borderRadius:'8px', border:'0.5px solid var(--border2)', background:'var(--input-bg)', color:'var(--t1)', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'12px', outline:'none', width:'100%' }
  const labelStyle = { fontFamily:"'DM Mono',monospace", fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--acc2)', display:'block', marginBottom:'5px' }

  const handleAdd = async () => {
    if (!form.title.trim()||!form.date.trim()||!form.takeaway.trim()) { setErr('Title, date and takeaway are required.'); return }
    setErr('')
    const tags = form.tags.split(',').map(t=>t.trim()).filter(Boolean)
    const success = await onAdd({...form, tags})
    if (success) { setForm(EMPTY_FORM); setOk(true); setTimeout(()=>setOk(false),2500) }
    else setErr('Failed to save. Try again.')
  }

  return (
    <div style={{ marginTop:'20px', padding:'20px', borderRadius:'14px', border:'0.5px solid var(--border)', background:'var(--surface2)' }}>
      <p style={{...labelStyle, marginBottom:'16px'}}>✦ add activity</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'10px' }}>
        <div><label style={labelStyle}>Title *</label><input value={form.title} onChange={e=>set('title',e.target.value)} placeholder="KubeCon Europe 2026" maxLength={80} style={inputStyle}/></div>
        <div><label style={labelStyle}>Type</label><select value={form.type} onChange={e=>set('type',e.target.value)} style={inputStyle}>{Object.keys(TYPE_COLORS).map(t=><option key={t}>{t}</option>)}</select></div>
        <div><label style={labelStyle}>Date *</label><input value={form.date} onChange={e=>set('date',e.target.value)} placeholder="Apr 2026" maxLength={20} style={inputStyle}/></div>
        <div><label style={labelStyle}>Location</label><input value={form.location} onChange={e=>set('location',e.target.value)} placeholder="Bangalore, IN" maxLength={60} style={inputStyle}/></div>
      </div>
      <div style={{marginBottom:'10px'}}><label style={labelStyle}>Key Takeaway *</label><textarea value={form.takeaway} onChange={e=>set('takeaway',e.target.value)} placeholder="What did you learn?" maxLength={500} rows={3} style={{...inputStyle,resize:'none'}}/></div>
      <div style={{marginBottom:'16px'}}><label style={labelStyle}>Tags (comma separated)</label><input value={form.tags} onChange={e=>set('tags',e.target.value)} placeholder="Kubernetes, eBPF" maxLength={120} style={inputStyle}/></div>
      {err && <p style={{fontFamily:"'DM Mono',monospace",fontSize:'11px',color:'#a05050',marginBottom:'10px'}}>{err}</p>}
      {ok  && <p style={{fontFamily:"'DM Mono',monospace",fontSize:'11px',color:'#5c8a5c',marginBottom:'10px'}}>✓ Saved globally!</p>}
      <button onClick={handleAdd} disabled={loading} className="btn-primary" style={{fontSize:'12px',padding:'8px 18px',borderRadius:'7px',opacity:loading?0.6:1}}>
        {loading ? 'Saving...' : 'Add activity'}
      </button>
    </div>
  )
}

export default function Activities() {
  const [items, setItems]         = useState([])
  const [fetchState, setFetchState] = useState('loading')
  const [isAdmin, setIsAdmin]     = useState(false)
  const [showPin, setShowPin]     = useState(false)
  const [pin, setPin]             = useState('')
  const [pinErr, setPinErr]       = useState('')
  const [apiLoading, setApiLoading] = useState(false)
  const [canLeft, setCanLeft]     = useState(false)
  const [canRight, setCanRight]   = useState(true)
  const scrollRef = useRef(null)

  const fetchActivities = useCallback(async () => {
    setFetchState('loading')
    try {
      const res = await fetch('/api/activities')
      const json = await res.json()
      setItems(json.activities || [])
      setFetchState('ok')
    } catch { setFetchState('error') }
  }, [])

  useEffect(() => { fetchActivities() }, [fetchActivities])

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive:true })
    checkScroll()
    return () => el.removeEventListener('scroll', checkScroll)
  }, [items, checkScroll])

  const scroll = dir => scrollRef.current?.scrollBy({ left:dir*300, behavior:'smooth' })

  const handleUnlock = () => {
    if (!pin.trim()) return
    sessionStorage.setItem('pc_admin_pin', pin)
    setIsAdmin(true); setShowPin(false); setPin(''); setPinErr('')
  }

  const handleLock = () => { setIsAdmin(false); sessionStorage.removeItem('pc_admin_pin') }

  const callApi = async (method, body) => {
    setApiLoading(true)
    try {
      const storedPin = sessionStorage.getItem('pc_admin_pin') || ''
      const res = await fetch('/api/activities', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: storedPin, ...body }),
      })
      const json = await res.json()
      if (res.status === 401) { setPinErr('Session expired. Please re-unlock.'); setIsAdmin(false); return null }
      if (!res.ok) return null
      return json
    } catch { return null }
    finally { setApiLoading(false) }
  }

  const handleAdd = async (formData) => {
    const json = await callApi('POST', formData)
    if (json) { setItems(json.activities); return true }
    return false
  }

  const handleDelete = async (id) => {
    const json = await callApi('DELETE', { id })
    if (json) setItems(json.activities)
  }

  const ArrBtn = ({ dir }) => (
    <button onClick={() => scroll(dir)} disabled={dir===-1 ? !canLeft : !canRight}
      style={{ width:'26px', height:'26px', borderRadius:'50%', border:'0.5px solid var(--border)', background:'var(--surface)', display:'flex', alignItems:'center', justifyContent:'center', cursor:(dir===-1?canLeft:canRight)?'pointer':'default', color:'var(--t3)', opacity:(dir===-1?canLeft:canRight)?1:0.28 }}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d={dir===-1?'M6.5 2L3.5 5l3 3':'M3.5 2l3 3-3 3'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )

  return (
    <section id="activities" style={{ padding:'72px 0' }}>
      <div style={{ maxWidth:'860px', margin:'0 auto', padding:'0 1.75rem' }}>

        <FadeIn>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', marginBottom:'24px' }}>
            <p className="section-tag" style={{ margin:0, flex:1 }}>In the field</p>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
              <button onClick={isAdmin ? handleLock : () => setShowPin(p=>!p)}
                style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'var(--t4)', border:'0.5px solid var(--border)', borderRadius:'999px', padding:'3px 10px', background:'none', cursor:'pointer' }}>
                {isAdmin ? 'lock ✕' : showPin ? 'cancel' : '+ add'}
              </button>
              <ArrBtn dir={-1} /><ArrBtn dir={1} />
            </div>
          </div>
        </FadeIn>

        {showPin && !isAdmin && (
          <FadeIn>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px' }}>
              <input type="password" value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleUnlock()} placeholder="Admin PIN" maxLength={30} autoFocus
                style={{ padding:'8px 12px', borderRadius:'8px', border:'0.5px solid var(--border2)', background:'var(--input-bg)', color:'var(--t1)', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px', outline:'none', maxWidth:'180px' }}/>
              <button onClick={handleUnlock} className="btn-primary" style={{ fontSize:'12px', padding:'7px 16px', borderRadius:'7px' }}>Unlock</button>
              {pinErr && <p style={{ fontFamily:"'DM Mono',monospace", fontSize:'11px', color:'#a05050' }}>{pinErr}</p>}
            </div>
          </FadeIn>
        )}

        <FadeIn delay={100}>
          {fetchState==='loading' && <p style={{ fontFamily:"'DM Mono',monospace", fontSize:'11px', color:'var(--t5)', padding:'24px 0' }}>Loading...</p>}
          {fetchState==='error'   && <p style={{ fontFamily:"'DM Mono',monospace", fontSize:'11px', color:'#a05050', padding:'24px 0' }}>Couldn't load. <button onClick={fetchActivities} style={{ background:'none', border:'none', color:'var(--acc2)', cursor:'pointer', fontFamily:'inherit', fontSize:'inherit', textDecoration:'underline' }}>Retry</button></p>}
          {fetchState==='ok' && (
            <div ref={scrollRef} style={{ display:'flex', gap:'14px', overflowX:'auto', paddingBottom:'12px', scrollSnapType:'x mandatory', scrollbarWidth:'none' }}>
              {items.length===0
                ? <p style={{ fontFamily:"'DM Mono',monospace", fontSize:'11px', color:'var(--t5)', padding:'24px 0' }}>No activities yet.</p>
                : items.map(item => <ActivityCard key={item.id} item={item} isAdmin={isAdmin} onDelete={handleDelete}/>)
              }
            </div>
          )}
        </FadeIn>

        {isAdmin && <AdminPanel onAdd={handleAdd} loading={apiLoading}/>}
      </div>
    </section>
  )
}
