import FadeIn from '../components/FadeIn'
import { data } from '../data'

export default function Skills() {
  return (
    <section id="skills" style={{ padding: '72px 0' }}>
      <div className="container" style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1.75rem' }}>
        <FadeIn><p className="section-tag">Skills</p></FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {data.skills.map((group, i) => (
            <FadeIn key={i} delay={i * 55}>
              <div className="card" style={{ padding: '16px 18px' }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--acc2)', marginBottom: '10px' }}>{group.label}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {group.items.map(item => (
                    <span key={item} style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '6px', background: 'var(--tag-bg)', border: '0.5px solid var(--border)', color: 'var(--t3)', transition: 'all .15s' }}>
                      {item}
                    </span>
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
