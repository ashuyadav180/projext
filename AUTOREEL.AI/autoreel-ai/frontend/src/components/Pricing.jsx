import { useState } from 'react'
import Reveal from './Reveal'

const PLANS = [
    {
        name: 'Starter', for: 'For Beginners',
        monthly: { price: 19, old: 49, billed: '$19' },
        yearly: { price: 14, old: 49, billed: '$14' },
        badge: { text: 'LIMITED OFFER', color: '#f43f5e', bg: 'rgba(244,63,94,0.12)', border: 'rgba(244,63,94,0.2)' },
        chips: ['📱 30 Short Videos / month'],
        btnStyle: 'primary',
        features: [
            '30 Short Videos per Month',
            '150 Credits per Month',
            'Optimized for YouTube Shorts',
            'Instagram Reels & TikTok',
            'Faceless Shorts, Fake Text, Split Screen',
        ],
    },
    {
        name: 'Plus', for: 'For Short-Form Creators',
        monthly: { price: 67, old: 99, billed: '$67' },
        yearly: { price: 47, old: 99, billed: '$47' },
        popular: true,
        chips: ['📱 100 Short Videos / month'],
        btnStyle: 'primary',
        features: [
            '100 Short Videos per Month',
            '500 Credits per Month',
            'Optimized for YouTube Shorts',
            'Instagram Reels & TikTok',
            'Faceless Shorts, Fake Text, Split Screen',
            'Priority Queue',
            'Analytics Dashboard',
        ],
    },
    {
        name: 'Pro', for: 'For All Video Creators',
        monthly: { price: 137, old: 199, billed: '$137' },
        yearly: { price: 96, old: 199, billed: '$96' },
        chips: ['📱 280 Shorts / month', '🎬 280 min long-form'],
        btnStyle: 'secondary',
        featuresLabel: 'Everything in Plus, and also:',
        features: [
            '1,400 Credits per Month',
            '280 Short Videos or 280 min long-form',
            'Long-Form Video Creation (up to 20 min)',
            'Faceless Shorts, Fake Text, Split Screen',
            'Dedicated Support',
            'White-Label Export',
        ],
    },
]

const TRUST = [
    { icon: '🔒', text: 'Cancel anytime' },
    { icon: '📄', text: 'No contracts' },
    { icon: '↩', text: '7-day money back' },
    { icon: '⚡', text: 'Instant access' },
]

