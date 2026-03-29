import os
import time
import requests
import inspect
from dotenv import load_dotenv
from runwayml import RunwayML

# Load env
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
backend_env = os.path.join(PROJECT_ROOT, "backend", ".env")
load_dotenv(backend_env)

API_KEY = os.getenv("RUNWAYML_API_SECRET")
MODEL = "gen3a_turbo"

def test_runway():
    if not API_KEY:
        print("❌ ERROR: RUNWAYML_API_SECRET not found in .env")
        return

    print(f"📡 Initializing RunwayML with key: {API_KEY[:5]}...{API_KEY[-5:]}")
    client = RunwayML(api_key=API_KEY)

    print("\n🔍 Inspecting client.text_to_video.create:")
    try:
        sig = inspect.signature(client.text_to_video.create)
        print(f"   Signature: {sig}")
    except Exception as e:
        print(f"   Could not get signature: {e}")

    try:
        print(f"\n🎬 Testing generation with model: {MODEL}")
        # Typical signature for Gen-3 Alpha Turbo:
        # model, prompt_text, ratio
        task = client.text_to_video.create(
            model=MODEL,
            prompt_text="Detailed cinematic shot of a futuristic neon city in the rain, 4k",
            # ratio="720:1280" # Let's see if this was the 'extra' argument
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
            
            if time.time() - start_time > 600: # 10 mins
                print("⏰ TIMEOUT")
                break
                
            time.sleep(15)

    except Exception as e:
        print(f"❌ ERROR encountered: {e}")
        if hasattr(e, 'response'):
            print(f"   Response: {e.response.text}")

if __name__ == "__main__":
    test_runway()
