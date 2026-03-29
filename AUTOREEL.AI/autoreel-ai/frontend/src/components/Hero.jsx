import { useEffect, useState } from 'react'
import Reveal from './Reveal'

const WORDS = ['Generate Passive Income', 'Go Viral on Autopilot', 'Post While You Sleep', 'Build a Media Empire']

const TICKER_ITEMS = [
  '🔥 @creator123 just generated a reel',
  '📈 Dark Psychology hit 420K views',
  '🚀 @ashu posted to TikTok',
  '💸 @viralhq gained 10K subs',
  '🎬 Stoic Morning Routine hit 1M views',
  '🔥 @reelmaster scheduled 30 videos',
]

export default function Hero({ onOpenApp }) {
  const [wordIdx, setWordIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = WORDS[wordIdx]
    let timeout
    if (!deleting) {
      if (displayed.length < word.length) {
        timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 55)
      } else {
        timeout = setTimeout(() => setDeleting(true), 2200)
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30)
      } else {
        setDeleting(false)
        setWordIdx((i) => (i + 1) % WORDS.length)
      }
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, wordIdx])

  const tickerAll = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden pt-28 pb-20 px-6">
      {/* Orbs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute rounded-full" style={{ width: 600, height: 600, top: -120, left: -120, background: 'radial-gradient(circle,rgba(99,102,241,0.18),transparent 70%)', filter: 'blur(100px)', animation: 'orbFloat1 14s ease-in-out infinite' }} />
        <div className="absolute rounded-full" style={{ width: 500, height: 500, bottom: -60, right: -80, background: 'radial-gradient(circle,rgba(249,115,22,0.12),transparent 70%)', filter: 'blur(100px)', animation: 'orbFloat2 18s ease-in-out infinite' }} />
        <div className="absolute rounded-full" style={{ width: 350, height: 350, top: '40%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle,rgba(34,211,165,0.07),transparent 70%)', filter: 'blur(80px)', animation: 'orbFloat3 22s ease-in-out infinite' }} />
      </div>

      <style>{`
        @keyframes orbFloat1{0%,100%{transform:translate(0,0)}50%{transform:translate(40px,30px)}}
        @keyframes orbFloat2{0%,100%{transform:translate(0,0)}50%{transform:translate(-30px,20px)}}
        @keyframes orbFloat3{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.15)}}
        @keyframes scrollTicker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes bounceArrow{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}}
        .gradient-text{background:linear-gradient(135deg,#6366f1 0%,#a78bfa 40%,#f97316 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .btn-primary{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:linear-gradient(135deg,#6366f1,#818cf8);border:none;border-radius:12px;color:#fff;font-family:inherit;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 8px 32px rgba(99,102,241,0.4);transition:all .22s;position:relative;overflow:hidden;text-decoration:none}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(99,102,241,.55)}
        .btn-outline{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);border-radius:12px;color:#f0f0fa;font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;transition:all .22s;text-decoration:none}
        .btn-outline:hover{background:rgba(255,255,255,0.08);transform:translateY(-2px)}
        .section-label{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#818cf8;margin-bottom:14px;display:block}
        .section-heading{font-family:'Bricolage Grotesque','Plus Jakarta Sans',sans-serif;font-weight:800;letter-spacing:-1px;line-height:1.1}
        .font-heading{font-family:'Bricolage Grotesque','Plus Jakarta Sans',sans-serif}
        .text-text1{color:#f1f1f8}
        .text-text2{color:#a0a0c0}
        .text-text3{color:#5a5a78}
        .text-accent{color:#6366f1}
        .text-accent2{color:#818cf8}
        .bg-surface{background:#0d0d14}
        .bg-surface2{background:#12121c}
        .pulse-dot{box-shadow:0 0 0 0 rgba(34,211,165,0.4);animation:pulseDot 2s infinite}
        @keyframes pulseDot{0%{box-shadow:0 0 0 0 rgba(34,211,165,0.4)}70%{box-shadow:0 0 0 6px rgba(34,211,165,0)}100%{box-shadow:0 0 0 0 rgba(34,211,165,0)}}
        .faq-answer{max-height:0;overflow:hidden;transition:max-height .3s ease}
        .faq-item.open .faq-answer{max-height:300px}
        .feature-check{width:18px;height:18px;border-radius:5px;background:rgba(34,211,165,0.12);display:flex;align-items:center;justify-content:center;font-size:9px;color:#22d3a5;flex-shrink:0;margin-top:1px}
        .carousel-animate{animation:scrollTicker 28s linear infinite}
        .carousel-animate:hover{animation-play-state:paused}
        .testimonials-track{transition:transform .5s cubic-bezier(.4,0,.2,1)}
      `}</style>

      {/* Badge */}
      <Reveal>
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 text-sm mb-7 z-10 relative"
          style={{ background: 'rgba(255,255,255,0.04)', color: '#a0a0c0' }}>
          <span className="text-yellow-400 tracking-wider text-xs font-bold">★★★★★</span>
          <span>4.8 · 500+ five-star reviews</span>
          <span className="w-px h-3 bg-white/10" />
          <span>Trusted by <strong className="text-accent2">100K+</strong> creators</span>
        </div>
      </Reveal>

      {/* Headline */}
      <div className="relative z-10 mb-5">
        <h1 className="font-heading font-extrabold text-text1 leading-tight mb-0"
          style={{ fontSize: 'clamp(38px,6.5vw,74px)', letterSpacing: '-2px', maxWidth: 900 }}>
          <span className="gradient-text">{displayed}</span>
          <span style={{ borderRight: '3px solid #6366f1', animation: 'blink-caret .75s step-end infinite', paddingRight: 2 }} />
          <style>{`@keyframes blink-caret{from,to{border-color:transparent}50%{border-color:#6366f1}}`}</style>
          <br />
          <span className="text-text1">with AI-generated Videos</span>
        </h1>
      </div>

      {/* Sub */}
      <Reveal delay={100}>
        <p className="text-text2 text-center mb-9 relative z-10" style={{ fontSize: 'clamp(15px,2vw,18px)', maxWidth: 560, lineHeight: 1.7 }}>
          AI generates the script, voiceover, captions and edits automatically — no skills needed. Post while you sleep.
        </p>
      </Reveal>

      {/* CTAs */}
      <Reveal delay={180}>
        <div className="flex gap-3 flex-wrap justify-center mb-7 relative z-10">
          <button onClick={onOpenApp} className="btn-primary cursor-pointer">✦ Generate a Video Now</button>
          <a href="#how" className="btn-outline">▶ Watch Demo</a>
        </div>
      </Reveal>

      {/* Live Ticker */}
      <Reveal delay={250}>
        <div className="relative w-full max-w-2xl overflow-hidden z-10 mb-12" style={{ maskImage: 'linear-gradient(90deg,transparent,black 12%,black 88%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,black 12%,black 88%,transparent)' }}>
          <div className="flex gap-0 carousel-animate w-max">
            {tickerAll.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2 px-5 text-xs font-medium whitespace-nowrap"
                style={{ color: '#5a5a78' }}>
                {item}
                <span style={{ color: '#2a2a3a', marginLeft: 2 }}>•</span>
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Platforms */}
      <Reveal delay={300}>
        <div className="flex flex-col items-center gap-4 z-10 relative">
          <div className="text-xs font-bold tracking-widest uppercase" style={{ color: '#5a5a78' }}>Supported Platforms</div>
          <div className="flex items-center gap-7">
            {[['▶', '#ff0000', 'YouTube'], ['◈', '#e4405f', 'Instagram'], ['♪', '#fff', 'TikTok']].map(([icon, color, name]) => (
              <div key={name} className="flex items-center gap-2 text-sm font-bold" style={{ color: '#a0a0c0' }}>
                <span style={{ color }}>{icon}</span> {name}
              </div>
            ))}
          </div>
          {/* Avatar stack */}
          <div className="flex items-center gap-3 mt-1">
            <div className="flex">
              {['#6366f1', '#f97316', '#22d3a5', '#f43f5e', '#818cf8'].map((c, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-extrabold text-white"
                  style={{ background: c, borderColor: '#06060f', marginLeft: i === 0 ? 0 : -8 }}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span className="text-sm font-medium" style={{ color: '#a0a0c0' }}>
              Trusted by <strong style={{ color: '#818cf8' }}>100K+</strong> creators
            </span>
          </div>
        </div>
      </Reveal>

      {/* Scroll arrow */}
      <div className="absolute bottom-8 left-1/2 z-10" style={{ animation: 'bounceArrow 2s ease-in-out infinite' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(90,90,120,0.7)" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
      </div>
    </section>
  )
}
