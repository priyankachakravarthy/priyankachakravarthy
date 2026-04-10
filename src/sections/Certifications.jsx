import FadeIn from '../components/FadeIn'
import { data } from '../data'

export default function Certifications() {
  return (
    <section id="certifications" style={{ padding: '72px 0', background: 'var(--section-alt)' }}>
      <div className="container" style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1.75rem' }}>
        <FadeIn><p className="section-tag">Certifications</p></FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
          {data.certifications.map((cert, i) => (
            <FadeIn key={i} delay={i * 70}>
              <div className="card card-hover" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--grad)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono', monospace", fontSize: '10px', color: '#fff', flexShrink: 0 }}>
                  {cert.name.startsWith('Microsoft') ? 'AZ' : 'SF'}
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 400, color: 'var(--t1)', lineHeight: 1.4 }}>{cert.name}</p>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--acc2)', marginTop: '2px' }}>{cert.year}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
