import requests
import urllib.parse
import time

STYLE_PREFIX = "cinematic, dark moody lighting, high contrast, professional photography, 8k, sharp focus, consistent color grading"
negative_prompt = "blurry, low quality, watermark, text, logo, duplicate, bad anatomy, deformed, ugly, cartoon, anime"

prompts = [
    "cinematic 9:16 portrait of two fruits fighting apple and mango debate, showing apple looking aggressive and determined, epic wide shot, bright uplifting light, motivational, cinematic, dark moody lighting, high contrast, professional photography, 8k, sharp focus, consistent color grading, photorealistic, sharp focus, professional photography",
    "cinematic 9:16 portrait of two fruits fighting apple and mango debate, showing mango with a smirk, standing tall, epic wide shot, bright uplifting light, motivational, cinematic, dark moody lighting, high contrast, professional photography, 8k, sharp focus, consistent color grading, photorealistic, sharp focus, professional photography",
    "cinematic 9:16 portrait of two fruits fighting apple and mango debate, showing close-up of apple's red glossy skin with electric sparks, high contrast, surreal, striking composition, cinematic, dark moody lighting, high contrast, professional photography, 8k, sharp focus, consistent color grading, photorealistic, sharp focus, professional photography"
]

for idx, p in enumerate(prompts):
    safe_prompt = urllib.parse.quote(p)
    # Let's try pollinations with width and height
    url = f"https://image.pollinations.ai/prompt/{safe_prompt}?width=1080&height=1920&nologo=true"
    print(f"\n--- TESTING PROMPT {idx} ---")
    print("PROMPT LENGTH:", len(p))
    print("URL LENGTH:", len(url))
    print("URL:", url)
    try:
        t0 = time.time()
        resp = requests.get(url, timeout=45)
        t1 = time.time()
        print(f"Time taken: {t1-t0:.2f}s")
        print("Status code:", resp.status_code)
        print("Content length:", len(resp.content))
        if resp.status_code == 200:
            print("First 100 bytes:", resp.content[:100])
    except Exception as e:
        print("Error:", e)
