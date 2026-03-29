import Reveal from './Reveal'

const PHONES = [
    { gradient: 'linear-gradient(135deg,#1a0a2e,#2d1b69)', title: 'Dark Psychology', views: '🎵 700K Views', tall: true },
    { gradient: 'linear-gradient(135deg,#0a1a2e,#1e4a7a)', title: 'Rags to Riches', views: '▶ 2M Views', tall: false },
    { gradient: 'linear-gradient(135deg,#0d1f0d,#1a3d1a)', title: 'An Abandoned', views: '◈ 1M Views', tall: true },
    { gradient: 'linear-gradient(135deg,#1a1a0a,#3d3a0d)', title: 'Millions', views: '♪ 450K Views', tall: false },
    { gradient: 'linear-gradient(135deg,#1a0a0a,#3d1b1b)', title: 'Stoic Mindset', views: '◈ 2M Views', tall: true },
    { gradient: 'linear-gradient(135deg,#0a0a1a,#1b1b3d)', title: 'AI Will Win', views: '▶ 700K Views', tall: false },
]

const ALL_PHONES = [...PHONES, ...PHONES]

function PhoneCard({ phone }) {
    return (
        <div
            className="flex-shrink-0 w-[168px] rounded-[28px] overflow-hidden border-[3px] border-white/10 relative transition-transform duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
                height: phone.tall ? '340px' : '280px',
                marginTop: phone.tall ? 0 : '30px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
        >
            <div className="w-full h-full" style={{ background: phone.gradient }} />
            <div
                className="absolute bottom-0 left-0 right-0 px-3.5 pb-3.5 pt-5"
                style={{ background: 'linear-gradient(transparent,rgba(0,0,0,0.8))' }}
            >
                <div className="font-heading font-extrabold text-white text-[13px] uppercase tracking-wider mb-2">
                    {phone.title}
                </div>
                <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: 'rgba(0,0,0,0.7)' }}
                >
                    {phone.views}
                </div>
            </div>
        </div>
    )
}

export default function VideoShowcase() {
    return (
        <section className="relative z-10 py-24 overflow-hidden">
            <div className="max-w-6xl mx-auto px-10">
                <Reveal>
                    <div className="text-center mb-12">
                        <span className="section-label">Real Results</span>
                        <h2
                            className="section-heading text-text1"
                            style={{ fontSize: 'clamp(28px,4vw,48px)' }}
                        >
                            Our Users' Videos<br />
                            <span className="gradient-text">Get Real Views</span>
                        </h2>
                        <p className="text-text2 mt-3 text-base">
                            Every video is uniquely generated with AI — no templates, no duplicates
                        </p>
                    </div>
                </Reveal>
            </div>

            {/* Infinite carousel */}
            <div className="relative overflow-hidden py-5">
                <div
                    className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg,#06060f,transparent)' }}
                />
                <div
                    className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(-90deg,#06060f,transparent)' }}
                />
                <div className="carousel-animate flex gap-4 w-max px-4">
                    {ALL_PHONES.map((phone, i) => (
                        <PhoneCard key={i} phone={phone} />
                    ))}
                </div>
            </div>

            {/* CTA Banner */}
            <div className="max-w-6xl mx-auto px-10 mt-8">
                <Reveal>
                    <div
                        className="flex items-center justify-between gap-5 px-7 py-5 rounded-2xl border"
                        style={{ background: '#0e0e1c', borderColor: 'rgba(99,102,241,0.3)' }}
                    >
                        <p className="text-base font-semibold text-text1">
                            Start creating videos like these{' '}
                            <span className="text-accent2">successful channels</span> in just a few clicks →
                        </p>
                        <a href="#pricing" className="btn-primary text-sm py-2.5 px-5 whitespace-nowrap">
                            ✦ Start Free
                        </a>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}