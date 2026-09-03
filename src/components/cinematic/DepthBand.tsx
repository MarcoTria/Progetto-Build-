import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { bandPlacement, VERTICAL_FOV_DEG } from "../../lib/depthMath";
import type { Band } from "../../data/cinematic";

type Props = {
  band: Band;
  z: number;
  aspect: number;
  restCamZ: number;
  /** 0..1, read fresh every frame — avoids a second animation system
   * fighting the scroll-driven one for control of this mesh. */
  opacityRef: React.MutableRefObject<number>;
};

/**
 * One real photographic depth band, placed in 3D so it reconstructs its
 * exact screen-space slice of the source photo at the camera's rest
 * position (see lib/depthMath.ts). Exposes its material via a ref so the
 * parent scene can drive opacity/visibility from the single scroll
 * progress value, without a second animation system.
 *
 * No manual texture.dispose() here on purpose: drei's useTexture caches
 * by URL, and a user scrolling away and back re-mounts this exact
 * component with the same URL — disposing the cached GPU texture would
 * break that remount. The real cost control (spec §25) is one level up:
 * CinematicJourney mounts the whole CinematicScene (all 6 bands) only
 * near the viewport and unmounts it otherwise, so at most one journey's
 * textures (~6 small crops) are ever resident at once, and the
 * WebGLRenderer context itself is torn down with the Canvas.
 */
export const DepthBand = ({ band, z, aspect, restCamZ, opacityRef }: Props) => {
  const texture = useTexture(band.src);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  const placement = useMemo(
    () => bandPlacement(z, band.centerFrac, band.heightFrac, aspect, restCamZ, VERTICAL_FOV_DEG),
    [z, band.centerFrac, band.heightFrac, aspect, restCamZ],
  );

  useFrame(() => {
    const o = opacityRef.current;
    if (matRef.current) matRef.current.opacity = o;
    if (meshRef.current) meshRef.current.visible = o > 0.003;
  });

  return (
    <mesh ref={meshRef} position={[0, placement.y, z]}>
      <planeGeometry args={[placement.width, placement.height]} />
      <meshBasicMaterial
        ref={matRef}
        map={texture}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
};
