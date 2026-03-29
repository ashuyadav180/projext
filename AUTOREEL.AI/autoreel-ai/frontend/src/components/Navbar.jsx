import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Reviews', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar({ onOpenApp }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-10
        transition-all duration-300 border-b border-white/5
        ${scrolled ? 'h-14 bg-bg/95 backdrop-blur-2xl' : 'h-[68px] bg-bg/70 backdrop-blur-2xl'}`}>

        <a href="#" className="flex items-center gap-2.5 font-heading text-xl font-extrabold text-text1 no-underline">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{ background: 'linear-gradient(135deg,#6366f1,#f97316)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>▶</div>
          AutoReel<span className="text-accent2">.AI</span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <a key={link.label} href={link.href}
              className="px-3.5 py-1.5 text-sm font-medium text-text2 hover:text-text1 hover:bg-white/5 rounded-lg transition-all duration-150 no-underline">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
            style={{ color: '#22d3a5', background: 'rgba(34,211,165,0.08)', borderColor: 'rgba(34,211,165,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green pulse-dot inline-block"></span>
            Live
          </div>
          <a href="#" className="text-sm font-medium text-text2 hover:text-text1 px-3.5 py-1.5 no-underline transition-colors" onClick={(e) => { e.preventDefault(); onOpenApp(); }}>Dashboard</a>
          <button className="btn-primary text-sm py-2 px-5 cursor-pointer"
            onClick={onOpenApp}>
            Open App →
          </button>
        </div>

        <button className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg border border-white/10 bg-surface cursor-pointer"
          onClick={() => setMobileOpen(true)}>
          <span className="block w-5 h-0.5 bg-text2 rounded"></span>
          <span className="block w-5 h-0.5 bg-text2 rounded"></span>
          <span className="block w-5 h-0.5 bg-text2 rounded"></span>
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6"
            style={{ background: 'rgba(6,6,15,0.98)' }}>
            <button className="absolute top-6 right-6 text-3xl text-text2 cursor-pointer bg-none border-none"
              onClick={() => setMobileOpen(false)}>✕</button>
            {navLinks.map((link, i) => (
              <motion.a key={link.label} href={link.href}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="font-heading text-3xl font-bold text-text2 hover:text-text1 no-underline transition-colors"
                onClick={() => setMobileOpen(false)}>
                {link.label}
              </motion.a>
            ))}
            <button className="btn-primary mt-4 cursor-pointer" onClick={() => { setMobileOpen(false); onOpenApp(); }}>
              ✦ Get Started Free
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}