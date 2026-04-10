import { useState } from 'react'
import FadeIn from '../components/FadeIn'
import { data } from '../data'

const INITIAL = { name: '', email: '', subject: '', message: '' }

function validate(form) {
  if (!form.name.trim()) return 'Please enter your name.'
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email.'
  if (!form.message.trim() || form.message.trim().length < 10) return 'Message must be at least 10 characters.'
  return null
}

export default function Contact() {
  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState('idle')
  const [errMsg, setErrMsg] = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    const err = validate(form)
    if (err) { setErrMsg(err); setStatus('error'); return }
    setStatus('loading'); setErrMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), subject: form.subject.trim(), message: form.message.trim() }),
      })
      const json = await res.json()
      if (res.ok) { setStatus('success'); setForm(INITIAL) }
      else { setStatus('error'); setErrMsg(json.error || 'Something went wrong.') }
    } catch {
      setStatus('error'); setErrMsg('Network error. Please email me directly.')
    }
  }

  const inputStyle = {
    width: '100%', padding: '9px 13px', borderRadius: '8px',
    border: '0.5px solid var(--border)', background: 'var(--input-bg)',
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '12px',
    color: 'var(--t1)', outline: 'none',
  }
  const labelStyle = { fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--acc2)', display: 'block', marginBottom: '5px' }

  return (
    <section id="contact" style={{ padding: '72px 0' }}>
      <div className="container" style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1.75rem' }}>
        <FadeIn><p className="section-tag">Contact</p></FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '44px', alignItems: 'start' }}>

          <FadeIn delay={80}>
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, lineHeight: 1.1, color: 'var(--t1)', marginBottom: '14px', letterSpacing: '-0.01em' }}>
                Let's build<br />
                <em style={{ fontStyle: 'italic', background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  something great.
                </em>
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--t3)', lineHeight: 1.82, marginBottom: '24px', fontWeight: 300 }}>
                Open to new opportunities, collaborations, and interesting conversations. I usually reply within a day.
              </p>
              {[
                { href: `mailto:${data.email}`, text: data.email, icon: 'M1 3.5h11v7H1v-7zm0 0l5.5 4 5.5-4' },
                { href: data.linkedin, text: 'linkedin.com/in/priyankac-work', icon: null, isLinkedin: true },
              ].map((link, i) => (
                <a key={i} href={link.href} target={link.isLinkedin ? '_blank' : undefined} rel={link.isLinkedin ? 'noopener noreferrer' : undefined}
                  style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '9px', textDecoration: 'none' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: 'var(--tag-bg)', border: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      {link.isLinkedin
                        ? <><rect x="1" y="1" width="11" height="11" rx="2" stroke="var(--acc2)" strokeWidth="1.2"/><path d="M4 6v4M4 4v.01M6.5 10V7.5a1.5 1.5 0 013 0V10M6.5 7v3" stroke="var(--acc2)" strokeWidth="1.2" strokeLinecap="round"/></>
                        : <path d={link.icon} stroke="var(--acc2)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      }
                    </svg>
                  </div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--t3)' }}>{link.text}</span>
                </a>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={160}>
            <form onSubmit={handleSubmit} noValidate className="card" style={{ padding: '22px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div><label style={labelStyle}>Name *</label><input name="name" value={form.name} onChange={handleChange} placeholder="Your name" maxLength={80} style={inputStyle} /></div>
                <div><label style={labelStyle}>Email *</label><input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" maxLength={120} style={inputStyle} /></div>
              </div>
              <div style={{ marginBottom: '10px' }}><label style={labelStyle}>Subject</label><input name="subject" value={form.subject} onChange={handleChange} placeholder="Opportunity at..." maxLength={120} style={inputStyle} /></div>
              <div style={{ marginBottom: '4px' }}><label style={labelStyle}>Message *</label><textarea name="message" value={form.message} onChange={handleChange} placeholder="Hi Priyanka, I'd love to..." maxLength={2000} rows={5} style={{ ...inputStyle, resize: 'none' }} /></div>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: 'var(--t6)', textAlign: 'right', marginBottom: '12px' }}>{form.message.length} / 2000</p>

              {status === 'error' && <p style={{ fontSize: '12px', color: '#a05050', marginBottom: '10px', fontFamily: "'DM Mono', monospace" }}>{errMsg}</p>}
              {status === 'success' && <p style={{ fontSize: '12px', color: '#5c8a5c', marginBottom: '10px', fontFamily: "'DM Mono', monospace" }}>✓ Sent! I'll be in touch soon.</p>}

              <button type="submit" disabled={status === 'loading'} className="btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: status === 'loading' ? 0.6 : 1 }}>
                {status === 'loading' ? 'Sending...' : 'Send message'}
              </button>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
