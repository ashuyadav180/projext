import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("STABILITY_API_KEY", "")
url = "https://api.stability.ai/v1/engines/list"
headers = {
    "Authorization": f"Bearer {api_key}"
}

try:
    resp = requests.get(url, headers=headers)
    print("STATUS CODE:", resp.status_code)
    print("ENGINES:")
    for eng in resp.json():
        if eng.get("ready"):
            print(f" - {eng.get('id')}: {eng.get('name')} (type: {eng.get('type')})")
except Exception as e:
    print("Error:", e)
