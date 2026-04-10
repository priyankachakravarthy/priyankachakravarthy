import FadeIn from '../components/FadeIn'
import { data } from '../data'

export default function Experience() {
  return (
    <section id="experience" style={{ padding: '72px 0' }}>
      <div className="container" style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1.75rem' }}>
        <FadeIn><p className="section-tag">Experience</p></FadeIn>

        <FadeIn delay={80}>
          <div className="card card-hover" style={{ padding: '28px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 500, color: 'var(--t1)', lineHeight: 1.2 }}>
                Senior Software Consultant
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--acc2)', background: 'var(--tag-bg)', border: '0.5px solid var(--border)', padding: '4px 10px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                {data.experience[0].period}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--t4)', marginBottom: '18px', letterSpacing: '0.01em' }}>
              <strong style={{ color: 'var(--t3)', fontWeight: 500 }}>{data.experience[0].company}</strong> · {data.experience[0].location}
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {data.experience[0].highlights.map((h, i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: 'var(--t3)', lineHeight: 1.78, fontWeight: 300 }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--acc3)', flexShrink: 0, marginTop: '10px', display: 'block' }} />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>

        <FadeIn delay={160}>
          <div className="card" style={{ padding: '18px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', fontWeight: 500, color: 'var(--t1)' }}>{data.education.degree}</p>
              <p style={{ fontSize: '11px', color: 'var(--t4)', marginTop: '2px' }}>{data.education.institution} · {data.education.location}</p>
            </div>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--acc2)', background: 'var(--tag-bg)', border: '0.5px solid var(--border)', padding: '4px 10px', borderRadius: '6px' }}>
              {data.education.period}
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
