import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv(encoding="utf-8")

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key found: {api_key[:5]}...")

genai.configure(api_key=api_key)

print("Listing models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"List models failed: {e}")

print(f"Library Version: {genai.__version__}")

print("\n--- Trying models/gemini-1.5-flash ---")
try:
    model = genai.GenerativeModel('models/gemini-1.5-flash')
    response = model.generate_content("Hello")
    print("SUCCESS: gemini-1.5-flash works")
except Exception as e:
    print(f"FAILED: gemini-1.5-flash error: {e}")

print("\n--- Trying models/gemini-pro ---")
try:
    model = genai.GenerativeModel('models/gemini-pro')
    response = model.generate_content("Hello")
    print("SUCCESS: gemini-pro works")
except Exception as e:
    print(f"FAILED: gemini-pro error: {e}")
