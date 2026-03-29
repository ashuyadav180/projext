import { useState } from 'react';
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth";
import { ToastProvider } from './context/ToastContext';

// Marketing page components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsBand from './components/StatsBand';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import VideoShowcase from './components/VideoShowcase';
import Pricing from './components/Pricing';
import { ProblemSolution, Testimonials, FAQ, FinalCTA, Footer } from './components/Sections';

// Google Fonts
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

function MarketingPage({ onOpenApp }) {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#06060f', minHeight: '100vh' }}>
      <Navbar onOpenApp={onOpenApp} />
      <Hero onOpenApp={onOpenApp} />
      <StatsBand />
      <Features />
      <HowItWorks />
      <VideoShowcase />
      <ProblemSolution />
      <Testimonials />
      <Pricing onOpenApp={onOpenApp} />
      <FAQ />
      <FinalCTA onOpenApp={onOpenApp} />
      <Footer />
    </div>
  );
}

function App() {
  // Show marketing page by default; auth/dashboard on "Open App"
  const [view, setView] = useState('marketing'); // 'marketing' | 'auth' | 'dashboard'

  return (
    <ToastProvider>
      {view === 'marketing' && (
        <>
          <style>{`
            .btn-primary {
              display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px;
              background: linear-gradient(135deg, #6366f1, #818cf8); border: none; border-radius: 12px;
              color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700;
              cursor: pointer; box-shadow: 0 8px 32px rgba(99,102,241,0.4); transition: all .22s; text-decoration: none;
            }
            .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(99,102,241,.55); }
            .section-label { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #818cf8; margin-bottom: 14px; display: block; }
            .section-heading { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; letter-spacing: -1px; line-height: 1.1; }
            .font-heading { font-family: 'Bricolage Grotesque', sans-serif; }
            .gradient-text { background: linear-gradient(135deg,#6366f1 0%,#a78bfa 40%,#f97316 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
            .text-text1 { color: #f1f1f8; }
            .text-text2 { color: #a0a0c0; }
            .text-text3 { color: #5a5a78; }
            .text-accent { color: #6366f1; }
            .text-accent2 { color: #818cf8; }
            .text-green { color: #22d3a5; }
            .bg-surface { background: #0d0d14; }
            .bg-surface2 { background: #12121c; }
            .bg-bg { background: #06060f; }
            .bg-accent { background: #6366f1; }
            .bg-green { background: #22d3a5; }
            .border-accent { border-color: #6366f1; }
            .pulse-dot { box-shadow: 0 0 0 0 rgba(34,211,165,0.4); animation: pulseDot 2s infinite; }
            @keyframes pulseDot{0%{box-shadow:0 0 0 0 rgba(34,211,165,0.4)}70%{box-shadow:0 0 0 6px rgba(34,211,165,0)}100%{box-shadow:0 0 0 0 rgba(34,211,165,0)}}
            .faq-answer { max-height: 0; overflow: hidden; transition: max-height .3s ease; }
            .faq-item.open .faq-answer { max-height: 300px; }
            .feature-check { width: 18px; height: 18px; border-radius: 5px; background: rgba(34,211,165,0.12); display: flex; align-items: center; justify-content: center; font-size: 9px; color: #22d3a5; flex-shrink: 0; margin-top: 1px; }
            .carousel-animate { animation: scrollCarousel 28s linear infinite; }
            .carousel-animate:hover { animation-play-state: paused; }
            @keyframes scrollCarousel{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
            .testimonials-track { transition: transform .5s cubic-bezier(.4,0,.2,1); }
            html { scroll-behavior: smooth; }

            @media (max-width: 768px) {
              nav { padding: 0 20px; }
              .nav-links, .nav-cta, .nav-right, .github-badge { display: none !important; }
              
              .hero { padding: 100px 20px 40px; }
              .hero-title { font-size: 42px; letter-spacing: -1px; }
              .hero-sub { font-size: 16px; }
              .hero-btns { flex-direction: column; width: 100%; }
              .btn-primary, .btn-outline { width: 100%; justify-content: center; }
              
              .stats-grid, .steps-row, .features-grid, .comparison-grid, .pricing-grid, .founders-row, .footer-grid {
                grid-template-columns: 1fr !important;
                gap: 20px !important;
              }
              
              .app-inner { display: flex; flex-direction: column; height: auto; }
              .app-sidebar { display: none; }
              .app-panel { border-right: none; border-bottom: 1px solid var(--border); }
              .app-video-frame { min-height: 250px; }
              .feature-tabs { flex-direction: column; }
              .feature-tab { border-radius: 0 !important; width: 100%; max-width: 100%; }
              
              .section-pad, .how-section, .stats-band { padding: 60px 20px !important; }
              .section-heading { font-size: 32px !important; }
              .steps-row::before, .steps-row::after { display: none; }
            }
          `}</style>
          <MarketingPage onOpenApp={() => setView('auth')} />
        </>
      )}
      {view === 'auth' && <Auth onLogin={() => setView('dashboard')} />}
      {view === 'dashboard' && <Dashboard />}
    </ToastProvider>
  );
}

export default App;
