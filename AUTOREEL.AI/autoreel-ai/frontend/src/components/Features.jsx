import Reveal from './Reveal'

const CARDS = [
  {
    icon: '✍️', title: 'Viral Script Generation',
    desc: 'Trained on millions of leading short-form videos. Generates high-retention hooks, compelling pacing, and call-to-actions automatically.',
    tag: 'GPT-4 Powered', tagColor: '#818cf8', tagBg: 'rgba(99,102,241,0.12)', tagBorder: 'rgba(99,102,241,0.25)',
    iconBg: 'rgba(99,102,241,0.15)', iconColor: '#818cf8', glow: 'rgba(99,102,241,0.2)', large: true,
  },
  {
    icon: '🗣️', title: 'Hyper-Realistic Voices',
    desc: 'Access 120+ emotional AI voices or clone your own with just 30 seconds of audio. Supports 30+ languages.',
    tag: '11Labs', tagColor: '#22d3a5', tagBg: 'rgba(34,211,165,0.12)', tagBorder: 'rgba(34,211,165,0.25)',
    iconBg: 'rgba(34,211,165,0.15)', iconColor: '#22d3a5', glow: 'rgba(34,211,165,0.2)',
  },
  {
    icon: '🎬', title: 'Smart B-Roll Sourcing',
    desc: 'Automatically pairs script context with premium visuals. Every background is matched to the emotion of your script.',
    iconBg: 'rgba(249,115,22,0.15)', iconColor: '#f97316', glow: 'rgba(249,115,22,0.2)', large: true,
  },
  {
    icon: '✨', title: 'Dynamic Captions',
    desc: 'Hormozi-style animated text with emojis and word-level highlighting. 8 caption styles with live preview.',
    iconBg: 'rgba(244,63,94,0.15)', iconColor: '#f43f5e', glow: 'rgba(244,63,94,0.2)',
  },
  {
    icon: '📅', title: 'Auto-Scheduler',
    desc: 'Set it and forget it. Queue up months of content to post at peak engagement times automatically.',
    iconBg: 'rgba(167,139,250,0.15)', iconColor: '#a78bfa', glow: 'rgba(167,139,250,0.2)',
  },
  {
    icon: '📊', title: 'Analytics Dashboard',
    desc: 'Track views, watch time, CTR and subscriber growth per reel across all platforms in real time.',
    iconBg: 'rgba(56,189,248,0.15)', iconColor: '#38bdf8', glow: 'rgba(56,189,248,0.2)',
  },
]

export default function Features() {
  return (
    <section id="features" className="relative z-10 py-24">
      <div className="max-w-6xl mx-auto px-10">
        <Reveal>
          <div className="text-center mb-14">
            <span className="section-label">Platform Features</span>
            <h2 className="section-heading text-text1" style={{ fontSize: 'clamp(28px,4vw,48px)' }}>
              Everything You Need to<br />
              <span className="gradient-text">Dominate Short-Form</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4"
          style={{ gridTemplateRows: 'auto auto' }}>
          {CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 80}>
              <div
                className={`rounded-[18px] p-7 h-full border border-white/7 transition-all duration-300 cursor-default ${card.large ? 'md:col-span-2' : ''}`}
                style={{ background: '#0e0e1c' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = card.glow
                  e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.3), 0 0 0 1px ${card.glow}`
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-2xl mb-4"
                  style={{ background: card.iconBg, color: card.iconColor }}>
                  {card.icon}
                </div>
                <h3 className="font-heading font-bold text-xl text-text1 mb-2">{card.title}</h3>
                <p className="text-sm text-text2 leading-relaxed">{card.desc}</p>
                {card.tag && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold mt-4 border"
                    style={{ color: card.tagColor, background: card.tagBg, borderColor: card.tagBorder }}>
                    {card.tag}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
