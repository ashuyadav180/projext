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

payloads = [
    {"model": "veo3.1", "prompt_text": "cinematic shot", "ratio": "720:1280", "duration": 4},
    {"model": "gen4.5", "prompt_text": "cinematic shot", "ratio": "720:1280", "duration": 5},
    {"model": "gen3a_alpha", "prompt_text": "cinematic shot", "ratio": "1280:768", "duration": 5},
    {"model": "gen3a_alpha", "prompt_text": "cinematic shot", "ratio": "768:1280"},
    {"model": "gen3a", "prompt_text": "cinematic shot", "ratio": "768:1280"},
    {"model": "gen3a_turbo", "prompt_text": "cinematic shot", "ratio": "768:1280"},
]

results = []
for p in payloads:
    res = requests.post('https://api.dev.runwayml.com/v1/text_to_video', headers=headers, json=p)
    results.append({
        "payload": p,
        "status": res.status_code,
        "response": res.json() if res.status_code != 200 else "SUCCESS"
    })

with open("api_results.json", "w") as f:
    json.dump(results, f, indent=2)
