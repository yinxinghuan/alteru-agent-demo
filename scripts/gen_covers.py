#!/usr/bin/env python3
"""Generate AlterU-styled demo covers via wdabuliu txt2img API."""
import json
import os
import ssl
import subprocess
import sys
import time
import urllib.request

API_URL = "http://aiservice.wdabuliu.com:8019/genl_image"
USER_ID = 618336286  # ghostpixel per memory
OUT_DIR = "/Users/yin/code/alteru-agent-demo/assets/covers"
os.makedirs(OUT_DIR, exist_ok=True)

STYLE = (
    "moody narrative indie game cover, painterly digital illustration, "
    "soft pink and deep purple lighting palette (#F5B1C7 and #7700A1 highlights), "
    "cinematic composition, atmospheric, dreamy, no text, no watermark, no logo, "
    "square 1:1, mobile game thumbnail aesthetic"
)

PROMPTS = [
    ("late_night_decision",
     "A dimly lit bedroom at 3 AM, a person sitting on the edge of the bed holding a phone, "
     "phone screen glow illuminating their face, dramatic warm shadows, conflicted expression. "
     + STYLE),
    ("reading_log",
     "A cozy wooden desk by a window at dusk, an open book, a warm vintage lamp, "
     "a porcelain cup with steam, soft pink-purple twilight outside, painterly and intimate. "
     + STYLE),
    ("mirror_gaze",
     "A figure standing in front of a tall ornate mirror in a dim room, soft pink ambient light, "
     "reflection slightly distorted, surreal and contemplative, back of the figure visible. "
     + STYLE),
    ("last_subway",
     "An empty late-night subway carriage, fluorescent lights flickering, a single seated passenger "
     "looking out the dark window, magenta and purple ambient lighting, lonely cinematic mood. "
     + STYLE),
    ("rainy_konbini",
     "A 24-hour convenience store at night seen from outside in heavy rain, magenta neon sign glow, "
     "wet asphalt reflections, warm interior light spilling onto the street, no people visible inside. "
     + STYLE),
    ("cafe_window",
     "Rain-streaked cafe window from inside, a latte with foam art in the foreground steaming, "
     "blurred pink and purple bokeh of street lights through the wet glass at night, intimate mood. "
     + STYLE),
]


def post(prompt: str, retries: int = 3) -> str:
    payload = json.dumps({
        "query": "",
        "params": {"prompt": prompt, "user_id": USER_ID},
    }).encode("utf-8")
    req = urllib.request.Request(
        API_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    last_err = None
    for i in range(retries):
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=360) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            if data.get("code") == 200 and data.get("url"):
                return data["url"]
            if data.get("code") == 429:
                wait = 5 * (i + 1)
                print(f"  rate limited, retry in {wait}s...", flush=True)
                time.sleep(wait)
                continue
            raise RuntimeError(f"API returned: {data}")
        except Exception as e:
            last_err = e
            print(f"  attempt {i+1} failed: {e}", flush=True)
            time.sleep(5)
    raise RuntimeError(f"Exhausted retries: {last_err}")


def download(url: str, dest: str):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    })
    with urllib.request.urlopen(req, context=ctx, timeout=60) as resp:
        data = resp.read()
    with open(dest, "wb") as f:
        f.write(data)


def to_png(src_webp: str, dest_png: str):
    """Convert webp → png using macOS sips."""
    subprocess.run(
        ["sips", "-s", "format", "png", src_webp, "--out", dest_png],
        check=True, capture_output=True,
    )


def main():
    for name, prompt in PROMPTS:
        png_path = os.path.join(OUT_DIR, f"{name}.png")
        if os.path.exists(png_path):
            print(f"[skip] {name} already exists")
            continue
        print(f"[gen ] {name}: requesting...", flush=True)
        t0 = time.time()
        url = post(prompt)
        print(f"  → {url}  ({time.time()-t0:.1f}s)", flush=True)

        webp_path = os.path.join(OUT_DIR, f"{name}.webp")
        download(url, webp_path)
        try:
            to_png(webp_path, png_path)
            os.remove(webp_path)
        except subprocess.CalledProcessError:
            # webp may already be png-encoded; fall back to extension swap
            os.rename(webp_path, png_path)
        print(f"  saved → {png_path}", flush=True)

        # rate limit guard (1s/IP; sequential is safe but add buffer)
        time.sleep(3)

    print("DONE")


if __name__ == "__main__":
    sys.exit(main())
