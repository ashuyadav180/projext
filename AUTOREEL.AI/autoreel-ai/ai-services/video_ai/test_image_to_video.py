import os
import time
import requests
import base64
from dotenv import load_dotenv
from runwayml import RunwayML

# Load env
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
backend_env = os.path.join(PROJECT_ROOT, "backend", ".env")
load_dotenv(backend_env)

API_KEY = os.getenv("RUNWAYML_API_SECRET")
MODEL = "gen3a_turbo"

def test_runway_image():
    if not API_KEY:
        print("❌ ERROR: RUNWAYML_API_SECRET not found in .env")
        return

    print(f"📡 Initializing RunwayML with key: {API_KEY[:5]}...{API_KEY[-5:]}")
    client = RunwayML(api_key=API_KEY)

    # Let's find an image file in storage/tmp
    tmp_dir = os.path.join(PROJECT_ROOT, "backend", "storage", "tmp")
    images = [f for f in os.listdir(tmp_dir) if f.startswith("bg_") and f.endswith(".jpg")]
    if not images:
        print("❌ No test image found starting with bg_ in storage/tmp")
        return
    
    img_path = os.path.join(tmp_dir, images[0])
    print(f"🖼️ Using test image: {img_path}")

    with open(img_path, "rb") as f:
        img_b64 = base64.b64encode(f.read()).decode()
    img_uri = f"data:image/png;base64,{img_b64}"

    try:
        print(f"🎬 Creating image-to-video task with model: {MODEL}")
        task = client.image_to_video.create(
            model=MODEL,
            prompt_image=img_uri,
            prompt_text="A realistic cinematic movement",
            duration=5,
            ratio="768:1280"
        )
        task_id = task.id
        print(f"✅ Task created! ID: {task_id}")

        print("⏳ Polling for completion...")
        start_time = time.time()
        while True:
            task = client.tasks.retrieve(task_id)
            print(f"   [DEBUG] Status: {task.status}")
            
            if task.status == "SUCCEEDED":
                print(f"🎉 SUCCESS! Video URL: {task.output[0]}")
                break
            elif task.status == "FAILED":
                print(f"❌ FAILED: {task.failure_reason}")
                break
            
            if time.time() - start_time > 300: # 5 mins
                print("⏰ TIMEOUT")
                break
                
            time.sleep(10)

    except Exception as e:
        print(f"❌ ERROR encountered: {e}")
        if hasattr(e, 'response'):
            print(f"   Response status: {e.response.status_code}")
            print(f"   Response text: {e.response.text}")

if __name__ == "__main__":
    test_runway_image()
