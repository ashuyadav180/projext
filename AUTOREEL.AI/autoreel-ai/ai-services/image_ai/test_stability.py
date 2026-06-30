import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("STABILITY_API_KEY", "")
print("STABILITY API KEY:", api_key[:10] + "..." if api_key else "None")

if not api_key:
    print("Stability key is empty!")
    exit(1)

url = "https://api.stability.ai/v1/user/balance"
headers = {
    "Authorization": f"Bearer {api_key}"
}

try:
    resp = requests.get(url, headers=headers)
    print("Balance API Status Code:", resp.status_code)
    print("Balance API Response:", resp.text)
except Exception as e:
    print("Error calling Balance API:", e)
