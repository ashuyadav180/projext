import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── Static service data ───────────────────────────────────────────────────
const SERVICES = [
  { id: 'elevenlabs', name: 'ElevenLabs',   emoji: '🎙', provider: 'elevenlabs.io',  credits: 82, unlimited: false, status: 'online',  latency: 128, unit: 'characters' },
  { id: 'stability', name: 'Stability AI',  emoji: '🎨', provider: 'stability.ai',   credits: 61, unlimited: false, status: 'online',  latency: 245, unit: 'API calls' },
  { id: 'runway',    name: 'RunwayML',       emoji: '🎬', provider: 'runwayml.com',   credits: 34, unlimited: false, status: 'low',     latency: 312, unit: 'credits' },
  { id: 'pexels',   name: 'Pexels',         emoji: '📸', provider: 'pexels.com',     credits: 100,unlimited: true,  status: 'online',  latency: 89,  unit: '' },
  { id: 'synclabs', name: 'SyncLabs',       emoji: '👄', provider: 'synclabs.ai',    credits: 55, unlimited: false, status: 'online',  latency: 198, unit: 'credits' },
  { id: 'gemini',   name: 'Gemini',         emoji: '🤖', provider: 'ai.google.dev',  credits: 91, unlimited: false, status: 'online',  latency: 156, unit: 'requests' },
  { id: 'claude',   name: 'Claude',         emoji: '🧠', provider: 'anthropic.com',  credits: 78, unlimited: false, status: 'online',  latency: 201, unit: 'tokens' },
];

// Generate fake historical pings (10 per service)
const generatePings = (baseLat) => Array.from({ length: 10 }, (_, i) => ({
  ms: Math.max(30, baseLat + Math.round((Math.random() - 0.5) * baseLat * 0.6)),
  ts: new Date(Date.now() - (9 - i) * 30000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
}));

const INITIAL_PINGS = Object.fromEntries(SERVICES.map(s => [s.id, generatePings(s.latency)]));



// ─── Utilities ─────────────────────────────────────────────────────────────
const latencyColor = (ms) => ms < 200 ? '#10b981' : ms < 500 ? '#f59e0b' : '#ef4444';
const barColor = (pct) => pct > 60 ? '#6366f1' : pct > 30 ? '#f97316' : '#ef4444';
const barGradient = (pct) => pct > 60
  ? 'linear-gradient(90deg, #6366f1, #818cf8)'
  : pct > 30
    ? 'linear-gradient(90deg, #f97316, #fb923c)'
    : 'linear-gradient(90deg, #ef4444, #f87171)';
const pingBarColor = (ms) => ms < 200 ? '#10b981' : ms < 400 ? '#f59e0b' : '#ef4444';

// ─── Sub-components ────────────────────────────────────────────────────────

function TestConnectionBtn({ serviceId }) {
  const [phase, setPhase] = useState('idle'); // idle | loading | success | fail
  const latencyRef = useRef(null);

  const handleTest = () => {
    if (phase !== 'idle') return;
    setPhase('loading');
    const svc = SERVICES.find(s => s.id === serviceId);
    latencyRef.current = svc ? svc.latency + Math.round((Math.random() - 0.3) * 40) : null;
    setTimeout(() => {
      setPhase(Math.random() > 0.1 ? 'success' : 'fail');
      setTimeout(() => setPhase('idle'), 3000);
    }, 1500);
  };

  const label = phase === 'loading' ? null : phase === 'success' ? `✓ ${latencyRef.current}ms` : phase === 'fail' ? '✕ Failed' : '🔍 Test Connection';
  const color  = phase === 'success' ? '#10b981' : phase === 'fail' ? '#ef4444' : 'rgba(255,255,255,0.7)';
  const border = phase === 'success' ? '1px solid rgba(16,185,129,0.3)' : phase === 'fail' ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.08)';
  const bg     = phase === 'success' ? 'rgba(16,185,129,0.08)' : phase === 'fail' ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.04)';

  return (
    <button onClick={handleTest} style={{
      width: '100%', padding: '9px', border, borderRadius: '9px', background: bg,
      color, fontFamily: "'DM Mono', monospace", fontSize: '12px', fontWeight: '600',
      cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    }}>
      {phase === 'loading' ? (
        <>
          <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#818cf8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ color: '#818cf8' }}>Testing...</span>
        </>
      ) : label}
    </button>
  );
}

