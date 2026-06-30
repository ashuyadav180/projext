import { useState } from 'react'
import Reveal from './Reveal'

/* ─────────────────────────────────────
   PROBLEM VS SOLUTION
───────────────────────────────────── */
const PROBLEMS = [
    "Only short clips → you can't build session time or authority",
    'Generic voices & visuals → viewers bounce in 3 seconds',
    'Risky assets → demonetization and channel bans',
    "Zero narrative control → empty fact-dumps that don't retain audience",
]
const SOLUTIONS = [
    'Shorts and long-form (up to 20 minutes) for real watch time',
    'Narrative-first scripting + human-sounding voices that hook people',
    'Copyright-safe outputs built for creators, by creators',
    'Timeline editing when you want control, instant previews when you want speed',
]

export function ProblemSolution() {
    return (
        <section className="relative z-10 py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
                <Reveal>
                    <div className="text-center mb-12">
                        <span className="section-label">Why We're Different</span>
                        <h2 className="section-heading text-text1" style={{ fontSize: 'clamp(28px,4vw,48px)' }}>
                            Why Most AI Video Tools Fail<br />
                            <span className="gradient-text">(And How We're Different)</span>
                        </h2>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Reveal>
                        <div className="rounded-[20px] p-8 h-full"
                            style={{ background: 'rgba(244,63,94,0.03)', border: '1px solid rgba(244,63,94,0.2)' }}>
                            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/7">
                                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-sm font-bold"
                                    style={{ background: 'rgba(244,63,94,0.15)', color: '#f43f5e' }}>✕</div>
                                <h3 className="font-heading font-bold text-lg" style={{ color: '#f43f5e' }}>
                                    The Problem (what kills channels)
                                </h3>
                            </div>
                            <div className="flex flex-col gap-3.5">
                                {PROBLEMS.map(p => (
                                    <div key={p} className="flex items-start gap-3 text-sm text-text2 leading-relaxed">
                                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                                            style={{ background: 'rgba(244,63,94,0.15)', color: '#f43f5e' }}>✕</div>
                                        {p}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delay={100}>
                        <div className="rounded-[20px] p-8 h-full"
                            style={{ background: 'rgba(34,211,165,0.03)', border: '1px solid rgba(34,211,165,0.2)' }}>
                            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/7">
                                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-sm font-bold"
                                    style={{ background: 'rgba(34,211,165,0.12)', color: '#22d3a5' }}>✓</div>
                                <h3 className="font-heading font-bold text-lg" style={{ color: '#22d3a5' }}>
                                    AutoReel's Answer
                                </h3>
                            </div>
                            <div className="flex flex-col gap-3.5">
                                {SOLUTIONS.map(s => (
                                    <div key={s} className="flex items-start gap-3 text-sm text-text2 leading-relaxed">
                                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                                            style={{ background: 'rgba(34,211,165,0.12)', color: '#22d3a5' }}>✓</div>
                                        {s}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </div>

                <Reveal>
                    <div className="rounded-2xl px-8 py-6 text-center text-base font-semibold leading-relaxed"
                        style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(249,115,22,0.05))', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <span className="text-4xl align-middle mr-1"
                            style={{ color: '#6366f1', opacity: 0.4, fontFamily: 'Georgia,serif', lineHeight: 0, verticalAlign: '-14px' }}>"</span>
                        You can't tell the difference between AutoReel videos and videos made by hours of manual editing.
                    </div>
                </Reveal>
            </div>
        </section>
    )
}

/* ─────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────── */
const TESTIMONIALS = [
    { name: 'Arjun Mehta', handle: '@arjun_automates', platform: 'YouTube', color: 'linear-gradient(135deg,#6366f1,#818cf8)', letter: 'A', quote: 'I went from posting once a week to posting 3x per day on 4 platforms. AutoReel literally runs my entire channel. $4,200 in ad revenue last month.' },
    { name: 'Sana Rivera', handle: '@sana.creates', platform: 'TikTok', color: 'linear-gradient(135deg,#f97316,#fbbf24)', letter: 'S', quote: "The voice quality is insane. My subscribers didn't even notice I switched to AI voiceovers. Watch time actually went UP by 32%." },
    { name: 'Riya Kapoor', handle: '@riya_viral', platform: 'Instagram', color: 'linear-gradient(135deg,#22d3a5,#6366f1)', letter: 'R', quote: 'Generated 30 reels in one afternoon, scheduled them for the next month, and went on vacation. Came back to 180K new followers.' },
    { name: 'Kabir Nair', handle: '@kabirshorts', platform: 'YouTube', color: 'linear-gradient(135deg,#f43f5e,#f97316)', letter: 'K', quote: 'The trending topics engine is unreal. I got on every wave before it peaked. Three videos hit 1M+ views in the same week.' },
    { name: 'Maya Chen', handle: '@maya.content', platform: 'TikTok', color: 'linear-gradient(135deg,#818cf8,#22d3a5)', letter: 'M', quote: "I've tried 6 AI video tools. AutoReel is the only one where the output is genuinely watch-worthy. My retention rate is 68%." },
]

export function Testimonials() {
    const [index, setIndex] = useState(0)
    const maxIndex = TESTIMONIALS.length - 3

    return (
        <section id="testimonials" className="relative z-10 py-24 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
                <Reveal>
                    <div className="text-center mb-12">
                        <span className="section-label">Social Proof</span>
                        <h2 className="section-heading text-text1" style={{ fontSize: 'clamp(28px,4vw,48px)' }}>
                            What Creators Are<br /><span className="gradient-text">Saying</span>
                        </h2>
                    </div>
                </Reveal>

                <div className="overflow-hidden">
                    <div
                        className="flex gap-4 testimonials-track"
                        style={{ transform: `translateX(-${index * (340 + 16)}px)` }}
                    >
                        {TESTIMONIALS.map(t => (
                            <div
                                key={t.name}
                                className="min-w-[85vw] sm:min-w-[340px] rounded-[20px] p-6 flex-shrink-0 border border-white/7 bg-surface transition-all duration-200"
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                            >
                                <div className="text-yellow-400 text-sm tracking-wider mb-3">★★★★★</div>
                                <p className="text-sm text-text2 leading-relaxed mb-5 italic">"{t.quote}"</p>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0"
                                        style={{ background: t.color }}>{t.letter}</div>
                                    <div>
                                        <div className="text-sm font-bold text-text1">{t.name}</div>
                                        <div className="text-xs text-text3">{t.handle}</div>
                                    </div>
                                    <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full border border-white/10 bg-surface2 text-text3">
                                        {t.platform}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Nav */}
                <div className="flex items-center justify-center gap-3.5 mt-8">
                    <button
                        className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 bg-surface text-text2 hover:border-accent hover:text-accent transition-all cursor-pointer"
                        onClick={() => setIndex(Math.max(0, index - 1))}
                    >←</button>
                    <div className="flex gap-1.5">
                        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-1.5 rounded-full cursor-pointer transition-all duration-200"
                                style={{ width: i === index ? '20px' : '6px', background: i === index ? '#6366f1' : 'rgba(255,255,255,0.1)' }}
                                onClick={() => setIndex(i)}
                            />
                        ))}
                    </div>
                    <button
                        className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 bg-surface text-text2 hover:border-accent hover:text-accent transition-all cursor-pointer"
                        onClick={() => setIndex(Math.min(maxIndex, index + 1))}
                    >→</button>
                </div>
                <div className="text-center mt-5 text-sm text-text3">
                    ⭐ <strong className="text-text1">4.8 / 5.0</strong> from 500+ verified reviews
                </div>
            </div>
        </section>
    )
}

/* ─────────────────────────────────────
   FAQ
───────────────────────────────────── */
const FAQS = [
    { q: 'What exactly is AutoReel.AI?', a: 'AutoReel.AI is an AI-powered platform that automatically generates short-form and long-form video content — including the script, voiceover, captions, and editing — then auto-posts to YouTube, TikTok, and Instagram on your behalf.' },
    { q: 'Do I need any video editing skills?', a: 'Zero. Absolutely none. You type a topic, choose your settings, and the AI handles everything from script to final export.' },
    { q: 'What platforms does it post to?', a: 'AutoReel currently supports YouTube Shorts, TikTok, and Instagram Reels with one-click auto-posting. Facebook Reels and Pinterest are on the roadmap.' },
    { q: 'Is the content copyright-safe?', a: "Yes. All visuals, music, and voiceovers are original and copyright-safe. We don't use stock footage or licensed music — everything is AI-generated specifically for your video." },
    { q: 'How long does it take to generate a video?', a: 'Most short-form videos are ready in 2–4 minutes. Long-form content takes 8–15 minutes. You can generate multiple videos in parallel.' },
    { q: 'Can I use AutoReel in multiple languages?', a: 'Yes! AutoReel supports 30+ languages including English, Spanish, Hindi, French, Portuguese, German, Japanese, and more.' },
    { q: 'Can I cancel my subscription anytime?', a: "Absolutely. No contracts, no lock-ins. Cancel from your dashboard at any time. You'll retain access until the end of your billing period." },
    { q: 'Is there a money-back guarantee?', a: "Yes — we offer a 7-day no-questions-asked refund policy. If AutoReel isn't right for you in the first week, email us and we'll refund you immediately." },
]

export function FAQ() {
    const [open, setOpen] = useState(null)
    return (
        <section id="faq" className="relative z-10 py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
                <Reveal>
                    <div className="text-center mb-12">
                        <span className="section-label">FAQ</span>
                        <h2 className="section-heading text-text1" style={{ fontSize: 'clamp(28px,4vw,48px)' }}>
                            Got Questions?<br /><span className="gradient-text">We've Got Answers.</span>
                        </h2>
                    </div>
                </Reveal>

                <div className="max-w-[760px] mx-auto">
                    {FAQS.map((faq, i) => (
                        <Reveal key={i} delay={i * 40}>
                            <div
                                className={`faq-item border-b ${open === i ? 'open' : ''}`}
                                style={{ borderColor: 'rgba(255,255,255,0.07)' }}
                            >
                                <div
                                    className="flex items-center justify-between py-5 px-2 cursor-pointer text-base font-semibold gap-5 hover:text-accent2 transition-colors"
                                    onClick={() => setOpen(open === i ? null : i)}
                                >
                                    <span>{faq.q}</span>
                                    <div
                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 transition-all duration-200 border"
                                        style={{
                                            background: open === i ? 'rgba(99,102,241,0.12)' : '#0e0e1c',
                                            borderColor: open === i ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.1)',
                                            color: open === i ? '#818cf8' : '#50507a',
                                            transform: open === i ? 'rotate(45deg)' : 'none',
                                        }}
                                    >+</div>
                                </div>
                                <div className="faq-answer">
                                    <div className="px-2 pb-5 text-sm text-text2 leading-relaxed">{faq.a}</div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}

/* ─────────────────────────────────────
   FINAL CTA
───────────────────────────────────── */
export function FinalCTA({ onOpenApp }) {
    return (
        <section className="relative z-10 py-24 px-4 sm:px-6 md:px-10 text-center overflow-hidden">
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%,rgba(99,102,241,0.12),transparent 70%),radial-gradient(ellipse 50% 40% at 80% 80%,rgba(249,115,22,0.07),transparent 60%)' }}
            />
            <Reveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-text2 text-xs mb-7">
                    <span className="text-yellow-400">★★★★★</span>
                    <span>4.8 · 500+ reviews</span>
                    <span className="w-px h-3 bg-white/10" />
                    <span>Trusted by <strong className="text-accent2">100K+</strong> creators</span>
                </div>
                <h2
                    className="section-heading text-text1 relative z-10 mb-4"
                    style={{ fontSize: 'clamp(32px,5vw,58px)', letterSpacing: '-0.04em' }}
                >
                    Start Generating Monetizable<br />
                    AI Videos on <span className="gradient-text">Autopilot Today!</span>
                </h2>
                <p className="text-text2 text-base max-w-md mx-auto mb-9 leading-relaxed">
                    Join thousands of creators already making viral content with AutoReel. Start in under 2 minutes.
                </p>
                <div className="mb-8">
                    <button onClick={onOpenApp} className="btn-primary text-base py-4 px-9 cursor-pointer border-none text-white">
                        ✦ Generate a Video Now — It's Free
                    </button>
                </div>
                <div className="flex flex-wrap gap-5 justify-center">
                    {['🔒 No Credit Card', '⚡ Ready in 2 Min', '🌍 30+ Languages', '↩ 7-Day Money Back'].map(t => (
                        <span key={t} className="text-sm text-text3">{t}</span>
                    ))}
                </div>
            </Reveal>
        </section>
    )
}

/* ─────────────────────────────────────
   FOOTER
───────────────────────────────────── */
export function Footer() {
    const cols = [
        { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
        { title: 'Company', links: ['About', 'Blog', 'Careers', 'Affiliates'] },
        { title: 'Resources', links: ['FAQs', 'Documentation', 'Tutorials', 'Support'] },
        { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'DMCA'] },
    ]

    return (
        <footer
            className="relative z-10 border-t px-4 sm:px-6 md:px-10 pt-16 pb-8"
            style={{ background: '#06060f', borderColor: 'rgba(255,255,255,0.07)' }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-12">

                    {/* Brand */}
                    <div className="col-span-2">
                        <a href="#" className="flex items-center gap-2.5 font-heading text-lg font-extrabold text-text1 no-underline mb-3">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                                style={{ background: 'linear-gradient(135deg,#6366f1,#f97316)' }}>▶</div>
                            AutoReel<span className="text-accent2">.AI</span>
                        </a>
                        <p className="text-sm text-text3 leading-relaxed mb-4">
                            Generate, schedule and auto-post short-form video content at scale. Trusted by 50,000+ creators.
                        </p>
                        <div className="flex gap-2">
                            {['𝕏', '◈', '▶', 'in'].map(s => (
                                <a key={s} href="#"
                                    className="w-8 h-8 rounded-[9px] border border-white/10 bg-surface flex items-center justify-center text-sm text-text3 hover:text-text1 transition-all no-underline">
                                    {s}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {cols.map(col => (
                        <div key={col.title}>
                            <div className="text-[11px] font-bold tracking-wider uppercase text-text3 mb-3.5">{col.title}</div>
                            <div className="flex flex-col gap-2.5">
                                {col.links.map(link => (
                                    <a key={link} href="#"
                                        className="text-sm text-text3 hover:text-text1 no-underline transition-colors">{link}</a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div
                    className="border-t pt-6 flex flex-wrap items-center justify-between gap-4"
                    style={{ borderColor: 'rgba(255,255,255,0.07)' }}
                >
                    <span className="text-xs text-text3">©2026 AutoReel.AI LLC — All rights reserved</span>
                    <span className="text-xs text-text3">Made with ❤️ for creators</span>
                    <button
                        className="text-xs text-text3 px-3.5 py-1.5 rounded-full border border-white/10 bg-surface hover:text-text1 transition-colors cursor-pointer"
                        style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        ↑ Back to top
                    </button>
                </div>

                <p className="mt-5 text-[11px] text-text3 leading-relaxed opacity-60">
                    This site is not a part of the Facebook website or Facebook Inc. This site is NOT endorsed by Facebook in any way.
                    FACEBOOK is a trademark of FACEBOOK, Inc. Results shown are not typical and individual results will vary.
                </p>
            </div>
        </footer>
    )
}