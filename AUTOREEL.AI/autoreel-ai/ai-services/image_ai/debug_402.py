import requests
import urllib.parse

p = "cinematic 9:16 portrait of two fruits fighting apple and mango debate, showing apple looking aggressive and determined"
safe_prompt = urllib.parse.quote(p)
url = f"https://image.pollinations.ai/prompt/{safe_prompt}?width=1080&height=1920&nologo=true"

print("Fetching URL:", url)
try:
    resp = requests.get(url, timeout=20)
    print("Status code:", resp.status_code)
    print("Content length:", len(resp.content))
    with open("402_response.html", "wb") as f:
        f.write(resp.content)
    print("Saved response to 402_response.html")
except Exception as e:
    print("Error:", e)
