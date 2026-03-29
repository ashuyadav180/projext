import requests
import time

def test_raw_video():
    prompt = input("Enter your video prompt: ")
    print("\n🎬 Sending prompt to AutoReel Video AI Server...")
    
    url = "http://localhost:8004/generate-raw-clip"
    payload = {"prompt": prompt}
    
    start = time.time()
    try:
        response = requests.post(url, json=payload)
        data = response.json()
        
        if data.get("success"):
            print(f"\n✅ SUCCESS! Video generated in {int(time.time() - start)} seconds.")
            print(f"📁 Saved at: {data.get('video_path')}")
        else:
            print("\n❌ FAILED to generate video:")
            print(f"Error Code: {data.get('error_code')}")
            print(f"Message: {data.get('message')}")
            
    except Exception as e:
        print(f"\n❌ Could not connect to Video AI service: {e}")
        print("💡 Make sure your start_services.bat is running!")

if __name__ == "__main__":
    test_raw_video()
