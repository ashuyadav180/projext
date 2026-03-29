import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../context/ToastContext";
import { useSocket } from "../hooks/useSocket";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

/* ── Inline styles ─────────────────────────────────────────────────────── */
const CARD = {
  background: "var(--surface)",
  borderRadius: "24px",
  border: "1px solid var(--border)",
  boxShadow: "var(--shadow-lg)",
  overflow: "hidden",
};

export default function PromptToVideo() {
  const { showToast } = useToast();
  const { connected, lastUpdate } = useSocket();
  const [duration, setDuration] = useState(60);
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [generationType, setGenerationType] = useState("REEL");
  const [currentJob, setCurrentJob] = useState(null);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ── Enhanced script preview state ──────────────────────────────────────
  const [scriptPreview, setScriptPreview] = useState(null); // { enhancedPrompt, script, hook }
  const [showPreview, setShowPreview] = useState(false);

  const durations = [15, 30, 60, 90];
  const textareaRef = useRef(null);

  // ── Auto-resize textarea ───────────────────────────────────────────────
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [prompt]);

  // ── Debounced suggestions ─────────────────────────────────────────────
  useEffect(() => {
    if (prompt.length < 4) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      setSuggesting(true);
      try {
        const res = await axios.post(`${API}/api/ai/suggestions`, { prompt });
        if (res.data.success && res.data.suggestions?.length) {
          setSuggestions(res.data.suggestions.slice(0, 3));
        }
      } catch { /* silent */ }
      finally { setSuggesting(false); }
    }, 700);
    return () => clearTimeout(timer);
  }, [prompt]);

  // ── Job WebSocket ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!lastUpdate || !currentJob) return;

    if (lastUpdate.type === "update" && (lastUpdate.id === currentJob.id || lastUpdate.jobId === currentJob.id)) {
        setCurrentJob(prev => ({ ...prev, ...lastUpdate }));
        
        if (lastUpdate.status === "COMPLETED") {
            setGeneratedVideo(lastUpdate.output?.video);
            setLoading(false);
            showToast("success", "🎬", "Video generation complete!");
        } else if (lastUpdate.status === "FAILED") {
            setLoading(false);
            showToast("error", "✕", lastUpdate.lastError || "Generation failed");
        }
    }
  }, [lastUpdate]);

  /* ── Handlers ─────────────────────────────────────────────────────────── */

  // 🪄 ENHANCE — generate full script preview
  const handleEnhance = async () => {
    if (!prompt.trim()) { showToast("error", "⚠", "Enter a prompt first!"); return; }
    setEnhancing(true);
    showToast("info", "🪄", "Generating AI Script... please wait.");
    setShowPreview(false);
    setScriptPreview(null);
    try {
      const res = await axios.post(`${API}/api/ai/enhance-script`, {
        prompt,
        duration,
        category: "motivation",
      });
      if (res.data.success) {
        setScriptPreview({
          enhancedPrompt: res.data.enhancedPrompt,
          script: res.data.script,
          hook: res.data.hook,
        });
        setShowPreview(true);
        setSuggestions([]);
        showToast("success", "✨", "Script generated! Review below.");
      } else {
        showToast("error", "✕", res.data.error || "Enhancement failed — try again");
      }
    } catch {
      showToast("error", "✕", "Failed to reach AI service");
    } finally {
      setEnhancing(false);
    }
  };

  // 🎬 GENERATE — use the enhanced prompt if available, otherwise raw prompt
  const handleGenerate = async () => {
    const topic = scriptPreview?.enhancedPrompt || prompt;
    if (!topic.trim()) { showToast("error", "⚠", "Enter a prompt first!"); return; }
    setLoading(true);
    setGeneratedVideo(null);
    setCurrentJob(null);
    setShowPreview(false);
    try {
      const res = await axios.post(`${API}/api/jobs`, {
        topic,
        reelDuration: duration,
        type: generationType,
        category: "motivation",
      });
      if (res.data.success) {
        setCurrentJob(res.data.jobs[0]);
        showToast("info", "🚀", "Generation started! Tracking progress below...");
      }
    } catch {
      showToast("error", "✕", "Failed to start generation");
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!currentJob) return;
    setUploading(true);
    try {
      const res = await axios.post(`${API}/api/jobs/${currentJob.id}/upload`);
      if (res.data.success) showToast("success", "📤", "Uploaded to YouTube!");
    } catch (err) {
      showToast("error", "✕", "Upload failed: " + (err.response?.data?.message || err.message));
    } finally { setUploading(false); }
  };

  const handleCancel = async () => {
    if (!currentJob) return;
    setCurrentJob({ ...currentJob, status: "CANCELLED" });
    setLoading(false);
    showToast("info", "🛑", "Cancelling...");
    try { await axios.post(`${API}/api/jobs/${currentJob.id}/cancel`); } catch { /* silent */ }
  };

  const dismissPreview = () => { setShowPreview(false); setScriptPreview(null); };

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={CARD}>

      {/* ── HEADER ── */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 40, background: "linear-gradient(135deg,#6366f1,#a855f7)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✨</div>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Prompt → AI Video</h2>
            <p style={{ margin: 0, fontSize: 11, color: "var(--text3)" }}>Powered by Gemini · Claude · RunwayML</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "var(--green)" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 6px var(--green)" }} />
          Engine ready
        </div>
      </div>

      <div style={{ padding: 24 }}>

        {/* ── PROMPT BOX ─────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, display: "block" }}>
            Describe Your Video
          </label>

          <div style={{ position: "relative" }}>
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. The dark psychology of why people stay poor…"
              style={{
                width: "100%", minHeight: 100, background: "var(--surface2)",
                border: "1px solid var(--border)", borderRadius: 16, padding: "16px 20px",
                color: "var(--text)", fontSize: 14, lineHeight: 1.6, resize: "none",
                outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)", transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
            {suggesting && (
              <div style={{ position: "absolute", right: 14, bottom: 12, fontSize: 11, color: "var(--accent)", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>🪄</motion.span>
                AI thinking...
              </div>
            )}
          </div>
        </div>

        {/* ── SUGGESTIONS ────────────────────────────────────────────────── */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              style={{ marginBottom: 16 }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", marginBottom: 6, letterSpacing: "0.06em" }}>
                💡 Suggestions — click to use
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {suggestions.map((s, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { setPrompt(s); setSuggestions([]); }}
                    style={{
                      padding: "6px 14px", background: "var(--accent-soft)", border: "1px solid rgba(99,102,241,0.25)",
                      borderRadius: 20, fontSize: 12, color: "var(--accent)", cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── GENERATION MODE ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, display: "block" }}>Generation Mode</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { id: "REEL", label: "🎬 Full Cinematic Reel", sub: "Voice + Music + FX + Subtitles" },
              { id: "PROMPT_TO_VIDEO", label: "⚡ Raw B-Roll Clip", sub: "Silent Video Only" },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setGenerationType(m.id)}
                style={{
                  flex: 1, padding: "12px 16px", borderRadius: 12, cursor: "pointer",
                  border: generationType === m.id ? "1px solid var(--accent)" : "1px solid var(--border)",
                  background: generationType === m.id ? "var(--accent-soft)" : "var(--surface2)",
                  color: generationType === m.id ? "var(--accent)" : "var(--text2)",
                  fontSize: 13, fontWeight: 700, textAlign: "left", fontFamily: "inherit", transition: "all 0.18s",
                }}
              >
                <div style={{ marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 10, fontWeight: 500, color: generationType === m.id ? "var(--accent)" : "var(--text3)" }}>{m.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── DURATION ───────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, display: "block" }}>Video Duration</label>
          <div style={{ display: "flex", gap: 8 }}>
            {durations.map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                style={{
                  flex: 1, padding: "9px 4px", borderRadius: 10, cursor: "pointer",
                  border: duration === d ? "1px solid var(--accent)" : "1px solid var(--border)",
                  background: duration === d ? "var(--accent-soft)" : "var(--surface2)",
                  color: duration === d ? "var(--accent)" : "var(--text2)",
                  fontSize: 13, fontWeight: 700, fontFamily: "inherit", transition: "all 0.18s",
                }}
              >{d}s</button>
            ))}
          </div>
        </div>

        {/* ── ACTIONS ────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 10 }}>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleEnhance}
            disabled={enhancing || loading}
            style={{
              flex: 1, padding: "14px", borderRadius: 12, border: "1px solid rgba(168,85,247,0.35)",
              background: enhancing ? "rgba(168,85,247,0.08)" : "transparent",
              color: "var(--text)", fontWeight: 700, cursor: enhancing ? "default" : "pointer",
              fontFamily: "inherit", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              transition: "all 0.2s",
            }}
          >
            {enhancing
              ? <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>✨</motion.span> Generating Script...</>
              : "✨ Enhance + Preview Script"
            }
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={loading || enhancing}
            style={{
              flex: 2, padding: "14px", borderRadius: 12, border: "none",
              background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "#fff", fontWeight: 700, cursor: loading ? "default" : "pointer",
              fontFamily: "inherit", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            {loading ? "⏳ Rendering..." : "🎬 Generate Video"}
          </motion.button>
        </div>

        {/* ── SCRIPT PREVIEW BAR ─────────────────────────────────────────── */}
        <AnimatePresence>
          {showPreview && scriptPreview && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              style={{
                marginTop: 20,
                background: "linear-gradient(135deg, rgba(99,102,241,0.07), rgba(168,85,247,0.04))",
                border: "1px solid rgba(99,102,241,0.3)",
                borderRadius: 18,
                overflow: "hidden",
              }}
            >
              {/* Preview header */}
              <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    AI Script Ready — Review Before Generating
                  </span>
                </div>
                <button
                  onClick={dismissPreview}
                  style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 16, padding: "0 4px" }}
                >✕</button>
              </div>

              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>

                {/* Enhanced prompt pill */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                    🎯 Enhanced Prompt
                  </div>
                  <div style={{
                    padding: "10px 14px", background: "rgba(99,102,241,0.1)", borderRadius: 10,
                    fontSize: 13, color: "var(--accent)", fontStyle: "italic", lineHeight: 1.5,
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}>
                    "{scriptPreview.enhancedPrompt}"
                  </div>
                </div>

                {/* Hook */}
                {scriptPreview.hook && (
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                      ⚡ Opening Hook
                    </div>
                    <div style={{
                      padding: "10px 14px", background: "rgba(249,115,22,0.08)", borderRadius: 10,
                      fontSize: 13, color: "#fb923c", fontWeight: 600, lineHeight: 1.5,
                      border: "1px solid rgba(249,115,22,0.2)",
                    }}>
                      {scriptPreview.hook}
                    </div>
                  </div>
                )}

                {/* Full script */}
                {scriptPreview.script && (
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                      📜 Full Script
                    </div>
                    <div style={{
                      padding: "14px 16px", background: "var(--surface2)", borderRadius: 10, maxHeight: 200,
                      overflowY: "auto", fontSize: 12, color: "var(--text2)", lineHeight: 1.7,
                      border: "1px solid var(--border)",
                    }}>
                      {scriptPreview.script}
                    </div>
                  </div>
                )}

                {/* CTA buttons */}
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={handleGenerate}
                    style={{
                      flex: 2, padding: "13px", borderRadius: 12, border: "none",
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13,
                      boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
                    }}
                  >
                    🚀 Looks Good — Start Generation!
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { dismissPreview(); }}
                    style={{
                      flex: 1, padding: "13px", borderRadius: 12,
                      border: "1px solid var(--border)", background: "transparent",
                      color: "var(--text3)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: 13,
                    }}
                  >
                    ✏ Edit Prompt
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── GENERATION PROGRESS ─────────────────────────────────────────── */}
        <AnimatePresence>
          {loading && currentJob && currentJob.status !== "COMPLETED" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              style={{ marginTop: 20, padding: 20, background: "var(--surface2)", borderRadius: 16, border: "1px solid var(--border)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12, fontWeight: 700 }}>
                <span style={{ color: "var(--text2)" }}>{currentJob.currentStep || "Initializing pipeline..."}</span>
                <span style={{ color: "var(--accent)" }}>{currentJob.percent || 0}%</span>
              </div>
              <div style={{ height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden", marginBottom: 16 }}>
                <motion.div
                  animate={{ width: `${currentJob.percent || 0}%` }}
                  style={{ height: "100%", background: "linear-gradient(90deg, #6366f1, #a855f7)", borderRadius: 3 }}
                />
              </div>
              <button
                onClick={handleCancel}
                style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid var(--red)", background: "transparent", color: "var(--red)", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}
              >
                🛑 Cancel Generation
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── RESULT ─────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {generatedVideo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: 20 }}
            >
              <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)", background: "#000" }}>
                <video src={`${API}/${generatedVideo}`} controls autoPlay loop style={{ width: "100%", maxHeight: 400 }} />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                disabled={uploading}
                style={{ width: "100%", marginTop: 12, padding: 14, borderRadius: 12, border: "none", background: "var(--red)", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}
              >
                {uploading ? "📤 Uploading..." : "🔴 Upload to YouTube Shorts"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
