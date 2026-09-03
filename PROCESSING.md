# Asset processing pipeline

Raw client-uploaded files live in `assets_raw/` (the traced logo PNG and 15
JPEG composites — each composite is a designer-made "BEFORE & AFTER" split
of real jobsite/finished photography, some side-by-side, some stacked,
one as a 2x2 grid).

`scripts/process_assets.py` turns those composites into the individual
photographs the site actually uses, plus a logo asset kit. It never
touches pixels by hand — every crop boundary is a measured coordinate,
derived like this:

1. **Row/column pixel-variance profiling.** A composite's title banner and
   any solid-color divider are near-flat regions (low standard deviation
   across a row/column of pixels); the photograph itself is high-variance.
   Scanning row-wise std-dev top to bottom finds the banner→photo
   transition; scanning a narrow band of columns near the midpoint finds
   the thin white divider line separating BEFORE/AFTER panels.
2. Boundaries found this way were recorded once, by hand, into
   `scripts/crop_manifest.py` (a plain data file, not the analysis code),
   then verified visually by re-rendering each crop — three of them
   (`upstairs-lounge`, `kitchen`) turned out to have an extra white
   pillarbox margin baked into that composite's template, caught by
   inspecting each crop and tightened with a second content-bounds pass.
3. `process_assets.py` reads that manifest and, per project, crops BEFORE
   and AFTER out of the source composite (`lr` = side-by-side, `tb` =
   stacked, `grid` = 2x2), re-encodes each as a quality-86 progressive
   JPEG capped at 2200px on the long edge, and writes a tiny blurred
   base64 LQIP placeholder for perceived-performance loading.
4. The traced logo PNG is trimmed to its real alpha bounding box (no
   fabricated padding), split into an icon-only crop and a full lockup
   crop via the row-coverage gap between the glyph and the wordmark, and
   a dark-background variant is produced by an exact color-key swap of
   the near-black glyph fill and grey subtitle to white — the gold accent
   and every alpha value are left untouched.

Outputs:

- `public/images/renovations/<slug>/<n>-before.jpg` / `-after.jpg`
- `public/images/logo/mark-icon.png`, `lockup-full.png`,
  `lockup-full-white.png` (+ full-canvas variants)
- `src/data/renovations.generated.json` — dimensions + LQIP data URIs,
  consumed by `src/data/projects.ts`

Re-run after touching `assets_raw/` or `scripts/crop_manifest.py`:

```bash
python3 -m pip install --quiet Pillow numpy
python3 scripts/process_assets.py
```
