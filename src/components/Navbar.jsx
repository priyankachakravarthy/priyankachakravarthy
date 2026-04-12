import { useState, useEffect } from 'react'
import { useTheme } from '../ThemeContext'

const links = [
  { label: 'Projects',      href: '#projects' },
  { label: 'Experience',    href: '#experience' },
  { label: 'Skills',        href: '#skills' },
  { label: 'Certifications',href: '#certifications' },
  { label: 'Activities',    href: '#activities' },
  { label: 'Contact',       href: '#contact' },
]

function ThemeSwitch() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button onClick={toggle} aria-label="Toggle dark mode"
      className="flex items-center gap-1.5 cursor-pointer bg-transparent border-0 p-0">
      <span style={{ fontSize: '12px' }}>☀️</span>
      <div className="relative w-9 h-[22px] rounded-full border transition-all duration-300 flex-shrink-0"
        style={{ background: isDark ? '#7a6450' : 'var(--switch-track)', borderColor: 'var(--border2)' }}>
        <div className="absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white transition-transform duration-300"
          style={{ transform: isDark ? 'translateX(16px)' : 'translateX(0)', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
      </div>
      <span style={{ fontSize: '12px' }}>🌙</span>
    </button>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const { theme }               = useTheme()
  const isDark                  = theme === 'dark'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '0.5px solid var(--border)' : 'none',
      }}>
      <nav className="max-w-4xl mx-auto px-7 h-[52px] flex items-center justify-between">
        <a href="#hero" className="font-display font-medium italic text-lg"
          style={{ color: 'var(--t1)', textDecoration: 'none', letterSpacing: '0.01em' }}>
          PC
        </a>
        <div className="hidden md:flex items-center gap-7">
          <ul className="flex gap-6 list-none">
            {links.map(l => (
              <li key={l.href}>
                <a href={l.href} className="font-body text-xs transition-colors duration-150"
                  style={{ color: 'var(--t4)', textDecoration: 'none', letterSpacing: '0.02em' }}
                  onMouseEnter={e => e.target.style.color = 'var(--t1)'}
                  onMouseLeave={e => e.target.style.color = 'var(--t4)'}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeSwitch />
        </div>
        <div className="md:hidden flex items-center gap-3">
          <ThemeSwitch />
          <button className="flex flex-col gap-1.5 p-1 bg-transparent border-0 cursor-pointer"
            onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
            {[0,1,2].map(i => (
              <span key={i} className="block w-5 h-px transition-all"
                style={{ background: 'var(--t2)',
                  transform: open ? (i===0?'rotate(45deg) translateY(8px)':i===2?'rotate(-45deg) translateY(-8px)':'') : '',
                  opacity: open && i===1 ? 0 : 1 }} />
            ))}
          </button>
        </div>
      </nav>
      {open && (
        <div className="md:hidden border-b px-7 py-4"
          style={{ background: isDark ? 'rgba(14,12,10,0.96)' : 'rgba(250,249,247,0.97)', backdropFilter: 'blur(16px)', borderColor: 'var(--border)' }}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block font-body text-sm py-2.5 border-b last:border-0"
              style={{ color: 'var(--t3)', borderColor: 'var(--border)', textDecoration: 'none' }}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
