import { data } from '../data'

export default function Footer() {
  return (
    <footer style={{ padding: '28px 1.75rem', borderTop: '0.5px solid var(--border)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', maxWidth: '860px', margin: '0 auto' }}>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--t5)' }}>
        &copy; {new Date().getFullYear()} {data.name} &middot; {data.location}
      </p>
      <div style={{ display: 'flex', gap: '16px' }}>
        <a href={data.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--t5)', textDecoration: 'none' }}>LinkedIn</a>
        <a href={`mailto:${data.email}`} style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--t5)', textDecoration: 'none' }}>Email</a>
      </div>
    </footer>
  )
}
