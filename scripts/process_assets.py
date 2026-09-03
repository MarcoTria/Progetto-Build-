#!/usr/bin/env python3
"""
Process raw PROGETTO BUILD assets into the site's image pipeline.

1. Crop each before/after composite in assets_raw/ into clean, single-purpose
   BEFORE and AFTER photographs using the measured boundaries in
   crop_manifest.py (no manual pixel-pushing in an image editor).
2. Re-encode each crop as an optimized JPEG plus a small blurred base64 LQIP
   placeholder (for perceived-performance / CLS-safe loading).
3. Produce brand-mark variants (light/dark) from the traced logo by exact
   color-key recoloring (no re-drawing / no fabrication).

Output layout:
  public/images/renovations/<slug>/<pair-index>-before.jpg
  public/images/renovations/<slug>/<pair-index>-after.jpg
  public/images/logo/progetto-build-mark.png   (as-uploaded)
  public/images/logo/progetto-build-mark-white.png (recolored for dark bg)
  src/data/renovations.generated.json          (dimensions + LQIP data-URIs)
"""
import json
import os
from PIL import Image, ImageFilter

from crop_manifest import MANIFEST

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "assets_raw")
OUT_IMG = os.path.join(ROOT, "public", "images", "renovations")
OUT_LOGO = os.path.join(ROOT, "public", "images", "logo")
OUT_DATA = os.path.join(ROOT, "src", "data")

JPEG_QUALITY = 86
MAX_W = 2200  # cap long-edge width; source photos are already web-scale


def save_optimized(img: Image.Image, path: str):
    img = img.convert("RGB")
    if img.width > MAX_W:
        ratio = MAX_W / img.width
        img = img.resize((MAX_W, round(img.height * ratio)), Image.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    return img.size


def make_lqip(img: Image.Image) -> str:
    """Tiny blurred base64 JPEG placeholder for instant paint while the
    full photo streams in (avoids layout shift + blank flash)."""
    small = img.copy()
    small.thumbnail((24, 24))
    small = small.filter(ImageFilter.GaussianBlur(2))
    import io
    import base64

    buf = io.BytesIO()
    small.convert("RGB").save(buf, "JPEG", quality=40)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


def crop_lr(im, spec):
    before = im.crop((0, spec["top"], spec["split_l"], spec["bottom"]))
    after = im.crop((spec["split_r"], spec["top"], im.width, spec["bottom"]))
    return before, after


def crop_tb(im, spec):
    left = spec.get("left", 0)
    right = spec.get("right", im.width)
    before = im.crop((left, spec["top"], right, spec["before_bottom"]))
    after = im.crop((left, spec["after_top"], right, spec["bottom"]))
    return before, after


def crop_grid(im, spec):
    l, r = spec["split_l"], spec["split_r"]
    if spec["quadrant"] == "left":
        before = im.crop((0, spec["top"], l, spec["mid_bottom"]))
        after = im.crop((0, spec["mid_top"], l, spec["bottom"]))
    else:
        before = im.crop((r, spec["top"], im.width, spec["mid_bottom"]))
        after = im.crop((r, spec["mid_top"], im.width, spec["bottom"]))
    return before, after


def _trim(im: Image.Image, box, pad=24):
    x0, y0, x1, y1 = box
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(im.width, x1 + pad)
    y1 = min(im.height, y1 + pad)
    return im.crop((x0, y0, x1, y1))


def _recolor_dark_to_white(im: Image.Image) -> Image.Image:
    """Recolor for dark backgrounds: exact color-key swap of the traced
    near-black glyph fill (11,11,11) and grey subtitle (82,81,78) to
    white/near-white, preserving the gold (201,162,76) accent and alpha
    exactly. This is a deterministic per-pixel recolor of the real traced
    artwork, not a redraw."""
    out = im.copy()
    px = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if r < 60 and g < 60 and b < 60:
                px[x, y] = (255, 255, 255, a)
            elif abs(r - 82) < 25 and abs(g - 81) < 25 and abs(b - 78) < 25:
                px[x, y] = (230, 228, 224, a)
    return out


def process_logo():
    import numpy as np

    src = os.path.join(RAW, "progetto_build_logo_traced.png")
    im = Image.open(src).convert("RGBA")
    os.makedirs(OUT_LOGO, exist_ok=True)

    arr = np.array(im)
    alpha = arr[:, :, 3]
    ys, xs = np.where(alpha > 10)
    full_box = (xs.min(), ys.min(), xs.max(), ys.max())

    # Row-coverage gap separates the building-mark glyph from the wordmark
    # block beneath it, so both can be exported as independent, correctly
    # cropped assets (full lockup vs. compact icon-only mark).
    row_has = (alpha > 10).any(axis=1)
    h = im.height
    transitions = [y for y in range(1, h) if row_has[y] != row_has[y - 1]]
    icon_bottom = transitions[1]  # end of the glyph block

    icon = _trim(im, (full_box[0], full_box[1], full_box[2], icon_bottom), pad=20)
    icon.save(os.path.join(OUT_LOGO, "mark-icon.png"))

    lockup = _trim(im, full_box, pad=24)
    lockup.save(os.path.join(OUT_LOGO, "lockup-full.png"))
    _recolor_dark_to_white(lockup).save(os.path.join(OUT_LOGO, "lockup-full-white.png"))

    # Full-canvas variants too (kept for reference / social previews).
    im.save(os.path.join(OUT_LOGO, "progetto-build-mark.png"))
    _recolor_dark_to_white(im).save(os.path.join(OUT_LOGO, "progetto-build-mark-white.png"))

    print(f"Logo processed -> icon {icon.size}, lockup {lockup.size}")


def main():
    data = {}
    for slug, project in MANIFEST.items():
        data[slug] = {"title": project["title"], "pairs": []}
        for idx, spec in enumerate(project["pairs"]):
            src_path = os.path.join(RAW, spec["src"])
            im = Image.open(src_path).convert("RGB")

            if spec["layout"] == "lr":
                before, after = crop_lr(im, spec)
            elif spec["layout"] == "tb":
                before, after = crop_tb(im, spec)
            elif spec["layout"] == "grid":
                before, after = crop_grid(im, spec)
            else:
                raise ValueError(f"unknown layout {spec['layout']}")

            out_dir = os.path.join(OUT_IMG, slug)
            before_path = os.path.join(out_dir, f"{idx}-before.jpg")
            after_path = os.path.join(out_dir, f"{idx}-after.jpg")

            bw, bh = save_optimized(before, before_path)
            aw, ah = save_optimized(after, after_path)

            data[slug]["pairs"].append({
                "label": spec.get("label"),
                "before": f"/images/renovations/{slug}/{idx}-before.jpg",
                "after": f"/images/renovations/{slug}/{idx}-after.jpg",
                "beforeDim": [bw, bh],
                "afterDim": [aw, ah],
                "beforeLQIP": make_lqip(before),
                "afterLQIP": make_lqip(after),
            })
            print(f"{slug}[{idx}]: before {bw}x{bh}  after {aw}x{ah}")

    process_logo()

    os.makedirs(OUT_DATA, exist_ok=True)
    with open(os.path.join(OUT_DATA, "renovations.generated.json"), "w") as f:
        json.dump(data, f, indent=2)
    print(f"\nWrote {os.path.join(OUT_DATA, 'renovations.generated.json')}")


if __name__ == "__main__":
    main()
