import requests
import json

url = "http://127.0.0.1:8006/generate-images"
payload = {
    "scenes": [
        {
            "scene_index": 0,
            "imagePrompt": "cinematic 9:16 portrait of two fruits fighting apple and mango debate, showing apple looking aggressive and determined",
            "mood": "intense"
        },
        {
            "scene_index": 1,
            "imagePrompt": "cinematic 9:16 portrait of two fruits fighting apple and mango debate, showing mango with a smirk, standing tall",
            "mood": "inspiring"
        },
        {
            "scene_index": 2,
            "imagePrompt": "cinematic 9:16 portrait of two fruits fighting apple and mango debate, showing close-up of apple's red glossy skin with electric sparks",
            "mood": "shocking"
        }
    ],
    "topic": "two fruits fighting apple and mango debate",
    "category": "motivation"
}

print("Sending request to Image AI...")
try:
    resp = requests.post(url, json=payload, timeout=120)
    print("STATUS CODE:", resp.status_code)
    print("RESPONSE JSON:")
    print(json.dumps(resp.json(), indent=2))
except Exception as e:
    print("ERROR calling service:", e)
