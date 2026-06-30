import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../context/ToastContext";

/* ─── Static mock data ─────────────────────────────────────────────────── */
const PROFILE = {
  name: "Ashu",
  username: "@ashu_autoreel",
  email: "ashu@autoreel.ai",
  location: "Nagpur, India",
  timezone: "IST (UTC+5:30)",
  plan: "Pro Plan",
  memberSince: "March 2026",
};

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const STATS = [
  { label: "Total Reels Generated", value: "967",  color: "#6366f1" },
  { label: "Videos Auto-Posted",    value: "842",  color: "#f97316" },
  { label: "Platforms Connected",   value: "2",    color: "#10b981" },
  { label: "Credits Used This Month", value: "680", color: "#eab308" },
];

const NOTIFICATIONS = [
  { key: "reel",    label: "Reel completed",         sub: "Get notified when your reel finishes", on: true  },
  { key: "upload",  label: "Upload failed alert",     sub: "Know when auto-posting fails",         on: true  },
  { key: "credits", label: "Credits low warning",     sub: "Alert at 20% remaining",               on: true  },
  { key: "trending",label: "Trending topic alerts",   sub: "Discover viral trends in your niche",  on: true  },
  { key: "weekly",  label: "Weekly report email",     sub: "Summary of views and posts",           on: false },
  { key: "product", label: "Product updates",         sub: "New features and announcements",       on: false },
];

const ACTIVITY = [
  { dot: "#10b981", icon: "✓", text: 'Generated "rags to riches" reel',           time: "15m ago" },
  { dot: "#10b981", icon: "✓", text: 'Generated "motivation" reel',                time: "29m ago" },
  { dot: "#eab308", icon: "⚠", text: 'Auto-upload failed for "motivation (v1)"',   time: "31m ago" },
  { dot: "#10b981", icon: "✓", text: 'Generated "discipline" reel',                time: "42m ago" },
  { dot: "#10b981", icon: "✓", text: 'Generated "emotions" reel',                  time: "1hr ago" },
  { dot: "#ef4444", icon: "✕", text: 'Generation failed — "gemini (v1)" API timeout', time: "2hr ago" },
  { dot: "#10b981", icon: "✓", text: 'Auto-posted "Dark Psychology" to YouTube',   time: "3hr ago" },
  { dot: "#6366f1", icon: "🔔",text: 'Trending alert: "Stoic Morning Routine" +167%', time: "5hr ago" },
];

/* ─── Tiny helpers ─────────────────────────────────────────────────────── */
const Toggle = ({ on, onChange }) => (
  <div
    onClick={onChange}
    style={{
      width: 40, height: 22, borderRadius: 11, cursor: "pointer",
      background: on ? "#10b981" : "#2a2a38",
      position: "relative", transition: "background 0.2s", flexShrink: 0,
    }}
  >
    <motion.div
      animate={{ x: on ? 20 : 2 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 2 }}
    />
  </div>
);

const Card = ({ children, style = {}, glowColor }) => (
  <div
    className="pv-card"
    style={{
      background: "#0d0d14",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 16,
      padding: "22px 24px",
      transition: "border-color 0.18s",
      ...(glowColor ? { boxShadow: `0 0 0 1px ${glowColor}18` } : {}),
      ...style,
    }}
  >
    {children}
  </div>
);

const SectionLabel = ({ text }) => (
  <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569", marginBottom: 5 }}>
    {text}
  </div>
);

const FieldValue = ({ value }) => (
  <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{value || "—"}</div>
);

