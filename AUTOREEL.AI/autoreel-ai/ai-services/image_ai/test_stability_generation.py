import os
import requests
import base64
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("STABILITY_API_KEY", "")
print("STABILITY API KEY:", api_key[:10] + "..." if api_key else "None")

ENGINE_ID = "stable-diffusion-xl-1024-v1-0"
STABILITY_HOST = "https://api.stability.ai"

full_prompt = "cinematic 9:16 portrait of two fruits fighting apple and mango debate, showing mango with a smirk, standing tall, soft golden light, peaceful atmosphere, serene, cinematic, dark moody lighting, high contrast, professional photography, 8k, sharp focus, consistent color grading, photorealistic, sharp focus, professional photography"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json",
    "Accept": "application/json",
}

# Test 768 x 1344 (official SDXL vertical dimensions)
payload = {
    "text_prompts": [
        {"text": full_prompt, "weight": 1.0},
        {"text": "blurry, low quality, watermark, text, logo, duplicate, bad anatomy, deformed, ugly, cartoon, anime", "weight": -1.0}
    ],
    "cfg_scale": 7,
    "height": 1344,
    "width": 768,
    "samples": 1,
    "steps": 30,
    "style_preset": "cinematic",
}

url = f"{STABILITY_HOST}/v1/generation/{ENGINE_ID}/text-to-image"
print("Sending request to Stability with 768x1344...")
try:
    resp = requests.post(url, headers=headers, json=payload, timeout=60)
    print("Status code:", resp.status_code)
    if resp.status_code == 200:
        result = resp.json()
        print("Success! Generated image base64 length:", len(result["artifacts"][0]["base64"]))
    else:
        print("Response JSON:", resp.text)
except Exception as e:
    print("Error calling Stability:", e)