function CreditBar({ percent, lowPulse }) {
  return (
    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        width: `${percent}%`,
        background: barGradient(percent),
        borderRadius: 3,
        transition: 'width 0.8s ease',
        animation: lowPulse ? 'creditPulse 2s ease-in-out infinite' : 'none',
      }} />
    </div>
  );
}

function StatusPill({ status, latency }) {
  const isLow = status === 'low';
  const isOnline = status === 'online';
  const isOffline = status === 'offline';
  const bg    = isLow ? 'rgba(249,115,22,0.12)' : isOnline ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)';
  const color = isLow ? '#f97316' : isOnline ? '#10b981' : '#ef4444';
  const dotAnim = isLow ? 'blink 1.5s infinite' : isOnline ? 'pulseDot 2s infinite' : 'blink 0.8s infinite';
  const label = isLow ? '⚠ Low Credits' : isOnline ? '● Online' : '● Offline';
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, background: bg, fontSize: 11, fontWeight: 700, color, border: `1px solid ${color}22` }}>
      {isOnline && <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, animation: dotAnim, display: 'inline-block' }} />}
      {label}
    </span>
  );
}

function ServiceCard({ svc }) {
  const isLow = svc.credits < 30 || svc.status === 'low';
  const cardBorder = isLow ? '1px solid rgba(249,115,22,0.35)' : '1px solid rgba(255,255,255,0.06)';
  const cardBg     = isLow ? 'rgba(249,115,22,0.04)' : '#0d0d14';
  const shadowGlow  = isLow ? '0 0 0 1px rgba(249,115,22,0.15), 0 4px 24px rgba(249,115,22,0.08)' : 'none';

  const ctx = svc.credits < 30
    ? `~${Math.round(svc.credits * 12)} ${svc.unit} remaining`
    : svc.credits < 60
      ? `~${Math.round(svc.credits * 28)} ${svc.unit} remaining`
      : `~${Math.round(svc.credits * 65)} ${svc.unit} remaining`;

  return (
    <div className="sh-service-card" style={{
      background: cardBg, border: cardBorder, borderRadius: 14, padding: '18px 20px',
      display: 'flex', flexDirection: 'column', gap: 14,
      boxShadow: shadowGlow, transition: 'all 0.15s',
    }}>
      {/* Row 1 — Identity */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>{svc.emoji}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Bricolage Grotesque', sans-serif", color: '#f1f5f9' }}>{svc.name}</div>
            <div style={{ fontSize: 10, color: '#475569', fontFamily: "'DM Mono', monospace", marginTop: 1 }}>{svc.provider}</div>
          </div>
        </div>
        <StatusPill status={svc.status} />
      </div>

      {/* Row 2 — Credits */}
      {svc.unlimited ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981', fontSize: 11, fontWeight: 700 }}>PLAN: Unlimited</span>
          <span style={{ fontSize: 11, color: '#475569' }}>No credit tracking needed</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#475569' }}>Credits Remaining</span>
            <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "'DM Mono', monospace", color: barColor(svc.credits) }}>{svc.credits}%</span>
          </div>
          <CreditBar percent={svc.credits} lowPulse={svc.credits < 30} />
          <div style={{ fontSize: 11, color: '#475569' }}>{ctx}</div>
        </div>
      )}

      {/* Row 3 — Ping */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: "'DM Mono', monospace", fontSize: 11. }}>
        <span style={{ color: '#64748b' }}>Last ping: <span style={{ color: '#94a3b8' }}>2s ago</span></span>
        <span style={{ color: '#64748b' }}>Latency: <span style={{ color: latencyColor(svc.latency), fontWeight: 700 }}>{svc.latency}ms</span></span>
      </div>

      {/* Row 4 — Test */}
      <TestConnectionBtn serviceId={svc.id} />
    </div>
  );
}

