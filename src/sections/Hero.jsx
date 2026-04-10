import { data } from '../data'

export default function Hero() {
  return (
    <section id="hero" className="flex flex-col justify-center px-7 pt-20 pb-14 max-w-4xl mx-auto relative"
      style={{ minHeight: 'calc(100vh - 52px)' }}>

      {/* Hero name — Cormorant Garamond, luxury feel */}
      <h1
        className="font-display font-light mb-7"
        style={{
          fontSize: 'clamp(3.8rem, 10vw, 7.5rem)',
          lineHeight: 1,
          letterSpacing: '-0.01em',
          animation: 'fadeUp 0.7s ease both',
        }}
      >
        <em
          className="not-italic block"
          style={{
            fontStyle: 'italic',
            background: 'var(--grad-text)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'block',
            paddingBottom: '0.15em',
            overflow: 'visible',
          }}
        >
          Priyanka
        </em>
        <span className="block" style={{ color: 'var(--t1)' }}>Chakravarthy</span>
      </h1>

      {/* Bio with copper left border — no role/workplace mention */}
      <p
        className="font-body font-light text-base leading-loose max-w-md mb-8 pl-4"
        style={{
          color: 'var(--t3)',
          borderLeft: '2px solid var(--acc3)',
          animation: 'fadeUp 0.7s ease 150ms both',
        }}
      >
        {data.bio}
      </p>

      {/* CTAs */}
      <div
        className="flex flex-wrap gap-3"
        style={{ animation: 'fadeUp 0.7s ease 280ms both' }}
      >
        <a href="#contact" className="btn-primary">
          Get in touch
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost">
          LinkedIn
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 9L9 2M2.5 2H9v6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <a href={`mailto:${data.email}`} className="btn-ghost">Email me</a>
      </div>

      {/* Scroll indicator */}
      <div className="mt-14" style={{ animation: 'fadeIn 1s ease 700ms both' }}>
        <span className="font-mono text-xs block mb-1" style={{ color: 'var(--t6)' }}>scroll</span>
        <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, var(--t5), transparent)', marginLeft: '3px' }} />
      </div>
    </section>
  )
}
