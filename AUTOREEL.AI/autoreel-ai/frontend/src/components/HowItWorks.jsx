import Reveal from './Reveal'

const STEPS = [
    {
        num: '01', icon: '🎯', title: 'Choose a Topic',
        desc: 'Pick from real-time trending topics or type your own idea. Our AI researches, scripts, and hooks your audience from the first second.',
    },
    {
        num: '02', icon: '🎛', title: 'Customize',
        desc: 'Choose voice, caption style, reel length, platform format, and visual style. 50+ voices in 30 languages. Full creative control.',
    },
    {
        num: '03', icon: '🚀', title: 'Generate & Post',
        desc: 'AI renders your video in minutes and auto-posts to YouTube Shorts, TikTok, and Instagram Reels — while you sleep.',
    },
]

export default function HowItWorks() {
    return (
        <section id="how" className="relative z-10 py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
                <Reveal>
                    <div className="text-center mb-16">
                        <span className="section-label">Simple as 1-2-3</span>
                        <h2
                            className="section-heading text-text1"
                            style={{ fontSize: 'clamp(28px,4vw,48px)' }}
                        >
                            From Idea to Viral Video in<br />
                            <span className="gradient-text">Under 2 Minutes</span>
                        </h2>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                    {/* Connecting line desktop */}
                    <div
                        className="hidden md:block absolute top-12 left-[calc(16.66%+20px)] right-[calc(16.66%+20px)] h-px z-0"
                        style={{ background: 'linear-gradient(90deg,#6366f1,#818cf8)' }}
                    />

                    {STEPS.map((step, i) => (
                        <Reveal key={step.num} delay={i * 100}>
                            <div
                                className="relative z-10 rounded-2xl p-8 text-center border border-white/7 bg-surface cursor-default transition-all duration-300"
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-6px)'
                                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'
                                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(99,102,241,0.12)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                <div
                                    className="font-heading font-black leading-none mb-3"
                                    style={{
                                        fontSize: '56px',
                                        background: 'linear-gradient(135deg,rgba(99,102,241,0.5),rgba(129,140,248,0.2))',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        letterSpacing: '-0.04em',
                                    }}
                                >
                                    {step.num}
                                </div>
                                <div className="text-3xl mb-3.5">{step.icon}</div>
                                <h3 className="font-heading font-bold text-xl text-text1 mb-2.5">{step.title}</h3>
                                <p className="text-sm text-text2 leading-relaxed">{step.desc}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}