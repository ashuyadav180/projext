import os
import time
import requests
from dotenv import load_dotenv
from runwayml import RunwayML

# Load env
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
backend_env = os.path.join(PROJECT_ROOT, "backend", ".env")
load_dotenv(backend_env)

API_KEY = os.getenv("RUNWAYML_API_SECRET")
MODEL = "gen3a_turbo" # Suggested by user

def test_runway():
    if not API_KEY:
        print("❌ ERROR: RUNWAYML_API_SECRET not found in .env")
        return

    print(f"📡 Initializing RunwayML with key: {API_KEY[:5]}...{API_KEY[-5:]}")
    client = RunwayML(api_key=API_KEY)
    
    print("🔍 Inspecting text_to_video.create:")
    import inspect
    try:
        sig = inspect.signature(client.text_to_video.create)
        print(f"   Signature: {sig}")
    except:
        print("   Could not get signature via inspect")
    
    print("🔍 Available attributes on client.text_to_video:")
    for attr in dir(client.text_to_video):
        if not attr.startswith("_"):
            print(f"   - {attr}")
\n
    try:
        # Check credits (if SDK supports it, otherwise try a small generation)
        print("🔍 Checking account access...")
        # Note: If get_credits() doesn't exist, we'll catch the error.
        # Some SDK versions might not have a direct credit check method yet.
        # We might need to check the API docs for the exact method.
        # If it fails, we'll proceed to try a generation.
        
        print(f"🎬 Testing generation with model: {MODEL}")
        task = client.text_to_video.create(
            model=MODEL,
            prompt_text="A cinematic shot of a sunset over the ocean, 4k, highly detailed",
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
            
            if time.time() - start_time > 300: # 5 mins timeout for test
                print("⏰ TIMEOUT")
                break
                
            time.sleep(10)

    except Exception as e:
        print(f"❌ ERROR encountered: {e}")

if __name__ == "__main__":
    test_runway()
