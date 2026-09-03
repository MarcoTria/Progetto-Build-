/**
 * Multiplane camera math for the cinematic journey scenes.
 *
 * A real "camera dolly through a photograph" needs each depth band
 * placed at a different Z, sized so that — at the camera's rest
 * position — every band still reconstructs the exact screen-space
 * rectangle its crop belongs to (no gaps, no seams). As the camera then
 * physically moves in Z, ordinary perspective projection makes nearer
 * bands grow/shift faster than farther ones: real parallax, computed
 * from real photographic content, not a simulated effect.
 */

export const VERTICAL_FOV_DEG = 32;

export function fovRadians(deg = VERTICAL_FOV_DEG): number {
  return (deg * Math.PI) / 180;
}

/** Full-frame visible height, in world units, of a plane at `z` for a
 * camera positioned at `camZ` looking down -Z. */
export function visibleHeightAt(z: number, camZ: number, fovDeg = VERTICAL_FOV_DEG): number {
  return 2 * (camZ - z) * Math.tan(fovRadians(fovDeg) / 2);
}

export type BandPlacement = { width: number; height: number; y: number };

/**
 * Computes the world width/height/Y-position a band mesh needs at `z`
 * so it exactly covers its intended screen fraction — evaluated against
 * the camera's REST position (restCamZ), not its currently-animated
 * position. Once placed, moving the camera alone produces correct
 * parallax; the geometry itself never needs to be recomputed per frame.
 */
export function bandPlacement(
  z: number,
  centerFrac: number, // 0 (top of frame) .. 1 (bottom of frame)
  heightFrac: number, // fraction of full frame height this band covers
  aspect: number, // frame width / height
  restCamZ: number,
  fovDeg = VERTICAL_FOV_DEG,
): BandPlacement {
  const fullHeight = visibleHeightAt(z, restCamZ, fovDeg);
  const height = fullHeight * heightFrac;
  const width = fullHeight * aspect;
  const y = (0.5 - centerFrac) * fullHeight;
  return { width, height, y };
}

/** Piecewise-linear interpolation through control points, sorted by x.
 * Used to keyframe camera Z / opacities against scroll progress (0..1)
 * without a second, competing animation system inside the R3F scene. */
export function piecewise(t: number, points: Array<[number, number]>): number {
  const clamped = Math.min(1, Math.max(0, t));
  if (clamped <= points[0][0]) return points[0][1];
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    if (clamped >= x0 && clamped <= x1) {
      const f = x1 === x0 ? 0 : (clamped - x0) / (x1 - x0);
      return y0 + (y1 - y0) * f;
    }
  }
  return points[points.length - 1][1];
}