function SparklineRow({ svc, pings }) {
  const [tooltip, setTooltip] = useState(null);
  const maxMs = Math.max(...pings.map(p => p.ms));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
      <div style={{ width: 120, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 14 }}>{svc.emoji}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>{svc.name}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 3, height: 36, position: 'relative' }}>
        {pings.map((p, i) => (
          <div
            key={i}
            onMouseEnter={(e) => setTooltip({ i, p, rect: e.target.getBoundingClientRect() })}
            onMouseLeave={() => setTooltip(null)}
            style={{
              flex: 1, height: `${Math.max(12, Math.round((p.ms / maxMs) * 36))}px`,
              background: pingBarColor(p.ms), borderRadius: '2px 2px 0 0', cursor: 'pointer',
              transition: 'opacity 0.15s', opacity: tooltip?.i === i ? 1 : 0.7,
            }}
          />
        ))}
        {tooltip && (
          <div style={{
            position: 'fixed', top: tooltip.rect.top - 46, left: tooltip.rect.left - 20,
            background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7,
            padding: '5px 10px', fontSize: 11, color: '#e2e8f0', whiteSpace: 'nowrap',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)', zIndex: 999, pointerEvents: 'none',
          }}>
            <span style={{ fontWeight: 700, fontFamily: "'DM Mono', monospace", color: pingBarColor(tooltip.p.ms) }}>{tooltip.p.ms}ms</span>
            <span style={{ color: '#64748b', marginLeft: 6 }}>{tooltip.p.ts}</span>
          </div>
        )}
      </div>
      <div style={{ width: 52, textAlign: 'right', fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700, color: latencyColor(pings[pings.length - 1].ms) }}>
        {pings[pings.length - 1].ms}ms
      </div>
    </div>
  );
}

function ConnectModal({ service, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 500,
      display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#0d0d14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16,
        padding: '32px', width: 400, boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        animation: 'slideDown 0.25s ease',
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>{service.emoji}</div>
        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 700, margin: '0 0 8px', color: '#f1f5f9' }}>Connect {service.name}</h3>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px' }}>OAuth flow would open here — redirecting to {service.name} authorization page.</p>
        <div style={{ padding: '12px 16px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, fontSize: 12, color: '#818cf8', marginBottom: 20 }}>
          🔐 You would be redirected to {service.name} to grant permissions for AutoReel to post on your behalf.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#64748b', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          <button style={{ flex: 2, padding: '11px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', border: 'none', borderRadius: 10, color: '#fff', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}>Continue to {service.name}</button>
        </div>
      </div>
    </div>
  );
}

