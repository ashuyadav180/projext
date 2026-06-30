import os
import requests
from dotenv import load_dotenv

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
backend_env = os.path.join(PROJECT_ROOT, "backend", ".env")
load_dotenv(backend_env)

API_KEY = os.getenv("PEXELS_API_KEY")

def test():
    print(f"Testing Pexels API key: {API_KEY}")
    if not API_KEY:
        print("No API key found!")
        return
    headers = {"Authorization": API_KEY}
    url = "https://api.pexels.com/videos/search?query=nature&per_page=1"
    try:
        r = requests.get(url, headers=headers)
        print("Status code:", r.status_code)
        print("Response JSON:", r.json())
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test()
