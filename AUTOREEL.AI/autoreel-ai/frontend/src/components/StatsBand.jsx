import { useEffect, useRef, useState } from 'react'

function useCountUp(target, duration = 1800, active = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, active])
  return count
}

const STATS = [
  { icon: '📈', num: 2, suffix: 'M+', label: 'Reels Generated', unit: '' },
  { icon: '👥', num: 100, suffix: 'K+', label: 'Active Creators', unit: '' },
  { icon: '⚡', num: 99, suffix: '.4%', label: 'Uptime SLA', unit: '' },
  { icon: '💸', num: 4, suffix: '.2M+', label: 'Creator Earnings', unit: '$' },
]

export default function StatsBand() {
  const ref = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect() } }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref}
      className="relative z-10 py-14"
      style={{ background: 'linear-gradient(180deg,rgba(99,102,241,0.04) 0%,transparent 100%)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-5xl mx-auto px-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((s) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const val = useCountUp(s.num, 1800, active)
          return (
            <div key={s.label} className="text-center py-4">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-heading font-extrabold leading-none mb-1"
                style={{ fontSize: 'clamp(30px,4vw,46px)', letterSpacing: '-0.04em', background: 'linear-gradient(135deg,#fff,#9090b0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {s.unit}{val}{s.suffix}
              </div>
              <div className="text-sm font-medium" style={{ color: '#5a5a78' }}>{s.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
