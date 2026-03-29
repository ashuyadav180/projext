# AutoReel.ai – API Contracts (Frozen)

## Script AI
POST /generate-script

Request:
{
  "topic": "string (min 3 chars)"
}

Response (success):
{
  "success": true,
  "script": "string"
}

Response (failure):
{
  "success": false,
  "error_code": "SCRIPT_GEN_FAILED",
  "message": "string"
}

---

## Voice AI
POST /generate-voice

Request:
{
  "text": "string (min 20 chars)"
}

Response (success):
{
  "success": true,
  "audio_path": "storage/audio/voice_xxx.mp3"
}

Response (failure):
{
  "success": false,
  "error_code": "VOICE_GEN_FAILED",
  "message": "string"
}

---

## Video AI
POST /generate-video

Request:
{
  "audio_path": "storage/audio/voice_xxx.mp3"
}

Response (success):
{
  "success": true,
  "video_path": "storage/video/video_xxx.mp4"
}

Response (failure):
{
  "success": false,
  "error_code": "VIDEO_GEN_FAILED",
  "message": "string"
}
