"""
AutoReel.AI — AI Services Monolith (Consolidated for Free Deployment)
Combines Script, Voice, Image, Video, and Subtitle services into one FastAPI app.
"""

import os
import json
import time
import base64
import logging
import asyncio
import requests
import re
import random
import glob
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# --- AI SDKs ---
import google.generativeai as genai
import anthropic
import edge_tts
from faster_whisper import WhisperModel
try:
    from runwayml import RunwayML
except ImportError:
    RunwayML = None

# --- Project Setup ---
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_env = os.path.join(PROJECT_ROOT, "backend", ".env")
load_dotenv(backend_env)

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger("ai_monolith")

app = FastAPI(title="AutoReel AI Monolith", version="1.0")

# --- Storage Paths ---
STORAGE_ROOT = os.path.join(PROJECT_ROOT, "backend", "storage")
AUDIO_DIR = os.path.join(STORAGE_ROOT, "audio")
VIDEO_DIR = os.path.join(STORAGE_ROOT, "video")
TMP_DIR = os.path.join(STORAGE_ROOT, "tmp")
SUBTITLE_DIR = os.path.join(STORAGE_ROOT, "subtitles")
MUSIC_ROOT = os.path.join(STORAGE_ROOT, "music")

for d in [AUDIO_DIR, VIDEO_DIR, TMP_DIR, SUBTITLE_DIR]:
    os.makedirs(d, exist_ok=True)

# --- Service Configs ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY: genai.configure(api_key=GEMINI_API_KEY)

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
claude_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
PEXELS_API_KEY = os.getenv("PEXELS_API_KEY", "")
STABILITY_API_KEY = os.getenv("STABILITY_API_KEY", "")
RUNWAYML_API_SECRET = os.getenv("RUNWAYML_API_SECRET", "")

# Load Whisper once on startup
logger.info("📡 Loading Whisper model (base)...")
whisper_model = WhisperModel("base", device="cpu", compute_type="int8")
logger.info("✅ Whisper loaded.")

# --- Models ---
class ScriptRequest(BaseModel):
    topic: str
    category: str = "motivation"
    duration: int = 60
    language: str = "en-US"

class VoiceRequest(BaseModel):
    text: str
    language: str = "en-US"
    gender: str = "male"

class ImageScene(BaseModel):
    scene_index: int
    imagePrompt: str
    mood: str = "inspiring"

class ImageRequest(BaseModel):
    scenes: list[ImageScene]
    topic: str = ""

class TranscribeRequest(BaseModel):
    audio_path: str

# --- HEALTH ---
@app.get("/health")
def health():
    return {
        "status": "ok",
        "services": {
            "gemini": bool(GEMINI_API_KEY),
            "claude": bool(ANTHROPIC_API_KEY),
            "elevenlabs": bool(ELEVENLABS_API_KEY),
            "stability": bool(STABILITY_API_KEY),
            "runway": bool(RUNWAYML_API_SECRET),
            "whisper": True
        }
    }

# --- 1. SCRIPT SERVICE ---
@app.post("/script/generate")
async def generate_script(data: ScriptRequest):
    prompt = f"Write a {data.duration}s viral YouTube Shorts script about: {data.topic}. Tone: {data.category}. Return ONLY JSON: {{'script': '...', 'hook': '...'}}"
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        resp = model.generate_content(prompt)
        text = resp.text.strip()
        if "```json" in text: text = text.split("```json")[1].split("```")[0].strip()
        return {"success": True, "data": json.loads(text)}
    except Exception as e:
        logger.error(f"Script error: {e}")
        return {"success": False, "message": str(e)}

# --- 2. VOICE SERVICE ---
@app.post("/voice/generate")
async def generate_voice(data: VoiceRequest):
    timestamp = int(time.time())
    filename = f"voice_{timestamp}.wav"
    audio_path = os.path.join(AUDIO_DIR, filename)
    
    # Simple Edge TTS for free deployment
    try:
        voice = "en-US-ChristopherNeural" if data.gender == "male" else "en-US-JennyNeural"
        communicate = edge_tts.Communicate(data.text, voice)
        await communicate.save(audio_path)
        return {"success": True, "audio_path": f"storage/audio/{filename}", "provider": "edge_tts"}
    except Exception as e:
        return {"success": False, "message": str(e)}

# --- 3. SUBTITLE SERVICE (Whisper) ---
@app.post("/subtitle/transcribe")
async def transcribe_audio(data: TranscribeRequest):
    try:
        # Convert audio_path (storage/audio/...) to absolute
        audio_abs = os.path.join(PROJECT_ROOT, "backend", data.audio_path)
        segments, _ = whisper_model.transcribe(audio_abs)
        
        srt_lines = []
        for i, s in enumerate(segments, 1):
            srt_lines.append(f"{i}\n{s.start} --> {s.end}\n{s.text.strip()}\n")
            
        filename = f"subs_{int(time.time())}.srt"
        sub_path = os.path.join(SUBTITLE_DIR, filename)
        with open(sub_path, "w") as f: f.write("\n".join(srt_lines))
        
        return {"success": True, "subtitle_path": f"storage/subtitles/{filename}"}
    except Exception as e:
        return {"success": False, "message": str(e)}

# --- 4. VIDEO SERVICE (Placeholder logic - requires FFmpeg on host) ---
@app.get("/video/status")
def video_status():
    return {"status": "ffmpeg-ready" if shutil.which("ffmpeg") else "ffmpeg-missing"}

if __name__ == "__main__":
    import uvicorn
    import shutil
    port = int(os.getenv("AI_MONOLITH_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
