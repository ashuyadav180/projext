import os
import time
from dotenv import load_dotenv
from runwayml import RunwayML

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
backend_env = os.path.join(PROJECT_ROOT, "backend", ".env")
load_dotenv(backend_env)

API_KEY = os.getenv("RUNWAYML_API_SECRET")

def test():
    client = RunwayML(api_key=API_KEY)
    print("Testing with model='veo3.1'")
    try:
        task = client.text_to_video.create(
            model="veo3.1",
            prompt_text="A cinematic sunset over the ocean, 4k",
            ratio="720:1280"
        )
        print("Success! Task ID:", task.id)
    except Exception as e:
        print("Error with veo3.1:", e)

    print("Testing with model='veo3.1_fast'")
    try:
        task = client.text_to_video.create(
            model="veo3.1_fast",
            prompt_text="A cinematic sunset over the ocean, 4k",
            ratio="720:1280"
        )
        print("Success! Task ID:", task.id)
    except Exception as e:
        print("Error with veo3.1_fast:", e)

if __name__ == "__main__":
    test()
