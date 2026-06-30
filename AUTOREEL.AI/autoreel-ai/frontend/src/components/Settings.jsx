import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const TABS = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'billing', label: 'Plan & Billing', icon: '💳' },
  { id: 'platforms', label: 'Platforms', icon: '🔗' },
  { id: 'apikeys', label: 'API Keys', icon: '🔑' },
  { id: 'webhooks', label: 'Webhooks', icon: '🪝' },
  { id: 'defaults', label: 'Generation Defaults', icon: '⚙️' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'appearance', label: 'Appearance', icon: '💅' }
];

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export default function Settings({ initialTab = 'profile' }) {
  const { showToast } = useToast();
  // Try to match the initialTab to a valid sub-tab, otherwise default to 'profile'
  const startTab = TABS.find(t => t.id === initialTab) ? initialTab : 'profile';
  const [activeTab, setActiveTab] = useState(startTab);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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

  // Re-sync if parent forces changing via sidebar/topbar clicking 
  useEffect(() => {
    if (TABS.find(t => t.id === initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const markChanged = () => setHasUnsavedChanges(true);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasUnsavedChanges(false);
      showToast('success', '✓', 'Settings saved successfully');
    }, 800);
  };

  const handleYouTubeAuth = async () => {
    try {
      showToast('info', '↻', 'Fetching YouTube Auth URL...');
      const res = await fetch(`${API}/api/youtube/auth`);
      const data = await res.json();
      if (data.success && data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        showToast('error', '❌', 'Failed to get Auth URL');
      }
    } catch (err) {
      showToast('error', '❌', 'Error: ' + err.message);
    }
  };

  const handleYouTubeDisconnect = async () => {
    if (!window.confirm("Disconnect YouTube? You won't be able to auto-post.")) return;
    try {
      const res = await fetch(`${API}/api/youtube/disconnect`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('success', '✓', 'YouTube disconnected');
        fetchYoutubeStatus();
      }
    } catch (err) {
      showToast('error', '❌', 'Failed to disconnect');
    }
  };

  const handleSimulateOAuth = (platform) => {
    if (platform === 'YouTube') {
      handleYouTubeAuth();
      return;
    }
    showToast('info', '↻', `Redirecting to ${platform} securely...`);
    setTimeout(() => {
      showToast('success', '✓', `${platform} Connected successfully!`);
    }, 1500);
  };

  return (
    <motion.main 
      className="center" id="settings-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <div className="page-title">⚙️ <span>Settings</span></div>
          <div className="page-sub">Manage your application preferences and account details</div>
        </div>
      </div>

      <div className="settings-layout">
        {/* SETTINGS NAV */}
        <aside className="settings-nav">
          {TABS.map(tab => (
            <motion.button 
              key={tab.id} 
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              className={`settings-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={{ fontSize: 16 }}>{tab.icon}</span> {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="active-pill"
                  style={{ position: 'absolute', left: 0, width: 3, height: 20, background: 'var(--accent)', borderRadius: 2 }}
                />
              )}
            </motion.button>
          ))}
        </aside>

        {/* SETTINGS CONTENT */}
        <div className="settings-content">
          <AnimatePresence mode="wait">
          
            {/* 1. PROFILE TAB */}
            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="settings-card"
              >
                <h3>Profile Information</h3>
                <p className="sub">Update your personal details and public profile.</p>

                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800 }}>A</div>
                    <div style={{ position: "absolute", bottom: -4, right: -4, background: "var(--surface2)", borderRadius: "50%", padding: 6, border: "1px solid var(--border)", cursor: "pointer", fontSize: 12 }}>📷</div>
                  </div>
                  <div>
                    <button className="v-btn" style={{ padding: "8px 16px", marginBottom: 8 }}>Upload New Avatar</button>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>JPG, GIF or PNG. 2MB max.</div>
                  </div>
                </div>

                <div className="options-row grid-responsive-2" style={{ gap: "20px", marginBottom: 20 }}>
                  <div className="opt-group">
                    <label>Full Name</label>
                    <input type="text" className="topic-input" defaultValue="Ashu" onChange={markChanged} />
                  </div>
                  <div className="opt-group">
                    <label>Email Address</label>
                    <input type="email" className="topic-input" defaultValue="ashu@autoreel.ai" disabled style={{ opacity: 0.6 }} />
                  </div>
                  <div className="opt-group">
                    <label>Timezone</label>
                    <div className="sel-wrap">
                      <select onChange={markChanged} defaultValue="Asia/Kolkata">
                        <option value="America/New_York">EST (America/New_York)</option>
                        <option value="Europe/London">GMT (Europe/London)</option>
                        <option value="Asia/Kolkata">IST (Asia/Kolkata)</option>
                      </select>
                    </div>
                  </div>
                  <div className="opt-group">
                    <label>Bio (Optional)</label>
                    <input type="text" className="topic-input" placeholder="Adding a bio..." onChange={markChanged} />
                  </div>
                </div>

                <div className="divider" style={{ margin: "24px 0" }}></div>
                
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: 14 }}>Two-Factor Authentication (2FA)</h4>
                    <p style={{ margin: 0, fontSize: 12, color: "var(--text3)" }}>Enhance your account security.</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" onChange={markChanged} />
                    <span className="slider round"></span>
                  </label>
                </div>
              </motion.div>
            )}

            {/* 2. PLAN & BILLING TAB */}
            {activeTab === 'billing' && (
              <motion.div 
                key="billing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="settings-card"
              >
                <h3>Plan & Billing</h3>
                <p className="sub">Manage your subscription and usage.</p>

                <div className="stats-row" style={{ marginBottom: 24 }}>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="stat-card" style={{ gridColumn: "span 2", background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(249,115,22,0.1))", borderColor: "rgba(99,102,241,0.3)" }}>
                    <div className="stat-label" style={{ color: "var(--text)" }}>Current Plan</div>
                    <div className="stat-val accent">Pro Tier</div>
                    <div className="stat-change up" style={{ color: "var(--text2)" }}>Renews automatically on April 22</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="stat-card" style={{ gridColumn: "span 2" }}>
                    <div className="stat-label">Credits Remaining</div>
                    <div className="stat-val green">320 / 1000</div>
                    <div className="stat-change" style={{ marginTop: 8 }}>
                      <div className="job-progress" style={{ marginBottom: 0 }}><div className="job-progress-fill" style={{ width: '68%' }}></div></div>
                    </div>
                  </motion.div>
                </div>

                <h4 style={{ margin: "32px 0 12px", fontSize: 14 }}>Billing History</h4>
                <div style={{ background: "var(--surface2)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
                  {['Mar 2026', 'Feb 2026', 'Jan 2026'].map((date, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ backgroundColor: "var(--surface3)" }}
                      style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: i < 2 ? "1px solid var(--border)" : "none", transition: 'background 0.2s' }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 500 }}>Pro Tier — $49.00</div>
                      <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text3)" }}>
                        <span>{date}</span>
                        <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}>Invoice ↗</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 3. PLATFORMS TAB */}
            {activeTab === 'platforms' && (
              <motion.div 
                key="platforms"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="settings-card"
              >
                <h3>Connected Platforms</h3>
                <p className="sub">Link AutoReel to automatically publish your content.</p>

                <div style={{ display: "grid", gap: 16 }}>
                  {[
                    { 
                      id: "youtube",
                      name: "YouTube", 
                      handle: youtubeStatus.status === "Connected" ? "@AutoReelGen" : "", 
                      status: youtubeStatus.status === "Connected" ? "Connected" : "Connect", 
                      icon: "▶️", 
                      color: "var(--red)" 
                    },
                    { name: "TikTok", handle: "@autoreel_viral", status: "Connected", icon: "🎵", color: "var(--green)" },
                    { name: "Instagram Reels", handle: "", status: "Connect", icon: "📷", color: "var(--orange)" }
                  ].map(int => (
                    <motion.div 
                      key={int.name} 
                      whileHover={{ y: -4, borderColor: "var(--accent-soft)" }}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 20, background: "var(--surface2)", borderRadius: 12, border: "1px solid var(--border)" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ fontSize: 32 }}>{int.icon}</div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                            {int.name}
                            {int.status === "Connected" && <span style={{ fontSize: 9, padding: "2px 6px", background: "var(--green-soft)", color: "var(--green)", borderRadius: 10, textTransform: "uppercase" }}>Connected</span>}
                          </h4>
                          <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text3)" }}>
                            {int.status === "Connected" ? `Posting as ${int.handle}` : "Not connected yet"}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        {int.status === "Connected" && (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 11, color: "var(--text3)" }}>Auto-post</span>
                            <label className="switch small">
                              <input type="checkbox" defaultChecked onChange={markChanged} />
                              <span className="slider round"></span>
                            </label>
                          </div>
                        )}
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn-pause-s" 
                          style={int.status === "Connected" ? {} : { background: "var(--accent-soft)", borderColor: "rgba(99,102,241,0.3)", color: "#a5b4fc" }}
                          onClick={() => {
                            if (int.id === 'youtube') {
                              if (int.status === 'Connected') handleYouTubeDisconnect();
                              else handleYouTubeAuth();
                            } else {
                              if (int.status === "Connect") handleSimulateOAuth(int.name);
                              else markChanged();
                            }
                          }}
                        >
                          {int.status === "Connected" ? "Disconnect" : "Connect Account"}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 4. API KEYS TAB */}
            {activeTab === 'apikeys' && (
              <motion.div 
                key="apikeys"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="settings-card"
              >
                <h3>Developer API Keys</h3>
                <p className="sub">Manage keys for programmatic access to the AutoReel engine.</p>

                <div style={{ background: "var(--surface2)", padding: 20, borderRadius: 12, border: "1px solid var(--border)" }}>
                  <h4 style={{ margin: "0 0 12px", fontSize: 14 }}>Production Key</h4>
                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    <input type="password" value="sk_live_1234567890abcdef" readOnly className="topic-input" style={{ flex: 1, fontFamily: "monospace", opacity: 0.8 }} />
                    <motion.button whileTap={{ scale: 0.9 }} className="v-btn" style={{ width: "auto" }}>📋 Copy</motion.button>
                    <motion.button whileTap={{ scale: 0.9 }} className="v-btn" style={{ width: "auto", color: "var(--red)" }}>↻ Regen</motion.button>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>Last used: 2 hours ago · Consumed 45 credits this month.</div>
                </div>
              </motion.div>
            )}

            {/* 5. WEBHOOKS TAB */}
            {activeTab === 'webhooks' && (
              <motion.div 
                key="webhooks"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="settings-card"
              >
                <h3>Webhooks</h3>
                <p className="sub">Send real-time alerts to external servers when jobs complete.</p>
                
                <div className="options-row" style={{ gridTemplateColumns: "1fr", gap: "16px", marginBottom: 20 }}>
                  <div className="opt-group">
                    <label>Endpoint URL</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input type="url" className="topic-input" placeholder="https://api.yourdomain.com/webhook" onChange={markChanged} style={{ flex: 1 }} />
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="v-btn" style={{ width: "auto" }} onClick={() => showToast('info', '🪝', 'Test payload sent!')}>Test</motion.button>
                    </div>
                  </div>
                  <div className="opt-group">
                    <label>Events to send</label>
                    <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, textTransform: "none", fontWeight: 500 }}><input type="checkbox" defaultChecked onChange={markChanged} /> Job Completed</label>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, textTransform: "none", fontWeight: 500 }}><input type="checkbox" defaultChecked onChange={markChanged} /> Job Failed</label>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, textTransform: "none", fontWeight: 500 }}><input type="checkbox" onChange={markChanged} /> Trending Alert</label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 6. GENERATION DEFAULTS TAB */}
            {activeTab === 'defaults' && (
              <motion.div 
                key="defaults"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="settings-card"
              >
                <h3>Generation Defaults</h3>
                <p className="sub">Set standard parameters so you don't configure them on every reel.</p>
                
                <div className="options-row grid-responsive-2" style={{ gap: "20px", marginBottom: 20 }}>
                  <div className="opt-group">
                    <label>Default Language</label>
                    <div className="sel-wrap">
                      <select onChange={markChanged} defaultValue="en-US">
                        <option value="en-US">English (US)</option><option value="es-ES">Spanish</option><option value="hi-IN">Hindi</option>
                      </select>
                    </div>
                  </div>
                  <div className="opt-group">
                    <label>Default Voice Gender</label>
                    <div className="sel-wrap">
                      <select onChange={markChanged} defaultValue="male">
                        <option value="male">Male</option><option value="female">Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="opt-group">
                    <label>Default Reel Length</label>
                    <div className="sel-wrap">
                      <select onChange={markChanged} defaultValue="60">
                        <option value="30">30 seconds</option><option value="60">60 seconds</option><option value="90">90 seconds</option>
                      </select>
                    </div>
                  </div>
                  <div className="opt-group">
                    <label>Video Resolution</label>
                    <div className="sel-wrap">
                      <select onChange={markChanged} defaultValue="1080p">
                        <option value="1080p">1080x1920 (9:16)</option><option value="4k">4K (Vertical)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 7. NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <motion.div 
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="settings-card"
              >
                <h3>Notifications</h3>
                <p className="sub">Control what alerts you receive and how.</p>

                <div style={{ display: "grid", gap: 16 }}>
                  {[
                    { label: "Job Completion", sub: "When a reel finishes rendering", email: true, push: true },
                    { label: "Job Failure", sub: "When a render errors out", email: true, push: true },
                    { label: "Trending Alerts", sub: "When a new topic goes viral", email: false, push: true },
                    { label: "Weekly Digest", sub: "Summary of your channel's performance", email: true, push: false },
                  ].map((notif, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 5 }}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 16, borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}
                    >
                      <div>
                        <h4 style={{ margin: "0 0 4px", fontSize: 14 }}>{notif.label}</h4>
                        <p style={{ margin: 0, fontSize: 12, color: "var(--text3)" }}>{notif.sub}</p>
                      </div>
                      <div style={{ display: "flex", gap: 24 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text2)" }}>
                          <input type="checkbox" defaultChecked={notif.email} onChange={markChanged} /> Email
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text2)" }}>
                          <input type="checkbox" defaultChecked={notif.push} onChange={markChanged} /> Push
                        </label>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 8. APPEARANCE TAB */}
            {activeTab === 'appearance' && (
              <motion.div 
                key="appearance"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="settings-card"
              >
                <h3>Appearance</h3>
                <p className="sub">Customize the look and feel of the dashboard.</p>
                
                <div className="options-row" style={{ gridTemplateColumns: "1fr", gap: "24px", marginBottom: 20 }}>
                  <div className="opt-group">
                    <label>Theme</label>
                    <div style={{ display: "flex", gap: 16 }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, textTransform: "none" }}><input type="radio" name="theme" defaultChecked onChange={markChanged} /> Dark</label>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, textTransform: "none" }}><input type="radio" name="theme" onChange={markChanged} /> Light (Beta)</label>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, textTransform: "none" }}><input type="radio" name="theme" onChange={markChanged} /> System</label>
                    </div>
                  </div>
                  <div className="opt-group">
                    <label>Reduced Motion</label>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface2)", padding: "12px 16px", borderRadius: 10, border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 12, color: "var(--text2)" }}>Disable background animations and transitions.</div>
                      <label className="switch small">
                        <input type="checkbox" onChange={markChanged} />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                  <div className="opt-group">
                    <label>Compact Mode</label>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface2)", padding: "12px 16px", borderRadius: 10, border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 12, color: "var(--text2)" }}>Reduce padding and list spacings.</div>
                      <label className="switch small">
                        <input type="checkbox" onChange={markChanged} />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* STICKY SAVE BAR */}
      <AnimatePresence>
        {hasUnsavedChanges && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="save-bar visible"
          >
            <div className="save-text">Careful — you have unsaved changes!</div>
            <div style={{ display: "flex", gap: 10 }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="sm-btn secondary" style={{ padding: "6px 16px", minWidth: 80 }} onClick={() => setHasUnsavedChanges(false)}>Reset</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="sm-btn primary" style={{ padding: "6px 16px", minWidth: 100 }} onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.main>
  );
}
