import os
import time
import requests
from dotenv import load_dotenv
from runwayml import RunwayML

# Load env from backend/.env
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
backend_env = os.path.join(PROJECT_ROOT, "backend", ".env")
load_dotenv(backend_env)

API_KEY = os.getenv("RUNWAYML_API_SECRET")
# User says: MODEL_NAME is gen3a_turbo or gen-3-alpha
MODEL_NAME = "gen-3-alpha"

def test_runway():
    if not API_KEY:
        print("❌ ERROR: RUNWAYML_API_SECRET not found in .env")
        return

    print(f"📡 Initializing RunwayML | Model: {MODEL_NAME}")
    client = RunwayML(api_key=API_KEY)

    try:
        # Check credits (User logic: runway_client.get_credits())
        # Let's try to see if get_credits exists or just proceed
        print("🔍 Checking account access...")
        # credits = client.get_credits() # Commenting out if it fails
        # print(f"[DEBUG] Runway credits remaining: {credits}")

        print(f"🎬 Creating task with prompt...")
        task = client.text_to_video.create(
            model=MODEL_NAME,
            prompt_text="A cinematic shot of a sunset over the ocean, 4k",
            ratio="720:1280"
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
            elif task.status == "CANCELLED":
                print("🛑 CANCELLED")
                break
            
            if time.time() - start_time > 600:
                print("⏰ TIMEOUT")
                break
                
            time.sleep(10)

    except Exception as e:
        print(f"❌ ERROR: {e}")
        # If it says 'Extra keywords', let's try 'prompt' instead of 'prompt_text'
        if "Extra keyword(s)" in str(e):
             print("💡 Trying with 'prompt' instead of 'prompt_text'...")
             try:
                 task = client.text_to_video.create(
                    model=MODEL_NAME,
                    prompt="A cinematic shot of a sunset over the ocean, 4k"
                 )
                 print(f"✅ Task created (alt)! ID: {task.id}")
             except Exception as e2:
                 print(f"❌ FAILED AGAIN: {e2}")

if __name__ == "__main__":
    test_runway()