function JobCard({ job, index }) {
  const borderColor = job.status === 'processing' ? '#6366f1' : job.status === 'done' ? '#10b981' : '#ef4444';
  const chipBg      = job.status === 'processing' ? 'rgba(99,102,241,0.1)' : job.status === 'done' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)';
  const chipColor   = job.status === 'processing' ? '#818cf8' : job.status === 'done' ? '#10b981' : '#ef4444';
  const chipLabel   = job.status === 'processing' ? '⟳ Processing' : job.status === 'done' ? '✓ Done' : '✕ Failed';
  const cardBg      = job.uploadFail ? 'rgba(251,191,36,0.03)' : 'var(--surface, #0d0d14)';

  return (
    <div style={{
      background: cardBg,
      border: '1px solid rgba(255,255,255,0.06)',
      borderLeft: `3px solid ${borderColor}`,
      borderRadius: 12,
      padding: '12px 14px',
      animation: `slideInRight 0.3s ease ${index * 60}ms both`,
      transition: 'background 0.15s',
      cursor: 'default',
    }}
    onMouseEnter={e => e.currentTarget.style.background = '#12121c'}
    onMouseLeave={e => e.currentTarget.style.background = cardBg}
    >
      {/* Row 1 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</span>
        <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: chipBg, color: chipColor, border: `1px solid ${chipColor}22`, whiteSpace: 'nowrap' }}>{chipLabel}</span>
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#475569', marginBottom: 8 }}>
        <span>🌐 {job.lang}</span><span>·</span><span>♪ {job.voice}</span><span>·</span><span>⏱ {job.dur}</span>
      </div>

      {/* Processing: step + shimmer bar */}
      {job.status === 'processing' && (
        <>
          <div style={{ fontSize: 11, color: '#818cf8', fontStyle: 'italic', marginBottom: 8 }}>{job.step}</div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, #6366f1, #a78bfa)', borderRadius: 3, animation: 'shimmerBar 2.5s ease-in-out infinite' }} />
          </div>
        </>
      )}

      {/* Script preview */}
      {job.preview && (
        <div style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic', lineHeight: 1.4, marginBottom: 8, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>"{job.preview}"</div>
      )}

      {/* Error */}
      {job.error && (
        <div style={{ fontSize: 11, color: '#ef4444', fontStyle: 'italic', marginBottom: 8 }}>⚠ {job.error}</div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {job.status === 'done' && (
          <button style={{ padding: '4px 10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 7, color: '#a5b4fc', fontFamily: 'inherit', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>⬇ Download</button>
        )}
        {job.uploadFail && (
          <button style={{ padding: '4px 10px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 7, color: '#fbbf24', fontFamily: 'inherit', fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>⚠ Upload Failed</button>
        )}
        {job.status === 'failed' && (
          <button style={{ padding: '4px 10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 7, color: '#ef4444', fontFamily: 'inherit', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>↻ Retry</button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#475569', fontFamily: "'DM Mono', monospace" }}>{job.time}</span>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function SystemHealthView({ jobs = [], onRefreshJobs }) {
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [alertSliding, setAlertSliding] = useState(false);
  const [lastChecked, setLastChecked] = useState(2);
  const [refreshing, setRefreshing] = useState(false);
  const [statusBannerState, setStatusBannerState] = useState('checking'); // 'ok' | 'warning' | 'critical' | 'checking'
  const [pings, setPings] = useState(INITIAL_PINGS);
  const [connectModal, setConnectModal] = useState(null);
  const [jobFilter, setJobFilter] = useState('all');
  const [jobsRefreshing, setJobsRefreshing] = useState(false);
  const refreshIconRef = useRef(null);
  const jobsRefreshIconRef = useRef(null);

  // Low credit services
  const lowServices = SERVICES.filter(s => !s.unlimited && s.credits < 30);

  // Status determination
  useEffect(() => {
    const t = setTimeout(() => {
      if (lowServices.some(s => s.credits < 20)) setStatusBannerState('critical');
      else if (lowServices.length > 0) setStatusBannerState('warning');
      else setStatusBannerState('ok');
    }, 500);
    return () => clearTimeout(t);
  }, []);

  // "Last checked" ticker
  useEffect(() => {
    const t = setInterval(() => setLastChecked(p => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const handleDismissAlert = () => {
    setAlertSliding(true);
    setTimeout(() => setAlertDismissed(true), 300);
  };

  const handleRefreshAll = () => {
    setRefreshing(true);
    if (refreshIconRef.current) refreshIconRef.current.style.transform = 'rotate(360deg)';
    setStatusBannerState('checking');
    setPings(Object.fromEntries(SERVICES.map(s => [s.id, generatePings(s.latency)])));
    setTimeout(() => {
      setRefreshing(false);
      setLastChecked(0);
      if (refreshIconRef.current) refreshIconRef.current.style.transform = 'rotate(0deg)';
      setStatusBannerState('warning');
    }, 2000);
  };

  const handleJobsRefresh = () => {
    setJobsRefreshing(true);
    if (onRefreshJobs) onRefreshJobs();
    if (jobsRefreshIconRef.current) {
      jobsRefreshIconRef.current.style.transition = 'transform 0.5s ease';
      jobsRefreshIconRef.current.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        if (jobsRefreshIconRef.current) jobsRefreshIconRef.current.style.transform = 'rotate(0deg)';
      }, 500);
    }
    setTimeout(() => setJobsRefreshing(false), 1000);
  };

  const mappedJobs = jobs.map(j => {
    let s = 'processing';
    if (j.status === 'COMPLETED') s = 'done';
    else if (j.status === 'FAILED' || j.status === 'CANCELLED') s = 'failed';
    
    const timeAgo = () => {
      if (!j.createdAt) return 'Just now';
      const sec = Math.floor((new Date() - new Date(j.createdAt))/1000);
      if (sec < 60) return `${sec}s ago`;
      if (sec < 3600) return `${Math.floor(sec/60)}m ago`;
      return `${Math.floor(sec/3600)}h ago`;
    };

    return {
      id: j.id,
      title: j.topic || j.prompt || 'AI Generating...',
      status: s,
      lang: j.language || 'en-US',
      voice: j.voice || 'male',
      dur: '60s',
      step: j.currentStep || 'Processing...',
      time: timeAgo(),
      preview: null,
      error: j.lastError || j.error || null,
      uploadFail: false
    };
  });

  const filteredJobs = mappedJobs.filter(j => {
    if (jobFilter === 'all') return true;
    if (jobFilter === 'done') return j.status === 'done';
    if (jobFilter === 'active') return j.status === 'processing';
    if (jobFilter === 'failed') return j.status === 'failed';
    return true;
  });

  const formatChecked = (s) => s < 60 ? `${s}s ago` : `${Math.floor(s / 60)}m ago`;

  // Status banner configs
  const statusConfig = {
    ok:       { border: '#10b981', bg: 'rgba(16,185,129,0.06)', dot: '#10b981', title: '✅ All 7 Services Operational', sub: 'All AI integrations are responding normally · Avg latency 161ms' },
    warning:  { border: '#f59e0b', bg: 'rgba(245,158,11,0.06)',  dot: '#f59e0b', title: '⚠ 1 Service Needs Attention',   sub: 'RunwayML credits at 34% — consider topping up' },
    critical: { border: '#ef4444', bg: 'rgba(239,68,68,0.06)',   dot: '#ef4444', title: '🔴 Service Offline',             sub: 'One or more services are unreachable' },
    checking: { border: '#6366f1', bg: 'rgba(99,102,241,0.06)', dot: '#6366f1', title: 'Checking all services...', sub: 'Pinging AI integrations' },
  };
  const sc = statusConfig[statusBannerState] || statusConfig.ok;

  const INTEGRATIONS = [
    { emoji: '▶', name: 'YouTube Shorts', connected: true,  autoPost: true,  lastPost: '2hr ago' },
    { emoji: '🎵', name: 'TikTok',         connected: true,  autoPost: true,  lastPost: '45min ago' },
    { emoji: '📸', name: 'Instagram',      connected: false, autoPost: false, lastPost: null },
  ];

  return (
    <>
      {/* Inline styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
        @keyframes slideDownAlert { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideUpAlert   { from { transform: translateY(0); opacity: 1; } to { transform: translateY(-100%); opacity: 0; } }
        @keyframes spin           { to { transform: rotate(360deg); } }
        @keyframes pulseDot       { 0%{box-shadow:0 0 0 0 currentColor}70%{box-shadow:0 0 0 6px transparent}100%{box-shadow:0 0 0 0 transparent} }
        @keyframes creditPulse    { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes shimmerBar     { 0%{width:15%;margin-left:0} 50%{width:75%;margin-left:10%} 100%{width:15%;margin-left:75%} }
        @keyframes slideInRight   { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideDown      { from{opacity:0;transform:translateY(-12px)scale(.97)} to{opacity:1;transform:translateY(0)scale(1)} }
        @keyframes pulseGlowDot   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }
        .sh-service-card:hover    { border-color: rgba(255,255,255,0.12) !important; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important; }
        .sh-filter-tab            { padding:5px 14px; border-radius:20px; font-size:11px; font-weight:600; cursor:pointer; border:none; background:transparent; font-family:inherit; color:#475569; transition:all 0.15s; }
        .sh-filter-tab:hover:not(.sh-filter-tab-active) { color:#94a3b8; }
        .sh-filter-tab-active     { background:#1a1a26; color:#f1f5f9; border:1px solid rgba(255,255,255,0.1) !important; }
        .sh-int-row:hover        { background: rgba(255,255,255,0.02); }
      `}</style>

      <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

        {/* ── CENTER CONTENT ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px 40px' }}>

          {/* STICKY ALERT BANNER */}
          {!alertDismissed && lowServices.length > 0 && (
            <div style={{
              position: 'sticky', top: 0, zIndex: 50, marginBottom: 20, marginLeft: -28, marginRight: -28, marginTop: 0,
              animation: alertSliding ? 'slideUpAlert 0.3s ease forwards' : 'slideDownAlert 0.3s ease',
            }}>
              <div style={{
                borderLeft: '4px solid #f97316',
                background: 'rgba(249,115,22,0.08)',
                padding: '12px 20px',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(249,115,22,0.2)', border: '1px solid rgba(249,115,22,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, flexShrink: 0, color: '#f97316',
                }}>⚠</div>
                <div style={{ flex: 1, fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>
                  {lowServices.length === 1
                    ? `RunwayML credits critically low (${lowServices[0].credits}%) — your video generation may fail soon`
                    : `${lowServices.length} services need attention — ${lowServices.map(s => `${s.name} (${s.credits}%)`).join(', ')}`
                  }
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                  <a href="#" style={{ color: '#f97316', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Top up now →</a>
                  <button onClick={handleDismissAlert} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 4, transition: 'color 0.15s' }}
                    onMouseEnter={e => e.target.style.color = '#e2e8f0'} onMouseLeave={e => e.target.style.color = '#64748b'}>✕</button>
                </div>
              </div>
            </div>
          )}

          {/* PAGE HEADER */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, marginTop: 24 }}>
            <div>
              <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#f1f5f9' }}>⚙ System </span>
                <span style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Health</span>
              </h1>
              <p style={{ fontSize: 13, color: '#475569', margin: '6px 0 0', fontFamily: 'inherit' }}>Real-time monitoring for all AI service integrations</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <span style={{ fontSize: 12, color: '#475569', fontFamily: "'DM Mono', monospace" }}>Last checked: {formatChecked(lastChecked)}</span>
              <button
                onClick={handleRefreshAll}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', background: 'transparent',
                  border: '1px solid rgba(99,102,241,0.4)', borderRadius: 9,
                  color: '#818cf8', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.7)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span ref={refreshIconRef} style={{ display: 'inline-block', transition: 'transform 0.6s ease', fontSize: 14 }}>↻</span>
                {refreshing ? 'Checking...' : '↻ Refresh All'}
              </button>
            </div>
          </div>

          {/* OVERALL STATUS BANNER */}
          <div style={{
            borderLeft: `4px solid ${sc.border}`,
            background: sc.bg,
            borderRadius: '0 12px 12px 0',
            padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 28, border: `1px solid ${sc.border}22`,
            borderLeftWidth: 4,
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 3 }}>{sc.title}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{sc.sub}</div>
            </div>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: sc.dot, flexShrink: 0, animation: 'pulseGlowDot 2s ease-in-out infinite', boxShadow: `0 0 0 4px ${sc.dot}22` }} />
          </div>

          {/* 7 SERVICE CARDS — 2-col grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 36 }}>
            {SERVICES.map(svc => <ServiceCard key={svc.id} svc={svc} />)}
          </div>

          {/* RESPONSE TIME SPARKLINES */}
          <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px 24px', marginBottom: 28 }}>
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: '#f1f5f9' }}>📈 Response Time History</h3>
            <p style={{ fontSize: 12, color: '#475569', margin: '-8px 0 16px' }}>Last 10 pings per service</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SERVICES.map(svc => (
                <SparklineRow key={svc.id} svc={svc} pings={pings[svc.id]} />
              ))}
            </div>
          </div>

          {/* INTEGRATION STATUS TABLE */}
          <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700, margin: 0, color: '#f1f5f9' }}>🔗 Integration Status</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {['Platform', 'Connected', 'Auto-Post', 'Last Post', 'Action'].map(h => (
                    <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#475569' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INTEGRATIONS.map(intg => (
                  <tr key={intg.name} className="sh-int-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}>
                    <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{intg.emoji} {intg.name}</td>
                    <td style={{ padding: '14px 20px' }}>
                      {intg.connected
                        ? <span style={{ fontSize: 13, color: '#10b981' }}>✓ Connected</span>
                        : <span style={{ fontSize: 13, color: '#475569' }}>✗ Not connected</span>
                      }
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      {intg.autoPost
                        ? <span style={{ fontSize: 13, color: '#10b981' }}>✓ Enabled</span>
                        : <span style={{ fontSize: 13, color: '#475569' }}>—</span>
                      }
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b', fontFamily: "'DM Mono', monospace" }}>{intg.lastPost || '—'}</td>
                    <td style={{ padding: '14px 20px' }}>
                      {intg.connected
                        ? <button style={{ background: 'none', border: 'none', color: '#475569', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.15s', padding: 0 }}
                            onMouseEnter={e => e.target.style.color = '#ef4444'} onMouseLeave={e => e.target.style.color = '#475569'}>Disconnect</button>
                        : <button onClick={() => setConnectModal(intg)} style={{ padding: '5px 12px', background: 'transparent', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 8, color: '#818cf8', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>+ Connect</button>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── RIGHT JOBS PANEL ── */}
        <div style={{
          width: 320, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'hidden',
          background: '#08080f',
        }}>
          {/* Jobs header */}
          <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(8,8,15,0.9)', backdropFilter: 'blur(10px)', zIndex: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
              Jobs
              <span style={{ padding: '2px 9px', borderRadius: 20, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', fontSize: 11, fontWeight: 700, color: '#818cf8' }}>{mappedJobs.length}</span>
            </div>
            <button
              onClick={handleJobsRefresh}
              style={{ width: 30, height: 30, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, color: '#64748b', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#94a3b8'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#64748b'; }}
            >
              <span ref={jobsRefreshIconRef} style={{ display: 'inline-block' }}>↻</span>
            </button>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 4, padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {['All', 'Done', 'Active', 'Failed'].map(tab => (
              <button
                key={tab}
                onClick={() => setJobFilter(tab.toLowerCase())}
                className={`sh-filter-tab${jobFilter === tab.toLowerCase() ? ' sh-filter-tab-active' : ''}`}
                style={{ border: jobFilter === tab.toLowerCase() ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent' }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Job cards */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredJobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
            {filteredJobs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#475569', fontSize: 13 }}>No {jobFilter} jobs</div>
            )}
          </div>
        </div>
      </div>

      {/* Connect modal */}
      {connectModal && <ConnectModal service={connectModal} onClose={() => setConnectModal(null)} />}
    </>
  );
}