export default function Pricing({ onOpenApp }) {
    const [yearly, setYearly] = useState(true)

    return (
        <section id="pricing" className="relative z-10 py-24">
            <div className="max-w-6xl mx-auto px-10">

                <Reveal>
                    <div className="text-center mb-10">
                        <span className="section-label">Pricing</span>
                        <h2 className="section-heading text-text1" style={{ fontSize: 'clamp(28px,4vw,48px)' }}>
                            Pick Your Plan.<br /><span className="gradient-text">Start Today.</span>
                        </h2>
                    </div>
                </Reveal>

                {/* Billing toggle */}
                <Reveal>
                    <div className="flex items-center justify-center gap-3 mb-10">
                        <span
                            className={`text-sm font-semibold cursor-pointer transition-colors ${!yearly ? 'text-text1' : 'text-text3'}`}
                            onClick={() => setYearly(false)}
                        >
                            Monthly
                        </span>
                        <div
                            className="w-12 h-6 rounded-full relative cursor-pointer"
                            style={{ background: '#6366f1' }}
                            onClick={() => setYearly(y => !y)}
                        >
                            <div
                                className="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200"
                                style={{ transform: yearly ? 'translateX(26px)' : 'translateX(4px)' }}
                            />
                        </div>
                        <span
                            className={`text-sm font-semibold cursor-pointer transition-colors ${yearly ? 'text-text1' : 'text-text3'}`}
                            onClick={() => setYearly(true)}
                        >
                            Yearly
                        </span>
                        <span
                            className="text-xs font-bold px-2.5 py-1 rounded-full"
                            style={{
                                background: 'rgba(34,211,165,0.12)',
                                border: '1px solid rgba(34,211,165,0.25)',
                                color: '#22d3a5',
                            }}
                        >
                            Save 30%
                        </span>
                    </div>
                </Reveal>

                {/* Plan cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PLANS.map((plan, i) => {
                        const pricing = yearly ? plan.yearly : plan.monthly
                        return (
                            <Reveal key={plan.name} delay={i * 100}>
                                <div
                                    className="relative rounded-[20px] p-8 flex flex-col border transition-all duration-300 hover:-translate-y-1.5"
                                    style={{
                                        background: '#0e0e1c',
                                        borderColor: plan.popular ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.07)',
                                        boxShadow: plan.popular
                                            ? '0 0 0 1px rgba(99,102,241,0.2),0 20px 60px rgba(99,102,241,0.15)'
                                            : 'none',
                                    }}
                                    onMouseEnter={e => { if (!plan.popular) e.currentTarget.style.boxShadow = '0 24px 70px rgba(0,0,0,0.3)' }}
                                    onMouseLeave={e => { if (!plan.popular) e.currentTarget.style.boxShadow = 'none' }}
                                >
                                    {plan.popular && (
                                        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[20px]"
                                            style={{ background: 'linear-gradient(90deg,#6366f1,#818cf8)' }} />
                                    )}
                                    {plan.popular && (
                                        <span className="absolute top-4 right-4 text-[10px] font-extrabold text-white px-3 py-1 rounded-full tracking-wider"
                                            style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)' }}>
                                            ⭐ MOST POPULAR
                                        </span>
                                    )}
                                    {plan.badge && (
                                        <span className="inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full mb-2.5 w-fit"
                                            style={{ background: plan.badge.bg, border: `1px solid ${plan.badge.border}`, color: plan.badge.color }}>
                                            {plan.badge.text}
                                        </span>
                                    )}

                                    <div className="font-heading font-extrabold text-2xl text-text1 mb-1">{plan.name}</div>
                                    <div className="text-xs text-text3 mb-4">{plan.for}</div>

                                    <div className="flex items-start gap-1 mb-1">
                                        <span className="text-lg text-text3 line-through mt-1">${pricing.old}</span>
                                        <span className="font-heading font-extrabold text-text1"
                                            style={{ fontSize: '44px', letterSpacing: '-0.04em', lineHeight: 1 }}>
                                            ${pricing.price}
                                        </span>
                                    </div>
                                    <div className="text-xs text-text3 mb-1">USD / Per Month</div>
                                    <div className="text-xs text-text3 mb-5">Billed today: {pricing.billed}</div>

                                    <button
                                        className={`w-full py-3.5 rounded-xl font-bold text-sm mb-5 transition-all duration-200 cursor-pointer border-none ${plan.btnStyle === 'primary' ? 'btn-primary justify-center' : ''}`}
                                        style={plan.btnStyle === 'secondary' ? {
                                            background: '#13131f',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            color: '#f0f0fa',
                                            fontFamily: "'Plus Jakarta Sans',sans-serif",
                                        } : {}}
                                        onClick={onOpenApp}
                                    >
                                        Subscribe →
                                    </button>

                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {plan.chips.map(c => (
                                            <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-text2 border border-white/10 bg-surface2">
                                                {c}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="h-px bg-white/7 mb-4" />
                                    <div className="text-xs font-bold text-text2 mb-3">
                                        {plan.featuresLabel || "What's included:"}
                                    </div>
                                    <div className="flex flex-col gap-2.5">
                                        {plan.features.map(f => (
                                            <div key={f} className="flex items-start gap-2.5 text-sm text-text2">
                                                <div className="feature-check">✓</div>
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Reveal>
                        )
                    })}
                </div>

                {/* Trust row */}
                <Reveal>
                    <div className="flex flex-wrap gap-6 justify-center mt-8">
                        {TRUST.map(t => (
                            <div key={t.text} className="flex items-center gap-2 text-sm text-text3 font-medium">
                                <span className="text-base">{t.icon}</span>{t.text}
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    )
}