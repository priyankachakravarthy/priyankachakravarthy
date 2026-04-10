import FadeIn from '../components/FadeIn'
import { data } from '../data'

export default function Projects() {
  return (
    <section id="projects" style={{ padding: '72px 0', background: 'var(--section-alt)' }}>
      <div className="container" style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1.75rem' }}>
        <FadeIn><p className="section-tag">Projects</p></FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {data.projects.map((p, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div className="card card-hover" style={{ padding: '22px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: 500, color: 'var(--t1)', lineHeight: 1.2 }}>{p.title}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: 'var(--t5)', marginTop: '4px', whiteSpace: 'nowrap' }}>{p.period}</span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--t3)', lineHeight: 1.72, flex: 1, margin: '8px 0 14px', fontWeight: 300 }}>{p.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {p.stack.map(s => (
                    <span key={s} className="tag">{s}</span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
