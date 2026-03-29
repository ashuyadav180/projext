# 🎬 AutoReel.AI

> **AI-powered automated short-form video generator** — from topic to published YouTube Shorts/Reels in minutes.

---

## 🚀 Overview

AutoReel.AI is a full-stack, microservice-based platform that **automatically generates, voices, edits, and uploads short videos** using AI. You provide a topic or script prompt — AutoReel handles everything else.

### ✨ Key Features

- 🧠 **AI Script Generation** — Gemini-powered hook-first scripts optimized for virality
- 🗣️ **AI Voiceover** — ElevenLabs multilingual TTS (English & Hindi)
- 🎥 **AI Video Assembly** — B-roll sourcing, RunwayML animated clips, FFmpeg editing
- 📝 **AI Subtitles** — Word-by-word dynamic subtitles with bounce animations
- 💋 **Lip Sync** — SyncLabs-powered lip-sync on AI avatar clips
- 📤 **Auto Upload** — Direct publish to YouTube via OAuth2
- 🔄 **Job Queue** — Real-time progress tracking via Socket.IO

---

## 🏗️ Architecture

```
autoreel-ai/
├── frontend/              # React + Vite dashboard
├── backend/               # Node.js (Express) — API, queue, YouTube upload
│   ├── controllers/
│   ├── routes/
│   ├── services/          # YouTube, pipeline orchestration
│   ├── queue/             # Job queue manager
│   └── scheduler/         # Auto-publish scheduler
└── ai-services/           # Python microservices
    ├── script_ai/         # Gemini script generation  (port 5001)
    ├── voice_ai/          # ElevenLabs TTS            (port 5002)
    ├── video_ai/          # FFmpeg + RunwayML editing (port 5003)
    └── subtitle_ai/       # ASS subtitle generator    (port 5004)
```

### Data Flow

```
User Prompt
    │
    ▼
[script_ai] ──► Script JSON
    │
    ▼
[voice_ai] ──► MP3 Voiceover
    │
    ▼
[video_ai] ──► MP4 (B-roll + RunwayML clips stitched)
    │
    ▼
[subtitle_ai] ──► Final MP4 with burned-in subtitles
    │
    ▼
[backend] ──► YouTube Upload ──► Done ✅
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Socket.IO-client |
| Backend | Node.js, Express, Socket.IO |
| AI Services | Python 3.11, FastAPI/Flask |
| Script AI | Google Gemini API |
| Voice AI | ElevenLabs API |
| Video AI | FFmpeg, RunwayML API, Pexels API |
| Lip Sync | SyncLabs API |
| Upload | YouTube Data API v3 |
| Tunnel | ngrok (for SyncLabs webhook) |

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js ≥ 18
- Python ≥ 3.11
- FFmpeg (in PATH)
- ngrok

### 1. Clone & Install Backend

```bash
cd backend
npm install
```

### 2. Install AI Services

```bash
# Repeat for each service
cd ai-services/script_ai && pip install -r requirements.txt
cd ai-services/voice_ai  && pip install -r requirements.txt
cd ai-services/video_ai  && pip install -r requirements.txt
cd ai-services/subtitle_ai && pip install -r requirements.txt
```

### 3. Install Frontend

```bash
cd frontend
npm install
```

### 4. Configure Environment

Copy `.env.example` to `backend/.env` and fill in your keys:

```env
# Google / YouTube
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_gemini_api_key

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# RunwayML
RUNWAYML_API_KEY=your_runwayml_api_key

# Pexels
PEXELS_API_KEY=your_pexels_api_key

# SyncLabs
SYNCLABS_API_KEY=your_synclabs_api_key

# ngrok (for SyncLabs file access)
NGROK_URL=https://your-ngrok-url.ngrok.io

# Ports
SCRIPT_AI_PORT=5001
VOICE_AI_PORT=5002
VIDEO_AI_PORT=5003
SUBTITLE_AI_PORT=5004
BACKEND_PORT=3000
```

### 5. YouTube OAuth Setup

```bash
cd backend
node scripts/auth.js
# Follow the URL printed to authenticate your Google account
```

---

## ▶️ Running the Project

Use the provided batch script to start all services at once:

```bash
start_services.bat
```

Or start individually:

```bash
# Terminal 1 — Backend
cd backend && node index.js

# Terminal 2 — Script AI
cd ai-services/script_ai && python main.py

# Terminal 3 — Voice AI
cd ai-services/voice_ai && python main.py

# Terminal 4 — Video AI
cd ai-services/video_ai && python main.py

# Terminal 5 — Frontend
cd frontend && npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 📡 API Reference

See [`docs/api-contracts.md`](docs/api-contracts.md) for full endpoint documentation.

### Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/jobs` | Create new video generation job |
| `GET` | `/api/jobs` | List all jobs |
| `GET` | `/api/jobs/:id` | Get job status |
| `POST` | `/api/jobs/:id/upload` | Manually trigger YouTube upload |
| `GET` | `/api/auth/youtube` | Start YouTube OAuth flow |

### WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `job:progress` | Server → Client | Real-time pipeline progress update |
| `job:complete` | Server → Client | Job finished with output URL |
| `job:error` | Server → Client | Job failed with error details |

---

## 🎬 Pipeline Stages

| Stage | Service | Description |
|-------|---------|-------------|
| `SCRIPT` | script_ai | Generate hook + body script from prompt |
| `VOICE` | voice_ai | Convert script to MP3 voiceover |
| `VIDEO` | video_ai | Fetch B-roll, animate clips, assemble video |
| `SUBTITLE` | subtitle_ai | Burn word-by-word subtitles into video |
| `UPLOAD` | backend | Publish final video to YouTube |

---

## 📁 Storage Structure

```
storage/
├── jobs/
│   └── {job_id}/
│       ├── script.json
│       ├── voice.mp3
│       ├── raw_video.mp4
│       └── final_video.mp4
└── assets/
    ├── intro.mp4
    ├── outro.mp4
    └── watermark.png
```

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `backend/.env` | API keys and service ports |
| `ai-services/script_ai/.env` | Gemini API key |
| `start_services.bat` | One-click startup script |
| `docs/api-contracts.md` | API endpoint documentation |

---

## 🛣️ Roadmap

- [ ] Multi-language support (Hindi voice + subtitles)
- [ ] Shorts vs. long-form toggle
- [ ] A/B hook testing
- [ ] Analytics dashboard (views, CTR)
- [ ] Scheduled batch generation
- [ ] Template library

---

## 📄 License

MIT © 2026 AutoReel.AI