/* ─── Main Component ────────────────────────────────────────────────────── */
export default function ProfileView() {
  const { showToast } = useToast();
  const [avatarHover, setAvatarHover] = useState(false);
  const [editing, setEditing] = useState(false);
  const [info, setInfo] = useState({ ...PROFILE });
  const [draft, setDraft] = useState({ ...PROFILE });
  const [prefs, setPrefs] = useState({
    category: "Storytelling",
    language: "English (US)",
    voice: "Male",
    length: "60s",
    autoPost: true,
    viralFilter: true,
  });
  const [notifs, setNotifs] = useState(
    Object.fromEntries(NOTIFICATIONS.map(n => [n.key, n.on]))
  );
  const [deleteFlow, setDeleteFlow] = useState(false);
  const [activityPage, setActivityPage] = useState(8);
  const [youtubeStatus, setYoutubeStatus] = useState({ status: 'Loading...' });

  const fetchYoutubeStatus = async () => {
    try {
      const res = await fetch(`${API}/api/youtube/status`);
      const data = await res.json();
      if (data.success) {
        setYoutubeStatus(data);
      }
    } catch (err) {
      console.error("Failed to fetch YouTube status:", err);
      setYoutubeStatus({ status: 'Error' });
    }
  };

  useEffect(() => {
    fetchYoutubeStatus();
  }, []);

  const handleYouTubeAuth = async () => {
    try {
      showToast("info", "↻", "Fetching YouTube Auth URL...");
      const res = await fetch(`${API}/api/youtube/auth`);
      const data = await res.json();
      if (data.success && data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        showToast("error", "✕", "Failed to get Auth URL");
      }
    } catch (err) {
      showToast("error", "✕", "Error: " + err.message);
    }
  };

  const handleYouTubeDisconnect = async () => {
    if (!window.confirm("Disconnect YouTube? You won't be able to auto-post.")) return;
    try {
      const res = await fetch(`${API}/api/youtube/disconnect`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast("success", "✓", "YouTube disconnected");
        fetchYoutubeStatus();
      }
    } catch (err) {
      showToast("error", "✕", "Failed to disconnect");
    }
  };

  const handleSave = () => {
    setInfo({ ...draft });
    setEditing(false);
    showToast("success", "✓", "Profile updated successfully");
  };

  const handleCancel = () => {
    setDraft({ ...info });
    setEditing(false);
    setDeleteFlow(false);
  };

  const inputStyle = {
    width: "100%", padding: "9px 12px", background: "#1a1a26",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9,
    color: "#f1f5f9", fontFamily: "inherit", fontSize: 14, outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div className="pv-fadein" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#f1f5f9", paddingBottom: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
        .pv-card:hover { border-color: rgba(255,255,255,0.1) !important; }
        .pv-input:focus { border-color: rgba(99,102,241,0.5) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
        .pv-act-row:hover { background: rgba(255,255,255,0.02); border-radius: 10px; }
        .pv-plat-row:hover { background: rgba(255,255,255,0.02); border-radius: 10px; }
        .pv-field-row { border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 14px; margin-bottom: 14px; }
        .pv-field-row:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
        @keyframes pv-fadein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .pv-fadein { animation: pv-fadein 0.35s ease both; }
        .pv-two-col { display: grid; grid-template-columns: 280px 1fr; gap: 20px; align-items: start; }
        @media (max-width: 768px) { .pv-two-col { grid-template-columns: 1fr; } }
      `}</style>

      {/* TWO-COLUMN ROW */}
      <div className="pv-two-col">

        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Profile Card */}
          <Card>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
              <div
                style={{ position: "relative", width: 80, height: 80, borderRadius: "50%", cursor: "pointer", flexShrink: 0 }}
                onMouseEnter={() => setAvatarHover(true)}
                onMouseLeave={() => setAvatarHover(false)}
              >
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #f97316)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: "#fff",
                }}>A</div>
                <AnimatePresence>
                  {avatarHover && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{
                        position: "absolute", inset: 0, borderRadius: "50%",
                        background: "rgba(0,0,0,0.55)", display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: 2, fontSize: 13,
                      }}
                    >
                      <span>📷</span>
                      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.06em", color: "#e2e8f0" }}>CHANGE</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div style={{ position: "absolute", bottom: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: "#10b981", border: "2px solid #0d0d14", boxShadow: "0 0 6px #10b981" }} />
              </div>

              <div>
                <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{info.name}</div>
                <div style={{ fontSize: 12, color: "#475569", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{info.username}</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "#64748b" }}>
                <div>📍 {info.location}</div>
                <div>🗓 Member since {info.memberSince}</div>
              </div>

              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "5px 14px", borderRadius: 20,
                background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(129,140,248,0.12))",
                border: "1px solid rgba(99,102,241,0.35)",
                boxShadow: "0 0 16px rgba(99,102,241,0.18)",
                fontSize: 12, fontWeight: 700, color: "#818cf8",
              }}>
                ✦ {info.plan}
              </div>

              <button
                onClick={() => { setEditing(true); setDraft({ ...info }); }}
                style={{
                  width: "100%", padding: "9px", borderRadius: 10,
                  background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8", fontFamily: "inherit", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.18s",
                }}
              >✏ Edit Profile</button>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: "#f1f5f9" }}>📊 Quick Stats</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {STATS.map((s, i) => (
                <div key={s.label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{s.label}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: "12px", background: "rgba(99,102,241,0.06)", borderRadius: 10, border: "1px solid rgba(99,102,241,0.12)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6 }}>
                <span style={{ color: "#64748b" }}>Monthly quota</span>
                <span style={{ fontFamily: "'DM Mono', monospace", color: "#818cf8", fontWeight: 700 }}>680 / 1000</span>
              </div>
              <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: "68%", height: "100%", background: "linear-gradient(90deg, #6366f1, #818cf8)", borderRadius: 3 }} />
              </div>
            </div>
          </Card>

          {/* Connected Platforms */}
          <Card>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: "#f1f5f9" }}>🔗 Connected Platforms</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { id: "youtube", icon: "▶", name: "YouTube", connected: youtubeStatus.status === "Connected" },
                { id: "tiktok", icon: "🎵", name: "TikTok", connected: true },
                { id: "instagram", icon: "📸", name: "Instagram", connected: false },
                { id: "spotify", icon: "🎵", name: "Spotify", connected: false },
              ].map((p, i, arr) => (
                <div key={p.id} className="pv-plat-row" style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 6px",
                  borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 16 }}>{p.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {p.connected ? (
                      <button onClick={() => p.id === 'youtube' ? handleYouTubeDisconnect() : showToast("info", "⌛", "Coming soon!")} style={{ background: "none", border: "none", color: "#475569", fontSize: 11, cursor: "pointer" }}>Disconnect</button>
                    ) : (
                      <button onClick={() => p.id === 'youtube' ? handleYouTubeAuth() : showToast("info", "⌛", "Coming soon!")} style={{ padding: "4px 10px", background: "transparent", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 7, color: "#818cf8", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Connect</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Header */}
          <div>
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 26, fontWeight: 800, margin: 0 }}>👤 Your <span className="gradient-text">Profile</span></h1>
            <p style={{ fontSize: 13, color: "#475569", margin: "6px 0 0" }}>Manage your account, preferences and content settings</p>
          </div>

          {/* Personal Info */}
          <Card>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Personal Information</div>
              {!editing ? (
                <button onClick={() => setEditing(true)} style={{ padding: "5px 12px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, background: "transparent", color: "#818cf8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>✏ Edit</button>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={handleCancel} style={{ padding: "5px 12px", background: "transparent", color: "#64748b", border: "none", cursor: "pointer" }}>Cancel</button>
                  <button onClick={handleSave} style={{ padding: "5px 14px", background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>Save</button>
                </div>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { label: "Full Name", key: "name" },
                { label: "Email", key: "email" },
                { label: "Username", key: "username" },
                { label: "Location", key: "location" },
                { label: "Timezone", key: "timezone" },
              ].map(f => (
                <div key={f.key} className="pv-field-row">
                  <SectionLabel text={f.label} />
                  {editing ? (
                    <input style={inputStyle} value={draft[f.key]} onChange={e => setDraft(p => ({ ...p, [f.key]: e.target.value }))} />
                  ) : (
                    <FieldValue value={info[f.key]} />
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Content Preferences */}
          <Card>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>🎯 Content Preferences</div>
            <div className="grid-responsive-2" style={{ gap: 20 }}>
              <div>
                <SectionLabel text="Default Category" />
                <select style={inputStyle} value={prefs.category} onChange={e => setPrefs(p => ({ ...p, category: e.target.value }))}>
                  <option>Storytelling</option><option>Motivation</option><option>Finance</option>
                </select>
              </div>
              <div>
                <SectionLabel text="Default Voice" />
                <div style={{ display: "flex", gap: 6 }}>
                  {["Male", "Female"].map(v => (
                    <button key={v} onClick={() => setPrefs(p => ({ ...p, voice: v }))} style={{ flex: 1, padding: 8, borderRadius: 8, background: prefs.voice === v ? "rgba(99,102,241,0.1)" : "transparent", border: prefs.voice === v ? "1px solid var(--accent)" : "1px solid var(--border)", color: prefs.voice === v ? "var(--accent)" : "var(--text3)", cursor: "pointer" }}>{v}</button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Activity */}
          <Card>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>📋 Recent Activity</div>
            {ACTIVITY.slice(0, activityPage).map((a, i) => (
              <div key={i} className="pv-act-row" style={{ display: "flex", gap: 12, padding: "8px 4px", fontSize: 13, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <span style={{ color: a.dot }}>{a.icon}</span>
                <span style={{ flex: 1 }}>{a.text}</span>
                <span style={{ color: "#475569", fontSize: 11 }}>{a.time}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

function APIKeyRow({ data, onRevoke }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 16 }}>{data.icon}</span>
        <span style={{ fontSize: 13, fontWeight: 700 }}>{data.label}</span>
      </div>
      <div style={{ fontFamily: "monospace", fontSize: 11, background: "#000", padding: 8, borderRadius: 6, marginBottom: 8 }}>
        {revealed ? data.key.replace(/•/g, "x") : data.key}
      </div>
      <button onClick={() => setRevealed(!revealed)} style={{ fontSize: 11, background: "transparent", color: "var(--accent)", border: "none", cursor: "pointer" }}>{revealed ? "Hide" : "Reveal"}</button>
    </div>
  );
}
