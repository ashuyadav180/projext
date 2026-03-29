import React, { useState, useEffect } from 'react';

// For the number counter animation
const CountUp = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const endVal = parseInt(end, 10);
    if (start === endVal) return;
    const increment = endVal / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= endVal) {
        setCount(endVal);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <span>{count}{suffix}</span>;
};

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const getStrength = (pw) => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s += 1;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s += 1;
    if (/\d/.test(pw)) s += 1;
    if (/[^a-zA-Z\d]/.test(pw)) s += 1;
    return s;
  };
  const strength = getStrength(password);
  const strengthColors = ['#f43f5e', '#f43f5e', '#fbbf24', '#22d3a5', '#22d3a5'];
  const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Strong', 'Strong'];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToast(`Welcome back, Ashu! 🎉`);
      setTimeout(() => {
        onLogin();
      }, 1000);
    }, 1200);
  };

  return (
    <div className="auth-container premium">
      {toast && <div className="auth-toast">{toast}</div>}

      {/* LEFT PANEL */}
      <div className="auth-left">
        <div className="auth-mesh-bg">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
        </div>

        <div className="auth-left-content">
          <div className="logo" style={{ marginBottom: 32, fontSize: 22 }}>
            <div className="logo-mark">▶</div>
            AutoReel<span>.AI</span>
          </div>
          
          <h1 className="auth-headline">Create viral reels with <br/><span className="text-gradient-anim">AI power</span></h1>
          <p className="auth-subtitle">Generate, schedule and auto-post short-form video content at scale. Trusted by 50,000+ creators worldwide.</p>

          <div className="auth-features">
            <div className="auth-feature">
              <div className="af-icon purple">📝</div>
              <div><strong style={{display: 'block'}}>Converting Scripts</strong><span style={{fontSize: 13, color: 'var(--text3)'}}>AI-generated viral hooks</span></div>
            </div>
            <div className="auth-feature">
              <div className="af-icon blue">🗓</div>
              <div><strong style={{display: 'block'}}>Smart Auto-scheduler</strong><span style={{fontSize: 13, color: 'var(--text3)'}}>Post across multi-platforms</span></div>
            </div>
            <div className="auth-feature">
              <div className="af-icon green">📈</div>
              <div><strong style={{display: 'block'}}>Real-time Analytics</strong><span style={{fontSize: 13, color: 'var(--text3)'}}>Track all channel growth</span></div>
            </div>
            <div className="auth-feature">
              <div className="af-icon orange">⚡</div>
              <div><strong style={{display: 'block'}}>Lightning Engine</strong><span style={{fontSize: 13, color: 'var(--text3)'}}>Generate 10 reels in 2 min</span></div>
            </div>
          </div>

          <div className="auth-ticker-wrap">
            <div className="auth-ticker">
              <span>🔥 @user just generated a reel</span>
              <span className="ticker-dot">•</span>
              <span>🔥 Dark Psychology got 420K views</span>
              <span className="ticker-dot">•</span>
              <span>🔥 @creator posted to TikTok</span>
              <span className="ticker-dot">•</span>
              <span>🔥 @ashu scheduled 5 videos</span>
              <span className="ticker-dot">•</span>
              <span>🔥 @viralhq gained 10k subs</span>
              <span className="ticker-dot">•</span>
              <span>🔥 @user just generated a reel</span>
              <span className="ticker-dot">•</span>
              <span>🔥 Dark Psychology got 420K views</span>
            </div>
          </div>

          <div className="auth-stats">
            <span><CountUp end="50" suffix="K+" /> Creators</span> • 
            <span><CountUp end="2" suffix="M+" /> Reels Made</span> • 
            <span>99.4% Uptime</span>
          </div>

          {/* Floating Video Mockup */}
          <div className="floating-mockup">
            <div className="fm-top">Trending 🔥</div>
            <div className="fm-play">▶</div>
            <div className="fm-bot">👁 420.5K views</div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <div className="auth-particles"></div>
        <a href="#" className="auth-back" onClick={(e) => { e.preventDefault(); onLogin(); }}>← Back to app</a>
        
        <div className="auth-mobile-logo logo">
          <div className="logo-mark">▶</div>AutoReel<span>.AI</span>
        </div>

        <div className="auth-form-card">
          <div className="auth-tabs">
            <button type="button" className={`auth-tab ${mode === 'signin' ? 'active' : ''}`} onClick={() => setMode('signin')}>Sign In</button>
            <button type="button" className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>Sign Up</button>
            <div className={`auth-tab-glider ${mode === 'signup' ? 'right' : ''}`}></div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 26, fontFamily: "'Bricolage Grotesque', sans-serif", margin: "0 0 8px 0" }}>
              {mode === 'signin' ? 'Welcome back 👋' : 'Join 50K creators 🚀'}
            </h2>
            <p style={{ color: "var(--text3)", fontSize: 14, margin: 0 }}>
              {mode === 'signin' ? 'Enter your details to access your studio.' : 'Start generating viral reels in seconds.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'signup' && (
              <div className="input-group">
                <label>Full Name</label>
                <div className="input-wrap">
                  <span className="inp-icon">👤</span>
                  <input type="text" placeholder="Ashu" required />
                </div>
              </div>
            )}

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrap">
                <span className="inp-icon">✉️</span>
                <input type="email" placeholder="ashu@autoreel.ai" required />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrap">
                <span className="inp-icon">🔒</span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button type="button" className="inp-action" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {mode === 'signup' && (
                <>
                  <div className="pw-strength">
                    <div className="pw-bars">
                      {[1,2,3,4].map(b => (
                        <div key={b} className="pw-bar" style={{ background: strength >= b ? strengthColors[strength] : 'var(--surface3)' }}></div>
                      ))}
                    </div>
                    <span style={{ color: strength > 0 ? strengthColors[strength] : 'var(--text3)' }}>
                      {strength > 0 ? strengthLabels[strength] : 'Password strength'}
                    </span>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <label>Confirm Password</label>
                    <div className="input-wrap">
                      <span className="inp-icon">🔒</span>
                      <input type={showPassword ? "text" : "password"} placeholder="••••••••" required />
                    </div>
                  </div>
                  
                  <label className="auth-terms">
                    <input type="checkbox" required />
                    <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</span>
                  </label>
                </>
              )}
            </div>

            {mode === 'signin' && (
              <div className="auth-row">
                <label className="auth-terms" style={{ margin: 0 }}>
                  <input type="checkbox" defaultChecked /> <span>Remember me</span>
                </label>
                <a href="#" className="auth-link">Forgot password?</a>
              </div>
            )}

            <button type="submit" className={`gen-btn auth-submit ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading && <span className="auth-spinner"></span>}
              {!loading && (mode === 'signin' ? 'Sign In →' : 'Create Account →')}
            </button>
          </form>

          <div className="auth-divider"><span>or continue with</span></div>

          <div className="social-row">
            <button type="button" className="social-btn"><img src="https://www.google.com/favicon.ico" width="16" alt="Google" /> Google</button>
            <button type="button" className="social-btn"><img src="https://github.com/favicon.ico" width="16" alt="GitHub" style={{ filter: 'invert(1)' }}/> GitHub</button>
          </div>
        </div>
      </div>
    </div>
  );
}
