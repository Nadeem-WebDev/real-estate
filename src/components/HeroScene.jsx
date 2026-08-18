import { useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Faceted glass solid. Refraction is driven by a locally generated environment
 * (see Lightformers below) so nothing is fetched at runtime.
 */
function GlassForm() {
  const mesh = useRef();

  useFrame((state, delta) => {
    if (!mesh.current) return;
    // Deliberately slow — roughly one revolution every 90 seconds.
    mesh.current.rotation.y += delta * 0.07;
    mesh.current.rotation.x += delta * 0.025;
    // Near-imperceptible drift tied to pointer position.
    mesh.current.position.x = THREE.MathUtils.lerp(
      mesh.current.position.x,
      state.pointer.x * 0.22,
      0.02
    );
    mesh.current.position.y = THREE.MathUtils.lerp(
      mesh.current.position.y,
      state.pointer.y * 0.14,
      0.02
    );
  });

  return (
    <Float speed={0.6} rotationIntensity={0.15} floatIntensity={0.4}>
      <mesh ref={mesh} scale={1.65}>
        <icosahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          transmission={0.96}
          thickness={1.4}
          roughness={0.12}
          ior={1.7}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.1}
          iridescence={0.35}
          iridescenceIOR={1.3}
          attenuationColor={new THREE.Color('#d4af37')}
          attenuationDistance={2.4}
          color={new THREE.Color('#ffffff')}
        />
      </mesh>
    </Float>
  );
}

/** Slow-drifting dust motes. Positions are generated once and reused. */
function ParticleField({ count = 340 }) {
  const points = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 13;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.014;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#f1e5c8"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      // Canvas is decorative; screen readers should skip it entirely.
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 5, 3]} intensity={1.1} color="#f1e5c8" />
        <directionalLight position={[-5, -2, -4]} intensity={0.5} color="#d4af37" />

        <GlassForm />
        <ParticleField />

        {/* Lightformers build the reflection map in-scene — no HDRI download,
            which keeps the glass reading correctly offline and on first paint. */}
        <Environment resolution={256}>
          <Lightformer
            intensity={2.6}
            color="#f1e5c8"
            position={[0, 4, -6]}
            scale={[10, 4, 1]}
          />
          <Lightformer
            intensity={1.8}
            color="#d4af37"
            position={[-5, 1, -2]}
            scale={[6, 6, 1]}
          />
          <Lightformer
            intensity={1.1}
            color="#3a3a44"
            position={[5, -2, 2]}
            scale={[8, 8, 1]}
          />
        </Environment>
      </Suspense>
    </Canvas>
  );
}
