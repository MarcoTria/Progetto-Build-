import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { DepthBand } from "./DepthBand";
import { piecewise, VERTICAL_FOV_DEG } from "../../lib/depthMath";
import type { CinematicPair } from "../../data/cinematic";

const REST_CAM_Z = 5;

// Real-world depth spread for each cluster (spec §09): a close
// foreground surface, the room itself, and the far background —
// derived from the actual band crops, not arbitrary.
const BEFORE_Z = { bg: -2.5, mid: -1, fg: 0.5 };
// The AFTER cluster sits deeper in the same tunnel; the camera dollies
// straight through from one to the other (spec §06 phase D: "the camera
// moves THROUGH a spatial transition", not a fade in place).
const Z_SHIFT = -9;
const AFTER_Z = { bg: BEFORE_Z.bg + Z_SHIFT, mid: BEFORE_Z.mid + Z_SHIFT, fg: BEFORE_Z.fg + Z_SHIFT };

// Camera Z as a function of scroll progress (piecewise-linear keyframes —
// see CinematicJourney.tsx doc comment for the phase-by-phase reasoning).
const CAMERA_Z: Array<[number, number]> = [
  [0, REST_CAM_Z],
  [0.12, 4.2],
  [0.38, -1.2],
  [0.46, -4.2],
  [0.52, -6.0],
  [0.6, -7.3],
  [0.78, -8.9],
  [1, -4.5],
];

const BEFORE_OPACITY: Array<[number, number]> = [
  [0, 1],
  [0.34, 1],
  [0.46, 0],
  [1, 0],
];

const AFTER_OPACITY: Array<[number, number]> = [
  [0, 0],
  [0.54, 0],
  [0.66, 1],
  [1, 1],
];

const MASK_OPACITY: Array<[number, number]> = [
  [0, 0],
  [0.36, 0],
  [0.46, 0.92],
  [0.54, 0.92],
  [0.66, 0],
  [1, 0],
];

function Rig({
  progressRef,
  reduced,
  pair,
  aspect,
}: {
  progressRef: React.MutableRefObject<number>;
  reduced: boolean;
  pair: CinematicPair;
  aspect: number;
}) {
  const { camera } = useThree();
  const beforeOpacity = useRef(1);
  const afterOpacity = useRef(0);
  const maskRef = useRef<THREE.Mesh>(null);
  const maskMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const t = progressRef.current;
    const camZ = piecewise(t, CAMERA_Z);
    beforeOpacity.current = piecewise(t, BEFORE_OPACITY);
    afterOpacity.current = piecewise(t, AFTER_OPACITY);
    const maskOpacity = piecewise(t, MASK_OPACITY);

    // Subtle handheld sway (spec §11/06: "subtle lens-like movement") —
    // idle-time based, tiny amplitude, skipped entirely under reduced
    // motion.
    const sway = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.35) * 0.028;
    camera.position.set(sway, sway * 0.6, camZ);
    camera.lookAt(0, 0, camZ - 1);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = VERTICAL_FOV_DEG;
      camera.updateProjectionMatrix();
    }

    // Dark architectural mask "passing across the camera" during the
    // spatial transition (spec §06 phase D) — a plane attached to the
    // camera so it always fills the frame regardless of camera motion.
    if (maskRef.current && maskMatRef.current) {
      const dist = 0.35;
      maskRef.current.position.set(0, 0, camZ - dist);
      const h = 2 * dist * Math.tan((VERTICAL_FOV_DEG * Math.PI) / 360) * 1.15;
      maskRef.current.scale.set(h * aspect, h, 1);
      maskMatRef.current.opacity = maskOpacity;
      maskRef.current.visible = maskOpacity > 0.003;
    }
  });

  return (
    <>
      {(["bg", "mid", "fg"] as const).map((k) => (
        <DepthBand
          key={`before-${k}`}
          band={pair.before.bands[k]}
          z={BEFORE_Z[k]}
          aspect={aspect}
          restCamZ={REST_CAM_Z}
          opacityRef={beforeOpacity}
        />
      ))}
      {(["bg", "mid", "fg"] as const).map((k) => (
        <DepthBand
          key={`after-${k}`}
          band={pair.after.bands[k]}
          z={AFTER_Z[k]}
          aspect={aspect}
          restCamZ={REST_CAM_Z}
          opacityRef={afterOpacity}
        />
      ))}
      <mesh ref={maskRef}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial ref={maskMatRef} color="#050403" transparent depthWrite={false} />
      </mesh>
    </>
  );
}

type Props = {
  pair: CinematicPair;
  aspect: number;
  progressRef: React.MutableRefObject<number>;
  reduced: boolean;
};

/**
 * Full cinematic camera-journey WebGL scene. Runs its own RAF loop
 * (frameloop="always") only while mounted — the parent
 * (CinematicJourney) mounts this exclusively when the section is near
 * the viewport and unmounts it otherwise, which is what actually keeps
 * multiple flagship scenes from ever running simultaneously (spec §25).
 */
export function CinematicScene({ pair, aspect, progressRef, reduced }: Props) {
  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, REST_CAM_Z], fov: VERTICAL_FOV_DEG, near: 0.1, far: 40 }}
    >
      <Suspense fallback={null}>
        <Rig progressRef={progressRef} reduced={reduced} pair={pair} aspect={aspect} />
      </Suspense>
    </Canvas>
  );
}
