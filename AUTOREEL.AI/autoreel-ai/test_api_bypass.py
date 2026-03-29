import os
import requests
import json
from dotenv import load_dotenv

load_dotenv('c:\\Projects\\AUTOREEL.AI\\autoreel-ai\\.env')
key = os.environ.get('RUNWAYML_API_SECRET')
headers = {
    'Authorization': f'Bearer {key}',
    'X-Runway-Version': '2024-11-06',
    'Content-Type': 'application/json'
}

payload = {
    "model": "veo3.1",
    "promptText": "cinematic shot",
    "ratio": "720:1280",
    "duration": 4
}

res = requests.post('https://api.dev.runwayml.com/v1/text_to_video', headers=headers, json=payload)
print(f"Status: {res.status_code}")
print(f"Response: {res.text}")
