#!/usr/bin/env python3
"""
Generates real-photograph depth bands for the cinematic "camera journey"
flagship projects, from the already-processed before/after crops in
public/images/renovations/. Extends the existing asset pipeline
(process_assets.py / crop_manifest.py) rather than replacing it.

Why bands, not fabricated objects: no per-object photo segmentation
exists in the source material. A horizontal band crop is still 100% real
photographic content — it is simply "this photo, cropped a second time"
— so it satisfies the "no invented furniture/geometry" rule while giving
the WebGL scene genuine near/mid/far layers to move at different rates
during the camera dolly.

Band boundaries are fractions of the source image height, with generous
overlap so no seam is visible where one band's real content ends and the
next begins:
  bg  (far / ceiling, sky, back wall):     0%  -> 42%
  mid (room content):                      30% -> 74%
  fg  (nearest surface / floor / deck):    62% -> 100%

Each band is written as its own JPEG, and its exact height-fraction +
vertical-center-fraction (needed by the WebGL multiplane camera math) is
recorded in src/data/depth-bands.generated.json.
"""
import json
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RENO_DIR = os.path.join(ROOT, "public", "images", "renovations")
OUT_DATA = os.path.join(ROOT, "src", "data", "depth-bands.generated.json")

JPEG_QUALITY = 90

BANDS = {
    "bg": (0.0, 0.42),
    "mid": (0.30, 0.74),
    "fg": (0.62, 1.0),
}

# The three flagship projects chosen for the cinematic camera journey —
# selected for: consistent before/after camera position (essential for
# believable parallax), strong photographic depth structure (clear
# foreground/mid/background separation), and the most dramatic visual
# transformation. See src/data/projects.ts CINEMATIC_SLUGS.
FLAGSHIPS = ["main-entryway", "backyard-pool", "game-room"]


def crop_band(im: Image.Image, y0f: float, y1f: float) -> Image.Image:
    w, h = im.size
    return im.crop((0, round(h * y0f), w, round(h * y1f)))


def main():
    data = {}
    for slug in FLAGSHIPS:
        src_dir = os.path.join(RENO_DIR, slug)
        out_dir = os.path.join(src_dir, "depth")
        os.makedirs(out_dir, exist_ok=True)
        data[slug] = {}

        for side in ("before", "after"):
            src_path = os.path.join(src_dir, f"0-{side}.jpg")
            im = Image.open(src_path).convert("RGB")
            w, h = im.size
            data[slug][side] = {"sourceDim": [w, h], "bands": {}}

            for name, (y0f, y1f) in BANDS.items():
                band = crop_band(im, y0f, y1f)
                out_path = os.path.join(out_dir, f"{side}-{name}.jpg")
                band.save(out_path, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
                data[slug][side]["bands"][name] = {
                    "src": f"/images/renovations/{slug}/depth/{side}-{name}.jpg",
                    "yStart": y0f,
                    "yEnd": y1f,
                    "heightFrac": y1f - y0f,
                    "centerFrac": (y0f + y1f) / 2,
                    "dim": list(band.size),
                }
                print(f"{slug}/{side}-{name}: {band.size}")

    os.makedirs(os.path.dirname(OUT_DATA), exist_ok=True)
    with open(OUT_DATA, "w") as f:
        json.dump(data, f, indent=2)
    print(f"\nWrote {OUT_DATA}")


if __name__ == "__main__":
    main()
