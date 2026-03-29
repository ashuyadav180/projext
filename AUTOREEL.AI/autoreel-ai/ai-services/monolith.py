"""
AutoReel.AI — AI Services Monolith (Consolidated for Free Deployment)
Combines Script, Voice, Image, Video, and Subtitle services into one FastAPI app.
"""

import os
import logging
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# --- Import AI Routers ---
# Ensure the root of ai-services is in the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from script_ai.main import router as script_router
from voice_ai.main import router as voice_router
from image_ai.main import router as image_router
from subtitle_ai.main import router as subtitle_router
from video_ai.main import router as video_router

# --- Project Setup ---
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_env = os.path.join(PROJECT_ROOT, "backend", ".env")
load_dotenv(backend_env)

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger("ai_monolith")

app = FastAPI(title="AutoReel AI Monolith", version="1.0")

# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include AI Routers ---
app.include_router(script_router, prefix="/script", tags=["Script"])
app.include_router(voice_router, prefix="/voice", tags=["Voice"])
app.include_router(image_router, prefix="/image", tags=["Image"])
app.include_router(subtitle_router, prefix="/subtitle", tags=["Subtitle"])
app.include_router(video_router, prefix="/video", tags=["Video"])

@app.get("/")
def home():
    return {"message": "AutoReel AI Monolith is running", "version": "1.0"}

@app.get("/health")
def health():
    return {"status": "ok", "monolith": True}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AI_MONOLITH_PORT", 8000))
    logger.info(f"🚀 Starting AutoReel AI Monolith on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
