import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "../lib/useReducedMotion";

/**
 * Abstract 3D echo of the real Progetto Build mark — three vertical
 * forms at the mark's own proportions (short / tall / angled-roof),
 * rendered as extruded brand geometry, not decorative furniture. Kept to
 * a handful of low-poly meshes for performance (UI/UX Pro Max: WebGL is
 * HIGH-cost, so scope it to a single hero canvas, cap DPR, and freeze
 * motion under prefers-reduced-motion).
 */
function BrandBars() {
  const group = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();

  const bars = useMemo(
    () => [
      { x: -1.35, h: 1.55, w: 0.26, rotZ: 0 },
      { x: -0.05, h: 2.6, w: 0.26, rotZ: 0.02 },
      { x: 1.3, h: 2.05, w: 0.26, rotZ: -0.18 },
    ],
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    if (!reduced) {
      group.current.rotation.y = Math.sin(t * 0.15) * 0.12;
      group.current.position.y = Math.sin(t * 0.4) * 0.06;
    }
    const targetX = reduced ? 0 : (state.pointer.x * 0.25);
    const targetY = reduced ? 0 : (state.pointer.y * 0.12);
    group.current.rotation.x += (targetY - group.current.rotation.x) * 0.04;
    group.current.rotation.z += (-targetX * 0.3 - group.current.rotation.z) * 0.04;
  });

  return (
    <group ref={group}>
      {bars.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2 - 1.2, 0]} rotation={[0, 0, b.rotZ]} castShadow>
          <boxGeometry args={[b.w, b.h, 0.26]} />
          <meshStandardMaterial
            color="#C9A24C"
            metalness={0.6}
            roughness={0.32}
            emissive="#3a2c0d"
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

function Particles() {
  const points = useRef<THREE.Points>(null);
  const reduced = useReducedMotion();
  const geometry = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!points.current || reduced) return;
    points.current.rotation.y = state.clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial color="#D9BC72" size={0.035} transparent opacity={0.55} />
    </points>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#fff3da" />
      <directionalLight position={[-4, -2, -3]} intensity={0.3} color="#C9A24C" />
    </>
  );
}

export function HeroScene({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 6.2], fov: 40 }}
      >
        <Suspense fallback={null}>
          <Lights />
          <BrandBars />
          <Particles />
        </Suspense>
      </Canvas>
    </div>
  );
}
