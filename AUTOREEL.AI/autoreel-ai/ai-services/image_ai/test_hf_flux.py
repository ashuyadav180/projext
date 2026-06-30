import os
import requests
from dotenv import load_dotenv

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
backend_env = os.path.join(PROJECT_ROOT, "backend", ".env")
root_env = os.path.join(PROJECT_ROOT, ".env")

load_dotenv(backend_env)
load_dotenv(root_env)

hf_token = os.getenv("HF_API_TOKEN", "")
print("HF API TOKEN:", hf_token[:10] + "..." if hf_token else "None")

if not hf_token:
    print("HF Token is empty!")
    exit(1)

model_id = "black-forest-labs/FLUX.1-schnell"
# Updated to the new Hugging Face direct inference URL structure
url = f"https://router.huggingface.co/hf-inference/models/{model_id}"
headers = {
    "Authorization": f"Bearer {hf_token}"
}
payload = {
    "inputs": "cinematic 9:16 portrait of two fruits fighting apple and mango debate, showing apple looking aggressive and determined",
    "parameters": {
        "width": 768,
        "height": 1344
    }
}

print(f"Sending request to Hugging Face model: {model_id}...")
try:
    resp = requests.post(url, headers=headers, json=payload, timeout=30)
    print("Status code:", resp.status_code)
    print("Content length:", len(resp.content))
    if resp.status_code == 200:
        with open("hf_test_image.png", "wb") as f:
            f.write(resp.content)
        print("Success! Saved image to hf_test_image.png")
    else:
        print("Error Response:", resp.text)
except Exception as e:
    print("Error:", e)
