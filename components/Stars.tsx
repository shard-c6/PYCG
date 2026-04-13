'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Multi-layer starfield with depth parallax, varied sizes, and subtle twinkling.
 * - Layer 1 (near): Fewer, larger, brighter stars that move more with camera
 * - Layer 2 (mid): Medium density, medium size
 * - Layer 3 (far): Dense, tiny, dim stars that barely move — gives depth
 */

interface StarLayerProps {
  count: number;
  radiusMin: number;
  radiusMax: number;
  size: number;
  color: string;
  opacity: number;
  rotationSpeed: number;
  twinkle?: boolean;
}

function StarLayer({ count, radiusMin, radiusMax, size, color, opacity, rotationSpeed, twinkle }: StarLayerProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { camera } = useThree();

  const { geometry, baseOpacities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const opacities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = radiusMin + Math.random() * (radiusMax - radiusMin);
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Vary sizes slightly for a natural feel
      sizes[i] = size * (0.5 + Math.random());
      opacities[i] = opacity * (0.4 + Math.random() * 0.6);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { geometry: geo, baseOpacities: opacities };
  }, [count, radiusMin, radiusMax, size, opacity]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color,
      size,
      transparent: true,
      opacity,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [color, size, opacity]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    // Slow rotation for ambient movement
    pointsRef.current.rotation.y += rotationSpeed;
    pointsRef.current.rotation.x += rotationSpeed * 0.3;

    // Parallax: shift layer slightly based on camera position for depth feel
    const camPos = camera.position;
    const parallaxStrength = rotationSpeed * 800;
    pointsRef.current.position.x = -camPos.x * parallaxStrength;
    pointsRef.current.position.y = -camPos.y * parallaxStrength;

    // Twinkling effect — modulate opacity over time
    if (twinkle && material) {
      const t = state.clock.elapsedTime;
      material.opacity = opacity * (0.7 + 0.3 * Math.sin(t * 0.5 + rotationSpeed * 10000));
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
}

export default function Stars() {
  return (
    <group>
      {/* Far field — dense tiny stars, barely move */}
      <StarLayer
        count={3000}
        radiusMin={18}
        radiusMax={35}
        size={0.025}
        color="#8899bb"
        opacity={0.35}
        rotationSpeed={0.00005}
      />

      {/* Mid field — medium stars with subtle twinkle */}
      <StarLayer
        count={1200}
        radiusMin={12}
        radiusMax={22}
        size={0.055}
        color="#b0c4de"
        opacity={0.5}
        rotationSpeed={0.00015}
        twinkle
      />

      {/* Near field — fewer bright stars, move more with camera */}
      <StarLayer
        count={400}
        radiusMin={8}
        radiusMax={14}
        size={0.1}
        color="#dde4f0"
        opacity={0.7}
        rotationSpeed={0.0004}
        twinkle
      />
    </group>
  );
}
