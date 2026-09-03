import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

type Props = {
  before: string;
  after: string;
  progressRef: React.MutableRefObject<number>;
  invalidateRef: React.MutableRefObject<(() => void) | null>;
};

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Standard background-size:cover UV remap so each real photo fills the
// plane without distortion, regardless of its native aspect ratio.
const FRAGMENT = /* glsl */ `
  uniform sampler2D uBefore;
  uniform sampler2D uAfter;
  uniform vec2 uBeforeSize;
  uniform vec2 uAfterSize;
  uniform vec2 uPlaneSize;
  uniform float uProgress;
  uniform vec3 uSeamColor;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv, vec2 texSize, vec2 planeSize) {
    float rs = planeSize.x / planeSize.y;
    float ri = texSize.x / texSize.y;
    vec2 newSize = rs < ri ? vec2(texSize.x * planeSize.y / texSize.y, planeSize.y)
                           : vec2(planeSize.x, texSize.y * planeSize.x / texSize.x);
    vec2 offset = (rs < ri ? vec2((newSize.x - planeSize.x) * 0.5, 0.0)
                           : vec2(0.0, (newSize.y - planeSize.y) * 0.5)) / newSize;
    return uv * planeSize / newSize + offset;
  }

  void main() {
    float p = clamp(uProgress, 0.0, 1.0);

    // Subtle physical drift as each photo is wiped away/settles in —
    // real photography, not a plain opacity crossfade.
    vec2 beforeUv = coverUv(vUv, uBeforeSize, uPlaneSize) + vec2(-0.035 * p, 0.0);
    vec2 afterUv = coverUv(vUv, uAfterSize, uPlaneSize) + vec2(0.03 * (1.0 - p), 0.0);

    vec4 beforeColor = texture2D(uBefore, beforeUv);
    vec4 afterColor = texture2D(uAfter, afterUv);

    // Soft directional wipe sweeping right-to-left as the AFTER space
    // enters from the right (spec: "AFTER architectural background
    // begins entering from the RIGHT").
    float edge = mix(1.15, -0.15, p);
    float wipe = smoothstep(edge - 0.16, edge + 0.16, vUv.x);
    vec3 color = mix(afterColor.rgb, beforeColor.rgb, wipe);

    // Thin warm seam glow at the transition edge for a cinematic feel.
    float seam = 1.0 - smoothstep(0.0, 0.05, abs(vUv.x - edge));
    color += uSeamColor * seam * 0.35;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function Scene({ before, after, progressRef, invalidateRef }: Props) {
  const [beforeTex, afterTex] = useTexture([before, after]);
  const { viewport, invalidate, gl } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    [beforeTex, afterTex].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.needsUpdate = true;
    });
  }, [beforeTex, afterTex, gl]);

  useEffect(() => {
    invalidateRef.current = invalidate;
    invalidate();
    return () => {
      invalidateRef.current = null;
    };
  }, [invalidate, invalidateRef]);

  useFrame(() => {
    if (matRef.current) {
      matRef.current.uniforms.uProgress.value = progressRef.current;
      matRef.current.uniforms.uPlaneSize.value.set(viewport.width, viewport.height);
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={{
          uBefore: { value: beforeTex },
          uAfter: { value: afterTex },
          uBeforeSize: { value: new THREE.Vector2(beforeTex.image.width, beforeTex.image.height) },
          uAfterSize: { value: new THREE.Vector2(afterTex.image.width, afterTex.image.height) },
          uPlaneSize: { value: new THREE.Vector2(viewport.width, viewport.height) },
          uProgress: { value: 0 },
          uSeamColor: { value: new THREE.Color("#cdbb9c") },
        }}
      />
    </mesh>
  );
}

/** Full-bleed WebGL photo-transition plane (see TransformationScene docs
 * for why this is the one place Three.js is used for the transformation
 * itself). Renders on demand only — the Canvas never runs its own clock
 * loop; a frame is produced only when the scroll-driven progress changes. */
export default function WebGLPlane(props: Props) {
  return (
    <Canvas
      className="absolute inset-0"
      frameloop="demand"
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
